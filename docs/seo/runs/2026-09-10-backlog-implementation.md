# Backlog implementation — 2026-09-10

## Scope and authorization

The operator requested: “are there backlog problems to work? if so, work until they are all implemented.” This authorizes the current backlog's one-link implementation, one unchanged-basket confirmation sweep, deployment, and the applicable verification. It does not turn future measurement windows into completed outcomes or justify score-driven rewrites.

The working tree was initially clean at `4ab5f93`. The current backlog, strategy, learnings, recent production verification, historical plans, source markers, and public GitHub issue list were reviewed. GitHub returned no open issues. The historical July/August audit plans now point to the current backlog instead of presenting stale deployment states and score quotas as new work.

Guidance: Canonry, Aero orchestration and regression playbooks, Impeccable clarification guidance, and rendered browser verification. Context-mode tools were unavailable; larger CLI responses were captured in temporary files and summarized.

## Implemented work

### SEO-008 — Fire-guide contextual link

**Problem →** The fire-damage marketing guide directed its contextual web-design link to the generic service despite an existing indexed specialist page.

**Evidence →** Re-read stored GSC data for July 24–August 22: the exact query `web design for fire damage restoration` has 24 impressions, 0 surfaced clicks, and impression-weighted average position 4.04 on `/fire-damage-restoration/web-design/`. The generic page has 30 impressions, 0 surfaced clicks, and position 28.8. Both source and pre-change live HTML lacked the contextual specialist link. Both affected pages returned HTTP 200 and were indexable.

**Expected impact →** Better intent alignment and contextual discovery of an existing commercial page; ranking and CTR improvement remain hypotheses.

**Recommended change →** Implemented in `64429c1`: the guide now links “fire damage restoration web design service” to `/fire-damage-restoration/web-design/`. Other generic service links, article claims, dates, FAQs, page ownership, and indexability are preserved.

**Effort →** Low.

**Confidence →** High for link correctness; medium for search impact given the small impression sample.

**Verification method →** Build/postbuild validation, parsed local HTML and Markdown text, desktop/mobile browser inspection, native link navigation, production parity, full internal-link crawl, and a relevant Canonry technical recheck. Outcome measurement starts only at the accepted live checkpoint.

### SEO-001 — Literal schema value lost in deployed HTML

**Problem →** A stricter JSON-LD comparison found a previously unrecorded production/source discrepancy: live `LocalBusiness.priceRange` was `$`, while source and the local build specified `$$`.

**Evidence →** Captured pre-change live HTML on both affected routes and compared parsed metadata and JSON-LD against the build. The only difference was `/1/priceRange`; title, description, canonical, H1, robots, and all other parsed JSON-LD fields matched. The cause within hosting is not proven; do not attribute it to a specific Netlify processing feature without further evidence.

**Expected impact →** Preserve the already-authored structured-data value through deployment. No ranking effect is assumed.

**Recommended change →** Implemented in `84e67ea`: encode the two dollar signs as JSON Unicode escapes in the existing inline schema. JSON parsing produces the original `$$` value without altering visible content or adding schema.

**Effort →** Low.

**Confidence →** High: parsed production JSON-LD now preserves the original two-dollar-sign value and matches the local build on all 98 sitemap pages.

**Verification method →** Successful rebuild, parsed local `LocalBusiness.priceRange`, unchanged remaining metadata/schema fields, and post-deployment full-site JSON-LD comparison.

## Verification checkpoint

- Both implementation builds passed: 103 HTML pages, 98 sitemap URLs, successful SEO/AEO postbuild checks.
- Existing test suite: 13 passed, 0 failed.
- Local crawl: 98 sitemap pages and 100 same-origin HTML anchor targets, 0 failures.
- The guide contains exactly one followable specialist link. Its generated Markdown text includes the updated anchor wording; the existing Markdown generator emits plain text rather than preserving hyperlinks.
- Browser checks: link text fits at 1280px and wraps within the 390px viewport without horizontal overflow; native navigation reaches the specialist page with H1 `Web Design for Fire Damage Restoration`; no captured console errors.
- The affected pages' parsed SEO signals match the pre-change production baseline except for the intended `$` → `$$` schema correction.
- Final Netlify deployment: `6aa2e9136cdb4e00087de203`, commit `84e67eae732ce8b7f5013c863d0e4c5f252e6520`, published September 10 at 17:33:35 UTC. The link-only predecessor `64429c1` was published at 17:29:19 UTC in deploy `6aa2e81785e7f400081ea057`.
- Full live crawl started at 17:39:42 UTC: 98/98 sitemap pages and 100/100 unique same-origin HTML anchor targets returned HTTP 200 with no failures. Titles, descriptions, self-canonicals, H1s, robots directives, and all parsed JSON-LD match the local build. Sitemap membership is unchanged.
- Live robots, llms files, both sitemap files, and the updated guide Markdown return HTTP 200 and match the build. Both affected routes serve identical normal/CanonryBot HTML. `/thank-you/` and `/restoration-marketing/` retain `noindex, nofollow` and remain outside the sitemap.
- Production browser review confirms the new contextual link and parsed `priceRange: "$$"`.
- Fresh Canonry audit `638de6d0-fea9-4ad4-996a-fb1f2bd320bb` completed at 17:39:51 UTC: **90/100**, 100 discovered/audited pages, 0 skipped, 0 errored. Prior audit `8dd953a4-4c60-4527-b6d6-1e68fad32431` was 88/100 over 98 pages. Different inventory and elapsed time prevent attributing the two-point change to this intervention. Content extractability remains a partial cross-cutting factor; no score-driven content expansion was made.
- SEO-008's outcome checkpoint is **October 8**, after a comparable 28-day post-verification window. No same-day ranking, CTR, lead, or AEO improvement is claimed.

