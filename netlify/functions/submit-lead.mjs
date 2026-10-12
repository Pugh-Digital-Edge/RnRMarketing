import { readLeadFields, validateLeadFields } from "../../src/libs/lead-validation.js";
import { leadHtml } from "../../src/libs/lead-html.js";

export default async (request) => {
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  const native = request.headers.get("accept")?.includes("text/html");
  let fields;
  try {
    fields = await readLeadFields(request);
  } catch {
    return Response.json({ error: "Invalid form payload." }, { status: 422 });
  }
  const fail = (message, status) => native ? leadHtml(fields, message, status)
    : Response.json({ error: message }, { status });
  const result = validateLeadFields(fields);
  if (result.error) return fail(result.error, 422);
  if (result.ignored) {
    return Response.json({ ok: true, stage: "ignored" });
  }
  const { isRequest } = result;
  if (result.stage) {
    fields.set("lead-stage", result.stage);
    if (!fields.get("submission-id")) fields.set("submission-id", crypto.randomUUID());
  }
  const submissionId = fields.get("submission-id");
  fields.set("phone", result.phone);
  fields.set("email", result.email);
  // Keep country so the direct-POST gate also validates international numbers.

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
    return fail("Unable to submit your request. Please try again.", 502);
  }

  if (!response.ok || response.headers.get("content-type")?.includes("application/json")) {
    return fail("Unable to submit your request. Please try again.", 502);
  }

  // Netlify documents HTTP success for this registered-form AJAX POST. This
  // acknowledges that provider response; it does not assert persisted/nonspam storage.
  if (native) return Response.redirect(new URL("/thank-you/", request.url), 303);
  return Response.json(isRequest
    ? { ok: true, stage: "request_accepted", submissionId, receiptSource: "netlify_http" }
    : { ok: true });
};
