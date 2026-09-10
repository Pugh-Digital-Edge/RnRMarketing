# SEO/AEO Production Regression Check — 2026-09-10

- Run time: 2026-09-10T10:52:01-04:00 (2026-09-10T14:52:01Z).
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `1d945c31ac71a3adfd4c46caef56946c29023a5f` (`1d945c3`), `Fix responsive contact and form field layouts`.
- Previous known-good baseline: [`2026-09-08-production-regression.md`](2026-09-08-production-regression.md), which verified 98 live sitemap URLs.
- Guidance used: installed Canonry and Aero skills, Aero `regression-playbook.md`, Canonry AEO/indexing guidance, and the repository SEO operating records. Mention evidence was read before citation evidence; no fresh visibility sweep, probe, audit, discovery, sync, or indexing mutation was run.

## Outcome

No meaningful live SEO/AEO regression was found. The post-baseline commit changes responsive form layout CSS only. The live `/contact/` route serves successfully, the SEO signal set remains aligned with the local build, and the previously verified 98-URL production surface remains stable.

## Baseline comparison

Compared with the 2026-09-08 98-URL baseline:

- Stable: live and local child sitemaps contain the same 98 unique URLs.
- Stable: 98/98 sitemap pages return HTTP 200 and pass title, description, absolute self-canonical, exactly one H1, parseable JSON-LD, consistent `LocalBusiness` entity, and indexability checks.
- Stable: 100 unique anchor-discovered same-origin HTML targets return HTTP 200 with zero broken targets and zero redirects. The separate Netlify form endpoint returns 405 to an intentional GET and is a POST-only form action, not a broken HTML navigation target.
- Stable: 98/98 advertised Markdown alternates return HTTP 200 with `text/markdown`.
- Stable: 15 representative normal and `CanonryBot/1.0` response bodies are byte-identical, including `/contact/`, SEO-004 service pages, SEO-005 PPC pages, SEO-009, and SEO-010.
- Stable: the SEO-005 PPC-to-specialist link, SEO-009 fire-guide-to-LSA link, and SEO-010 fire-guide-to-agency link each occur once in live output.
- Stable: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `noindex, nofollow` and remain absent from the sitemap.

## Live production verification

### Sitemap, metadata, indexability, and entity signals

- `/sitemap-index.xml`: HTTP 200; points to the child sitemap.
- `/sitemap-0.xml`: HTTP 200; 98 unique URLs.
- Sitemap pages: 98/98 HTTP 200; missing titles 0; missing descriptions 0; bad canonicals 0; pages with H1 count other than one 0; pages without parseable JSON-LD 0; pages with inconsistent primary entity 0; sitemap pages marked `noindex` 0.
- Entity consistency: all 98 pages include the primary `LocalBusiness` entity `https://remediationrestorationmarketing.com/#localbusiness`, named `Remediation & Restoration Marketing`.
- Recently affected `/contact/`: HTTP 200 with stable title, description, self-canonical, one H1, JSON-LD, and indexability signals. Its live CSS includes the current form-grid layout rules from `1d945c3`.

### Internal links, redirects, and response behavior

- 100 unique same-origin HTML anchor targets were discovered; all returned HTTP 200 with 0 broken targets and 0 redirects.
- Canonical host: HTTP apex and HTTPS `www` return HTTP 301 to the HTTPS apex.
- `/sitemap.xml` returns HTTP 301 to `/sitemap-index.xml`.
- Deliberately nonexistent `/definitely-not-found-20260910/` returns HTTP 404.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all 98 advertised `index.md` alternates return HTTP 200.
- Robots allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot; blocks CCBot; includes `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and points to the sitemap index.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap match after line-ending/trailing-whitespace normalization.

## Local build and source/live parity

- `npm run build` passed on HEAD `1d945c3`: Astro built 103 pages and generated a 98-URL sitemap. Existing Browserslist freshness, SVG attribute, and duplicate SVG-ID warnings remain non-blocking.
- The build includes `scripts/postbuild-aeo.mjs`; the postbuild validator exited successfully.
- Normalized comparison of title, description, canonical, H1 count, JSON-LD validity/entity, and indexability found 0 substantive mismatches across 98/98 live sitemap URLs. Fifteen raw generated descriptions differ only in entity spelling (`&amp;` live versus `&#38;` local); decoded description text is unchanged.
- Local/live sitemap membership and AI-access artifacts match exactly after normalization.
- The current live deployment exposes Netlify request IDs and `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT`, but no stable hosting deployment/build ID. Request IDs and the stale Last-Modified value are not treated as deployment identifiers.

