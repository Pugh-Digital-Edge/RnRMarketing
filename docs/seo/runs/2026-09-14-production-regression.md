# SEO/AEO Production Regression Check — 2026-09-14

- Run time: 2026-09-14T10:30:20-04:00 (2026-09-14T14:30:20Z).
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `858a02d9b1bc45ef275c137fad7495a68fa6d6bc` (`858a02d`), `Refine site functionality and presentation`.
- Previous known-good baseline: [`2026-09-11-production-regression.md`](2026-09-11-production-regression.md), which verified the 98-URL live artifact after the final September 10 deployment.
- Guidance used: installed Canonry and Aero skills, Aero `regression-playbook.md` and `orchestration.md`, Canonry CLI/indexing guidance, and the repository SEO operating records.

## Outcome

No meaningful live SEO/AEO regression was found. The current HEAD includes broad functionality and presentation changes, so recently affected routes were checked explicitly. The live 98-URL sitemap, internal HTML surface, indexability/metadata/schema signals, AI-access artifacts, crawler behavior, and local/build parity remain healthy.

No deployment, CDN purge, Canonry sweep/probe/audit/discovery, GSC/Bing sync or inspection mutation, sitemap submission, indexing request, or substantive SEO/content change was run.

## Baseline comparison

Compared with the 2026-09-11 98-URL baseline:

- Stable: live sitemap index and child sitemap return HTTP 200 and contain 98 unique URLs.
- Stable: 98/98 sitemap pages return HTTP 200 and pass title, meta description, absolute self-canonical, exactly one H1, parseable JSON-LD, the primary `LocalBusiness` entity `https://remediationrestorationmarketing.com/#localbusiness`, and indexability checks.
- Stable: parsed `LocalBusiness.priceRange` remains `$$` on representative live output; the prior 98-page schema-parity correction remains intact.
- Stable: the filtered same-origin HTML crawl found 200 unique targets; all 200 return HTTP 200 with 0 broken targets and 0 redirects. Script-generated non-navigation `href` values were excluded from this navigation crawl.
- Stable: the SEO-005 PPC contextual link and SEO-008/SEO-009 fire-guide links remain present once in their expected live source routes.
- Stable: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `noindex, nofollow` and remain absent from the sitemap.
- Stable: robots, `llms.txt`, `llms-full.txt`, sitemap index, and child sitemap return HTTP 200 and match the current local build after normalization.

## Live production verification

### Metadata, indexability, schema, and entity

- 98/98 sitemap pages passed HTTP, title, description, self-canonical, one-H1, JSON-LD, shared `LocalBusiness` entity, and indexability checks.
- Entity consistency is stable: all checked pages use `https://remediationrestorationmarketing.com/#localbusiness` and `Remediation & Restoration Marketing`.
- Recently affected `/`, `/contact/`, `/schedule/`, `/services/`, `/services/seo/`, `/services/ppc/`, `/services/web-design/`, `/services/social-media-advertising/`, `/services/social-media-marketing/`, `/services/retargeting/`, `/services/lead-tracking/`, `/services/reputation-management/`, and representative industry/service pages retain the expected titles, descriptions, H1s, visible output, links, and schema signals.

### Internal links, redirects, and response behavior

- 200/200 filtered same-origin HTML targets returned HTTP 200; broken targets 0; redirects 0.
- HTTP apex and HTTPS `www` each return HTTP 301 to the HTTPS apex.
- `/sitemap.xml` returns HTTP 301 to `/sitemap-index.xml`.
- A deliberately nonexistent `/definitely-not-found-20260914/` returns HTTP 404.

### Robots, sitemap, and AI access

