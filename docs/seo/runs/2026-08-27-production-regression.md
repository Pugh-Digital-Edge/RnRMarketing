# SEO/AEO Production Regression Check

## Run metadata

- Run time: 2026-08-27T10:30:11-04:00 (America/New_York)
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Current repository: `5429a0add6e9e567a0e3098008833df6a92819cb` (`5429a0a`, `Refresh service pages and shared marketing components`), with `main` synchronized to `origin/main` and a clean worktree before this run.
- Previous known-good baseline: [`2026-08-25-production-regression.md`](2026-08-25-production-regression.md)
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- No deployment, CDN purge, Canonry sweep/probe/discovery, GSC/Bing sync or indexing request, sitemap submission, connector mutation, or substantive source/content change was performed.

## Outcome

One meaningful regression was found: the approved contextual link from `/services/ppc/` to `/water-damage-restoration/ppc/` is missing from live production. The 2026-08-25 known-good run recorded that link as present. The current source commit `5429a0a` removed the link while refactoring the PPC page into the shared service component, and the current local build omits it as well. This is classified as a **source-code regression** under SEO-005, with a likely deployment of the changed source reflected in production; no indexing, redirect, crawlability, or broken-link defect was found.

The broader live technical surface remains healthy. All 96 live sitemap URLs returned HTTP 200 and passed the checked metadata, canonical, heading, JSON-LD, entity, and indexability checks. The 98 discovered same-origin HTML targets all returned HTTP 200 with no redirects or broken links. The current service-page refactor has normalized visible-text, heading, link-set, metadata, schema, and entity parity with the local build across the checked cluster and across all 96 sitemap pages for the SEO signal comparison. Raw HTML byte size differs on the refactored service pages because the live artifact retains additional compiled styling/markup; this was not treated as an SEO regression because the rendered SEO signal set matched.

Search and AI outcome changes remain unavailable from comparable data. No outcome is claimed.

## Baseline comparison

Compared with [`2026-08-25-production-regression.md`](2026-08-25-production-regression.md):

- Stable: live sitemap remains 96 unique URLs, and local build sitemap remains the same 96 URLs with no local-only or live-only URL.
- Stable: 96/96 sitemap URLs return HTTP 200; all have a title, description, one self-canonical, exactly one H1, parseable JSON-LD, the primary LocalBusiness entity, and no page-level `noindex` directive.
- Stable: `/thank-you/` and `/restoration-marketing/` remain HTTP 200, `noindex, nofollow`, and excluded from the live sitemap.
- Stable: the full live crawl found 98 unique same-origin HTML targets, all HTTP 200, with zero broken targets and zero redirects.
- Stable: robots, `llms.txt`, `llms-full.txt`, sitemap index, child sitemap, and representative Markdown alternates remain available and aligned with the local build after line-ending normalization.
- Regressed: `/services/ppc/` no longer links contextually to `/water-damage-restoration/ppc/`; the specialist page still links back to `/services/ppc/`. The prior run recorded the reverse contextual link as present.
- Changed but not SEO-regressing: eight service-page files were refactored in `5429a0a`. The current live and local output have identical normalized visible text, headings, link sets, metadata, schema counts/entity identity, and indexability signals for the checked cluster; raw HTML hashes and byte sizes differ.
- Stable/limited: Netlify still exposes `Server: Netlify`, a cache hit, `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT`, and a request ID, but no stable provider deployment/build ID. The repository commit is therefore the source reference, not a claimed Netlify build ID.

## Live production verification

### Sitemap, indexability, metadata, and entity signals