## Canonry evidence

- Runtime preflight: Node `v24.18.0`; Canonry `4.179.2`; configured project/database available. Project doctor passes GSC and Bing access. The known GBP connection failure, missing GSC sitemap-write scope, absent GA4/traffic/backlink sources, and 22% winnability coverage remain integration/data limitations, not live defects.
- Technical AEO: stored audit `8dd953a4-4c60-4527-b6d6-1e68fad32431` remains 88/100 across 98 pages, 0 skipped, 0 errored, completed 2026-08-27; no audit was rerun.
- Google coverage: stored rollup remains 53 indexed / 47 not indexed / 0 deindexed across 100 URLs; last inspection 2026-08-27 and last sync 2026-08-24. SEO-009 and SEO-010 are absent from the stored provider sample, so their current Google states are unavailable, not zero. `cnry google deindexed` returned an empty result.
- Bing coverage: stored sample remains 37 indexed / 1 unknown / 0 known not-indexed across 38 inspections, last inspected 2026-08-27. SEO-009 and SEO-010 are absent from the stored inspection sample.
- AI visibility, mention first: latest completed comparable run remains `30969b56-2bc9-49cc-bba3-4cee92a4e36e` from 2026-08-27, with 5/42 Mention Coverage, 5/29 non-brand Mention Share, and 3/42 Citation Coverage. Pooled stored history is 73 mentions and 15 citations across 288 checks. The 22 lost-mentioned queries versus 2026-08-10 remain point-in-time and unconfirmed for durability; no new sweep or probe was run.
- Current GSC performance, conversions, GA4/AI referrals, server crawler logs, backlink evidence, and current provider verdicts for SEO-009/SEO-010 remain unavailable/not claimed.

## Findings and classification

### No confirmed production regression

**Problem** → None found across the current sitemap, internal-link graph, recently affected `/contact/` output, AI-access artifacts, response behavior, or normalized source/build/live SEO signals.

**Evidence** → 98/98 sitemap pages passed; 100/100 HTML anchor targets returned HTTP 200 without redirects; 15 representative normal/crawler bodies match; SEO-005, SEO-009, and SEO-010 links are present; robots, `llms.txt`, `llms-full.txt`, sitemaps, Markdown alternates, canonical redirects, excluded routes, 404 behavior, and normalized page parity passed.

**Expected impact** → The current production artifact remains technically eligible for organic and AI crawling. The responsive form-layout commit does not introduce a detected SEO regression.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, CDN, or configuration change from this check. Keep the verified artifact stable through the existing measurement windows.

**Effort** → None for regression remediation.

**Confidence** → High for the checked production surface; medium for future search/AEO outcomes because provider and outcome windows remain pending.

**Verification method** → Repeat the same live sitemap/internal-link/parity checks after SEO-impacting deployments; use comparable GSC measurement windows and obtain operator approval before any Canonry confirmation sweep or indexing recheck.

**Classification** → No confirmed source-code, deployment/stale-artifact, configuration, indexing, or content regression.

### Stored indexing limitation — SEO-002

**Problem** → Stored Google/Bing coverage does not fully represent the current 98-URL live sitemap.

**Evidence** → Google covers 100 stored URLs and Bing 38 stored inspections, both last inspected 2026-08-27; SEO-009 and SEO-010 are absent from both samples.

**Expected impact** → Current provider state for the two recent article URLs and the complete current sitemap is unavailable; no indexing loss is evidenced.

