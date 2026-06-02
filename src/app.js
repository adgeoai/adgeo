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

nodes.leadForm.addEventListener('submit', (event) => {
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
  updatePreview();
});

updatePreview();
