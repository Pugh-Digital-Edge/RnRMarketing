import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { manageLock } from '../scripts/seo-lock.mjs';
import { measurementQueue } from '../scripts/seo-due.mjs';
import { signals, pageErrors } from '../scripts/seo-check.mjs';

test('concurrent writers have one owner and another owner cannot release it', async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), 'rnr-seo-lock-'));
  const file = path.join(directory, 'lock');
  try {
    const results = await Promise.all(['owner-one', 'owner-two'].map(owner => manageLock(file, 'acquire', owner)));
    assert.equal(results.filter(result => result.acquired).length, 1);
    const winner = results.find(result => result.acquired).owner;
    await assert.rejects(manageLock(file, 'release', 'not-owner'), /Owner mismatch/);
    assert.equal((await manageLock(file, 'status')).owner, winner);
    await manageLock(file, 'release', winner);
    assert.equal((await manageLock(file, 'status')).locked, false);
  } finally { await rm(directory, { recursive: true, force: true }); }
});

test('SEO signal check detects canonical, robots, schema and H1 regressions', () => {
  const url = 'https://remediationrestorationmarketing.com/services/seo/';
  const html = `<title>SEO</title><meta content="Useful description" name="description"><link href="${url}" rel="canonical"><h1>SEO</h1><script type="application/ld+json">{"@id":"https://remediationrestorationmarketing.com/#localbusiness"}</script>`;
  assert.deepEqual(pageErrors(signals(html), url), []);
  assert.deepEqual(signals(html.replace('Useful description', 'SEO &#38; PPC')), signals(html.replace('Useful description', 'SEO &amp; PPC')));
  const broken = signals(html.replace('<h1>SEO</h1>', '<h1>SEO</h1><h1>Another</h1>') + '<meta name="robots" content="noindex">');
  assert.deepEqual(pageErrors(broken, url), ['H1 count is not one', 'unexpected noindex']);
  assert.throws(() => signals(html.replace('{"@id":', '{invalid:')), SyntaxError);
  assert.ok(pageErrors(signals(html.replace(url, 'https://example.com/')), url).includes('not self-canonical'));
});

test('measurement queue uses current due field and retains missing dates for reconciliation', () => {
  const rows = measurementQueue(`### SEO-001 — page
- Status: Measuring
- Measurement due date: 2026-10-13
- 2026-08-01 history: Measurement due: 2026-09-01
### SEO-002 — page
- Status: Measuring
- Verification: Measurement due 2026-09-18 only if stable.
### SEO-003 — baseline
- Status: Measuring
### SEO-004 — idea
- Status: Awaiting approval
`, '2026-09-18');
  assert.deepEqual(rows.map(row => [row.id, row.action]), [
    ['SEO-001', 'waiting'], ['SEO-002', 'measure-when-data-window-complete'], ['SEO-003', 'needs-measurement-date'],
  ]);
});
