import { bookingUrl } from '../../../../src/data/booking.js';

// These bounds are also the worst-case request count reserved by the caller.
export const DELIVERY_LIMITS = Object.freeze({ timeoutMs: 5000, maxCrmRequests: 4, maxEmailRequests: 1, maxProviderRequests: 5 });
const CONTACTS = 'https://api.hubapi.com/crm/v3/objects/contacts';
const EMAILS = 'https://api.resend.com/emails';
const HTML_LIMITATION = 'This is a limited review of publicly fetched HTML. It does not measure search rankings, indexing, traffic, Google Business Profile, backlinks, ad performance, or AI visibility. An observed signal is not a guarantee of performance.';
const MESSAGES = {
  CONFIG_INVALID: 'Report delivery is not configured.',
  INVALID_REQUEST: 'The report request is invalid.',
  CRM_FAILED: 'The contact service rejected or could not process the request.',
  CRM_UNCERTAIN: 'The contact update could not be confirmed.',
  DELIVERY_FAILED: 'The email service rejected the report.',
  DELIVERY_UNCERTAIN: 'Email acceptance could not be confirmed.',
};

export class DeliveryError extends Error {
  constructor(code) { super(MESSAGES[code]); this.name = 'DeliveryError'; this.code = code; }
}

export function isSafeAuditProperty(value) {
  return typeof value === 'string' && /^rnr_audit_[a-z0-9_]{1,60}$/.test(value)
    && !/(?:lifecycle|deal|subscription|hs_marketable_status)/i.test(value);
}

export function validEmail(value) {
  if (typeof value !== 'string' || value.length > 254 || /[\s\x00-\x1f\x7f]/.test(value)) return false;
  const parts = value.split('@');
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || local.length > 64 || !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/.test(local) || local.startsWith('.') || local.endsWith('.') || local.includes('..')) return false;
  const labels = domain.split('.');
  return labels.length >= 2 && domain.length <= 253 && labels.every(label => /^[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?$/.test(label)) && /^[a-zA-Z]{2,63}$/.test(labels.at(-1));
}

function validSender(value) {
  if (typeof value !== 'string' || value.length > 380 || /[\r\n\x00-\x1f\x7f]/.test(value)) return false;
  if (validEmail(value)) return true;
  const match = value.match(/^[^<>]{1,100} <([^<>]+)>$/);
  return Boolean(match && validEmail(match[1]));
}

// Throws a safe configuration error; never probes providers or creates properties.
export function validateDeliveryConfig(config) {
  const secret = value => typeof value === 'string' && value.length > 0 && value.length <= 4096 && !/[\s\x00-\x1f\x7f]/.test(value);
  if (!config || !secret(config.resendApiKey) || !secret(config.hubspotToken) || !validSender(config.emailFrom)
    || !isSafeAuditProperty(config.hubspotReportProperty) || !isSafeAuditProperty(config.hubspotConsentProperty)
    || config.hubspotReportProperty === config.hubspotConsentProperty) throw new DeliveryError('CONFIG_INVALID');
  return true;
}

function invalid() { throw new DeliveryError('INVALID_REQUEST'); }
function text(value, max = 12000) {
  if (typeof value !== 'string' || value.length > max || /[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]/.test(value)) invalid();
  return value;
}
function list(value, max) {
  if (!Array.isArray(value) || value.length > max) invalid();
  for (let index = 0; index < value.length; index += 1) if (!Object.hasOwn(value, index)) invalid();
  return value;
}
function url(value) {
  text(value, 4096);
  if (!value || /[\s\x00-\x1f\x7f]/.test(value)) invalid();
  let parsed;
  try { parsed = new URL(value); } catch { invalid(); }
  if (!['https:', 'http:'].includes(parsed.protocol) || parsed.username || parsed.password || !parsed.hostname) invalid();
  return parsed.href;
}
function score(value) { if (value !== null && (typeof value !== 'number' || !Number.isFinite(value) || value < 0 || value > 100)) invalid(); return value; }
function evidence(value) { return list(value, 30).map(item => ({ url: url(item?.url), text: text(item?.text) })); }

