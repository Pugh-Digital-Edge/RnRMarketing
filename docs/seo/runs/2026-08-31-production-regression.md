# SEO/AEO Production Regression Check

## Run metadata

- Run time: 2026-08-31T10:26:07-04:00 (2026-08-31T14:26:07Z)
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Current repository: `2c7c54533009d284b65794b61b53303c1580da10` (`Capture only abandoned partial leads`), clean worktree, `main` synchronized with `origin/main`.
- Previous known-good baseline: [`2026-08-28-production-regression.md`](2026-08-28-production-regression.md)
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- No deployment, CDN purge, Canonry sweep/probe/discovery, GSC/Bing sync or indexing request, sitemap submission, connector mutation, or substantive SEO/content change was performed.

## Outcome

No meaningful live SEO/AEO production regression was found. The live site remains healthy against the 2026-08-28 baseline: 96/96 sitemap URLs returned HTTP 200 and passed the checked metadata, canonical, heading, JSON-LD/entity, and indexability gates; 98/98 same-origin internal HTML targets returned HTTP 200 with zero redirects; the SEO-005 PPC contextual link remains present; and normalized local/build/live SEO signals remain aligned.

The current HEAD adds lead-capture behavior after the prior baseline. The recently affected noindex `/restoration-marketing/` route serves the expected two-step form markers, `/thank-you/` action, submission/stage fields, and `noindex, nofollow` state in both live and local build output. This is production/source/build parity, not an SEO regression.

## Baseline comparison

Compared with [`2026-08-28-production-regression.md`](2026-08-28-production-regression.md):

- Stable: live sitemap index and child sitemap are available and contain 96 unique URLs.
- Stable: all 96 sitemap URLs return HTTP 200 with a title, meta description, absolute self-canonical, exactly one H1, parseable JSON-LD, the primary LocalBusiness entity, and no page-level `noindex` or `X-Robots-Tag` directive.
- Stable: 98 unique same-origin internal HTML targets return HTTP 200, with zero broken targets and zero internal redirects after throttled retries.
- Stable: `/services/ppc/` links to `/water-damage-restoration/ppc/`, and the reverse specialist-to-generic link remains present.
- Stable: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `noindex, nofollow` and are absent from the sitemap.
- Stable: normal and `CanonryBot/1.0` bodies are byte-identical on 14 representative routes.
- Stable: robots, `llms.txt`, `llms-full.txt`, sitemap files, and six representative Markdown alternates are available; robots allows the checked AI search crawlers, blocks CCBot, and carries the expected `Content-Signal`.
- Changed outside the SEO interventions: HEAD `2c7c545` includes form/lead-capture changes in `AdsLandingPage.astro`, `lead-phone-form.ts`, and related tests. The live `/restoration-marketing/` form matches the local build on action, method, two-step markers, submission/stage fields, and noindex state.

## Live production verification

### Sitemap, indexability, metadata, and entity signals

- `/sitemap-index.xml`: HTTP 200; points to `https://remediationrestorationmarketing.com/sitemap-0.xml`.
- `/sitemap-0.xml`: HTTP 200; 96 unique URLs.
- Sitemap pages: 96/96 HTTP 200; missing titles 0; missing descriptions 0; bad canonicals 0; pages with H1 count other than one 0; pages without parseable JSON-LD 0; sitemap pages with `noindex` 0; page-level `X-Robots-Tag` headers 0.
- JSON-LD/entity consistency: every sitemap page exposes the same primary `LocalBusiness` identity `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`.
- Excluded routes: `/thank-you/` and `/restoration-marketing/` are HTTP 200, `noindex, nofollow`, and not sitemap members.

### Internal links, redirects, and response behavior

- 98 unique same-origin HTML targets were discovered from the sitemap pages; all returned HTTP 200 and no target redirected.
- SEO-005: live `/services/ppc/` contains a followable link to `/water-damage-restoration/ppc/`; the local build and current source contain the same link.
- Canonical-host behavior: `http://remediationrestorationmarketing.com/` and `https://www.remediationrestorationmarketing.com/` return HTTP 301 to `https://remediationrestorationmarketing.com/`.
- `/sitemap.xml` returns HTTP 301 to `/sitemap-index.xml`.
- Deliberately nonexistent URL `/definitely-not-found-20260831/` returns HTTP 404.
- Representative response headers expose Netlify request IDs but no stable deployment/build ID. A request ID is not treated as a deployment identifier.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all six checked Markdown alternates return HTTP 200.
- Markdown alternates use `text/markdown`.
- Normal and `CanonryBot/1.0` response bodies are byte-identical for `/`, `/services/`, both PPC pages, the four SEO-004 pages, social advertising, resources, the approved article, `/schedule/`, `/contact/`, `/thank-you/`, and `/restoration-marketing/`.
- The AI-access files are aligned with the local build after line-ending normalization.