- `/sitemap-index.xml`: HTTP 200, `application/xml`, points to `/sitemap-0.xml`.
- `/sitemap-0.xml`: HTTP 200, `application/xml`, 96 unique URLs and 96 `<lastmod>` values.
- All 96 sitemap URLs: HTTP 200; title present; meta description present; exactly one self-referencing canonical; exactly one H1; parseable JSON-LD; no page-level `noindex`; no `X-Robots-Tag` header.
- All 96 pages expose the same primary entity: `@id` `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`.
- Excluded routes: `/thank-you/` and `/restoration-marketing/` both returned HTTP 200 with `noindex, nofollow` and were not members of the sitemap.
- Representative live metadata remains page-specific on the four SEO-004 URLs: `/water-damage-restoration/ppc/`, `/services/retargeting/`, `/services/web-design/`, and `/services/social-media-marketing/`.

### Internal links, redirects, and response behavior

- 98 unique same-origin HTML targets were discovered; all returned HTTP 200; broken targets: 0; redirects among internal targets: 0.
- Confirmed regression: `/services/ppc/` does not contain `/water-damage-restoration/ppc/` in live HTML. The current source and local `dist` output also omit it. The specialist page retains links back to `/services/ppc/`.
- `http://remediationrestorationmarketing.com/` → canonical HTTPS non-`www`, HTTP 301.
- `https://www.remediationrestorationmarketing.com/` → canonical HTTPS non-`www`, HTTP 301.
- `/sitemap.xml` → `/sitemap-index.xml`, HTTP 301.
- Deliberately nonexistent URL `/definitely-not-found-20260827/` returned HTTP 404.
- Representative live responses expose no `X-Robots-Tag`; indexability is controlled by the expected page-level directives.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, `/sitemap-index.xml`, and `/sitemap-0.xml` all returned HTTP 200.
- `robots.txt` allows the checked GPTBot, OAI-SearchBot, PerplexityBot, and ClaudeBot groups; blocks CCBot; and contains `Content-Signal: search=yes, ai-input=yes, ai-train=no`.
- Direct Markdown alternates returned HTTP 200 `text/markdown` for `/index.md`, `/services/ppc/index.md`, `/water-damage-restoration/ppc/index.md`, `/resources/index.md`, `/schedule/index.md`, and `/restoration-marketing/index.md`.
- Normal and `CanonryBot/1.0` bodies were byte-identical on 14 representative routes, including the homepage, service index, generic and specialist PPC pages, all four SEO-004 pages, social advertising, resources, article, schedule, contact, and excluded routes.
- `Accept: text/markdown` behavior was not changed; advertised direct Markdown endpoints are healthy.

## Local build and production/source parity

- `npm run build` passed with exit code 0. Astro built 101 pages and the package script ran `scripts/postbuild-aeo.mjs`; existing non-blocking warnings include stale Browserslist data, SVG normalization, and duplicate SVG id `Star-1`.
- Independent `node scripts/postbuild-aeo.mjs` passed with exit code 0.
- Local/live signal comparison across all 96 live sitemap URLs found 0 mismatches for title, description, canonical, H1 count, robots meta, JSON-LD count, and primary entity identity.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap matched after CRLF/LF normalization.
- The eight refactored service pages have equal normalized visible-text hashes and equal heading/link sets between live and local output. The raw live/local HTML byte sizes differ; this is recorded as artifact/deployment drift, not a confirmed SEO signal defect.
- No source/content files were changed by this run. Existing unrelated worktree changes: none.

## Canonry and search evidence

### Technical AEO

- Read-only command: `cnry technical-aeo score remediation-restoration-marketing --format json`.
- Latest completed audit: `8341b64b-100f-49d8-8835-e8c27a91f446`, completed 2026-08-20T18:19:05Z, score 89/100, 97 pages audited, 0 skipped, 0 errored, flat versus the prior 89/100 audit.
- Stored factors continue to pass for structured data, schema completeness/validity, entity consistency, snippet eligibility, technical SEO, AI access files, and AI crawler access. Content extractability remains the only partial cross-cutting factor; it was not treated as a newly introduced production regression.

### Google and Bing indexing

