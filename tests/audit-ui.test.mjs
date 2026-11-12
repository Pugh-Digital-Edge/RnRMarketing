import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/website-audit.ts', import.meta.url), 'utf8');
const script = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
}).outputText;

class Element {
  constructor(tagName = 'div') {
    this.tagName = tagName.toUpperCase(); this.dataset = {}; this.style = {};
    this.children = []; this.attributes = new Map(); this.handlers = new Map();
    this.hidden = false; this.disabled = false; this.value = ''; this.text = '';
    this.fields = new Map(); this.focused = false;
  }
  set textContent(value) { this.text = String(value); this.children = []; }
  get textContent() { return this.text + this.children.map(child => child.textContent).join(''); }
  set innerHTML(_value) { throw new Error('Untrusted report content must never enter innerHTML'); }
  get firstElementChild() { return this.children[0] ?? null; }
  get options() { return this.children; }
  append(...children) { this.children.push(...children); }
  replaceChildren(...children) { this.text = ''; this.children = children; }
  setAttribute(name, value) { this.attributes.set(name, String(value)); }
  removeAttribute(name) { this.attributes.delete(name); }
  addEventListener(name, callback) {
    if (!this.handlers.has(name)) this.handlers.set(name, []);
    this.handlers.get(name).push(callback);
  }
  async dispatch(name) {
    for (const callback of this.handlers.get(name) ?? []) await callback({ preventDefault() {} });
  }
  focus() { this.focused = true; }
  scrollIntoView() { this.scrolled = true; }
  reportValidity() { return true; }
}

const selectors = [
  '[data-audit-form]', '[data-audit-submit]', '[data-audit-availability]', '[data-audit-error]', '#audit-url',
  '[data-audit-progress]', '#audit-progress-title', '[data-audit-progress-text]', '[data-audit-resume]',
  '[data-audit-resume-text]', '[data-audit-check-again]', '[data-audit-report]', '#audit-report-title',
  '[data-audit-email-form]', '[data-audit-email-submit]', '[data-audit-email-status]', '[data-audit-email-error]',
  "[data-audit-bot='scan']", "[data-audit-bot='report']", '[data-audit-sample]', '[data-audit-stop]',
  '[data-report-kind]', '[data-report-demo]', '[data-report-context]', '[data-report-score]',
  '[data-report-score-caption]', '[data-report-categories]', '[data-report-fixes]', '[data-report-checks]',
  '[data-report-pages]', '[data-report-limitations]', '[data-report-delivery-note]',
  '#audit-service', '#audit-area', '[data-audit-fixture]', '[data-report-local]',
  '[data-audit-local-banner]', '[data-audit-fixture-field]', '[data-audit-form-title]',
  '[data-audit-form-copy]', '[data-audit-intro-note]', '[data-audit-url-label]', '#audit-url-help',
  '#audit-email-title', '[data-audit-email-label]', '#audit-email', '[data-audit-marketing-field]',
  '#audit-marketing', '[data-audit-email-privacy]', '[data-audit-local-delivery-help]', '[data-audit-email-button-label]',
  '[data-audit-lede]', '[data-audit-panel-eyebrow]',
];
const drain = async () => { for (let index = 0; index < 12; index += 1) await Promise.resolve(); };
const descendants = element => element.children.flatMap(child => [child, ...descendants(child)]);
const response = (data, { status = 200, retryAfter } = {}) => ({
  ok: status >= 200 && status < 300, status,
  headers: { get: name => name.toLowerCase() === 'retry-after' ? retryAfter ?? null : null,
    has: name => name.toLowerCase() === 'retry-after' && retryAfter !== undefined },
  json: async () => data,
});

