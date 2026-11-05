# Restored August paid page — November 5, 2026

Owner: Claude Code on designated desktop MATT-GAMING-PC. Matt directly
instructed "deploy it, do the test lead, do not restart search" after
reviewing the local preview. Google Ads Search stays PAUSED; this receipt
covers the website only.

## Why

The Aug 20–27 paid page produced 3 of the campaign's 4 recorded requests,
from 23 clicks. Every later revision was followed by fewer requests. From
the Oct 23 calendar-first change onward, the paid page had no form, so Ads
could not record a lead.

## Delivered

- Source `485282b58efcf05cd873932935583958817c38c4`, fast-forwarded from
  `9651b05` under the shared lock from an isolated worktree. Production
  `/build-info.json` reported it about 50 seconds after the push.
- The August hero ("One Team Running Every Part of Your Restoration
  Marketing.") and the single-step territory form with seven required
  fields, including monthly budget. It posts to `submit-lead` with
  `data-request-receipt`; `/thank-you/` consumes the receipt and fires the
  Ads lead conversion. The one complete Netlify registration stays on
  `/schedule/`. The paid page has no calendar booking links.
- The current results cards, heat map and testimonial, the reviewed
  restoration-focused claim wording, and Matt's review fixes (form row
  layout, live results band, "What you can count on" as three offer.js
  cards). The privacy policy describes the paid form.

## Verification

- `npm run validate` on the exact commit: 0 errors, 0 warnings, 58/58
  tests, 112 pages built.
- `npm run seo:check -- auto` (full mode, 2026-11-05T19:25Z): 104/104
  sitemap pages, 107 internal targets, 104 Markdown alternates, no
  failures, deployed commit equals head.
- One labeled production test lead (name "TEST Claude QA - ignore",
  `example.com` email, 202-555-0147 test number, company "TEST - QA
  Restoration (ignore)"), with no `rr_test` flag and tracking enabled.
  `submit-lead` returned 200 and the browser landed on `/thank-you/`. The
  page then sent `generate_lead` (lead_stage `request_accepted`) and the
  Ads conversion `AW-18384038031/g-gLCL-5g-UcEI_RmL5E`. The
  `googleadservices.com` conversion request returned 200 with
  `oid` = submission ID `5a858df2-37ec-4e50-9928-d11d2e244c0c`.
- Reloading `/thank-you/` sent no second conversion event or Ads hit.
- The Netlify form notification for the test lead was delivered to the
  agency inbox.

## Limits and next checkpoint

The test visit had no ad click, so Google Ads should not attribute the
test conversion to a campaign. The Netlify submission is labeled TEST and
can be deleted by Matt. This proves intake and tag delivery only; it says
nothing about conversion rate. Matt owns the Search restart decision.
