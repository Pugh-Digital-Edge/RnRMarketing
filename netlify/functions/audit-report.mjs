import { PUBLIC_AUDIT_RELEASE } from './lib/audit/release-policy.mjs';
export default async (request, context) => {
  if (!PUBLIC_AUDIT_RELEASE.reportDeliveryAuthorized) return Response.json({ error: 'Email reports are not enabled for this release.', code: 'AUDIT_RELEASE_HELD' }, { status: 503, headers: { 'Cache-Control': 'no-store, private' } });
  try { const { getRuntime } = await import('./lib/audit/runtime.mjs'); return await getRuntime().report(request, context); }
  catch { return Response.json({ error: 'Email reports are temporarily unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
};
