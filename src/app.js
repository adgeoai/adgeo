const industryAngles = {
  '独立站/DTC': '突出产品差异、用户评价、优惠转化和移动端购买体验',
  '海外游戏': '突出玩法钩子、前三秒留存、试玩画面和创意迭代速度',
  App: '突出使用场景、下载理由、功能对比和用户习惯',
  'SaaS/工具': '突出效率提升、成本节省、可信案例和免费试用',
  '外贸B2B': '突出工厂实力、认证、交付能力和询盘转化',
  '跨境电商': '突出价格、物流、评价、退换货和社媒种草',
  '广告代理商': '突出批量素材、白标报告、多客户管理和交付效率',
  'DTC / Independent Store': 'Highlight product differentiation, reviews, promotional conversion, and mobile purchase experience',
  'Overseas Game': 'Highlight gameplay hooks, first-three-second retention, gameplay footage, and creative iteration speed',
  'SaaS / Tool': 'Highlight efficiency gains, cost savings, proof points, and free trials',
  App: 'Highlight use cases, download reasons, feature comparisons, and user habits',
  'B2B Export': 'Highlight factory strength, certifications, delivery capability, and inquiry conversion',
  'Cross-Border Ecommerce': 'Highlight pricing, shipping, reviews, returns, and social proof',
  'Ad Agency': 'Highlight bulk creatives, white-label reports, multi-client workflows, and delivery speed',
};

const query = new URLSearchParams(window.location.search);
const isEnglish = document.documentElement.lang.startsWith('en') || query.get('lang') === 'en';

if (isEnglish) {
  document.documentElement.lang = 'en';
}

