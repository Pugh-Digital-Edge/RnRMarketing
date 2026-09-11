# SEO/AEO Production Regression Check — 2026-09-11

- Run time: 2026-09-11T08:07:42-04:00 (2026-09-11T12:07:42Z).
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `7701720d9333b893671dd4682b6d58971bb3eb24` (`7701720`), documentation-only reconciliation commit.
- Previous known-good baseline: [`2026-09-10-production-regression.md`](2026-09-10-production-regression.md), which verified the 98-URL live artifact before the final September 10 backlog deployment.
- Latest known deployment in the control plane: Netlify deploy `6aa2e9136cdb4e00087de203`, commit `84e67eae732ce8b7f5013c863d0e4c5f252e6520`, published 2026-09-10 17:33:35 UTC. The current live response exposes request ID `01M285WM7HNXTFMHY4K9NSX6WN`, but no stable provider build ID.
- Guidance used: installed Canonry and Aero skills, Aero `regression-playbook.md`, Canonry indexing/AEO guidance, and the repository SEO operating records. Mention and citation evidence remain separate; no fresh visibility run was initiated by this check.

## Outcome

No meaningful live SEO/AEO regression was found. The source HEAD contains documentation only after the verified September 10 link and schema-parity work. The current production artifact remains aligned with the local build across the checked SEO signal set, and the 98-URL surface is stable against the September 10 baseline.

## Baseline comparison

Compared with the 2026-09-10 98-URL baseline:

- Stable: live and local child sitemaps contain the same 98 unique URLs.
- Stable: 98/98 sitemap pages return HTTP 200 and pass title, meta description, absolute self-canonical, exactly one H1, parseable JSON-LD, the primary `LocalBusiness` entity `https://remediationrestorationmarketing.com/#localbusiness`, and indexability checks.
- Stable: parsed `LocalBusiness.priceRange` is `$$` on all 98 live pages and all 98 local-build pages, with 0 mismatches.
- Stable: 100 unique same-origin HTML anchor targets return HTTP 200 with zero broken targets and zero redirects.
- Stable: all 98 advertised Markdown alternates return HTTP 200 with `text/markdown`.
- Stable: 15 representative normal and `CanonryBot/1.0` response bodies are byte-identical, including `/contact/`, SEO-005, SEO-008, SEO-009, and SEO-010 routes.
- Stable: SEO-005, SEO-008, SEO-009, and SEO-010 contextual links each occur once in their expected live source route.
- Stable: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `noindex, nofollow` and remain absent from the sitemap.

## Live production verification

### Sitemap, metadata, indexability, and entity signals

- `/sitemap-index.xml`: HTTP 200 and points to the child sitemap.
- `/sitemap-0.xml`: HTTP 200 with 98 unique URLs.
- Sitemap pages: 98/98 HTTP 200; missing titles 0; missing descriptions 0; bad canonicals 0; pages with H1 count other than one 0; invalid JSON-LD pages 0; pages with inconsistent primary entity 0; sitemap pages marked `noindex` 0.
- JSON-LD parity: the complete parsed `LocalBusiness.priceRange` check is `$$` live and local on 98/98 pages with 0 mismatches.

### Internal links, redirects, and response behavior

