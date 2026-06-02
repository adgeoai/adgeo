const DEFAULT_OPENAI_BASE_URL = 'https://api.openai.com/v1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/generate') {
      if (request.method === 'OPTIONS') return new Response(null, { headers: corsHeaders });
      if (request.method !== 'POST') {
        return jsonResponse({ ok: false, error: 'Method not allowed.' }, 405);
      }
      return handleGenerate(request, env);
    }

    if (url.pathname === '/api/health') {
      return jsonResponse({
        ok: true,
        hasOpenAIKey: Boolean(env.OPENAI_API_KEY),
        model: env.OPENAI_MODEL || 'gpt-4.1-mini',
        baseUrl: env.OPENAI_BASE_URL || DEFAULT_OPENAI_BASE_URL,
      });
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleGenerate(request, env) {
  try {
    const apiKey = env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonResponse(
        {
          ok: false,
          error: 'Missing OPENAI_API_KEY. Please add it in Cloudflare Workers settings.',
        },
        500
      );
    }

    const payload = await request.json();
    const brief = normalizeBrief(payload);
    const websiteText = await fetchWebsiteText(brief.website);
    const report = await generateReport({ brief, websiteText, apiKey, env });

    return jsonResponse({ ok: true, report });
  } catch (error) {
    return jsonResponse({ ok: false, error: error.message || 'Failed to generate report.' }, 500);
  }
}

function normalizeBrief(payload) {
  const website = String(payload.website || '').trim();
  if (!/^https?:\/\/[^\s/$.?#].[^\s]*$/i.test(website)) {
    throw new Error('请提交有效的网站 URL，例如 https://example.com');
  }

  return {
    website,
    country: String(payload.country || '美国'),
    platform: String(payload.platform || 'TikTok'),
    industry: String(payload.industry || '独立站/DTC'),
    budget: String(payload.budget || '待确认'),
    painPoints: Array.isArray(payload.painPoints) ? payload.painPoints.map(String) : [],
    contact: String(payload.contact || ''),
    notes: String(payload.notes || ''),
  };
}

async function fetchWebsiteText(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: { 'User-Agent': 'AdGEO-AI-Diagnostic-Bot/0.1' },
    });

    if (!response.ok) {
      return `网站抓取失败，HTTP 状态码：${response.status}。请基于客户提交信息生成初版报告，并提示需要人工补充页面内容。`;
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('text/plain')) {
      return `网站返回内容类型为 ${contentType}，不适合直接解析。请基于客户提交信息生成初版报告，并提示需要补充页面截图或文本。`;
    }

    const html = await response.text();
    return htmlToText(html).slice(0, 18000);
  } catch (error) {
    return `网站抓取失败：${error.message}。请基于客户提交信息生成初版报告，并提示需要人工补充页面内容。`;
  } finally {
    clearTimeout(timeout);
  }
}

function htmlToText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

async function generateReport({ brief, websiteText, apiKey, env }) {
  const model = env.OPENAI_MODEL || 'gpt-4.1-mini';
  const baseUrl = (env.OPENAI_BASE_URL || DEFAULT_OPENAI_BASE_URL).replace(/\/$/, '');
  const response = await fetch(`${baseUrl}/responses`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      input: buildPrompt(brief, websiteText),
      max_output_tokens: 12000,
    }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error?.message || 'OpenAI API request failed.');
  }

  return parseJsonReport(extractText(data));
}

function extractText(data) {
  if (data.output_text) return data.output_text;

  const chunks = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === 'output_text' && content.text) chunks.push(content.text);
    }
  }
  return chunks.join('\n').trim();
}

function parseJsonReport(text) {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) {
    throw new Error('AI 返回内容不是有效 JSON，请重试。');
  }
  return JSON.parse(text.slice(start, end + 1));
}

