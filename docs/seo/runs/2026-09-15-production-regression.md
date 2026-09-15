# SEO/AEO Production Regression Check — 2026-09-15

- Run time: 2026-09-15T11:30:19-04:00 (2026-09-15T15:30:19Z).
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Site: `https://remediationrestorationmarketing.com/`.
- Canonry project: `remediation-restoration-marketing`.
- Repository HEAD: `d5db10d10854b5d9b1c76b0dc869f47a318fb7d8` (`d5db10d`), `Reconcile SEO backlog and add mold guide candidate`.
- Previous known-good baseline: [`2026-09-14-production-regression.md`](2026-09-14-production-regression.md), which verified the 98-URL live artifact.
- Guidance used: installed Canonry and Aero skills, Aero regression playbook/orchestration, Canonry CLI/indexing guidance, and the project SEO operating records.

## Outcome

No meaningful live SEO/AEO regression was found. Production expanded from 98 to 99 sitemap URLs and now serves the SEO-012 mold-remediation marketing guide. The new page and all existing checked pages remain technically eligible, with clean live/build parity.

The 2026-09-14 article implementation record said the mold guide had not yet been committed or pushed because of the unrelated Astro type-check failure. The current repository is now at `d5db10d` on `origin/main`, includes the article and cover, and the live site serves the expected URL. This is recorded as a newly accepted production checkpoint for SEO-012, not as a search or AEO outcome.

No Canonry sweep, probe, technical audit, discovery, provider sync, URL inspection mutation, sitemap/indexing submission, deployment, CDN purge, connector mutation, or substantive change was performed by this check.

## Baseline comparison

Compared with the 2026-09-14 98-URL baseline:

- Sitemap index and child sitemap remain HTTP 200; the child contains 99 unique URLs.
- All prior 98 URLs remain present and healthy; `/resources/mold-remediation-marketing/` is the one new production URL.
- 99/99 sitemap pages returned HTTP 200 and passed non-empty title and description, one H1, one absolute self-canonical, parseable JSON-LD, the shared `LocalBusiness` entity `https://remediationrestorationmarketing.com/#localbusiness`, and indexability checks.
- The new article returns HTTP 200, is sitemap-listed and indexable, has one H1, `BlogPosting` and `FAQPage` schema within the shared entity graph, and links once to `/industries/mold-remediation/`.
- The SEO-005 PPC link, SEO-008 fire-guide link, and SEO-009 fire-guide-to-LSA link each remain present once.
- `/thank-you/` and `/restoration-marketing/` remain HTTP 200 with `noindex, nofollow` and remain absent from the sitemap.

## Live production verification

### Metadata, indexability, schema, and entity

- 99/99 sitemap pages passed the page-signal checks; failure count was 0.
- All checked pages retained the shared `Remediation & Restoration Marketing` LocalBusiness entity and self-canonical behavior.
- Representative homepage, contact, schedule, services, SEO, PPC, web-design, social, retargeting, water-damage article, and noindex routes remained healthy.

### Internal links, redirects, and response behavior

- The filtered crawl found 202 same-origin HTML candidates. One is the POST-only `/.netlify/functions/submit-lead` form action, which returns the expected GET `405`; the other 201 navigation targets returned HTTP 200, with 0 broken navigation targets and 0 redirects.
- `http://remediationrestorationmarketing.com/` and `https://www.remediationrestorationmarketing.com/` each return HTTP 301 to the HTTPS apex.
- `/sitemap.xml` returns HTTP 301 to `/sitemap-index.xml`.
- `/definitely-not-found-20260915/` returns HTTP 404.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all 99 advertised Markdown alternates returned HTTP 200; every alternate returned `text/markdown`.
- Robots allows GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, `anthropic-ai`, Google-Extended, and Bingbot; blocks CCBot; advertises `Content-Signal: search=yes, ai-input=yes, ai-train=no`; and points to the sitemap index.

### Normal/crawler parity and deployment headers

- Twelve representative normal and `CanonryBot/1.0` response bodies were byte-identical, including the homepage, contact, schedule, services, PPC, SEO, two article URLs, social-advertising, and both noindex routes.
- Netlify exposes request IDs (representative current ID: `01M2JTECDYD65NCM63V416YEAH`) but no stable hosting deployment/build ID. `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT` is stale/non-identifying and was not used as a build identifier.