const labels = {
  zh: {
    waitingUrl: '等待客户提交 URL',
    pending: '待选择',
    seoPreview: '$599/季度、$1100/半年、$2000/全年，均含每月一次审核优化。',
    adsPreview: '广告投放素材独立报价，不包含 SEO/GEO 周期优化。',
    seoAngleSuffix: '，并补齐 SEO 页面结构和关键词地图。',
    seoCopy: (country) => `为${country}市场生成品牌实体、FAQ、对比页、Schema 和 AI 搜索引用内容。`,
    seoCompliance: '交付优化后的页面文案、结构化数据、llms.txt 草案和客户审查清单。',
    adsAngleSuffix: (platform) => `，生成适合 ${platform} 的投放创意角度。`,
    adsCopy: (country) => `为${country}市场生成广告标题、主文案、短视频脚本、素材方向和 A/B 测试矩阵。`,
    adsCompliance: '交付广告合规检查、风险表达替换和落地页一致性建议。',
    reportLoading: '正在抓取网站、评分、定位 SEO/GEO 问题并生成优化后交付物...',
    reportLoadingBox: 'AI 正在生成 SEO/GEO 优化包，通常需要 20-60 秒。',
    reportDone: '已完成。以下内容包含评分、问题、优化后交付物和客户审查清单。',
    saved: '项目已记录，AI 正在生成完整增长报告。',
    generated: 'AI 报告已生成，可继续复制给客户或导出整理。',
    configPending: '项目已保存，但 AI 后端还未配置完成。',
    errorTitle: 'AI 生成暂不可用',
    errorHelp: '请确认线上 Worker 的变量和机密中已经添加 OPENAI_API_KEY，并在保存后部署更改。可以访问 /api/health 检查 hasOpenAIKey 是否为 true。',
    sections: {
      positioning: '一句话定位',
      audit: '全域问题诊断',
      package: '服务套餐',
      monthly: '月度审核优化',
      issues: '关键问题',
      impact: '影响',
      priority: '优先级',
      fixes: '优先修复顺序',
      product: '产品分析',
      productType: '产品类型',
      sellingPoints: '核心卖点',
      users: '目标用户',
      motivations: '购买动机',
      conversion: '转化问题',
      localization: '本地化策略',
      country: '目标国家',
      habits: '用户习惯',
      tone: '表达风格',
      visual: '视觉方向',
      avoid: '需要避免',
      ads: '广告投放策略',
      angles: '投放角度',
      copies: '广告文案',
      creatives: '素材方向',
      scripts: '短视频脚本',
      compliance: '广告合规与账户建议',
      risk: '风险等级',
      risks: '主要风险',
      unsafe: '不建议表达',
      alternatives: '替代表达',
      account: '账户建议',
      landing: '落地页优化',
      seo: 'SEO 建议',
      geo: 'GEO/AI 搜索优化',
      deliverables: '优化后交付物',
      review: '客户审查清单',
      next: '下一步执行',
      score: '全域评分',
      overall: '总分',
      technical: '技术',
      content: '内容',
      authority: '可信度',
    },
  },
  en: {
    waitingUrl: 'Waiting for customer URL',
    pending: 'Pending',
    seoPreview: '$599/quarter, $1100/6 months, $2000/year. Each plan includes one monthly review and optimization.',
    adsPreview: 'Ad creative packages are priced separately and do not include SEO/GEO retainers.',
    seoAngleSuffix: ', with SEO structure and keyword mapping improvements.',
    seoCopy: (country) => `Generate brand entities, FAQs, comparison pages, Schema, and AI-search-friendly content for ${country}.`,
    seoCompliance: 'Deliver optimized page copy, structured data, llms.txt draft, and a client review checklist.',
    adsAngleSuffix: (platform) => `, with campaign creative angles for ${platform}.`,
    adsCopy: (country) => `Generate ad headlines, primary copy, video scripts, creative directions, and A/B testing matrices for ${country}.`,
    adsCompliance: 'Deliver ad compliance checks, safer wording alternatives, and landing page consistency suggestions.',
    reportLoading: 'Crawling the website, scoring SEO/GEO coverage, finding issues, and generating optimized deliverables...',
    reportLoadingBox: 'AI is generating the SEO/GEO optimization package. This usually takes 20-60 seconds.',
    reportDone: 'Done. The report includes scores, issues, optimized deliverables, and a client review checklist.',
    saved: 'Project saved. AI is generating the full growth report.',
    generated: 'AI report generated. You can copy it or export it for customer delivery.',
    configPending: 'Project saved, but the AI backend still needs configuration.',
    errorTitle: 'AI generation unavailable',
    errorHelp: 'Confirm OPENAI_API_KEY is configured in the live Worker variables/secrets and deploy changes. Visit /api/health to check whether hasOpenAIKey is true.',
    sections: {
      positioning: 'Positioning',
      audit: 'Omnichannel SEO/GEO Audit',
      package: 'Service Plan',
      monthly: 'Monthly Review',
      issues: 'Key Issues',
      impact: 'Impact',
      priority: 'Priority',
      fixes: 'Priority Fixes',
      product: 'Product Analysis',
      productType: 'Product Type',
      sellingPoints: 'Core Selling Points',
      users: 'Target Users',
      motivations: 'Purchase Motivations',
      conversion: 'Conversion Issues',
      localization: 'Localization Strategy',
      country: 'Target Country',
      habits: 'User Habits',
      tone: 'Preferred Tone',
      visual: 'Visual Direction',
      avoid: 'Avoid',
      ads: 'Ad Strategy',
      angles: 'Campaign Angles',
      copies: 'Ad Copies',
      creatives: 'Creative Directions',
      scripts: 'Video Scripts',
      compliance: 'Ad Compliance and Account Advice',
      risk: 'Risk Level',
      risks: 'Main Risks',
      unsafe: 'Unsafe Claims',
      alternatives: 'Safer Alternatives',
      account: 'Account Advice',
      landing: 'Landing Page Optimization',
      seo: 'SEO Recommendations',
      geo: 'GEO / AI Search Optimization',
      deliverables: 'Optimized Deliverables',
      review: 'Client Review Checklist',
      next: 'Next Steps',
      score: 'Omnichannel Score',
      overall: 'Overall',
      technical: 'Technical',
      content: 'Content',
      authority: 'Authority',
    },
  },
};

const copy = isEnglish ? labels.en : labels.zh;

if (isEnglish) {
  applyEnglishStaticCopy();
}

