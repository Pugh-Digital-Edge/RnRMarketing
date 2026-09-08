# SEO/AEO Production Regression Check — 2026-09-07

- Run time: 2026-09-07T11:28:45-04:00 (2026-09-07T15:28:45Z).
- Run type: closed-loop SEO/AEO production regression and deployment verification.
- Site: `https://remediationrestorationmarketing.com/`.
- Repository HEAD: `75c5c2872b93d23bf4c35548b3c74d0decd81a03` (`75c5c28`); no source or build-input changes since the 2026-09-02 checkpoint. Existing documentation/worktree changes were preserved.
- Required guidance used: Canonry runtime/indexing/AEO guidance and Aero regression-playbook guidance. Mention Coverage was read before Citation Coverage; no fresh visibility sweep, probe, discovery, audit, sync, or indexing mutation was run.

## Outcome

No meaningful live SEO/AEO regression was found. Production remains aligned with the accepted 97-URL baseline and the approved SEO-005/SEO-009 artifacts remain present. The only raw local/live differences found were harmless HTML entity encodings in 15 generated descriptions; normalized signals matched.

## Baseline comparison

Compared with [`2026-09-02-production-regression.md`](2026-09-02-production-regression.md):

- Stable: live and local sitemap child files contain the same 97 URLs.
- Stable: 97/97 sitemap URLs return HTTP 200 and pass title, description, absolute self-canonical, exactly one H1, parseable JSON-LD, the primary `LocalBusiness` entity `https://remediationrestorationmarketing.com/#localbusiness`, and indexability checks.
- Stable: 99 unique same-origin HTML targets return HTTP 200 with zero broken targets and zero redirects.
- Stable: `/services/ppc/` contains the SEO-005 link to `/water-damage-restoration/ppc/` once in source, local build, and live HTML. The SEO-009 fire-damage guide links to the LSA article once in source, local build, and live HTML.
- Stable: `/thank-you/` and `/restoration-marketing/` return HTTP 200 with `noindex, nofollow` and remain absent from the sitemap.
- Stable: no new redirect, configuration, indexing, or deployment discrepancy was observed.

## Live production verification

### Sitemap, indexability, metadata, and entity signals

- `/sitemap-index.xml`: HTTP 200; one child sitemap.
- `/sitemap-0.xml`: HTTP 200; 97 unique URLs.
- Sitemap pages: 97/97 HTTP 200; missing titles 0; missing descriptions 0; bad canonicals 0; pages with H1 count other than one 0; pages without parseable JSON-LD 0; sitemap pages with page-level `noindex` 0; page-level `X-Robots-Tag` exclusions 0.
- JSON-LD/entity consistency: all 97 pages expose `https://remediationrestorationmarketing.com/#localbusiness`, named `Remediation & Restoration Marketing`.
- SEO-009: `/resources/local-services-ads-for-restoration-companies/` remains self-canonical, indexable, one-H1, sitemap-listed, and exposes one `BlogPosting` plus one synchronized `FAQPage` signal.

### Internal links, redirects, and response behavior

- Internal crawl: 99 unique same-origin HTML targets; 0 broken targets and 0 redirects.
- Canonical host: HTTP apex and HTTPS `www` requests return 301 to the HTTPS apex; `/sitemap.xml` returns 301 to `/sitemap-index.xml`.
- Deliberately nonexistent URL `/definitely-not-found-20260907/` returns HTTP 404.
- Fifteen representative routes, including the PPC pages, SEO-004 pages, both article routes, `/schedule/`, `/contact/`, and `/restoration-marketing/`, return HTTP 200 with byte-identical normal and `CanonryBot/1.0` bodies.

### Robots, sitemap, and AI access

- `/robots.txt`, `/llms.txt`, `/llms-full.txt`, sitemap index/child, and all 97 advertised `index.md` alternates return HTTP 200; Markdown alternates serve `text/markdown` and have zero failures/redirects.
- Robots allows the checked GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, anthropic-ai, Google-Extended, and Bingbot groups; CCBot remains blocked. `Content-Signal: search=yes, ai-input=yes, ai-train=no` is present in the robots body.
- Local/live `robots.txt`, `llms.txt`, `llms-full.txt`, `sitemap-index.xml`, and `sitemap-0.xml` match after line-ending/trailing-whitespace normalization.

## Local build and source/live parity