**Recommended change** → Keep SEO-002 Measuring and preserve the approved bounded URL-level recheck on or after 2026-09-25. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the stored samples; medium for whole-site provider coverage.

**Verification method** → Repeat the approved URL-level inspection set and compare exact verdicts; do not use the lossy aggregate as a current page verdict.

**Classification** → Indexing opportunity/measurement limitation, not a confirmed production regression.

## Backlog reconciliation

- Updated existing SEO-001 evidence for HEAD `1d945c3`; it remains `Measuring` with no new regression.
- Updated existing SEO-002 evidence for the unchanged stale provider samples; it remains `Measuring` with the 2026-09-25 approval gate.
- SEO-003 remains `Measuring`; no fresh sweep was run and the 2026-08-27 fixed-basket mention decline remains unconfirmed for durability.
- SEO-004 remains `Measuring`; affected service pages remain technically valid and no comparable post-deployment search outcome is available.
- SEO-005 remains `Measuring`; the repaired PPC contextual link remains present through its 2026-09-24 measurement date.
- SEO-006 remains `Measuring`; the water-damage article remains live, indexable, canonical, and sitemap-listed without a new outcome claim.
- SEO-007 remains `Measuring`; the approved social-advertising page remains technically valid without a new outcome claim.
- SEO-008 remains `Candidate` and awaiting approval; no source or live change was made.
- SEO-009 remains `Measuring`; the LSA article remains live, indexable, canonical, and sitemap-listed without a new outcome claim; its 2026-09-29 measurement gate is unchanged.
- SEO-010 remains `Measuring` from the accepted 2026-09-08 production checkpoint; its 2026-10-06 measurement gate is unchanged.
- No duplicate backlog IDs were created.

## Commands and results

- Control-plane reads: `AGENTS.md`, SEO README/strategy/backlog/learnings, automation memory, and recent SEO runs.
- Skill/reference reads: Canonry and Aero skills, Aero regression playbook, Canonry AEO/indexing guidance, and context-mode guidance.
- Runtime/Canonry reads: `node --version`, `cnry --version`, global/project doctor, `cnry technical-aeo score`, `cnry google coverage`, `cnry google deindexed`, `cnry bing status`, `cnry bing coverage`, `cnry visibility-stats --by-provider`, and `cnry overview`.
- Local verification: `npm run build` passed; the bundled `scripts/postbuild-aeo.mjs` exited successfully.
- Live verification: read-only Node/Fetch checks covered sitemap membership, HTTP status, metadata, canonicals, H1 counts, JSON-LD/entity consistency, indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, all advertised Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, 404 behavior, and SEO-005/SEO-009/SEO-010 link presence.
- No deployment, CDN purge, Canonry sweep/probe/discovery/audit, GSC/Bing sync or indexing request, sitemap submission, connector mutation, or substantive SEO/content change was run.

## Verification status and limitations

- **Live production:** complete for the current 98-URL sitemap, 100-target HTML anchor crawl, affected `/contact/` route, metadata/indexability/schema/entity signals, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, 404 behavior, and deployment headers.
- **Local/build:** complete; `npm run build` and the bundled postbuild AEO validator passed. Existing warnings are non-blocking.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts; normalized page parity is 0/98 substantive mismatches and local/live sitemaps are exact. The 15 raw description differences are encoding-only.
- **Canonry:** technical audit current through 2026-08-27; Google URL inspection current through 2026-08-27 with stored sync through 2026-08-24; Bing inspection current through 2026-08-27; visibility outcome data current through the 2026-08-27 completed sweep.
- **Unavailable/not claimed:** current provider verdicts for SEO-009/SEO-010, current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, current backlink data, stable hosting build ID, and causal search/AEO impact of any intervention.
- **Pending operator-confirmed action:** keep approved artifacts stable; authorize the unchanged-basket confirmation sweep only if desired and retain the bounded indexing recheck on or after 2026-09-25. Do not treat live availability or build parity as search/AEO outcome evidence.
