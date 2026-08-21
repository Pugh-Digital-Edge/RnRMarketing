# SEO/AEO Production Regression Check

## Run metadata

- Date: 2026-08-18
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Local HEAD: `abf7b7f` (`Improve service page intent and PPC linking`)
- Comparison reference: 2026-08-17 production run and Canonry technical audit `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`
- Run type: closed-loop SEO/AEO production regression check
- Mutations intentionally not performed: deployment, CDN purge, indexing/sitemap submission, GSC/Bing sync, Canonry sweep/probe, or substantive source/content changes

## Outcome

A real production/source parity regression is present on the four SEO-004 service pages. Live production still serves the pre-`abf7b7f` titles and descriptions, while the current local build contains the intended page-specific replacements. This is classified as a deployment/stale-artifact defect, not a content gap requiring another rewrite.

The broader live technical surface remains healthy: 95/95 sitemap URLs returned HTTP 200; all checked pages had titles, descriptions, self-canonicals, exactly one H1, parseable JSON-LD, and the shared primary LocalBusiness entity; 97 unique same-origin HTML targets had zero broken links and zero redirects; normal and `CanonryBot/1.0` responses were byte-identical on ten representative routes. `/thank-you/` remains `noindex, nofollow` and absent from the live sitemap.

## Baseline comparison

Compared with the 2026-08-17 run:

- Live sitemap remains 95 unique URLs; the local build now has 96 sitemap URLs because the untracked local blog post `/resources/water-damage-restoration-marketing/` is not deployed.
- The prior `/thank-you/` mismatch and `/services`/`/resources` trailing-slash redirect issues remain resolved.
- The current local HEAD is one commit ahead of `origin/main` (`abf7b7f` versus `ad9e29b`). Live output matches the prior page metadata, while the local build reflects `abf7b7f`.
- The latest completed Canonry technical audit remains 89/100, 97 pages audited, zero errors, completed 2026-08-13.
- Canonry's current stored visibility overview shows a failed/cancelled latest run and non-comparable query history: the valid baseline remains run `595fca88-de9d-474e-8854-f7319346e0b5` at 27/42 Mention Coverage (64%), 64% Mention Share, and 4/42 Citation Coverage (10%). No AI mention/citation regression is declared.

## Findings

### 1. Source/build versus live metadata regression

Problem → Four committed page-specific SEO changes are not present in live production.

Evidence → Local `dist` versus live production:

| URL | Local build | Live production |
| --- | --- | --- |
| `/water-damage-restoration/ppc/` | `Water Damage Restoration PPC & LSA Campaigns`; complete water-damage PPC description | `PPC & LSA Campaigns for Water Damage Restoration`; description ends `...grow your.` |
| `/services/retargeting/` | `Retargeting for Restoration Companies`; page-specific retargeting description | `Restoration Retargeting Services`; description lists unrelated SEO/PPC/web-design/lead-tracking services |
| `/services/web-design/` | `Web Design for Restoration Companies`; page-specific conversion description | `Restoration Web Design`; generic description |
| `/services/social-media-marketing/` | `Social Media Management for Restoration Companies`; page-specific management description | `Restoration Social Media Marketing`; generic description |

The local build passed `npm run build` (100 Astro pages) and independent `node scripts/postbuild-aeo.mjs` (`POSTBUILD_EXIT=0`). Local `dist/sitemap-0.xml` contains 96 URLs; the sole local-only URL is the untracked blog post above. The live four-page responses remain 200, indexable, canonical, one-H1, and JSON-LD-valid, so this is not a crawlability or markup failure.

Classification → deployment/stale artifact; related to SEO-004, with SEO-001 reopened as `In Progress`.

Expected impact → Until the reviewed changes are deployed, search engines and users receive stale snippets and weaker page-intent signals, and the SEO-004 before/after measurement window cannot start.

Recommended change → Operator review, then deploy the already-committed `abf7b7f` artifact if approved. Treat publication of the untracked blog URL as a separate decision. Do not perform a content rewrite or schema expansion to compensate.

Effort → Deployment/release verification; no new content work identified.

Confidence → High for the parity diagnosis; Medium for eventual CTR/ranking impact.

Verification method → After approved deployment, recheck all four URLs against local `dist`, rerun the full sitemap and internal-link checks, confirm the local-only URL decision, then start a comparable GSC performance window.

### 2. Live technical and AI-access surface remains clean

Problem → No broad technical regression was found.

