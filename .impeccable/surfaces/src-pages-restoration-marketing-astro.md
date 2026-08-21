---
version: 1
slug: "src-pages-restoration-marketing-astro"
primary_target: "src/pages/restoration-marketing.astro"
related_targets: ["src/components/AdsLandingPage.astro"]
---

# Restoration marketing paid-search landing page

- Mode: Persuade. Mobile-first page for U.S. restoration company owners and marketing managers comparing agencies.
- Job: establish message match, make restoration-only and territory exclusivity credible, de-risk the call, and capture name, email, phone, company, and service territory.
- Primary action: submit the form, then continue to the existing conversion confirmation. No secondary offer.
- Proof: restoration-only agency specialization; one company per territory; U.S.-based/no outsourcing; paid leads can begin within 72 hours with stated conditions; connected calls/forms/booked jobs/revenue; founder-led 30-minute zero-prep strategy call backed by the agency team.
- Constraints: sourced claims only; no fake scarcity, testimonials, logos, metrics, or scheduler; reuse the existing `generate_lead` conversion path; fast, indexable, accessible, no critical-path third-party embed.
- Direction: territory field briefing in the established Cobalt Tile Hall system. Approved composition: `.impeccable/mocks/restoration-marketing-comp-b.png`.
- Memorable moment: “Restoration Marketing for One Company Per Territory.” sits on a plotted territory field while the controlled form and call facts remain visible in the same viewport.
- Do not literalize: generated map availability, comparison copy, or any unsupported text in the comp.
- Unresolved: the live site and repository expose no scheduling provider or booking URL; connect the real provider on `/thank-you/` when supplied.

## Fidelity inventory

| Ingredient | Commitment | Medium |
| --- | --- | --- |
| Masthead | logo and one booking action only | semantic HTML + existing logo SVG |
| Hero | full-bleed navy/cobalt field, fine 5rem territory seams, oversized query-matched H1 | HTML + CSS |
| Lead form | five fields, chalk working surface, mustard primary control | semantic HTML + CSS |
| Call facts | three founder-led strategy de-risking facts with consistent line icons | HTML + authored inline SVG |
| Owner section | real Matt Pugh identity and founder-led agency positioning | existing `matt.webp` raster + HTML |
| Service system | four connected services on one responsive rail, not four floating cards | HTML + CSS |
| Proof | three operating commitments separated by hairlines | HTML + authored inline SVG |
| Motion | one slowly drifting territory grid; visible default; reduced-motion fallback | CSS |
| Footer | real contact details plus privacy and terms | semantic HTML |

Component grammar: gently squared 0.25–0.55rem corners; 1px cyan/navy hairlines; soft offset shadows only on the form, portrait field, and primary action; bold compressed geometric display ramp with readable Poppins body; mustard reserved for decisive action.
