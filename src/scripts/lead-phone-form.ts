import { getCountries, getCountryCallingCode } from "libphonenumber-js";
import { PHONE_VALIDATION_MESSAGE, validatePhoneNumber } from "@libs/phone";

const endpoint = "/.netlify/functions/submit-lead";

function setupLeadForm(form: HTMLFormElement) {
  const phone = form.querySelector<HTMLInputElement>("[data-phone-input]");
  const country = form.querySelector<HTMLSelectElement>("[data-phone-country]");
  const error = form.querySelector<HTMLElement>("[data-phone-error]");
  const submitButtons = form.querySelectorAll<HTMLButtonElement>("button[type='submit'], .cs-form-continue");

  if (!phone || !country || !error) return;

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

  let touched = false;
  const validate = () => {
    const result = validatePhoneNumber(phone.value, country.value);
    const valid = phone.value.length > 0 && result.valid;

    phone.setCustomValidity(valid ? "" : PHONE_VALIDATION_MESSAGE);
    phone.setAttribute("aria-invalid", String(!valid));
    error.hidden = valid || !touched;
    submitButtons.forEach((button) => {
      button.disabled = !valid;
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
  country.addEventListener("change", () => {
    touched = true;
    validate();
  });
  validate();

  form.addEventListener("submit", async (event) => {
    touched = true;
    const result = validate();
    if (!result.valid) {
      event.preventDefault();
      phone.reportValidity();
      return;
    }

    event.preventDefault();
    phone.value = result.e164;
    submitButtons.forEach((button) => {
      button.disabled = true;
    });

    try {
      const body = new URLSearchParams();
      new FormData(form).forEach((value, key) => {
        if (typeof value === "string") body.append(key, value);
      });

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (!response.ok) throw new Error("Lead submission failed");

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
      const status = form.querySelector<HTMLElement>("[data-form-status]");
      if (status) status.textContent = "Something went wrong. Please try again.";
      submitButtons.forEach((button) => {
        button.disabled = false;
      });
    }
  });
}

document.querySelectorAll<HTMLFormElement>("[data-lead-phone-form]").forEach(setupLeadForm);
