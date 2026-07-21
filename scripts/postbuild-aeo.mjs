import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../dist/', import.meta.url));
const failures = [];
const symbols = new Map();
const scopeNames = new Map();
const spritePath = join(root, 'icons.svg');

async function loadExistingSprite() {
  try {
    const sprite = await readFile(spritePath, 'utf8');
    for (const match of sprite.matchAll(/<symbol\s+id="([^"]+)"([^>]*)>([\s\S]*?)<\/symbol>/g)) {
      const [, id, attributes, body] = match;
      symbols.set(id, `<symbol id="${id}"${attributes}>${body}</symbol>`);
    }
  } catch (error) {
    if (error?.code !== 'ENOENT') throw error;
  }
}

function shortScopeName(original) {
  if (!scopeNames.has(original)) {
    scopeNames.set(original, `data-s${scopeNames.size.toString(36)}`);
  }
  return scopeNames.get(original);
}

function shortenAstroScopes(text) {
  return text.replace(/data-astro-cid-[a-z0-9]+/gi, (name) => shortScopeName(name));
}

async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path);
    if (entry.isFile() && entry.name === 'index.html') await processPage(path);
  }
}

function decode(text) {
  return text
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, value) => String.fromCodePoint(Number(value)));
}

function textContent(html) {
  return decode(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<nav\b[^>]*>[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, '\n'))
    .replace(/[ \t]+/g, ' ')
    .replace(/\n\s*\n+/g, '\n\n')
    .trim();
}

async function processPage(path) {
  let html = await readFile(path, 'utf8');
  html = html.replace(/<symbol\s+id="([^"]+)"([^>]*)>([\s\S]*?)<\/symbol>\s*<use\s+href="#\1"\s*><\/use>/g, (match, id, attributes, body) => {
    symbols.set(id, `<symbol id="${id}"${attributes}>${body}</symbol>`);
    return `<use href="/icons.svg#${id}"></use>`;
  });
  html = html.replace(/<!--(?!\[if)[\s\S]*?-->/g, '');
  html = shortenAstroScopes(html);
  await writeFile(path, html, 'utf8');
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  if (!path.includes(`${join('admin', 'index.html')}`) && h1Count !== 1) {
    failures.push(`${path}: expected exactly one H1, found ${h1Count}`);
  }

  const canonicalCount = (html.match(/<link\b[^>]*rel=["']canonical["']/gi) || []).length;
  if (!path.includes(`${join('admin', 'index.html')}`) && canonicalCount !== 1) {
    failures.push(`${path}: expected exactly one canonical, found ${canonicalCount}`);
  }

  const title = decode(html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || 'Remediation & Restoration Marketing').trim();
  const markdown = `# ${title}\n\n${textContent(html)}\n`;
  await writeFile(join(path.slice(0, -'index.html'.length), 'index.md'), markdown, 'utf8');
}

// The hosting pipeline can invoke this optimization more than once. Seed the
// symbol map from a prior pass so a second invocation cannot replace a valid
// sprite with an empty <svg> after the page symbols have already been moved.
await loadExistingSprite();
await walk(root);
const assetDirectory = join(root, '_astro');
for (const entry of await readdir(assetDirectory, { withFileTypes: true })) {
  if (!entry.isFile() || (!entry.name.endsWith('.css') && !entry.name.endsWith('.js'))) continue;
  const path = join(assetDirectory, entry.name);
  const asset = await readFile(path, 'utf8');
  await writeFile(path, shortenAstroScopes(asset), 'utf8');
}
await writeFile(spritePath, `<svg xmlns="http://www.w3.org/2000/svg">${[...symbols.values()].join('')}</svg>`, 'utf8');

if (failures.length) {
  throw new Error(`AEO rendered-page validation failed:\n${failures.join('\n')}`);
}