Evidence → The live sitemap index and child sitemap returned 200; 95/95 sitemap URLs returned 200 with no page-level signal issues; internal-link targets were 97 unique HTML URLs with 0 broken and 0 redirected targets; `robots.txt`, `llms.txt`, `llms-full.txt`, and sitemap files returned 200. Normal and `CanonryBot/1.0` bodies were byte-identical on `/`, `/services/`, `/services/ppc/`, `/services/retargeting/`, `/services/web-design/`, `/services/social-media-marketing/`, `/water-damage-restoration/ppc/`, `/schedule/`, `/contact/`, and `/thank-you/`. Five advertised `/index.md` endpoints returned 200. `robots.txt` allows the checked AI crawlers, blocks CCBot, declares the expected Content-Signal, and references the sitemap.

Classification → no technical regression in the checked production surface.

The `www` host produced one transient 500 in the initial scripted request, but three subsequent requests and direct header checks returned the expected 301 to the canonical non-`www` HTTPS host. It is not classified as a confirmed regression; continue watching response stability.

### 3. Current indexing evidence is an opportunity, not a production defect

Problem → Stored GSC coverage is broader than the live sitemap and contains many not-indexed eligible URLs.

Evidence → Read-only Canonry coverage was inspected/synced 2026-08-17: 52 indexed, 47 not indexed, 0 deindexed across 99 stored URLs. Reconciliation to the current 95-URL live sitemap gives 25 `Submitted and indexed`, 25 `Crawled - currently not indexed`, and 45 `URL is unknown to Google`. The four stored URLs outside the live sitemap are `/tos/`, `/privacy/`, obsolete `/water-damage-restoration/`, and intended-exclusion `/admin/`. Bing has only a limited stored 10-URL sample, all indexed, so it is not a full-site coverage result.

Classification → indexing/measurement opportunity, not a reproduced production regression.

Recommended change → Keep SEO-002 as the read-only baseline. Obtain operator confirmation before any fresh inspection/sync or indexing action; do not change indexability or rewrite content to compensate for coverage buckets.

### 4. AI visibility regression remains unassessable from comparable data

Canonry's latest attempted fixed-basket run `14ee1d3c-8670-4a3a-9138-d36105e15a77` was cancelled. The overview reports movement against a 12-query prior run while the current basket has 42 queries, so `comparable=false` and `querySetChanged=true`. Aero regression guidance requires comparable provider/query samples and treats mention as primary, citation as secondary. No mention or citation regression is declared, and no sweep or probe was run in this check.

## Canonry and integration evidence

- Technical score read: 89/100, run `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`, 97 audited, 0 errors.
- GSC auth/property: healthy; current URL-level read above; no indexing mutation performed.
- Bing auth/site: healthy; coverage read limited to 10 stored URLs, all indexed.
- Doctor: GSC and Bing OK; warnings remain for missing GSC sitemap-write scope, no GA4, no backlink source, and low winnability coverage; GBP OAuth remains unconfigured. These are integration limitations, not reproduced live-page defects.

## Commands and verification status

- Read-only repository checks: `git status`, `git log`, `git show HEAD`, and source/local artifact inspection completed. Existing user worktree changes were preserved.
- Live verification: complete for sitemap membership, HTTP status, indexability, titles/descriptions, headings, canonicals, JSON-LD/entity consistency, internal links, redirects, robots, AI access files, crawler parity, Markdown alternates, `/thank-you/`, canonical-host behavior, and 404 behavior.
- Local/build verification: `npm run build` passed with 100 pages; independent `node scripts/postbuild-aeo.mjs` passed. Existing non-blocking Browserslist/SVG warnings remain.
- Canonry verification: technical score, GSC/Bing coverage, visibility overview, and doctor reads completed; no sweep/probe/sync/submission was run in this check.
- Production/source/build parity: failed for the four SEO-004 page metadata/intent changes and differs by one local-only sitemap URL; passed for robots, `llms.txt`, `llms-full.txt`, sitemap index, and the broad live technical signal set.

## Backlog reconciliation

- SEO-001 reopened from `Validated` to `In Progress` with the current deployment/stale-artifact evidence; no duplicate item created.
- SEO-002 retained as `Measuring` with current 25/25/45 live-sitemap URL-level GSC reconciliation and no mutation.
- SEO-003 retained as `Measuring`; the cancelled 42-query run is not a baseline and no visibility regression is claimed.
- SEO-004 retained as `In Progress`; source/build changes are validated locally, but live deployment and search measurement remain pending.
- SEO-005 retained as `In Progress`; no new internal-link defect was found in the live crawl.

## Pending operator-confirmed actions

1. Review and, if approved, deploy `abf7b7f`; decide separately whether to publish the untracked water-damage marketing article.
2. After deployment, rerun this parity surface and begin comparable GSC measurement for SEO-004.
3. Separately authorize any fresh GSC/Bing inspection or fixed-basket Canonry visibility sweep; none was run here.