const fields = {
  website: document.querySelector('#website'),
  language: document.querySelector('#language'),
  serviceType: document.querySelector('#serviceType'),
  country: document.querySelector('#country'),
  platform: document.querySelector('#platform'),
  industry: document.querySelector('#industry'),
  contact: document.querySelector('#contact'),
  notes: document.querySelector('#notes'),
  apiKey: document.querySelector('#apiKey'),
  model: document.querySelector('#model'),
  baseUrl: document.querySelector('#baseUrl'),
};

function applyEnglishStaticCopy() {
  document.title = 'AdGEO AI SEO/GEO and Ads Growth Services';
  const setText = (selector, text) => {
    const node = document.querySelector(selector);
    if (node) node.textContent = text;
  };
  const setHtml = (selector, html) => {
    const node = document.querySelector(selector);
    if (node) node.innerHTML = html;
  };

  setText('#languageSwitch', '中文');
  document.querySelector('#languageSwitch')?.setAttribute('href', './');
  setText('.heroCopy .eyebrow', 'AI SEO/GEO and Ads Growth Services');
  setText('.heroCopy h1', 'Two Growth Services, Delivered Separately');
  setText(
    '.heroCopy .lead',
    'SEO/GEO is built for long-term search visibility and AI answer exposure. Ads creative is built for short-term paid acquisition. Each service has its own entry, pricing, and deliverables.'
  );
  setHtml('.heroActions .primaryBtn', 'Create Project <span>→</span>');
  setText('.heroActions .secondaryBtn', 'View Workflow');

  const proof = document.querySelectorAll('.proofRow span');
  ['✓ Monthly optimization reviews', '✓ AI platform visibility tracking', '✓ USDT settlement'].forEach((text, index) => {
    if (proof[index]) proof[index].textContent = text;
  });

  const nav = document.querySelectorAll('.navPills span');
  ['SEO/GEO Optimization', 'Ad Creative', 'Monthly Review', 'USDT Payment'].forEach((text, index) => {
    if (nav[index]) nav[index].textContent = text;
  });

  setText('.panelHeader span', '▣ Diagnostic Preview');
  setText('.scanCard small', 'Target Project');
  const previewItems = document.querySelectorAll('.previewItem');
  const previewLabels = ['SEO Audit', 'GEO Optimization', 'Optimized Delivery', 'Pricing'];
  const previewTexts = [
    'Scan page structure, keyword coverage, technical SEO, content gaps, and trust signals.',
    'Generate AI-search-readable entities, FAQs, comparison pages, Schema, and llms.txt drafts.',
    'Deliver optimized Title, Meta, H1/H2, FAQ, content calendar, and a review checklist.',
    '$599/quarter, $1100/6 months, $2000/year. Each plan includes one monthly review.',
  ];
  previewItems.forEach((item, index) => {
    item.querySelector('small').textContent = previewLabels[index];
    item.querySelector('p').textContent = previewTexts[index];
  });

  const serviceTitle = document.querySelector('.serviceSplit .sectionTitle');
  if (serviceTitle) {
    serviceTitle.querySelector('.eyebrow').textContent = 'Two Separate Product Lines';
    serviceTitle.querySelector('h2').textContent = 'SEO/GEO and Ads Are Separate Services';
  }
  const cards = document.querySelectorAll('.serviceCard');
  if (cards[0]) {
    cards[0].querySelector('small').textContent = 'Long-Term Growth';
    cards[0].querySelector('h3').textContent = 'SEO/GEO Omnichannel Optimization';
    cards[0].querySelector('p').textContent =
      'Omnichannel scoring, issue diagnosis, optimized page structure, AI search entities, Schema, llms.txt, content calendar, and monthly optimization reviews.';
  }
  if (cards[1]) {
    cards[1].querySelector('small').textContent = 'Paid Acquisition';
    cards[1].querySelector('h3').textContent = 'AI Ad Creative Package';
    cards[1].querySelector('p').textContent =
      'Ad copy, video scripts, creative directions, A/B testing angles, and ad compliance checks. SEO/GEO retainers are not included.';
    cards[1].querySelector('strong').textContent = 'Custom Quote';
  }

  const metrics = document.querySelectorAll('.metric span');
  ['Quarterly plan, 3 months, one review per month', '6-month plan, one review per month', 'Annual plan, 12 monthly reviews'].forEach((text, index) => {
    if (metrics[index]) metrics[index].textContent = text;
  });

  const brief = document.querySelector('#brief .sectionTitle');
  if (brief) {
    brief.querySelector('.eyebrow').textContent = 'Create Project';
    brief.querySelector('h2').textContent = 'Choose One Independent Service';
    brief.querySelector('p').textContent =
      'SEO/GEO and Ads creative are delivered separately. Choose one service first and the system will generate the matching report.';
  }

  const labels = document.querySelectorAll('.briefForm > label');
  const labelTexts = ['Service Type', 'Website URL', '', '', 'Pain Points', 'Contact', 'Notes'];
  labels.forEach((label, index) => {
    if (labelTexts[index]) label.childNodes[0].textContent = labelTexts[index];
  });
  const twoColLabels = document.querySelectorAll('.twoCol label');
  ['Target Country', 'Ad Platform', 'Industry', 'Plan / Service'].forEach((text, index) => {
    if (twoColLabels[index]) twoColLabels[index].childNodes[0].textContent = text;
  });

  translateOptions('#serviceType', ['SEO/GEO Omnichannel Optimization', 'AI Ad Creative Package']);
  translateOptions('#country', ['United States', 'Japan', 'Germany', 'Brazil', 'United Kingdom', 'Saudi Arabia', 'UAE', 'Indonesia', 'Thailand', 'Vietnam']);
  translateOptions('#industry', ['DTC / Independent Store', 'Overseas Game', 'App', 'SaaS / Tool', 'B2B Export', 'Cross-Border Ecommerce', 'Ad Agency']);

  const chips = document.querySelectorAll('.chip');
  ['Not enough creatives', 'Poor conversion', 'Weak localization', 'Ad rejection', 'Unstable ad account', 'No SEO traffic', 'No AI search visibility'].forEach((text, index) => {
    if (chips[index]) {
      chips[index].textContent = text;
      chips[index].dataset.pain = text;
    }
  });

  document.querySelector('#contact').placeholder = 'Email / Telegram / WhatsApp';
  document.querySelector('#notes').placeholder = 'Example: Need US SEO, want AI search visibility, need English content...';
  document.querySelector('.apiSettings summary').textContent = 'Temporary AI Config';
  document.querySelector('.apiSettings p').textContent = 'For testing the generation flow. For production, use Cloudflare variables and secrets.';
  document.querySelector('.submitBtn').textContent = 'Generate Project Preview';

  const summaryLabels = document.querySelectorAll('.summaryBox small');
  ['Website', 'Market and Platform', 'Pain Points'].forEach((text, index) => {
    if (summaryLabels[index]) summaryLabels[index].textContent = text;
  });
  setText('.resultHeader span', '▤ Delivery Summary');
  setText('#statusText', 'Preview');

  const deliveries = document.querySelectorAll('.delivery span:last-child');
  [
    'SEO/GEO: scores, issues, and optimized deliverables',
    'Ads: copy, scripts, and creative directions',
    'Two services are delivered and reviewed separately',
    'SEO/GEO $599/$1100/$2000, USDT preferred',
  ].forEach((text, index) => {
    if (deliveries[index]) deliveries[index].textContent = text;
  });

  const reportTitle = document.querySelector('#reportSection .sectionTitle');
  if (reportTitle) {
    reportTitle.querySelector('.eyebrow').textContent = 'AI Delivery Result';
    reportTitle.querySelector('h2').textContent = 'SEO/GEO Optimization Report';
    reportTitle.querySelector('p').textContent = 'Waiting for generation.';
  }

  const workflow = document.querySelector('#workflow .sectionTitle');
  if (workflow) {
    workflow.querySelector('.eyebrow').textContent = 'Workflow';
    workflow.querySelector('h2').textContent = 'From Website to Optimized Delivery';
  }
  const steps = document.querySelectorAll('.step');
  const stepTexts = [
    ['Omnichannel Score', 'Assess SEO, GEO, technical structure, content coverage, brand entities, and trust signals.'],
    ['Issue Diagnosis', 'Find indexing, keyword, page structure, AI citation, and content gap issues.'],
    ['Optimization Generation', 'Generate optimized Title, Meta, FAQ, Schema, llms.txt, and content calendar.'],
    ['Client Review', 'Deliver a review checklist and run one monthly visibility review during the service period.'],
  ];
  steps.forEach((step, index) => {
    step.querySelector('h3').textContent = stepTexts[index][0];
    step.querySelector('p').textContent = stepTexts[index][1];
  });
}

