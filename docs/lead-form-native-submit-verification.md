# Native paid-search lead submission — September 8, 2026

Published Netlify deploy: `6aa033f5874cd596529d7c2d`.

## Changes

- The paid-search form posts natively to `/thank-you/` after phone validation
  and E.164 normalization. It does not fetch the function, disable the submit
  button, or redirect in JavaScript. Other forms retain their existing behavior.
- Fixed a second defect found in preview: `/schedule/` registered the same
  Netlify form name with an older field set and a function action. Netlify was
  dropping attribution fields and returning its generic success page. The
  landing page now registers the complete shared field set once, including the
  legacy schedule fields.
- Abandonment capture remains fire-and-forget (`sendBeacon`, falling back to
  non-awaited `fetch` with `keepalive`). It observes the final submit event
  after phone validation, suppresses capture on accepted native submission,
  and resets that suppression when the page is restored.

## Verified

- All 13 tests pass; the 103-page site builds successfully.
- Production landing HTML matches the tested preview.
- Invalid phone blocks progression; step two gates incomplete submissions;
  hidden step-one fields are not required and visible step-two fields are.
- Browser submissions on preview and production reach the real thank-you page.
- Netlify stored the production test as a qualified lead with normalized phone
  and all attribution fields. No identity duplicate appeared for its submission
  ID. A direct POST also preserved nonempty test gclid, gbraid, and wbraid values.
- JavaScript-free HTTP POST returns the custom thank-you HTML and its unchanged
  conversion script. Tracking configuration, page copy, layout, and design were
  not changed. Four marked Codex test submissions were left in the inbox; the
  existing diagnostic submissions were left untouched.

## Timing and remaining acceptance checks

- Before: user-reported cold function response **25.4 seconds**.
- After: preview native POST through receipt of custom thank-you HTML **479 ms**.
- Production browser click through visible confirmation **2,191 ms**, including
  browser automation overhead. The strict under-two-second rendering target is
  not yet verified; this measurement exceeds it.
- Actual Google Ads network delivery, DevTools request capture, and a repeat
  after hours of function inactivity remain unverified. The native-path
  regression test confirms zero function fetches.
- Browser security policy blocked the settings page needed to disable JavaScript.
  The direct HTTP POST passed, but a browser session with JavaScript disabled
  remains unverified.
