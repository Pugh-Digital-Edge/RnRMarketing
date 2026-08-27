import { parsePhoneNumberFromString } from "libphonenumber-js";

export const PHONE_VALIDATION_MESSAGE = "Please enter a valid phone number, including the area code.";

/**
 * Accept only a complete phone number that libphonenumber-js recognizes for the
 * selected country. This intentionally does not strip, pad, or otherwise repair
 * an invalid value.
 */
export function validatePhoneNumber(value, country = "US") {
  const phoneNumber = parsePhoneNumberFromString(value, country);

  if (!phoneNumber || !phoneNumber.isValid() || phoneNumber.country !== country) {
    return { valid: false, e164: null };
  }

  return { valid: true, e164: phoneNumber.number };
}
