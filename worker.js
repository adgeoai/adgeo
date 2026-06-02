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
    const payload = await request.json();
    const runtimeConfig = normalizeRuntimeConfig(payload.runtimeConfig || {});
    const apiKey = runtimeConfig.apiKey || env.OPENAI_API_KEY;
    if (!apiKey) {
      return jsonResponse(
        {
          ok: false,
          error: 'Missing OPENAI_API_KEY. Please add it in Cloudflare Workers settings.',
        },
        500
      );
    }

    const brief = normalizeBrief(payload);
    const websiteText = await fetchWebsiteText(brief.website);
    const report = await generateReport({ brief, websiteText, apiKey, env, runtimeConfig });

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
    outputLanguage: String(payload.outputLanguage || 'Chinese'),
    serviceType: String(payload.serviceType || 'SEO/GEO 全域优化'),
    country: String(payload.country || '美国'),
    platform: String(payload.platform || 'TikTok'),
    seoWorkScope: String(payload.seoWorkScope || ''),
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

function normalizeRuntimeConfig(config) {
  return {
    apiKey: String(config.apiKey || '').trim(),
    model: String(config.model || '').trim(),
    baseUrl: String(config.baseUrl || '').trim(),
  };
}

async function generateReport({ brief, websiteText, apiKey, env, runtimeConfig }) {
  const model = runtimeConfig.model || env.OPENAI_MODEL || 'gpt-4.1-mini';
  const baseUrl = (runtimeConfig.baseUrl || env.OPENAI_BASE_URL || DEFAULT_OPENAI_BASE_URL).replace(/\/$/, '');
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
你是一个“AI 全域 SEO/GEO 优化专家系统”，服务对象是独立站、海外游戏、App、SaaS、跨境电商和出海企业。

当前第一版产品只做 SEO/GEO 全域诊断与优化，不做广告投放，不做广告素材。

SEO/GEO 套餐：
- 599 美金：季度套餐，3个月，每月一次 AI 平台收录审核和优化，USDT 优先。
- 1100 美金：半年套餐，6个月，每月一次 AI 平台收录审核和优化，USDT 优先。
- 2000 美金：全年套餐，12个月，每月一次 AI 平台收录审核和优化，USDT 优先。

SEO/GEO 的工作范围是：全域评分、技术 SEO、页面结构、内容优化、GEO 品牌实体、FAQ、Schema、llms.txt、内容日历、AI 平台收录审核。

报告口径：
- 不要只给“建议”，必须写成“我们会如何帮客户解决”。
- 每个关键问题都要包含：客户当前问题、业务影响、我们会做的修复动作、付款后交付物、客户需要确认的事项。
- 扫描阶段先展示问题和解决路径；完整可复制优化稿属于付款后交付。
- 不要输出广告投放策略、广告文案、短视频脚本或广告账户建议。

语言要求：
- 如果 outputLanguage 是 English，所有 JSON 字段值必须使用英文。
- 如果 outputLanguage 是 Chinese，所有 JSON 字段值必须使用中文。

你必须基于客户提交的网站和需求，产出 SEO/GEO 问题诊断和解决方案。重点不是“建议客户做”，而是“我们会如何给客户解决”。

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
  "seoGeoAudit": {
    "packageName": "SEO/GEO 全域优化包",
    "price": "$599 USDT",
    "selectedPlan": "客户选择的套餐或服务板块",
    "monthlyReview": "每月一次 AI 平台收录审核和优化，适用于 SEO/GEO 周期套餐",
    "scores": {
      "overall": 0,
      "seo": 0,
      "geo": 0,
      "technical": 0,
      "content": 0,
      "authority": 0
    },
    "issues": [
      {"area": "SEO/GEO/技术/内容/可信度", "problem": "客户当前具体问题", "impact": "业务影响", "solution": "我们会如何解决", "deliverable": "付款后交付物", "clientReview": "客户需要确认的事项", "priority": "高/中/低"},
      {"area": "SEO/GEO/技术/内容/可信度", "problem": "客户当前具体问题", "impact": "业务影响", "solution": "我们会如何解决", "deliverable": "付款后交付物", "clientReview": "客户需要确认的事项", "priority": "高/中/低"},
      {"area": "SEO/GEO/技术/内容/可信度", "problem": "客户当前具体问题", "impact": "业务影响", "solution": "我们会如何解决", "deliverable": "付款后交付物", "clientReview": "客户需要确认的事项", "priority": "高/中/低"},
      {"area": "SEO/GEO/技术/内容/可信度", "problem": "客户当前具体问题", "impact": "业务影响", "solution": "我们会如何解决", "deliverable": "付款后交付物", "clientReview": "客户需要确认的事项", "priority": "高/中/低"},
      {"area": "SEO/GEO/技术/内容/可信度", "problem": "客户当前具体问题", "impact": "业务影响", "solution": "我们会如何解决", "deliverable": "付款后交付物", "clientReview": "客户需要确认的事项", "priority": "高/中/低"}
    ],
    "priorityFixes": ["优先修复1", "优先修复2", "优先修复3", "优先修复4", "优先修复5"]
  },
  "productAnalysis": {
    "productType": "产品类型",
    "coreSellingPoints": ["卖点1", "卖点2", "卖点3"],
    "targetUsers": ["用户画像1", "用户画像2", "用户画像3"],
    "purchaseMotivations": ["动机1", "动机2", "动机3"],
    "conversionProblems": ["问题1", "问题2", "问题3"]
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
  "optimizedDeliverables": {
    "homepageTitle": "优化后的首页 SEO Title，必须可直接使用",
    "homepageMetaDescription": "优化后的首页 Meta Description，必须可直接使用",
    "homepageH1": "优化后的 H1，必须可直接使用",
    "h2Structure": ["优化后的 H2 1", "优化后的 H2 2", "优化后的 H2 3", "优化后的 H2 4"],
    "faqAnswers": [
      {"question": "优化后 FAQ 问题1", "answer": "优化后 FAQ 答案1"},
      {"question": "优化后 FAQ 问题2", "answer": "优化后 FAQ 答案2"},
      {"question": "优化后 FAQ 问题3", "answer": "优化后 FAQ 答案3"},
      {"question": "优化后 FAQ 问题4", "answer": "优化后 FAQ 答案4"},
      {"question": "优化后 FAQ 问题5", "answer": "优化后 FAQ 答案5"}
    ],
    "schemaDrafts": [
      {"type": "Organization", "description": "用途说明", "jsonLd": "压缩后的 JSON-LD 草案"},
      {"type": "Product", "description": "用途说明", "jsonLd": "压缩后的 JSON-LD 草案"},
      {"type": "FAQPage", "description": "用途说明", "jsonLd": "压缩后的 JSON-LD 草案"}
    ],
    "llmsTxt": "可直接放到 /llms.txt 的草案内容",
    "contentCalendar": [
      {"title": "内容标题1", "keyword": "目标关键词", "intent": "搜索意图", "format": "博客/FAQ/对比页/榜单页"},
      {"title": "内容标题2", "keyword": "目标关键词", "intent": "搜索意图", "format": "博客/FAQ/对比页/榜单页"},
      {"title": "内容标题3", "keyword": "目标关键词", "intent": "搜索意图", "format": "博客/FAQ/对比页/榜单页"},
      {"title": "内容标题4", "keyword": "目标关键词", "intent": "搜索意图", "format": "博客/FAQ/对比页/榜单页"},
      {"title": "内容标题5", "keyword": "目标关键词", "intent": "搜索意图", "format": "博客/FAQ/对比页/榜单页"}
    ]
  },
  "reviewChecklist": ["客户审查项1", "客户审查项2", "客户审查项3", "客户审查项4", "客户审查项5"],
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