## SEO-003 — Confirmation sweep

- Pre-run baseline: completed run `30969b56-2bc9-49cc-bba3-4cee92a4e36e` (August 27), 42 queries × 3 providers, Mention Coverage 5/42, non-brand Mention Share 5/29, Citation Coverage 3/42.
- One confirmation run started: `dc0e5f1c-7708-4edc-90be-47474349f809`, September 10 at 17:22:45 UTC. No query-basket, provider, model, location, or schedule configuration was changed.
- Completed at **17:37:00 UTC**, with all 126 query/provider snapshots. Exported query/provider/served-model/location sets exactly match August 27. Only completed runs are used below; partial/cancelled/failed attempts are excluded.

| Measure | August 10 | August 27 | September 10 |
| --- | --- | --- | --- |
| Query-level Mention Coverage | 27/42 | 5/42 | 6/42 |
| Query-level Citation Coverage | 4/42 | 3/42 | 3/42 |
| Non-brand Mention Share | 4/31 | 5/29 | 7/33 |

September 10 provider pairs: Gemini 2 mentions / 3 citations; OpenAI 1 / 1; Claude 4 / 0, each over 42 queries. These pair counts are distinct from query-level coverage. The smaller or larger competitive denominator must not be interpreted as a coverage recovery.

- Gained mention: `book a consultation for restoration website design`; no August 27 mentioned query lost its mention.
- Gained citation: the same website-design consultation query. Lost citation: `monthly retainer costs for restoration marketing services`, which retained its mention.
- All **22** August 10-to-August 27 lost-mentioned queries remain absent. This confirms persistence in another observation, not a statistically established durable trend from only three comparable runs.
- The sweep started before these deployments and finished shortly afterward. It cannot measure the effect of the same-day link/schema changes.

### Bounded commercial-query diagnosis

**Problem →** Persistent mention gaps across commercially relevant queries, with secondary citation gaps. Classification: AEO/source-selection weakness with cause unresolved; no demonstrated broad technical or deployment defect.

**Evidence →** Reviewed the current provider responses for `restoration SEO services`, `digital marketing for restoration companies`, `Google Ads for restoration companies`, and `local SEO for restoration companies`. None mentioned or cited the project. Much of the output explains how restoration operators should market their businesses rather than recommending agencies. The SEO, PPC, and homepage content already cover those services and pass the live checks; stored August 27 Google inspection marks those three owned pages `Submitted and indexed`. That is historical indexing evidence, not a fresh September verdict.

On mention evidence, Claude's restoration-SEO answer names RYNO; many other reviewed rows have no reliable extracted competitor recommendation. The extractor also returns non-company phrases such as “Google Ads campaign structure,” which are not treated as competitors. Citation evidence is separate: answers cite domains such as waterrestorationmarketing.com, clicksgeek.com, spotonsolutions.com, and support.google.com. A cited rival or primary-source site alone does not prove competitor mention-share displacement, a missing page, or a backlink deficit.

**Expected impact →** Avoid additional interventions that would confound the existing page measurements without a supported mechanism.

**Recommended change →** Keep the implemented pages and fixed basket stable. The requested confirmation and bounded diagnosis are complete; no specific additional source-code fix is supported. Assess exact query-page outcomes at the recorded checkpoints before proposing a rewrite, new page, authority outreach, or submission. No messages or outreach were sent.

**Effort →** Low for the completed diagnosis; any later intervention requires its own evidence.

**Confidence →** High in the recorded observations and checked technical health; limited in the causal explanation and future search/AEO effect.

**Verification method →** Completed-run comparison with fixed query/provider/model/location sets, review of the actual answer surfaces, current source/live/audit checks, and the later comparable GSC measurement windows. Stored Google coverage remains 53 indexed / 47 not indexed / 0 deindexed, last inspected August 27; no fresh sync, URL inspection, submission, or indexing request was run.

## Remaining measurement work

| Backlog item | Implementation state / next valid checkpoint |
| --- | --- |
| SEO-001 | Existing parity work implemented; this run adds the schema-value correction and verifies the current artifact. |
| SEO-002 | Existing bounded indexing investigation complete; repeat the accepted 23-URL sample no earlier than September 25. No submission or indexing request is supported by this run. |
| SEO-003 | Authorized confirmation sweep and bounded diagnosis complete; persistent gaps remain an outcome risk, not a demonstrated unimplemented page defect. |
| SEO-004 | Existing content changes implemented; comparison due September 18. No dirty source rewrites existed at the start of this task. |
| SEO-005 | Intent/link repair implemented; comparison due September 24. |
| SEO-006 | Article implemented and previously verified indexed; comparison due September 21. |
| SEO-007 | Snippet/hero alignment implemented; comparison due September 24. |
| SEO-008 | Contextual-link implementation complete; measure a comparable 28-day window after live verification. |
| SEO-009 | LSA guide implemented and live; comparison due September 29. |
| SEO-010 | Agency-selection guide implemented and live; comparison due October 6. |

New editorial topics remain evidence-gated candidates, not approved implementation defects. The deferred outcome reviews do not warrant immediate rewrites of the deployed pages.