function validateRequest(input) {
  if (!input || !validEmail(input.email) || typeof input.requestId !== 'string' || !/^[a-zA-Z0-9_-]{8,128}$/.test(input.requestId)) invalid();
  if (input.marketingConsent !== undefined && typeof input.marketingConsent !== 'boolean') invalid();
  const reportUrl = url(input.reportUrl);
  const source = input.report;
  if (!source || source.version !== 1) invalid();
  text(source.generatedAt, 64);
  const generatedAt = Date.parse(source.generatedAt);
  if (!Number.isFinite(generatedAt)) invalid();
  const report = {
    version: 1, url: url(source.url), service: text(source.service, 300), area: text(source.area, 300),
    generatedAt: new Date(generatedAt).toISOString(), score: score(source.score),
    categories: list(source.categories, 20).map(item => ({ id: text(item?.id, 100), label: text(item?.label, 300), score: score(item?.score), summary: text(item?.summary) })),
    checks: list(source.checks, 100).map(item => {
      if (!['pass', 'fail', 'unknown'].includes(item?.status)) invalid();
      return { id: text(item.id, 100), category: text(item.category, 100), label: text(item.label, 300), status: item.status, evidence: evidence(item.evidence), recommendation: text(item.recommendation) };
    }),
    fixes: list(source.fixes, 3).map(item => ({ title: text(item?.title, 300), why: text(item?.why), action: text(item?.action), evidence: evidence(item?.evidence) })),
    pages: list(source.pages, 20).map(item => {
      if (!['checked', 'unavailable'].includes(item?.status)) invalid();
      return { url: url(item.url), status: item.status, ...(item.reason === undefined ? {} : { reason: text(item.reason) }) };
    }),
    limitations: list(source.limitations, 30).map(value => text(value)),
  };
  if (report.fixes.length !== 3 || report.checks.length === 0 || Buffer.byteLength(JSON.stringify(report)) > 128000) invalid();
  return { email: input.email, report, reportUrl, marketingConsent: input.marketingConsent === true, requestId: input.requestId };
}

