import { PUBLIC_AUDIT_RELEASE, PUBLIC_AUDIT_DISABLED } from './lib/audit/release-policy.mjs';
export default async (request, context) => {
  if (!PUBLIC_AUDIT_RELEASE.liveScanningAuthorized) {
    const configuration = request.method === 'GET' && !new URL(request.url).searchParams.has('jobId');
    return Response.json(configuration ? PUBLIC_AUDIT_DISABLED : { error: PUBLIC_AUDIT_DISABLED.message, code: 'AUDIT_RELEASE_HELD' }, { status: configuration ? 200 : 503, headers: { 'Cache-Control': 'no-store, private', 'X-Robots-Tag': 'noindex, nofollow' } });
  }
  try { const { getRuntime } = await import('./lib/audit/runtime.mjs'); return await getRuntime().website(request, context); }
  catch { return Response.json({ enabled: false, reportEnabled: false, mode: 'disabled', error: 'Live audits are temporarily unavailable.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } }); }
};
