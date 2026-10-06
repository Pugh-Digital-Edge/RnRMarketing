# RRM privacy and link review — October 6, 2026

Authorization: Matt's October 6 `yes`, Sentinel_67477073f9f881919462c8006cfe591e, permits preparation for review. No publication, Ads change, production POST or conversion was authorized in this execution.

Base: fresh origin/main `6f3f04c93a9917ea96d74edc94e25f632954b680`. Original tracking worktree was clean; other worktree branches preserved. Branch: `prep/rrm-privacy-2026-10-06`.

## Prepared change

Replace the incorrectly duplicated Terms body on `/privacy/` with factual website handling disclosures. Correct Terms' old absolute privacy link to `/privacy/`; add permanent aliases for `/privacy-policy` and `/privacy-policy/`. Disclose partial contact capture beside the first-step Continue button. Remove the unsupported sales-of-data assurance from the paid form. Existing offer, form handling and tracking remain unchanged.

Source evidence: `client.json` supplies public contact details; `AdsLandingPage.astro` captures completed step-one identity on pagehide; `submit-lead.mjs` validates and forwards to Netlify; `submit-checklist.mjs` forwards email and campaign data; `BaseLayout.astro` loads Google tags, stores campaign attribution, and configures Matomo Cloud pageview/link tracking plus a no-JavaScript image tracker; `lead-funnel.ts`/`lead-request.ts` measure interactions/accepted requests without typed contact details in those custom events; `CustomChat.astro` collects email, phone and message through the same lead function; `thank-you.astro` embeds Google Calendar; `schedule.astro` can load YouTube. No claim that all vendor/account collection excludes personal information is made. Provider context: [Netlify submissions](https://docs.netlify.com/manage/forms/submissions/), [Google collection](https://support.google.com/analytics/answer/6004245), [Google partner sites](https://policies.google.com/technologies/partner-sites).

## Matt review facts before release

- Confirm business/operator identity and public privacy contact email are appropriate. No legal entity or jurisdiction was invented.
- Confirm actual use of partial identities and newsletter/resource signups; disclose any CRM, email platforms, exports or other recipients outside repository code.
- Confirm retention/deletion practice and who handles requests. No duration or fulfillment guarantee is invented.
- Confirm sale/sharing practice. Existing paid-form `We do not sell your details` lacked source evidence and was removed, not replaced with a contrary claim.
- Review Google and Matomo account collection/consent settings and advertising settings for the visitor regions served. No consent-control change or legal compliance assurance is included. Source currently enables Google and Matomo trackers without an implemented consent chooser. The Matomo disclosure states only observed source behavior; account cookie, IP handling and retention settings are unverified.
- `/tos/` still has jurisdiction placeholders. Its broken privacy link is fixed, but filling legal terms requires separately verified facts/review; this privacy preparation does not fabricate them.
- Verify current Netlify form notification recipients, webhook destinations, spam handling and storage access in dashboard. Source cannot prove notification configuration.

## Minimal production acceptance plan — separate authorization required

First publish only the reviewed changes through the normal authorized release flow, then perform GET-only checks: `/privacy/` 200 with correct body; `/tos/` privacy link goes there; `/privacy-policy` and `/privacy-policy/` each 301 to `/privacy/`; paid hero/offer remain approved; privacy and first-step disclosure fit mobile 390×844 and narrow 320×740. Confirm exact deployed build receipt and final hostname before any POST.

A single real-flow lead test needs explicit authorization for these destinations and effects:

- Start `https://remediationrestorationmarketing.com/restoration-marketing/?utm_source=internal_qa&utm_medium=manual&utm_campaign=rrm_privacy_acceptance_20261006`. No fabricated Google click identifier, `rr_test=1`, or `test-flow=1`: those test flags suppress the production storage/conversion path being tested.
- Proposed exact data: name `RRM INTERNAL QA — NOT A SALES LEAD`; email `matt@remediationrestorationmarketing.com`; phone `+17174201766`; company `RRM INTERNAL QA — DO NOT CONTACT`; service area `Internal QA only — no territory request`; program scope `not-sure`; budget empty; bot-field empty. Matt must confirm use of his existing public email/business phone and approve any notifications/automation before execution. Generated submission ID is retained privately for correlation.
- Fill both steps in one visit and click final submit once. Browser POST destination is `https://remediationrestorationmarketing.com/.netlify/functions/submit-lead`; server forwards the same registered `Schedule Lead Form` to `https://remediationrestorationmarketing.com/` when Netlify `URL` matches that host. Verify dashboard host/environment first.
- Expected accepted response: HTTP 200 JSON, `stage=request_accepted`, matching submission ID, `receiptSource=netlify_http`; navigate `/thank-you/`. This acknowledges provider HTTP acceptance, not proof of stored/nonspam lead, delivered notification, booking or qualification.
- Expected analytics effect: one GA4 `generate_lead` with `lead_stage=request_accepted` and one Google Ads request conversion sent to `AW-18384038031/g-gLCL-5g-UcEI_RmL5E`, opaque transaction ID. This will affect measurement; approval must cover that event. Verify actual configured tag destinations before test. Do not click an ad, book a Calendar slot, qualify the lead, or import an offline conversion.
- Expected Netlify effect: labeled lead stored in Schedule Lead Form (check verified and spam lists); any configured form-email/webhook notifications may fire once for that submission. Exact recipients and downstream actions are unknown until authorized dashboard inspection. Do not claim emails will reach Matt based solely on the public contact address. If recipients/actions cannot be established, stop before POST and report them as the blocker.
- Reload thank-you and visit it directly in a clean session: no additional accepted-request conversion. Optional Back navigation must not create an identity-only duplicate. No deliberate production error/retry test; those cases already use local mocks.
- Record status, deployment SHA, private submission ID, stored field/attribution match and notification delivery result separately. Test-record deletion or analytics exclusion needs separate authorization; do not silently change account data/configuration.

## Measurement isolation limits

No verified existing control both delivers the live Ads conversion and guarantees exclusion from bidding and reporting. `rr_test=1` suppresses JavaScript measurement and, on a nonlocal hostname, prevents the paid form POST before fetch. On localhost/loopback, the paid form can send a mocked POST with `test-flow=1`, which prevents server forwarding if a mock is missing. These controls do not verify live storage/notification acceptance and do not suppress the no-JavaScript Matomo pixel or isolate Calendar, YouTube, or every other form transport. `ga_debug=1` marks GA4 debug traffic but requires a verified active developer-traffic filter for report exclusion and does not exclude Ads conversions. Google Ads data exclusions affect Smart Bidding inputs, not conversion reporting. See [GA4 developer filters](https://support.google.com/analytics/answer/13296662?hl=en-GB) and [Ads data exclusions](https://support.google.com/google-ads/answer/10370710?hl=en-IE).

After notification destinations are established and POST authorization is explicit, an approved browser test can block analytics delivery while allowing the real form POST and inspect local event commands. This can verify storage/notifications without transmitted conversions, but cannot verify Google's receipt. A live transmitted conversion test instead requires explicit acceptance of its measurement effects; no clean reporting exclusion is promised.

## Verification

`npm run validate` passed: 39 tests, Astro check 0 errors/0 warnings (20 existing hints), 109-page build/postbuild. Local Chromium at 390×844, 320×740 and 1440×900 checks heading/body, no horizontal overflow, keyboard focus, corrected Terms link, and visible first-step disclosure; all external requests are blocked and all non-GET requests aborted. Redirect syntax is checked; Netlify-hosted 301 execution is a production acceptance check, not simulated proof. Screenshots/logs remain private workspace evidence, not published artifacts.

Independent review approved the source-grounded privacy/provider, routing and form disclosure changes. It corrected the isolation explanation above: production rr_test blocks paid POST before fetch; only local mocked requests carry test-flow. Final source passed the validation and viewport checks described above after the Matomo addition.
