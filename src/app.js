const industryAngles = {
  '独立站/DTC': '突出产品差异、用户评价、优惠转化和移动端购买体验',
  '海外游戏': '突出玩法钩子、前三秒留存、试玩画面和创意迭代速度',
  App: '突出使用场景、下载理由、功能对比和用户习惯',
  'SaaS/工具': '突出效率提升、成本节省、可信案例和免费试用',
  '外贸B2B': '突出工厂实力、认证、交付能力和询盘转化',
  '跨境电商': '突出价格、物流、评价、退换货和社媒种草',
  '广告代理商': '突出批量素材、白标报告、多客户管理和交付效率',
};

const fields = {
  website: document.querySelector('#website'),
  country: document.querySelector('#country'),
  platform: document.querySelector('#platform'),
  industry: document.querySelector('#industry'),
  contact: document.querySelector('#contact'),
  notes: document.querySelector('#notes'),
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
  const pain = selectedPain();
  const website = fields.website.value.trim();

  nodes.score.textContent = `${calculateScore(pain)}%`;
  nodes.position.textContent = `面向${country}市场的${industry}增长项目`;
  nodes.angle.textContent = industryAngles[industry];
  nodes.copy.textContent = `为${country}用户生成适合 ${platform} 的本地化广告文案、短视频脚本和素材方向。`;
  nodes.compliance.textContent = pain.includes('广告拒审')
    ? '优先检查夸大承诺、敏感词、落地页一致性和平台政策风险。'
    : '交付前进行广告政策、落地页信任要素和风险表达检查。';
  nodes.seo.textContent = `围绕${industry}的产品词、痛点词、对比词和FAQ页面做 SEO/GEO 内容规划。`;
  nodes.summaryWebsite.textContent = website || '等待客户提交 URL';
  nodes.summaryMarket.textContent = `${country} / ${platform} / ${industry}`;
  nodes.summaryPain.textContent = pain.length ? pain.join('、') : '待选择';
}

Object.values(fields).forEach((field) => {
  field.addEventListener('input', updatePreview);
  field.addEventListener('change', updatePreview);
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
    country: fields.country.value,
    platform: fields.platform.value,
    industry: fields.industry.value,
    budget: document.querySelector('#budget').value,
    painPoints: selectedPain(),
    contact: fields.contact.value.trim(),
    notes: fields.notes.value.trim(),
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
  nodes.successText.textContent = '项目已记录，AI 正在生成完整增长报告。';
  nodes.reportSection.classList.remove('hidden');
  nodes.reportStatus.textContent = '正在抓取网站、分析需求并生成投放素材、SEO/GEO 和合规建议...';
  nodes.reportShell.innerHTML = '<div class="loadingBox">AI 正在生成报告，通常需要 20-60 秒。</div>';
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

    nodes.statusText.textContent = '已生成';
    nodes.successText.textContent = 'AI 报告已生成，可继续复制给客户或导出整理。';
    nodes.reportStatus.textContent = '已完成。以下内容可直接作为客户轻诊断报告初稿。';
    renderReport(data.report);
  } catch (error) {
    nodes.statusText.textContent = '待配置';
    nodes.successText.textContent = '项目已保存，但 AI 后端还未配置完成。';
    nodes.reportStatus.textContent = error.message;
    nodes.reportShell.innerHTML = `
      <div class="errorBox">
        <strong>AI 生成暂不可用</strong>
        <p>${escapeHtml(error.message)}</p>
        <p>请确认线上 Worker 的变量和机密中已经添加 OPENAI_API_KEY，并在保存后部署更改。可以访问 /api/health 检查 hasOpenAIKey 是否为 true。</p>
      </div>
    `;
  }
});

updatePreview();

function renderReport(report) {
  nodes.reportShell.innerHTML = `
    <div class="reportCard heroReport">
      <div>
        <small>一句话定位</small>
        <h3>${escapeHtml(report.summary?.productPositioning)}</h3>
        <p>${escapeHtml(report.summary?.targetMarket)}</p>
      </div>
      <span class="riskBadge">${escapeHtml(report.summary?.riskLevel || '待评估')}风险</span>
    </div>

    ${section('产品分析', [
      kv('产品类型', report.productAnalysis?.productType),
      list('核心卖点', report.productAnalysis?.coreSellingPoints),
      list('目标用户', report.productAnalysis?.targetUsers),
      list('购买动机', report.productAnalysis?.purchaseMotivations),
      list('转化问题', report.productAnalysis?.conversionProblems),
    ])}

    ${section('本地化策略', [
      kv('目标国家', report.localization?.country),
      list('用户习惯', report.localization?.userHabits),
      list('表达风格', report.localization?.preferredTone),
      list('视觉方向', report.localization?.visualDirection),
      list('需要避免', report.localization?.avoid),
    ])}

    ${section('广告投放策略', [
      cards('投放角度', report.adStrategy?.angles, (item) => `${strong(item.name)}${para(item.message)}${small(item.bestFor)}`),
      cards('广告文案', report.adStrategy?.adCopies, (item) => `${strong(item.title)}${para(item.body)}${small(`${item.cta} / ${item.angle}`)}`),
      cards('素材方向', report.adStrategy?.creativeDirections, (item) => `${strong(item.name)}${para(item.imagePrompt)}${small(item.headline || item.note)}`),
    ])}

    ${section('短视频脚本', [
      cards('脚本', report.videoScripts, (item) => `
        ${strong(item.name)}
        ${small(item.duration)}
        ${para(`Hook：${item.hook}`)}
        ${listHtml(item.scenes || [])}
        ${para(item.voiceover)}
        ${small(item.cta)}
      `),
    ])}

    ${section('广告合规与账户建议', [
      kv('风险等级', report.compliance?.riskLevel),
      list('主要风险', report.compliance?.risks),
      list('不建议表达', report.compliance?.unsafeClaims),
      list('替代表达', report.compliance?.safeAlternatives),
      list('账户建议', report.compliance?.accountAdvice),
    ])}

    ${section('落地页优化', [
      list('首屏', report.landingPage?.aboveFold),
      list('信任背书', report.landingPage?.trustSignals),
      list('CTA', report.landingPage?.cta),
      list('移动端', report.landingPage?.mobile),
    ])}

    ${section('SEO 建议', [
      list('关键词', report.seo?.keywords),
      kv('Title', report.seo?.title),
      kv('Meta Description', report.seo?.metaDescription),
      list('内容选题', report.seo?.contentTopics),
      list('技术优化', report.seo?.technicalFixes),
    ])}

    ${section('GEO/AI 搜索优化', [
      kv('品牌实体定义', report.geo?.entityDefinition),
      list('FAQ', report.geo?.faq),
      list('对比页', report.geo?.comparisonPages),
      list('Schema', report.geo?.schema),
      list('引用源', report.geo?.citationSources),
    ])}

    ${section('下一步执行', [
      list('优先动作', report.nextSteps),
    ])}
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
