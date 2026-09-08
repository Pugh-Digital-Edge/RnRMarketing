# SEO/AEO Production Regression Check — 2026-09-08

- Run time: 2026-09-08T08:10:25-04:00 (2026-09-08T12:10:25Z).
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `cddf474f060177ede40f2efe273602c4e5255b42` (`cddf474`), after the approved SEO-010 article implementation. Existing worktree documentation changes were preserved.
- Previous known-good baseline: [`2026-09-07-production-regression.md`](2026-09-07-production-regression.md), which verified 97 live sitemap URLs.
- Guidance used: installed Canonry runtime/indexing/AEO guidance and Aero `regression-playbook.md`. Mention evidence was read before citation evidence; no fresh visibility sweep, probe, audit, discovery, sync, or indexing mutation was run.

## Outcome

No meaningful live SEO/AEO regression was found. The approved SEO-010 restoration-agency selection guide is now live and production-verified. Production expanded from 97 to 98 sitemap URLs as expected, and the new article is HTTP 200, sitemap-listed, indexable, self-canonical, one-H1, JSON-LD-valid, and source/build/live parity-matched. The rest of the checked production surface remains healthy.

## Baseline comparison

Compared with the 2026-09-07 97-URL baseline:

- Expected expansion: the sitemap now contains 98 unique URLs, adding `/resources/restoration-marketing-agency-vs-generalist/`; the local build sitemap contains the same 98 URLs.
- Stable: 98/98 sitemap pages return HTTP 200 and pass title, meta description, absolute self-canonical, exactly one H1, parseable JSON-LD, the primary `LocalBusiness` entity `https://remediationrestorationmarketing.com/#localbusiness`, and indexability checks.
- Stable: the internal crawl expanded to 102 same-origin HTML targets with 0 broken targets and 0 redirects.
- Stable: fifteen representative normal and `CanonryBot/1.0` response bodies are byte-identical, including SEO-005 PPC pages, SEO-004 service pages, SEO-009, and SEO-010.
- Stable: the SEO-005 PPC-to-specialist link, SEO-009 fire-guide-to-LSA link, and SEO-010 fire-guide-to-agency link each remain present once in rendered live output.
- Stable: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `noindex, nofollow` and remain absent from the sitemap.

## Live production verification

### Sitemap, metadata, indexability, and entity signals

- `/sitemap-index.xml`: HTTP 200; points to the child sitemap.
- `/sitemap-0.xml`: HTTP 200; 98 unique URLs.
- Sitemap pages: 98/98 HTTP 200; missing titles 0; missing descriptions 0; bad canonicals 0; pages with H1 count other than one 0; invalid JSON-LD pages 0; sitemap pages marked `noindex` 0.
- JSON-LD/entity consistency: all 98 pages expose the primary entity `https://remediationrestorationmarketing.com/#localbusiness`, named `Remediation & Restoration Marketing`.
- SEO-010: title `Restoration Marketing Agency vs. Generalist: How to Choose`; description `Compare a niche restoration marketing agency with a generalist firm using operational fit, channel expertise, lead quality, reporting, and ownership criteria.`; one H1; `BlogPosting`, synchronized `FAQPage`, `LocalBusiness`, `Organization`, `Person`, `WebSite`, `WebPage`, and `BreadcrumbList` signals; self-canonical; sitemap-listed; indexable.

### Internal links, redirects, and response behavior