- Stored GSC coverage: 52 indexed / 48 not indexed / 0 deindexed across 100 stored URLs; last inspected and synced 2026-08-24T18:50:29Z. This is stored evidence, not a live refresh.
- Stored URL-level states for current representative targets: `/water-damage-restoration/ppc/`, `/services/retargeting/`, `/services/web-design/`, `/services/social-media-marketing/`, and `/services/social-media-advertising/` are `Submitted and indexed` and `INDEXING_ALLOWED`.
- Stored state for `/resources/water-damage-restoration-marketing/` is `URL is unknown to Google` with `INDEXING_STATE_UNSPECIFIED`; the page is live, indexable, and sitemap-listed, but no current indexing outcome is claimed.
- Bing stored coverage is a limited 16-URL sample, all indexed, last inspected 2026-08-24T18:48:24Z; it is not full-site coverage.
- No fresh GSC/Bing sync, inspection, sitemap submission, or indexing request was run.

### AI visibility and regression status

- Latest completed visibility sweep remains `595fca88-de9d-474e-8854-f7319346e0b5` from 2026-08-10; the 2026-08-17 fixed-basket attempt `14ee1d3c-8670-4a3a-9138-d36105e15a77` remains cancelled and is not comparable.
- Stored pooled visibility stats: 3 completed runs / 162 snapshots, 68 mentioned (41.98%) and 11 cited (6.79%). Mention is primary; citation is reported separately as the secondary signal.
- Current overview surface: Mention Coverage 27/42 queries (64%), Citation Coverage 4/42 (10%), and non-brand Mention Share 4 of 31 project-plus-competitor mentions (13%). The overview marks the 42-query versus prior 12-query movement as non-comparable (`querySetChanged=true`), so no mention or citation loss is declared.
- Stored 90-day gap read: 5 mention gaps, 33 not-mentioned queries, 34 citation gaps, and 4 uncited queries; the water-damage marketing query is mentioned 0/2 and cited 0/2 in available stored runs. These are stale/non-comparable opportunity signals, not a production regression finding.

### Canonry doctor and integration limitations

- `cnry doctor --project remediation-restoration-marketing --format json` was run against the configured project; GSC auth/property access and redirect configuration are healthy.
- Read-only warnings include missing GSC sitemap-write scope, no GA4 connection, no server-side traffic source, no backlink source, and low winnability coverage. GBP OAuth is unconfigured and remains a fail check. These are integration limitations, not reproduced live-page defects.

## Findings and classification

### 1. Confirmed PPC contextual-link regression — source-code regression

**Problem** → The generic PPC page no longer provides the approved contextual route to the water-damage PPC page.

**Evidence** → The 2026-08-25 known-good run recorded `/services/ppc/` → `/water-damage-restoration/ppc/` as present. On 2026-08-27, the live page, current local build, and current source all omit the link; `git show` confirms `5429a0a` removed the prior paragraph containing the link while refactoring `src/pages/services/ppc.astro`. The specialist page still links back, and the broader crawl remains 98/98 successful with no broken links.

**Expected impact** → Restore a clear generic-versus-specialist PPC intent path and preserve internal relevance flow; ranking or conversion impact is not yet measurable.

**Recommended change** → Restore the link in an operator-approved source change, deploy it, then rerun source/build/live parity and the internal-link crawl. Do not compensate with a rewrite, blanket redirect, deindexing, or schema change.

**Effort** → Low implementation; medium verification and measurement.

**Confidence** → High that the link regression exists and was introduced by the current source refactor; medium for downstream search impact.

**Verification method** → Confirm the exact followable link in source, local build, and live `/services/ppc/` HTML; rerun all 98 internal targets; then compare GSC query-by-page distribution and clicks/impressions/position over a stable comparable window. Reset the SEO-005 measurement due date after the repaired artifact is live-verified.

**Classification** → Source-code regression, with live production impact. No indexing or redirect defect.

### 2. No broad technical production regression

