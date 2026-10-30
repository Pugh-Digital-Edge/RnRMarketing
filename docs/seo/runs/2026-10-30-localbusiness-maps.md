# LocalBusiness Google Maps correction - 2026-10-30

Status: implemented and validated locally; not published.

Authorization: Matt requested the audited fixes and directed RRM to 1000 Carlisle St STE 1625. No PRs. This receipt does not override the retained publication gate or designate a new automation owner/host.

Base: 1dd6caa76904d8e51b4611a825ca9d0ded5201ae. Remote main was freshly checked before implementation; no intervening material source changes were found. Existing local/concurrent work was preserved in separate checkouts.

Change: Use 1000 Carlisle St STE 1625, Hanover, PA 17331, removing unsupported Room 2 from schema. Replace the White House contact map and align homepage map links. Add address-map hasMap; do not put an address search or Kristy's identity in RRM sameAs.

Map: https://www.google.com/maps/search/?api=1&query=1000%20Carlisle%20St%20STE%201625%2C%20Hanover%2C%20PA%2017331

Verification: npm run validate passed. Generated JSON-LD checks passed for 111 HTML files; 109 business-bearing pages; 58 tests passed. Checks preserve business facts and other identity links; iframe URLs are excluded from sameAs. Diff checks passed. RRM's address map is intentionally separate from an unverified Google Business Profile identity.

Maps identity checks compare business name, address, phone and official website. RRM's full address is independently corroborated by https://remediationrestorationmarketing.com/contact/ and existing business data. No Google listing, permission, credential, schedule, dependency version or lockfile was changed.

Release: no push, merge, PR or deployment in this implementation. Production acceptance, Google validator/Search Console checks and the applicable Canonry recheck remain pending authorized release. No ranking or lead outcome is claimed. Existing unresolved hours/review-count facts, EnviroTest privacy/identity and RestoPros CMS access remain separate.

