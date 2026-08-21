# SEO/AEO Production Regression Check

## Run metadata

- Run time: 2026-08-20T10:42:28-04:00 (America/New_York)
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Local HEAD: `abf7b7f` (`Improve service page intent and PPC linking`)
- `origin/main`: `ad9e29b`; local HEAD remains one commit ahead
- Comparison reference: [`2026-08-18-production-regression.md`](2026-08-18-production-regression.md), Canonry technical audit `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`
- Run type: closed-loop SEO/AEO production regression check
- Operator mutations not performed: deployment, CDN purge, indexing/sitemap submission, GSC/Bing sync, Canonry sweep/probe, connector/configuration changes, and substantive source/content changes

## Outcome

The production/source parity regression remains open on the four SEO-004 target pages. Live production still serves the pre-`abf7b7f` title and description on all four URLs, while the current local build contains the reviewed page-specific replacements. This is classified as a deployment/stale-artifact defect with SEO measurement impact, not an indexing failure or a reason for another content rewrite.

No broad live technical regression was found. The live sitemap contains 95 URLs and all 95 returned HTTP 200 with titles, descriptions, self-canonicals, exactly one H1, parseable JSON-LD, and the shared primary LocalBusiness entity. The live `/thank-you/` route remains `noindex, nofollow` and is not sitemap-listed. The local build contains 96 sitemap URLs because the untracked local `/resources/water-damage-restoration-marketing/` post is not deployed.

## Baseline comparison

Compared with the 2026-08-18 run:

- The four SEO-004 metadata mismatches are unchanged; no approved deployment has been verified.
- The prior `/thank-you/` mismatch and `/services`/`/resources` trailing-slash redirect issues remain resolved.
- Live sitemap membership remains 95 URLs; local build membership remains 96, with only `/resources/water-damage-restoration-marketing/` local-only.
- The latest completed Canonry technical audit remains 89/100, run `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`, 97 pages audited and zero errors, completed 2026-08-13. It is stored historical evidence, not a fresh audit of today’s 95-page live sitemap.
- Canonry’s latest completed visibility window remains 3 runs / 162 snapshots through 2026-08-10: 68 mentioned (41.98%) and 11 cited (6.79%). The 2026-08-17 fixed-basket run `14ee1d3c-8670-4a3a-9138-d36105e15a77` remains cancelled and non-comparable. No AI mention or citation regression is declared.

## Findings

### 1. Live metadata and local build are still out of parity

Problem → The live artifact has not received the already-committed SEO-004 page-specific metadata changes.

Evidence → Live versus local `dist`:

| URL | Live title | Local title | Difference |
| --- | --- | --- | --- |
| `/water-damage-restoration/ppc/` | `PPC & LSA Campaigns for Water Damage Restoration` | `Water Damage Restoration PPC & LSA Campaigns` | title + description |
| `/services/retargeting/` | `Restoration Retargeting Services` | `Retargeting for Restoration Companies` | title + description |
| `/services/web-design/` | `Restoration Web Design` | `Web Design for Restoration Companies` | title + description |
| `/services/social-media-marketing/` | `Restoration Social Media Marketing` | `Social Media Management for Restoration Companies` | title + description |

The live descriptions remain the prior generic/truncated versions; the local build contains the page-specific descriptions. All four live URLs return 200, are indexable, canonical, one-H1, and JSON-LD-valid. Canonry’s stored GSC inspection marks all four `Submitted and indexed` and `INDEXING_ALLOWED`, ruling out an indexing-loss explanation for this parity finding.

Classification → deployment/stale artifact; related to SEO-001 and SEO-004.

Expected impact → Until deployment is verified, users and search engines receive stale snippets and weaker page-intent signals, and the SEO-004 measurement window must not be treated as post-change.

Recommended change → After operator review, deploy the already-committed `abf7b7f` artifact if approved. Decide separately whether the untracked blog post is ready for publication. Do not rewrite content or expand schema to compensate for the stale artifact.

Effort → Deployment/release verification; no new content implementation identified.

Confidence → High for the parity diagnosis; Medium for eventual CTR/ranking impact.

Verification method → After an approved deployment, compare all four live titles/descriptions and JSON-LD against the local artifact, rerun the full sitemap/internal-link/crawler-parity checks, verify the local-only URL decision, and then start a comparable GSC window.

### 2. Live technical, indexability, and AI-access surface is clean

Problem → No broad production technical regression was reproduced.

Evidence → Live checks on 2026-08-20 found:

- Sitemap index and child sitemap: HTTP 200; 95 unique sitemap URLs; 95/95 page responses HTTP 200.
- All sitemap pages: title, description, self-canonical, one H1, JSON-LD, and the same primary LocalBusiness entity.
- Internal links: 99 unique same-origin HTML targets; 0 broken targets and 0 redirects.
- Normal versus `CanonryBot/1.0`: byte-identical bodies on `/`, `/services/`, `/services/ppc/`, `/services/retargeting/`, `/services/web-design/`, `/services/social-media-marketing/`, `/water-damage-restoration/ppc/`, `/schedule/`, `/contact/`, and `/thank-you/`.
- `/thank-you/`: HTTP 200, meta `noindex, nofollow`, self-canonical, absent from the sitemap.
- `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap: HTTP 200. Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, and sitemap index are equal after line-ending normalization; child sitemap differs only because local contains the one local-only post.
- Advertised Markdown alternates: four representative `/index.md` endpoints returned HTTP 200 `text/markdown`; `Accept: text/markdown` on HTML routes still returns HTML, consistent with prior baseline behavior.
- Canonical host: four direct `www` requests returned stable HTTP 301 to `https://remediationrestorationmarketing.com/`.
- Negative route: a nonexistent path returned HTTP 404.

