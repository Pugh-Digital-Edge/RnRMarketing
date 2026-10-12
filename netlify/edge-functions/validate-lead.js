import { LEAD_FORMS, readLeadFields, validateLeadFields } from '../../src/libs/lead-validation.js';
import { leadHtml } from '../../src/libs/lead-html.js';

// Functions own their response/receipt. Every direct static POST still passes
// this gate, including old tabs posting to /thank-you/ and arbitrary URLs.
export default async (request, context) => {
  if (request.method !== 'POST' || new URL(request.url).pathname.startsWith('/.netlify/functions/')) return;
  let fields;
  try { fields = await readLeadFields(request.clone()); }
  catch { return Response.json({ error: 'Invalid form payload.' }, { status: 422 }); }
  if (!LEAD_FORMS.has(fields.get('form-name'))) return;
  const result = validateLeadFields(fields);
  if (result.ignored) return Response.json({ ok: true, stage: 'ignored' });
  if (result.error) return request.headers.get('accept')?.includes('text/html')
    ? leadHtml(fields, result.error, 422)
    : Response.json({ error: result.error }, { status: 422 });
  // Preserve the original body for Netlify and subsequent handlers.
  return context.next();
};

export const config = { path: '/*', onError: 'fail' };
