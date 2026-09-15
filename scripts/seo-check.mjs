import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { execFileSync, spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { decodeHTML, decodeHTMLAttribute } from 'entities';

const origin = 'https://remediationrestorationmarketing.com';
const smokePaths = ['/', '/services/seo/', '/services/ppc/', '/contact/', '/schedule/'];
const hash = value => createHash('sha256').update(value).digest('hex');
const clean = value => decodeHTML(value).replace(/\s+/g, ' ').trim();
function attributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)]
    .map(match => [match[1].toLowerCase(), decodeHTMLAttribute(match[2] ?? match[3] ?? match[4])]));
}
export function signals(html) {
  const tags = (name) => [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(match => attributes(match[0]));
  const meta = tags('meta');
  const canonical = tags('link').filter(tag => tag.rel?.toLowerCase() === 'canonical').map(tag => tag.href);
  const schemas = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter(match => attributes(match[1]).type === 'application/ld+json')
    .map(match => JSON.parse(match[2]));
  return {
    title: clean(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] || ''),
    description: meta.find(tag => tag.name?.toLowerCase() === 'description')?.content || '',
    canonical,
    headings: [...html.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map(match => clean(match[1].replace(/<[^>]*>/g, ''))),
    robots: meta.filter(tag => /^(robots|googlebot|bingbot)$/i.test(tag.name || '')).map(tag => tag.content),
    schemas,
  };
}
export function pageErrors(result, url, noindex = false) {
  const errors = [];
  if (!result.title || !result.description) errors.push('missing title/description');
  if (result.headings.length !== 1) errors.push('H1 count is not one');
  if (result.canonical.length !== 1 || result.canonical[0] !== url) errors.push('not self-canonical');
  const blocked = result.robots.some(value => /\b(noindex|none)\b/i.test(value));
  if (blocked !== noindex) errors.push(noindex ? 'missing noindex' : 'unexpected noindex');
  if (!result.schemas.length) errors.push('missing JSON-LD');
  if (!JSON.stringify(result.schemas).includes(`${origin}/#localbusiness`)) errors.push('missing shared entity');
  return errors;
}

async function request(url, options = {}) {
  const response = await fetch(url, { redirect: 'manual', signal: AbortSignal.timeout(20000), ...options });
  return { status: response.status, body: await response.text(), headers: response.headers };
}
async function pooled(items, task) {
  let next = 0;
  await Promise.all(Array.from({ length: Math.min(4, items.length) }, async () => {
    while (next < items.length) await task(items[next++]);
  }));
}
async function main() {
  const requested = process.argv[2] || 'auto';
  if (!['auto', 'smoke', 'full'].includes(requested)) throw new Error('Use auto, smoke, or full.');
  const common = execFileSync('git', ['rev-parse', '--git-common-dir'], { encoding: 'utf8' }).trim();
  const runtime = path.resolve(common, 'seo-pipeline');
  await mkdir(runtime, { recursive: true });
  const lock = JSON.parse(await readFile(path.resolve(common, 'seo-pipeline.lock'), 'utf8'));
  if (!process.env.SEO_LOCK_OWNER || lock.owner !== process.env.SEO_LOCK_OWNER) throw new Error('Acquire seo:lock and set SEO_LOCK_OWNER before checking production.');
  let previous;
  try { previous = JSON.parse(await readFile(path.join(runtime, 'last-full.json'), 'utf8')); }
  catch (error) { if (error.code !== 'ENOENT') throw error; }
  const paths = [...new Set(execFileSync('git', ['ls-files', '--cached', '--others', '--exclude-standard', '-z', 'src', 'public', 'scripts', 'package.json', 'package-lock.json', 'astro.config.mjs', 'tailwind.config.mjs'], { encoding: 'utf8' }).split('\0').filter(Boolean))].sort();
  const sourceHash = hash((await Promise.all(paths.map(async file => `${file}:${hash(await readFile(file))}`))).join('\n'));
  const sitemap = await request(`${origin}/sitemap-0.xml`);
  if (sitemap.status !== 200) throw new Error(`Sitemap HTTP ${sitemap.status}`);
  const urls = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
  if (!urls.length || urls.length > 1000 || urls.some(url => new URL(url).origin !== origin)) throw new Error('Empty, out-of-scope, or over-budget sitemap');
  const sitemapHash = hash([...urls].sort().join('\n'));
  const deployed = await request(`${origin}/build-info.json`);
  let deployedCommit = null;
  try { if (deployed.status === 200) deployedCommit = JSON.parse(deployed.body).commit; } catch { }
  const expectedCommit = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
  const full = requested === 'full' || (requested === 'auto' && (!previous || previous.deployedCommit !== deployedCommit || previous.sourceHash !== sourceHash || previous.sitemapHash !== sitemapHash || Date.now() - Date.parse(previous.checkedAt) > 7 * 86400000));
  if (full) {
    const log = path.join(runtime, 'validation.log');
    const run = process.platform === 'win32'
      ? spawnSync('cmd.exe', ['/d', '/s', '/c', 'npm run validate'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 })
      : spawnSync('npm', ['run', 'validate'], { encoding: 'utf8', maxBuffer: 10 * 1024 * 1024 });
    await writeFile(log, (run.stdout || '') + (run.stderr || ''));
    if (run.error || run.status !== 0) throw new Error(`Release validation failed; see ${log}`);
  }
  const failures = [];
  if (!/^[a-f0-9]{40}$/i.test(deployedCommit || '')) failures.push({ error: 'deployment receipt unavailable' });
  else if (deployedCommit !== expectedCommit) {
    // Documentation-only commits may intentionally skip hosting builds.
    try {
      const changed = execFileSync('git', ['diff', '--name-only', deployedCommit, expectedCommit, '--', 'src', 'public', 'scripts', 'package.json', 'package-lock.json', 'astro.config.mjs', 'tailwind.config.mjs'], { encoding: 'utf8' }).trim();
      if (changed) failures.push({ error: 'deployed revision does not contain current site/build changes', deployedCommit, expectedCommit });
    } catch { failures.push({ error: 'cannot compare deployed revision with local source', deployedCommit, expectedCommit }); }
  }
  const checked = {};
  const candidates = full ? urls : [...new Set([...smokePaths.map(route => origin + route), ...urls.filter(url => !previous?.urls?.includes(url))])];
  const internal = new Set();
  const alternates = new Set();
  await pooled(candidates, async url => {
    try {
      const live = await request(url);
      if (live.status !== 200) throw new Error(`HTTP ${live.status}`);
      if (/\b(noindex|none)\b/i.test(live.headers.get('x-robots-tag') || '')) throw new Error('X-Robots blocks indexing');
      const result = signals(live.body);
      const errors = pageErrors(result, url);
      if (full) {
        const local = await readFile(path.join('dist', decodeURIComponent(new URL(url).pathname), 'index.html'), 'utf8');
        if (JSON.stringify(result) !== JSON.stringify(signals(local))) errors.push('local/live SEO signal mismatch');
        for (const match of live.body.matchAll(/<link\b[^>]*>/gi)) {
          const link = attributes(match[0]);
          if (link.type !== 'text/markdown' || !link.href) continue;
          const alternate = new URL(link.href, url);
          if (alternate.origin === origin) alternates.add(alternate.href);
        }
        for (const match of live.body.matchAll(/<a\b[^>]*>/gi)) {
          const href = attributes(match[0]).href;
          if (!href) continue;
          const target = new URL(href, url);
          if (target.origin === origin && !target.pathname.startsWith('/admin') && !target.pathname.startsWith('/.netlify/') && !/\.[a-z0-9]+$/i.test(target.pathname)) {
            internal.add(target.origin + target.pathname);
          }
        }
      }
      if (errors.length) throw new Error(errors.join('; '));
      checked[url] = hash(JSON.stringify(result));
    } catch (error) { failures.push({ url, error: error.message }); }
  });
  for (const route of ['/robots.txt', '/llms.txt', '/llms-full.txt', '/sitemap-index.xml']) {
    try {
      const live = await request(origin + route);
      if (live.status !== 200 || !live.body.trim()) throw new Error(`HTTP ${live.status} or empty artifact`);
      if (full) {
        const local = await readFile(path.join('dist', route), 'utf8');
        if (live.body.replace(/\r\n/g, '\n') !== local.replace(/\r\n/g, '\n')) throw new Error('local/live artifact mismatch');
      }
    } catch (error) { failures.push({ url: origin + route, error: error.message }); }
  }
  if (full) {
    const localMap = await readFile('dist/sitemap-0.xml', 'utf8');
    const localUrls = [...localMap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]).sort();
    if (hash(localUrls.join('\n')) !== sitemapHash) failures.push({ error: 'local/live sitemap inventory mismatch' });
    if (internal.size > 1000) throw new Error('Internal-link budget exceeded');
    await pooled([...internal].filter(url => !checked[url]), async url => {
      try { const result = await request(url); if (result.status !== 200) throw new Error(`HTTP ${result.status}`); }
      catch (error) { failures.push({ url, error: error.message }); }
    });
    if (alternates.size > 1000) throw new Error('Markdown alternate budget exceeded');
    await pooled([...alternates], async url => {
      try {
        const live = await request(url);
        if (live.status !== 200 || !live.headers.get('content-type')?.includes('text/markdown') || !live.body.trim()) throw new Error('Markdown alternate unavailable or wrong content type');
      } catch (error) { failures.push({ url, error: error.message }); }
    });
    await pooled(smokePaths, async route => {
      try {
        const [normal, bot] = await Promise.all([request(origin + route), request(origin + route, { headers: { 'User-Agent': 'CanonryBot/1.0' } })]);
        if (normal.status !== 200 || bot.status !== 200 || normal.body !== bot.body) throw new Error('normal/crawler response mismatch');
      } catch (error) { failures.push({ url: origin + route, error: error.message }); }
    });
  }
  for (const route of ['/thank-you/', '/restoration-marketing/']) {
    try {
      const live = await request(origin + route);
      if (live.status !== 200 || !/\b(noindex|none)\b/i.test([...signals(live.body).robots, live.headers.get('x-robots-tag') || ''].join(' ')) || urls.includes(origin + route)) throw new Error('excluded route is not correctly noindexed/excluded');
    } catch (error) { failures.push({ url: origin + route, error: error.message }); }
  }
  const missing = await request(`${origin}/seo-monitor-deliberately-missing-page/`);
  if (missing.status !== 404) failures.push({ error: `Missing page returned ${missing.status}, expected 404` });
  for (const [url, destination] of [[origin.replace('https:', 'http:') + '/', origin + '/'], ['https://www.remediationrestorationmarketing.com/', origin + '/'], [origin + '/sitemap.xml', origin + '/sitemap-index.xml']]) {
    const result = await request(url);
    if (![301, 308].includes(result.status) || new URL(result.headers.get('location') || url, url).href !== destination) failures.push({ url, error: 'canonical redirect mismatch' });
  }
  const report = { checkedAt: new Date().toISOString(), mode: full ? 'full' : 'smoke', sourceHash, sitemapHash,
    head: expectedCommit, deployedCommit,
    sitemapPages: urls.length, checkedPages: candidates.length, internalTargets: full ? internal.size : null, markdownAlternates: full ? alternates.size : null,
    failures, outcome: failures.length ? 'failed' : 'passed', urls,
    limitations: ['Technical eligibility only; does not establish indexing, ranking, conversions or real crawler access.', 'Smoke mode does not certify whole-site parity.'] };
  await writeFile(path.join(runtime, 'latest-check.json'), JSON.stringify(report, null, 2));
  if (full && !failures.length) await writeFile(path.join(runtime, 'last-full.json'), JSON.stringify(report, null, 2));
  console.log(JSON.stringify({ ...report, urls: undefined }, null, 2));
  if (failures.length) process.exitCode = 1;
}
if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  main().catch(error => { console.error(error.message); process.exitCode = 1; });
}