function translateOptions(selector, texts) {
  const options = document.querySelectorAll(`${selector} option`);
  texts.forEach((text, index) => {
    if (options[index]) {
      options[index].textContent = text;
      options[index].value = index === 0 && selector === '#serviceType' ? 'SEO/GEO 全域优化' : options[index].value;
      if (selector === '#serviceType' && index === 1) options[index].value = 'AI 广告投放素材';
    }
  });
}

const planOptions = {
  'SEO/GEO 全域优化': [
    isEnglish ? '$599 / Quarterly Plan / 3 months / 1 monthly review / USDT' : '$599 / 季度套餐 / 3个月 / 每月1次审核优化 / USDT',
    isEnglish ? '$1100 / 6-Month Plan / 1 monthly review / USDT' : '$1100 / 半年套餐 / 6个月 / 每月1次审核优化 / USDT',
    isEnglish ? '$2000 / Annual Plan / 12 months / 1 monthly review / USDT' : '$2000 / 全年套餐 / 12个月 / 每月1次审核优化 / USDT',
  ],
  'AI 广告投放素材': [
    isEnglish ? 'Ad Creative Package / Custom Quote' : '广告投放素材包 / 另行报价',
    isEnglish ? 'Ad Copy + Short Video Scripts / Custom Quote' : '广告文案+短视频脚本包 / 另行报价',
    isEnglish ? 'Creative Directions + A/B Test Matrix / Custom Quote' : '广告素材+A/B测试矩阵 / 另行报价',
  ],
};

