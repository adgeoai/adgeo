const leads = JSON.parse(localStorage.getItem('adgeo_leads') || '[]');
const rows = document.querySelector('#leadRows');
const emptyState = document.querySelector('#emptyState');
const leadCount = document.querySelector('#leadCount');
const latestCountry = document.querySelector('#latestCountry');
const latestPlatform = document.querySelector('#latestPlatform');
const exportCsv = document.querySelector('#exportCsv');

function formatDate(value) {
  if (!value) return '-';
  return new Intl.DateTimeFormat('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(value));
}

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function csvValue(value) {
  return `"${String(value || '').replaceAll('"', '""')}"`;
}

function render() {
  leadCount.textContent = leads.length;
  latestCountry.textContent = leads.at(-1)?.country || '-';
  latestPlatform.textContent = leads.at(-1)?.platform || '-';
  emptyState.classList.toggle('hidden', leads.length > 0);

  rows.innerHTML = leads
    .map((lead) => {
      return `
        <tr>
          <td>${escapeHtml(formatDate(lead.createdAt))}</td>
          <td>${escapeHtml(lead.website)}</td>
          <td>${escapeHtml(lead.country)}</td>
          <td>${escapeHtml(lead.platform)}</td>
          <td>${escapeHtml(lead.industry)}</td>
          <td>${escapeHtml(lead.budget)}</td>
          <td>${escapeHtml((lead.painPoints || []).join('、'))}</td>
          <td>${escapeHtml(lead.contact)}</td>
          <td>${escapeHtml(lead.notes)}</td>
        </tr>
      `;
    })
    .join('');
}

exportCsv.addEventListener('click', () => {
  const header = ['时间', '网站', '国家', '平台', '行业', '预算', '痛点', '联系方式', '备注'];
  const body = leads.map((lead) => [
    formatDate(lead.createdAt),
    lead.website,
    lead.country,
    lead.platform,
    lead.industry,
    lead.budget,
    (lead.painPoints || []).join('、'),
    lead.contact,
    lead.notes,
  ]);
  const csv = [header, ...body].map((line) => line.map(csvValue).join(',')).join('\n');
  const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `adgeo-leads-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
});

render();