- `npm run build` passed: Astro built 102 pages and generated the 97-URL sitemap. Existing Browserslist freshness, SVG attribute, and duplicate SVG-ID warnings remain non-blocking.
- Independent `node scripts/postbuild-aeo.mjs` passed.
- Normalized comparison of title, description, canonical, H1 count, JSON-LD validity/entity, indexability, and internal-link sets found 0 substantive mismatches across 97/97 live sitemap URLs. Fifteen raw description strings differ only in entity spelling (`&amp;` live versus `&#38;` local); decoded text is identical.
- Current Netlify responses expose request IDs and `Last-Modified: Thu, 16 Jul 2026 18:00:00 GMT`, but no stable provider deployment/build ID. Request IDs are not treated as deployment identifiers.

## Canonry evidence

- Runtime preflight: Node `v24.18.0`; Canonry `4.179.2`; project `remediation-restoration-marketing` and configured database available. The first doctor call found the local transport unavailable; the read-only server check found port 4100 already in use, and subsequent project-scoped reads completed against the active server.
- Project doctor: GSC OAuth/property access and Bing connection/site access pass. Known limitations remain: read-only GSC sitemap-write scope, no GBP OAuth connection, no GA4, no server-side traffic, no backlink source, and 22% winnability coverage (60/279 cited-surface domains recognized). These are integration/data limitations, not live regressions.
- Technical AEO: stored audit `8dd953a4-4c60-4527-b6d6-1e68fad32431` remains 88/100 across 98 pages, 0 skipped, 0 errored, completed 2026-08-27; content extractability remains the only cross-cutting partial factor. No audit was rerun.
- Google coverage: stored rollup remains 53 indexed / 47 not indexed / 0 deindexed across 100 URLs; last inspection 2026-08-27 and last sync 2026-08-24. SEO-009 is absent from the stored provider sample, so its current Google state is unavailable, not zero. `cnry google deindexed` returned `[]`.
- Bing coverage: stored sample remains 37 indexed / 1 unknown across 38 inspections, last inspected 2026-08-27. Bing site access is connected and verified; SEO-009 is absent from the stored inspection sample.
- AI visibility, mention first: latest completed comparable run `30969b56-2bc9-49cc-bba3-4cee92a4e36e` remains 42 queries/126 snapshots from 2026-08-27, with 5/42 Mention Coverage, 5/29 non-brand Mention Share, and 3/42 Citation Coverage. Stored four-run totals are 73 mentioned and 15 cited across 288 checks. The 2026-08-27 decline versus 2026-08-10 remains point-in-time and unconfirmed for durability; no sweep/probe was run.
- Current organic performance, conversions, GA4/AI referrals, crawler logs, backlinks, current SEO-009 provider verdict, and causal search/AEO impact remain unavailable/not claimed.

## Findings and classification

### No confirmed production regression

**Problem** → None found across the current sitemap, internal-link graph, recently affected URLs, AI-access artifacts, response behavior, or normalized source/build/live SEO signals.

**Evidence** → 97/97 sitemap pages passed; 99/99 internal HTML targets returned 200 without redirects; SEO-005 and SEO-009 links are present; 15 representative normal/crawler bodies match; robots, `llms.txt`, `llms-full.txt`, sitemaps, Markdown alternates, canonical redirects, excluded routes, and 404 behavior passed; normalized page parity is 0/97 substantive mismatches.

**Expected impact** → The current production artifact remains technically eligible for organic and AI crawling, and approved interventions remain available for their measurement windows.

**Recommended change** → Make no broad content, schema, indexability, redirect, deployment, CDN, or configuration change from this check. Keep SEO-001 through SEO-009 in their existing states and preserve the production-verified artifact.

**Effort** → None for regression remediation.

**Confidence** → High for the checked production surface; medium for search/AEO outcomes because comparable outcome windows remain pending.

**Verification method** → Repeat the same live sitemap/internal-link/parity checks after SEO-impacting deployments; use approved GSC measurement windows and obtain operator approval before any Canonry confirmation sweep or indexing recheck.

**Classification** → No confirmed source-code, deployment/stale-artifact, configuration, indexing, or content regression.

### Stored indexing limitation — SEO-002

**Problem** → Stored Google/Bing coverage does not fully represent the current 97-URL live sitemap.

**Evidence** → Google covers 100 stored URLs and Bing 38 stored inspections, both last inspected 2026-08-27; SEO-009 is absent from both samples.

