import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { PassThrough } from 'node:stream';
import { readFile } from 'node:fs/promises';
import { normalizeTarget, isPublicIp, scanWebsite, SCAN_LIMITS } from '../netlify/functions/lib/audit/scanner.mjs';
import { inspectHtml } from '../netlify/functions/lib/audit/analyze.mjs';

const ORIGIN = 'https://restoration-fixture.com';
const input = { url: ORIGIN, service: 'Water damage restoration', area: 'Austin, TX' };
const publicAnswers = [{ address: '93.184.215.14', family: 4 }, { address: '2606:4700:4700::1111', family: 6 }];
const fixture = async name => readFile(new URL(`./fixtures/audit/${name}.html`, import.meta.url), 'utf8');
const files = Object.fromEntries(await Promise.all(['home', 'contact', 'about', 'area', 'service'].map(async name => [name, await fixture(name)])));
const minimal = '<!doctype html><html><head></head><body><p>Welcome to our website.</p></body></html>';
const check = (report, id) => report.checks.find(item => item.id === id);

// No test opens a socket or resolves a real hostname. This transport exercises
// the same request options, stream events, cancellation, and DNS pinning hooks.
function harness(routes = {}, overrides = {}) {
  const requests = [];
  const responses = [];
  const lookups = [];
  const deps = {
    lookup: async (hostname, options) => { lookups.push({ hostname, options }); return publicAnswers.map(answer => ({ ...answer })); },
    request: (options, callback) => {
      requests.push(options);
      const request = new EventEmitter();
      request.destroyed = false;
      let response;
      request.destroy = () => { request.destroyed = true; response?.destroy(); };
      request.end = () => queueMicrotask(() => {
        if (request.destroyed) return;
        let route = typeof routes === 'function' ? routes(options, requests.length) : routes[`${options.protocol}//${options.hostname}${options.path}`] || routes[options.path];
        route ||= { status: 404 };
        if (route.error) return request.emit('error', new Error(route.error));
        if (route.stallHeaders) return;
        response = new PassThrough();
        responses.push(response);
        response.statusCode = route.status || 200;
        response.headers = { 'content-type': 'text/html; charset=utf-8', ...route.headers };
        callback(response);
        if (response.destroyed || route.stallBody) return;
        for (const chunk of route.chunks || [route.body || '']) {
          if (response.destroyed) return;
          response.write(chunk);
        }
        if (route.aborted) response.emit('aborted');
        else response.end();
      });
      return request;
    },
    now: () => Date.parse('2026-11-05T12:00:00Z'),
    ...overrides,
  };
  return { deps, requests, responses, lookups };
}

test('normalization visits a homepage rather than the supplied path or query', () => {
  assert.equal(normalizeTarget(' Restoration-Fixture.com/services/water/?secret=x#form '), `${ORIGIN}/`);
  assert.equal(normalizeTarget('http://restoration-fixture.com/deep/page'), 'http://restoration-fixture.com/');
  assert.equal(normalizeTarget('https://münchen-restoration.com/path'), 'https://xn--mnchen-restoration-m6b.com/');
});

test('normalization rejects protocols, credentials, ports, internal names, and disguised IP literals', () => {
  const denied = [
    'file:///etc/passwd', 'ftp://restoration-fixture.com', 'javascript:alert(1)',
    'https://user:password@restoration-fixture.com', 'https://@restoration-fixture.com',
    'https://restoration-fixture.com:443', 'http://restoration-fixture.com:80', 'https://restoration-fixture.com:8443',
    'https:restoration-fixture.com:443', 'https:/restoration-fixture.com:443', 'http:restoration-fixture.com:80',
    'localhost', 'https://localhost', 'https://foo.localhost', 'https://site.internal', 'https://printer.lan',
    'https://metadata.google.internal', 'https://site.local', 'https://site.home', 'https://site.test', 'https://site.example',
    'https://restoration-fixture.com.', 'https://singlelabel', 'https://%72estoration-fixture.com',
    'https://127.0.0.1', 'https://127.1', 'https://2130706433', 'https://0x7f000001', 'https://0177.0.0.1',
    'https://8.8.8.8', 'https://[::1]', 'https://[::ffff:127.0.0.1]',
    'https://restoration-fixture.com\\@127.0.0.1/', 'https://restoration-fixture.com/\ncontact',
    '', null, 'a'.repeat(2049),
  ];
  for (const url of denied) assert.throws(() => normalizeTarget(url), { code: 'INVALID_TARGET' }, String(url));
});

