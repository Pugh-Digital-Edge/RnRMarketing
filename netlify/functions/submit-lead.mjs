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
  const fields = contentType.includes("application/json")
    ? new URLSearchParams(Object.entries(await request.json()))
    : new URLSearchParams(await request.text());
  const formName = fields.get("form-name") || "";
  const country = fields.get("phone-country") || "US";
  const phone = fields.get("phone") || "";
  const result = validatePhoneNumber(phone, country);

  if (!ALLOWED_FORMS.has(formName) || !result.valid) {
    return Response.json({ error: "Please enter a valid phone number, including the area code." }, { status: 422 });
  }

  fields.set("phone", result.e164);
  fields.delete("phone-country");

  // Netlify detects these static forms at build time. Forwarding the validated,
  // normalized payload to the site's form endpoint keeps its existing routing,
  // notifications, and storage while ensuring bypasses are rejected here first.
  const siteUrl = process.env.URL || new URL(request.url).origin;
  const response = await fetch(`${siteUrl}/`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: fields.toString(),
  });

  if (!response.ok) {
    return Response.json({ error: "Unable to submit your request." }, { status: 502 });
  }

  return Response.json({ ok: true });
};
