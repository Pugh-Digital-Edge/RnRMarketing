// Checklist signups are intentionally separate from phone-qualified sales leads.
export default async (request) => {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
  const fields = new URLSearchParams(await request.text());
  const email = (fields.get('email') || '').trim();
  if (fields.get('form-name') !== 'AI Checklist Form' || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ error: 'Enter a valid email address.' }, { status: 422 });
  }
  if (fields.get('bot-field')) return Response.json({ ok: true });
  const forwarded = new URLSearchParams({ 'form-name': 'AI Checklist Form', email });
  for (const key of ['landing-page', 'utm-source', 'utm-medium', 'utm-campaign']) {
    forwarded.set(key, (fields.get(key) || '').slice(0, 2048));
  }
  try {
    const origin = process.env.URL || new URL(request.url).origin;
    const response = await fetch(`${origin}/`, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: forwarded });
    if (!response.ok) throw new Error('Upstream failed');
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: 'Unable to submit. Please try again.' }, { status: 502 });
  }
};