const nodes = {
  score: document.querySelector('#projectScore'),
  position: document.querySelector('#previewPosition'),
  angle: document.querySelector('#previewAngle'),
  copy: document.querySelector('#previewCopy'),
  compliance: document.querySelector('#previewCompliance'),
  seo: document.querySelector('#previewSeo'),
  summaryWebsite: document.querySelector('#summaryWebsite'),
  summaryMarket: document.querySelector('#summaryMarket'),
  summaryPain: document.querySelector('#summaryPain'),
  statusText: document.querySelector('#statusText'),
  successBox: document.querySelector('#successBox'),
  successText: document.querySelector('#successText'),
  reportSection: document.querySelector('#reportSection'),
  reportStatus: document.querySelector('#reportStatus'),
  reportShell: document.querySelector('#reportShell'),
  leadForm: document.querySelector('#leadForm'),
  painGrid: document.querySelector('#painGrid'),
};

function selectedPain() {
  return [...document.querySelectorAll('.chip.active')].map((button) => button.dataset.pain);
}

function calculateScore(pain) {
  let score = 42;
  if (fields.website.value.includes('.')) score += 18;
  if (fields.contact.value.length >= 5) score += 10;
  if (pain.includes('广告拒审')) score += 8;
  if (pain.includes('SEO没流量') || pain.includes('AI搜索没曝光')) score += 7;
  if (fields.notes.value.length > 12) score += 6;
  return Math.min(score, 96);
}

