import { rememberAcceptedRequest } from "./lead-request";
import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { PHONE_VALIDATION_MESSAGE, validatePhoneNumber } from "@libs/phone";

const endpoint = "/.netlify/functions/submit-lead";

function setupLeadForm(form: HTMLFormElement) {
  const phone = form.querySelector<HTMLInputElement>("[data-phone-input]");
  const country = form.querySelector<HTMLSelectElement>("[data-phone-country]");
  const error = form.querySelector<HTMLElement>("[data-phone-error]");
  const submitButtons = form.querySelectorAll<HTMLButtonElement>("button[type='submit'], .cs-form-continue");

  if (!phone || !error) return;

  if (country) {
    const countryNames = typeof Intl.DisplayNames === "function"
      ? new Intl.DisplayNames(["en"], { type: "region" })
      : null;
    country.replaceChildren(
      ...getCountries().map((countryCode) => {
        const option = new Option(
          `${countryNames?.of(countryCode) || countryCode} +${getCountryCallingCode(countryCode)}`,
          countryCode,
          false,
          countryCode === "US",
        );
        return option;
      }),
    );
  }

  let touched = false;
  const validate = () => {
    const result = validatePhoneNumber(phone.value, country?.value || "US");
    const valid = phone.value.length > 0 && result.valid;

    phone.setCustomValidity(valid ? "" : PHONE_VALIDATION_MESSAGE);
    phone.setAttribute("aria-invalid", String(!valid));
    error.hidden = valid || !touched;
    submitButtons.forEach((button) => {
      button.disabled = !valid || form.dataset.submitting === "true";
    });

    return result;
  };

  phone.addEventListener("input", () => {
    touched = true;
    validate();
  });
  phone.addEventListener("blur", () => {
    touched = true;
    validate();
  });
  phone.addEventListener("invalid", () => {
    touched = true;
    validate();
  });
  country?.addEventListener("change", () => {
    touched = true;
    validate();
  });
  validate();

  form.addEventListener("submit", async (event) => {
    if (form.dataset.submitting === "true") { event.preventDefault(); return; }
    touched = true;
    const result = validate();
    if (!result.valid || !result.e164) {
      event.preventDefault();
      phone.reportValidity();
      return;
    }

    phone.value = result.e164;

    // The paid form requires an explicit receipt from the existing function.
    // Its native action remains the no-JavaScript fallback; other native forms post directly.
    const requestReceipt = form.hasAttribute("data-request-receipt");
    if (!requestReceipt && new URL(form.action).pathname !== endpoint) return;

    event.preventDefault();
    // Explicit production QA opt-in must never create a real lead. Local QA uses intercepted POSTs.
    if (requestReceipt && window.rrTestMode
      && !["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname)) {
      const status = form.querySelector<HTMLElement>("[data-form-status]");
      if (status) status.textContent = "Test mode: submissions are disabled here. Use the isolated local preview.";
      return;
    }
    form.dataset.submitting = "true";
    const status = form.querySelector<HTMLElement>("[data-form-status]");
    if (status) status.textContent = "Sending your message…";
    submitButtons.forEach((button) => {
      button.disabled = true;
      button.setAttribute("aria-busy", "true");
    });

    try {
      const body = new URLSearchParams();
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") body.append(key, value);
      });

      if (requestReceipt && (window.rrTestMode || ["localhost", "127.0.0.1", "[::1]"].includes(window.location.hostname))) {
        body.set("test-flow", "1"); // Existing function rejects local/QA forwarding even if a mock is absent.
      }
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!response.ok) throw new Error("Lead submission failed");
      if (requestReceipt) {
        const id = form.querySelector<HTMLInputElement>("[data-submission-id]")?.value;
        if (!response.headers?.get("content-type")?.includes("application/json")) throw new Error("Missing request receipt");
        const receipt = await response.json();
        if (!id || receipt?.ok !== true || receipt.stage !== "request_accepted"
          || receipt.submissionId !== id || receipt.receiptSource !== "netlify_http") throw new Error("Invalid request receipt");
        rememberAcceptedRequest(id);
        form.dataset.responseReceived = "true";
        try { history.replaceState({ ...history.state, rrFormResponse: id }, ""); } catch { /* BFCache DOM flag remains. */ }
      }
      const destination = form.dataset.successRedirect;
      if (destination) {
        window.location.assign(destination);
        return;
      }

      form.reset();
      touched = false;
      error.hidden = true;
      const status = form.querySelector<HTMLElement>("[data-form-status]");
      if (status) status.textContent = "Thanks. Your message was sent.";
      validate();
    } catch {
      form.dispatchEvent(new Event("lead-request-error"));
      const status = form.querySelector<HTMLElement>("[data-form-status]");
      if (status) status.textContent = "Something went wrong. Please try again.";
      submitButtons.forEach((button) => {
        button.disabled = false;
      });
    } finally {
      delete form.dataset.submitting;
      submitButtons.forEach((button) => button.removeAttribute("aria-busy"));
    }
  });
}

document.querySelectorAll<HTMLFormElement>("[data-lead-phone-form]").forEach(setupLeadForm);
