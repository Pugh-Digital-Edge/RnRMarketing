# Local browser QA addendum — October16,2026

Actual run: **15:33:07.583–15:33:27.991 UTC**. Existing cached Playwright1.60.0 and installed Chromium, headless. No tool/browser installation or security-setting change. The supported browser API's timeout was worked around with the explicitly authorized existing headless runner, not by bypassing access restrictions.

Rendered site code is PR#5's original `1d495528c11bf4b89b602ae1a18a551d81a72e90`. The correction changes audit tooling/evidence/tests/dependency declaration, with no additional marketing-page change. Full pre-pilot versus review HTML comparison separately covers110 routes: **11 changed,99 unchanged**. It includes the inherited `/industries/` water excerpt omitted from the initial ten-page accounting.

## Executed checks

- Eleven affected routes at1440×1000 and390×844:22 screenshots, oneH1 each, document width never exceeds viewport by more than1px, local analytics disabled, no browser page errors. [Machine receipt](report.json) records route/width/result and every screenshot SHA256.
- Both `/schedule/` and `/restoration-marketing/` at390px: actual DOM keyboard Tab to email and keyboard Continue, required-field rejection, invalid-phone rejection, final required second-step inputs, mocked HTTP failure with retained email and retryable visible status, matching accepted receipt navigation, concurrent duplicate request suppression, reload without resubmission, receipt consumption and zero queued local analytics.
- The paid Continue button remains enabled for invalid phone input but blocks progression with native validation; the schedule Continue button disables. The test follows each implemented behavior rather than assuming identical controls.
- All nonlocal browser traffic aborted at the request boundary. Only `http://127.0.0.1:4337` GETs allowed; the form function path is explicitly mocked for both502 failure and matching200 receipt. Other non-GETs blocked. Requests contain `test-flow=1`. No production form forwarding, storage, email or analytics occurred. The repo's local server sets its provider base to localhost; browser mocks intercepted all four tested final requests before that server function.
- External requests actually blocked: YouTube thumbnail and Google Calendar document. Their blocked state is expected for isolated QA, not evidence of a production defect. Third-party scheduling was not exercised.

## Screenshots retained in Git

- Broad PPC: [desktop](1440-_services_ppc_.png), [mobile](390-_services_ppc_.png).
- Water PPC: [desktop](1440-_water-damage-restoration_ppc_.png), [mobile](390-_water-damage-restoration_ppc_.png).
- Industries overview: [desktop](1440-_industries_.png), [mobile](390-_industries_.png).
- Paid form: [failure](_restoration-marketing_-failure.png), [success](_restoration-marketing_-success.png).
- Schedule form: [failure](_schedule_-failure.png), [success](_schedule_-success.png).

The full26 screenshot files (22 route captures plus4 form-state captures), exact script and original report remain in the parent task's `browser-qa-2026-10-16` evidence directory. The committed subset is10 images, with the entire set content-addressed in the machine receipt. Screenshots are viewport captures at the relevant section, not full-page visual inspection. The industries overview capture shows the shared layout; the changed water excerpt is established by the exhaustive semantic difference.

Manual visual inspection sampled mobile water-PPC text, desktop PPC proof, mobile industries layout and the paid-form error state. New water text wraps within the viewport; the updated July/date proof label remains visible. The preexisting fixed chat launcher can overlap the lower viewport's text, a follow-up usability issue; no new chat behavior was introduced. This does not constitute a complete visual or WCAG audit of every page/viewport.

## Evidence distinctions and remaining limits

The full62-test release suite separately checks source/VM/function receipt semantics, GA4/Ads payload fields, PII exclusions, network/provider failure, native retry/escaping, contact/checklist/chat validation, QA suppression and deduplication. Browser QA verifies natural local suppression and mocked receipt behavior; it does **not** prove actual GA4/Ads delivery, Netlify storage/notification, backend durable cross-tab idempotency, qualified inquiries, bookings or revenue. Contact/chat/checklist flows have source/function fixtures but were not individually exercised in this browser pass. Complete keyboard navigation, contrast, assistive technology, zoom/reflow, all responsive widths and field Core Web Vitals remain unverified.

Search data was **freshly retrieved from stored Canonry records**, not refreshed upstream by this pilot. Query/page export: September14–October13,2026,30 Pacific-calendar days,8,560 returned stored rows across396 named queries and28 landing pages. The top-pages response explicitly reports the same ranked dates and separate property-daily totals. Existing10:00Z GSC/GA4 connection updates and10:02Z URL-inspection records are upstream/scheduled evidence. This pilot performed no sync, fresh inspection, technical audit or provider sweep. Property/query totals differ and final/provisional status was not returned.

Proof correction is an **omission**, not a verified replacement result: existing PPC hero/depth paired39% monthly reduction with reported July$77.79; the existing Kentucky case data paired108.54→108.54→77.79 with a28% May–July label. Matching month/value suggests an inconsistency but does not prove account identity or which original number is wrong. No original client report was retrieved. The branch removes39%; the preexisting reported$77.79/date/caveat remain and are not independently validated here. Shared water copy's top-search certainty directly conflicts with the existing no-ranking-guarantee offer, so it is replaced with work/qualification language. No ranking gain is inferred.
