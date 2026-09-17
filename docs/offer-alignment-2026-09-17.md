# Offer alignment — September 17, 2026

## Shared offer

The user authorized implementing the offer plan, including a new program name, a generic AI checklist, and alignment of the website, paid landing page, and confirmed Drive master template. No package tiers. The user explicitly selected a three-month standard commitment.

- Program: **R&R Restoration Growth System**.
- Session: **Lead Flow Acceleration Session**, free, 30 minutes with Matt.
- Five areas: website; paid search and LSA; local SEO and Google Business Profile; AI visibility/AEO; lead tracking.
- Territory: one agency client per agreed service territory, subject to availability; not a guarantee of exclusive prospects.
- Budget: typical total $2,500–$10,000/month, management and ad spend separated in each proposal.
- Agreement: three-month initial commitment, then monthly; existing notice, billing-period, rebuild, transfer, and early-buyout provisions retained and explained consistently.
- Takeaway: reusable checklist and a discussion of priorities, not a custom written ZIP audit.

`src/data/offer.js` is the shared source for the main offer, LP FAQ, service overview, and rendered site FAQ terms. `src/data/aiChecklist.json` supplies the on-page checklist and printable PDF. Rebuild the PDF with the bundled Python runtime and `scripts/build-ai-checklist.py` after content changes, then inspect both rendered pages.

## Conversion paths

Primary: website/LP → existing qualified form → `/thank-you/` → Google appointment calendar. A `generate_lead` event is an inquiry, not confirmation of a booking. Existing click IDs and lead-stage handling are retained.

Secondary: `/resources/ai-visibility-checklist/` → separate `AI Checklist Form` → `/resources/ai-visibility-checklist/download/` → PDF and optional session. The form stores email and source attribution through Netlify. The PDF is accessible immediately after a successful submission; it is not an access-controlled asset. No automated email delivery or nurture sequence is configured or promised. Browser events `checklist_signup` and `checklist_download` are separate from sales leads. Signup tracking requires JavaScript and session storage; native no-JavaScript form submissions still use the download-page action.

The LP, checklist signup, and download page remain noindex and are excluded from the sitemap. These are conversion surfaces, not new organic articles.

## Evidence and measurement boundary

Classification: offer consistency and conversion decision-support gaps. This implementation does not diagnose an SEO loss.

The pre-change stored Canonry baseline remains the September 10 completed 42-query basket: Mention Coverage 6/42; Citation Coverage 3/42; non-brand Mention Share 7/33. These are separate signals and do not establish LP conversion performance. Live LP inspection before the change confirmed HTTP 200, self-canonical, noindex/nofollow, a two-step form, and an existing mobile sticky action.

Homepage and service-page edits overlap existing SEO-011 measurement. Record the actual deployment date as a new intervention before drawing conclusions from its October 9 window. No conversion lift is claimed. Compare source/device-matched inquiry rates, booked sessions, qualified opportunities, and cost per qualified opportunity after deployment; extend the window if volumes are too low.

## Verification and release

- `npm run validate`: Astro checks, existing tests, new checklist endpoint tests, and static build.
- Browser QA: desktop/mobile LP proof and qualification flow; checklist heading clearance, responsive width, and failed-submit recovery.
- Document QA: two-page PDF and four-page master template rendered and inspected; original agreement paragraphs retained intact after the new overview.
- Drive master: `10_KnA470LEW_D-a1RRXE1nPatPJy3nqu`, same file ID and folder, updated with the named program overview and proposal placeholders; read back after upload.
- Before production release: deploy the validated artifact, confirm Netlify detects `AI Checklist Form`, verify a controlled signup reaches its stored submission and PDF destination, check sales conversion deduplication, and verify deployed content/technical parity. Run the relevant Canonry recheck against deployed changes. Local preview cannot certify Netlify storage or live conversion delivery.

No production deployment, new provider sweep, indexing submission, or outbound prospect email was performed in this implementation.
