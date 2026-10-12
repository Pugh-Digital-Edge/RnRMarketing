const escape = value => String(value || '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);

export function leadHtml(fields, message, status) {
  const schedule = fields.get('form-name') === 'Schedule Lead Form';
  const paid = fields.has('program-scope') || fields.get('landing-page')?.replace(/\/$/, '') === '/restoration-marketing';
  const hidden = ['form-name', 'lead-stage', 'submission-id', 'phone-country', 'landing-page',
    'gclid', 'gbraid', 'wbraid', 'utm-source', 'utm-medium', 'utm-campaign', 'utm-term', 'utm-content',
    'monthly-budget', 'goals', 'page', ...(paid ? ['primary-service'] : [])];
  const inputs = [ ['name', 'Name', 'text'], ['email', 'Email', 'email'], ['phone', 'Phone', 'tel'],
    ...(schedule ? [['company', 'Company', 'text'], ['service-area', 'Service territory', 'text'],
      [paid ? 'program-scope' : 'primary-service', 'Requested help', 'text']]
      : fields.get('form-name') === 'Contact Form' ? [['zip', 'ZIP code (optional)', 'text'], ['Message', 'Service area and goals', 'textarea']]
      : [['message', 'Message', 'textarea']]) ];
  const renderInput = ([key, label, type]) => key === 'program-scope'
    ? `<label>${label}<select required name="program-scope"><option value="">Choose the closest fit</option>${[['full-program', 'Full marketing program'], ['paid-led', 'Mostly paid ads'], ['single-service', 'One specific service'], ['not-sure', 'Not sure yet']].map(([value, text]) => `<option value="${value}"${fields.get(key) === value ? ' selected' : ''}>${text}</option>`).join('')}</select></label>`
    : type === 'textarea' ? `<label>${label}<textarea required name="${key}">${escape(fields.get(key))}</textarea></label>`
    : `<label>${label}<input${key === 'zip' ? '' : ' required'} type="${type}" name="${key}" value="${escape(fields.get(key))}"></label>`;
  return new Response(`<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Review your request</title><style>body{font:1.1rem system-ui;max-width:36rem;margin:3rem auto;padding:1rem}label{display:block;margin:1rem 0}input,select,textarea,button{display:block;font:inherit;padding:.6rem;width:100%;box-sizing:border-box}</style></head><body><main><h1>Review your request</h1><p role="alert">${escape(message)}</p><form method="post" action="/.netlify/functions/submit-lead">${hidden.map(key => `<input type="hidden" name="${key}" value="${escape(fields.get(key))}">`).join('')}${inputs.map(renderInput).join('')}<button type="submit">Send your request</button></form><p><a href="/restoration-marketing/#lead-form">Return to the website</a></p></main></body></html>`, {
    status, headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store',
      'Content-Security-Policy': "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'" },
  });
}
