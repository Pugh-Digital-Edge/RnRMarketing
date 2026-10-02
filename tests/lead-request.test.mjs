import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/lead-request.ts', import.meta.url), 'utf8');
const script = ts.transpileModule(source.replace(/export /g, ''), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;
function setup({ isolated = false, blocked = false } = {}) {
  const stored = new Map(), events = [];
  const sessionStorage = {
    getItem: key => { if (blocked) throw Error(); return stored.get(key); },
    setItem: (key, value) => { if (blocked) throw Error(); stored.set(key, value); },
    removeItem: key => { if (blocked) throw Error(); stored.delete(key); },
  };
  const context = { sessionStorage, Date, window: {
    rrTrackingDisabled: isolated, gtag: (...args) => events.push(args),
    rrTracking: { ga4Id: 'G-TEST', googleAdsId: 'AW-TEST', leadConversionLabel: 'request' },
  } };
  vm.createContext(context);
  vm.runInContext(script + '\nthis.api = { rememberAcceptedRequest, consumeAcceptedRequest };', context);
  return { ...context.api, stored, events, window: context.window };
}
test('matching provider receipt restores request conversion and deduplicates reload/back', () => {
  const s = setup(); s.rememberAcceptedRequest('submission-1234');
  assert.equal(s.events.length, 0);
  s.consumeAcceptedRequest(); s.consumeAcceptedRequest();
  assert.deepEqual(s.events.map(e => e[1]), ['generate_lead', 'conversion']);
  assert.equal(s.events[0][2].lead_stage, 'request_accepted');
  assert.equal(s.events[0][2].receipt_source, 'netlify_http');
  assert.equal(s.events[1][2].transaction_id, 'submission-1234');
  assert.equal(s.stored.size, 0);
  assert.doesNotMatch(JSON.stringify(s.events), /email|phone_number|budget|gclid|page_location|qualified|booked/);
});
test('direct thank-you, corrupt, expired and future receipts never count', () => {
  const s = setup(); s.consumeAcceptedRequest();
  for (const raw of ['invalid-json', 'null', JSON.stringify({ id: 'submission-1234', acceptedAt: Date.now() - 31 * 60000 }),
    JSON.stringify({ id: 'submission-1234', acceptedAt: Date.now() + 60000 }), JSON.stringify({ id: 'user@example.test', acceptedAt: Date.now() })]) {
    s.stored.set('rr_accepted_request', raw); s.consumeAcceptedRequest();
    assert.equal(s.stored.size, 0);
  }
  assert.equal(s.events.length, 0);
});
test('isolated receipts remain suppressed after leaving QA mode and unavailable storage fails closed', () => {
  const s = setup({ isolated: true }); s.rememberAcceptedRequest('submission-1234');
  s.window.rrTrackingDisabled = false; s.consumeAcceptedRequest();
  assert.equal(s.events.length, 0);
  const b = setup({ blocked: true });
  assert.doesNotThrow(() => { b.rememberAcceptedRequest('submission-1234'); b.consumeAcceptedRequest(); });
  assert.equal(b.events.length, 0);
});
