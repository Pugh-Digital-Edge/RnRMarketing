# SEO/AEO Production Regression Check

## Run metadata

- Run time: 2026-08-21T10:50:38-04:00 (America/New_York)
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Local HEAD / observed deployed source: `e31b744` (`Rebuild restoration PPC landing page for full-program positioning`); `origin/main` matches HEAD.
- Previous baseline: [`2026-08-20-production-regression.md`](2026-08-20-production-regression.md)
- Canonry technical comparison: prior `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`; latest completed read `8341b64b-100f-49d8-8835-e8c27a91f446`.
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Netlify did not expose a stable build/deployment identifier in the checked headers. A representative response exposed `Server: Netlify`, `Cache-Status: {"Netlify Edge"; hit; ttl=31535553}`, `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT`, and request ID `01M0JCM709B5YKHV9BJ4B3HKBS`; the source/live match is therefore recorded against commit `e31b744`, not claimed as a provider build ID.
- Operator mutations not performed: deployment, CDN purge, Canonry sweep/probe/discovery, GSC/Bing sync or indexing submission, sitemap submission, connector/configuration changes, and substantive source/content changes.

## Outcome

The prior deployment/stale-artifact regression is resolved in live production. The four SEO-004 pages now serve the page-specific titles and descriptions present in the local build, the deployed PPC intent links are present, and the full checked live signal set matches the local build across all 95 live sitemap URLs.

No new meaningful SEO/AEO production regression was found. The live sitemap remains 95 URLs, all 95 return HTTP 200 and pass the checked metadata, canonical, heading, JSON-LD, entity, and indexability checks. The local build has 96 sitemap URLs because the untracked local `/resources/water-damage-restoration-marketing/` post is not live; this remains a separate publication decision, not a reproduced live defect.

Search and AI visibility impact is not yet measurable. Stored GSC data was last inspected/synced on 2026-08-17, and the latest Canonry visibility comparison is non-comparable because it contrasts a 42-query surface with a prior 12-query surface. No outcome is claimed from those stored reads.

## Baseline comparison

Compared with [`2026-08-20-production-regression.md`](2026-08-20-production-regression.md):

- Resolved: live metadata parity on `/water-damage-restoration/ppc/`, `/services/retargeting/`, `/services/web-design/`, and `/services/social-media-marketing/`. Live now matches the reviewed `abf7b7f` changes included in current HEAD `e31b744`.
- Resolved/reconfirmed: `/thank-you/` remains HTTP 200, `noindex, nofollow`, and absent from the live sitemap.
- New deployed route: `/restoration-marketing/` returns HTTP 200, `noindex, nofollow`, and is absent from the live sitemap; its local build output matches live on the checked signal set.
- Stable: live sitemap remains 95 unique URLs with 95 `<lastmod>` values; local `dist` contains 96 URLs, with only `/resources/water-damage-restoration-marketing/` local-only.
- Stable: live technical surface remains 95/95 successful pages, 97 unique same-origin internal HTML targets with 0 broken targets and 0 redirects, and a consistent primary LocalBusiness entity.
- Stable: normal and `CanonryBot/1.0` bodies remain byte-identical on 12 representative routes, including the four SEO-004 pages, `/restoration-marketing/`, `/thank-you/`, `/schedule/`, and `/contact/`.
- Canonry technical audit advanced from the prior stored audit `5b21a8cd-089c-44e6-adbc-a6d679aacb5a` to `8341b64b-100f-49d8-8835-e8c27a91f446`, with the same 89/100 score and 0 errors; this is a stable audit result, not a regression.

## Live production verification

### Sitemap, indexability, metadata, and entity signals

- `https://remediationrestorationmarketing.com/sitemap-index.xml`: HTTP 200, `application/xml`.
- `https://remediationrestorationmarketing.com/sitemap-0.xml`: HTTP 200, `application/xml`; 95 unique URLs and 95 `<lastmod>` values.
- All 95 sitemap URLs returned HTTP 200.
- All 95 sitemap URLs had a title, meta description, exactly one self-referencing canonical, exactly one H1, and parseable JSON-LD.
- All 95 sitemap URLs exposed the same primary LocalBusiness entity: `@id` `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`, URL `https://remediationrestorationmarketing.com`.
- No sitemap-listed page exposed a `noindex` directive.
- `/thank-you/` and `/restoration-marketing/` both returned HTTP 200 with `noindex, nofollow` and were absent from the live sitemap.
- Representative current metadata:

| URL | Live title | Live description | Status |
| --- | --- | --- | --- |
| `/water-damage-restoration/ppc/` | `Water Damage Restoration PPC & LSA Campaigns | R&R Marketing` | Water damage restoration PPC and Local Service Ads campaigns built to capture urgent calls, control lead costs, and support qualified booked jobs. |
| `/services/retargeting/` | `Retargeting for Restoration Companies | R&R Marketing` | Re-engage qualified restoration website visitors with practical retargeting campaigns that keep your company visible while they compare options. |
| `/services/web-design/` | `Web Design for Restoration Companies | R&R Marketing` | Restoration web design built to help urgent visitors find the right service, trust your team, and contact you quickly from any device. |
| `/services/social-media-marketing/` | `Social Media Management for Restoration Companies | R&R Marketing` | Social media management for restoration companies that turns project proof, team expertise, and local updates into a consistent trust-building program. |

### Internal links, redirects, and response behavior

- 97 unique same-origin HTML targets were discovered from the 95 sitemap pages; all returned HTTP 200 with no broken targets and no redirects.
- `/services/ppc/` links contextually to `/water-damage-restoration/ppc/`; the specialist PPC page links back to `/services/ppc/`.
- `http://remediationrestorationmarketing.com/` → canonical HTTPS non-`www`, HTTP 301.
- `https://www.remediationrestorationmarketing.com/` → canonical HTTPS non-`www`, HTTP 301.
- `/sitemap.xml` → `/sitemap-index.xml`, HTTP 301.
- Deliberately nonexistent URL returned HTTP 404.
- Representative HTML responses had no `X-Robots-Tag` header; indexability was controlled by the expected page-level meta directives.
- Netlify response behavior remained cache-served with `public, must-revalidate, max-age=0`; no deployment identifier was exposed.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, the sitemap index, and the child sitemap all returned HTTP 200.
- `robots.txt` declares the sitemap, allows the checked GPTBot, OAI-SearchBot, PerplexityBot, and ClaudeBot groups, blocks CCBot, and contains `Content-Signal: search=yes, ai-input=yes, ai-train=no`.
- Direct Markdown alternates returned HTTP 200 `text/markdown` for `/index.md`, `/services/ppc/index.md`, `/water-damage-restoration/ppc/index.md`, `/resources/index.md`, `/schedule/index.md`, and `/restoration-marketing/index.md`.
- `Accept: text/markdown` on representative HTML routes still returns HTML; this is the known content-negotiation behavior, while the advertised Markdown endpoints are healthy.
- Normal and `CanonryBot/1.0` bodies were byte-identical on all 12 checked representative routes.

## Local build and production/source parity

- `npm run build` passed on current HEAD. It built 101 Astro pages, generated a 96-URL local sitemap, and ran `scripts/postbuild-aeo.mjs` through the package script.
- Independent `node scripts/postbuild-aeo.mjs` passed.
- Local/live signal comparison using HTML parsing found 0 mismatches across the 95 live sitemap URLs for title, description, canonical, H1 count, robots meta, JSON-LD count, and primary entity.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, and sitemap-index artifacts matched after CRLF/LF normalization. The child sitemap differs only because local contains the one untracked blog URL absent from live.
- Existing non-blocking build warnings remain: stale Browserslist data, SVG `clip-rule` normalization messages, and the duplicate SVG id `Star-1` warning. They did not fail the build or postbuild AEO validator.
- No source/content files were changed by this check. Existing worktree changes were preserved.

## Canonry and integration evidence

### Technical AEO

- Read command: `cnry technical-aeo score remediation-restoration-marketing --format json`.
- Latest completed audit: `8341b64b-100f-49d8-8835-e8c27a91f446`, completed 2026-08-20 18:19 UTC, score 89/100, 97 pages discovered/audited, 0 skipped, 0 errored, delta 0 from the prior 89/100 audit.
- AI access files, schema validity/completeness, entity consistency, snippet eligibility, technical SEO, and AI crawler access remain passing in the stored audit. Content extractability remains the only partial cross-cutting factor; this was not treated as a production regression because live/source parity and technical checks pass.