## Local build and source/live/build parity

- `npm run build` passed with exit code 0. Astro built 101 HTML pages and generated a 96-URL sitemap; the package script included `scripts/postbuild-aeo.mjs`.
- Existing non-blocking build warnings remain: stale Browserslist data, SVG attribute normalization, and duplicate SVG id `Star-1`.
- The normalized field comparison across all 96 live sitemap URLs found 0 mismatches for title, description, canonical, robots directives, H1 count, and JSON-LD count/entity signals.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap match after normalization.
- Current `/restoration-marketing/` form parity: live and local both use `action=/thank-you/`, `method=post`, two form steps, one submission ID field, one lead-stage field, and `noindex, nofollow`. The route remains excluded from the sitemap.
- No source or content file was changed by this run; the worktree remained clean.

## Canonry and search evidence

### Technical AEO

- Read-only commands: `cnry technical-aeo score remediation-restoration-marketing --format json` and `cnry technical-aeo trend remediation-restoration-marketing --format json`.
- Latest completed audit: `8dd953a4-4c60-4527-b6d6-1e68fad32431`, completed 2026-08-27T18:07:42Z, score 88/100, 98 discovered/audited, 0 skipped, 0 errored; previous audit 89/100 across 97 pages.
- Content Extractability remains the only partial cross-cutting factor at 58/100. The one-point aggregate delta coincides with the expanded audited scope and is not treated as a confirmed live regression.

### Google and Bing indexing

- Stored Google coverage: 53 indexed / 47 not indexed / 0 deindexed across 100 stored URLs; last URL inspection 2026-08-27T18:12:17Z; last sync 2026-08-24T18:50:29Z. The 47 not-indexed rows are stored as `URL is unknown to Google`.
- Stored Bing coverage: 37 indexed / 0 not indexed / 1 unknown across 38 inspected URLs; last inspected 2026-08-27T18:14:09Z.
- `cnry google deindexed` returned 0 rows.
- These are stored evidence, not a current refresh. The live sitemap and indexability checks do not show a newly introduced indexing defect.
- No fresh sync, sitemap submission, indexing request, or other indexing mutation was run.

### AI visibility and regression status

- No new visibility sweep or probe was run.
- The latest completed fixed-basket result remains run `30969b56-2bc9-49cc-bba3-4cee92a4e36e`: 5/42 Mention Coverage and 3/42 Citation Coverage versus 27/42 and 4/42 on 2026-08-10. Under Aero regression guidance, this is a point-in-time decline requiring confirmation because it provides only one observation per provider; no causal production regression is claimed.
- Stored four-run visibility is 73 mentions and 15 citations across 288 checks: 25.35% mention rate and 5.21% citation rate. Mention and citation remain separate signals.
- The 90-day stored gap read is tied to run `30969b56-2bc9-49cc-bba3-4cee92a4e36e`: 5 mentioned-query rows, 6 mention-gap rows, 31 not-mentioned rows, 3 cited rows, 36 citation-gap rows, and 3 uncited rows. These are opportunity data, not new live regression evidence.

### Canonry doctor and integration limitations

- `cnry doctor --project remediation-restoration-marketing --format json` reached the configured project and confirmed GSC authentication/property access and Bing connection/site access.
- Doctor exits nonzero only for the pre-existing missing GBP OAuth connection. Warnings also report missing GSC sitemap-write scope, no GA4 connection, no server-side traffic source, no backlink source, and low content-winnability coverage.
- These are integration/data limitations, not reproduced live-page defects. No connector or configuration mutation was made.

## Findings and classification

### 1. No confirmed production regression

**Problem** → None found across the current sitemap, internal-link graph, representative affected URLs, AI-access artifacts, response behavior, or SEO signal parity.

**Evidence** → 96/96 sitemap URLs passed HTTP, metadata, canonical, heading, JSON-LD/entity, and indexability checks; 98/98 internal HTML targets returned 200; the SEO-005 link is present; crawler bodies matched normal bodies on 14 routes; robots, AI-access files, Markdown alternates, redirects, 404 behavior, and local/build SEO signals passed.

**Expected impact** → The current live artifact remains technically eligible for organic and AI crawling, and the approved internal-link intervention remains available for measurement.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, or CDN change from this check. Keep SEO-001 through SEO-007 in their existing measurement states and preserve the repaired SEO-005 artifact.

