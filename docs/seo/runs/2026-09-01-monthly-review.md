# Monthly SEO/AEO Learning Review — 2026-09-01

## Review scope

- Measurement window reviewed: 2026-07-12 through 2026-09-01, with primary attention to interventions and evidence recorded during 2026-08-01 through 2026-09-01.
- Canonry project: `remediation-restoration-marketing`.
- Review role: monthly measurement and learning review; no visibility sweep, probe, audit, discovery run, account sync, indexing request, sitemap submission, or connected-account mutation was run.
- Comparable outcome gate: no deployed search/content intervention has reached its recorded 28-day measurement due date. Results below therefore distinguish completed operational verification from pending search/AEO outcomes.

## Sources and freshness

- Control documents: `docs/seo/strategy.md`, `docs/seo/backlog.md`, `docs/seo/learnings.md`, and all dated SEO run records from 2026-08-10 through 2026-08-31.
- Canonry stored visibility: latest completed fixed-basket run `30969b56-2bc9-49cc-bba3-4cee92a4e36e`, completed 2026-08-27; 42 queries, three providers, 126 snapshots.
- Canonry technical: audit `8dd953a4-4c60-4527-b6d6-1e68fad32431`, completed 2026-08-27; 98 pages, 0 skipped, 0 errored.
- GSC performance: latest stored report window 2026-07-24 through 2026-08-22. Earlier stored windows overlap it, so they are descriptive and not causal before/after comparisons.
- Google URL inspection: stored whole-site rollup last synced 2026-08-24 and bounded commercial sample inspected 2026-08-27. The bounded sample is the accepted decision baseline because the whole-site grouping loses verdict detail.
- Bing: 38 stored inspections, last recorded in the 2026-08-31 queue; performance has no reliable comparable window.
- Live/source/build: 2026-08-31 production regression record plus a bounded 2026-09-01 production check of the newly published LSA guide.
- GA4, Google Business Profile, server-side traffic, current backlink provider data, and a stable Netlify build ID are unavailable. Missing data is not treated as zero.

## Metric comparison

### AI mention coverage and mention share — primary

| Metric | Comparable baseline | Current stored result | Interpretation |
| --- | --- | --- | --- |
| Mention Coverage | 27/42 (64%) on 2026-08-10 | 5/42 (12%) on 2026-08-27 | 22 lost-mentioned queries and no gains on the unchanged basket. The pairwise result is real, but with only one observation per query/provider at each point it is not yet a durable trend. |
| Mention Share, non-brand | 4/31 (13%) on 2026-08-10 | 5/29 (17%) on 2026-08-27 | The point estimate rose while the denominator contracted. It does not offset or explain the coverage loss and is not an intervention win. |
| Provider mentions | Baseline provider detail retained in Canonry | Claude 4, OpenAI 1, Gemini 0 in the current run | Provider variance is material; no provider-specific content action is supported without confirmation and competitor-displacement diagnosis. |

### Citation coverage — secondary and separate

| Metric | Comparable baseline | Current stored result | Interpretation |
| --- | --- | --- | --- |
| Citation Coverage | 4/42 (10%) on 2026-08-10 | 3/42 (7%) on 2026-08-27 | Two queries gained and three lost citations. This secondary movement is smaller than the mention loss and is not a causal intervention result. |

### Search, indexing, technical, and business outcomes

| Signal | Earlier stored evidence | Latest available evidence | Outcome call |
| --- | --- | --- | --- |
| GSC aggregate | 15,439 impressions, 9 clicks, 0.0583% CTR, position 32.79 for 2026-07-16 through 2026-08-14 | 14,637 impressions, 11 clicks, 0.075% CTR, position 34.36 for 2026-07-24 through 2026-08-22 | Windows overlap; no causal rise, decline, or intervention result is claimed. |
| Google indexing | Earlier stored rollups were 48/95 and then 52/99 indexed | Whole-site 53/100 indexed; accepted 2026-08-27 bounded sample: 14 submitted/indexed, 5 crawled-not-indexed, 4 unknown | Coverage reconciliation improved, but the denominator changed and the whole-site categories are lossy. SEO-002 remains Measuring. |
| Bing indexing | No inspections, then limited 10- and 16-URL samples | 37 indexed / 1 unknown across 38 stored inspections | Supporting coverage evidence only; not a full-site or comparable performance result. |
| Technical AEO | 89/100 across 97 pages on 2026-08-20 | 88/100 across 98 pages on 2026-08-27, 0 errors | Stable healthy crawl with one additional page. The one-point score change is not a regression or business outcome. |
| Production parity | Multiple August source/live defects and deployment lags were documented | 96/96 live sitemap pages and 98/98 internal HTML targets healthy on 2026-08-31; 0 local/live SEO-signal mismatches | Operational hypothesis supported: the measured surface is stable enough for later outcome comparison. |
| Conversions / GA4 / AI referrals | Unavailable | Unavailable | No lead, revenue, conversion, or referral conclusion. |
| Backlinks / referring domains | Three Common Crawl linking domains from the 2026 Apr–Jun release; last queried 2026-07-17 | No current connected backlink source | Stale and insufficient for a campaign or outcome claim. |
| Local search / GBP | Unavailable | Unavailable | No local visibility, review, or place-action conclusion. |

