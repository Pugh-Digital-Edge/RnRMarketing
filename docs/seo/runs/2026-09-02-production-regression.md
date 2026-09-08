# SEO/AEO Production Regression Check

## Run metadata

- Run time: 2026-09-02T10:25:27-04:00 (2026-09-02T14:25:27Z).
- Live environment: https://remediationrestorationmarketing.com/
- Canonry project: `remediation-restoration-marketing`.
- Current repository: `75c5c2872b93d23bf4c35548b3c74d0decd81a03` (`Record weekly LSA article intervention`), `main`; existing documentation changes were preserved.
- Previous known-good baseline: [`2026-09-01-production-regression.md`](2026-09-01-production-regression.md).
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Guidance used: Canonry runtime, technical/indexing, and AEO guidance plus Aero regression-playbook/orchestration guidance. Mention Coverage was read before Citation Coverage; no fresh visibility sweep was run.
- No deployment, CDN purge, Canonry sweep/probe/discovery, GSC/Bing sync or indexing request, sitemap submission, connector mutation, or substantive source/content change was performed.

## Outcome

No meaningful production regression was found. The live artifact remains stable against the 2026-09-01 baseline: 97/97 sitemap URLs are healthy, 99 internal HTML targets are healthy, representative crawler responses match, and local/build/live SEO signals remain aligned. SEO-009 remains live and in measurement; no ranking, traffic, mention, citation, conversion, or indexing outcome is claimed.

## Baseline comparison

Compared with [`2026-09-01-production-regression.md`](2026-09-01-production-regression.md):

- Stable: the live sitemap remains 97 unique URLs, including `/resources/local-services-ads-for-restoration-companies/`.
- Stable: all 97 sitemap pages return HTTP 200 and pass title, meta description, absolute self-canonical, exactly one H1, parseable JSON-LD, consistent `Remediation & Restoration Marketing` `LocalBusiness` entity, and indexability checks.
- Stable: 99 unique same-origin HTML targets return HTTP 200 with zero broken targets and zero redirects.
- Stable: `/services/ppc/` contains the approved followable link to `/water-damage-restoration/ppc/`, and the fire-damage marketing guide links once to the SEO-009 article.
- Stable: `/thank-you/` and `/restoration-marketing/` remain HTTP 200, `noindex, nofollow`, and absent from the sitemap.
- Stable: robots, AI-access files, sitemap index/child, and all advertised Markdown alternates remain available.
- Stable: normal and `CanonryBot/1.0` response bodies are byte-identical on 14 representative routes.

## Live production verification

### Sitemap, indexability, metadata, and entity signals

- `/sitemap-index.xml`: HTTP 200; points to `https://remediationrestorationmarketing.com/sitemap-0.xml`.
- `/sitemap-0.xml`: HTTP 200; 97 unique URLs.
- Sitemap pages: 97/97 HTTP 200; missing titles 0; missing descriptions 0; bad canonicals 0; H1 count other than one 0; invalid JSON-LD pages 0; `noindex` sitemap pages 0; page-level `X-Robots-Tag` noindex pages 0.
- JSON-LD/entity consistency: all 97 sitemap pages expose the same primary entity, named `Remediation & Restoration Marketing`.
- SEO-009 article: title `Local Services Ads for Restoration Companies: How They Work`; description `Learn how Local Services Ads work for restoration companies, from eligibility and service areas to lead handling, ranking inputs, and booked-job tracking.`; canonical `https://remediationrestorationmarketing.com/resources/local-services-ads-for-restoration-companies/`; one H1; valid `BlogPosting`, synchronized `FAQPage`, and `LocalBusiness` signals; indexable.
- Excluded routes: `/thank-you/` and `/restoration-marketing/` are HTTP 200, `noindex, nofollow`, and not sitemap members.

### Internal links, redirects, and response behavior

