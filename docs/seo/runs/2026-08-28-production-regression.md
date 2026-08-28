# SEO/AEO Production Regression Check

## Run metadata

- Run time: 2026-08-28T11:27:15-04:00 (2026-08-28T15:27:15Z)
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`
- Current repository: `98edc6f` (`Validate and normalize lead phone numbers`), clean worktree, `main` synchronized with `origin/main`.
- Previous known-good baseline: [`2026-08-27-production-regression.md`](2026-08-27-production-regression.md)
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- No deployment, CDN purge, Canonry sweep/probe/discovery, GSC/Bing sync or indexing request, sitemap submission, connector mutation, or substantive SEO/content change was performed.

## Outcome

No meaningful live SEO/AEO production regression was found. The SEO-005 generic-to-specialist PPC contextual link that was missing during the 2026-08-27 source regression is present again in current source, the local production build, and live `/services/ppc/` HTML. The current live artifact remains technically healthy and matches the local build on the checked SEO signal set.

The only Canonry score movement is the stored technical audit changing from 89/100 across 97 pages on 2026-08-20 to 88/100 across 98 pages on 2026-08-27. The added page accounts for the scope change; the audit reports 0 skipped/errored pages and only Content Extractability as a cross-cutting partial factor. This was not treated as a confirmed production regression.

## Baseline comparison

Compared with [`2026-08-27-production-regression.md`](2026-08-27-production-regression.md):

- Stable: the live and local sitemaps both contain 96 unique URLs.
- Stable: 96/96 sitemap URLs return HTTP 200 and pass title, meta description, absolute self-canonical, exactly one H1, parseable JSON-LD, consistent primary LocalBusiness identity, and indexability checks.
- Resolved/holding: the `/services/ppc/` → `/water-damage-restoration/ppc/` contextual link is present in source, local build, and live output.
- Stable: 98 unique same-origin HTML targets return HTTP 200, with zero broken targets and zero internal redirects.
- Stable: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `noindex, nofollow` and are absent from the sitemap.
- Stable: robots, `llms.txt`, `llms-full.txt`, sitemap index/child, and direct Markdown alternates are available; robots allows the checked AI search crawlers, blocks CCBot, and carries `Content-Signal: search=yes, ai-input=yes, ai-train=no`.
- Stable: normal and `CanonryBot/1.0` bodies were byte-identical on 14 representative routes.
- Changed outside the SEO intervention: current HEAD `98edc6f` adds lead-phone form handling. The checked live `/contact/` and `/schedule/` forms expose the same phone-form markers and function action as the local build; no SEO signal mismatch was introduced.

## Live production verification

- Sitemap index and child: HTTP 200; child sitemap has 96 unique URLs.
- Sitemap pages: 96/96 HTTP 200; missing titles 0; missing descriptions 0; bad canonicals 0; pages with H1 count other than one 0; pages without parseable JSON-LD 0; sitemap pages with `noindex` 0; `X-Robots-Tag` page headers 0.
- JSON-LD/entity check: all pages expose the same primary `LocalBusiness` identity `https://remediationrestorationmarketing.com/#localbusiness`, name `Remediation & Restoration Marketing`.
- Internal links: 98 unique same-origin HTML targets; non-200 targets 0; redirects 0.
- SEO-005: live `/services/ppc/` contains a followable link to `/water-damage-restoration/ppc/`; the reverse specialist-to-generic link remains present.
- Canonical-host behavior: `http://remediationrestorationmarketing.com/` and `https://www.remediationrestorationmarketing.com/` return HTTP 301 to `https://remediationrestorationmarketing.com/`; `/sitemap.xml` returns HTTP 301 to `/sitemap-index.xml`.
- Deliberately nonexistent URL `/definitely-not-found-20260828/` returns HTTP 404.
- AI access: `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and six representative Markdown alternates return HTTP 200. Markdown alternates use `text/markdown`.
- Deployment headers: Netlify is the server; representative responses expose `x-nf-request-id` (example `01M14FKWVRTCRPF720H2S4HY4Y`), `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT`, and no stable Netlify deployment/build ID. The request ID is evidence of the response, not a deployment identifier.

## Local build and production/source parity

- `npm run build` passed with exit code 0; Astro built 101 pages and ran `scripts/postbuild-aeo.mjs`.
- Existing non-blocking build warnings remain: stale Browserslist data, SVG attribute normalization, and duplicate SVG id `Star-1`.
- Independent field comparison across all 96 live sitemap URLs: titles 0 mismatches, descriptions 0 meaningful mismatches, canonicals 0, robots directives 0, H1 counts 0, JSON-LD counts 0. The only raw description differences are HTML entity serialization (`&amp;` versus `&#38;`) on 15 generated pages.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap match after CRLF/LF normalization.
- Current `/contact/` and `/schedule/` local/live form markers match for the new lead-phone handler; no SEO-impacting source/live/build parity defect was found.
- No source or content file was changed by this run; the worktree remained clean.

