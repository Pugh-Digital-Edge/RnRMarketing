import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { normalizeTarget, scanWebsite } from '../../netlify/functions/lib/audit/scanner.mjs';

// These labels and URLs describe invented local data. They are never resolved
// or requested on the internet, even if a similarly named domain exists.
export const PREVIEW_FIXTURES = Object.freeze([
  Object.freeze({ url: 'https://ready.preview-restoration.com/', label: 'Fictional ready site — strong HTML signals', service: 'Water damage restoration', area: 'Austin, TX' }),
  Object.freeze({ url: 'https://gaps.preview-restoration.com/', label: 'Fictional gaps site — missing contact and area signals', service: 'Water damage restoration', area: 'Austin, TX' }),
  Object.freeze({ url: 'https://blocked.preview-restoration.com/', label: 'Fictional restricted site — secondary HTML unavailable', service: 'Water damage restoration', area: 'Austin, TX' }),
]);

const fictionalNotice = '<aside>LOCAL PREVIEW FIXTURE. This is an invented business and invented website content, served from local strings. No real website is being checked.</aside>';
const navigation = '<nav aria-label="Fixture pages"><a href="/contact/">Contact</a><a href="/service-area/">Service area</a><a href="/about/">About</a><a href="/services/">Services</a></nav>';
const document = (body, { title, viewport = true } = {}) => `<!doctype html><html lang="en"><head><meta charset="utf-8">${title ? `<title>${title}</title>` : ''}${viewport ? '<meta name="viewport" content="width=device-width, initial-scale=1">' : ''}</head><body>${fictionalNotice}${navigation}<main>${body}</main></body></html>`;

const readyPages = {
  '/': { body: document('<h1>Fictional water damage restoration in Austin</h1><p>This invented team describes water removal and drying for Austin homeowners.</p><a href="tel:+15125550123">Call the fictional team</a><h2>About our company</h2><p>Our example describes an insured team and IICRC certification. These are fictional claims, not real or verified credentials.</p>', { title: 'Fictional Ready Restoration | Austin Water Damage' }) },
  '/contact/': { body: document('<h1>Contact the fictional team</h1><p>This invented contact page is part of a local fixture.</p><a href="tel:+15125550123">512-555-0123 (fictional)</a><form id="contact-form" action="/contact/"><label>Your email <input type="email" name="email"></label><label>Message <textarea name="message"></textarea></label><button>Fixture button</button></form>', { title: 'Fictional Contact Page' }) },
  '/service-area/': { body: document('<h1>Fictional service area</h1><p>The invented business describes water damage restoration in Austin, Texas. This does not establish real service availability.</p>', { title: 'Fictional Austin Service Area' }) },
  '/about/': { body: document('<h1>About our company</h1><p>This is an invented company description for exercising the real HTML scanner locally. The fictional team explains its process, and sample trust wording includes insured and certified. No business identity or credential is real or verified.</p>', { title: 'About the Fictional Ready Team' }) },
  '/services/': { body: document('<h1>Water damage restoration</h1><p>The fictional service description explains water removal and drying. This content is fixed fixture data and does not change to match form inputs.</p><a href="/services/extra/">A sixth page is outside the five-page preview</a>', { title: 'Fictional Water Damage Service' }) },
};

const gapsPages = {
  '/': { body: document('<h1>Fictional property recovery team</h1><p>This fixed fixture contains a water damage restoration description.</p><p>Browse the sample pages to learn about the invented business.</p>', { viewport: false }) },
  '/contact/': { body: document('<h1>Contact the fictional business</h1><p>Use this invented message form. It is never submitted by the scanner.</p><form id="contact-form" action="/contact/"><label>Email <input type="email" name="email"></label><label>Message <textarea name="message"></textarea></label><button>Fixture button</button></form>', { title: 'Fictional Contact Page' }) },
  '/service-area/': { body: document('<h1>Fictional service area</h1><p>Ask the invented team to confirm coverage. This fixture intentionally offers no named city or region.</p>', { title: 'Fictional Coverage Information' }) },
  '/about/': { body: document('<h1>About our company</h1><p>This is an invented team description written only to exercise the local scanner. It explains who would discuss a property and describe the recovery process, without making credential or customer-evidence claims.</p>', { title: 'About the Fictional Gaps Team' }) },
  '/services/': { body: document('<h1>Water damage restoration</h1><p>This fictional business describes water removal and drying. The wording is fixed and will not automatically match a different selected service.</p>', { title: 'Fictional Recovery Services' }) },
};

const blockedPages = {
  '/': { body: document('<h1>Fictional restricted website</h1><p>This local fixture makes its four linked pages unavailable so the report can distinguish unknown findings from confirmed missing HTML signals.</p>', { title: 'Fictional Restricted Preview' }) },
  '/contact/': { status: 503 },
  '/service-area/': { status: 503 },
  '/about/': { status: 503 },
  '/services/': { status: 503 },
};

const fixturePages = new Map([
  [PREVIEW_FIXTURES[0].url, readyPages],
  [PREVIEW_FIXTURES[1].url, gapsPages],
  [PREVIEW_FIXTURES[2].url, blockedPages],
]);

function fixtureOnly() {
  const error = new Error('Local preview accepts only the three fictional fixture URLs shown on this page. No public website will be requested.');
  error.code = 'PREVIEW_FIXTURE_ONLY';
  return error;
}

/** Run the real bounded scanner against local strings; never use a network fallback. */
export async function scanPreviewFixture(input) {
  let target;
  try { target = normalizeTarget(input?.url); } catch { throw fixtureOnly(); }
  const pages = fixturePages.get(target);
  if (!pages) throw fixtureOnly();
  const hostname = new URL(target).hostname;
  const report = await scanWebsite({ url: target, service: input?.service, area: input?.area }, {
    // A synthetic globally routable answer satisfies the scanner's validation.
    // It is data only: the injected request below never opens a socket.
    lookup: async requestedHostname => {
      if (requestedHostname !== hostname) throw fixtureOnly();
      return [{ address: '93.184.215.14', family: 4 }];
    },
    request: (options, callback) => {
      if (options.hostname !== hostname || options.protocol !== 'https:' || options.method !== 'GET') throw fixtureOnly();
      const request = new EventEmitter();
      let response;
      let destroyed = false;
      request.destroy = () => { destroyed = true; response?.destroy(); };
      request.end = () => queueMicrotask(() => {
        if (destroyed) return;
        const page = Object.hasOwn(pages, options.path) ? pages[options.path] : { status: 404 };
        response = new PassThrough();
        response.statusCode = page.status || 200;
        response.headers = { 'content-type': 'text/html; charset=utf-8', 'content-length': String(Buffer.byteLength(page.body || '')) };
        callback(response);
        if (!destroyed && !response.destroyed) response.end(page.body || '');
      });
      return request;
    },
  });
  return {
    ...report,
    limitations: [
      'LOCAL PREVIEW ONLY: all page content and business details are fictional local fixture data. No real website, DNS service, email, CRM, or paid provider was contacted.',
      ...report.limitations,
    ],
  };
}
