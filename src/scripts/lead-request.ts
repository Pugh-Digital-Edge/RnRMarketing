/** Receipt of provider HTTP acknowledgment; never persisted, booked or qualified proof. */
export const REQUEST_RECEIPT_KEY = 'rr_accepted_request';
export function rememberAcceptedRequest(id: string) {
  try {
    sessionStorage.setItem(REQUEST_RECEIPT_KEY, JSON.stringify({
      id, acceptedAt: Date.now(), test: !!window.rrTrackingDisabled,
    }));
  } catch { /* Storage failure never blocks intake or navigation. */ }
}

export function consumeAcceptedRequest() {
  try {
    const raw = sessionStorage.getItem(REQUEST_RECEIPT_KEY);
    sessionStorage.removeItem(REQUEST_RECEIPT_KEY); // Consume before any tag call, including reloads.
    if (!raw) return;
    const receipt = JSON.parse(raw);
    if (!receipt || typeof receipt.id !== 'string' || !/^[a-zA-Z0-9-]{8,100}$/.test(receipt.id)
      || typeof receipt.acceptedAt !== 'number' || !Number.isFinite(receipt.acceptedAt)
      || receipt.acceptedAt > Date.now() || Date.now() - receipt.acceptedAt > 30 * 60 * 1000
      || receipt.test || window.rrTrackingDisabled) return;
    const analytics = window as Window & {
      gtag?: (command: string, event: string, params: Record<string, unknown>) => void;
      rrTracking?: { ga4Id?: string; googleAdsId?: string; leadConversionLabel?: string };
    };
    const tracking = analytics.rrTracking;
    if (!tracking || typeof analytics.gtag !== 'function') return;
    analytics.gtag('event', 'generate_lead', {
      send_to: tracking.ga4Id, form_id: 'lead-form', form_name: 'Schedule Lead Form',
      form_page: '/restoration-marketing/', funnel_version: 'restoration_v2', form_step: 2,
      lead_stage: 'request_accepted', receipt_source: 'netlify_http',
    });
    if (tracking.googleAdsId && tracking.leadConversionLabel) {
      analytics.gtag('event', 'conversion', { send_to: `${tracking.googleAdsId}/${tracking.leadConversionLabel}`, transaction_id: receipt.id });
    }
  } catch { /* Missing or corrupt storage fails closed: never infer an outcome. */ }
}

declare global {
  interface Window { rrTrackingDisabled?: boolean; rrTestMode?: boolean; }
}