## Canonry and search evidence

### Technical AEO

- Read-only commands: `cnry technical-aeo score remediation-restoration-marketing --format json` and `cnry technical-aeo trend remediation-restoration-marketing --format json`.
- Latest completed audit: `8dd953a4-4c60-4527-b6d6-1e68fad32431`, completed 2026-08-27T18:07:42Z, score 88/100, 98 discovered/audited, 0 skipped, 0 errored; previous audit 89/100 across 97 pages.
- All major technical, schema, entity, snippet, AI-access, and AI-crawler factors pass. Content Extractability remains partial at 58/100 and is the only cross-cutting partial factor; no rewrite is recommended from this audit delta alone.

### Google and Bing indexing

- Stored Google coverage read: 53 indexed / 47 not indexed / 0 deindexed across 100 stored URLs; last URL inspection 2026-08-27T18:12:17Z; last sync 2026-08-24T18:50:29Z. The previous stored rollup was 52/48; the article `/resources/water-damage-restoration-marketing/` is now `Submitted and indexed`.
- The bounded 2026-08-27 sample remains the decision baseline: 14 `Submitted and indexed`, 5 `Crawled - currently not indexed`, and 4 `URL is unknown to Google` among 23 commercially relevant URLs. No current full-site URL verdict is inferred from the stored rollup.
- Stored Bing coverage read: 37 indexed / 0 not indexed / 1 unknown across 38 inspected URLs; last inspected 2026-08-27T18:14:09Z. The article remains the one unknown URL.
- `cnry google deindexed` returns an empty list.
- No fresh sync, sitemap submission, indexing request, or other indexing mutation was run.

### AI visibility and regression status

- Latest completed visibility run remains `30969b56-2bc9-49cc-bba3-4cee92a4e36e`, completed 2026-08-27T18:28:35Z, using the unchanged 42-query/3-provider basket and 126 snapshots.
- Its point-in-time result remains 5/42 Mention Coverage and 3/42 Citation Coverage; the comparable 2026-08-10 baseline was 27/42 mention and 4/42 citation. Aero regression guidance treats this as a measured point-in-time drop requiring confirmation because it is only one observation per provider; no causal production regression is claimed.
- Stored pooled visibility over the latest 4 completed runs is 73 mentioned / 288 checked (25.35%) and 15 cited / 288 (5.21%). Mention and citation remain separate signals.
- The 90-day gap read is tied to run `30969b56-2bc9-49cc-bba3-4cee92a4e36e`: 5 mentioned-query rows, 6 mention-gap rows, 31 not-mentioned rows, 3 cited rows, 36 citation-gap rows, and 3 uncited rows. These are stored AEO opportunity data, not a new live regression.
- No new sweep or probe was run in this check.

### Canonry doctor and integration limitations

- `cnry doctor --project remediation-restoration-marketing --format json` completed as a read/check command but exits nonzero because the project has no GBP OAuth connection. GSC authentication/property access and Bing connection/site access passed.
- Warnings: GSC sitemap-write scope is missing, GA4 is not connected, no server-side traffic source is connected, no backlink source is connected, and content winnability coverage is low (60 of 279 cited-surface domains recognized, 22%). These are data/integration limitations, not reproduced live-page defects.
- No connector or configuration mutation was made.

## Findings and classification

### 1. No confirmed production regression

**Problem** → None found across the current sitemap, internal-link graph, representative affected URLs, AI-access artifacts, response behavior, or SEO signal parity.

**Evidence** → 96/96 sitemap URLs passed HTTP, metadata, canonical, heading, JSON-LD/entity, and indexability checks; 98/98 internal HTML targets returned 200; the SEO-005 link is present; crawler bodies matched normal bodies on 14 routes; robots, AI-access files, Markdown alternates, canonical redirects, 404 behavior, and local/build SEO signals passed.

