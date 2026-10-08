# Paid landing refinement — accepted October 8, 2026

Owner: Codex on designated host MATT-GAMING-PC. Authority: Matt's direct instruction to implement the campaign audit suggestions and open the changed landing page for review; subsequent explicit choice of Pennsylvania governing law and Gettysburg court jurisdiction. The parent orchestrator reviewed the narrow diff, completed local browser QA, and directed release. This work does not activate a website automation.

- Base: `d94adf5ec2dbd4617a9bbd9b74c7d97fffaffbdb`.
- Released source: [`d18756b53f701c6197cc3a18b69f149b5dd5ba51`](https://github.com/Pugh-Digital-Edge/RnRMarketing/commit/d18756b53f701c6197cc3a18b69f149b5dd5ba51), reviewed on `codex/rrm-paid-cro-20261008`, fast-forwarded to main and pushed.
- Git-connected Netlify release verified through public [`/build-info.json`](https://remediationrestorationmarketing.com/build-info.json), which equals the complete source revision above. The Netlify dashboard deployment ID was not separately retrieved.
- Full production acceptance: **2026-10-08T18:23:32.274Z** (2:23pm America/New_York).
- Source hash: `316a42a3732607a773aaacb443f2eecf495904ce0bc48c82dc59487bd8e7aca4`.
- Sitemap hash: `e55bb503cf2687af0c33ff6e13efd93145d8dcd9eb7d162cb648c7fbb8b428ea`.

## Released behavior

The paid page keeps its outcome headline and territory CTA, shortens the introductory explanation, and puts the existing free 30-minute strategy call with Matt directly beside the hero action. The form uses a smaller heading and tighter spacing while preserving all six required fields, contact-first order, labels/autofill, phone validation, partial-capture disclosure, and the two-step Back behavior. The specialist section accurately describes restoration-focused expertise rather than claiming the agency serves only restoration businesses. The historical claims register records that correction without erasing its older source.

The confirmation page uses the conversion-only layout, a concise introduction, the unchanged Google Calendar schedule URL, and a direct calendar link for a separate tab. This removes the global navigation/chat detour and moves the calendar upward. Its inner wrapper uses a div so BaseLayout remains the single main landmark. The unused decorative image preload was removed.

Terms placeholders now use the user's confirmed Commonwealth of Pennsylvania and courts located in Gettysburg, Pennsylvania. No business entity, legal guarantee, or other clause was invented or revised.

Source files: `src/components/AdsLandingPage.astro`, `src/pages/restoration-marketing.astro`, `src/pages/thank-you.astro`, `src/pages/tos.astro`; supporting records: `DESIGN.md`, `.impeccable/surfaces/src-pages-restoration-marketing-astro.md`, `clients/rr-marketing/copy/restoration-marketing-landing-claims.txt`.

## Verification

- `npm run validate`: **39 tests passed**, zero Astro errors/warnings, 20 existing hints, successful **109-page** build/postbuild. The required full production check reran the same release gate on the committed source.
- `npm run seo:check -- full`: **102/102** sitemap pages, **105** same-origin internal targets, **102** Markdown alternates, zero failures. Exact deployed revision, source/live signals, schema, canonicals, indexability, sitemap and AI-access artifact parity passed.
- Additional GET-only checks: paid landing page, thank-you page and Terms each HTTP 200 with their changed text; old paid-page exclusive-agency statement absent; direct calendar link present; confirmed Pennsylvania/Gettysburg wording present.
- Parent browser QA at **390×844**: clean layout/no horizontal overflow; free-call explanation around y=420; form heading around y=613 versus prior y≈920. Invalid `123` phone remains blocked with the explicit error; valid synthetic phone progresses to territory/scope, and Back returns to contact details. All original qualification fields remain.
- Parent browser QA at **1280×720**: clean desktop view; Continue bottom around y=692, inside the first viewport. The thank-you calendar begins around y=280 desktop and y=290 mobile, with the direct link visible. A fresh mobile reload resolved an initial viewport-resize screenshot timing artifact; verified innerWidth=390 and document scrollWidth=375.
- Local review served built output through a loopback-only server with restrictive CSP blocking all external analytics, frames and network sends; any POST was a local mock. The calendar iframe was intentionally blocked in this environment, so this verification covers its layout/link, not a new live booking. The actual live calendar displayed available October 9 times in the preceding read-only audit.
- Mechanical Impeccable scan returned no findings. This is not a comprehensive accessibility or field-performance certification.
- Parent reviewed source diff. `git diff --check` passed. Unrelated `docs/seo/runs/2026-09-29-production-regression.md` remained untracked and untouched.

Private local evidence remains in the PPC report storage under `reports/rr-marketing/20261008-landing-audit/` (validation, live-check logs, live HTML and structured GET results). Parent screenshot: `reports/rr-marketing/20261008-implementation/landing-preview.jpg`, with final live screenshot owned by the parent. No private submission IDs or lead details are committed here.

## Tracking and scope boundaries

The release does **not** change `src/scripts/`, Netlify functions, BaseLayout analytics, or tracking configuration. Existing `lead-funnel.ts` continues to send non-PII `form_view`, `form_start`, `form_step_2`, and `form_error` events under `restoration_v2`; `lead-request.ts` continues to consume the typed accepted-request receipt, send `generate_lead`, and use the opaque request ID for the Ads event. No duplicate tag or new conversion action was added.

Provider HTTP acceptance, stored/nonspam form, delivered notification, booked call and qualified opportunity remain distinct. This website worker made no production POST, phone call or booking. The parent separately reconciles the existing same-day stored/emailed QA receipt and Ads action/goal changes in the PPC implementation receipt; those pre-release intake observations are not re-labeled as a new post-release form submission.

Knowledge used: [RRM KB](https://app.notion.com/p/3dfd49a32caf81fab5f6d5ce7a5b2719), version **2026-10-05.v1**, RRM-C01/C02/C03/C04, public-site source RRM-S02 and coordination source RRM-S03; the existing page's verified offer and claims register. Source context is not new proof of underlying case-study analytics or future conversion improvement.

Next checkpoint: the parent completes live visual review and reconciles campaign implementation. Measure paid form progression by device and theme under consistent event definitions, with booked/qualified outcomes separately. Technical acceptance and improved first-view visibility do not prove a conversion-rate increase. This receipt-only follow-up may skip hosting because site/build inputs match the accepted source.
