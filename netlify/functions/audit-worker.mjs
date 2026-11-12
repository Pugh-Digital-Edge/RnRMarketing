import { PUBLIC_AUDIT_RELEASE } from './lib/audit/release-policy.mjs';
export default async (request) => {
  if (!PUBLIC_AUDIT_RELEASE.liveScanningAuthorized) return new Response(null, { status: 403 });
  try { const { getRuntime } = await import('./lib/audit/runtime.mjs'); return await getRuntime().worker(request); }
  catch { return new Response(null, { status: 503 }); }
};
// Held page-only release: no background-plan entitlement is required just to
// return 403. Verify the production plan, then review background:true together
// with the versioned release authorization before any real job can run.
export const config = { background: false };