**Problem** → None found across the current sitemap and representative production surface.

**Evidence** → 96/96 sitemap pages passed HTTP, metadata, canonical, H1, JSON-LD/entity, and indexability checks; 98/98 internal HTML targets returned 200; crawler bodies matched normal bodies on 14 routes; robots, AI-access files, Markdown alternates, redirects, 404 behavior, and local/build SEO signals passed.

**Expected impact** → The current live artifact remains technically eligible for organic and AI crawling, apart from the SEO-005 internal-link omission.

**Recommended change** → Make no broad content, schema, indexability, deployment, or CDN change in this check. Repair only the confirmed SEO-005 link regression through the approved change process.

**Effort** → None for the clean checks; low for the targeted link repair.

**Confidence** → High for the checked production surface.

**Verification method** → Repeat the same 96-page/98-target live crawl after the approved repair and compare against this run and the 2026-08-25 baseline.

**Classification** → No broad regression; raw compiled-artifact drift is noted but not SEO-impacting on the checked signal set.

## Backlog reconciliation

- **SEO-001** remains `Measuring`. Updated its stable evidence to record the current `5429a0a` source/live parity state, raw artifact drift, and the SEO-005 link regression. No broad technical regression was opened.
- **SEO-002** remains `Measuring`. Stored GSC coverage was read only; no fresh sync, inspection, submission, or indexing request was performed.
- **SEO-003** remains `Measuring`. No quota-consuming visibility sweep or probe was run; the current 42-query movement view remains non-comparable with the prior 12-query surface.
- **SEO-004** remains `Measuring`. The four page-specific metadata interventions remain live and technically valid; no comparable post-deployment search/AEO outcome is claimed.
- **SEO-005** is reopened to `In Progress` because the approved generic-to-specialist PPC link is missing in current source and live output. No duplicate ID was created.
- **SEO-006** remains `In Progress`; the article remains live and technically valid, but approval and outcome measurement are still pending.

## Commands and results

- Repository/read checks: `git status --short --branch`, `git rev-parse HEAD`, `git show`, source inspection, and local artifact inspection. Worktree clean; HEAD `5429a0a`.
- Local verification: `npm run build` passed; independent `node scripts/postbuild-aeo.mjs` passed.
- Live verification: read-only Node/Fetch checks covered sitemap membership, HTTP status, titles/descriptions, canonicals, H1s, JSON-LD/entity consistency, meta/X-Robots indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, and 404 behavior.
- Canonry read/checks: `cnry doctor`, `cnry technical-aeo score`, `cnry technical-aeo trend`, `cnry google coverage`, `cnry google deindexed`, `cnry google status`, `cnry bing status`, `cnry bing coverage`, `cnry runs`, `cnry visibility-stats`, `cnry overview`, and `cnry analytics --feature gaps --window 90d`.
- No mutation or quota-consuming operation was performed.

## Verification status and limitations

- **Live production:** complete for the 96-URL sitemap, 98 internal HTML targets, representative metadata/indexability/schema/entity signals, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, and 404 behavior.
- **Local/build:** complete; build and independent postbuild AEO validation passed.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts; raw HTML byte parity is not exact on the refactored service pages, and the generic PPC contextual link is missing in source, build, and live.
- **Canonry:** technical audit current through 2026-08-20; GSC/Bing stored reads through 2026-08-24; visibility outcome data last completed 2026-08-10 and not comparable for regression claims.
- **Unavailable/not claimed:** current post-deployment GSC/Bing performance, current full index coverage, GA4 conversions/AI referrals, live crawler logs, fresh AI mention/citation outcomes, and causal impact of the missing link.
- **Pending operator-confirmed action:** approve restoration of the SEO-005 contextual link, deploy it, and rerun production parity before resuming measurement. Separately authorize any fresh GSC/Bing inspection or fixed-basket Canonry sweep if current measurement is required.
