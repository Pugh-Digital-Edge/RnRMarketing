/** A calendar click is intent only. Google-hosted booking completion is separate. */
export function setupBookingClicks(root: ParentNode = document) {
  const analytics = window as Window & {
    gtag?: (command: string, event: string, params: Record<string, unknown>) => void;
    rrTracking?: { ga4Id?: string };
  };
  root.querySelectorAll<HTMLAnchorElement>("a[data-booking-placement]").forEach((link) => {
    if (link.dataset.bookingManaged === "true") return;
    link.dataset.bookingManaged = "true";
    link.addEventListener("click", () => {
      if (window.rrTrackingDisabled || !analytics.rrTracking?.ga4Id) return;
      analytics.gtag?.("event", "booking_calendar_click", {
        send_to: analytics.rrTracking.ga4Id,
        booking_placement: link.dataset.bookingPlacement,
        funnel_version: "calendar_v1",
        booking_provider: "google_calendar",
        transport_type: "beacon",
      });
    });
  });
}