**Expected impact** → Current provider state for SEO-009 and the complete current sitemap is unavailable; no indexing loss is evidenced.

**Recommended change** → Keep SEO-002 Measuring and preserve the approved 2026-09-25 bounded URL-level recheck. Any sync, submission, or indexing request remains operator-confirmed work.

**Effort** → Medium.

**Confidence** → High for the stored samples; medium for whole-site provider coverage.

**Verification method** → Repeat the approved URL-level inspection set after the recrawl window and compare exact verdicts; do not use the lossy aggregate as a current page verdict.

**Classification** → Indexing opportunity/measurement limitation, not a confirmed production regression.

## Backlog reconciliation

- SEO-001 remains `Measuring`; the 97-URL/99-target live parity check remains clean.
- SEO-002 remains `Measuring`; stored provider coverage is unchanged and incomplete relative to the current live sitemap. No indexing mutation was performed.
- SEO-003 remains `Measuring`; no fresh sweep was run and the 2026-08-27 fixed-basket mention decline remains unconfirmed for durability.
- SEO-004 remains `Measuring`; affected pages remain technically valid and no comparable post-deployment search outcome is available.
- SEO-005 remains `Measuring`; the repaired PPC contextual link remains present through its 2026-09-24 measurement date.
- SEO-006 remains `Measuring`; the water-damage article remains live, indexable, canonical, and sitemap-listed without a new outcome claim.
- SEO-007 remains `Measuring`; the approved social-advertising page remains technically valid without a new outcome claim.
- SEO-008 remains `Candidate` and awaiting approval; no source or live change was made.
- SEO-009 remains `Measuring`; the article remains production-verified and its 2026-09-29 measurement due date is unchanged.
- No duplicate backlog IDs were created.

## Commands and results

- Control-plane reads: `AGENTS.md`, `docs/seo/README.md`, `docs/seo/strategy.md`, `docs/seo/backlog.md`, `docs/seo/learnings.md`, recent SEO runs, and automation memory.
- Skill/reference reads: installed Canonry and Aero skills, Aero regression playbook, Canonry CLI/indexing/AEO guidance, and context-mode guidance for large-output checks.
- Canonry read/checks: `cnry --version`, project doctor, `cnry technical-aeo score`, `cnry google coverage`, `cnry google deindexed`, `cnry bing status`, `cnry bing coverage`, `cnry visibility-stats`, and `cnry overview`.
- Local verification: `npm run build` and `node scripts/postbuild-aeo.mjs` passed.
- Live verification: read-only Node/Fetch checks covered sitemap membership, HTTP status, metadata, canonicals, H1 counts, JSON-LD/entity consistency, indexability, internal links, redirects, robots, `llms.txt`, `llms-full.txt`, all advertised Markdown alternates, crawler parity, excluded routes, canonical-host behavior, headers, 404 behavior, SEO-005 link presence, and SEO-009 article/link parity.
- No deployment, purge, Canonry sweep/probe/discovery, GSC/Bing sync, indexing request, sitemap submission, connector mutation, or substantive source/content change was run.

## Verification status and limitations

- **Live production:** complete for the current 97-URL sitemap, 99-target internal crawl, representative metadata/indexability/schema/entity signals, SEO-009 availability, redirects, robots, AI-access files, Markdown alternates, crawler parity, excluded routes, and 404 behavior.
- **Local/build:** complete; `npm run build` and `scripts/postbuild-aeo.mjs` passed. Existing warnings are non-blocking.
- **Source/live/build parity:** complete for the checked SEO signal set and AI-access artifacts; normalized page parity is 0/97 substantive mismatches and local/live sitemaps are exact.
- **Canonry:** technical audit current through 2026-08-27; Google URL inspection current through 2026-08-27 with stored sync through 2026-08-24; Bing inspection current through 2026-08-27; visibility outcome data current through the 2026-08-27 completed sweep.
- **Unavailable/not claimed:** current provider verdict for SEO-009, current GSC/Bing performance, GA4 conversions/AI referrals, live crawler logs, current backlink data, stable Netlify build ID, and causal search/AEO impact of any intervention.
- **Pending operator-confirmed action:** keep approved artifacts stable; authorize the unchanged-basket confirmation sweep only if desired and retain the bounded indexing recheck on or after 2026-09-25. Do not treat live availability or build parity as search/AEO outcome evidence.