## Intervention review

| ID | Change and original hypothesis | Baseline | Current result and time since implementation | Observed impact / support | Confidence |
| --- | --- | --- | --- | --- | --- |
| SEO-001 | Resolve source/build/live parity so deployment noise does not contaminate measurement. | Confirmed `/thank-you/`, metadata, sitemap, and PPC-link parity defects during August. | Production-verified `0bc7e2b`; 96/96 sitemap pages and 98/98 internal targets healthy through 2026-08-31. | Operational hypothesis supported. Search/AEO impact remains pending and must not be inferred from crawl health. | High operational; unavailable for search impact. |
| SEO-002 | Reconcile intended index coverage with a bounded URL-level sample before acting. | Stale whole-site summaries mixed current, obsolete, and intended exclusions. | 23-URL sample recorded 14 indexed, 5 crawled-not-indexed, and 4 unknown; next same-set checkpoint 2026-09-25. | Measurement design supported; index improvement is pending. | High for sample, Medium for whole site. |
| SEO-003 | Re-run the adopted fixed basket to establish a comparable visibility baseline. | 27/42 Mention Coverage, 4/31 non-brand Mention Share, 4/42 Citation Coverage on 2026-08-10. | 5/42, 5/29, and 3/42 on 2026-08-27; five days elapsed. | Comparable point-in-time decline established, but durability and cause are inconclusive. No page change is supported yet. | High for pairwise measurement; Low for durable trend. |
| SEO-004 | Improve page-specific snippets/intent to lift qualified CTR on already-visible pages. | Zero surfaced row clicks with meaningful impressions/positions across PPC, retargeting, web-design, and social pages. | Pages remain indexed and live-parity verified; latest GSC window overlaps baseline. Measurement due 2026-09-18. | Pending. No comparable after window exists. | Medium for expected search impact. |
| SEO-005 | Restore clearer generic-versus-specialist PPC ownership with one contextual link. | Core agency/PPC queries distributed across 3–8 pages; live/source link omission identified. | Link deployed and stable since 2026-08-27; latest GSC window overlaps baseline. Measurement due 2026-09-24. | Technical/link outcome supported; query-ownership impact pending. | High for implementation, Medium for search impact. |
| SEO-006 | Publish a dedicated water-damage marketing guide for distinct informational intent. | Prior `/industries` target: 155 impressions, 0 clicks, position 48.21; query unmentioned and uncited across 3 providers. | Article live, Google indexed, Bing unconfirmed; eight days since accepted production baseline. Measurement due 2026-09-21. | Indexing gate passed; ranking, traffic, mention, and citation outcomes pending. | Medium. |
| SEO-007 | Align social-ad snippet and visible intent to improve relevance/CTR. | 40 impressions, 0 surfaced row clicks, position 17.68; generic/truncated live snippet. | Approved snippet live since 2026-08-27; current overlapping row is 43 impressions at position 18.93. Measurement due 2026-09-24. | Pending; overlapping movement is not an outcome call. | Medium. |
| SEO-009 | Publish an operator-focused LSA guide to serve an ownable informational gap. | Related GSC family: 34 impressions, 0 clicks, position 27.59; exact Canonry query 0/2 mentioned and 0/2 cited. | Source commit was 404 on 2026-08-31; on 2026-09-01 the URL returned 200, entered the 97-URL sitemap, and matched local build signals. Measurement due 2026-09-29. | Deployment gate now passed; all organic, mention, citation, and conversion outcomes pending. | High for deployment state, Medium for expected search/AEO impact. |

SEO-008 remains a candidate, not an intervention: no approval, source change, deployment, or measurement window exists.

## Wins, misses, and repeatable observations

### Biggest wins

1. Production parity became stable enough to support clean measurement: the audited live surface passed page, internal-link, AI-access-file, and local/live signal checks.
2. SEO-006 cleared its Google indexing gate, separating publication/indexability success from still-pending traffic and AI outcomes.
3. SEO-009 exposed and then closed a real deployment lag: pushed source was not treated as live until the URL and sitemap verified on 2026-09-01.

