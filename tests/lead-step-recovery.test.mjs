import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const page = readFileSync(new URL('../src/components/AdsLandingPage.astro', import.meta.url), 'utf8');
const script = ts.transpileModule(page.match(/<script>([\s\S]*?)<\/script>/)[1].replace(/^\s*import .*;\r?\n/gm, ''), { compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None } }).outputText;
function setup() {
  const listeners = {}, windowListeners = {}, buttons = {}, sent = [];
  const field = (name, value) => ({ name, value, required: true, dataset: {}, valid: true,
    checkValidity() { return this.valid && (!this.required || !!this.value); },
    reportValidity() { this.reported = true; }, focus() { this.focused = true; } });
  const first = [field('name', 'QA Owner'), field('email', 'qa@example.test')];
  const second = [field('phone', '+12025550147'), field('company', 'QA Restoration'), field('service-area', 'QA territory'), field('program-scope', 'not-sure')];
  const step = fields => ({ hidden: false, querySelectorAll() { return fields; }, querySelector() { return { setAttribute() {}, focus() {} }; }, addEventListener() {} });
  const firstStep = step(first), secondStep = step(second);
  const id = { value: '' }, stage = { value: 'request' };
  const control = key => ({ addEventListener(name, fn) { buttons[key] = fn; } });
  const form = { dataset: {}, classList: { add() {} }, querySelector(selector) {
    return { "[data-form-step='1']": firstStep, "[data-form-step='2']": secondStep, '[data-step-next]': control('next'), '[data-step-back]': control('back'), '[data-submission-id]': id, '[data-lead-stage]': stage }[selector];
  }, addEventListener(name, fn) { listeners[name] = fn; } };
  const context = { document: { querySelector: selector => selector === '#lead-form' ? form : null },
    window: { addEventListener(name, fn) { windowListeners[name] = fn; } }, history: { state: null }, crypto,
    setupLeadFunnel: () => ({ stepTwoVisible() {} }), sessionStorage: { removeItem() {} }, URLSearchParams,
    FormData: class { forEach(fn) { [...first, ...second].forEach(f => fn(f.value, f.name)); fn(stage.value, 'lead-stage'); } },
    navigator: { sendBeacon(_url, body) { sent.push(body); return true; } },
  };
  vm.runInNewContext(script, context);
  const event = () => ({ defaultPrevented: false, stopped: false, preventDefault() { this.defaultPrevented = true; }, stopImmediatePropagation() { this.stopped = true; } });
  return { first, second, form, firstStep, secondStep, buttons, listeners, windowListeners, sent, event };
}

test('cleared hidden identity fields return to step one, focus the error and recover on correction', () => {
  const s = setup(); s.buttons.next();
  assert.equal(s.secondStep.hidden, false);
  assert.ok(s.first.every(f => !f.required));
  s.first[0].value = '  ';
  const invalid = s.event(); s.listeners.submit(invalid);
  assert.equal(invalid.defaultPrevented, true); assert.equal(invalid.stopped, true);
  assert.equal(s.firstStep.hidden, false); assert.equal(s.first[0].focused, true); assert.equal(s.first[0].reported, true);
  s.first[0].value = 'QA Corrected'; s.buttons.next();
  const corrected = s.event(); s.listeners.submit(corrected);
  assert.equal(corrected.defaultPrevented, false);
});

test('incomplete identity never triggers abandonment capture, a valid identity can recover', () => {
  const s = setup(); s.buttons.next();
  s.first[1].value = ''; s.windowListeners.pagehide(); assert.equal(s.sent.length, 0);
  s.first[1].value = 'qa@example.test'; s.windowListeners.pagehide(); s.windowListeners.pagehide();
  assert.equal(s.sent.length, 1); assert.equal(s.sent[0].get('lead-stage'), 'identity');
});

test('network error permits abandonment recovery but accepted/back-restored forms suppress it', () => {
  const s = setup(); s.buttons.next();
  s.form.dataset.submitting = 'true'; s.windowListeners.submit({ target: s.form, defaultPrevented: true });
  s.windowListeners.pagehide(); assert.equal(s.sent.length, 0);
  s.listeners['lead-request-error'](); s.windowListeners.pagehide(); assert.equal(s.sent.length, 1);
  const accepted = setup(); accepted.buttons.next(); accepted.form.dataset.responseReceived = 'true';
  accepted.windowListeners.pageshow(); accepted.windowListeners.pagehide(); assert.equal(accepted.sent.length, 0);
});


test('two-field first step never captures recovery without valid phone and company', () => {
  const s = setup();
  s.second[0].value = ''; s.second[1].value = '';
  s.buttons.next();
  assert.equal(s.secondStep.hidden, false);
  s.windowListeners.pagehide(); assert.equal(s.sent.length, 0);
  s.second[0].value = '+12025550147';
  s.windowListeners.pagehide(); assert.equal(s.sent.length, 0);
  s.second[1].value = 'QA Restoration'; s.second[0].valid = false;
  s.windowListeners.pagehide(); assert.equal(s.sent.length, 0);
  s.second[0].valid = true;
  s.windowListeners.pagehide(); s.windowListeners.pagehide();
  assert.equal(s.sent.length, 1);
  assert.equal(s.sent[0].get('lead-stage'), 'identity');
});
