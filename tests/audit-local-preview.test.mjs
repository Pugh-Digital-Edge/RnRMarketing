import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import http from 'node:http';
import { startAuditLocalPreview } from '../scripts/audit-local-preview.mjs';

async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'rnr-functional-preview-test-'));
  const assets = join(root, 'assets'); await mkdir(join(assets, 'website-audit'), { recursive: true });
  await writeFile(join(assets, 'website-audit/index.html'), '<!doctype html><title>Fixture assets</title><h1>Local audit</h1>');
  const directory = join(root, 'state');
  let preview = await startAuditLocalPreview({ assetsDirectory: assets, stateDirectory: directory, port: 0 });
  t.after(async () => { await preview.close(); await rm(root, { recursive: true, force: true }); });
  return { get preview() { return preview; }, root, assets, directory,
    async restart() { await preview.close(); preview = await startAuditLocalPreview({ assetsDirectory: assets, stateDirectory: directory, port: 0 }); },
  };
}

async function client(preview) {
  const response = await fetch(`${preview.origin}/.netlify/functions/website-audit`);
  const config = await response.json();
  let cookie = response.headers.get('set-cookie')?.split(';')[0];
  const headers = () => ({ Origin: preview.origin, 'Content-Type': 'application/json', 'X-Audit-Preview-CSRF': config.csrfToken, ...(cookie ? { Cookie: cookie } : {}) });
  return { config, cookie,
    async submit(input) {
      const response = await fetch(`${preview.origin}/.netlify/functions/website-audit`, { method: 'POST', headers: headers(), body: JSON.stringify({ ...input, botToken: 'local-preview' }) });
      cookie = response.headers.get('set-cookie')?.split(';')[0] ?? cookie;
      return { response, body: await response.json() };
    },
    async poll(job) {
      for (let attempt = 0; attempt < 100; attempt++) {
        const response = await fetch(`${preview.origin}/.netlify/functions/website-audit?jobId=${job.jobId}`, { headers: { Authorization: `Bearer ${job.accessToken}` } });
        const body = await response.json();
        if (body.status === 'complete' || body.status === 'failed') return body;
        await new Promise(resolve => setTimeout(resolve, 10));
      }
      throw new Error('Local fixture worker did not complete.');
    },
    async save(job, email = 'owner@example.com') {
      const response = await fetch(`${preview.origin}/.netlify/functions/audit-report`, { method: 'POST', headers: headers(), body: JSON.stringify({ ...job, email, marketingConsent: false, botToken: 'local-preview' }) });
      return { response, body: await response.json() };
    },
  };
}

test('functional loopback preview runs the real fixture scanner and saves an honest local outbox report', async t => {
  const { preview } = await fixture(t);
  const local = await client(preview);
  assert.equal(local.config.mode, 'local');
  assert.equal(local.config.localPreview, true);
  assert.equal(local.config.fixtures.length, 3);
  assert.match(local.cookie, /^rnr_audit_local=/);
  const input = local.config.fixtures[0];
  const { response, body: job } = await local.submit(input);
  assert.equal(response.status, 202);
  const completed = await local.poll(job);
  assert.equal(completed.status, 'complete');
  assert.equal(completed.report.score, 100);
  assert.equal(completed.report.pages.filter(page => page.status === 'checked').length, 5);
  const cached = await local.submit(input);
  assert.equal(cached.body.cached, true);
  assert.equal(cached.body.jobId, job.jobId);
  const saved = await local.save(job);
  assert.equal(saved.response.status, 200);
  assert.equal(saved.body.previewSaved, true);
  assert.equal('delivered' in saved.body, false);
  assert.match(saved.body.previewReportUrl, /^\/__audit-preview\/outbox\/[a-f0-9]{64}$/);
  const artifact = await fetch(preview.origin + saved.body.previewReportUrl);
  const html = await artifact.text();
  assert.equal(artifact.status, 200);
  assert.match(html, /LOCAL PREVIEW/);
  assert.match(html, /No email was sent/);
  assert.match(html, /Three prioritized fixes/);
  const again = await local.save(job);
  assert.equal(again.body.previewSaved, true);
  assert.equal(again.body.previewReportUrl, saved.body.previewReportUrl);
});

test('fixture cache and IP quota survive restart without a provider or a website credential', async t => {
  const environment = await fixture(t);
  let local = await client(environment.preview);
  const first = await local.submit(local.config.fixtures[0]);
  await local.poll(first.body);
  await environment.restart();
  local = await client(environment.preview);
  const cached = await local.submit(local.config.fixtures[0]);
  assert.equal(cached.body.cached, true);
  for (const input of local.config.fixtures.slice(1)) {
    const job = await local.submit(input); assert.equal(job.response.status, 202); await local.poll(job.body);
  }
  const denied = await local.submit({ ...local.config.fixtures[0], area: 'Seattle, WA' });
  assert.equal(denied.response.status, 429);
  assert.equal(denied.body.code, 'IP_QUOTA');
});

test('local preview rejects hostile Host/Origin/CSRF, unknown targets, direct workers and production mode', async t => {
  const { preview, assets, root } = await fixture(t);
  const local = await client(preview);
  const target = new URL(preview.origin);
  const hostileHost = await new Promise((done, fail) => {
    const request = http.get({ hostname: target.hostname, port: target.port, path: '/', headers: { Host: 'attacker.example' } }, response => { response.resume(); done(response.statusCode); });
    request.on('error', fail);
  });
  assert.equal(hostileHost, 403);
  assert.equal((await fetch(preview.origin, { headers: { Origin: 'https://attacker.example' } })).status, 403);
  assert.equal((await fetch(preview.origin, { headers: { 'Sec-Fetch-Site': 'cross-site' } })).status, 403);
  assert.equal((await fetch(`${preview.origin}/.netlify/functions/website-audit`, { method: 'POST', headers: { Origin: preview.origin, 'Content-Type': 'application/json' }, body: '{}' })).status, 403);
  assert.equal((await fetch(`${preview.origin}/.netlify/functions/audit-worker`)).status, 403);
  const denied = await local.submit({ ...local.config.fixtures[0], url: 'https://www.google.com/' });
  assert.equal(denied.response.status, 422);
  assert.equal(denied.body.code, 'PREVIEW_FIXTURE_ONLY');
  await assert.rejects(startAuditLocalPreview({ assetsDirectory: assets, stateDirectory: join(root, 'forbidden'), env: { NODE_ENV: 'production' }, port: 0 }), /local-only/);
  assert.equal((await fetch(preview.origin)).headers.get('access-control-allow-origin'), null);
});