- Robots allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot; blocks CCBot; includes `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and points to the sitemap index.
- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all 98 advertised Markdown alternates are available from production; all 98 alternates return HTTP 200 with `text/markdown`. Local/live AI-access artifacts match after normalization.

### Normal/crawler parity and deployment headers

- Twelve representative normal and `CanonryBot/1.0` response bodies are byte-identical, including the homepage, contact, schedule, services, PPC, SEO, two article URLs, social-advertising, and both noindex exclusions.
- Netlify exposes per-request IDs (for example `01M2G50J2YJF0WJ1FHB6Z9K4YV`) but no stable hosting deployment/build ID. The recurring `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT` value is not treated as a build identifier.

## Local build and source/live parity

- `npm run build` passed on `858a02d`: Astro built 103 pages and generated a 98-URL sitemap; bundled `scripts/postbuild-aeo.mjs` completed successfully.
- `npm test` passed: 16 tests passed, 0 failed.
- Existing SVG attribute, duplicate SVG-ID, and other non-blocking build warnings remain; no new blocking build failure occurred.
- The current local sitemap contains the same 98 URLs as production. Normalized title, description, canonical, H1 count, robots, JSON-LD presence, and primary-entity comparison found 0/98 mismatches.
- Affected-route visible-output comparison found no meaningful content drift; the only extraction difference was the live `/admin/` string inside the existing Netlify Identity login script, not a rendered anchor or sitemap URL.

## Canonry evidence

- Runtime preflight: Node `v24.18.0`; Canonry `4.179.2`; project reads available.
- Project doctor: 5 checks OK, 4 warnings, 1 known failure, and 24 skipped. GSC and Bing access are valid. The GBP connection failure, missing GSC sitemap-write scope, absent GA4/traffic/backlink sources, and 21% winnability coverage are data/integration limitations, not live production defects.
- Technical AEO: stored audit `638de6d0-fea9-4ad4-996a-fb1f2bd320bb` remains 90/100, audited 2026-09-10, with 100 pages discovered/audited, 0 skipped, and 0 errored. Content Extractability remains the only partial factor; no audit was rerun.
- Google coverage: direct stored read remains 53 indexed / 47 not indexed / 0 deindexed across 100 stored URLs; last inspection 2026-08-27 and last sync 2026-08-24. `cnry google deindexed` is empty. SEO-009 and SEO-010 remain absent from the stored provider sample, so their current provider states are unavailable, not zero.
- Bing coverage: stored sample remains 37 indexed / 1 unknown / 0 known not-indexed across 38 inspections, last inspected 2026-08-27.
- AI visibility, mention first: the latest comparable completed run remains the 2026-09-10 confirmation: 6/42 Mention Coverage, 7/33 non-brand Mention Share, and 3/42 Citation Coverage. The last-three-run pooled read is 61 mentions and 13 citations across 378 checks. No fresh sweep or probe was run.
- Canonry overview currently renders an inconsistent cached index headline of 52/100 while the direct `google coverage` read is 53/100. This is recorded as a Canonry read/cache discrepancy; it is not evidence of a live indexing regression and no value is coerced or used as current full-site coverage.

## Findings and classification

### No confirmed production regression

**Problem** → None found across the current 98-URL sitemap, 200-target internal HTML graph, recently affected routes, metadata/indexability/schema/entity signals, AI-access files, redirect behavior, crawler parity, or normalized source/build/live parity.

**Evidence** → 98/98 sitemap pages passed; 200/200 filtered HTML targets returned HTTP 200 without redirects; 12/12 normal/crawler bodies match; expected intervention links remain present; robots, llms files, sitemaps, noindex exclusions, canonical redirects, 404 behavior, and local/live SEO-signal parity passed. Local build and tests passed.

**Expected impact** → The current production artifact remains technically eligible for organic and AI crawling. The `858a02d` functionality/presentation changes do not introduce a detected SEO regression.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, CDN, or configuration change from this check. Keep the verified artifact stable through the existing measurement windows.

**Effort** → None for regression remediation.

**Confidence** → High for the checked production surface; medium for future search/AEO outcomes because provider freshness and outcome windows remain limited.

**Verification method** → Repeat the same live sitemap/internal-link/parity checks after SEO-impacting deployments; use comparable GSC windows and separately authorized Canonry runs, reporting Mention Coverage/Share separately from Citation Coverage.

**Classification** → No confirmed source-code regression, deployment/stale-artifact defect, configuration defect, indexing loss, or content regression.

### Stored provider/read limitation — SEO-002

**Problem** → Stored Google/Bing coverage remains stale and does not fully represent the current live 98-URL sitemap.

**Evidence** → Direct Google coverage is 53/47/0 across 100 stored URLs last inspected August 27; Bing is 37/1/0 across 38 inspections last inspected August 27; SEO-009 and SEO-010 are absent. Canonry overview displays a conflicting cached 52/100 headline.

**Expected impact** → Current provider states for the two recent article URLs and the complete current sitemap remain unavailable; no indexing loss is evidenced by this production check.

**Recommended change** → Keep SEO-002 Measuring and preserve the approved bounded URL-level recheck no earlier than 2026-09-25. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the direct stored samples; medium for whole-site provider coverage.

**Verification method** → Repeat the same bounded URL-level inspection set and compare exact URL verdicts; reconcile the overview/direct-read discrepancy before quoting a headline.

## Backlog reconciliation

- Updated existing SEO-001 evidence for HEAD `858a02d`; it remains `Measuring` with no confirmed regression.
- Updated existing SEO-002 evidence for the unchanged stale Google/Bing samples and the Canonry overview/direct-read discrepancy; it remains `Measuring` with the 2026-09-25 approval gate.
- SEO-003 remains `Measuring`; the 2026-09-10 unchanged-basket confirmation remains the latest valid visibility baseline, with no fresh sweep run.
- SEO-004 remains `Measuring`; its 2026-09-18 measurement gate is unchanged.
- SEO-005 and SEO-007 remain `Measuring` through 2026-09-24; their deployed artifacts remain stable.
- SEO-006 remains `Measuring` through 2026-09-21; its article remains live and technically valid without a new outcome claim.
- SEO-008 remains `Measuring` through 2026-10-08; the contextual link remains live.
- SEO-009 remains `Measuring` through 2026-09-29; its current provider state and outcome remain unavailable.
- SEO-010 remains `Measuring` through 2026-10-06; its current provider state and outcome remain unavailable.
- SEO-011 remains `Measuring` through 2026-10-09; the concurrent weekly-opportunity run already reconciled that intervention and this check found no parity regression.
- No duplicate backlog IDs were created.

## Commands and results

- Control-plane reads: `AGENTS.md`, SEO README/strategy/backlog/learnings, recent SEO runs, and automation memory, including the concurrent 2026-09-14 weekly-opportunity run.
- Skill/reference reads: Canonry and Aero skills, Aero regression playbook/orchestration, Canonry CLI/indexing guidance, and context-mode guidance.
- Repository reads: `git status`, recent commit history, and HEAD change summary.
- Local verification: `npm run build` passed; `scripts/postbuild-aeo.mjs` passed within the build; `npm test` passed 16/16.
- Canonry read-only checks: runtime/version, project doctor, `technical-aeo score`, `google coverage`, `google deindexed`, `bing status`, `bing coverage`, `overview`, and last-three-run visibility stats.
- Live verification: read-only fetch checks covered sitemap membership, 98 page statuses, metadata, canonicals, H1 counts, JSON-LD/entity signals, internal links, redirects, robots, llms files, Markdown alternates, normal/crawler parity, excluded routes, 404 behavior, and expected intervention links.
- No external mutation or quota-consuming operation was run.

## Verification status and limitations

- **Live production:** complete for the current 98-URL sitemap, 200-target filtered internal crawl, metadata/indexability/schema/entity signals, redirects, robots, AI-access files, all 98 advertised Markdown alternates, crawler parity, excluded routes, and 404 behavior.
- **Local/build:** complete; 103 pages built, 98-URL sitemap generated, postbuild AEO validation passed, and 16/16 tests passed. Existing warnings are non-blocking.
- **Source/live/build parity:** complete for the checked SEO signal set and affected route visible output; 0/98 normalized SEO-signal mismatches and exact normalized AI-access/sitemap artifacts.
- **Canonry:** technical audit current through 2026-09-10; Google/Bing URL inspection current only through 2026-08-27; AI visibility current through the 2026-09-10 completed confirmation run.
- **Unavailable/not claimed:** current provider verdicts for SEO-009/SEO-010, current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, current backlink data, stable hosting build ID, and causal search/AEO impact of the 858a02d changes.
- **Pending operator-confirmed actions:** preserve the production artifact; retain SEO-002's bounded indexing recheck on or after 2026-09-25 and the existing SEO-003/004/005/006/007/008/009/010/011 measurement gates. Do not treat live availability or build parity as ranking, traffic, mention, citation, or conversion outcome evidence.
