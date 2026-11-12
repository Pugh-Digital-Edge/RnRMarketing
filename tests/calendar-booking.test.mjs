import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/booking-clicks.ts', import.meta.url), 'utf8');
const script = ts.transpileModule(source.replace('export function', 'function'), {
  compilerOptions: { target: ts.ScriptTarget.ES2022 },
}).outputText;
function setup({ disabled = false, analytics = true } = {}) {
  const events = [], handlers = [];
  const link = { dataset: { bookingPlacement: 'hero' }, addEventListener(_name, callback) { handlers.push(callback); } };
  const context = { window: { rrTrackingDisabled: disabled, rrTracking: { ga4Id: 'G-TEST' },
    ...(analytics ? { gtag: (...args) => events.push(args) } : {}) },
    document: { querySelectorAll: () => [link] } };
  vm.createContext(context);
  vm.runInContext(script + '\nsetupBookingClicks(); setupBookingClicks();', context);
  return { events, handlers, click: () => handlers.forEach(fn => fn()) };
}

test('paid page uses one single-step request form with a typed receipt and no calendar shortcut', () => {
  const page = readFileSync(new URL('../src/components/AdsLandingPage.astro', import.meta.url), 'utf8');
  const forms = [...page.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)].map(m => m[0]);
  assert.equal(forms.length, 1);
  const form = forms[0];
  assert.match(form, /<form[^>]*id="lead-form"[^>]*action="\/\.netlify\/functions\/submit-lead"[^>]*data-success-redirect="\/thank-you\/"[^>]*data-lead-phone-form[^>]*data-request-receipt/);
  assert.doesNotMatch(form, /data-netlify|data-step=|cs-form-continue/, 'registration stays on /schedule/ and the form is single-step');
  for (const name of ['name', 'email', 'phone', 'company', 'service-area', 'program-scope', 'monthly-budget']) {
    assert.match(form, new RegExp(`<(input|select) required[^>]*name="${name}"`), `Missing required field: ${name}`);
  }
  for (const name of ['submission-id', 'lead-stage', 'landing-page', 'gclid', 'bot-field']) {
    assert.ok(form.includes(`name="${name}"`), `Missing hidden field: ${name}`);
  }
  assert.match(form, /data-form-status/);
  assert.doesNotMatch(page, /bookingUrl|data-booking-placement|captureAbandonment|sendBeacon|setupLeadFunnel/);
});

test('calendar clicks are GA4-only intent, without contact data or a lead conversion', () => {
  const s = setup();
  assert.equal(s.events.length, 0);
  assert.equal(s.handlers.length, 1, 'repeat setup cannot duplicate tracking');
  s.click();
  assert.equal(s.events.length, 1);
  const [command, event, params] = s.events[0];
  assert.equal(command, 'event');
  assert.equal(event, 'booking_calendar_click');
  assert.equal(params.send_to, 'G-TEST');
  assert.equal(params.booking_placement, 'hero');
  assert.equal(params.funnel_version, 'calendar_v1');
  assert.deepEqual(Object.keys(params).sort(), ['booking_placement', 'booking_provider', 'funnel_version', 'send_to', 'transport_type']);
  assert.doesNotMatch(JSON.stringify(s.events), /generate_lead|conversion|user_data|gclid|email|phone/);
});

test('privacy suppression and unavailable analytics do not interfere with navigation', () => {
  for (const config of [{ disabled: true }, { analytics: false }]) {
    const s = setup(config);
    assert.doesNotThrow(s.click);
    assert.equal(s.events.length, 0);
  }
});