## Local build and source/live parity

- `npm run build` passed on `d5db10d`; Astro built 104 pages and generated a 99-URL sitemap, including `scripts/postbuild-aeo.mjs`.
- `npm test` passed: 16 tests passed, 0 failed.
- `npx astro check` still reports 11 errors in the pre-existing `src/components/starwind/Accordion.astro` wrapper and no article-specific diagnostic. This remains a repository validation limitation, not a live SEO regression; the production-safe build and tests pass.
- Local/live page SEO signal comparison found 0/99 mismatches across title, description presence, H1 count, canonical, JSON-LD, entity, and robots signals.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap-index.xml`, and `sitemap-0.xml` match after line-ending normalization.
- The expected intervention links are present in live output: SEO-005 count 1, SEO-008 count 1, SEO-009 count 1, and SEO-012’s mold-hub link count 1.

## Canonry evidence

- Runtime preflight: Node `v24.18.0`; Canonry `4.179.2`; project reads available; global doctor 5 OK, 0 warnings, 0 failures, 2 skipped.
- Project doctor: GSC and Bing access pass; the GBP connection failure, missing GSC sitemap-write scope, absent GA4/traffic/backlink sources, and 21% winnability coverage are integration/data limitations, not live defects.
- Technical AEO: stored audit `638de6d0-fea9-4ad4-996a-fb1f2bd320bb` remains 90/100, completed 2026-09-10, with 100 pages discovered/audited, 0 skipped, and 0 errored. Content Extractability remains the only partial factor. No audit was rerun.
- Google coverage: direct stored read remains 53 indexed / 47 not indexed / 0 deindexed across 100 stored URLs; last inspection 2026-08-27 and last sync 2026-08-24. `cnry google deindexed` returned empty. The new SEO-012 URL is absent from stored provider samples, so its current Google state is unavailable, not zero.
- Bing coverage: stored sample remains 37 indexed / 1 unknown / 0 known not-indexed across 38 inspections, last inspected 2026-08-27. The new URL is not represented, so its current Bing state is unavailable.
- AI visibility, mention first: the latest completed comparable run remains `dc0e5f1c-7708-4edc-90be-47474349f809` from 2026-09-10: 6/42 Mention Coverage, 7/33 non-brand Mention Share, and 3/42 Citation Coverage. The last-three-run stored pool is 61 mentions and 13 citations across 378 checks. No fresh sweep or probe was run, and no current AI outcome is claimed.
- Canonry overview continues to show a cached 52/100 index headline while direct coverage reads 53/100. This discrepancy is recorded as a read/cache limitation, not as an indexing regression.

## Findings and classification

### No confirmed production regression

**Problem** → None found across the current 99-URL sitemap, 201 non-form navigation targets, recently affected routes, metadata/indexability/schema/entity signals, AI-access artifacts, redirects, crawler parity, or normalized source/build/live parity.

**Evidence** → 99/99 sitemap pages passed; 201 navigation targets returned 200 with 0 broken targets and 0 redirects; the one form endpoint returned the expected GET 405; 12/12 normal/crawler bodies matched; all advertised Markdown alternates returned 200; local/build/live signals matched 0/99.

**Expected impact** → The deployed artifact remains crawlable and eligible for organic and AI retrieval. The SEO-012 publication did not introduce a detected technical, deployment, configuration, indexing, or content regression.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, CDN, or configuration change from this check. Hold the verified 99-URL artifact stable through the existing measurement windows.

**Effort** → None for regression remediation.

**Confidence** → High for the checked live/build surface; medium for future search/AEO outcomes because provider freshness and outcome windows remain limited.

**Verification method** → Repeat the same live sitemap, internal-link, parity, crawler, and AI-access checks after SEO-impacting deployments; use the approved bounded indexing recheck no earlier than 2026-09-25 and later separately authorized visibility checks, reporting Mention Coverage/Share separately from Citation Coverage.

**Classification** → No confirmed source-code regression, deployment/stale-artifact defect, configuration defect, indexing loss, or content regression.

### SEO-012 production checkpoint — not an outcome claim

**Problem** → The previously drafted mold-remediation marketing guide needed a verified live checkpoint before measurement could begin.

**Evidence** → Current `d5db10d` contains the article and cover; live `/resources/mold-remediation-marketing/` is HTTP 200, sitemap-listed, indexable, one-H1, schema-valid, entity-consistent, and linked to the commercial mold hub. Local/build/live SEO signals match. Stored Google/Bing samples do not include the URL.

**Expected impact** → Establish the intended informational resource and internal-link path for the `mold remediation marketing` opportunity. No ranking, indexing, traffic, mention, citation, lead, or revenue result is claimed.

**Recommended change** → Keep SEO-012 stable and begin its measurement window from the accepted 2026-09-15 live checkpoint. Do not rewrite or submit/index-request the page from this verification alone.

**Effort** → Low for measurement; any additional change requires evidence.

**Confidence** → High for live availability and parity; medium for organic/AEO impact.

**Verification method** → Compare exact GSC query/page results after 28 days (due 2026-10-13) and use a later separately authorized fixed-basket Canonry check for Mention Coverage/Share and Citation Coverage.

## Backlog reconciliation

- Updated the control-plane pointer and `Last reconciled` date in `docs/seo/backlog.md`.
- SEO-001 remains Measuring; appended the clean 99-page/201-target parity checkpoint.
- SEO-002 remains Measuring; stored Google/Bing data remains stale relative to the 99-URL live sitemap, and the 2026-09-25 bounded recheck remains gated.
- SEO-003 through SEO-011 remain Measuring with their existing approval and measurement windows; no outcomes were inferred from this check.
- SEO-012 moved from In Progress to Measuring after production acceptance on 2026-09-15. Deployment commit is `d5db10d10854b5d9b1c76b0dc869f47a318fb7d8`; measurement due date is 2026-10-13. No duplicate ID was created.
- `docs/seo/learnings.md` was not promoted because no intervention has a completed comparable outcome window.

## Commands and results

- Control-plane reads: `AGENTS.md`, SEO README/strategy/backlog/learnings, recent SEO runs, automation memory, and the latest weekly opportunity/article implementation records.
- Skill/reference reads: Canonry and Aero skills, Aero regression-playbook/orchestration, Canonry CLI/indexing guidance, and context-mode guidance.
- Repository reads: `git status`, `git log`, current HEAD, and article/backlog state.
- Local verification: `npm run build` passed; bundled postbuild AEO validation passed; `npm test` passed 16/16; `npx astro check` retained 11 unrelated errors.
- Canonry read-only checks: runtime/version, global/project doctor, overview, technical score, Google coverage/deindexed, Bing status/coverage, and last-three-run visibility stats.
- Live verification: sitemap membership, 99 page statuses, metadata, canonicals, H1 counts, JSON-LD/entity signals, internal links, redirects, robots, llms files, 99 Markdown alternates, normal/crawler parity, excluded routes, and 404 behavior.
- No external mutation, quota-consuming operation, deployment, or CDN purge was run.

## Verification status and limitations

- **Live production:** complete for the current 99-URL sitemap, 201 non-form navigation targets, metadata/indexability/schema/entity signals, redirects, robots, AI-access files, 99 Markdown alternates, crawler parity, excluded routes, and 404 behavior.
- **Local/build:** complete for the build, postbuild, tests, 104 generated pages, and 99-URL sitemap. Existing SVG optimizer warnings remain non-blocking.
- **Source/live/build parity:** complete for the checked SEO signal set and artifacts; 0/99 signal mismatches and exact normalized AI-access/sitemap artifacts.
- **Canonry:** technical audit current through 2026-09-10; Google/Bing URL inspection current only through 2026-08-27; AI visibility current through the 2026-09-10 completed run.
- **Unavailable/not claimed:** current Google/Bing verdicts for SEO-012 and the full 99-URL sitemap, current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, current backlink data, stable hosting build ID, and causal search/AEO impact.
- **Pending operator-confirmed actions:** keep the production artifact stable; retain SEO-002’s bounded indexing recheck on or after 2026-09-25 and all existing measurement gates. Do not treat live availability or build parity as ranking, traffic, mention, citation, or conversion outcome evidence.
