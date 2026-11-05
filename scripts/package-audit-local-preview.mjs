import { build } from 'esbuild';
import { parse } from 'parse5';
import { readFile, writeFile, mkdir, mkdtemp, stat, realpath, copyFile, readdir } from 'node:fs/promises';
import { resolve, join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';

// Build an independent Node-only review app; no account, keys or deployment.
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const dist = await realpath(join(root, 'dist'));
const requested = process.argv[2];
if (process.argv.length > 3) throw new Error('Usage: node scripts/package-audit-local-preview.mjs [new-output-directory]');
const output = requested ? resolve(requested) : await mkdtemp(join(tmpdir(), 'rnr-audit-functional-bundle-'));
if (output === root || output.startsWith(root + sep)) throw new Error('Package outside the checkout, in a new review directory.');
await mkdir(output, { mode: 0o700, recursive: true });
if ((await readdir(output)).length) throw new Error('Use a new empty output directory.');
const preview = join(output, 'preview');
await mkdir(join(preview, 'dist'), { recursive: true });
const queued = ['/index.html', '/resources/index.html', '/website-audit/index.html'];
const seen = new Set();
const previewIconAliases = new Map();
function add(reference, base) {
  if (!reference || /^(?:data:|blob:|#)/i.test(reference.trim())) return;
  const url = new URL(reference.trim().replace(/^['"]|['"]$/g, ''), `http://preview.local${base}`);
  if (url.origin !== 'http://preview.local') return;
  const path = decodeURIComponent(url.pathname);
  if (path.includes('\\') || path.split('/').includes('..')) throw new Error('Unsafe build asset reference.');
  if (!seen.has(path)) queued.push(path);
}
function walk(node, visit) { visit(node); for (const child of node.childNodes ?? []) walk(child, visit); }
while (queued.length) {
  const path = queued.shift(); if (seen.has(path)) continue; seen.add(path);
  const source = await realpath(previewIconAliases.get(path) ?? resolve(dist, `.${path}`));
  if (!source.startsWith(dist + sep) || !(await stat(source)).isFile()) throw new Error('Missing or unsafe preview asset.');
  const data = await readFile(source);
  const destination = resolve(preview, 'dist', `.${path}`);
  await mkdir(dirname(destination), { recursive: true }); await writeFile(destination, data);
  if (path.endsWith('.html')) walk(parse(data.toString()), node => {
    const attrs = Object.fromEntries((node.attrs ?? []).map(attr => [attr.name, attr.value]));
    if (['script', 'img', 'source', 'video', 'audio', 'iframe'].includes(node.tagName)) { add(attrs.src, path); add(attrs.poster, path); }
    if (['use', 'image'].includes(node.tagName)) add(attrs.href ?? attrs['xlink:href'], path);
    if (node.tagName === 'link' && (attrs.rel ?? '').split(/\s+/).some(rel => ['stylesheet', 'preload', 'modulepreload', 'icon', 'apple-touch-icon', 'manifest'].includes(rel))) add(attrs.href, path);
    for (const key of ['srcset', 'imagesrcset']) for (const candidate of (attrs[key] ?? '').split(',')) add(candidate.trim().split(/\s+/)[0], path);
  });
  else if (path.endsWith('.css')) for (const match of data.toString().matchAll(/url\(\s*([^\)]+?)\s*\)/g)) add(match[1], path);
  else if (path.endsWith('.js')) for (const match of data.toString().matchAll(/(?:\bfrom\s*|\bimport\s*\(?\s*)["']([^"']+)["']/g)) add(match[1], path);
  else if (path.endsWith('.webmanifest')) for (const icon of JSON.parse(data).icons ?? []) {
    const reference = new URL(icon.src, `http://preview.local${path}`);
    if (reference.origin === 'http://preview.local') {
      const requested = resolve(dist, `.${reference.pathname}`);
      try { await stat(requested); }
      catch (error) {
        if (error.code !== 'ENOENT') throw error;
        // The retained site's manifest names root icons that are physically
        // beside it. Include those aliases in this preview only; source stays intact.
        const adjacent = resolve(dirname(source), reference.pathname.replace(/^\/+/, ''));
        if (!(await stat(adjacent)).isFile()) throw error;
        previewIconAliases.set(reference.pathname, adjacent);
      }
    }
    add(icon.src, path);
  }
}
const result = await build({ absWorkingDir: root, entryPoints: ['scripts/audit-local-preview.mjs'], bundle: true, platform: 'node', format: 'esm', target: 'node18',
  outfile: join(preview, 'start-preview.mjs'), metafile: true, logLevel: 'warning', legalComments: 'inline' });
const licenses = new Map();
for (const input of Object.keys(result.metafile.inputs).filter(path => path.includes('node_modules/'))) {
  for (let directory = dirname(resolve(root, input)); directory.startsWith(root + sep); directory = dirname(directory)) {
    try {
      const metadata = JSON.parse(await readFile(join(directory, 'package.json'), 'utf8'));
      if (!metadata.name) continue;
      for (const name of ['LICENSE', 'LICENSE.md', 'LICENSE.txt']) {
        try { licenses.set(`${metadata.name}@${metadata.version}`, await readFile(join(directory, name), 'utf8')); break; } catch { /* Next license filename. */ }
      }
      break;
    } catch { /* Ascend to owning package. */ }
  }
}
await writeFile(join(preview, 'THIRD-PARTY-NOTICES.txt'), [...licenses].map(([name, text]) => `${name}\n${text}`).join('\n\n'));
await writeFile(join(preview, 'start-preview.cmd'), '@echo off\r\nnode "%~dp0start-preview.mjs"\r\nif errorlevel 1 pause\r\n');
await writeFile(join(output, 'START-HERE.txt'), `FUNCTIONAL LOCAL AUDIT PREVIEW\n\nExtract into a NEW folder outside your existing website checkout. Node.js 18+ is the only runtime requirement; Node 22+ recommended. No npm install, Docker, database service, accounts, keys or paid APIs are needed to run it.\n\nWindows: double-click preview\\start-preview.cmd.\nAny platform: in the extracted folder run node preview/start-preview.mjs\nOpen http://127.0.0.1:4322/website-audit/\n\nChoose one of the three clearly fictional local test sites and click Check my website. The actual HTML scanner, queue, cache, score and quotas run against local fixture pages. Service and area inputs affect real findings. Unknown/public URLs are rejected.\n\nSave report locally writes a private local outbox report, not an email or HubSpot contact. Its saved link opens the complete report. Existing booking links are preserved; the preview never opens or books them automatically.\n\nState, quota counters and outbox persist in your OS user temporary directory, outside the bundle and checkout. The server prints that path. Stop cleanly with Ctrl+C. Restart the same bundle to reuse state. To start an independent fixture session after exhausting the three-fresh-scan quota or a stale lock, use node preview/start-preview.mjs --fresh. This preserves earlier data. --port 4323 selects another loopback port.\n\nOnly 127.0.0.1 is bound. Host/Origin/CSRF checks protect local POSTs. External browser scripts/connections are blocked. Production/Netlify/Lambda environments reject the local store; it is never a public storage fallback. Real public scans, bot-provider verification, email sends and HubSpot changes remain disabled.\n\nThe earlier Windows Library helper failed on os.setxattr. This preview does not use that helper or API. Download the native Library ZIP in the browser and extract normally; do not modify the helper or your checkout. Native Windows execution is still a separate verification checkpoint; the Windows storage branch is covered by local tests.\n`);
const hashes = [];
async function collect(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await collect(path);
    else if (entry.isFile()) { const data = await readFile(path); hashes.push({ path: relative(output, path).split(sep).join('/'), bytes: data.length, sha256: createHash('sha256').update(data).digest('hex') }); }
  }
}
await collect(output);
await writeFile(join(output, 'preview-manifest.json'), JSON.stringify({ localPreviewOnly: true, fixturePipeline: 'real scanner; local fixture transport and local outbox', previewIconAliases: [...previewIconAliases].map(([path, source]) => ({ path, source: relative(dist, source) })), files: hashes }, null, 2));
console.log(JSON.stringify({ directory: output, nodeOnly: true, staticAssets: seen.size, files: hashes.length, serviceCredentialsRequired: false }));