function setup({ enabled = false, reportEnabled = true, reportLink, config, configurationResponse, hostname = 'agency.example', handle = () => response({}) } = {}) {
  const elements = new Map(selectors.map(selector => [selector, new Element()]));
  const app = new Element(); app.querySelector = selector => elements.get(selector) ?? null;
  const document = { querySelector: selector => selector === '[data-website-audit]' ? app : null,
    createElement: tag => new Element(tag), head: new Element('head') };
  elements.get('[data-audit-submit]').append(new Element('span'));
  elements.get('[data-audit-form]').fields = new Map([['service', 'water damage restoration'], ['area', ' Tampa, FL ']]);
  elements.get('[data-audit-email-form]').fields = new Map([['email', ' owner@example.com ']]);
  elements.get('#audit-url').value = 'your-restoration.com';
  for (const selector of ['[data-audit-local-banner]', '[data-audit-fixture-field]', '[data-report-local]', '[data-audit-local-delivery-help]']) elements.get(selector).hidden = true;
  let now = Date.parse('2026-11-05T12:00:00Z'), nextTimer = 0;
  const timers = new Map(), widgets = new Map(), requests = [], windowHandlers = new Map();
  class ClockDate extends Date { constructor(...args) { super(...(args.length ? args : [now])); } static now() { return now; } }
  const window = {
    location: { hostname, origin: `http://${hostname}:4321` },
    ...(reportLink ? { rrAuditReportLink: reportLink } : {}),
    setTimeout(callback, delay = 0) { const id = ++nextTimer; timers.set(id, { at: now + Number(delay), callback }); return id; },
    clearTimeout(id) { timers.delete(id); },
    addEventListener(name, callback) { windowHandlers.set(name, callback); },
    turnstile: { render(container, options) {
      const kind = container === elements.get("[data-audit-bot='scan']") ? 'scan' : 'report';
      widgets.set(kind, options); return kind;
    }, reset() {} },
  };
  const context = { exports: {}, document, window, URL, Date: ClockDate, AbortController,
    FormData: class { constructor(form) { this.fields = form.fields; this.form = form; } get(name) {
      if (this.form === elements.get('[data-audit-form]') && ['service', 'area'].includes(name)) return elements.get(`#audit-${name}`).value || this.fields.get(name) || null;
      return this.fields.get(name) ?? null;
    } },
    fetch: async (url, options) => {
      requests.push({ url, options });
      if (requests.length === 1) return configurationResponse ?? response(config ?? { enabled, reportEnabled, mode: enabled ? 'live' : 'disabled', ...(enabled ? { botSiteKey: 'public-site-key' } : {}) });
      return handle(url, options, requests);
    } };
  vm.createContext(context); vm.runInContext(script, context); context.exports.setupWebsiteAudit();
  return {
    exports: context.exports, app, document, requests, widgets, timers, window,
    get: selector => elements.get(selector),
    solve(kind) { assert.ok(widgets.has(kind), `${kind} security widget is mounted`); widgets.get(kind).callback(`${kind}-verification-token`); },
    async tick(milliseconds) {
      const end = now + milliseconds;
      for (let count = 0; count < 200; count += 1) {
        const next = [...timers].filter(([, timer]) => timer.at <= end).sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) { now = end; await drain(); return; }
        now = next[1].at; timers.delete(next[0]); next[1].callback(); await drain();
      }
      throw new Error('Timer queue exceeded the test safety cap');
    },
    pagehide() { windowHandlers.get('pagehide')?.(); },
  };
}

async function scan(ui) {
  await drain(); ui.solve('scan'); await ui.get('[data-audit-form]').dispatch('submit'); await drain();
}

function completeReport(ui, overrides = {}) {
  return { ...structuredClone(ui.exports.sampleAuditReport), url: 'https://real.example/', generatedAt: '2026-11-05T12:00:00Z', ...overrides };
}

test('homepage input accepts a bare domain and rejects credential-bearing or non-HTTP URLs', () => {
  const { normalizeAuditUrl } = setup().exports;
  assert.equal(normalizeAuditUrl(' company.example/#contact '), 'https://company.example/');
  assert.equal(normalizeAuditUrl('http://company.example/'), 'http://company.example/');
  for (const url of ['', 'localhost', 'ftp://company.example/', 'https://user:password@company.example/', 'javascript:alert(1)']) {
    assert.throws(() => normalizeAuditUrl(url));
  }
});

test('Retry-After supports dates and seconds without polling before the requested interval', () => {
  const { auditRetryDelay } = setup().exports;
  const now = Date.parse('2026-11-05T12:00:00Z');
  assert.equal(auditRetryDelay('9'), 9000);
  assert.equal(auditRetryDelay('0.5'), 1000);
  assert.equal(auditRetryDelay('Thu, 05 Nov 2026 12:00:15 GMT', now), 15000);
  assert.equal(auditRetryDelay('invalid'), 2500);
  assert.equal(auditRetryDelay(null), 2500);
});

