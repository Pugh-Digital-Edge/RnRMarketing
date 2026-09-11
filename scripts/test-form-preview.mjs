// Local-only form QA: serves dist and captures posts instead of contacting Netlify.
// Run: node scripts/test-form-preview.mjs. Test controls: /__qa/state (GET/POST).
import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import submitLead from '../netlify/functions/submit-lead.mjs';

const port = 4337;
const origin = `http://127.0.0.1:${port}`;
process.env.URL = origin;
const root = path.resolve('dist');
const posts = [];
let fail = false;
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2' };

http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, origin);
    const chunks = [];
    for await (const chunk of req) chunks.push(chunk);
    const body = Buffer.concat(chunks).toString();
    if (url.pathname === '/__qa/state') {
      if (req.method === 'POST') { const update = JSON.parse(body); fail = !!update.fail; if (update.reset) posts.length = 0; }
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ fail, posts }));
    }
    if (url.pathname === '/.netlify/functions/submit-lead') {
      const result = await submitLead(new Request(url, { method: req.method, headers: req.headers, ...(req.method === 'POST' ? { body } : {}) }));
      res.writeHead(result.status, Object.fromEntries(result.headers));
      return res.end(await result.text());
    }
    if (req.method === 'POST') {
      posts.push({ path: url.pathname, fields: Object.fromEntries(new URLSearchParams(body)), failed: fail });
      if (fail) { res.writeHead(503); return res.end('Simulated storage failure'); }
      if (url.pathname === '/') return res.end('Captured locally');
      res.writeHead(303, { Location: url.pathname === '/thank-you/' ? '/thank-you/' : '/__qa/success' });
      return res.end();
    }
    if (url.pathname === '/__qa/success') {
      res.setHeader('Content-Type', 'text/html');
      return res.end('<h1>Test subscription captured locally.</h1>');
    }
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(root + path.sep) && file !== root) { res.writeHead(403); return res.end(); }
    if ((await fs.stat(file)).isDirectory()) file = path.join(file, 'index.html');
    res.setHeader('Content-Type', types[path.extname(file)] || 'application/octet-stream');
    res.end(await fs.readFile(file));
  } catch (error) { res.writeHead(404); res.end('Not found'); }
}).listen(port, '127.0.0.1', () => console.log(`Local form QA: ${origin}; all form storage stays here.`));
