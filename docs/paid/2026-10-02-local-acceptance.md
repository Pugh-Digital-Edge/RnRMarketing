# RRM paid landing preparation — October 2, 2026

Owner: Codex. Approval: Matt's revised plan, October 2 at 20:12, as supplied in delegated brief from thread `01a0f7e0-c224-7382-a89d-20c76917b0c4`. Scope is local preparation only. No push, PR, merge, deployment, production submission, Ads change, or scheduling change is authorized by this receipt.

Base: clean checkout at `07a1deb`; fetched origin before implementation and confirmed current origin/main matches. Final split branches: `prep/rrm-paid-copy-2026-10-02` at `3a22fe94dec87d808caf9c02617cf8036a0a5b3f`, then `prep/rrm-paid-tracking-2026-10-02` for the tracking-only follow-up. Original preparation history remains preserved locally. No dirty work was discarded. Repository AGENTS.md and the available local instructions were read; `/workspace/.agents` is empty. Agent Hub and the existing local-refinement record were read. This direct approval supplies independent implementation authority; Notion finish reconciliation belongs to the parent handoff. No external coordination write was made.

## Prepared behavior

- Paid `/restoration-marketing/` headline: “More Restoration Jobs. Less Time Chasing Leads.” Primary CTAs: “See the Plan for Your Territory”. Support copy addresses restoration owners and local customers, managed website/visibility/lead generation, and the owner's responsibility for sales follow-up and closing.
- Existing Chicago LSA proof stays near the hero: 5 → 18 LSA leads, Chicago-area client, May–July 2026; reported outcomes and results-vary disclosure retained. Case figures, channels and periods are preserved. No booked-job or revenue metrics were added.
- Shared offer: client owns website from day one; initial three-month commitment includes development, then month to month. Existing cancellation wording remains. Signed exceptions govern; hosting/handover arrangements remain agreement-specific. The raw FAQ source and rendered/shared answers agree.
- $1,300 management plus separate media remains accurate in shared budget/proposal language. The paid form and paid-page FAQ have no management price or budget range. The budget field remains registered as an empty hidden field for the shared Netlify schema, with no qualification threshold.
- Contact-first two-step form: details, then territory/priorities, then a free 30-minute session selection on the unchanged Google booking iframe. Channel rollout follows signed scope; LSA-first/Search-later-by-approval is explicit.

## Exact finding and minimal viable tracking

Original base `07a1deb` sets `schedule_lead_submission_pending` on submit, before the native POST outcome, and thank-you fires the conversion from that flag. Thus a failed attempt followed by a direct thank-you visit could count; no actual production false conversion has been established. The first draft switched to generic client HTTP success; that also could misclassify unrelated/static HTML. The second draft suppressed every paid conversion and was **not relaunch-ready**. This candidate restores legitimate provider-accepted-request measurement.

