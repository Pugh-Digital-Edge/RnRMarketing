# SEO/AEO Production Regression Check

## Run metadata

- Date: 2026-08-14
- Live environment: https://remediationrestorationmarketing.com/
- Live check time: approximately 2026-08-14 11:36 EDT / 15:36 UTC
- Repository HEAD: `ba7372c` (`aeo fixes`); pre-existing user edits in `src/components/Landing.astro`, `src/pages/contact.astro`, `src/pages/schedule.astro`, `src/styles/refresh.less`, and untracked preview logs were preserved.
- Run type: closed-loop SEO/AEO production regression check
- Canonry project: `remediation-restoration-marketing`
- Workflows used: Aero regression-playbook guidance; Canonry technical AEO and indexing read/check guidance
- Mutations intentionally not performed: Canonry sweep or probe, GSC/Bing sync or indexing submission, sitemap submission, deployment, CDN purge, or substantive site content/code change

## Outcome

No meaningful SEO/AEO production regression was found. The previously tracked deployment/parity issue is now resolved in production, including the two trailing-slash internal-link redirects. The latest Canonry technical baseline remains healthy at 89/100, while GSC coverage and AI visibility data remain stored reads from 2026-08-10 rather than a new comparable outcome window.

## Baseline comparison

The latest known-good/recorded production baseline was [`2026-08-13-production-regression.md`](2026-08-13-production-regression.md), supplemented by the completed Canonry recheck `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`:

- Production exposed 95 sitemap URLs; all returned 200 with the expected metadata, canonical, H1, JSON-LD, and LocalBusiness entity signals.
- `/thank-you/` was absent from the sitemap and returned `noindex, nofollow`.
- The source fixes for `/services/` and `/resources/` links had been made locally but their live deployment was pending.
- Canonry technical audit `5b21a8cd-089c-44e6-adbc-a6d679aacb5a` completed 2026-08-13 at 89/100, up from the stale 55/100 audit; 97 pages were audited with 0 errors.
- Stored GSC coverage remained 48 indexed / 47 not indexed of 95, last inspected and synced 2026-08-10. No new GSC sync was run.
- Stored visibility data last observed 2026-08-10; no fresh visibility sweep was authorized.

## Live production verification

### Sitemap, indexability, metadata, and response behavior

- `https://remediationrestorationmarketing.com/sitemap-index.xml` returned 200 and referenced `sitemap-0.xml`.
- `https://remediationrestorationmarketing.com/sitemap-0.xml` returned 200 with 95 unique URLs and 95 `lastmod` values.
- All 95 sitemap URLs returned HTTP 200.
- All 95 sitemap pages had a title, meta description, exactly one self-referencing canonical, exactly one H1, and at least one parseable JSON-LD block.
- All 95 sitemap pages used the same primary LocalBusiness entity: `@id` `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`, URL `https://remediationrestorationmarketing.com`.
- No sitemap-listed page exposed a `noindex` meta directive.
- `/thank-you/` returned HTTP 200, had canonical `https://remediationrestorationmarketing.com/thank-you/`, had `noindex, nofollow`, and was absent from the live sitemap. This remains the intended exclusion.

### Internal links, redirects, and error behavior

- 97 unique same-origin HTML link targets were discovered across the 95 sitemap pages.
- All 97 targets returned 2xx; 0 returned 4xx/5xx and 0 returned 3xx.
- The previously known `/services` -> `/services/` and `/resources` -> `/resources/` target redirects are no longer present in the live crawl. The source fix is now deployed and live-verified.
- Canonical-origin checks remained healthy: HTTP non-`www` redirects to HTTPS non-`www`; HTTPS `www` redirects to the canonical non-`www` origin; `/sitemap.xml` redirects to `/sitemap-index.xml`; a deliberately nonexistent URL returned 404.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/sitemap-index.xml`, and `/sitemap-0.xml` all returned 200.
- `robots.txt` allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot; blocks CCBot; declares `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and references the sitemap index.
- The live AI access files and sitemap hashes matched the current build artifacts. `robots.txt` matched after CRLF/LF normalization.
- Normal and `CanonryBot/1.0` responses were byte-identical on all seven representative routes: `/`, `/services/`, `/services/ppc/`, `/water-damage-restoration/ppc/`, `/resources/`, `/schedule/`, and `/thank-you/`.
- `Accept: text/markdown` returned the normal HTML response, while each representative route advertised an absolute `index.md` alternate returning HTTP 200 with `text/markdown`. This matches the intended implementation.

