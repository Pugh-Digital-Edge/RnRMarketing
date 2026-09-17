# Restoration landing-page funnel

Implemented September 17, 2026. Website changes are local and require deployment;
GA4 configuration below is already saved in the live property.

## GA4 configuration completed

- Property: Remediation & Restoration Marketing, `543995602`.
- Web stream: `15189652368`, measurement ID `G-4K4H62DJ77` (matches source).
- Event retention: changed from 2 to 14 months; user retention remains 14 months.
  GA4 states retention changes take effect after 24 hours. This does not restore
  deleted data or collect missing historical events.
- Existing Internal Traffic exclude filter: Testing → Active, matching
  `traffic_type = internal`. Only traffic classified as internal is excluded;
  this does not identify new employee IPs automatically or clean old reports.
- Removed these two custom event-creation configurations and unmarked both as
  key events. Their historical data was not deleted:
  - `ads_conversion_SUBMIT_LEAD_FORM_1`: `event_name = page_view` AND
    `page_path` starts with `/thank-you` (case-insensitive); did not copy parameters.
  - `submit_lead_form`: `event_name = form_submit` AND `page_location` contains
    `https://remediationrestorationmarketing.com/schedule/` (case-insensitive);
    did not copy parameters.
- `generate_lead` remains the canonical form-lead key event. Existing phone and
  purchase key-event configuration is outside this change.
- Enhanced measurement Form interactions: disabled to prevent automatic
  `form_start` / `form_submit` duplicating site instrumentation. Other enhanced
  measurement switches remain enabled. This switch is stream-wide; forms without
  custom instrumentation no longer receive automatic form interaction events.
- Event-scoped custom dimensions: Form error field (`field_name`) and Form error
  type (`error_type`). New dimensions need processing time before reporting.
- Google Ads native `conversion` tag remains in source. Removal/unmarking of
  legacy GA4 events stops future GA4-derived conversions under those names;
  any Ads campaign using their imports needs its goal selection reviewed.

## Saved exploration

[Restoration lead funnel — Google CPC by device](https://analytics.google.com/analytics/web/#/analysis/a399884611p543995602/edit/YYfLVrKQQGSYpTRsnSjvwQ)

Closed funnel, indirectly followed steps (intervening events allowed):

1. `page_view`, with `page_location` containing
   `remediationrestorationmarketing.com/restoration-marketing/`.
2. `form_view`.
3. `form_start`.
4. `form_step_2`.
5. `generate_lead`.

Breakdown: Device category. Applied session segment: Google CPC sessions,
Session source / medium exactly matches `google / cpc`. Default date range:
last 28 days. This is a user-count funnel within qualifying sessions, not raw
event counts. Events can span qualifying sessions; do not describe it as a strict
same-session completion rate. Use error-event exploration alongside the funnel,
filtered to `form_error`, with Form error field and Form error type dimensions.

## Event contract

The four new/custom funnel events apply only to `/restoration-marketing/`.
All send directly to the configured GA4 ID with `form_id = lead-form`,
`form_name = Schedule Lead Form`, `form_page = /restoration-marketing/`,
`funnel_version = restoration_v1`, and numeric `form_step`.

| Event | Trigger | Deduplication |
| --- | --- | --- |
| `form_view` | Form first intersects viewport with nonzero area | Once per page load |
| `form_start` | First input, select, or textarea focus; excludes buttons, legends and hidden/honeypot fields | Once per page load |
| `form_step_2` | Step 2 is revealed after successful step-1 validation | Once per page load, including back/forward between form steps |
| `form_error` | Native validation failure, or invalid phone blur even if submit is disabled | Once per field until input/change; prevents `checkValidity` + `reportValidity` duplicates |

Errors send only an allowlisted `field_name` and `error_type` (`required`,
`invalid_format`, `invalid_phone`, `invalid_value`). No entered field values or
validation-message text is sent in these events. Errors are not counted on
initial empty-form load or on each phone keystroke.

Existing `generate_lead` still fires on the thank-you page only when a pending
submission marker exists, consuming that marker to prevent reload/direct-visit
duplicates. It now carries `form_id` and `form_page`, plus the funnel version and
step for restoration landing-page submissions. It depends on sessionStorage and
the confirmation navigation; it is not server-confirmed delivery measurement.

## Verification and release

- `npm run validate` passed: type checking, tests, and production build.
- Behavioral tests cover viewport/focus/step deduplication, button focus exclusion,
  page scoping, required/format/phone errors, error reset, and absence of field values.
- Built-site browser test: invalid phone blocked progression; valid synthetic
  phone revealed step 2. No real lead was submitted.
- Live GA4 DebugView received one each of `page_view`, `form_view`, `form_start`,
  `form_error`, and `form_step_2` from the local production preview around 2:38 PM
  America/New_York on September 17. Inspected `form_error` → `field_name = phone`.
- Explicit QA opt-in: append `?ga_debug=1` to the page URL. It sets GA4 debug_mode
  for that page only. Ordinary visits omit the debug flag. Use Tag Assistant for
  cross-page submission verification; the query flag does not persist on redirect.
- Production deployment and production DebugView/submission verification remain
  outstanding. The working tree contains concurrent unrelated changes; do not
  deploy everything just to release analytics. Coordinate or isolate the analytics
  hunks first. The completed local check is not a production verification.

After deployment, use a production QA visit to confirm the same events, one lead
on a successful approved test submission, no lead on direct thank-you navigation
or reload, and phone-field errors on mobile as well as desktop. Compare accepted
backend leads with GA4; blocked analytics, denied consent, or unavailable storage
can cause undercounting. Do not claim every visitor is measured.

## Interpretation

August 17–27 versus September 8–17 can compare only events actually collected
then, with consistent definitions. New `form_view`, `form_step_2`, and `form_error`
events cannot reconstruct those periods. Historical form_start can also include
automatic and custom duplicates; historical lead totals include the retired
rules. September 17 is a partial day until the property day closes, and these
two requested ranges have different lengths: compare rates and denominators,
not raw totals alone.

Start the new baseline at production deployment. Report users at each step,
step-completion rate, device, Google CPC session scope, and sample size. Keep
all-traffic results in a separate view. A week is an initial review point, not a
guarantee of enough paid-search observations. Stable starts with fewer leads
suggest downstream friction; fewer form views can also reflect layout, loading,
or measurement changes. Neither observation alone proves traffic quality or
establishes that an August form change caused the difference.

Reference: [Google enhanced measurement documentation](https://support.google.com/analytics/answer/9216061)
and [GA4 event setup and debugging](https://developers.google.com/analytics/devguides/collection/ga4/events).
