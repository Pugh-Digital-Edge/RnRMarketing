import test from 'node:test';
import assert from 'node:assert/strict';
import http from 'node:http';
import https from 'node:https';
import { PREVIEW_FIXTURES, scanPreviewFixture } from '../scripts/lib/audit-preview-fixtures.mjs';

const findCheck = (report, id) => report.checks.find(check => check.id === id);

test('three explicitly fictional fixture inputs are available and immutable', () => {
  assert.equal(PREVIEW_FIXTURES.length, 3);
  assert.equal(new Set(PREVIEW_FIXTURES.map(fixture => fixture.url)).size, 3);
  assert.ok(Object.isFrozen(PREVIEW_FIXTURES));
  for (const fixture of PREVIEW_FIXTURES) {
    assert.ok(Object.isFrozen(fixture));
    assert.match(fixture.label, /fictional/i);
    assert.equal(new URL(fixture.url).protocol, 'https:');
    assert.ok(fixture.service && fixture.area);
  }
});

test('real HTML parsing and scoring yield distinct ready, gaps, and unknown preview reports', async () => {
  const [ready, gaps, blocked] = await Promise.all(PREVIEW_FIXTURES.map(fixture => scanPreviewFixture(fixture)));
  assert.equal(ready.score, 100);
  assert.ok(gaps.score !== null && gaps.score < 70);
  assert.equal(blocked.score, null);
  assert.equal(findCheck(ready, 'tap-to-call').status, 'pass');
  assert.equal(findCheck(gaps, 'tap-to-call').status, 'fail');
  assert.equal(findCheck(gaps, 'area-clarity').status, 'fail');
  assert.equal(findCheck(gaps, 'page-title').status, 'fail');
  assert.equal(findCheck(gaps, 'viewport').status, 'fail');
  assert.equal(findCheck(gaps, 'service-clarity').status, 'pass');
  assert.equal(findCheck(blocked, 'tap-to-call').status, 'unknown');
  assert.equal(findCheck(blocked, 'service-clarity').status, 'unknown');
  assert.equal(findCheck(blocked, 'trust-cues').status, 'unknown');
  assert.equal(findCheck(blocked, 'page-title').status, 'pass');
  assert.ok(blocked.categories.some(category => category.score === null));
  assert.equal(blocked.pages.filter(page => page.status === 'unavailable').length, 4);
  for (const report of [ready, gaps, blocked]) {
    assert.equal(report.version, 1);
    assert.equal(report.pages.length, 5);
    assert.equal(report.fixes.length, 3);
    assert.equal(report.categories.length, 4);
    assert.equal(report.checks.length, 11);
    assert.ok(Number.isFinite(Date.parse(report.generatedAt)));
    assert.ok(report.checks.every(check => check.evidence.length > 0));
    assert.ok(report.fixes.every(fix => fix.title && fix.why && fix.action && fix.evidence.length > 0));
    assert.ok(report.pages.every(page => new URL(page.url).origin === new URL(report.url).origin));
    assert.match(report.limitations[0], /LOCAL PREVIEW ONLY.*fictional.*No real website/);
    assert.ok(Buffer.byteLength(JSON.stringify(report)) < 65_536);
  }
  assert.equal(ready.pages.every(page => page.status === 'checked'), true);
  assert.equal(gaps.pages.every(page => page.status === 'checked'), true);
});

test('actual supplied service and area change findings without changing the fixed fixture content', async () => {
  const original = await scanPreviewFixture(PREVIEW_FIXTURES[0]);
  const changed = await scanPreviewFixture({ ...PREVIEW_FIXTURES[0], service: 'Mold remediation', area: 'Seattle, WA' });
  assert.equal(findCheck(original, 'service-clarity').status, 'pass');
  assert.equal(findCheck(original, 'area-clarity').status, 'pass');
  assert.equal(findCheck(changed, 'service-clarity').status, 'fail');
  assert.equal(findCheck(changed, 'area-clarity').status, 'fail');
  assert.ok(changed.score < original.score);
  assert.equal(changed.service, 'Mold remediation');
  assert.equal(changed.area, 'Seattle, WA');
  assert.equal(changed.pages.length, original.pages.length);
});

test('preview transport never calls native HTTP/HTTPS or fetch for accepted fixtures', async t => {
  const denyNetwork = () => { throw new Error('Network use is forbidden in the local fixture preview.'); };
  t.mock.method(http, 'request', denyNetwork);
  t.mock.method(https, 'request', denyNetwork);
  t.mock.method(globalThis, 'fetch', denyNetwork);
  for (const fixture of PREVIEW_FIXTURES) {
    const report = await scanPreviewFixture(fixture);
    assert.equal(report.pages.length, 5);
    assert.equal(report.pages[0].status, 'checked');
  }
});

test('unknown, private, credentialed, malformed, and lookalike URLs reject before any transport', async t => {
  let calls = 0;
  const denyNetwork = () => { calls++; throw new Error('Unexpected network'); };
  t.mock.method(http, 'request', denyNetwork);
  t.mock.method(https, 'request', denyNetwork);
  t.mock.method(globalThis, 'fetch', denyNetwork);
  for (const url of [
    'https://real-company.com/', 'https://ready.preview-restoration.com.attacker.com/',
    'https://preview-restoration.com/', 'http://ready.preview-restoration.com/',
    'http://127.0.0.1/', 'https://user@ready.preview-restoration.com/',
    'https://ready.preview-restoration.com:443/', 'not a website', '', undefined,
  ]) {
    await assert.rejects(scanPreviewFixture({ ...PREVIEW_FIXTURES[0], url }), { code: 'PREVIEW_FIXTURE_ONLY' }, String(url));
  }
  assert.equal(calls, 0);
});

test('ordinary URL normalization works while traversal paths cannot select arbitrary local data', async () => {
  const report = await scanPreviewFixture({ ...PREVIEW_FIXTURES[0], url: 'ready.preview-restoration.com/../../etc/passwd?arbitrary=file' });
  assert.equal(report.url, PREVIEW_FIXTURES[0].url);
  assert.equal(report.score, 100);
  assert.equal(report.pages.length, 5);
  assert.equal(report.pages.some(page => page.url.includes('passwd')), false);
});
