# Calendar-first paid booking — October 23, 2026

Owner: Codex on designated desktop MATT-GAMING-PC. Matt directly instructed
"lets do it. implement it. you can use my browser to modify the existing form"
after reviewing the calendar-first proposal. Scope is the existing paid landing
page and appointment schedule, with the established free 30-minute Meet call.

## Website delivered; Calendar field edit awaits sign-in

- Paid-page implementation source:
  `cc98d3e0ce8514e8c6efbf181d9eda0f6a4573a7`.
- Final accepted live source:
  `a0eabf5918c2de71c4f0d78ad14aa63beb032206`, verified from production
  `/build-info.json` and GET checks at **2026-10-23T19:04:15Z**.
- All seven paid-page booking CTAs open the existing Google appointment schedule
  directly. The paid page has no inquiry form, abandonment/contact capture,
  Calendar iframe or prerequisite thank-you visit. Existing proof, offer,
  duration, pricing policy and page noindex remain.
- Replaced the form with a compact booking explanation/action, updated process
  steps and the stale form FAQ, and corrected the factual privacy description.
  Shared URL: `src/data/booking.js`. Legacy `/schedule/` inquiry and its accepted
  receipt/conversion still work; its single complete Netlify form registration
  moved onto that route so removing the paid form cannot unregister intake.
- Public Calendar inspection confirmed the correct Matt Pugh strategy-call
  title, 30-minute Google Meet, available October 26 onward times and a booking
  dialog with first name, last name and email. The dialog was cancelled without
  entering contact details or booking. No prospect message or test lead sent.
- Google requires account reauthentication before editing the schedule. Matt
  was asked to complete sign-in privately in the preserved browser tab. **No
  Calendar settings were changed.** Required company website and optional phone
  are still pending. Website copy does not claim those fields already exist.

## Measurement boundary

`booking_calendar_click` sends only placement/provider/funnel labels to the
existing GA4 destination under `calendar_v1`, using beacon transport. It respects
tracking suppression, tolerates unavailable analytics and binds once. It never
fires `generate_lead`, an Ads conversion, enhanced-conversion contact data or a
booking-completed event. Google-hosted completion cannot be observed by the
static site. Confirmed bookings must be reconciled in Calendar; automatic paid
booking attribution and HubSpot synchronization are **not installed**.

No Ads goal, primary conversion, bid, budget, campaign status, schedule or CRM
record was changed. The separate capped-test authority remains intact. Review
actual Calendar bookings alongside the existing request metric; zero website
form conversions after this change is not proof of zero outcomes. Do not reset
the approved test's click/spend stop thresholds automatically.

## Verification

- Required `npm run validate`: **58 tests passed**, zero errors/warnings,
  successful **111-page** build. Obsolete paid form-step recovery tests were
  replaced with regression coverage for direct links, separate click intent,
  privacy suppression and repeat binding. Legacy submission tests passed.
- Desktop/mobile browser review: no horizontal overflow at desktop and
  390x844; real booking links work without form submission; mobile action opens
  the actual Google schedule. No layout redesign or fabricated offer/proof.
- Live paid-page DOM: seven booking links, zero forms, tracking bound, correct
  self-canonical and `noindex, nofollow`. Paid, legacy schedule, thank-you and
  privacy routes each returned HTTP 200. No production submission performed.
- Required full production technical check: **103/103** sitemap pages,
  **106** internal targets, **103** Markdown alternates; zero failures; exact
  final source/live parity. Initial verification exposed the pre-existing
  noindex `/campaign-manager-privacy/` in the public sitemap. Final source adds
  that route to the existing exclusion list, preserving its policy content and
  noindex, and the complete gate passed. No gate was weakened.
- Canonry stored privacy audit rechecked: October 18 run
  `b061dbd7-1108-45b4-b2f1-69d349ec880d`, complete/success, no critical defects.
  This predates the change and is not a fresh crawl or evidence of lift. No
  quota-spending collection or SEO automation was started. The paid route is
  intentionally excluded from search indexing.
- Source diff and `git diff --check` passed. Existing unrelated dirty SEO
  records in the original checkout were preserved. Work used an isolated
  checkout based on current origin/main under the shared writer lock. No PR.

Private evidence: configured PPC report storage
`rr-marketing/20261023-calendar-first/` contains local/mobile and live/desktop
screenshots, raw live HTML, structured live verification, stored Canonry evidence
and validation/production-check logs. No credentials or lead data in this receipt.

## Remaining owner and checkpoint

Matt: finish Google sign-in. Codex: add required company website and optional
phone to this exact existing schedule, save and independently inspect the public
booking dialog. Then verify real confirmed appointments manually before claiming
booking lift or paid attribution. No new schedule or automatic restart.