- 100 unique same-origin HTML targets were discovered; all returned HTTP 200 with 0 broken targets and 0 redirects.
- Canonical host: HTTP apex and HTTPS `www` return HTTP 301 to the HTTPS apex.
- `/sitemap.xml` returns HTTP 301 to `/sitemap-index.xml`.
- Deliberately nonexistent `/definitely-not-found-20260911/` returns HTTP 404.
- `/thank-you/` and `/restoration-marketing/` retain `noindex, nofollow` and are not sitemap members.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all 98 advertised `index.md` alternates return HTTP 200; Markdown alternates have 0 status/type failures.
- Robots continues to allow GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot; blocks CCBot; includes `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and points to the sitemap index.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap match after line-ending/trailing-whitespace normalization.

## Local build and source/live parity

- `npm run build` passed on HEAD `7701720`: Astro built 103 pages and generated a 98-URL sitemap. The build includes `scripts/postbuild-aeo.mjs`, which exited successfully.
- `npm test` passed: 13 tests passed, 0 failed.
- Existing Browserslist freshness, SVG attribute, and duplicate SVG-ID warnings remain non-blocking and unchanged.
- Normalized comparison of title, description, canonical, H1 count, JSON-LD validity/types/entity, indexability, and full parsed `priceRange` found 0 substantive mismatches across 98/98 live sitemap URLs.
- Local/live sitemap membership and AI-access artifacts match exactly after normalization.
- The current source-to-live check is an artifact/parity check, not proof of a hosting build identifier; the live `Last-Modified` remains `Thu, 16 Jul 2026 18:00:00 GMT` and is not used as a deployment ID.

## Canonry evidence

- Runtime preflight: Node `v24.18.0`; Canonry `4.179.2`; configured project/database available. Global doctor passed 5 checks with 0 warnings and 0 failures; project doctor reports the known GBP connection failure, missing GSC sitemap-write scope, absent GA4/traffic/backlink sources, and 21% winnability coverage. These are integration/data limitations, not live production defects.
- Technical AEO: stored audit `638de6d0-fea9-4ad4-996a-fb1f2bd320bb` completed 2026-09-10 at 90/100 across 100 pages, 0 skipped, and 0 errored. The previous 88/100 audit covered 98 pages; the score change is not attributed to this regression check or to the link/schema intervention because the audited inventory and timing differ.
- Google coverage: stored rollup remains 53 indexed / 47 not indexed / 0 deindexed across 100 URLs; last inspection 2026-08-27 and last sync 2026-08-24. SEO-009 and SEO-010 are absent from the stored provider sample, so their current Google states are unavailable, not zero. `cnry google deindexed` returned an empty result.
- Bing coverage: stored sample remains 37 indexed / 1 unknown / 0 known not-indexed across 38 inspections, last inspected 2026-08-27. SEO-009 and SEO-010 are absent from the stored inspection sample.
- AI visibility, mention first: latest completed comparable run `dc0e5f1c-7708-4edc-90be-47474349f809` completed 2026-09-10 with 6/42 Mention Coverage (14%), 7/33 non-brand Mention Share (21%), and 3/42 Citation Coverage (7%). Compared with 2026-08-27, one query gained a mention, none of the prior mentioned queries lost a mention, and one citation was gained while one was lost. All 22 historical August 10-to-27 lost-mentioned queries remain absent; this is persistence evidence, not a durable causal outcome from the same-day deployment. The run began before the same-day deployment and cannot measure its effect.
- Current GSC performance, conversions, GA4/AI referrals, server crawler logs, backlink evidence, and current provider verdicts for SEO-009/SEO-010 remain unavailable/not claimed.

## Findings and classification

### No confirmed production regression

**Problem** → None found across the current sitemap, internal-link graph, recently changed routes, AI-access artifacts, response behavior, parsed JSON-LD values, or normalized source/build/live SEO signals.

**Evidence** → 98/98 sitemap pages passed; 100/100 internal HTML targets returned HTTP 200 without redirects; `priceRange` is `$$` on 98/98 live and local pages; 15 representative normal/crawler bodies match; SEO-005/008/009/010 links are present once; robots, `llms.txt`, `llms-full.txt`, sitemaps, Markdown alternates, canonical redirects, excluded routes, 404 behavior, and normalized parity passed.

**Expected impact** → The current production artifact remains technically eligible for organic and AI crawling. No source, deployment, configuration, indexing, or content regression was detected.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, CDN, or configuration change from this check. Keep the verified artifact stable through the existing measurement windows.

**Effort** → None for regression remediation.

**Confidence** → High for the checked production surface; medium for future search/AEO outcomes because provider freshness and outcome windows remain limited.

**Verification method** → Repeat the same live sitemap/internal-link/parity checks after SEO-impacting deployments; use comparable GSC measurement windows and separately authorized Canonry runs, reporting Mention Coverage/Share separately from Citation Coverage.

**Classification** → No confirmed source-code regression, deployment/stale-artifact defect, configuration defect, indexing loss, or content regression.

### Stored provider coverage limitation — SEO-002

**Problem** → Stored Google/Bing coverage does not fully represent the current 98-URL live sitemap.

**Evidence** → Google remains 53/47/0 across a 100-URL store last inspected August 27; Bing remains 37 indexed / 1 unknown across 38 inspections last inspected August 27. SEO-009 and SEO-010 are absent from both samples.

**Expected impact** → Current provider states for the two recent article URLs and the complete current sitemap remain unavailable; no indexing loss is evidenced by this check.

**Recommended change** → Keep SEO-002 Measuring and preserve the approved bounded URL-level recheck on or after 2026-09-25. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the stored samples; medium for whole-site provider coverage.

**Verification method** → Repeat the same bounded URL-level inspection set after the approved window and compare exact verdicts; do not use the stale aggregate as a current page verdict.

**Classification** → Indexing opportunity/measurement limitation, not a confirmed production regression.

## Backlog reconciliation

- Updated existing SEO-001 evidence for HEAD `7701720` and the final verified `84e67ea` artifact; it remains `Measuring` with no new regression.
- Updated existing SEO-002 evidence for the unchanged stale provider samples; it remains `Measuring` with the 2026-09-25 operator approval gate.
- SEO-003 remains `Measuring`; the September 10 unchanged-basket confirmation is recorded separately, with persistent mention gaps not treated as a deployment defect.
- SEO-004 remains `Measuring`; no comparable post-deployment search outcome is available before its 2026-09-18 checkpoint.
- SEO-005 remains `Measuring`; the repaired PPC contextual link remains present through its 2026-09-24 measurement date.
- SEO-006 remains `Measuring`; the water-damage article remains live, indexable, canonical, and sitemap-listed without a new outcome claim.
- SEO-007 remains `Measuring`; the approved social-advertising page remains technically valid without a new outcome claim.
- SEO-008 remains `Measuring`; the fire-guide-to-specialist link remains present through its 2026-10-08 measurement checkpoint.
- SEO-009 remains `Measuring`; the LSA article remains live, indexable, canonical, and sitemap-listed without a new outcome claim; its 2026-09-29 measurement gate is unchanged.
- SEO-010 remains `Measuring`; the agency-selection guide remains live, indexable, canonical, and sitemap-listed without a new outcome claim; its 2026-10-06 measurement gate is unchanged.
- No duplicate backlog IDs were created.

## Commands and results

- Control-plane reads: `AGENTS.md`, SEO README/strategy/backlog/learnings, automation memory, and recent SEO runs.
- Skill/reference reads: installed Canonry and Aero skills, Aero regression playbook, Canonry AEO/indexing guidance, and context-mode guidance for large-output checks.
- Runtime/Canonry reads: `node --version`, `cnry --version`, global/project doctor, `cnry technical-aeo score`, `cnry google coverage`, `cnry google deindexed`, `cnry bing status`, `cnry bing coverage`, and `cnry overview`.
- Local verification: `npm run build` passed; the bundled `scripts/postbuild-aeo.mjs` exited successfully; `npm test` passed 13/13.
- Live verification: read-only Node/Fetch checks covered sitemap membership, HTTP status, metadata, canonicals, H1 counts, JSON-LD/entity consistency, complete `priceRange` parity, indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, all advertised Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, 404 behavior, and SEO-005/SEO-008/SEO-009/SEO-010 link presence.
- No deployment, CDN purge, Canonry sweep/probe/discovery/audit, GSC/Bing sync or indexing request, sitemap submission, connector mutation, or substantive SEO/content change was run by this check.

## Verification status and limitations

- **Live production:** complete for the current 98-URL sitemap, 100-target internal crawl, metadata/indexability/schema/entity and parsed priceRange signals, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, 404 behavior, and deployment headers.
- **Local/build:** complete; `npm run build`/postbuild and all 13 tests passed. Existing warnings are non-blocking.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts; normalized page parity is 0/98, full parsed priceRange parity is 0/98 mismatches, and local/live sitemaps are exact.
- **Canonry:** technical audit current through 2026-09-10; Google URL inspection current only through 2026-08-27 with stored sync through 2026-08-24; Bing inspection current only through 2026-08-27; AI visibility outcome data current through the 2026-09-10 completed confirmation run.
- **Unavailable/not claimed:** current provider verdicts for SEO-009/SEO-010, current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, current backlink data, and causal search/AEO impact of the September 10 changes.
- **Pending operator-confirmed action:** keep approved artifacts stable; retain the bounded indexing recheck on or after 2026-09-25. Do not treat live availability, build parity, or the September 10 confirmation sweep as proof of ranking, traffic, lead, mention, citation, or conversion impact.
