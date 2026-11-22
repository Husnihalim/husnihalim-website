// Enquiry context, not proof of a marketing channel. Never retain URL queries or fragments.
function enquirySource(data, site) {
  const website = site === 'husni' ? 'husnihalim.com' : 'visiarmada.com';
  let page = '';
  try {
    const raw = data.sourcePage || data.page || '';
    const url = new URL(raw, `https://${website}`);
    if (raw && ['http:', 'https:'].includes(url.protocol) &&
        [website, `www.${website}`].includes(url.hostname)) {
      page = `https://${website}${url.pathname}`;
    }
  } catch {}
  return { sourceWebsite: website, sourcePage: page,
    sourceForm: String(data.sourceForm || data['form-name'] || 'contact').replace(/[\r\n]/g, ' ').slice(0, 100) };
}
function sourceRows(data) {
  const escape = (value) => String(value || 'Not recorded').replace(/[&<>"']/g,
    (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
  return [['Website', data.sourceWebsite], ['Enquiry page', data.sourcePage], ['Form', data.sourceForm]]
    .map(([label, value]) => `<tr><td style="padding:8px 12px;color:#6b7280">${label}</td><td style="padding:8px 12px">${escape(value)}</td></tr>`).join('');
}
module.exports = { enquirySource, sourceRows };