Classification → no confirmed technical, configuration, redirect, robots, crawler-access, or broken-link regression in the checked live surface.

### 3. Stored indexing data remains an opportunity, not a reproduced live defect

Problem → Stored GSC coverage is broader than the current sitemap and contains eligible URLs not currently indexed.

Evidence → Read-only Canonry coverage inspected/synced 2026-08-17 reports 52 indexed / 47 not indexed / 0 deindexed across 99 stored URLs. Reconciled to the current 95-URL live sitemap, the prior exact distribution remains 25 `Submitted and indexed`, 25 `Crawled - currently not indexed`, and 45 `URL is unknown to Google`; four stored URLs are outside the live sitemap (`/tos/`, `/privacy/`, obsolete `/water-damage-restoration/`, and intended-exclusion `/admin/`). Bing has only a stored 10-URL sample, all indexed, so it is not a full-site coverage result. No fresh sync or inspection was run.

Classification → indexing/measurement opportunity, not a reproduced production regression.

Recommended change → Keep SEO-002 as the read-only baseline. With operator approval, refresh/inspect the current sitemap and prioritize eligible commercial URLs by demand and business value. Keep `/admin/`, `/thank-you/`, and other intended exclusions out of any submission batch.

### 4. AI visibility regression is not assessable from a new comparable window

Canonry `visibility-stats --by-provider` reads the latest completed 3-run/162-snapshot window: Claude 26/54 mentioned and 2/54 cited, Gemini 20/54 and 5/54, OpenAI 22/54 and 4/54. These are stale stored measurements through 2026-08-10, not a current post-deployment comparison. Aero regression guidance requires comparable query/provider samples and treats mention as primary and citation as secondary. The cancelled `14ee1d3c-8670-4a3a-9138-d36105e15a77` run is not a baseline. No sweep, probe, discovery, or provider mutation was run.

## Canonry and integration evidence

- Technical score: 89/100; run `5b21a8cd-089c-44e6-adbc-a6d679aacb5a`; 97 audited; 0 errors; stored 2026-08-13.
- GSC: OAuth/property access healthy; read-only coverage available; sitemap-write scope warning remains. Four affected URLs are stored as indexed and indexing-allowed.
- Bing: auth/site access healthy; stored coverage is limited to 10 URLs, all indexed.
- Doctor: 24 checks, 5 OK, 4 warnings, 1 failure, 14 skipped. The only failure is unconfigured GBP OAuth; warnings include missing GSC sitemap-write scope, no GA4, no backlink source, and low winnability coverage. These are integration/data limitations, not reproduced live-page defects.
- Visibility: 3 completed runs / 162 snapshots; no valid new comparable sweep after the cancelled 2026-08-17 attempt.

## Commands and verification status

### Live verification

- Read-only Node fetch crawl of the live sitemap and 99 internal HTML targets.
- Representative normal/crawler response comparison, redirects, canonical host, 404, robots, sitemap, Markdown alternates, and `/thank-you/` checks.

### Local/build verification

- `npm run build` passed; Astro built 100 pages and `scripts/postbuild-aeo.mjs` completed through the build command. Existing non-blocking Browserslist and duplicate SVG id warnings remain.
- `node scripts/postbuild-aeo.mjs` passed independently with exit code 0.
- Local `dist` contains 96 sitemap URLs; the sole live mismatch is the untracked `/resources/water-damage-restoration-marketing/` post.

### Canonry verification

- `cnry technical-aeo score remediation-restoration-marketing --format json` read the stored 89/100 audit.
- `cnry google coverage remediation-restoration-marketing --format json` read stored 52/47/0 coverage and target URL states.
- `cnry bing coverage remediation-restoration-marketing --format json` read the limited 10/10 sample.
- `cnry visibility-stats remediation-restoration-marketing --by-provider --format json` read the stored three-run window.
- `cnry doctor --project remediation-restoration-marketing --format json` read current integration status; it exited non-zero because GBP is unconfigured, which is recorded as a limitation rather than a site regression.
- `cnry runs remediation-restoration-marketing --format json` confirmed the latest fixed-basket attempt is cancelled and the latest completed visibility data is older.

## Backlog reconciliation

- SEO-001 remains `In Progress`: reconfirmed the four-page deployment/stale-artifact mismatch and local-only sitemap URL; no duplicate created.
- SEO-002 remains `Measuring`: retained the 2026-08-17 URL-level GSC baseline; no indexing or sync action run.
- SEO-003 remains `Measuring`: no comparable fresh visibility window; mention and citation outcomes are not claimed.
- SEO-004 remains `In Progress`: local changes pass build validation, but live deployment and search measurement remain pending.
- SEO-005 remains `In Progress`: live crawl found 99 internal targets with no broken or redirected targets; no new internal-link defect was opened.

## Verification status and pending operator actions

- Status: Regression confirmed as deployment/stale artifact; broad live technical checks clean; indexing and AI visibility outcomes not newly measured.
- Pending operator-confirmed action 1: review and, if approved, deploy `abf7b7f`; decide separately whether to publish the untracked water-damage marketing article.
- Pending operator-confirmed action 2: after deployment, rerun this parity surface and begin comparable GSC measurement for SEO-004.
- Pending operator-confirmed action 3: separately authorize any fresh GSC/Bing inspection or fixed-basket Canonry visibility sweep; none was run here.
