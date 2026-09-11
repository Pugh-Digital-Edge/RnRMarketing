# Browser comment fixes — September 11, 2026

User requested SEO hero spacing/contrast fixes and two generated homepage replacement images. This is local implementation; no production deployment is authorized by these comments.

## Changes

- SEO hero: reserve 8rem for the fixed header; explicitly keep H1 and proof heading white despite the global heading rule; widen H1 measure and delay the two-column layout until 1200px. Preserve title, H1 copy, descriptions and schema.
- Homepage hero: replace both mobile and desktop sources with a restoration drying scene. Remove the 1600px legacy background override so wide monitors also receive the new image. Use responsive WebP sources and matching preload candidates.
- Supporting image: replace construction stock photo with an anonymous restoration team planning a job. Use a 3:2 aspect ratio and direct object-fit on the generated img element. Reset image stretching, negative section offset and testimonial margin; use balanced text/image grids.
- Original assets retained for other references and rollback. Generated imagery is illustrative, not an actual client or testimonial author.

## Image provenance

Generated with the built-in Imagegen tool. Originals saved in the project as `src/assets/images/restoration-drying-hero.png` and `src/assets/images/restoration-team-planning.png`. Astro creates the served WebP variants.

### Hero prompt

Generate a premium photorealistic editorial photograph for a restoration marketing agency website HERO BACKGROUND. Wide landscape 16:9 composition. A real-world residential water-damage restoration crew at work, professionally maintained blue air movers and a dehumidifier, clean organized hoses, a technician in navy work clothes holding a tablet while checking a drying setup inside a bright partially restored American home. All recognizable activity and technician on the RIGHT HALF, left 50 percent deliberately quiet shaded navy-toned wall and spacious uncluttered negative space for white website headline, not painted text. Camera at human eye level, natural authentic documentary photography, realistic materials, confident calm operational mood, daylight from right, restrained blue and warm neutral palette. No hard hats in a finished home, no fluorescent construction vests, no staged handshake, no flooding or extreme destruction. No words, logos, watermarks, chart graphics, badges, UI or borders. This is an illustrative scene, not a real named client. The photo must feel specific to professional water mitigation, not generic construction. Render one finished landscape photograph.

### Supporting-image prompt

Generate one premium photorealistic editorial photograph, landscape 3:2, for the supporting image beside a restoration marketing website testimonial. Show an organized residential restoration team planning the next job: one woman restoration project manager and one man technician in simple navy work shirts reviewing a tablet at a clean workbench, with blue professional drying equipment and an open unbranded service van softly visible in a tidy garage workshop behind them. Natural candid interaction, hands and tablet anatomically realistic, no posing at camera. Waist-up medium-wide framing, both people comfortably INSIDE central 70 percent with headroom and breathing room at all edges so the photograph can be cropped to a wide panel, not tall portrait. Soft natural daylight, warm neutral skin tones, cobalt-blue equipment accents, understated trustworthy atmosphere. No logos, names, readable screen text, watermarks, badges, hard hats, construction safety vests, or fake marketing charts. Illustrative anonymous scene, do not depict any specific testimonial author or claim it is a real customer. Professional documentary photography, realistic detail and texture. One single photograph only.

## Verification

- Build passed: 103 generated pages and 98 sitemap URLs. Local technical check passed all 98 URLs and all discovered internal HTML link targets; `git diff --check` passed.
- Browser inspection at 2273×1272, 1280×720, 1024×900 and 390×844: no horizontal overflow on inspected routes. SEO H1 is white (`rgb(255, 255, 255)`), proof heading is white, and H1 clears the fixed header. Corrected Less arithmetic so mobile hero gutters are 16px rather than approximately 4px.
- SEO hero uses one column at 1024px and two at wide desktop widths. Mobile H1 begins at y=172 versus header bottom y=128. Wide desktop H1 begins at y=251 versus header bottom y=154.
- New hero image remains a visible responsive picture above 1600px. Image canvas starts below the header to keep the technician's head visible. Mobile serves a smaller WebP candidate.
- Supporting photograph maintains a measured 1.5 width/height ratio at desktop and mobile, without stretch. Testimonial and photo align in balanced columns on desktop and stack on mobile.
- Local Impeccable layout scan found no issues on the SEO route before the final confirmation scan. No new runtime scripts or third-party requests were introduced. Existing Canonry baseline and deployment measurement boundary remain in the competitor-improvements report; this change makes no ranking or conversion outcome claim.
