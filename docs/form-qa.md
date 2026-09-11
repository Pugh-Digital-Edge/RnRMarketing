# Form QA — September 11, 2026

Tested the built site using `node scripts/test-form-preview.mjs` on localhost:4337. The server invokes the real submit-lead function but redirects its storage requests to a local capture endpoint. Native Netlify form posts are captured and their success redirect simulated. No live lead, subscription, or notification was sent.

## Results

| Form | Verified |
| --- | --- |
| `/restoration-marketing/` | Empty/invalid first-step blocking, phone feedback, Enter progression, Back retaining data, required market/program/budget fields, full desktop and 390px mobile submissions, thank-you navigation, phone normalization, UTM/GCLID and submission-ID preservation. |
| Money-page abandonment | Leaving at step two captures an identity-stage lead through the real local function; a completed native submission does not also produce an abandonment post. |
| Homepage territory form | Invalid ZIP blocked; valid submission captured and success announced. |
| `/contact/` | Simulated storage failure shows an error, preserves data, clears busy state, enables retry; retry succeeds and resets fields. |
| Chat | Mobile entry, successful local capture, and visible success message. |
| `/schedule/` | Enter advances without submitting, second-step required fields restored, server failure visible, retry retains data, success redirects to thank-you. |
| Newsletter | Invalid email blocked; valid email captured under Newsletter Form. Netlify's hosted success screen was not tested. |

## Fixes made

- Newsletter previously registered as Contact Form with a `find-us` field. It now has a separate Newsletter Form registration, explicit form-name, and email field.
- Contact page and homepage used different ZIP field names under the same registration. Both now use `zip`; the shared homepage component owns the static registration.
- Schedule now has a live status message for sending and errors. Hidden second-step fields stop blocking first-step keyboard navigation; Enter advances and a capture-phase guard prevents early submission.

## Automated checks and limits

Build passes: 103 pages. Regression suite: 16/16 passing, including new async success/failure and registration checks. Local technical scan: 98 sitemap pages and 100 links, no errors. Mobile checks found no horizontal overflow on tested routes.

Captured test payloads are in `form-qa-results.json`. The test preview is only a simulation of Netlify storage. Production form detection, notifications, spam filtering, email-provider integration, and native Netlify failure pages must be verified after deployment. No production changes or delivery claims were made.