### Google and Bing indexing

- Read-only Canonry GSC coverage remains 52 indexed / 47 not indexed / 0 deindexed across 99 stored URLs, last inspected 2026-08-17 19:29 UTC and last synced 2026-08-17 19:25 UTC.
- Reconciled to the current 95-URL live sitemap, the stored states remain 25 `Submitted and indexed`, 25 `Crawled - currently not indexed`, and 45 `URL is unknown to Google`; four stored URLs are outside the live sitemap (`/tos/`, `/privacy/`, obsolete `/water-damage-restoration/`, and intended-exclusion `/admin/`).
- All four SEO-004 target URLs remain stored as `Submitted and indexed` and `INDEXING_ALLOWED`.
- `cnry google deindexed` returned no stored deindexed rows.
- Bing connection and site access are healthy, but the stored Bing coverage is only a limited 10-URL sample; it is not a full-site coverage result. No Bing inspection or sync was run.

### AI visibility and mention/citation regression status

- The latest completed visibility run remains `595fca88-de9d-474e-8854-f7319346e0b5` from 2026-08-10; the fixed-basket run `14ee1d3c-8670-4a3a-9138-d36105e15a77` remains cancelled and is not comparable.
- Pooled `cnry visibility-stats --last-runs 5 --by-provider` remains 3 completed visibility runs / 162 snapshots through 2026-08-10: 68 mentioned (41.98%) and 11 cited (6.79%). Provider totals: Claude 26/54 mentioned and 2/54 cited; Gemini 20/54 and 5/54; OpenAI 22/54 and 4/54.
- The current overview surface reads 27/42 queries mentioned (Mention Coverage 64), 4/42 cited (Citation Coverage 10), and Mention Share 64 (49 of 76 brand mentions). Its movement view compares the 42-query surface with a prior 12-query surface (`comparable=false`, `querySetChanged=true`), so its gained/lost query list is not valid evidence of a regression.
- Aero regression guidance requires a comparable query/provider transition and treats mention as primary and citation as secondary. No current AI mention or citation regression is declared.

### Canonry Doctor

- GSC and Bing auth/property access are healthy.
- Read-only warnings remain for missing GSC sitemap-write scope, no GA4 connection, no server-side traffic source, no backlink source, and low winnability classification coverage.
- GBP OAuth remains unconfigured. These are integration limitations, not reproduced live-page defects.

## Findings and classification

### 1. Prior deployment/stale-artifact regression resolved; measurement now due

Problem → Live previously served stale metadata on four indexed commercial pages; the intervention is now deployed and production parity is restored.

Evidence → The 2026-08-21 live crawl found 95/95 healthy sitemap pages, 0 local/live signal mismatches across those pages, current page-specific metadata on all four SEO-004 URLs, deployed PPC contextual links, and a stable 89/100 Canonry audit with 0 errors.

Expected impact → Establish a trustworthy post-deployment window for snippet CTR, query position, and later AEO comparison.

Recommended change → No additional content, schema, indexing, deployment, or CDN action in this check. Start the comparable 28-day GSC measurement window for the deployed `e31b744` artifact; keep the local-only blog publication decision separate.

Effort → Low for measurement; separate operator decision for the blog post.

Confidence → High that the production parity defect is resolved; not yet measurable for search/AEO outcome.

Verification method → Compare query-page CTR, clicks, impressions, and position against the stored 2026-07-12 to 2026-08-07 baseline over a comparable post-deployment window; repeat live parity and later use an operator-approved fixed-basket Canonry sweep. Measurement due 2026-09-18.

Classification → Resolved deployment/stale-artifact defect; now Measuring under SEO-001 and SEO-004.

### 2. Stored index coverage remains an opportunity, not a reproduced production defect

Problem → Stored GSC coverage has 47 not-indexed URLs, but the data is dated 2026-08-17 and includes URLs outside the current live sitemap.

Evidence → Live pages are indexable and sitemap-clean; no deindexed rows were returned; all four SEO-004 URLs are stored indexed. Bing coverage is limited and not full-site.

Expected impact → A future current inspection could identify eligible pages for indexing prioritization.

