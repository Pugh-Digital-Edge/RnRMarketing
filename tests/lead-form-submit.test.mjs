import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import vm from "node:vm";
import ts from "typescript";
import { PHONE_VALIDATION_MESSAGE, validatePhoneNumber } from "../src/libs/phone.js";

const source = readFileSync(new URL("../src/scripts/lead-phone-form.ts", import.meta.url), "utf8")
  .replace(/^import .*;\r?\n/gm, "");
const script = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;

function setup(value, action = "/thank-you/", responseOk) {
  const listeners = {};
  const button = {
    disabled: false, attributes: {},
    setAttribute(name, value) { this.attributes[name] = value; },
    removeAttribute(name) { delete this.attributes[name]; },
  };
  const phone = {
    value, validityMessage: "", reported: false,
    setCustomValidity(message) { this.validityMessage = message; },
    setAttribute() {}, addEventListener() {},
    reportValidity() { this.reported = true; },
  };
  const error = { hidden: true };
  const status = { textContent: '' };
  const form = {
    action: `https://example.test${action}`, dataset: {},
    querySelector(selector) {
      return { "[data-phone-input]": phone, "[data-phone-error]": error, "[data-form-status]": status }[selector] ?? null;
    },
    querySelectorAll() { return [button]; },
    addEventListener(name, handler) { listeners[name] = handler; },
    reset() { phone.value = ''; },
  };
  let fetches = 0;
  const context = {
    document: { querySelectorAll: () => [form] },
    PHONE_VALIDATION_MESSAGE, validatePhoneNumber, URL, URLSearchParams,
    FormData: class { forEach(callback) { callback(phone.value, "phone"); } },
    fetch: () => { fetches++; return responseOk === undefined ? new Promise(() => {}) : Promise.resolve({ ok: responseOk }); },
  };
  vm.runInNewContext(script, context);
  return { phone, button, error, status, get fetches() { return fetches; },
    async submitAndWait() { await listeners.submit({ preventDefault() {} }); },
    submit() {
      const event = { defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
      void listeners.submit(event);
      return event;
    },
  };
}

test("native lead post normalizes phone without cancellation, fetch, or disabling submit", () => {
  const form = setup("(310) 555-1234");
  assert.equal(form.submit().defaultPrevented, false);
  assert.equal(form.phone.value, "+13105551234");
  assert.equal(form.button.disabled, false);
  assert.equal(form.fetches, 0);
});

test("async failure preserves entered phone and restores retry without a busy state", async () => {
  const form = setup('(202) 555-0147', '/.netlify/functions/submit-lead', false);
  await form.submitAndWait();
  assert.equal(form.phone.value, '+12025550147');
  assert.equal(form.button.disabled, false);
  assert.equal(form.button.attributes['aria-busy'], undefined);
  assert.match(form.status.textContent, /Please try again/);
});

test("async success resets the form and announces success", async () => {
  const form = setup('(202) 555-0147', '/.netlify/functions/submit-lead', true);
  await form.submitAndWait();
  assert.equal(form.phone.value, '');
  assert.equal(form.button.disabled, true);
  assert.equal(form.button.attributes['aria-busy'], undefined);
  assert.match(form.status.textContent, /message was sent/);
});

test("newsletter has a separate complete registration and contact has one field schema", () => {
  const newsletter = readFileSync(new URL('../src/components/Newsletter.astro', import.meta.url), 'utf8');
  const contact = readFileSync(new URL('../src/pages/contact.astro', import.meta.url), 'utf8');
  assert.match(newsletter, /name="Newsletter Form"[^>]*data-netlify="true"/);
  assert.match(newsletter, /name="form-name" value="Newsletter Form"/);
  assert.match(newsletter, /type="email"[^>]*name="email"[^>]*required/);
  assert.doesNotMatch(contact, /data-netlify="true"/);
  assert.match(contact, /name="zip"/);
});

test("invalid native lead post is blocked with inline and native validation", () => {
  const form = setup("310-CALL-NOW");
  assert.equal(form.submit().defaultPrevented, true);
  assert.equal(form.phone.reported, true);
  assert.equal(form.phone.validityMessage, PHONE_VALIDATION_MESSAGE);
  assert.equal(form.error.hidden, false);
  assert.equal(form.fetches, 0);
});

test("forms explicitly targeting the function retain their existing async submission", () => {
  const form = setup("(310) 555-1234", "/.netlify/functions/submit-lead");
  assert.equal(form.submit().defaultPrevented, true);
  assert.equal(form.fetches, 1);
  assert.equal(form.button.disabled, true);
  assert.equal(form.button.attributes['aria-busy'], 'true');
});

test("shared schedule form has one complete Netlify registration with the native success action", () => {
  const pages = ["../src/components/AdsLandingPage.astro", "../src/pages/schedule.astro"]
    .map(path => readFileSync(new URL(path, import.meta.url), "utf8"));
  const registrations = pages.flatMap(page => [...page.matchAll(/<form\b[^>]*>[\s\S]*?<\/form>/g)])
    .map(match => match[0])
    .filter(form => /<form[^>]*name="Schedule Lead Form"[^>]*data-netlify="true"/.test(form));
  assert.equal(registrations.length, 1, "Duplicate registrations overwrite fields and the success action");
  const form = registrations[0];
  assert.match(form, /action="\/thank-you\/"/);
  assert.match(form, /netlify-honeypot="bot-field"/);
  for (const name of ["form-name", "bot-field", "phone-country", "primary-service", "goals",
    "gclid", "gbraid", "wbraid", "utm-source", "utm-medium", "utm-campaign", "utm-term",
    "utm-content", "landing-page", "submission-id", "lead-stage", "name", "email", "phone",
    "company", "service-area", "program-scope", "monthly-budget"]) {
    assert.ok(form.includes(`name="${name}"`), `Missing registered field: ${name}`);
  }
});