const escapeHtml = value => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const showScore = value => value === null ? 'Not scored — insufficient observable HTML' : `${value}/100`;
export function renderReport({ report, reportUrl, marketingConsent }) {
  const h = escapeHtml;
  const link = (href, label = href) => `<a href="${h(href)}">${h(label)}</a>`;
  const htmlEvidence = items => items.length ? `<ul>${items.map(item => `<li>${h(item.text)} — ${link(item.url)}</li>`).join('')}</ul>` : '<p>No additional evidence was available.</p>';
  const plainEvidence = items => items.length ? items.map(item => `  Evidence: ${item.text}\n  Source: ${item.url}`).join('\n') : '  No additional evidence was available.';
  const consent = marketingConsent
    ? 'You also requested marketing follow-up. This records your affirmative request; it does not change subscription status.'
    : 'You did not request marketing follow-up. Your existing marketing preferences have not been changed.';
  const intro = 'You requested this one-time website audit report. Report delivery is separate from marketing consent.';
  const expiry = 'The web report link may expire after 24 hours. Your complete report is included in this email.';
  const html = `<!doctype html><html lang="en"><body><h1>Your requested website audit</h1><p>${intro}</p><p>${h(consent)}</p>
<p>Website: ${link(report.url)}<br>Service: ${h(report.service)}<br>Area: ${h(report.area)}<br>Report generated: ${h(report.generatedAt)}</p>
<h2>Observed HTML score: ${h(showScore(report.score))}</h2><p>${HTML_LIMITATION}</p>
<h2>Category results</h2>${report.categories.map(item => `<h3>${h(item.label)}: ${h(showScore(item.score))}</h3><p>${h(item.summary)}</p>`).join('')}
<h2>Three prioritized fixes</h2><ol>${report.fixes.map(item => `<li><h3>${h(item.title)}</h3><p>Why: ${h(item.why)}</p><p>Recommended change: ${h(item.action)}</p>${htmlEvidence(item.evidence)}</li>`).join('')}</ol>
<h2>All checks and evidence</h2>${report.checks.map(item => `<h3>${h(item.label)} — ${h(item.status)}</h3>${htmlEvidence(item.evidence)}<p>Recommendation: ${h(item.recommendation)}</p>`).join('')}
<h2>Pages reviewed</h2><ul>${report.pages.map(item => `<li>${link(item.url)} — ${h(item.status)}${item.reason ? `: ${h(item.reason)}` : ''}</li>`).join('')}</ul>
<h2>Limitations</h2><ul><li>${HTML_LIMITATION}</li>${report.limitations.map(item => `<li>${h(item)}</li>`).join('')}</ul>
<p>${link(reportUrl, 'Open the web report')}. ${expiry}</p><p>${link(bookingUrl, 'Book a conversation about your report')}</p></body></html>`;
  const plain = [
    'YOUR REQUESTED WEBSITE AUDIT', intro, consent,
    `Website: ${report.url}\nService: ${report.service}\nArea: ${report.area}\nReport generated: ${report.generatedAt}`,
    `Observed HTML score: ${showScore(report.score)}`, HTML_LIMITATION,
    'CATEGORY RESULTS', ...report.categories.map(item => `${item.label}: ${showScore(item.score)}\n${item.summary}`),
    'THREE PRIORITIZED FIXES', ...report.fixes.map((item, index) => `${index + 1}. ${item.title}\nWhy: ${item.why}\nRecommended change: ${item.action}\n${plainEvidence(item.evidence)}`),
    'ALL CHECKS AND EVIDENCE', ...report.checks.map(item => `${item.label} — ${item.status}\n${plainEvidence(item.evidence)}\nRecommendation: ${item.recommendation}`),
    'PAGES REVIEWED', ...report.pages.map(item => `${item.url} — ${item.status}${item.reason ? `: ${item.reason}` : ''}`),
    'LIMITATIONS', HTML_LIMITATION, ...report.limitations,
    `Open the web report: ${reportUrl}\n${expiry}`, `Book a conversation about your report: ${bookingUrl}`,
  ].join('\n\n');
  return { html, text: plain };
}

async function responseJson(response, signal) {
  const reader = response.body?.getReader();
  if (!reader) throw new Error('Invalid provider response');
  const cancel = () => { void reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', cancel, { once: true });
  if (signal.aborted) cancel();
  let size = 0;
  const chunks = [];
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > 32768) { void reader.cancel().catch(() => {}); throw new Error('Invalid provider response'); }
      chunks.push(Buffer.from(value));
    }
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } finally { signal.removeEventListener('abort', cancel); reader.releaseLock(); }
}

// No provider retries. The only repeated CRM lookup resolves an explicit create conflict.
async function providerRequest(fetchImpl, endpoint, options, { crm, mutates }) {
  const controller = new AbortController();
  let response;
  let timer;
  try {
    return await Promise.race([
      (async () => {
        response = await fetchImpl(endpoint, { ...options, redirect: 'error', signal: controller.signal });
        if (!response || !Number.isInteger(response.status)) throw new Error('Invalid provider response');
        if (!response.ok) { void response.body?.cancel().catch(() => {}); return { status: response.status, data: null }; }
        return { status: response.status, data: await responseJson(response, controller.signal) };
      })(),
      new Promise((_, reject) => { timer = setTimeout(() => { controller.abort(); reject(new Error('Provider timeout')); }, DELIVERY_LIMITS.timeoutMs); }),
    ]);
  } catch {
    controller.abort();
    throw new DeliveryError(crm ? (mutates ? 'CRM_UNCERTAIN' : 'CRM_FAILED') : 'DELIVERY_UNCERTAIN');
  } finally { clearTimeout(timer); }
}

