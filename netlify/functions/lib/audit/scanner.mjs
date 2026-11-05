import http from 'node:http';
import https from 'node:https';
import { lookup as dnsLookup } from 'node:dns/promises';
import { isIP } from 'node:net';
import { inspectHtml, analyzeWebsite } from './analyze.mjs';

// These are hard ceilings, including when dependency injection is used in tests.
export const SCAN_LIMITS = Object.freeze({
  maxPages: 5,
  maxRedirects: 3,
  maxRequests: 12,
  maxBytesPerPage: 400_000,
  maxTotalBytes: 1_500_000,
  requestTimeoutMs: 4_000,
  totalTimeoutMs: 15_000,
});

class ScanError extends Error {
  constructor(message, code = 'UNAVAILABLE') {
    super(message);
    this.name = 'ScanError';
    this.code = code;
  }
}

const invalidTarget = () => new ScanError('Enter a public website domain using HTTP or HTTPS, without credentials or a port.', 'INVALID_TARGET');
const internalSuffix = /(?:^|\.)(?:localhost|local|internal|intranet|lan|home|localdomain|test|invalid|example|onion|arpa)$/i;
const domainName = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
const unsafePath = /(?:^|[\/._-])(?:admin|wp-admin|wp-json|api|cgi-bin|login|logout|signin|signout|sign-in|sign-out|account|cart|checkout|delete|remove|unsubscribe|submit|send|purchase|download)(?:$|[\/._-])/i;