**Expected impact** → The current live artifact remains technically eligible for organic and AI crawling, and the repaired PPC intent path is available for measurement.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, or CDN change from this check. Keep SEO-005 and the other approved interventions stable through their measurement dates.

**Effort** → None for regression remediation.

**Confidence** → High for the checked production surface; medium for search/AEO outcome because comparable outcome windows are pending.

**Verification method** → Repeat the 96-page/98-target production check after any SEO-impacting deployment; compare the SEO-005 query/page distribution and the approved SEO-004/SEO-007 windows in GSC, and run a later operator-approved fixed-basket Canonry sweep.

**Classification** → No confirmed source-code, deployment/stale-artifact, configuration, indexing, or content regression.

### 2. Stored index opportunity remains, not a production defect

**Problem** → 47 of 100 stored Google URLs remain not indexed, while the current live sitemap is healthy.

**Evidence** → Stored Google coverage is 53/47/0 with all 47 not-indexed rows grouped as `URL is unknown to Google`; the bounded 23-URL sample distinguishes crawled-not-indexed industry hubs from unknown URLs. Live pages are indexable and sitemap-listed where intended.

**Expected impact** → Indexing eligible pages is a prerequisite for organic and AI citation visibility, but the current data does not show a newly introduced live defect.

**Recommended change** → Keep SEO-002 in Measuring. Review the five crawled-not-indexed industry hubs first; do not rewrite healthy indexed service pages or submit excluded routes. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the stored sample; medium for whole-site coverage because only a bounded URL inspection was approved.

**Verification method** → Repeat the same approved URL set after a meaningful recrawl window and compare exact verdicts.

**Classification** → Indexing opportunity/limitation, not a confirmed production regression.

## Backlog reconciliation

- **SEO-001** remains `Measuring`; updated with the clean 2026-08-28 parity recheck, current HEAD `98edc6f`, and the repaired SEO-005 link state.
- **SEO-002** remains `Measuring`; updated from stored Google 52/48 to 53/47 and Bing 37 indexed/1 unknown. No indexing mutation was performed.
- **SEO-003** remains `Measuring`; no new sweep was run and the 2026-08-27 fixed-basket result remains point-in-time pending confirmation.
- **SEO-004**, **SEO-006**, and **SEO-007** remain `Measuring`; no new content or outcome claim was made.
- **SEO-005** remains `Measuring`; the previously missing contextual link is present again in source/build/live, so no new item or duplicate was created.

## Commands and results

- Repository/read checks: `git status --short --branch`, `git rev-parse HEAD`, `git log`, `git diff --name-status 0bc7e2b..HEAD`, source inspection, and local artifact inspection. Clean worktree; HEAD `98edc6f`.
- Local verification: `npm run build` passed; the build included `scripts/postbuild-aeo.mjs`.
- Live verification: read-only Node/Fetch checks covered sitemap membership, HTTP status, titles/descriptions, canonicals, H1 counts, JSON-LD/entity consistency, meta/X-Robots indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, 404 behavior, and SEO-005 link presence.
- Canonry read/checks: `cnry doctor`, `cnry technical-aeo score`, `cnry technical-aeo trend`, `cnry google coverage`, `cnry google deindexed`, `cnry bing status`, `cnry bing coverage`, `cnry runs`, `cnry visibility-stats`, `cnry overview`, and `cnry analytics --feature gaps --window 90d`.
- No mutation or quota-consuming operation was run.

## Verification status and limitations

- **Live production:** complete for the 96-URL sitemap, 98-target internal crawl, representative metadata/indexability/schema/entity signals, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, and 404 behavior.
- **Local/build:** complete; `npm run build` and the postbuild AEO validation passed. Non-blocking warnings are recorded above.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts. The 15 raw description differences are only HTML entity serialization; no meaningful SEO mismatch remains. Live deployment/build ID is unavailable beyond the response-level Netlify request ID.
- **Canonry:** technical audit current through 2026-08-27; Google URL inspection current through 2026-08-27 with stored sync through 2026-08-24; Bing inspection current through 2026-08-27; visibility outcome data current through the 2026-08-27 completed sweep.
- **Unavailable/not claimed:** current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, causal search/AEO impact of the repaired link, and a current full-site Google verdict set.
- **Pending operator-confirmed action:** keep the repaired SEO-005 artifact stable and measure approved interventions; separately authorize any future indexing mutation or fixed-basket visibility sweep.
