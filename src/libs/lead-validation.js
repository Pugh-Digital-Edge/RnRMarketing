import { validatePhoneNumber } from './phone.js';

export const LEAD_FORMS = new Set(['Schedule Lead Form', 'Contact Form', 'Chat Widget Submission']);
const scopes = new Set(['full-program', 'paid-led', 'single-service', 'not-sure']);

export async function readLeadFields(request) {
  const type = request.headers.get('content-type') || '';
  let entries;
  if (type.includes('application/json')) {
    const value = await request.json();
    if (!value || Array.isArray(value) || typeof value !== 'object'
      || Object.values(value).some(item => typeof item !== 'string')) throw Error('Invalid payload');
    entries = Object.entries(value);
  } else if (type.includes('multipart/form-data')) {
    entries = [...await request.formData()];
    if (entries.some(([, value]) => typeof value !== 'string')) throw Error('Files are not supported');
  } else {
    entries = [...new URLSearchParams(await request.text())];
  }
  const fields = new URLSearchParams();
  for (const [key, value] of entries) {
    if (fields.has(key)) throw Error('Duplicate form field');
    fields.set(key, value);
  }
  return fields;
}

/** Shared by the function and the gate before Netlify Forms storage. */
export function validateLeadFields(fields) {
  const formName = fields.get('form-name');
  if (!LEAD_FORMS.has(formName)) return { error: 'Unknown lead form.' };
  if (fields.get('bot-field') || fields.get('chat-bot-field') || fields.get('test-flow') === '1') {
    return { ignored: true };
  }
  const phone = validatePhoneNumber(fields.get('phone') || '', fields.get('phone-country') || 'US');
  if (!phone.valid) return { error: 'Please enter a valid phone number, including the area code.' };
  const email = (fields.get('email') || '').trim();
  if (!fields.get('name')?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'Please complete your name and a valid email address.' };
  }
  if (formName === 'Schedule Lead Form') {
    const stage = fields.get('lead-stage') || 'request';
    const id = fields.get('submission-id') || '';
    if (!['identity', 'request'].includes(stage) || (id && !/^[a-zA-Z0-9-]{8,100}$/.test(id))) {
      return { error: 'Invalid request details. Please try again.' };
    }
    if (!fields.get('company')?.trim()) return { error: 'Please enter your company name.' };
    if (stage === 'identity' && !id) return { error: 'Invalid request details. Please try again.' };
    const paid = fields.has('program-scope') || fields.get('landing-page')?.replace(/\/$/, '') === '/restoration-marketing';
    if (stage === 'request' && (!fields.get('service-area')?.trim()
      || (paid ? !scopes.has(fields.get('program-scope')) : !fields.get('primary-service')?.trim()))) {
      return { error: 'Please complete your service territory and requested help.' };
    }
    return { phone: phone.e164, email, stage, isRequest: stage === 'request' };
  }
  const message = fields.get(formName === 'Contact Form' ? 'Message' : 'message');
  const zip = fields.get('zip') || '';
  // /contact/ explicitly offers optional ZIP; the homepage still requires it
  // in its own UI. Both share this Netlify form name and server contract.
  if (!message?.trim() || (formName === 'Contact Form' && zip && !/^\d{5}(-\d{4})?$/.test(zip))) {
    return { error: 'Please complete your message and enter a valid ZIP code if supplied.' };
  }
  return { phone: phone.e164, email };
}
