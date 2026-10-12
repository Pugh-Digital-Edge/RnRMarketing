# RRM form intake validation — October 12, 2026

## Finding

The reported October 11, 10:23 p.m. Eastern notification matches a stored Netlify submission whose contact details and attribution are also blank. No name, email, phone or company can be recovered from that record. The landing-page field alone does not prove paid origin, and the application UUID is distinct from the Netlify record ID. Private submission evidence stays outside this public repository.

Current main and production were verified at `3bd47d93fccc75dce0afeeadfdef6d316e4cba32`. The deployment active at the incident used `d18756b53f701c6197cc3a18b69f149b5dd5ba51`; the relevant function, landing component and phone handler are unchanged between those revisions. Live landing markup still posts natively to `/thank-you/`.

The existing function rejects a blank request. Native/direct static Netlify POSTs bypass that function and Netlify's HTML `required` attributes are browser checks, not backend validation. The stored payload is consistent with that bypass; no request log was available to establish the exact trigger or whether a person or automation submitted it. The current client also removes step-one `required` flags when showing step two, so cleared identity fields needed a final check.

## Patch

- Route the paid form's native action through `submit-lead` too. Without JavaScript, the function validates, creates a missing application ID, and redirects only after provider HTTP success. Invalid/provider-error responses keep the submitted values and attribution in an accessible, escaped retry form with no caching.
- Add a fail-closed Edge gate on all static paths to validate direct POSTs before Netlify Forms. Existing function routes keep their own validation. Both use the same field rules and phone library. Legitimate newsletter/checklist submissions retain their handlers. [Netlify request order](https://docs.netlify.com/resources/troubleshooting/request-chain/) and [Edge runtime/import support](https://docs.netlify.com/build/edge-functions/api/) informed this gate.
- Require valid name, email, phone and company for schedule identity capture; require territory and recognized program scope for a paid final request, or primary service for the legacy schedule form. Reject unknown stages, malformed IDs, duplicate fields, and non-string JSON values. Preserve valid international numbers with their selected country. Test/honeypot attempts never forward.
- Recheck hidden identity fields before final submit, focus the first error and return to step one. Invalid identity no longer triggers abandonment capture. Prevent a second submission after acceptance or history restoration.
- Move `/schedule/` onto the same accepted-request receipt contract. Remove thank-you conversion firing based on an old submit-intent flag. A matching accepted receipt is consumed once; identity, ignored/failed attempts and direct thank-you visits produce no request conversion. Attribution fields stay in the submitted payload, with no contact values added to analytics.
- Keep the local preview's static POST behavior aligned with the new gate.

## Verification and release boundary

Regression tests cover empty/direct static POSTs, stage/ID/field tampering, multipart/native HTTP without JavaScript, valid legacy/international submissions, escaped retained values, provider failures and retry, cleared hidden identity fields, abandonment recovery, accepted/in-flight repeats, receipt mismatch, direct thank-you and reload/back conversion suppression. The local HTTP preview additionally exercises built markup and both handlers with all storage intercepted locally.

The final `npm run validate` release gate passed after independent review corrections: Astro check has zero errors/warnings (20 existing hints), all 56 tests pass, and the 110-page build and rendered AEO checks succeed. `git diff --check` also passes. The isolated HTTP smoke run passed six checks without production storage or notifications.

Both the web dependency bundle and direct Netlify Edge bundler pass. The latter generated an ESZIP artifact and a manifest containing the all-path route with `on_error: fail`, using the installed Netlify CLI dependency without installing or running site plugins. Full Netlify offline build was attempted but blocked while installing the site's existing plugins: `npm EALLOWSCRIPTS`, because `--allow-scripts` is not permitted in a project-scoped install. Read-only inspection shows npm 12.0.0, an existing user-level allow-scripts setting, and Netlify Build's standard project-scoped `npm install` call. [npm's documented project script-approval model](https://docs.npmjs.com/cli/v12/commands/npm-install-scripts/) explains the compatibility failure. No install-script setting was changed, no packages were approved, and no downgrade was used to bypass protection.

An independent reviewer found two regressions and verified the corrections with 37 targeted tests: the shared Contact Form contract now permits the optional ZIP offered on `/contact/` and validates supplied ZIP values; native contact/chat recovery uses escaped textareas to retain multiline messages. The homepage keeps its own required ZIP field. No other concrete routing, escaping, attribution or receipt defect remained in that review.

Matt's Chrome was detected, but opening Netlify and one inventory recovery call each timed out after 30 seconds with kernel reset, so an actual browser session with JavaScript disabled was not verified. HTTP and script harness coverage is not a substitute for hosted/browser acceptance.

No production leads, notifications, merge or deployment were performed. Publication requires Matt's approval. Before release, verify Netlify packages the Edge gate and its npm phone dependency, recognizes the single complete shared form schema, and serves the function's JSON/native responses. A controlled production lead that creates a notification needs separate approval. After release, check deployed revision, rejection/storage behavior and receipt/conversion deduplication.

Provider HTTP acknowledgment still does not prove persisted/nonspam storage, notification delivery, booking or qualification. Ambiguous provider network retries can still duplicate stored records; durable backend idempotency requires a separately approved persistence design. This patch introduces no new credentials or persistent access.

Knowledge used: internal RRM client context, version 2026-10-05.v1, RRM-C04; RRM inbound playbook's original-source, unknown-attribution and valid-inquiry boundaries. Private context URLs are retained in the task evidence outside this public repository.