## Local build, source, and production parity

- `npm run build` exited 0, built 99 Astro pages, generated the sitemap, and ran `scripts/postbuild-aeo.mjs`.
- `node scripts/postbuild-aeo.mjs` exited 0 independently.
- The build emitted existing non-blocking warnings for stale Browserslist data, SVG `clip-rule` normalization, and duplicate SVG id `Star-1`; none failed the build or AEO validator.
- Current source and `dist` contain no exact non-slash internal `href` values for `/services` or `/resources`.
- Local `dist/sitemap-0.xml` contains 95 URLs and excludes `/thank-you/`; local `dist/thank-you/index.html` contains `noindex, nofollow`.
- Current live and local build SEO signals matched semantically on all seven representative routes. One raw comparison differed only in description entity encoding on `/water-damage-restoration/ppc/` (`&amp;` live versus `&#38;` local); rendered text is equivalent and this is not a regression.
- Raw HTML hashes are not used as a parity gate because production transformation/minification changes bytes. The checked SEO/AEO signal set and crawler behavior matched.

## Canonry evidence

Read-only Canonry commands completed for `remediation-restoration-marketing`:

```text
cnry project show remediation-restoration-marketing --format json
cnry technical-aeo score remediation-restoration-marketing --format json
cnry technical-aeo trend remediation-restoration-marketing --format json
cnry technical-aeo pages remediation-restoration-marketing --sort score-asc --format json
cnry google status remediation-restoration-marketing --format json
cnry google coverage remediation-restoration-marketing --format json
cnry runs remediation-restoration-marketing --limit 10 --format jsonl
cnry visibility-stats remediation-restoration-marketing --last-runs 5 --by-provider --format json
cnry insights remediation-restoration-marketing --format json
cnry doctor --project remediation-restoration-marketing --format json
```

Current stored Canonry evidence:

- Technical score: 89/100, run `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`, completed 2026-08-13 15:36:51 UTC; 99 discovered, 97 audited, 0 skipped, 0 errored; delta +34 from 55/100.
- Technical factors passed at aggregate level for structured data (92), content depth (97), citations/authority (80), E-E-A-T (80), FAQ content (88), schema completeness (100), freshness (81), entity consistency (88), definition blocks (81), named entities (81), snippet eligibility (100), AI access files (100), schema validity (100), technical SEO (97), and AI crawler access (100). Content extractability remains partial at 59/100 and is not, by itself, evidence for a generic rewrite.
- Lowest-scoring current pages in the stored technical run include `/case-studies/`, `/case-studies/chicago-restoration-lead-growth/`, `/contact/`, and `/privacy/` at 71/100. Their lower factors are content/extractability/FAQ/definition observations, not a reproduced technical or deployment failure.
- GSC connection and property access are healthy. Stored coverage is 48 indexed / 47 not indexed of 95 (50.5%), all 47 previously grouped as `URL is unknown to Google`; last inspected/synced 2026-08-10.
- The stored visibility window contains 3 completed runs / 162 provider snapshots, with 68 mentioned (41.98%) and 11 cited (6.79%) in the prior record. Provider stats across that stored window are Claude 26/54 mentioned and 2/54 cited, Gemini 20/54 mentioned and 5/54 cited, and OpenAI 22/54 mentioned and 4/54 cited. Last observations are 2026-08-10; this is not a new comparable window, so no mention or citation regression is declared.
- `cnry doctor` reached the project. It reported 5 checks OK, 4 warnings, and 1 failure: no GBP OAuth connection. Warnings also include the missing sitemap-write scope, no backlink source, and low winnability classification coverage. These are integration/configuration limitations, not live production regressions; no connector or configuration mutation was attempted.

## Findings and classification

### 1. Previously tracked trailing-slash deployment issue is resolved