- 102 unique same-origin HTML targets were discovered; all returned HTTP 200 with 0 broken targets and 0 redirects.
- Canonical host: HTTP apex and HTTPS `www` return HTTP 301 to the HTTPS apex. `/sitemap.xml` continues to redirect to `/sitemap-index.xml`.
- Deliberately nonexistent apex URL `/definitely-not-found-20260908/` returns HTTP 404.
- `/thank-you/` and `/restoration-marketing/` both return `noindex, nofollow`; neither is a sitemap member.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all 98 advertised `index.md` alternates return HTTP 200; Markdown alternates serve `text/markdown` with 0 failures.
- Robots allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot; blocks CCBot; includes `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and points to the sitemap index.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap match after line-ending/trailing-whitespace normalization.

## Local build and source/live parity

- `npm run build` passed on HEAD `cddf474`: Astro built 103 pages and generated a 98-URL sitemap. Existing Browserslist freshness, SVG attribute, and duplicate SVG-ID warnings remain non-blocking.
- Independent `node scripts/postbuild-aeo.mjs` exited successfully.
- Normalized comparison of title, description, canonical, H1 count, JSON-LD validity/entity, and indexability found 0 mismatches across 98/98 live sitemap URLs. Local/live sitemap membership also matches exactly.
- SEO-010 source, local build, and live output agree on URL, metadata, H1, schema signals, FAQ synchronization, author, cover image, and internal-link behavior. No existing page or shared renderer was changed by the SEO-010 source commit.
- The current live deployment exposes Netlify request IDs and `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT`, but no stable hosting deployment/build ID. The source HEAD and live parity establish the artifact contents, not a provider build identifier.

## Canonry evidence

- Runtime preflight: Node `v24.18.0`; Canonry `4.179.2`; configured project/database available. The first read found the local transport unavailable; a read-only `cnry serve` restored the local transport and subsequent reads completed. No external mutation was performed.
- Project doctor: GSC OAuth/property access and Bing connection/site access pass. Known limitations remain missing GSC sitemap-write scope, no GBP OAuth connection, no GA4, no server-side traffic source, no backlink source, and 22% winnability coverage (60/279 cited-surface domains recognized). These are integration/data limitations, not live defects.
- Technical AEO: stored audit `8dd953a4-4c60-4527-b6d6-1e68fad32431` remains 88/100 across 98 pages, 0 skipped, 0 errored, completed 2026-08-27; no audit was rerun.
- Google coverage: stored rollup remains 53 indexed / 47 not indexed / 0 deindexed across 100 URLs; last inspection 2026-08-27 and last sync 2026-08-24. SEO-010 is absent from the stored provider sample, so its current Google state is unavailable, not zero. `cnry google deindexed` returned `[]`.
- Bing coverage: stored sample remains 37 indexed / 1 unknown / 0 known not-indexed across 38 inspections, last inspected 2026-08-27. SEO-010 is absent from the stored inspection sample.
- AI visibility, mention first: latest completed comparable run `30969b56-2bc9-49cc-bba3-4cee92a4e36e` remains 42 queries/126 snapshots from 2026-08-27, with 5/42 Mention Coverage (12%), 5/29 non-brand Mention Share (17%), and 3/42 Citation Coverage (7%). The comparable 2026-08-10 to 2026-08-27 transition still shows 22 lost mentions and 0 gained mentions; citation movement is separate at 3 lost and 2 gained. No new sweep/probe was run, so no durability or causal AEO outcome is claimed.
- GA4/conversions, AI referrals, server crawler logs, fresh provider verdicts for SEO-010, current performance, and current backlink evidence remain unavailable/not claimed.

## Findings and classification

### No confirmed production regression

**Problem** → None found across the current sitemap, internal-link graph, affected URLs, AI-access artifacts, response behavior, or normalized source/build/live SEO signals.

**Evidence** → 98/98 sitemap pages passed; 102/102 internal HTML targets returned HTTP 200 without redirects; SEO-005, SEO-009, and SEO-010 links are present; 15 representative normal/crawler bodies match; robots, `llms.txt`, `llms-full.txt`, sitemaps, Markdown alternates, canonical redirects, excluded routes, 404 behavior, and normalized page parity passed.

**Expected impact** → The current production artifact remains technically eligible for organic and AI crawling, and the newly deployed SEO-010 intervention has cleared the live verification gate.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, CDN, or configuration change from this check. Keep the verified artifact stable through the recorded measurement windows.

**Effort** → None for regression remediation.

**Confidence** → High for the checked production surface; medium for future search/AEO outcomes because provider and outcome windows remain pending.

**Verification method** → Repeat the same live sitemap/internal-link/parity checks after SEO-impacting deployments; use comparable GSC measurement windows and obtain operator approval before any Canonry confirmation sweep or indexing recheck.

**Classification** → No confirmed source-code, deployment/stale-artifact, configuration, indexing, or content regression.

### SEO-010 deployment verification completed

**Problem** → SEO-010 required a live-production checkpoint before its measurement window could begin.

**Evidence** → The article URL returns HTTP 200, is in the 98-URL sitemap, is self-canonical and indexable, has one H1, valid BlogPosting/FAQPage/entity signals, and matches the current local build's normalized signals. The fire-damage guide links to the article once in source/build/live output.

**Expected impact** → Establishes a clean production baseline for the agency-selection guide without claiming rankings, traffic, leads, mentions, citations, or conversions.

**Recommended change** → Hold SEO-010 stable and begin its comparable measurement window from 2026-09-08; do not duplicate, rewrite, request indexing, or run a visibility sweep from this verification alone.

**Effort** → None beyond routine monitoring.

**Confidence** → High for deployment/live parity; medium for eventual organic/AEO impact because no post-publication provider or GSC outcome exists.

**Verification method** → Measure the exact query/page over a comparable 28-day GSC window, then use a separately authorized unchanged-basket Canonry run with Mention Coverage/Share reported separately from Citation Coverage.

**Classification** → Deployment verification complete; measurement pending. Not a regression.

### Stored indexing limitation — SEO-002

**Problem** → Stored Google/Bing coverage does not fully represent the current 98-URL live sitemap.

**Evidence** → Google covers 100 stored URLs and Bing 38 stored inspections, both last inspected 2026-08-27; SEO-010 is absent from both samples.

**Expected impact** → Current provider state for SEO-010 and the complete current sitemap is unavailable; no indexing loss is evidenced.

**Recommended change** → Keep SEO-002 Measuring and preserve the approved bounded URL-level recheck on or after 2026-09-25. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the stored samples; medium for whole-site provider coverage.

**Verification method** → Repeat the approved URL-level inspection set and compare exact verdicts; do not use the lossy aggregate as a current page verdict.

**Classification** → Indexing opportunity/measurement limitation, not a confirmed production regression.

## Backlog reconciliation

- SEO-001 remains `Measuring`; production is clean at 98 sitemap pages and 102 same-origin HTML targets with normalized parity 0/98.
- SEO-002 remains `Measuring`; stored provider coverage is unchanged and incomplete relative to the current live sitemap. No indexing mutation was performed.
- SEO-003 remains `Measuring`; no fresh sweep was run and the 2026-08-27 fixed-basket mention decline remains unconfirmed for durability.
- SEO-004 remains `Measuring`; affected service pages remain technically valid and no comparable post-deployment search outcome is available.
- SEO-005 remains `Measuring`; the repaired PPC contextual link remains present through its 2026-09-24 measurement date.
- SEO-006 remains `Measuring`; the water-damage article remains live, indexable, canonical, and sitemap-listed without a new outcome claim.
- SEO-007 remains `Measuring`; the approved social-advertising page remains technically valid without a new outcome claim.
- SEO-008 remains `Candidate` and awaiting approval; no source or live change was made.
- SEO-009 remains `Measuring`; the LSA article remains live, indexable, canonical, and sitemap-listed without a new outcome claim; its 2026-09-29 measurement gate is unchanged.
- SEO-010 is now `Measuring`; production verification is accepted on 2026-09-08 and its measurement due date is 2026-10-06.
- No duplicate backlog IDs were created.

## Commands and results

- Control-plane reads: `AGENTS.md`, `docs/seo/README.md`, `docs/seo/strategy.md`, `docs/seo/backlog.md`, `docs/seo/learnings.md`, recent SEO run records, and automation memory.
- Skill/reference reads: installed Canonry and Aero skills, Aero regression playbook, Canonry indexing/AEO guidance, and context-mode guidance for large-output checks.
- Canonry read/checks: runtime preflight, project doctor, `cnry technical-aeo score`, `cnry google coverage`, `cnry google deindexed`, `cnry bing status`, `cnry bing coverage`, `cnry visibility-stats`, and `cnry overview`.
- Local verification: `npm run build` passed; independent `node scripts/postbuild-aeo.mjs` exited successfully.
- Live verification: read-only Node/Fetch checks covered sitemap membership, HTTP status, metadata, canonicals, H1 counts, JSON-LD/entity consistency, indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, all advertised Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, 404 behavior, and SEO-005/SEO-009/SEO-010 link and article parity.
- No deployment, CDN purge, Canonry sweep/probe/discovery/audit, GSC/Bing sync or indexing request, sitemap submission, connector mutation, or substantive source/content change was run by this check.

## Verification status and limitations

- **Live production:** complete for the current 98-URL sitemap, 102-target internal crawl, representative metadata/indexability/schema/entity signals, SEO-010 availability, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, 404 behavior, and deployment headers.
- **Local/build:** complete; `npm run build` and `scripts/postbuild-aeo.mjs` passed. Existing warnings are non-blocking.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts; normalized page parity is 0/98 and local/live sitemaps are exact.
- **Canonry:** technical audit current through 2026-08-27; Google URL inspection current through 2026-08-27 with stored sync through 2026-08-24; Bing inspection current through 2026-08-27; visibility outcome data current through the 2026-08-27 completed sweep.
- **Unavailable/not claimed:** current provider verdict for SEO-010, current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, current backlink data, stable hosting build ID, and causal search/AEO impact of any intervention.
- **Pending operator-confirmed action:** keep approved artifacts stable; authorize the unchanged-basket confirmation sweep only if desired and retain the bounded indexing recheck on or after 2026-09-25. Do not treat live availability or build parity as search/AEO outcome evidence.
