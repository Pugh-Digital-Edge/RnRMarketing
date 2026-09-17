/** Measurement only: never send field values or validation-message text to GA4. */
export function setupLeadFunnel(form: HTMLFormElement) {
  if (window.location.pathname.replace(/\/$/, "") !== "/restoration-marketing") return;
  form.dataset.funnelManaged = "true";
  const analytics = window as Window & {
    gtag?: (command: string, event: string, params: Record<string, unknown>) => void;
    rrTracking?: { ga4Id?: string };
  };
  const seen = new Set<string>();
  const invalidFields = new WeakSet<Element>();
  const send = (name: string, params: Record<string, unknown> = {}) => {
    analytics.gtag?.("event", name, {
      send_to: analytics.rrTracking?.ga4Id,
      form_id: "lead-form",
      form_name: "Schedule Lead Form",
      funnel_version: "restoration_v1",
      form_page: "/restoration-marketing/",
      form_step: Number(form.dataset.currentStep || 1),
      ...params,
    });
  };
  const once = (name: string) => {
    if (seen.has(name)) return;
    seen.add(name);
    send(name);
  };
  const checkView = () => {
    const rect = form.getBoundingClientRect();
    if (rect.width > 0 && rect.height > 0 && rect.top < window.innerHeight && rect.bottom > 0
      && rect.left < window.innerWidth && rect.right > 0) once("form_view");
  };
  if (typeof IntersectionObserver !== "undefined") {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && entry.intersectionRatio > 0) {
        once("form_view");
        observer.disconnect();
      }
    });
    observer.observe(form);
  } else {
    window.addEventListener("scroll", checkView, { passive: true });
    window.addEventListener("resize", checkView);
  }
  checkView();
  const isField = (target: EventTarget | null): target is HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement =>
    (target instanceof HTMLInputElement || target instanceof HTMLSelectElement || target instanceof HTMLTextAreaElement)
    && target.type !== "hidden" && target.name !== "bot-field";
  form.addEventListener("focusin", (event) => {
    if (!isField(event.target)) return;
    checkView(); // Keep viewport entry before focus even if the observer callback is pending.
    once("form_start");
  });
  const reportError = (target: EventTarget | null) => {
    if (!isField(target) || target.validity.valid || invalidFields.has(target)) return;
    const allowedFields = ["name", "email", "phone", "company", "service-area", "program-scope", "monthly-budget"];
    if (!allowedFields.includes(target.name)) return;
    invalidFields.add(target);
    send("form_error", {
      field_name: target.name,
      error_type: target.validity.valueMissing ? "required"
        : target.validity.typeMismatch ? "invalid_format"
        : target.name === "phone" ? "invalid_phone" : "invalid_value",
    });
  };
  // invalid does not bubble; checkValidity + reportValidity must count only once.
  form.addEventListener("invalid", (event) => reportError(event.target), true);
  form.addEventListener("focusout", (event) => {
    // Phone validation can disable submit before a native invalid event occurs.
    if (isField(event.target) && event.target.name === "phone") reportError(event.target);
  });
  form.addEventListener("input", (event) => {
    if (isField(event.target)) invalidFields.delete(event.target);
  });
  form.addEventListener("change", (event) => {
    if (isField(event.target)) invalidFields.delete(event.target);
  });
  return { stepTwoVisible: () => once("form_step_2") };
}