- 99 unique same-origin HTML targets were discovered from sitemap pages; all returned HTTP 200 with no redirects.
- SEO-005: `/services/ppc/` contains one link to `/water-damage-restoration/ppc/`.
- SEO-009 support: `/resources/fire-damage-restoration-marketing/` contains one link to `/resources/local-services-ads-for-restoration-companies/`.
- Canonical-host behavior: `http://remediationrestorationmarketing.com/`, `https://www.remediationrestorationmarketing.com/`, and `http://www.remediationrestorationmarketing.com/` return HTTP 301 to the canonical HTTPS host; `/sitemap.xml` returns HTTP 301 to `/sitemap-index.xml`.
- Deliberately nonexistent URL `/_production-regression-nonexistent-20260902/` returns HTTP 404.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all 97 advertised Markdown alternates return HTTP 200; the Markdown responses are `text/markdown`.
- Robots allows the checked GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot paths; blocks CCBot; carries `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and points to the sitemap index.
- Live and local `robots.txt`, `llms.txt`, `llms-full.txt`, and sitemap artifacts match after line-ending normalization.

### Crawler and deployment response parity

- Normal and `CanonryBot/1.0` response bodies were byte-identical on `/`, `/services/`, both PPC pages, the four SEO-004 pages, social advertising, resources, both article routes, `/schedule/`, `/contact/`, and `/restoration-marketing/`.
- Representative responses identify Netlify and expose request IDs; `Last-Modified` remains `Thu, 16 Jul 2026 18:00:00 GMT`. No stable Netlify deployment/build ID was exposed, so request IDs are not treated as deployment identifiers. This is a deployment-evidence limitation, not a reproduced page regression.

## Local build and source/live parity

- `npm run build` passed on HEAD `75c5c28`; Astro built 102 pages and generated a 97-URL sitemap. Existing Browserslist, SVG attribute, and duplicate SVG ID warnings remain non-blocking.
- Independent `node scripts/postbuild-aeo.mjs` passed.
- Local and live sitemaps both contain exactly 97 URLs.
- A normalized comparison of title, description, canonical, H1 count, JSON-LD types/validity, `LocalBusiness` entity, indexability, and internal link sets found 0 mismatches across all 97 live sitemap URLs. Equivalent numeric HTML entity encoding was normalized before comparison.
- The current source/build/live artifact remains aligned on the recently affected SEO-009 route and the SEO-005 PPC link.

## Canonry evidence

- Runtime preflight: Node `v24.18.0`; Canonry `4.179.2`; configured project/database available.
- Project doctor generated 2026-09-02T14:14:58Z: 5 checks passed, 4 warnings, 1 pre-existing GBP connection failure, and 24 skipped integration checks. GSC OAuth/property access and Bing connection/site access pass. Warnings/limitations include read-only GSC sitemap scope, no GA4, no server-side traffic, no backlink source, and 22% winnability coverage (60/279 recognized cited-surface domains). These are integration/data limitations, not live defects.
- Technical AEO: stored audit `8dd953a4-4c60-4527-b6d6-1e68fad32431` remains 88/100 across 98 pages, 0 skipped, 0 errored, completed 2026-08-27. The one-point change from 89/100 coincided with expanded audited scope and was not refreshed in this run.
- Google coverage: stored rollup remains 53 indexed / 47 not indexed / 0 deindexed across 100 URLs; last inspection 2026-08-27 and last sync 2026-08-24. The current SEO-009 URL is absent from this stored set, so its provider state is unavailable, not zero.
- Bing coverage: stored sample remains 37 indexed / 1 unknown across 38 inspections, last inspected 2026-08-27; SEO-009 is absent from this stored sample.
- `cnry google deindexed` returned an empty set; `cnry bing status` confirms the configured site is connected and verified.
- AI visibility, mention first: latest completed comparable run `30969b56-2bc9-49cc-bba3-4cee92a4e36e` remains 42 queries/126 snapshots from 2026-08-27, with 5/42 Mention Coverage, 5/29 non-brand Mention Share, and 3/42 Citation Coverage. The 22 lost-mentioned queries versus 2026-08-10 remain point-in-time and unconfirmed for durability under Aero's n=1-per-provider caution. Stored five-run read is 73 mentions / 15 citations across 288 checks; mention and citation remain separate.
- GA4 and server-side traffic are not connected, so current AI-referral, conversion, and crawler-log evidence is unavailable.

## Findings and classification

### No confirmed production regression

**Problem** → None found across the current sitemap, internal-link graph, recently affected URLs, AI-access artifacts, response behavior, or normalized source/build/live SEO signals.

**Evidence** → 97/97 sitemap pages passed; 99/99 internal HTML targets returned 200 without redirects; the approved SEO-005 and SEO-009 links are present; 14 representative normal/crawler bodies match; robots, `llms.txt`, `llms-full.txt`, sitemaps, Markdown alternates, canonical redirects, excluded routes, and 404 behavior passed; normalized local/live parity is 0 mismatches.

**Expected impact** → The current production artifact remains technically eligible for organic and AI crawling, and approved interventions remain available for their measurement windows.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, CDN, or configuration change from this check. Keep SEO-001 through SEO-009 in their existing states and preserve the production-verified artifact.

**Effort** → None for regression remediation.

**Confidence** → High for the checked production surface; medium for search/AEO outcomes because comparable outcome windows remain pending.

**Verification method** → Repeat the same live sitemap/internal-link/parity checks after SEO-impacting deployments; use the approved GSC measurement windows and obtain operator approval before the unchanged-basket Canonry confirmation sweep or indexing recheck.

**Classification** → No confirmed source-code, deployment/stale-artifact, configuration, indexing, or content regression.

### Stored indexing limitation — SEO-002

**Problem** → Stored Google/Bing coverage does not fully represent the current 97-URL live sitemap.

**Evidence** → Google's stored 53/47/0 rollup covers 100 URLs and is last inspected 2026-08-27; Bing's 37/1 sample covers 38 URLs and is last inspected 2026-08-27. SEO-009 is absent from both stored samples.

**Expected impact** → Current provider state for SEO-009 and the complete current sitemap is unavailable; no indexing loss is evidenced.

**Recommended change** → Keep SEO-002 Measuring and preserve the approved 2026-09-25 bounded URL-level recheck. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the stored samples; medium for whole-site provider coverage.

**Verification method** → Repeat the approved URL-level inspection set after the recrawl window and compare exact verdicts; do not use the lossy aggregate as a current page verdict.

**Classification** → Indexing opportunity/measurement limitation, not a confirmed production regression.

## Backlog reconciliation

- **SEO-001** remains `Measuring`; the 97-URL/99-target live parity check remains clean.
- **SEO-002** remains `Measuring`; stored provider coverage is unchanged and incomplete relative to the current live sitemap. No indexing mutation was performed.
- **SEO-003** remains `Measuring`; no fresh sweep was run and the 2026-08-27 fixed-basket mention decline remains unconfirmed for durability.
- **SEO-004** remains `Measuring`; affected pages remain technically valid and no comparable post-deployment search outcome is available.
- **SEO-005** remains `Measuring`; the repaired PPC contextual link remains present through its 2026-09-24 measurement date.
- **SEO-006** remains `Measuring`; the water-damage article remains live, indexable, canonical, and sitemap-listed without a new outcome claim.
- **SEO-007** remains `Measuring`; the approved social-advertising page remains technically valid without a new outcome claim.
- **SEO-008** remains `Candidate` and awaiting approval; no source or live change was made.
- **SEO-009** remains `Measuring`; the article remains production-verified and its 2026-09-29 measurement due date is unchanged.
- No duplicate backlog IDs were created.

## Commands and results

- Control-plane reads: `AGENTS.md`, `docs/seo/README.md`, `docs/seo/strategy.md`, `docs/seo/backlog.md`, `docs/seo/learnings.md`, recent SEO runs including the 2026-09-01 production regression/monthly review, and automation memory.
- Skill/reference reads: installed Canonry and Aero skills, Aero `regression-playbook.md` and `orchestration.md`, Canonry CLI/indexing/AEO guidance, and context-mode guidance for large-output checks.
- Canonry reads/checks: `cnry --version`, project doctor, `cnry overview`, `cnry technical-aeo score`, `cnry technical-aeo trend`, `cnry google coverage`, `cnry google deindexed`, `cnry bing status`, `cnry bing coverage`, `cnry visibility-stats --last-runs 5 --by-provider`, `cnry analytics --feature gaps`, `cnry ga status`, and `cnry traffic status`.
- Local verification: `npm run build` and independent `node scripts/postbuild-aeo.mjs` passed.
- Live verification: read-only Node/Fetch checks covered sitemap membership, HTTP status, metadata, canonicals, H1 counts, JSON-LD/entity consistency, indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, all advertised Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, 404 behavior, SEO-005 link presence, and SEO-009 article/link parity.
- No mutation or quota-consuming operation was run.

## Verification status and limitations

- **Live production:** complete for the current 97-URL sitemap, 99-target internal crawl, representative metadata/indexability/schema/entity signals, SEO-009 availability, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, headers, and 404 behavior.
- **Local/build:** complete; `npm run build` and `scripts/postbuild-aeo.mjs` passed. Existing warnings are non-blocking.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts; normalized page parity is 0/97 mismatches and local/live sitemaps are exact.
- **Canonry:** technical audit current through 2026-08-27; Google URL inspection current through 2026-08-27 with stored sync through 2026-08-24; Bing inspection current through 2026-08-27; visibility outcome data current through the 2026-08-27 completed sweep.
- **Unavailable/not claimed:** current provider verdict for SEO-009, current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, current backlink data, stable Netlify build ID, and causal search/AEO impact of any intervention.
- **Pending operator-confirmed action:** keep approved artifacts stable; authorize the unchanged-basket confirmation sweep on or after 2026-09-04 and bounded indexing recheck on or after 2026-09-25 only if desired. Do not treat live availability or build parity as search/AEO outcome evidence.