test('private report fragment is removed synchronously before the shared tracking block', () => {
  const page = readFileSync(new URL('../src/pages/website-audit.astro', import.meta.url), 'utf8');
  const layout = readFileSync(new URL('../src/layouts/BaseLayout.astro', import.meta.url), 'utf8');
  const scrubber = page.match(/<script is:inline slot="before-tracking">([\s\S]*?)<\/script>/)?.[1];
  assert.ok(scrubber);
  assert.ok(layout.indexOf('<slot name="before-tracking" />') < layout.indexOf("gtag('config'"));
  let replacement;
  const window = { location: { hash: '#report=job_1&token=private.token', pathname: '/website-audit/', search: '?source=email' },
    history: { state: {}, replaceState(_state, _title, url) { replacement = url; } } };
  vm.runInNewContext(scrubber, { window, URLSearchParams });
  assert.equal(replacement, '/website-audit/?source=email');
  assert.equal(window.rrAuditReportLink.jobId, 'job_1');
  assert.equal(window.rrAuditReportLink.accessToken, 'private.token');
  assert.doesNotMatch(replacement, /private|token|report=/);
});

test('private report links resume with bearer authorization and consume credentials from the global', async () => {
  let ui;
  ui = setup({ enabled: true, reportEnabled: false, reportLink: { jobId: 'job_from_email', accessToken: 'private.token' },
    handle: () => response({ status: 'complete', report: completeReport(ui) }) });
  assert.equal('rrAuditReportLink' in ui.window, false);
  await drain(); await ui.tick(0);
  assert.equal(ui.requests.length, 2);
  assert.equal(ui.requests[1].url, '/.netlify/functions/website-audit?jobId=job_from_email');
  assert.equal(ui.requests[1].options.headers.Authorization, 'Bearer private.token');
  assert.equal(ui.requests[1].options.method, undefined);
  assert.equal(ui.get('[data-audit-report]').hidden, false);
  assert.doesNotMatch(ui.get('[data-report-context]').textContent, /private.token/);
});

test('report parser rejects incomplete results and bounds unknown or oversized data', () => {
  const ui = setup(), report = completeReport(ui, { score: 200 });
  report.categories[0].score = NaN;
  report.checks[0].status = 'invented';
  report.checks[0].evidence = Array.from({ length: 30 }, () => ({ url: 'https://real.example/', text: 'x'.repeat(4000) }));
  report.fixes = Array.from({ length: 40 }, () => report.fixes[0]);
  const parsed = ui.exports.parseAuditReport(report);
  assert.equal(parsed.score, null); assert.equal(parsed.categories[0].score, null);
  assert.equal(parsed.checks[0].status, 'unknown'); assert.equal(parsed.checks[0].evidence.length, 8);
  assert.equal(parsed.checks[0].evidence[0].text.length, 1800); assert.equal(parsed.fixes.length, 3);
  assert.throws(() => ui.exports.parseAuditReport({ version: 1, url: 'https://real.example/' }), /incomplete report/);
});