Recommended change → Keep SEO-002 as the read-only indexing baseline. Obtain explicit operator approval before GSC/Bing sync, inspection, sitemap submission, or indexing requests. Do not rewrite content or alter indexability to compensate for stale coverage buckets.

Effort → Medium, operator-dependent.

Confidence → High for stored URL-level evidence; Medium for current index status.

Verification method → Fresh URL-level GSC/Bing inspection reconciled to the current 95-URL sitemap and intended exclusions.

Classification → Indexing/measurement opportunity, not a confirmed production regression.

### 3. AI visibility regression remains unassessable from comparable data

Problem → The latest completed visibility data is stale, and the latest 42-query movement view is non-comparable with the previous 12-query surface.

Evidence → Three completed visibility runs / 162 pooled snapshots through 2026-08-10; cancelled fixed-basket run `14ee1d3c-8670-4a3a-9138-d36105e15a77`; `comparable=false` and `querySetChanged=true` in the current overview.

Expected impact → Avoids a false regression escalation and preserves separate Mention Coverage/Share and Citation Coverage denominators.

Recommended change → Keep SEO-003 as Measuring and obtain operator confirmation before one real fixed-basket visibility sweep. Do not infer an AEO outcome from the current overview movement list.

Effort → Low operator time / quota-consuming.

Confidence → High that no comparable regression claim is currently supportable.

Verification method → Completed sweep ID, unchanged query basket, provider set, Mention Coverage, Mention Share, Citation Coverage, and query-level evidence compared with the last valid baseline.

Classification → Measurement pending; no AI mention/citation regression declared.

## Backlog reconciliation

- SEO-001 remains the stable parity item and moves from `In Progress` to `Measuring`; the stale live artifact is resolved, observed against source commit `e31b744`, with measurement due 2026-09-18.
- SEO-002 remains `Measuring`; the 2026-08-17 read-only GSC reconciliation is unchanged and no indexing mutation was performed.
- SEO-003 remains `Measuring`; no comparable visibility sweep was run and no mention/citation regression is claimed.
- SEO-004 moves from `In Progress` to `Measuring`; the four page-specific metadata changes are live-verified against the stored pre-change GSC baseline, with measurement due 2026-09-18.
- SEO-005 moves to `Measuring`; the generic/specialist PPC contextual links are live-verified and the full internal-link crawl is clean, with measurement due 2026-09-18.
- No duplicate backlog IDs were created. No substantive code/content change was made.

## Commands and verification status

- Repository read checks: `git status --short`, `git log`, `git show`, source inspection, local artifact inspection.
- Local/build verification: `npm run build` passed; independent `node scripts/postbuild-aeo.mjs` passed.
- Live verification: read-only Node/Fetch/Cheerio checks completed for sitemap membership, HTTP status, titles/descriptions, canonical URLs, headings, JSON-LD/entity consistency, meta/X-Robots indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, Markdown alternates, crawler parity, `/thank-you/`, `/restoration-marketing/`, canonical-host behavior, headers, and 404 behavior.
- Canonry read/checks: `cnry technical-aeo score`, `cnry technical-aeo trend`, `cnry google coverage`, `cnry google deindexed`, `cnry bing status`, `cnry bing coverage`, `cnry runs`, `cnry visibility-stats`, `cnry overview`, `cnry analytics --feature gaps`, `cnry doctor`, and scalar `cnry get` reads.
- Production/source/build parity: PASS for all checked page SEO signals and AI access artifacts after line-ending normalization; child sitemap differs only by the local-only blog URL.
- Current production regression status: CLEAN for the broad live technical surface; prior deployment/stale-artifact regression RESOLVED; post-deployment search/AEO measurement PENDING.
- No deployment, CDN purge, indexing submission, sitemap submission, GSC/Bing sync, Canonry sweep/probe/discovery, or connector mutation was performed.

## Pending operator-confirmed actions

1. Begin the comparable post-deployment GSC measurement window for SEO-001/SEO-004/SEO-005; measurement due 2026-09-18.
2. Decide separately whether to publish `/resources/water-damage-restoration-marketing/`; it is local-only and intentionally not treated as a live regression.
3. Separately authorize a fresh fixed-basket Canonry visibility sweep and/or current GSC/Bing inspection if current measurement is required; neither was run here.