test('public IP classification excludes private, reserved, transition, mapped, and alternative address forms', () => {
  for (const address of ['8.8.8.8', '1.1.1.1', '93.184.215.14', '2606:4700:4700::1111', '2001:4860:4860::8888', '2600:1406:5e00:6::17ce:bc12']) assert.equal(isPublicIp(address), true, address);
  for (const address of [
    '0.0.0.0', '0.1.2.3', '10.0.0.1', '100.64.0.1', '100.127.255.255', '127.0.0.1', '169.254.169.254',
    '172.16.0.1', '172.31.255.255', '192.0.0.8', '192.0.2.1', '192.88.99.1', '192.168.1.1',
    '198.18.0.1', '198.19.0.1', '198.51.100.1', '203.0.113.1', '224.0.0.1', '240.0.0.1', '255.255.255.255',
    '127.1', '2130706433', '0x7f000001', '0177.0.0.1', '::', '::1', 'fc00::1', 'fd12::1', 'fe80::1', 'ff02::1',
    '::ffff:127.0.0.1', '::ffff:8.8.8.8', '::ffff:7f00:1', '64:ff9b::808:808', '2001::1', '2001:20::1',
    '2001:db8::1', '2002:808:808::1', '3ffe::1', '3fff::1', '3fff:fff::1', 'fe80::1%eth0', 'not-an-ip',
  ]) assert.equal(isPublicIp(address), false, address);
});

test('mixed public/private DNS answers reject the whole destination before any request', async () => {
  for (const address of ['127.0.0.1', '169.254.169.254', '10.0.0.1', '::ffff:127.0.0.1', '2002:7f00:1::']) {
    const h = harness({}, { lookup: async () => [...publicAnswers, { address, family: address.includes(':') ? 6 : 4 }] });
    const report = await scanWebsite(input, h.deps);
    assert.equal(h.requests.length, 0);
    assert.equal(report.score, null);
    assert.match(report.pages[0].reason, /exclusively to public/);
  }
});

test('empty, malformed, excessive, or inconsistent DNS answers fail closed', async () => {
  for (const answers of [[], undefined, { address: '8.8.8.8' }, [{ address: '8.8.8.8', family: 6 }], Array(33).fill(publicAnswers[0])]) {
    const h = harness({}, { lookup: async () => answers });
    const report = await scanWebsite(input, h.deps);
    assert.equal(h.requests.length, 0);
    assert.equal(report.score, null);
  }
});

test('request pins a validated address while preserving Host and TLS hostname', async () => {
  const answers = publicAnswers.map(answer => ({ ...answer }));
  const h = harness({ '/': { body: files.home } }, { lookup: async () => answers, limits: { maxPages: 1 } });
  await scanWebsite(input, h.deps);
  assert.equal(h.requests.length, 1);
  const options = h.requests[0];
  answers[0].address = '127.0.0.1'; // Resolver result mutation cannot change the pin.
  const pinned = await new Promise((resolve, reject) => options.lookup(options.hostname, {}, (error, address, family) => error ? reject(error) : resolve({ address, family })));
  assert.deepEqual(pinned, publicAnswers[0]);
  const all = await new Promise((resolve, reject) => options.lookup(options.hostname, { all: true }, (error, addresses) => error ? reject(error) : resolve(addresses)));
  assert.deepEqual(all, [publicAnswers[0]]);
  await assert.rejects(new Promise((resolve, reject) => options.lookup('other-company.com', {}, error => error ? reject(error) : resolve())), /Unexpected DNS/);
  assert.equal(options.hostname, 'restoration-fixture.com');
  assert.equal(options.servername, options.hostname);
  assert.equal(options.headers.Host, options.hostname);
  assert.equal(options.agent, false);
  assert.equal(options.rejectUnauthorized, true);
  assert.equal(options.method, 'GET');
  assert.equal(options.headers['Accept-Encoding'], 'identity');
  assert.equal(options.headers.Cookie, undefined);
});

test('every redirect revalidates DNS, preventing a public-to-private rebinding', async () => {
  let lookups = 0;
  const h = harness({ '/': { status: 302, headers: { location: '/home/' } } }, { lookup: async () => ++lookups === 1 ? publicAnswers : [{ address: '10.0.0.5', family: 4 }] });
  const report = await scanWebsite(input, h.deps);
  assert.equal(lookups, 2);
  assert.equal(h.requests.length, 1);
  assert.equal(report.score, null);
});