**Effort** → None for regression remediation.

**Confidence** → High for the checked production surface; medium for search/AEO outcome because comparable outcome windows are pending.

**Verification method** → Repeat the 96-page/98-target production check after any SEO-impacting deployment; compare the approved query/page windows in GSC and obtain operator approval before a future fixed-basket Canonry sweep.

**Classification** → No confirmed source-code, deployment/stale-artifact, configuration, indexing, or content regression.

### 2. Stored indexing opportunity remains, not a production defect

**Problem** → 47 of 100 stored Google URLs remain not indexed, while the current live sitemap and page-level indexability signals are healthy.

**Evidence** → Stored Google coverage is 53/47/0, with all 47 not-indexed rows grouped as `URL is unknown to Google`; the bounded 2026-08-27 inspection separately identified crawled-not-indexed and unknown pages. Bing has 37 indexed and 1 unknown among 38 stored inspections.

**Expected impact** → Indexing eligible pages is a prerequisite for organic and AI citation visibility, but the current data does not show a newly introduced live defect.

**Recommended change** → Keep SEO-002 in Measuring. Review the bounded industry-hub evidence first; keep unknown separate from crawled-not-indexed pages. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the stored bounded sample; medium for whole-site coverage because no current full-site inspection was run.

**Verification method** → Repeat the same approved URL set after a meaningful recrawl window and compare exact URL-level verdicts.

**Classification** → Indexing opportunity/limitation, not a confirmed production regression.

## Backlog reconciliation

- **SEO-001** remains `Measuring`; updated with the 2026-08-31 clean parity recheck, current HEAD `2c7c545`, and `/restoration-marketing/` form parity.
- **SEO-002** remains `Measuring`; stored Google/Bing evidence is unchanged and no indexing mutation was performed.
- **SEO-003** remains `Measuring`; no new sweep was run and the 2026-08-27 fixed-basket result remains point-in-time pending confirmation.
- **SEO-004** remains `Measuring`; all four target pages remain technically valid and no comparable post-deployment search outcome is available.
- **SEO-005** remains `Measuring`; the repaired PPC contextual link remains present in source, build, and live output through its 2026-09-24 measurement date.
- **SEO-006** remains `Measuring`; the article remains live, indexable, and sitemap-listed without a new outcome claim.
- **SEO-007** remains `Measuring`; the approved social-advertising page remains technically valid without a new outcome claim.
- No duplicate backlog IDs were created.

## Commands and results

- Repository/read checks: `git status --short --branch`, `git rev-parse HEAD`, `git log`, `git diff --stat 98edc6f..HEAD`, source inspection, and local artifact inspection. Clean worktree; HEAD `2c7c545`.
- Local verification: `npm run build` passed; Astro built 101 pages and generated a 96-URL sitemap; postbuild AEO validation ran as part of the command.
- Live verification: bounded Node/Fetch checks covered sitemap membership, HTTP status, titles/descriptions, canonicals, H1s, JSON-LD/entity consistency, meta/X-Robots indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, 404 behavior, and the SEO-005 link.
- Canonry read/checks: `cnry doctor`, `cnry technical-aeo score`, `cnry technical-aeo trend`, `cnry google coverage`, `cnry google deindexed`, `cnry bing status`, `cnry bing coverage`, `cnry visibility-stats`, and `cnry analytics --feature gaps --window 90d`.
- No mutation or quota-consuming operation was run.

## Verification status and limitations

- **Live production:** complete for the 96-URL sitemap, 98-target internal crawl, representative metadata/indexability/schema/entity signals, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, form parity on the recently affected route, and 404 behavior.
- **Local/build:** complete; `npm run build` passed, including `scripts/postbuild-aeo.mjs`; only existing non-blocking warnings remain.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts. The `/restoration-marketing/` noindex form markers and action match between source/build/live; raw HTML byte identity is not required and remains affected by compiled artifact markup/formatting.
- **Canonry:** technical audit current through 2026-08-27; Google URL inspection current through 2026-08-27 with stored sync through 2026-08-24; Bing inspection current through 2026-08-27; visibility outcome data current through the 2026-08-27 completed sweep.
- **Unavailable/not claimed:** current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, causal search/AEO impact of SEO-005, and a current full-site Google verdict set.
- **Pending operator-confirmed action:** keep approved artifacts stable through their measurement dates; authorize any future GSC/Bing inspection mutation or fixed-basket visibility sweep separately.