function updatePreview() {
  const country = fields.country.value;
  const platform = fields.platform.value;
  const industry = fields.industry.value;
  const serviceType = fields.serviceType.value;
  const pain = selectedPain();
  const website = fields.website.value.trim();

  nodes.score.textContent = `${calculateScore(pain)}%`;
  nodes.position.textContent = `${serviceType} / ${country} / ${industry}`;
  if (serviceType === 'SEO/GEO 全域优化') {
    nodes.angle.textContent = `${industryAngles[industry]}${copy.seoAngleSuffix}`;
    nodes.copy.textContent = copy.seoCopy(country);
    nodes.compliance.textContent = copy.seoCompliance;
    nodes.seo.textContent = copy.seoPreview;
  } else {
    nodes.angle.textContent = `${industryAngles[industry]}${copy.adsAngleSuffix(platform)}`;
    nodes.copy.textContent = copy.adsCopy(country);
    nodes.compliance.textContent = copy.adsCompliance;
    nodes.seo.textContent = copy.adsPreview;
  }
  nodes.summaryWebsite.textContent = website || copy.waitingUrl;
  nodes.summaryMarket.textContent = `${serviceType} / ${country} / ${platform} / ${industry}`;
  nodes.summaryPain.textContent = pain.length ? pain.join(isEnglish ? ', ' : '、') : copy.pending;
}

function syncPlanOptions() {
  const currentOptions = planOptions[fields.serviceType.value] || planOptions['SEO/GEO 全域优化'];
  const budget = document.querySelector('#budget');
  budget.innerHTML = currentOptions.map((option) => `<option>${option}</option>`).join('');
}

Object.values(fields).forEach((field) => {
  field.addEventListener('input', updatePreview);
  field.addEventListener('change', updatePreview);
});

fields.serviceType.addEventListener('change', () => {
  syncPlanOptions();
  updatePreview();
});

document.querySelectorAll('[data-service-jump]').forEach((link) => {
  link.addEventListener('click', () => {
    fields.serviceType.value = link.dataset.serviceJump === 'ads' ? 'AI 广告投放素材' : 'SEO/GEO 全域优化';
    syncPlanOptions();
    updatePreview();
  });
});

nodes.painGrid.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  chip.classList.toggle('active');
  updatePreview();
});

nodes.leadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const payload = {
    website: fields.website.value.trim(),
    outputLanguage: fields.language?.value || (isEnglish ? 'English' : 'Chinese'),
    serviceType: fields.serviceType.value,
    country: fields.country.value,
    platform: fields.platform.value,
    industry: fields.industry.value,
    budget: document.querySelector('#budget').value,
    painPoints: selectedPain(),
    contact: fields.contact.value.trim(),
    notes: fields.notes.value.trim(),
    runtimeConfig: {
      apiKey: fields.apiKey?.value.trim() || '',
      model: fields.model?.value.trim() || '',
      baseUrl: fields.baseUrl?.value.trim() || '',
    },
    createdAt: new Date().toISOString(),
  };

  const savedLeads = JSON.parse(localStorage.getItem('adgeo_leads') || '[]');
  savedLeads.push(payload);
  localStorage.setItem('adgeo_leads', JSON.stringify(savedLeads));

  const endpoint = window.ADGEO_CONFIG?.leadEndpoint;
  if (endpoint) {
    fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).catch(() => {
      localStorage.setItem('adgeo_last_sync_failed', JSON.stringify(payload));
    });
  }

  nodes.statusText.textContent = '已创建';
  nodes.successBox.classList.remove('hidden');
  nodes.successText.textContent = copy.saved;
  nodes.reportSection.classList.remove('hidden');
  nodes.reportStatus.textContent = copy.reportLoading;
  nodes.reportShell.innerHTML = `<div class="loadingBox">${escapeHtml(copy.reportLoadingBox)}</div>`;
  nodes.reportSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  updatePreview();

  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const data = await response.json();

    if (!response.ok || !data.ok) {
      throw new Error(data.error || 'AI 报告生成失败。');
    }

    const reports = JSON.parse(localStorage.getItem('adgeo_reports') || '[]');
    reports.push({ brief: payload, report: data.report, createdAt: new Date().toISOString() });
    localStorage.setItem('adgeo_reports', JSON.stringify(reports));

    nodes.statusText.textContent = isEnglish ? 'Generated' : '已生成';
    nodes.successText.textContent = copy.generated;
    nodes.reportStatus.textContent = copy.reportDone;
    renderReport(data.report);
  } catch (error) {
    nodes.statusText.textContent = isEnglish ? 'Config Needed' : '待配置';
    nodes.successText.textContent = copy.configPending;
    nodes.reportStatus.textContent = error.message;
    nodes.reportShell.innerHTML = `
      <div class="errorBox">
        <strong>${escapeHtml(copy.errorTitle)}</strong>
        <p>${escapeHtml(error.message)}</p>
        <p>${escapeHtml(copy.errorHelp)}</p>
      </div>
    `;
  }
});