[Netlify's documented AJAX contract](https://docs.netlify.com/manage/forms/setup/) is URL-encoded POST, registered `form-name`, and HTTP success, with client navigation to a custom success page. A legitimate HTTP 200 is not intrinsically false. The documentation supplies no unique persisted/verified-lead response/header. This source is static Astro, with no SSR adapter, middleware/API route or root POST rewrite; the sole redirect maps the sitemap. Production form detection and routing must still match that source.

The existing `submit-lead` function is reused rather than introducing infrastructure. It validates final request/contact fields and opaque ID, normalizes the phone and forwards the same form name, attribution and fields to its existing Netlify `/` endpoint. Provider HTTP errors/network failures and unexpected JSON are retryable failures. Only after provider HTTP success does it return typed JSON `{ok:true, stage:request_accepted, submissionId, receiptSource:netlify_http}`. Identity/contact paths keep their generic response; identity never receives a final-request receipt. Honeypot and `test-flow=1` never forward.

The paid client now calls that existing function, requiring JSON, the exact stage/source and its matching ID before navigating and saving a receipt. Client static HTML 200, error/malformed/wrong-stage/wrong-ID/wrong-source JSON do not count and allow retry. Native `/thank-you/` remains the no-JavaScript fallback; other native forms retain direct POST behavior. The function adds an extra server hop/cold-start exposure whose production latency has not been tested.

The consumed receipt restores `generate_lead` with `lead_stage:request_accepted`, `receipt_source:netlify_http`, and `funnel_version:restoration_v2`, plus the existing Ads request-conversion action and opaque `transaction_id`. This is **server-observed provider HTTP acknowledgment**, not persisted/nonspam storage, successful notification delivery, booking or qualification. A provider static 200 caused by a deployment/configuration mismatch cannot be distinguished by this wrapper; deployed form recognition/routing is a release check, not evidence that all valid provider responses should be suppressed.

No new secret, service, persistence or configuration is required for this acknowledgment contract. The already-used Netlify `URL` environment value/fallback origin is preserved. Stronger persisted/verified acceptance would require authorized Netlify submissions API access with a server-only access token and resolved site/form IDs, or an approved verified submission-event integration. Neither was configured. Durable backend idempotency likewise requires a separately approved persistence plan; ambiguous network retries can still duplicate stored submissions.

Concurrent client submits are guarded; retries retain the ID; receipt consumption/Ads ID prevent repeat request events on reload, and DOM/history state prevents an extra identity save after Back. Missing/corrupt/expired/future/QA receipts and direct thank-you visits cannot infer acceptance. Shared analytics no longer stores/transmits lead email or phone for enhanced conversions; events contain fixed metadata and allowlisted field/error names, never form values. Click IDs remain in intake. Native JavaScript-free submissions are not measured by the browser receipt.

Local/explicit QA suppresses analytics, blocks nonlocal QA submissions and suppresses partial capture. Local/QA client payloads also carry `test-flow=1`, so the function blocks forwarding if a mock is absent. Privacy/storage failures suppress tracking without blocking ordinary intake. All browser external requests were aborted and every POST/beacon was mocked.

Independent reviewer inspected source/diff and six rendered screenshots; subsequent source review found no material issue in this provider acknowledgment design and independently passed 24 focused tests. The outcome-led copy, existing booking URL and notification routing are retained; actual delivery is not claimed.

## Independently reviewable copy

Copy-only commit changes six files, 33 insertions/43 deletions. It includes copy/offer/FAQ/form-field changes and preserves baseline analytics, submission scripts/function, native action and old stage behavior. It is a review unit, not a claim that baseline tracking defects have been fixed. Copy branch validation passed: 26 tests, 108-page build, 0 errors/warnings. Tracking is a separate subsequent commit on the tracking branch.

## Acceptance evidence

Command: `ASTRO_TELEMETRY_DISABLED=1 XDG_CONFIG_HOME=/tmp/rrm-config npm run validate`.

- Astro check: 0 errors, 0 warnings, 21 hints.
- Node tests: 39 passed, 0 failed. Includes native behavior regression checks, async errors/retry, matching typed receipt ordering, concurrent submit guard, nonlocal QA block, request stages/deduplication, privacy, malformed/expired receipts and blocked storage.
- Build and postbuild: passed; 108 pages. `git diff --check`: passed.
- Chromium, supported installed Playwright, local production preview `http://127.0.0.1:4321/restoration-marketing/?rr_test=1`: 390×844 mobile and 1440×900 desktop.
- Browser checks passed at both viewports: required fields, invalid phone, contact-first flow, Back preserving details, absent budget gate, HTTP 500 and network-error retries, programmatic duplicate-submit guard, same ID on retries, mock matching-receipt navigation, QA receipt consumption, reload/Back without repost, direct thank-you without conversion, no horizontal overflow, zero JavaScript errors and zero analytics tag loads.
- Additional 390×844 partial-flow checks: no QA abandonment, no identity save from step one, failed final request restores identity capture, identity capture once per page, and no conversion from identity capture. All beacons were stubs, not real requests.
- Additional fully mocked `https://review.rrm.test` tests cover static HTML fallback 200 without conversions, JSON error 200 with retry, normal-mode matching receipt produces one request conversion and one Ads event; reload produces neither, submitted click-ID/UTM/phone preservation, actual success → reload → Back → departure without identity capture, storage-restricted normal intake, and explicit QA with unavailable storage. Physical devices were not tested. The calendar iframe was blocked, so screenshots verify layout only.
- Native no-JavaScript behavior is covered by registration/phone tests and retained markup; it was not submitted to Netlify. Booking availability was not tested here; parent calendar worker owns that verification.

Review artifacts are in the selected saved environment, outside the release tree:

- `/workspace/rrm-review/paid-390.png`, `paid-1440.png`: complete page captures.
- `/workspace/rrm-review/mobile-hero.png`, `mobile-step-two.png`: mobile viewport/form detail.
- `/workspace/rrm-review/thank-you-390.png`, `thank-you-1440.png`: confirmation page; external calendar blocked.
- `/workspace/rrm-review/browser-results.json`, `partial-results.json`: acceptance details.
- `/workspace/rrm-review/browser-qa.mjs`, `partial-qa.mjs`: local mock-only runners using installed Playwright/Chromium.
- `/workspace/rrm-review/approved-changes.diff`: complete base-to-local patch.
- `/workspace/rrm-review/validate.log`: final release-gate output.

## Release decision still pending

Local copy and provider-accepted-request tracking preparation is complete; the blanket conversion-suppression draft is superseded. Production form detection, storage, notifications and actual tag delivery remain unverified. No unrelated SEO article changes are included. Campaign state was not changed; the paused campaign must remain paused until separate publication/relaunch approval.

If durable persisted/stored/booked/qualified receipts are required, prepare a separate approval plan: verify existing Netlify form notifications/API and CRM/scheduler source; define stable receipt IDs, outcome rules, data retention/access, and retry idempotency; inventory configuration/data changes; review them before enabling any webhook, credential, backend persistence or offline import. No new service or configuration is introduced here.

Next checkpoint: parent/Matt reviews this local diff and screenshots and decides publication scope separately. Live acceptance and measurement start only after an authorized release, never from this local receipt.