### Misses and unresolved risks

1. The 22-query Mention Coverage loss is the largest measured risk, but it remains unconfirmed with only two fixed-basket observations. Broad content action would be premature.
2. No deployed content/snippet/link intervention has a due comparable window, so the month produced no validated organic or AEO outcome learning.
3. GA4/conversion, AI-referral, GBP/local, current backlinks, and server-side traffic remain unavailable. These gaps prevent business-impact attribution.
4. Netlify still exposes no stable provider build ID, leaving deployment attribution dependent on bounded artifact parity checks.

### Repeatable results and effort assessment

- Repeatable operational result: source, build, and live checks must remain separate. August repeatedly showed that a commit or local build could differ from production, and SEO-009 demonstrated a measurable 404-to-live lag.
- No intervention can honestly be labeled “effort without measurable benefit” yet. The required outcome windows are either not due or the relevant source is unavailable; this is inconclusive, not zero benefit.
- Prioritize more: fixed-basket confirmation, comparable query-page windows, indexed existing-page opportunities, and production checkpoints.
- Prioritize less: broad rewrites, new location pages, backlink campaigns based on stale data, extra FAQ/schema for audit scores, and any response to one-point technical score movement.

## Backlog reconciliation

- Added a September evidence-ranked order without creating duplicate IDs.
- Kept SEO-001 through SEO-007 in Measuring; their recorded outcome gates have not arrived.
- Kept SEO-008 Candidate and awaiting approval.
- Moved SEO-009 from In Progress to Measuring after bounded production verification; measurement due is now 2026-09-29.
- No item was marked Validated or Rejected from a build, audit score, push, indexing state, or overlapping GSC window.

## Learnings promoted

- Added one evidence-backed working observation to `docs/seo/learnings.md`: a pushed source artifact is not a production result, and measurement starts from accepted live verification.
- Promoted no confirmed search/AEO learning because no intervention has a completed comparable outcome window.
- `docs/seo/strategy.md` was not changed; available evidence supports the existing parity-first, existing-page-first, mention-first strategy rather than a strategic shift.

## Next-month priorities

1. **Problem →** 22 queries lost mentions in the comparable fixed-basket run. **Evidence →** Mention Coverage moved 27/42 to 5/42 while non-brand Mention Share moved 4/31 to 5/29 and Citation Coverage moved 4/42 to 3/42; only two observations exist. **Expected impact →** confirm or dismiss the largest measured AEO risk before content action. **Recommended change →** on or after 2026-09-04, obtain operator approval for one unchanged-basket confirmation sweep, then diagnose persistent commercial-query losses by provider and competitor displacement. **Effort →** Low operator time / quota-consuming. **Confidence →** High in the pairwise result, Low in durability. **Verification method →** same 42-query basket, same provider set, completed non-partial run, mention rates/share first and citations second.
2. **Problem →** deployed page-specific interventions lack comparable outcome windows. **Evidence →** SEO-004, SEO-006, SEO-005, and SEO-007 are due 2026-09-18 through 2026-09-24; current GSC windows overlap their baselines. **Expected impact →** determine which existing-page changes merit repetition, revision, or closure. **Recommended change →** hold artifacts stable and evaluate each exact query/page at its due date using non-overlapping comparable windows. **Effort →** Medium. **Confidence →** High in measurement design, Medium in expected intervention effect. **Verification method →** exact query/page impressions, clicks, CTR, position, index state, and later approved fixed-basket mention/citation evidence.
3. **Problem →** the strongest low-effort candidate is not approved. **Evidence →** SEO-008 targets an indexed page averaging position 4.04 on 24 impressions, with a specific fire-guide link pointing to the generic instead of specialist page. **Expected impact →** reinforce exact intent ownership with limited cannibalization risk. **Recommended change →** decide whether to approve the one-link change; do not expand it into a template rewrite. **Effort →** Low. **Confidence →** Medium–High for the opportunity, Medium for search impact. **Verification method →** one-link diff, build/postbuild, source/build/live followability and parity, then a 28-day exact query/page GSC comparison.

## Limitations

- No outcome due date had arrived on the review date.
- Visibility sampling remains sparse and provider answers are non-deterministic.
- GSC aggregate windows overlap and detailed rows do not expose every aggregate click.
- Google whole-site coverage categories conflict with the accepted bounded sample detail; no state change is inferred from that storage limitation.
- Bing performance lacks a comparable dated window.
- GA4/conversions, AI referrals, GBP/local metrics, server-side traffic, and current backlinks are unavailable.
- The bounded SEO-009 production check does not replace the next full scheduled production-regression crawl.