syncPlanOptions();
updatePreview();

function renderReport(report) {
  const isSeoService = fields.serviceType.value === 'SEO/GEO 全域优化';
  const s = copy.sections;

  if (isSeoService) {
    nodes.reportShell.innerHTML = `
      <div class="reportCard heroReport">
        <div>
          <small>${escapeHtml(s.positioning)}</small>
          <h3>${escapeHtml(report.summary?.productPositioning)}</h3>
          <p>${escapeHtml(report.summary?.targetMarket)}</p>
        </div>
        <span class="riskBadge">${escapeHtml(report.summary?.riskLevel || copy.pending)}</span>
      </div>

      ${renderScores(report.seoGeoAudit?.scores)}

      ${section(s.audit, [
        kv(s.package, report.seoGeoAudit?.selectedPlan),
        kv(s.monthly, report.seoGeoAudit?.monthlyReview),
        cards(s.issues, report.seoGeoAudit?.issues, (item) => `
          ${strong(item.area)}
          ${para(item.problem)}
          ${small(`${s.impact}: ${item.impact || copy.pending} / ${s.priority}: ${item.priority || copy.pending}`)}
        `),
        list(s.fixes, report.seoGeoAudit?.priorityFixes),
      ])}

      ${section(s.product, [
        kv(s.productType, report.productAnalysis?.productType),
        list(s.sellingPoints, report.productAnalysis?.coreSellingPoints),
        list(s.users, report.productAnalysis?.targetUsers),
        list(s.conversion, report.productAnalysis?.conversionProblems),
      ])}

      ${section(s.seo, [
        list('Keywords', report.seo?.keywords),
        kv('Title', report.seo?.title),
        kv('Meta Description', report.seo?.metaDescription),
        list('Content Topics', report.seo?.contentTopics),
        list('Technical Fixes', report.seo?.technicalFixes),
      ])}

      ${section(s.geo, [
        kv('Entity Definition', report.geo?.entityDefinition),
        list('FAQ', report.geo?.faq),
        list('Comparison Pages', report.geo?.comparisonPages),
        list('Schema', report.geo?.schema),
        list('Citation Sources', report.geo?.citationSources),
      ])}

      ${section(s.deliverables, [
        kv('Optimized Title', report.optimizedDeliverables?.homepageTitle),
        kv('Optimized Meta Description', report.optimizedDeliverables?.homepageMetaDescription),
        kv('Optimized H1', report.optimizedDeliverables?.homepageH1),
        list('Recommended H2 Structure', report.optimizedDeliverables?.h2Structure),
        cards('Optimized FAQ', report.optimizedDeliverables?.faqAnswers, (item) => `
          ${strong(item.question)}
          ${para(item.answer)}
        `),
        cards('Schema Drafts', report.optimizedDeliverables?.schemaDrafts, (item) => `
          ${strong(item.type)}
          ${para(item.description)}
          ${small(item.jsonLd)}
        `),
        kv('llms.txt Draft', report.optimizedDeliverables?.llmsTxt),
        cards('Content Calendar', report.optimizedDeliverables?.contentCalendar, (item) => `
          ${strong(item.title)}
          ${para(item.intent)}
          ${small(`${item.keyword || ''} ${item.format || ''}`)}
        `),
        list(s.review, report.reviewChecklist),
      ])}

      ${section(s.next, [
        list('Priority Actions', report.nextSteps),
      ])}
    `;
    return;
  }

  nodes.reportShell.innerHTML = `
    <div class="reportCard heroReport">
      <div>
        <small>${escapeHtml(s.positioning)}</small>
        <h3>${escapeHtml(report.summary?.productPositioning)}</h3>
        <p>${escapeHtml(report.summary?.targetMarket)}</p>
      </div>
      <span class="riskBadge">${escapeHtml(report.summary?.riskLevel || copy.pending)}</span>
    </div>

    ${section(s.product, [
      kv(s.productType, report.productAnalysis?.productType),
      list(s.sellingPoints, report.productAnalysis?.coreSellingPoints),
      list(s.users, report.productAnalysis?.targetUsers),
      list(s.motivations, report.productAnalysis?.purchaseMotivations),
      list(s.conversion, report.productAnalysis?.conversionProblems),
    ])}

    ${section(s.localization, [
      kv(s.country, report.localization?.country),
      list(s.habits, report.localization?.userHabits),
      list(s.tone, report.localization?.preferredTone),
      list(s.visual, report.localization?.visualDirection),
      list(s.avoid, report.localization?.avoid),
    ])}

    ${section(s.ads, [
      cards(s.angles, report.adStrategy?.angles, (item) => `${strong(item.name)}${para(item.message)}${small(item.bestFor)}`),
      cards(s.copies, report.adStrategy?.adCopies, (item) => `${strong(item.title)}${para(item.body)}${small(`${item.cta} / ${item.angle}`)}`),
      cards(s.creatives, report.adStrategy?.creativeDirections, (item) => `${strong(item.name)}${para(item.imagePrompt)}${small(item.headline || item.note)}`),
    ])}

    ${section(s.scripts, [
      cards(s.scripts, report.videoScripts, (item) => `
        ${strong(item.name)}
        ${small(item.duration)}
        ${para(`Hook：${item.hook}`)}
        ${listHtml(item.scenes || [])}
        ${para(item.voiceover)}
        ${small(item.cta)}
      `),
    ])}

    ${section(s.compliance, [
      kv(s.risk, report.compliance?.riskLevel),
      list(s.risks, report.compliance?.risks),
      list(s.unsafe, report.compliance?.unsafeClaims),
      list(s.alternatives, report.compliance?.safeAlternatives),
      list(s.account, report.compliance?.accountAdvice),
    ])}

    ${section(s.next, [
      list('Priority Actions', report.nextSteps),
    ])}
  `;
}