function contactId(data, code = 'CRM_FAILED') {
  if (typeof data?.id !== 'string' || !/^[1-9][0-9]{0,30}$/.test(data.id)) throw new DeliveryError(code);
  return data.id;
}

async function saveContact(input, config, fetchImpl) {
  const requestedAt = new Date().toISOString();
  const properties = {
    email: input.email,
    [config.hubspotReportProperty]: JSON.stringify({
      type: 'requested_website_audit_report', requestId: input.requestId, requestedAt,
      reportUrl: input.reportUrl, website: input.report.url, reportGeneratedAt: input.report.generatedAt,
      summary: `Observed HTML score: ${showScore(input.report.score)}. Three priorities: ${input.report.fixes.map(item => item.title).join('; ')}`,
    }),
  };
  if (input.marketingConsent === true) properties[config.hubspotConsentProperty] = JSON.stringify({ type: 'affirmative_marketing_follow_up_request', requested: true, requestedAt, requestId: input.requestId, source: 'website_audit_report_form' });
  const headers = { Authorization: `Bearer ${config.hubspotToken}`, 'Content-Type': 'application/json' };
  const lookup = () => providerRequest(fetchImpl, `${CONTACTS}/${encodeURIComponent(input.email)}?idProperty=email&properties=email`, { method: 'GET', headers }, { crm: true, mutates: false });
  const update = async id => {
    const result = await providerRequest(fetchImpl, `${CONTACTS}/${encodeURIComponent(id)}`, { method: 'PATCH', headers, body: JSON.stringify({ properties }) }, { crm: true, mutates: true });
    if (result.status < 200 || result.status >= 300) throw new DeliveryError('CRM_FAILED');
    if (contactId(result.data, 'CRM_UNCERTAIN') !== id) throw new DeliveryError('CRM_UNCERTAIN');
    return id;
  };
  const found = await lookup();
  if (found.status >= 200 && found.status < 300) return update(contactId(found.data));
  if (found.status !== 404) throw new DeliveryError('CRM_FAILED');
  const created = await providerRequest(fetchImpl, CONTACTS, { method: 'POST', headers, body: JSON.stringify({ properties }) }, { crm: true, mutates: true });
  if (created.status >= 200 && created.status < 300) return contactId(created.data, 'CRM_UNCERTAIN');
  if (created.status !== 409) throw new DeliveryError('CRM_FAILED');
  const raced = await lookup();
  if (raced.status < 200 || raced.status >= 300) throw new DeliveryError('CRM_FAILED');
  return update(contactId(raced.data));
}

// Caller authenticates report ownership and atomically reserves the full worst-case
// budget before entering this function. A failure is terminal for that requestId.
// delivered means accepted by Resend; it does not establish inbox receipt.
export async function deliverReport(input, { config, fetch: fetchImpl = globalThis.fetch } = {}) {
  validateDeliveryConfig(config);
  const request = validateRequest(input);
  if (typeof fetchImpl !== 'function') throw new DeliveryError('CONFIG_INVALID');
  const message = renderReport(request);
  const id = await saveContact(request, config, fetchImpl);
  const sent = await providerRequest(fetchImpl, EMAILS, {
    method: 'POST', headers: { Authorization: `Bearer ${config.resendApiKey}`, 'Content-Type': 'application/json', 'Idempotency-Key': `audit-report/${request.requestId}` },
    body: JSON.stringify({ from: config.emailFrom, to: [request.email], subject: 'Your requested website audit report', ...message }),
  }, { crm: false, mutates: true });
  if (sent.status < 200 || sent.status >= 300) throw new DeliveryError('DELIVERY_FAILED');
  if (typeof sent.data?.id !== 'string' || !/^[a-zA-Z0-9_-]{1,128}$/.test(sent.data.id)) throw new DeliveryError('DELIVERY_UNCERTAIN');
  return { delivered: true, providerId: sent.data.id, contactId: id };
}
