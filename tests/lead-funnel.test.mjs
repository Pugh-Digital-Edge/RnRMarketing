import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/scripts/lead-funnel.ts', import.meta.url), 'utf8').replace('export function', 'function');
const script = ts.transpileModule(source, { compilerOptions: { target: ts.ScriptTarget.ES2022 } }).outputText;
function setup(path = '/restoration-marketing/') {
  const events = [], listeners = {};
  let intersection, visible = false;
  class Field { constructor(name, type = 'text') { this.name = name; this.type = type; this.validity = { valid: true }; } }
  const form = { dataset: {}, addEventListener(name, cb) { listeners[name] = cb; },
    getBoundingClientRect: () => ({ width: 300, height: 600, top: visible ? 100 : 1000, bottom: visible ? 700 : 1600, left: 0, right: 300 }) };
  const context = { window: { location: { pathname: path }, innerHeight: 800, innerWidth: 400,
    gtag: (...args) => events.push(args), rrTracking: { ga4Id: 'G-TEST' }, IntersectionObserver: true },
    IntersectionObserver: class { constructor(cb) { intersection = cb; } observe() {} disconnect() {} },
    HTMLInputElement: Field, HTMLSelectElement: Field, HTMLTextAreaElement: Field, form };
  vm.createContext(context);
  vm.runInContext(script + '\nthis.funnel = setupLeadFunnel(form);', context);
  return { events, form, Field, funnel: context.funnel,
    emit: (name, target) => listeners[name]({ target }),
    view() { visible = true; intersection([{ isIntersecting: true, intersectionRatio: .01 }]); } };
}
test('viewport, field focus and step two are ordered and deduplicated', () => {
  const s = setup();
  assert.equal(s.events.length, 0);
  s.emit('focusin', {}); // Legend/button focus is not form engagement.
  s.view(); s.view();
  s.emit('focusin', new s.Field('name')); s.emit('focusin', new s.Field('email'));
  s.form.dataset.currentStep = '2';
  s.funnel.stepTwoVisible(); s.funnel.stepTwoVisible();
  assert.deepEqual(s.events.map(e => e[1]), ['form_view', 'form_start', 'form_step_2']);
  assert.equal(s.events[2][2].form_step, 2);
  assert.equal(s.events[2][2].send_to, 'G-TEST');
});
test('phone blur captures disabled-submit failures without PII or duplicate invalid events', () => {
  const s = setup(), phone = new s.Field('phone', 'tel');
  phone.value = 'private phone value';
  phone.validity = { valid: false, customError: true };
  s.emit('focusout', phone); s.emit('invalid', phone); s.emit('invalid', phone);
  assert.equal(s.events.length, 1);
  assert.equal(s.events[0][2].field_name, 'phone');
  assert.equal(s.events[0][2].error_type, 'invalid_phone');
  assert.ok(!JSON.stringify(s.events).includes(phone.value));
  s.emit('input', phone); s.emit('invalid', phone);
  assert.equal(s.events.length, 2);
  phone.validity = { valid: true };
  s.emit('input', phone); s.emit('focusout', phone);
  assert.equal(s.events.length, 2);
});
test('required and malformed email errors are distinguished and hidden fields excluded', () => {
  const s = setup(), email = new s.Field('email', 'email');
  email.validity = { valid: false, valueMissing: true };
  s.emit('invalid', email);
  s.emit('input', email); email.validity = { valid: false, typeMismatch: true };
  s.emit('invalid', email);
  const hidden = new s.Field('gclid', 'hidden'); hidden.validity = { valid: false };
  s.emit('invalid', hidden);
  assert.deepEqual(s.events.map(e => e[2].error_type), ['required', 'invalid_format']);
});
test('other landing pages retain their existing instrumentation', () => {
  const s = setup('/schedule/');
  assert.equal(s.funnel, undefined);
  assert.equal(s.form.dataset.funnelManaged, undefined);
  assert.equal(s.events.length, 0);
});