test('disabled setup offers a fixed fictional sample without submitting or collecting an email', async () => {
  const ui = setup(); await drain();
  assert.equal(ui.get('[data-audit-submit]').disabled, true);
  assert.match(ui.get('[data-audit-availability]').textContent, /not available/);
  await ui.get('[data-audit-form]').dispatch('submit');
  await ui.get('[data-audit-sample]').dispatch('click');
  assert.equal(ui.requests.length, 1);
  assert.equal(ui.document.head.children.length, 0);
  assert.equal(ui.get('[data-audit-report]').hidden, false);
  assert.match(ui.get('[data-report-kind]').textContent, /fictional/);
  assert.match(ui.get('[data-report-context]').textContent, /https:\/\/example\.test\//);
  assert.doesNotMatch(ui.get('[data-report-context]').textContent, /your-restoration/);
  assert.equal(ui.get('[data-report-demo]').hidden, false);
  assert.equal(ui.get('[data-audit-email-form]').hidden, true);
  assert.equal(ui.get('[data-audit-email-submit]').disabled, true);
  assert.equal(ui.get('#audit-report-title').focused, true);
  assert.equal(ui.get('#audit-report-title').textContent, 'Sample website snapshot.');
  assert.equal(ui.get('#audit-email-title').textContent, 'About report delivery.');
  assert.equal(descendants(ui.get('[data-report-checks]')).filter(node => node.tagName === 'A').length, 0);
});

test('static production preview explains the hold before the disabled inputs and promises no delivery', () => {
  const page = readFileSync(new URL('../src/pages/website-audit.astro', import.meta.url), 'utf8');
  assert.match(page, /description="Explore a fictional restoration website audit[^"\n]*Live scanning is not available yet\."/);
  assert.match(page, /data-audit-form-title>Preview the website audit\.<\/h2>/);
  assert.match(page, /data-audit-intro-note>Preview only\. No website is scanned and no email is collected\./);
  const availability = page.match(/<p\b[^>]*data-audit-availability[^>]*>([^<]+)<\/p>/)?.[0];
  assert.ok(availability);
  assert.ok(page.indexOf(availability) < page.indexOf('<form data-audit-form'), 'hold is visible before the form, including on mobile');
  assert.match(availability, /No website will be scanned and no email address is collected/);
  assert.match(availability, /Live scanning and email delivery are not available yet/);
  assert.match(page, /data-audit-form aria-describedby="audit-availability"/);
  for (const id of ['audit-url', 'audit-service', 'audit-area']) {
    assert.match(page.match(new RegExp(`<(?:input|select)\\b[^>]*id="${id}"[^>]*>`))?.[0] ?? '', /\sdisabled(?:\s|\/?>)/);
  }
  assert.match(page, /data-audit-submit disabled><span>Live scanning unavailable<\/span>/);
  assert.match(page, /data-audit-sample>Explore the fictional sample /);
  assert.match(page, /id="audit-email-title">About report delivery\.<\/h3>/);
});

test('pending, disabled, incomplete live config, and failed setup all retain honest preview copy', async () => {
  let finishConfiguration;
  const pending = setup({ configurationResponse: new Promise(resolve => { finishConfiguration = resolve; }) });
  for (const ui of [pending, setup(),
    setup({ config: { enabled: true, reportEnabled: true, mode: 'live' } }),
    setup({ config: { enabled: false, reportEnabled: true, mode: 'live', botSiteKey: 'public-key' } }),
    setup({ configurationResponse: response({ message: 'Service unavailable' }, { status: 503 }) })]) {
    await drain();
    assert.equal(ui.get('[data-audit-form-title]').textContent, 'Preview the website audit.');
    assert.match(ui.get('[data-audit-form-copy]').textContent, /fictional report/);
    assert.match(ui.get('[data-audit-intro-note]').textContent, /No website is scanned and no email is collected/);
    assert.match(ui.get('[data-audit-availability]').textContent, /No website will be scanned and no email address is collected/);
    assert.equal(ui.get('[data-audit-submit]').firstElementChild.textContent, 'Live scanning unavailable');
    assert.equal(ui.get('[data-audit-submit]').disabled, true);
    for (const selector of ['#audit-url', '#audit-service', '#audit-area']) assert.equal(ui.get(selector).disabled, true);
    await ui.get('[data-audit-form]').dispatch('submit');
    assert.equal(ui.requests.length, 1); assert.equal(ui.widgets.size, 0);
  }
  finishConfiguration(response({ enabled: false, reportEnabled: false, mode: 'disabled' })); await drain();
});

test('working scan copy and fields are restored only after confirmed live configuration', async () => {
  let finishConfiguration, ui;
  ui = setup({ configurationResponse: new Promise(resolve => { finishConfiguration = resolve; }), handle: () => response({
    jobId: 'job_live', accessToken: 'live_token', status: 'complete', report: completeReport(ui),
  }) });
  assert.equal(ui.get('[data-audit-submit]').firstElementChild.textContent, 'Live scanning unavailable');
  finishConfiguration(response({ enabled: true, reportEnabled: true, mode: 'live', botSiteKey: 'public-key' })); await drain();
  assert.equal(ui.get('[data-audit-form-title]').textContent, 'Start with your homepage.');
  assert.equal(ui.get('[data-audit-intro-note]').textContent, 'See your results first. Email is optional.');
  assert.match(ui.get('[data-audit-lede]').textContent, /your website giving a property owner/);
  assert.equal(ui.get('[data-audit-submit]').firstElementChild.textContent, 'Check my website');
  assert.equal(ui.get('[data-audit-submit]').disabled, true, 'verification remains required');
  for (const selector of ['#audit-url', '#audit-service', '#audit-area']) assert.equal(ui.get(selector).disabled, false);
  await scan(ui);
  assert.equal(ui.get('#audit-report-title').textContent, 'Your website snapshot.');
  assert.equal(ui.get('#audit-email-title').textContent, 'Send the report to your inbox.');
  await ui.get('[data-audit-sample]').dispatch('click');
  assert.equal(ui.get('#audit-report-title').textContent, 'Sample website snapshot.');
  assert.equal(ui.get('#audit-email-title').textContent, 'About report delivery.');
  const withoutDelivery = setup({ enabled: true, reportEnabled: false }); await drain();
  assert.equal(withoutDelivery.get('[data-audit-intro-note]').textContent, 'See your results here. Email delivery is not available in this setup.');
});

test('live evidence remains text and only safe public HTTP links become anchors', async () => {
  let ui;
  ui = setup({ enabled: true, handle: () => {
    const report = completeReport(ui);
    report.checks = [report.checks[0]];
    report.checks[0].label = '<img src=x onerror=alert(1)>';
    report.checks[0].evidence = [
      { url: 'javascript:alert(1)', text: '<script>steal()</script>' },
      { url: 'https://user:secret@real.example/', text: 'Credential-bearing URL' },
      { url: 'https://real.example/contact/', text: 'A real HTML signal' },
    ];
    return response({ jobId: 'job_1', accessToken: 'private_token', status: 'complete', report });
  } });
  await scan(ui);
  const checks = ui.get('[data-report-checks]'), nodes = descendants(checks);
  assert.match(checks.textContent, /<img src=x onerror=alert\(1\)>/);
  assert.match(checks.textContent, /<script>steal\(\)<\/script>/);
  const links = nodes.filter(node => node.tagName === 'A');
  assert.equal(links.length, 1);
  assert.ok(links.every(link => link.href.startsWith('https://') && !link.href.includes('@')));
  assert.equal(links[0].href, 'https://real.example/contact/');
  assert.equal(links[0].target, '_blank'); assert.equal(links[0].rel, 'noopener noreferrer');
  assert.equal(nodes.some(node => node.tagName === 'SCRIPT' || node.tagName === 'IMG'), false);
  assert.equal(ui.get('[data-report-demo]').hidden, true);
});

test('email delivery requires an actual delivered receipt and marketing is a separate optional choice', async () => {
  const page = readFileSync(new URL('../src/pages/website-audit.astro', import.meta.url), 'utf8');
  const consent = page.match(/<input\b[^>]*\bid="audit-marketing"[^>]*>/)?.[0];
  assert.ok(consent, 'a separate marketing preference is visible');
  assert.match(consent, /type="checkbox"/);
  assert.doesNotMatch(consent, /\s(?:checked|required)(?:\s|=|\/?>)/);
  const scanForm = page.match(/<form\b[^>]*data-audit-form[^>]*>([\s\S]*?)<\/form>/)?.[1];
  assert.ok(scanForm); assert.doesNotMatch(scanForm, /type="email"/);
  let ui, delivered = false;
  ui = setup({ enabled: true, handle: (url, options) => url.endsWith('/audit-report')
    ? response({ delivered, message: 'Delivery provider unavailable.' })
    : response({ jobId: 'job_1', accessToken: 'private_token', status: 'complete', report: completeReport(ui) }) });
  await scan(ui); ui.solve('report');
  await ui.get('[data-audit-email-form]').dispatch('submit');
  const firstPayload = JSON.parse(ui.requests.at(-1).options.body);
  assert.equal(firstPayload.marketingConsent, false);
  assert.equal(firstPayload.email, 'owner@example.com'); assert.equal('name' in firstPayload, false);
  assert.equal(firstPayload.jobId, 'job_1'); assert.equal(firstPayload.accessToken, 'private_token');
  assert.equal(firstPayload.botToken, 'report-verification-token');
  assert.equal(ui.get('[data-audit-email-status]').textContent, '');
  assert.match(ui.get('[data-audit-email-error]').textContent, /Delivery provider unavailable/);
  assert.equal(ui.get('[data-audit-email-form]').hidden, false);
  assert.equal(ui.get('[data-audit-email-submit]').disabled, true, 'each attempt needs a fresh security token');
  delivered = true; ui.get('[data-audit-email-form]').fields.set('marketingConsent', 'on'); ui.solve('report');
  await ui.get('[data-audit-email-form]').dispatch('submit');
  assert.equal(JSON.parse(ui.requests.at(-1).options.body).marketingConsent, true);
  assert.match(ui.get('[data-audit-email-status]').textContent, /accepted for delivery/);
  assert.equal(ui.get('[data-audit-email-form]').hidden, true);
  assert.equal(ui.get('[data-audit-email-submit]').disabled, true);
});

test('queued status respects Retry-After and a late response cannot replace the sample', async () => {
  let finishPoll;
  const ui = setup({ enabled: true, handle: (_url, options) => options.method === 'POST'
    ? response({ jobId: 'job_1', accessToken: 'private_token', status: 'queued' }, { retryAfter: '6' })
    : new Promise(resolve => { finishPoll = resolve; }) });
  await scan(ui);
  assert.match(ui.get('#audit-progress-title').textContent, /queued/);
  assert.match(ui.get('[data-audit-progress-text]').textContent, /6 seconds/);
  await ui.tick(5999); assert.equal(ui.requests.length, 2);
  await ui.tick(1); assert.equal(ui.requests.length, 3);
  const poll = ui.requests.at(-1);
  assert.equal(poll.url, '/.netlify/functions/website-audit?jobId=job_1');
  assert.equal(poll.options.headers.Authorization, 'Bearer private_token');
  await ui.get('[data-audit-sample]').dispatch('click');
  assert.equal(poll.options.signal.aborted, true);
  finishPoll(response({ status: 'complete', report: completeReport(ui) })); await drain();
  assert.match(ui.get('[data-report-kind]').textContent, /fictional/);
  assert.match(ui.get('[data-report-context]').textContent, /example\.test/);
  assert.equal(ui.get('[data-audit-progress]').hidden, true);
});

test('automatic polling is bounded and offers a manual status check without losing the job', async () => {
  const ui = setup({ enabled: true, handle: (_url, options) => response({
    ...(options.method === 'POST' ? { jobId: 'job_1', accessToken: 'private_token' } : {}), status: 'queued',
  }, { retryAfter: '1' }) });
  await scan(ui); await ui.tick(30_000);
  assert.equal(ui.requests.filter(request => request.url.includes('?jobId=')).length, 24);
  assert.equal(ui.get('[data-audit-progress]').hidden, true);
  assert.equal(ui.get('[data-audit-resume]').hidden, false);
  assert.match(ui.get('[data-audit-resume-text]').textContent, /Automatic checks have stopped/);
  assert.equal(ui.get('[data-audit-check-again]').hidden, false);
  await ui.tick(180_000);
  assert.equal(ui.requests.length, 26, 'no background polls continue after the cap');
});

test('server cooldown is visible and report delivery capability stays independent from scanning', async () => {
  let ui;
  ui = setup({ enabled: true, reportEnabled: false, handle: () => response({ jobId: 'job_1', accessToken: 'private_token', status: 'complete', report: completeReport(ui) }) });
  await scan(ui);
  assert.equal(ui.get('[data-audit-email-form]').hidden, true);
  assert.equal(ui.widgets.has('report'), false);
  assert.match(ui.get('[data-report-delivery-note]').textContent, /not available in this setup/);
  const limited = setup({ enabled: true, handle: () => response({ error: 'Please slow down.' }, { status: 429, retryAfter: '10' }) });
  await scan(limited);
  assert.match(limited.get('[data-audit-error]').textContent, /Please slow down/);
  assert.match(limited.get('[data-audit-error]').textContent, /wait 10 seconds/);
  limited.solve('scan'); assert.equal(limited.get('[data-audit-submit]').disabled, true);
  await limited.tick(10_000); assert.equal(limited.get('[data-audit-submit]').disabled, false);
});

const fixtures = [
  { url: 'http://fixture.test/water/', label: 'Water restoration · clear contact', service: 'water damage restoration', area: 'Example City, FL' },
  { url: 'http://fixture.test/fire/', label: 'Fire restoration · contact gaps', service: 'fire damage restoration', area: 'Example County, FL' },
];
const localConfig = overrides => ({ enabled: true, reportEnabled: true, mode: 'local', localPreview: true, fixtures, ...overrides });

test('local bypass requires an exact loopback hostname and the explicit server flags', async () => {
  const { isTrustedLocalPreview } = setup().exports;
  for (const hostname of ['localhost', '127.0.0.1', '[::1]']) assert.equal(isTrustedLocalPreview(hostname, localConfig()), true);
  for (const hostname of ['localhost.example.com', 'example.localhost', '127.0.0.2', '::1', 'agency.example', 'LOCALHOST', 'localhost.']) {
    assert.equal(isTrustedLocalPreview(hostname, localConfig()), false, hostname);
  }
  for (const override of [{ localPreview: false }, { enabled: false }, { mode: 'live' }, { localPreview: 'true' }]) {
    assert.equal(isTrustedLocalPreview('localhost', localConfig(override)), false);
  }
  for (const options of [{ hostname: 'agency.example', config: localConfig({ botSiteKey: 'should-not-mount' }) },
    { hostname: 'localhost', config: localConfig({ localPreview: false }) }]) {
    const ui = setup(options); await drain();
    assert.equal(ui.get('[data-audit-submit]').disabled, true);
    assert.equal(ui.get('[data-audit-local-banner]').hidden, true);
    assert.equal(ui.widgets.size, 0); assert.equal(ui.document.head.children.length, 0);
    assert.match(ui.get('[data-audit-availability]').textContent, /unavailable on this address/);
    await ui.get('[data-audit-form]').dispatch('submit');
    assert.equal(ui.requests.length, 1);
  }
});

test('local fixture selection fills fields and runs the scanner without loading external verification', async () => {
  let ui;
  ui = setup({ hostname: 'localhost', config: localConfig({ csrfToken: 'local-csrf-proof' }), handle: () => response({
    jobId: 'fixture_job', accessToken: 'fixture_token', status: 'complete', report: completeReport(ui, { url: fixtures[1].url }),
  }) });
  await drain();
  assert.equal(ui.get('[data-audit-local-banner]').hidden, false);
  assert.equal(ui.get('[data-audit-fixture-field]').hidden, false);
  assert.equal(ui.get('[data-audit-form-title]').textContent, 'Try a local fixture website.');
  for (const selector of ['#audit-url', '#audit-service', '#audit-area']) assert.equal(ui.get(selector).disabled, false);
  assert.equal(ui.get('[data-audit-fixture]').children.length, 2);
  assert.equal(ui.get('#audit-url').value, fixtures[0].url);
  assert.equal(ui.get('#audit-url').readOnly, true);
  assert.equal(ui.get('#audit-service').value, fixtures[0].service);
  assert.equal(ui.get('#audit-area').value, fixtures[0].area);
  ui.get('[data-audit-fixture]').value = '1'; await ui.get('[data-audit-fixture]').dispatch('change');
  assert.equal(ui.get('#audit-url').value, fixtures[1].url);
  assert.equal(ui.get('#audit-service').value, fixtures[1].service);
  assert.equal(ui.get('#audit-area').value, fixtures[1].area);
  assert.equal(ui.get('[data-audit-submit]').disabled, false);
  await ui.get('[data-audit-form]').dispatch('submit'); await drain();
  const scan = ui.requests[1];
  assert.deepEqual(JSON.parse(scan.options.body), { url: fixtures[1].url, service: fixtures[1].service, area: fixtures[1].area, botToken: 'local-preview' });
  assert.equal(scan.options.headers['X-Audit-Preview-CSRF'], 'local-csrf-proof');
  assert.match(ui.get('[data-report-kind]').textContent, /Local fixture scan/);
  assert.equal(ui.get('[data-report-local]').hidden, false);
  assert.equal(ui.get('[data-report-demo]').hidden, true);
  assert.equal(ui.get('#audit-report-title').textContent, 'Local fixture website snapshot.');
  assert.equal(ui.get('#audit-email-title').textContent, 'Keep a local report copy.');
  assert.equal(ui.widgets.size, 0); assert.equal(ui.document.head.children.length, 0);
  assert.equal(descendants(ui.get('[data-report-checks]')).some(element => element.tagName === 'A'), false);
  assert.equal(ui.get('[data-audit-email-submit]').disabled, false);
  assert.equal(ui.get('[data-audit-email-button-label]').textContent, 'Save report locally');
  assert.equal(ui.get('[data-audit-marketing-field]').hidden, true);
  assert.equal(ui.get('#audit-marketing').disabled, true);
  assert.equal(ui.get('[data-audit-email-privacy]').hidden, true);
  assert.equal(ui.get('[data-audit-local-delivery-help]').hidden, false);
  assert.match(ui.get('[data-report-delivery-note]').textContent, /No email is sent/);
});

test('local UI rejects changed fixture URLs and an empty fixture list without a scan request', async () => {
  const ui = setup({ hostname: '127.0.0.1', config: localConfig() }); await drain();
  ui.get('#audit-url').value = 'https://unlisted.example/';
  await ui.get('[data-audit-form]').dispatch('submit');
  assert.equal(ui.requests.length, 1);
  assert.match(ui.get('[data-audit-error]').textContent, /included preview website/);
  const empty = setup({ hostname: '[::1]', config: localConfig({ fixtures: [{ url: 'javascript:alert(1)', label: 'Invalid', service: 'water', area: 'FL' }] }) }); await drain();
  assert.equal(empty.get('[data-audit-submit]').disabled, true);
  assert.match(empty.get('[data-audit-availability]').textContent, /No preview fixtures/);
  await empty.get('[data-audit-form]').dispatch('submit'); assert.equal(empty.requests.length, 1);
});

test('local saves require a local receipt and a same-origin outbox URL, and never request marketing', async () => {
  let ui, receipt = { delivered: true };
  ui = setup({ hostname: 'localhost', config: localConfig(), handle: (url) => url.endsWith('/audit-report') ? response(receipt)
    : response({ jobId: 'fixture_job', accessToken: 'fixture_token', status: 'complete', report: completeReport(ui) }) });
  await drain(); await ui.get('[data-audit-form]').dispatch('submit'); await drain();
  ui.get('[data-audit-email-form]').fields.set('marketingConsent', 'on');
  await ui.get('[data-audit-email-form]').dispatch('submit');
  assert.match(ui.get('[data-audit-email-error]').textContent, /local report save was not confirmed/);
  assert.equal(ui.get('[data-audit-email-form]').hidden, false);
  assert.equal(ui.get('[data-audit-email-submit]').disabled, false, 'local attempts do not require an external widget');
  receipt = { previewSaved: true, previewReportUrl: 'https://external.example/__audit-preview/outbox/opaque' };
  await ui.get('[data-audit-email-form]').dispatch('submit');
  assert.match(ui.get('[data-audit-email-error]').textContent, /local report save was not confirmed/);
  receipt = { previewSaved: true, previewReportUrl: '/__audit-preview/outbox/local_123-opaque', message: 'Saved locally; no email sent' };
  await ui.get('[data-audit-email-form]').dispatch('submit');
  const payload = JSON.parse(ui.requests.at(-1).options.body);
  assert.equal(payload.botToken, 'local-preview'); assert.equal(payload.marketingConsent, false);
  assert.match(ui.get('[data-audit-email-status]').textContent, /Saved locally; no email sent/);
  assert.doesNotMatch(ui.get('[data-audit-email-status]').textContent, /accepted for delivery|inbox/);
  const link = ui.get('[data-audit-email-status]').children.find(element => element.tagName === 'A');
  assert.equal(link.href, '/__audit-preview/outbox/local_123-opaque');
  assert.equal(ui.get('[data-audit-email-form]').hidden, true);
  assert.equal(ui.get('[data-audit-email-submit]').disabled, true);
});

test('outbox receipt links permit relative or same-origin opaque paths only', () => {
  const { localReportHref } = setup().exports;
  const origin = 'http://localhost:4321';
  assert.equal(localReportHref('/__audit-preview/outbox/opaque_1', origin), '/__audit-preview/outbox/opaque_1');
  assert.equal(localReportHref(`${origin}/__audit-preview/outbox/opaque_1`, origin), '/__audit-preview/outbox/opaque_1');
  for (const href of ['//evil.example/__audit-preview/outbox/id', 'javascript:alert(1)', '/schedule/', '/__audit-preview/outbox/', '/__audit-preview/outbox/id?token=secret', '/__audit-preview/outbox/id#secret', 'http://user:pass@localhost:4321/__audit-preview/outbox/id']) {
    assert.equal(localReportHref(href, origin), null, href);
  }
});

test('a local preview receipt cannot satisfy live email delivery even if delivered is also true', async () => {
  let ui;
  ui = setup({ enabled: true, handle: url => url.endsWith('/audit-report')
    ? response({ delivered: true, previewSaved: true, previewReportUrl: '/__audit-preview/outbox/opaque', message: 'Saved locally; no email sent' })
    : response({ jobId: 'live_job', accessToken: 'live_token', status: 'complete', report: completeReport(ui) }) });
  await scan(ui); ui.solve('report'); await ui.get('[data-audit-email-form]').dispatch('submit');
  assert.match(ui.get('[data-audit-email-error]').textContent, /local preview receipt/);
  assert.equal(ui.get('[data-audit-email-status]').textContent, '');
  assert.equal(ui.get('[data-audit-email-form]').hidden, false);
});

test('local quota errors remain visible and honor the server retry interval', async () => {
  const ui = setup({ hostname: 'localhost', config: localConfig(), handle: () => response({ error: 'Local preview allows 3 scans per IP each day.' }, { status: 429, retryAfter: '60' }) });
  await drain(); await ui.get('[data-audit-form]').dispatch('submit');
  assert.match(ui.get('[data-audit-error]').textContent, /3 scans per IP each day/);
  assert.match(ui.get('[data-audit-error]').textContent, /wait 60 seconds/);
  assert.equal(ui.get('[data-audit-submit]').disabled, true);
  await ui.tick(60_000); assert.equal(ui.get('[data-audit-submit]').disabled, false);
  assert.equal(ui.widgets.size, 0);
});
