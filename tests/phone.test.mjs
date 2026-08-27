import assert from "node:assert/strict";
import test from "node:test";
import { validatePhoneNumber } from "../src/libs/phone.js";
import submitLead from "../netlify/functions/submit-lead.mjs";

test("rejects missing digits", () => {
  assert.equal(validatePhoneNumber("(310) 555-123").valid, false);
});

test("rejects extra digits", () => {
  assert.equal(validatePhoneNumber("(310) 555-12345").valid, false);
});

test("rejects letters", () => {
  assert.equal(validatePhoneNumber("310-CALL-NOW").valid, false);
});

test("rejects invalid US area codes", () => {
  assert.equal(validatePhoneNumber("(110) 555-1234").valid, false);
});

test("accepts a pasted formatted US number and normalizes it", () => {
  assert.deepEqual(validatePhoneNumber("(310) 555-1234"), { valid: true, e164: "+13105551234" });
});

test("accepts a valid number beginning with +1", () => {
  assert.deepEqual(validatePhoneNumber("+1 310 555 1234"), { valid: true, e164: "+13105551234" });
});

test("backend rejects an invalid submitted phone number", async () => {
  const response = await submitLead(new Request("https://example.test/.netlify/functions/submit-lead", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: "form-name=Contact+Form&phone-country=US&phone=310-CALL-NOW",
  }));

  assert.equal(response.status, 422);
});

test("backend stores the validated phone number as E.164", async () => {
  const previousFetch = globalThis.fetch;
  let forwardedBody = "";
  globalThis.fetch = async (_url, options) => {
    forwardedBody = options.body;
    return new Response("ok", { status: 200 });
  };

  try {
    const response = await submitLead(new Request("https://example.test/.netlify/functions/submit-lead", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: "form-name=Contact+Form&phone-country=US&phone=%28310%29+555-1234",
    }));

    assert.equal(response.status, 200);
    assert.match(forwardedBody, /phone=%2B13105551234/);
    assert.doesNotMatch(forwardedBody, /phone-country/);
  } finally {
    globalThis.fetch = previousFetch;
  }
});