function validateUrl(raw, base) {
  if (typeof raw !== 'string' || !raw || raw.length > 2048 || /[\u0000-\u0020\u007f\\]/u.test(raw)) throw invalidTarget();
  if (/^[a-z][a-z\d+.-]*:/i.test(raw) && !/^https?:\/\//i.test(raw)) throw invalidTarget();
  // Check the authority before URL parsing: WHATWG otherwise erases explicit
  // default ports and canonicalizes unusual numeric/encoded host spellings.
  const authority = raw.match(/^(?:https?:)?\/\/([^/?#]*)/i)?.[1];
  if (authority !== undefined && (/@|%|:|\[|\]/.test(authority) || !authority)) throw invalidTarget();
  let url;
  try { url = new URL(raw, base); } catch { throw invalidTarget(); }
  if (!['https:', 'http:'].includes(url.protocol) || url.username || url.password || url.port) throw invalidTarget();
  if (!url.hostname || url.hostname.length > 253 || isIP(url.hostname.replace(/^\[|\]$/g, '')) || !domainName.test(url.hostname) || internalSuffix.test(url.hostname)) throw invalidTarget();
  if (url.href.length > 2048) throw invalidTarget();
  if (url.hostname.endsWith('.') || /%/.test(url.hostname)) throw invalidTarget();
  url.hash = '';
  return url;
}

/** Normalize a business website to its homepage; arbitrary entered paths are not fetched. */
export function normalizeTarget(raw) {
  if (typeof raw !== 'string') throw invalidTarget();
  let input = raw.trim();
  if (!/^[a-z][a-z\d+.-]*:/i.test(input)) input = `https://${input}`;
  return `${validateUrl(input).origin}/`;
}

/** Conservative global-unicast policy. Never interpret alternate numeric forms. */
export function isPublicIp(address) {
  if (typeof address !== 'string' || address.includes('%')) return false;
  const family = isIP(address);
  if (family === 4) {
    const [a, b, c] = address.split('.').map(Number);
    return !(a === 0 || a === 10 || a === 127 || a >= 224 ||
      (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 0 && (c === 0 || c === 2) || b === 168 || b === 88 && c === 99)) ||
      (a === 198 && (b === 18 || b === 19 || b === 51 && c === 100)) ||
      (a === 203 && b === 0 && c === 113));
  }
  if (family !== 6 || address.includes('.')) return false;
  const [left, right] = address.toLowerCase().split('::');
  const start = left ? left.split(':') : [];
  const end = right ? right.split(':') : [];
  const parts = right === undefined ? start : [...start, ...Array(8 - start.length - end.length).fill('0'), ...end];
  const words = parts.map(part => parseInt(part, 16));
  if (words.length !== 8 || words[0] < 0x2000 || words[0] > 0x3fff) return false;
  // Special protocols (including Teredo), documentation and 6to4 are excluded.
  return !(words[0] === 0x2001 && (words[1] <= 0x01ff || words[1] === 0x0db8) ||
    words[0] === 0x2002 || words[0] === 0x3ffe || words[0] === 0x3fff && words[1] <= 0x0fff);
}

function budget(ctx) {
  const remaining = ctx.deadline - Date.now();
  if (remaining <= 0) throw new ScanError('The scan time limit was reached.', 'TIME_LIMIT');
  return remaining;
}

async function resolvePinned(url, ctx, timeoutMs) {
  let timer;
  try {
    const answers = await Promise.race([
      Promise.resolve().then(() => ctx.lookup(url.hostname, { all: true, verbatim: true })),
      new Promise((_, reject) => { timer = setTimeout(() => reject(new ScanError('DNS lookup timed out.', 'TIME_LIMIT')), timeoutMs); }),
    ]);
    if (!Array.isArray(answers) || !answers.length || answers.length > 32 || answers.some(answer =>
      !answer || !isPublicIp(answer.address) || Number(answer.family) !== isIP(answer.address))) {
      throw new ScanError('The destination did not resolve exclusively to public addresses.', 'UNSAFE_DESTINATION');
    }
    // This exact address, rather than a subsequent resolver answer, is used for
    // the connection. The hostname remains intact for Host and TLS validation.
    const selected = { address: answers[0].address, family: Number(answers[0].family) };
    return (hostname, options, callback) => {
      if (typeof options === 'function') { callback = options; options = {}; }
      if (hostname !== url.hostname) return callback(new ScanError('Unexpected DNS hostname.', 'UNSAFE_DESTINATION'));
      if (options?.all) callback(null, [{ ...selected }]);
      else callback(null, selected.address, selected.family);
    };
  } finally { clearTimeout(timer); }
}

function header(headers, name) {
  const value = headers?.[name];
  return Array.isArray(value) ? value.join(', ') : String(value || '');
}

async function requestDocument(url, ctx) {
  if (++ctx.requests > ctx.limits.maxRequests) throw new ScanError('The request limit was reached.', 'REQUEST_LIMIT');
  if (ctx.bytes >= ctx.limits.maxTotalBytes) throw new ScanError('The HTML document exceeded the byte limit.', 'BYTE_LIMIT');
  const expires = Date.now() + Math.min(ctx.limits.requestTimeoutMs, budget(ctx));
  const lookup = await resolvePinned(url, ctx, Math.max(1, expires - Date.now()));
  budget(ctx);
  if (Date.now() >= expires) throw new ScanError('The page request timed out.', 'TIME_LIMIT');
  return new Promise((resolve, reject) => {
    let request;
    let response;
    let settled = false;
    let timer;
    const fail = error => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      // Destroy without passing the error: listeners below already handle it.
      response?.destroy();
      request?.destroy();
      reject(error instanceof ScanError ? error : new ScanError('The page could not be retrieved.'));
    };
    const finish = result => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      resolve(result);
    };
    timer = setTimeout(() => fail(new ScanError('The page request timed out.', 'TIME_LIMIT')), Math.max(1, expires - Date.now()));
    try {
      request = ctx.request({
        protocol: url.protocol,
        hostname: url.hostname,
        servername: url.hostname,
        port: url.protocol === 'https:' ? 443 : 80,
        path: `${url.pathname}${url.search}`,
        method: 'GET',
        lookup,
        agent: false,
        rejectUnauthorized: true,
        maxHeaderSize: 16_384,
        headers: {
          Host: url.host,
          'User-Agent': 'RnRWebsiteReadiness/1.0 (bounded HTML-only website check)',
          Accept: 'text/html, application/xhtml+xml;q=0.9',
          'Accept-Encoding': 'identity',
        },
      }, incoming => {
        response = incoming;
        response.on('error', fail);
        response.on('aborted', () => fail(new ScanError('The page response was interrupted.')));
        if (settled) { response.destroy(); return; }
        const status = Number(response.statusCode);
        if ([301, 302, 303, 307, 308].includes(status)) {
          finish({ redirect: header(response.headers, 'location') });
          response.destroy();
          return;
        }
        if (status < 200 || status >= 300) return fail(new ScanError(`The page returned HTTP ${Number.isInteger(status) ? status : 'an error'}.`));
        if (!/^(?:text\/html|application\/xhtml\+xml)(?:\s*;|\s*$)/i.test(header(response.headers, 'content-type'))) return fail(new ScanError('The page did not return an HTML document.'));
        const encoding = header(response.headers, 'content-encoding').trim().toLowerCase();
        if (encoding && encoding !== 'identity') return fail(new ScanError('The server returned compressed content despite an HTML-only identity request.'));
        const length = header(response.headers, 'content-length');
        if (length && (!/^\d+$/.test(length) || Number(length) > Math.min(ctx.limits.maxBytesPerPage, ctx.limits.maxTotalBytes - ctx.bytes))) return fail(new ScanError('The HTML document exceeded the byte limit.', 'BYTE_LIMIT'));
        let pageBytes = 0;
        const chunks = [];
        response.on('data', chunk => {
          if (settled) return;
          const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
          pageBytes += buffer.length;
          ctx.bytes += buffer.length;
          if (pageBytes > ctx.limits.maxBytesPerPage || ctx.bytes > ctx.limits.maxTotalBytes) return fail(new ScanError('The HTML document exceeded the byte limit.', 'BYTE_LIMIT'));
          chunks.push(buffer);
        });
        response.on('end', () => finish({ html: Buffer.concat(chunks).toString('utf8'), headers: response.headers }));
      });
      request.on('error', fail);
      request.end();
    } catch (error) { fail(error); }
  });
}

function sameSiteRedirect(raw, current, root, allowUpgrade) {
  const next = validateUrl(raw, current);
  const path = decodePath(next.pathname);
  if (next.href.length > 512 || next.hostname !== root.hostname || next.protocol !== current.protocol && !(allowUpgrade && current.protocol === 'http:' && next.protocol === 'https:') || !allowUpgrade && next.origin !== root.origin || next.search || path === null || unsafePath.test(path)) {
    throw new ScanError('A redirect left the permitted public page scope.', 'REDIRECT_SCOPE');
  }
  return next;
}

function decodePath(path) {
  try {
    // Reject encoded separators and remaining percent signs rather than guess
    // how many decoding passes an upstream server applies to action endpoints.
    if (/%(?:2f|5c|25)/i.test(path)) return null;
    const decoded = decodeURIComponent(path);
    return /[%\\\u0000-\u001f\u007f]/u.test(decoded) ? null : decoded;
  } catch { return null; }
}

async function readPage(initial, root, ctx, allowUpgrade = false) {
  let url = initial;
  const visited = new Set();
  for (let redirects = 0; redirects <= ctx.limits.maxRedirects; redirects++) {
    budget(ctx);
    if (visited.has(url.href)) throw new ScanError('The page entered a redirect loop.');
    visited.add(url.href);
    const result = await requestDocument(url, ctx);
    if (result.redirect !== undefined) {
      if (!result.redirect || redirects === ctx.limits.maxRedirects) throw new ScanError('The redirect limit was reached.');
      url = sameSiteRedirect(result.redirect, url, root, allowUpgrade);
      continue;
    }
    const facts = inspectHtml(result.html, result.headers);
    budget(ctx);
    return { url: url.href, status: 'checked', facts };
  }
  throw new ScanError('The redirect limit was reached.');
}

function candidates(homepage, ctx) {
  const root = new URL(homepage.url);
  const selected = new Map();
  for (const link of homepage.facts.links) {
    let url;
    try { url = validateUrl(link.href, root); } catch { continue; }
    const decoded = decodePath(url.pathname);
    if (decoded === null) continue;
    const path = decoded.toLowerCase();
    if (url.href.length > 512 || url.origin !== root.origin || url.search || url.href === root.href || unsafePath.test(path) || /\.(?!html?$|php$|aspx?$)[a-z\d]{1,8}$/i.test(path)) continue;
    // Only document-like, relevant paths are eligible. Anchor text cannot turn
    // an unrelated/action endpoint into a candidate.
    let rank = 0;
    if (/(?:^|[\/_-])contact(?:-us)?(?:$|[\/._-])/.test(path)) rank = 100;
    else if (/(?:^|[\/_-])(?:about(?:-us)?|our-team|company)(?:$|[\/._-])/.test(path)) rank = 80;
    else if (/(?:^|[\/_-])(?:service-areas?|areas?-we-serve|locations?)(?:$|[\/._-])/.test(path)) rank = 90;
    else if (/(?:^|[\/_-])(?:services?|water|fire|smoke|mold|mould|storm|flood|sewage|restoration|remediation)(?:$|[\/._-])/.test(path)) rank = 70;
    if (!rank) continue;
    const key = url.href.replace(/\/$/, '');
    if (!selected.has(key)) selected.set(key, { url, rank });
  }
  return [...selected.values()].sort((a, b) => b.rank - a.rank).slice(0, ctx.limits.maxPages - 1).map(item => item.url);
}

/**
 * Dependency injection is server-side/test-only. No dependency or limit is read
 * from HTTP input. Requests never execute JS, fetch subresources or submit forms.
 */
export async function scanWebsite(input, dependencies = {}) {
  const target = normalizeTarget(input?.url);
  const limits = Object.fromEntries(Object.entries(SCAN_LIMITS).map(([key, maximum]) => [key,
    Number.isFinite(dependencies.limits?.[key]) ? Math.max(1, Math.min(maximum, Math.floor(dependencies.limits[key]))) : maximum,
  ]));
  const ctx = {
    limits,
    lookup: dependencies.lookup || dnsLookup,
    request: dependencies.request || ((options, callback) => (options.protocol === 'https:' ? https : http).request(options, callback)),
    deadline: Date.now() + limits.totalTimeoutMs,
    requests: 0,
    bytes: 0,
  };
  const root = new URL(target);
  const pages = [];
  let homepage;
  try {
    homepage = await readPage(root, root, ctx, true);
    pages.push(homepage);
  } catch (error) {
    pages.push({ url: target, status: 'unavailable', reason: error instanceof ScanError ? error.message : 'The homepage HTML could not be inspected.' });
  }
  if (homepage) {
    for (const candidate of candidates(homepage, ctx)) {
      try {
        // Secondary requests and their redirects stay on the homepage origin.
        const page = await readPage(candidate, new URL(homepage.url), ctx);
        if (new URL(page.url).origin !== new URL(homepage.url).origin) throw new ScanError('A redirect left the permitted public page scope.');
        if (!pages.some(existing => existing.url === page.url)) pages.push(page);
      } catch (error) {
        pages.push({ url: candidate.href, status: 'unavailable', reason: error instanceof ScanError ? error.message : 'The page HTML could not be inspected.' });
      }
    }
  }
  const generatedAt = new Date(dependencies.now ? dependencies.now() : Date.now()).toISOString();
  return analyzeWebsite({ url: target, service: input?.service, area: input?.area, pages, generatedAt });
}