function renderScores(scores) {
  if (!scores) return '';
  const items = [
    [copy.sections.overall, scores.overall],
    ['SEO', scores.seo],
    ['GEO', scores.geo],
    [copy.sections.technical, scores.technical],
    [copy.sections.content, scores.content],
    [copy.sections.authority, scores.authority],
  ];

  return `
    <article class="reportCard">
      <h3>${escapeHtml(copy.sections.score)}</h3>
      <div class="scoreGrid">
        ${items
          .map(([label, value]) => `
            <div class="scoreTile">
              <strong>${escapeHtml(value ?? '-')}</strong>
              <span>${escapeHtml(label)}</span>
            </div>
          `)
          .join('')}
      </div>
    </article>
  `;
}

function section(title, blocks) {
  return `
    <article class="reportCard">
      <h3>${escapeHtml(title)}</h3>
      <div class="reportBlocks">${blocks.filter(Boolean).join('')}</div>
    </article>
  `;
}

function kv(label, value) {
  if (!value) return '';
  return `<div class="reportBlock"><small>${escapeHtml(label)}</small><p>${escapeHtml(value)}</p></div>`;
}

function list(label, items) {
  if (!items?.length) return '';
  return `<div class="reportBlock"><small>${escapeHtml(label)}</small>${listHtml(items)}</div>`;
}

function listHtml(items) {
  return `<ul>${items.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
}

function cards(label, items, renderer) {
  if (!items?.length) return '';
  return `
    <div class="reportBlock full">
      <small>${escapeHtml(label)}</small>
      <div class="miniCards">${items.map((item) => `<div class="miniCard">${renderer(item)}</div>`).join('')}</div>
    </div>
  `;
}

function strong(value) {
  return `<strong>${escapeHtml(value)}</strong>`;
}

function para(value) {
  return value ? `<p>${escapeHtml(value)}</p>` : '';
}

function small(value) {
  return value ? `<small>${escapeHtml(value)}</small>` : '';
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}