test('redirects reject other origins, downgrade, unsafe authority, actions, and query endpoints before following', async () => {
  for (const location of ['https://other-company.com/contact/', 'https://www.restoration-fixture.com/', 'http://restoration-fixture.com/', 'http://169.254.169.254/', 'https://restoration-fixture.com:443/', 'https://user@restoration-fixture.com/', '//127.1/', 'file:///etc/passwd', '/contact/?submit=yes', '/contact/delete/']) {
    const h = harness({ '/': { status: 302, headers: { location } } });
    const report = await scanWebsite(input, h.deps);
    assert.equal(h.requests.length, 1, location);
    assert.equal(report.score, null, location);
  }
});

test('homepage may upgrade HTTP to HTTPS while secondary pages stay on the resulting exact origin', async () => {
  const h = harness({
    'http://restoration-fixture.com/': { status: 301, headers: { location: `${ORIGIN}/` } },
    [`${ORIGIN}/`]: { body: '<title>Example</title><h1>Water damage</h1><a href="/contact/">Contact</a><a href="http://restoration-fixture.com/about/">About</a>' },
    [`${ORIGIN}/contact/`]: { body: files.contact },
  });
  const report = await scanWebsite({ ...input, url: 'http://restoration-fixture.com' }, h.deps);
  assert.equal(h.requests.length, 3);
  assert.equal(report.pages[0].url, `${ORIGIN}/`);
  assert.equal(check(report, 'https').status, 'pass');
});

test('a secondary HTTP page cannot upgrade origins through a redirect', async () => {
  const h = harness({
    '/': { body: '<h1>Example</h1><a href="/contact/">Contact</a>' },
    '/contact/': { status: 301, headers: { location: `${ORIGIN}/contact/` } },
  });
  const report = await scanWebsite({ ...input, url: 'http://restoration-fixture.com' }, h.deps);
  assert.equal(h.requests.length, 2);
  assert.equal(report.pages[1].status, 'unavailable');
});

test('encoded separators, malformed escaping, and double-encoded action paths are never requested', async () => {
  for (const path of ['/contact/%2564elete/', '/contact%2fdelete/', '/contact%252fdelete/', '/contact/%5cdelete/', '/contact/%zz/']) {
    const redirect = harness({ '/': { status: 302, headers: { location: path } } });
    assert.equal((await scanWebsite(input, redirect.deps)).score, null);
    assert.equal(redirect.requests.length, 1, path);
    const anchor = harness({ '/': { body: `<h1>Example</h1><a href="${path}">Contact</a>` } });
    await scanWebsite(input, anchor.deps);
    assert.equal(anchor.requests.length, 1, path);
  }
});

test('redirect loops and chains are bounded', async () => {
  const loop = harness({ '/': { status: 302, headers: { location: '/home/' } }, '/home/': { status: 302, headers: { location: '/' } } });
  assert.equal((await scanWebsite(input, loop.deps)).score, null);
  assert.equal(loop.requests.length, 2);
  const chain = harness(options => ({ status: 302, headers: { location: `${options.path}next/` } }));
  const report = await scanWebsite(input, chain.deps);
  assert.equal(chain.requests.length, SCAN_LIMITS.maxRedirects + 1);
  assert.match(report.pages[0].reason, /redirect limit/);
});

test('only homepage plus four relevant same-origin HTML pages are requested; no subresources or submissions', async () => {
  const h = harness({ '/': { body: files.home }, '/contact/': { body: files.contact }, '/service-area/': { body: files.area }, '/about/': { body: files.about }, '/services/': { body: files.service } });
  const report = await scanWebsite(input, h.deps);
  assert.deepEqual(h.requests.map(options => options.path), ['/', '/contact/', '/service-area/', '/about/', '/services/']);
  assert.equal(h.lookups.length, 5);
  assert.ok(h.lookups.every(lookup => lookup.options.all === true));
  assert.ok(h.requests.every(options => options.method === 'GET' && options.hostname === 'restoration-fixture.com'));
  assert.equal(report.pages.length, 5);
  assert.equal(report.pages.every(page => page.status === 'checked'), true);
  assert.equal(report.score, 100);
  assert.equal(report.fixes.length, 3);
  assert.equal(report.generatedAt, '2026-11-05T12:00:00.000Z');
  assert.equal(report.version, 1);
  assert.match(report.limitations.join(' '), /Visual\/mobile layout.*unverified/);
  assert.match(report.limitations.join(' '), /authenticity|independently verified/);
});

