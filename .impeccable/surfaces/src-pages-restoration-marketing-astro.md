---
version: 1
slug: "src-pages-restoration-marketing-astro"
primary_target: "src/pages/restoration-marketing.astro"
related_targets: ["src/components/AdsLandingPage.astro"]
---

# Restoration marketing paid-search landing page

- Mode: Persuade. Mobile-first page for U.S. restoration company owners and marketing managers comparing agencies.
- Job: establish message match, explain restoration-focused expertise and territory exclusivity, de-risk the call, and capture name, email, phone, company, service territory, and requested scope.
- Primary action: submit the qualified form, then book a Lead Flow Acceleration Session on the existing confirmation page. Secondary offer: the reusable AI Visibility Checklist for Restoration Companies, with a separate email signup and immediate PDF download.
- Offer: R&R Restoration Growth System; one managed program, no package tiers; website, paid search/LSA, local SEO/GBP, AI visibility/AEO, and lead tracking. Three-month initial commitment; website transfer and rebuild terms match the master agreement.
- Proof: restoration-focused agency expertise; one company per territory; U.S.-based/no outsourcing; paid leads can begin within 72 hours with stated conditions; existing reported client results; founder-led 30-minute zero-prep strategy call backed by the agency team. Do not imply the broader agency portfolio contains only restoration businesses.
- Constraints: sourced claims only; no fake scarcity, testimonials, logos, metrics, or scheduler; reuse the existing `generate_lead` conversion path; fast, accessible, deliberately noindex for paid traffic, no critical-path third-party embed.
- Direction: territory field briefing in the established Cobalt Tile Hall system. Approved composition: `.impeccable/mocks/restoration-marketing-comp-b.png`.
- Memorable moment: “More Restoration Jobs. Less Time Chasing Leads.” sits on a plotted territory field beside a clear free 30-minute call and the contact-first form. On mobile the opening copy is compact and the anchor provides a direct path to the form.
- Do not literalize: generated map availability, comparison copy, or any unsupported text in the comp.
- Scheduling: `/thank-you/` now contains the Google appointment calendar after the lead confirmation. A submitted inquiry is not a confirmed calendar booking.

## Fidelity inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Masthead | logo and one booking action only | semantic HTML + existing logo SVG |
| Hero | full-bleed navy/cobalt field, fine 5rem territory seams, compact outcome H1 and explicit call offer | HTML + CSS |
| Lead form | six required fields across two steps, chalk working surface, mustard primary control; contact-first, privacy disclosure and receipt behavior preserved | semantic HTML + CSS |
| Call facts | three founder-led strategy de-risking facts with consistent line icons | HTML + authored inline SVG |
| Owner section | real Matt Pugh identity and founder-led agency positioning | existing `matt.webp` raster + HTML |
| Service system | five connected services on one responsive rail | HTML + CSS |
| Proof | three operating commitments separated by hairlines | HTML + authored inline SVG |
| Motion | one slowly drifting territory grid; visible default; reduced-motion fallback | CSS |
| Footer | real contact details plus privacy and terms | semantic HTML |

Component grammar: gently squared 0.25–0.55rem corners; 1px cyan/navy hairlines; soft offset shadows only on the form, portrait field, and primary action; bold compressed geometric display ramp with readable Poppins body; mustard reserved for decisive action.

October 8, 2026 refinement: reduce hero and first-step spacing, retain minimum field/touch sizes, and bring the existing free call offer beside the hero CTA. The thank-you page uses the conversion-only layout with a compact introduction, unchanged Google calendar URL and a direct calendar link. It remains a separate booking step; request acceptance is not a booking.
