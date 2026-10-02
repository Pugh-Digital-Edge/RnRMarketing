import { validatePhoneNumber } from "../../src/libs/phone.js";

const ALLOWED_FORMS = new Set([
  "Schedule Lead Form",
  "Contact Form",
  "Chat Widget Submission",
]);

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const contentType = request.headers.get("content-type") || "";
  let fields;
  try {
    fields = contentType.includes("application/json")
      ? new URLSearchParams(Object.entries(await request.json()))
      : new URLSearchParams(await request.text());
  } catch {
    return Response.json({ error: "Invalid form payload." }, { status: 422 });
  }
  const formName = fields.get("form-name") || "";
  const country = fields.get("phone-country") || "US";
  const phone = fields.get("phone") || "";
  const result = validatePhoneNumber(phone, country);

  if (!ALLOWED_FORMS.has(formName) || !result.valid) {
    return Response.json({ error: "Please enter a valid phone number, including the area code." }, { status: 422 });
  }

  const isRequest = formName === "Schedule Lead Form" && fields.get("lead-stage") === "request";
  const submissionId = fields.get("submission-id") || "";
  if (isRequest && (!/^[a-zA-Z0-9-]{8,100}$/.test(submissionId)
    || !fields.get("name")?.trim() || !fields.get("company")?.trim()
    || !fields.get("service-area")?.trim() || !fields.get("program-scope")
    || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.get("email") || ""))) {
    return Response.json({ error: "Please complete your contact details and territory." }, { status: 422 });
  }
  if (fields.get("bot-field") || fields.get("test-flow") === "1") {
    return Response.json({ ok: true, stage: "ignored" });
  }
  fields.set("phone", result.e164);
  fields.delete("phone-country");

  // Netlify detects these static forms at build time. Forwarding the validated,
  // normalized payload to the site's form endpoint keeps its existing routing,
  // notifications, and storage while ensuring bypasses are rejected here first.
  const siteUrl = process.env.URL || new URL(request.url).origin;
  let response;
  try { response = await fetch(`${siteUrl}/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: fields.toString(),
  }); } catch {
    return Response.json({ error: "Unable to submit your request." }, { status: 502 });
  }

  if (!response.ok || (isRequest && response.headers.get("content-type")?.includes("application/json"))) {
    return Response.json({ error: "Unable to submit your request." }, { status: 502 });
  }

  // Netlify documents HTTP success for this registered-form AJAX POST. This
  // acknowledges that provider response; it does not assert persisted/nonspam storage.
  return Response.json(isRequest
    ? { ok: true, stage: "request_accepted", submissionId, receiptSource: "netlify_http" }
    : { ok: true });
};