test('duplicate and fragment links are visited once, and secondary links are not recursively crawled', async () => {
  const h = harness({
    '/': { body: '<h1>Example</h1><a href="/contact/">Contact</a><a href="/contact/#team">Contact team</a><a href="/contact">Duplicate</a>' },
    '/contact/': { body: '<h1>Contact</h1><a href="/about/">About</a><a href="/services/">Services</a>' },
  });
  const report = await scanWebsite(input, h.deps);
  assert.equal(h.requests.length, 2);
  assert.equal(report.pages.length, 2);
});

test('request count remains bounded even when each selected page redirects', async () => {
  const h = harness(options => {
    if (options.path === '/') return { body: files.home };
    if ((options.path.match(/next/g) || []).length < 2) return { status: 302, headers: { location: `${options.path}next/` } };
    return { body: files.contact };
  }, { limits: { maxRequests: 5 } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(h.requests.length, 5);
  assert.ok(report.pages.some(page => page.reason?.includes('request limit')));
});

test('byte limits enforce announced and actual stream sizes including dishonest Content-Length', async () => {
  for (const route of [
    { headers: { 'content-length': '1000000' }, body: 'small' },
    { headers: { 'content-length': '1' }, chunks: ['<html>', 'x'.repeat(1000), '</html>'] },
    { chunks: [Buffer.alloc(50), Buffer.alloc(51)] },
  ]) {
    const h = harness({ '/': route }, { limits: { maxBytesPerPage: 100 } });
    const report = await scanWebsite(input, h.deps);
    assert.equal(report.score, null);
    assert.match(report.pages[0].reason, /byte limit/);
    assert.equal(h.responses[0].destroyed, true);
  }
});

test('the whole-scan byte budget is shared by all HTML pages', async () => {
  const home = '<h1>Water damage</h1><a href="/contact/">Contact</a>';
  const h = harness({ '/': { body: home }, '/contact/': { body: 'x'.repeat(100) } }, { limits: { maxTotalBytes: Buffer.byteLength(home) + 20 } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(report.pages[0].status, 'checked');
  assert.equal(report.pages[1].status, 'unavailable');
  assert.match(report.pages[1].reason, /byte limit/);
});

test('stalled DNS, headers, and response bodies have absolute deadlines', async () => {
  const dns = harness({}, { lookup: () => new Promise(() => {}), limits: { requestTimeoutMs: 15 } });
  const dnsReport = await scanWebsite(input, dns.deps);
  assert.equal(dns.requests.length, 0);
  assert.match(dnsReport.pages[0].reason, /timed out/);
  for (const route of [{ stallHeaders: true }, { stallBody: true }]) {
    const h = harness({ '/': route }, { limits: { requestTimeoutMs: 15 } });
    const report = await scanWebsite(input, h.deps);
    assert.match(report.pages[0].reason, /timed out/);
    if (h.responses.length) assert.equal(h.responses[0].destroyed, true);
  }
});

test('the total scan deadline includes DNS time and stops later page requests', async () => {
  let lookupCalls = 0;
  const h = harness({ '/': { body: files.home } }, { lookup: () => ++lookupCalls === 1 ? Promise.resolve(publicAnswers) : new Promise(() => {}), limits: { totalTimeoutMs: 20, requestTimeoutMs: 100 } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(h.requests.length, 1);
  assert.ok(report.pages.some(page => page.reason?.includes('time limit') || page.reason?.includes('timed out')));
});

test('non-HTML, encoded content, response errors, HTTP failures, and interrupted streams remain unavailable', async () => {
  for (const route of [
    { body: files.home, headers: { 'content-type': 'application/json' } },
    { body: files.home, headers: { 'content-encoding': 'gzip' } },
    { body: files.home, status: 403 }, { body: files.home, status: 500 },
    { error: 'certificate or connection failed' }, { body: files.home, aborted: true },
  ]) {
    const h = harness({ '/': route });
    const report = await scanWebsite(input, h.deps);
    assert.equal(report.score, null);
    assert.equal(report.pages[0].status, 'unavailable');
    assert.equal(report.checks.every(item => item.status === 'unknown'), true);
    assert.equal(report.fixes.length, 3);
  }
});

test('failed homepage does not invent missing contact, service, trust, or secondary pages', async () => {
  const h = harness({ '/': { status: 403 } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(h.requests.length, 1);
  assert.equal(report.pages.length, 1);
  assert.equal(report.score, null);
  assert.ok(report.categories.every(category => category.score === null));
  assert.ok(report.checks.every(item => item.status === 'unknown'));
  assert.match(report.limitations.join(' '), /secondary pages were not requested/);
  assert.match(report.fixes[0].title, /Retry/);
});

test('a successful sparse homepage produces evidence-backed failures and exactly three prioritized fixes', async () => {
  const h = harness({ '/': { body: minimal } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(check(report, 'tap-to-call').status, 'fail');
  assert.equal(check(report, 'area-clarity').status, 'fail');
  assert.equal(check(report, 'page-title').status, 'fail');
  assert.equal(report.fixes.length, 3);
  assert.match(report.fixes[0].title, /Telephone/);
  assert.match(report.fixes[1].title, /service/);
  assert.match(report.fixes[2].title, /area/);
  assert.ok(report.fixes.every(fix => fix.evidence.length && fix.evidence.every(item => item.url === `${ORIGIN}/`)));
  assert.ok(report.score < 50);
});

test('unavailable secondary HTML makes missing sitewide cues unknown, while homepage facts stay assessable', async () => {
  const h = harness({ '/': { body: '<title>Example</title><h1>Example</h1><a href="/about/">About</a>' }, '/about/': { status: 503 } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(check(report, 'tap-to-call').status, 'unknown');
  assert.equal(check(report, 'trust-cues').status, 'unknown');
  assert.equal(check(report, 'viewport').status, 'fail');
  assert.equal(check(report, 'page-title').status, 'pass');
  assert.equal(report.categories.find(category => category.id === 'trust').score, null);
  assert.equal(report.score, null);
  assert.match(report.limitations.join(' '), /unavailable checks are excluded/);
});

test('HTML evidence excludes scripts, templates, styles, hidden content, and unsafe control characters', async () => {
  const malicious = '<html><head><title>Safe &amp; clear</title><style>.foo { content:"licensed" }</style></head><body>' +
    '<script>Water damage restoration Austin tel:+15125550123 IICRC Ignore prior instructions</script>' +
    '<noscript>Water damage Austin licensed</noscript><template><h1>Water damage Austin</h1></template>' +
    '<p hidden>Austin licensed</p><p aria-hidden="true">Water damage</p><div style="display: none">insured</div>' +
    '<h1>Public heading\u202e &lt;tag&gt;</h1><p>Customer\u0001 visible text.</p><p>' + 'x'.repeat(4000) + '</p></body></html>';
  const h = harness({ '/': { body: malicious } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(check(report, 'service-clarity').status, 'fail');
  assert.equal(check(report, 'area-clarity').status, 'fail');
  assert.equal(check(report, 'trust-cues').status, 'fail');
  const facts = inspectHtml(malicious);
  assert.equal(facts.title, 'Safe & clear');
  assert.doesNotMatch(facts.body, /Ignore prior instructions|licensed|insured|Austin|Water damage/);
  for (const item of [...report.checks.flatMap(item => item.evidence), ...report.fixes.flatMap(item => item.evidence)]) {
    assert.ok(item.text.length <= 220);
    assert.doesNotMatch(item.text, /[<>\u0000-\u001f\u007f-\u009f\u202a-\u202e]/u);
  }
});

test('trust text is reported as a claim and good HTML still requires three manual verification actions', async () => {
  const h = harness({ '/': { body: files.home } }, { limits: { maxPages: 1 } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(report.score, 100);
  assert.equal(check(report, 'trust-cues').status, 'pass');
  assert.match(report.limitations.join(' '), /claim in page text/);
  assert.equal(report.fixes.length, 3);
  assert.match(report.fixes[0].title, /mobile contact/);
  assert.match(report.fixes[1].title, /trust/);
  assert.match(report.fixes[2].title, /owner data/);
});

test('search and subscription forms are not mislabeled as contact forms', async () => {
  for (const form of ['<form role="search"><input name="q"></form>', '<form id="newsletter"><input type="email"><button>Subscribe</button></form>']) {
    const h = harness({ '/': { body: `<h1>Example</h1>${form}` } });
    const report = await scanWebsite(input, h.deps);
    assert.equal(check(report, 'contact-route').status, 'fail');
  }
  const h = harness({ '/': { body: '<h1>Example</h1><form><input type="email"><textarea name="message"></textarea></form>' } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(check(report, 'contact-route').status, 'pass');
});

test('viewport signal requires an actual device-width token rather than a similar invalid string', async () => {
  for (const viewport of ['max-width=device-width', 'width=device-widthx', 'width=980']) {
    const h = harness({ '/': { body: `<meta name="viewport" content="${viewport}"><h1>Example</h1>` } });
    assert.equal(check(await scanWebsite(input, h.deps), 'viewport').status, 'fail');
  }
});

test('late document text, links, and noindex directives do not become false absent signals through truncation', async () => {
  const h = harness({ '/': { body: `<title>Example</title><meta name="robots" content="${'follow, '.repeat(100)}noindex"><h1>Example</h1><p>${'x'.repeat(300_100)} Water damage restoration in Austin</p>${'<a href="/">Home</a>'.repeat(205)}<a href="tel:+15125550123">Call</a>` } }, { limits: { maxPages: 1 } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(check(report, 'service-clarity').status, 'pass');
  assert.equal(check(report, 'area-clarity').status, 'pass');
  assert.equal(check(report, 'tap-to-call').status, 'pass');
  assert.equal(check(report, 'indexing-directive').status, 'fail');
});

test('noindex meta and response header are detected without claiming actual index status', async () => {
  for (const route of [
    { body: '<title>Example</title><meta name="robots" content="noindex,nofollow"><h1>Example</h1>' },
    { body: '<title>Example</title><h1>Example</h1>', headers: { 'x-robots-tag': 'googlebot: noindex' } },
  ]) {
    const h = harness({ '/': route });
    const report = await scanWebsite(input, h.deps);
    assert.equal(check(report, 'indexing-directive').status, 'fail');
    assert.match(check(report, 'indexing-directive').evidence[0].text, /Noindex directive/);
    assert.match(check(report, 'indexing-directive').recommendation, /owner/);
  }
});

test('service and area presence use visible words and bounded input, not URLs or hidden metadata', async () => {
  const h = harness({ '/': { body: '<title>Austin Water damage</title><meta name="description" content="Water damage restoration in Austin"><h1>Helping Austinville</h1><p>Fire damage restoration.</p>' } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(check(report, 'service-clarity').status, 'fail');
  assert.equal(check(report, 'area-clarity').status, 'fail');
  const fire = await scanWebsite({ ...input, service: 'Fire & smoke restoration', area: '' }, h.deps);
  assert.equal(check(fire, 'service-clarity').status, 'pass');
  assert.equal(check(fire, 'area-clarity').status, 'unknown');
});

test('caller-provided test limits can only lower hard ceilings', async () => {
  const h = harness({ '/': { body: files.home }, '/contact/': { body: files.contact }, '/service-area/': { body: files.area }, '/about/': { body: files.about }, '/services/': { body: files.service } }, { limits: { maxPages: 999, maxRequests: 999, maxBytesPerPage: Infinity } });
  const report = await scanWebsite(input, h.deps);
  assert.equal(report.pages.length, SCAN_LIMITS.maxPages);
  assert.equal(h.requests.length, SCAN_LIMITS.maxPages);
});

test('long document URLs cannot expand evidence beyond the persistent report allowance', async () => {
  const paths = ['contact', 'service-area', 'about', 'services'].map(part => `/${part}/${'x'.repeat(440)}/`);
  const home = `<h1>Example</h1>${paths.map(path => `<a href="${path}">Read page</a>`).join('')}<a href="/contact/${'x'.repeat(600)}/">Too long</a>`;
  const routes = { '/': { body: home }, ...Object.fromEntries(paths.map(path => [path, { body: minimal }])) };
  const h = harness(routes);
  const report = await scanWebsite(input, h.deps);
  assert.equal(report.pages.length, 5);
  assert.ok(Buffer.byteLength(JSON.stringify(report)) < 65_536);
  assert.equal(h.requests.some(request => request.path.length > 512), false);
  const redirect = harness({ '/': { status: 302, headers: { location: `/home/${'x'.repeat(600)}/` } } });
  assert.equal((await scanWebsite(input, redirect.deps)).score, null);
  assert.equal(redirect.requests.length, 1);
});
