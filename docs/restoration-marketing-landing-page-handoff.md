# Restoration marketing landing page handoff

## Publish URL

`https://remediationrestorationmarketing.com/restoration-marketing/`

The Astro route is `src/pages/restoration-marketing.astro`. It exists only to receive Google Ads traffic, so it is `noindex, nofollow` and excluded from the generated sitemap (`astro.config.mjs`). That keeps it from competing with `/services/` and the homepage on the same terms, and leaves per-ad-group variants free of duplicate-content concerns.

## Conversion event

The form fires GA4 `generate_lead` and, once configured, a Google Ads conversion, both once, on the `/thank-you/` confirmation page.

Tracking IDs live in `src/data/tracking.json`: GA4 `G-4K4H62DJ77`, Google tag `GT-5DGPX7H7`, Google Ads `AW-18384038031`. All three are configured on one `gtag.js` instance loaded with the GA4 ID, so the GT tag is added alongside the GA4 property rather than replacing it.

`leadConversionLabel` is still blank. While it is empty the Ads `conversion` event and the enhanced-conversions `user_data` call are both skipped, and only GA4 records the lead. Filling it in is the last step to a working Ads conversion.

Verification path:

1. The form keeps `id="lead-form"`, `name="Schedule Lead Form"`, `action="/thank-you/"`, and the same Netlify form name as `/schedule/`.
2. `BaseLayout.astro` captures `gclid`, `gbraid`, `wbraid`, and the `utm_*` parameters into `sessionStorage` on first pageview, exposes them as `window.rrAttribution`, and populates the form's hidden `data-attribution-field` inputs, so every Netlify submission carries the click ID for offline conversion import.
3. On submit, `BaseLayout.astro` sends the non-primary diagnostic `form_submit` event, sets `sessionStorage.schedule_lead_submission_pending`, and stores the lead's email (lowercased) and phone (normalised to E.164) plus scope and budget for enhanced conversions.
4. `/thank-you/` consumes and removes both markers, sends one `generate_lead` event, then — only when both Google Ads IDs are set — calls `gtag('set', 'user_data', …)` and sends the Ads `conversion` event.
5. Both the landing page and `/thank-you/` pass `eagerAnalytics`, which loads `gtag.js` immediately instead of waiting for an interaction. Without it a lead who lands on the confirmation page and leaves within ten seconds is never reported.

Verified in a production build: the chain fires once, carries the click ID and hashed-input identifiers, clears its markers, and does not re-fire on reload.

## Scheduler status

The current source and live `/schedule/` page expose no scheduler embed, booking-provider script, external booking URL, or scheduler configuration. The existing confirmation page says the team will contact the lead with next steps. The landing page therefore captures the five approved fields and routes to the verified conversion confirmation, but a calendar cannot be truthfully connected until the client supplies the real scheduler provider and booking URL. Add that provider only on `/thank-you/` after the lead event has fired so it stays off the landing page's critical render path.

## Reusable template vs theme-specific content

Reusable template (`src/components/AdsLandingPage.astro`):

- conversion-only masthead and transparent business footer;
- qualified Netlify form (name, email, optional phone, company, territory, program scope, budget), hidden attribution fields, consent line, and call de-risking facts;
- reported-results cards and the optional rank-grid figure;
- restoration-only agency/founder-led consultation section;
- connected-service rail layout;
- operating-commitment proof section;
- call process, repeated CTAs, and mobile sticky CTA;
- responsive, accessible, performance-oriented styles and behavior.

Theme-specific route configuration (`src/pages/restoration-marketing.astro`):

- title, meta description, H1, hero paragraph, and the single-service repel line;
- service-detail heading, introduction, and four program inclusions;
- results heading, introduction, result cards, and rank-grid figure;
- proof-point titles and supporting copy.

The Service JSON-LD was removed with the switch to `noindex`; structured data on a page excluded from search serves no purpose.

Future SEO, PPC, web-design, and lead-generation variants can reuse the component and swap those route-level values without rebuilding the layout.

## Proof on the page

The results section uses the reported figures from `src/data/caseStudies.js`. Only the verified numbers appear. The figures flagged as unresolved in that file's `verification` notes are deliberately omitted from a page carrying paid traffic:

- the stray `$142.33` LSA CPL line in the Chicago story (the page uses the derived `$147.61`);
- the `+220%` call wording in the Kentucky story (the page uses the verified `+175%`);
- the `41 July calls + LSA leads` figure, which may double-count overlap.

The section carries a standing disclosure that names are withheld by agreement, that figures come from each client's own reporting for the stated window, and that they are not a guarantee of future results.

A Google Business Profile rank-grid animation is wired at `public/assets/images/case-studies/chicago-gbp-heatmap.gif`. If that file is absent the figure removes itself on load rather than showing a broken image.

## Claims not used or still needed

- A real scheduler provider and booking URL could not be sourced.
- No client-count claim was used.
- No testimonial was added; the page uses reported metrics only.
- No claim about guaranteed results, costs, or the number of available territories was added.