Problem -> Source links previously produced `/services` and `/resources` redirects in production after the local fix.

Evidence -> The live 97-target internal-link crawl returned 0 redirects, the representative routes were healthy, current source/dist contain no exact non-slash links, and `npm run build` plus the independent AEO validator passed.

Expected impact -> Removes avoidable internal redirect hops and aligns deployed navigation with the configured trailing-slash URL policy.

Recommended change -> No further code or content change for this issue; continue monitoring after future deployments.

Effort -> Completed.

Confidence -> High.

Verification method -> Re-run the sitemap-page internal-link crawl and confirm `/services` and `/resources` remain absent from 3xx target results.

Classification: deployment/stale artifact defect resolved; no current production impact.

### 2. Index coverage remains an open measurement/opportunity item, not a new regression

Problem -> Stored GSC data shows 47 of 95 URLs not indexed.

Evidence -> Canonry coverage is unchanged from the 2026-08-10 sync; the live sitemap has 95 eligible URLs, `/thank-you/` is intentionally excluded, and all live sitemap pages return 200 with indexable signals. No URL-level current verdict refresh was run.

Expected impact -> Classifying the 47 stored URL-level verdicts could identify eligible commercial pages for future indexing work, while keeping intended exclusions separate.

Recommended change -> Keep SEO-002 as Candidate. Review the stored URL list and obtain explicit operator approval before any indexing request, sitemap submission, or sync that changes external state.

Effort -> Medium, operator-dependent.

Confidence -> Medium.

Verification method -> Fresh Canonry/GSC coverage read and before/after recrawl window; record intended exclusions separately.

Classification: indexing opportunity / stale stored measurement, not a demonstrated production regression.

### 3. Canonry technical and AI visibility evidence is stable but not newly refreshed

Problem -> A fresh comparable AI visibility window is not available for regression detection.

Evidence -> `visibility-stats --last-runs 5` reports only 3 completed runs with last observations on 2026-08-10; the latest completed technical audit is 2026-08-13 and remains healthy at 89/100. Aero regression guidance requires comparable snapshots and treats null/missing mention checks as missing data.

Expected impact -> Avoids over-claiming a mention/citation change from stale or non-comparable data.

Recommended change -> Keep SEO-003 as Candidate. Request operator approval before a real visibility sweep; do not infer outcome changes from today’s technical/live checks.

Effort -> Low operator time, quota-consuming.

Confidence -> High.

Verification method -> Completed sweep ID, adopted query-basket denominator, provider breakdown, and comparison with the last completed visibility run.

Classification: measurement pending; no mention or citation regression declared.

## Backlog reconciliation

- SEO-001 remains `Validated`; its production parity and trailing-slash deployment evidence is updated in place. No duplicate was created.
- SEO-002 remains `Candidate`; the 48/47 stored GSC baseline is unchanged, and no indexing mutation or sync was run.
- SEO-003 remains `Candidate`; no quota-consuming visibility sweep was authorized.
- SEO-004 remains `Candidate`; current evidence still supports page-specific, evidence-ranked work only after parity and search opportunity are established. No content rewrite was made.
- The backlog reconciliation date and source run were updated to 2026-08-14.

## Commands and verification status

- Live verification: complete for sitemap membership, status, metadata, canonical, headings, JSON-LD/entity consistency, internal links, redirects, robots, AI access files, crawler parity, markdown alternates, `/thank-you/`, canonical-origin behavior, and 404 behavior.
- Local/build verification: complete and passing with `npm run build` and independent `node scripts/postbuild-aeo.mjs`.
- Canonry verification: read/check commands complete; latest stored technical audit is current as of 2026-08-13. GSC and visibility reads are stale as of 2026-08-10 and were not refreshed.
- Production/source/build parity: complete for checked SEO/AEO signals and AI access artifacts; one HTML entity encoding difference is semantically equivalent; raw HTML byte equality is not expected after production transformation.
- No deployment, CDN purge, indexing submission, sitemap submission, GSC/Bing sync, Canonry sweep, or probe was performed.
- Pending operator-confirmed actions: optionally authorize a fresh visibility sweep and/or current GSC sync/indexing review; separately address Canonry integration warnings if desired.