function buildPrompt(brief, websiteText) {
  return `
你是一个“AI海外增长投放专家系统”，服务对象是独立站、海外游戏、App、SaaS、跨境电商和出海企业。你必须基于客户提交的网站和需求，直接产出可交付的增长报告，而不是解释你会怎么做。

合规边界：
- 可以提供广告政策风险检查、拒审原因分析、落地页合规建议、账户结构建议、申诉文案辅助。
- 不得提供绕过平台风控、买卖黑户、伪装主体、规避审核、欺诈性开户等建议。
- 如果客户行业可能涉及博彩、金融、成人、加密、医疗、保健品、真钱游戏或高风险游戏机制，必须提示需要牌照、地区限制和平台政策确认。

客户需求：
${JSON.stringify(brief, null, 2)}

网站抓取文本：
${websiteText}

请只返回一个 JSON 对象，不要 Markdown，不要解释。JSON 结构必须完全如下：
{
  "summary": {
    "productPositioning": "一句话定位",
    "targetMarket": "目标市场总结",
    "priority": "优先执行建议",
    "riskLevel": "低/中/高"
  },
  "productAnalysis": {
    "productType": "产品类型",
    "coreSellingPoints": ["卖点1", "卖点2", "卖点3"],
    "targetUsers": ["用户画像1", "用户画像2", "用户画像3"],
    "purchaseMotivations": ["动机1", "动机2", "动机3"],
    "conversionProblems": ["问题1", "问题2", "问题3"]
  },
  "localization": {
    "country": "目标国家",
    "userHabits": ["习惯1", "习惯2", "习惯3"],
    "preferredTone": ["表达风格1", "表达风格2"],
    "visualDirection": ["视觉方向1", "视觉方向2", "视觉方向3"],
    "avoid": ["避免事项1", "避免事项2", "避免事项3"]
  },
  "adStrategy": {
    "platform": "投放平台",
    "angles": [
      {"name": "角度名称", "message": "核心信息", "bestFor": "适合人群"},
      {"name": "角度名称", "message": "核心信息", "bestFor": "适合人群"},
      {"name": "角度名称", "message": "核心信息", "bestFor": "适合人群"}
    ],
    "adCopies": [
      {"title": "标题", "body": "主文案", "cta": "CTA", "angle": "角度"},
      {"title": "标题", "body": "主文案", "cta": "CTA", "angle": "角度"},
      {"title": "标题", "body": "主文案", "cta": "CTA", "angle": "角度"},
      {"title": "标题", "body": "主文案", "cta": "CTA", "angle": "角度"},
      {"title": "标题", "body": "主文案", "cta": "CTA", "angle": "角度"}
    ],
    "creativeDirections": [
      {"name": "素材方向", "imagePrompt": "图片生成/设计提示词", "headline": "画面标题", "note": "执行说明"},
      {"name": "素材方向", "imagePrompt": "图片生成/设计提示词", "headline": "画面标题", "note": "执行说明"},
      {"name": "素材方向", "imagePrompt": "图片生成/设计提示词", "headline": "画面标题", "note": "执行说明"}
    ]
  },
  "videoScripts": [
    {"name": "脚本名称", "duration": "20-30秒", "hook": "前三秒钩子", "scenes": ["0-3秒画面", "4-8秒画面", "9-15秒画面", "16-25秒画面", "26-30秒画面"], "voiceover": "完整口播文案", "captions": ["字幕1", "字幕2", "字幕3"], "cta": "行动号召"},
    {"name": "脚本名称", "duration": "20-30秒", "hook": "前三秒钩子", "scenes": ["0-3秒画面", "4-8秒画面", "9-15秒画面", "16-25秒画面", "26-30秒画面"], "voiceover": "完整口播文案", "captions": ["字幕1", "字幕2", "字幕3"], "cta": "行动号召"}
  ],
  "compliance": {
    "riskLevel": "低/中/高",
    "risks": ["风险1", "风险2", "风险3"],
    "unsafeClaims": ["不建议表达1", "不建议表达2"],
    "safeAlternatives": ["替代表达1", "替代表达2"],
    "accountAdvice": ["账户结构建议1", "账户结构建议2", "账户结构建议3"]
  },
  "landingPage": {
    "aboveFold": ["首屏建议1", "首屏建议2"],
    "trustSignals": ["信任建议1", "信任建议2"],
    "cta": ["CTA建议1", "CTA建议2"],
    "mobile": ["移动端建议1", "移动端建议2"]
  },
  "seo": {
    "keywords": ["关键词1", "关键词2", "关键词3", "关键词4", "关键词5"],
    "title": "SEO Title 建议",
    "metaDescription": "Meta Description 建议",
    "contentTopics": ["选题1", "选题2", "选题3", "选题4", "选题5"],
    "technicalFixes": ["技术建议1", "技术建议2", "技术建议3"]
  },
  "geo": {
    "entityDefinition": "AI搜索可识别的品牌实体定义",
    "faq": ["FAQ1", "FAQ2", "FAQ3", "FAQ4", "FAQ5"],
    "comparisonPages": ["对比页1", "对比页2", "对比页3"],
    "schema": ["Organization", "Product", "FAQPage"],
    "citationSources": ["建议引用源1", "建议引用源2", "建议引用源3"]
  },
  "nextSteps": ["下一步1", "下一步2", "下一步3", "下一步4", "下一步5"]
}
`;
}

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json;charset=utf-8' },
  });
}
