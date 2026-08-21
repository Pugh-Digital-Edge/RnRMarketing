# Restoration Marketing Asset Manifest

Approved visual reference: `.impeccable/mocks/restoration-marketing-comp-b.png` (composition reference only; **not** a production-page raster).

| Visual ingredient | Medium | Source / path | Status |
| --- | --- | --- | --- |
| Brand masthead and footer mark | Existing verified SVG | `src/assets/images/svg/rr-marketing-logo.svg` | Ready; use the existing asset through Astro Image. Do not redraw or generate a replacement. |
| Hero headline, labels, body copy, comparison copy, service copy, proof copy, and footer copy | Semantic HTML | `src/components/AdsLandingPage.astro` with page data from `src/pages/restoration-marketing.astro` | Ready; all copy remains selectable, indexable, responsive, and accessible. No text baked into imagery. |
| Territory coordinate grid, seams, plot frame, ticks, and map-like linework | CSS backgrounds/borders plus authored inline SVG where irregular paths are needed | Code-native implementation in `src/components/AdsLandingPage.astro` | Required as code, not raster. Treat the field as abstract territory/dispatch notation; do not imply real availability, boundaries, or geography. |
| Lead form, labels, five controls, and primary mustard action | Semantic `form`, `label`, `input`, and `button` elements styled with CSS | `src/components/AdsLandingPage.astro` | Ready; must remain real form controls, never flattened into an image. |
| Call-fact, directional, and proof icons | Authored inline SVG | `src/components/AdsLandingPage.astro` | Ready; decorative icons stay `aria-hidden`, with meaning carried by adjacent semantic text. |
| Owner-direct portrait | Existing real raster photograph | `src/assets/images/matt.webp` | Ready and sufficient; use only for the Matt Pugh owner section with accurate alt text. No generated identity imagery. |
| Specialist comparison, connected service rail, proof hairlines, final CTA field, and motion treatment | Semantic HTML + CSS + authored inline SVG | `src/components/AdsLandingPage.astro` | Code-native; no dashboard, testimonial, client-logo, badge, or decorative-photo assets required. |
| Approved composition | PNG design reference | `.impeccable/mocks/restoration-marketing-comp-b.png` | Approved reference only. Do not embed in production or crop pieces from it. |

## Production decision

**No additional raster assets need to be produced.** The composition remains faithful when its navy/cobalt field, coordinate grid, cyan plotting marks, hairline diagrams, chalk form surface, and mustard action are reconstructed in HTML/CSS/inline SVG. The verified logo supplies the brand identity and the real `matt.webp` supplies the only photographic identity moment. Adding a raster map, generated portrait, stock restoration scene, fake availability overlay, client logos, dashboard, or testimonial imagery would introduce unsupported claims, reduce accessibility/responsiveness, or weaken the approved field-briefing concept.
