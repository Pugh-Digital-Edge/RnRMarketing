# LocalBusiness Maps live acceptance - 2026-10-30

Disposition: Delivery complete for the six approved technical fixes. Broader schema findings, Canonry recheck and outcome measurement remain open. This does not claim all schema is error-free or that search performance improved.

Repository: Pugh-Digital-Edge/RnRMarketing
Intervention ID: localbusiness-maps-20261030
Approval: Matt requested the audited fixes, directed RRM to 1000 Carlisle St STE 1625, and explicitly approved publishing these six tested fixes with “yes you can” after being asked to publish and verify live. No PR workflow. No listing, account, credential, permission or schedule changes.
Approved implementation revision: fdb7771ae10e23f9709fac9fc073deae08ac3bc3
Audited source base: 1dd6caa76904d8e51b4611a825ca9d0ded5201ae
PR/merge commit: not applicable; focused fast-forward push to main.
Implementation: https://github.com/Pugh-Digital-Edge/RnRMarketing/commit/fdb7771ae10e23f9709fac9fc073deae08ac3bc3
Hosting receipt: https://app.netlify.com/projects/remediationrestorationmarketing/deploys/6ae4de2deebb1c96b8793952
Hosting state: ready, production, main, exact commit fdb7771ae10e23f9709fac9fc073deae08ac3bc3
Published at: 2026-10-30T18:16:04.545Z
Accepted live at: 2026-10-30T18:23:06.125763+00:00

## Accepted scope

Use 1000 Carlisle St STE 1625, Hanover, PA 17331, removing unsupported Room 2 from schema. Replace the White House contact map and align homepage map links. Add address-map hasMap; do not put an address search or Kristy's identity in RRM sameAs.

Map: https://www.google.com/maps/search/?api=1&query=1000%20Carlisle%20St%20STE%201625%2C%20Hanover%2C%20PA%2017331

RRM's Maps search URL is an address map in hasMap/contact links; its exact Google Business Profile remains unverified and no address search or Kristy listing was added to RRM sameAs.

## Verification

Local gate: npm run validate passed before the approved implementation commit. Generated output: 111 HTML files; 109 business-bearing pages; 58 tests passed. Required checks and focused diff checks passed. Kristy's resource-center work and all unrelated work were preserved in separate original checkouts.

- https://remediationrestorationmarketing.com/ - HTTP 200, JSON-LD parsed, Maps/address checks passed, canonical/indexability passed.
- https://remediationrestorationmarketing.com/contact/ - HTTP 200, JSON-LD parsed, Maps/address checks passed, canonical/indexability passed.

The wrong White House URL is absent from the checked pages. sameAs uses verified identities and never iframe embed URLs. RRM uses only its address-map hasMap. First Response's corrected schema image/logo resolves HTTP 200 image/png.

Supporting public checks:

```json
{
  "repository": "Pugh-Digital-Edge/RnRMarketing",
  "checkedAt": "2026-10-30T18:25:50.249242+00:00",
  "assets": [
    {
      "url": "https://remediationrestorationmarketing.com/assets/images/logo-small.jpg",
      "status": 200,
      "finalUrl": "https://remediationrestorationmarketing.com/assets/images/logo-small.jpg",
      "contentType": "image/jpeg"
    }
  ],
  "robots": {
    "url": "https://remediationrestorationmarketing.com/robots.txt",
    "status": 200,
    "finalUrl": "https://remediationrestorationmarketing.com/robots.txt",
    "contentType": "text/plain; charset=UTF-8"
  },
  "sitemaps": [
    {
      "url": "https://remediationrestorationmarketing.com/sitemap-index.xml",
      "status": 200,
      "finalUrl": "https://remediationrestorationmarketing.com/sitemap-index.xml",
      "contentType": "application/xml"
    }
  ],
  "buildInfo": {
    "url": "https://remediationrestorationmarketing.com/build-info.json",
    "status": 200,
    "finalUrl": "https://remediationrestorationmarketing.com/build-info.json",
    "contentType": "application/json",
    "value": {
      "commit": "fdb7771ae10e23f9709fac9fc073deae08ac3bc3"
    }
  },
  "issues": []
}
```

Remote Schema.org homepage validator: https://validator.schema.org/#url=https%3A%2F%2Fremediationrestorationmarketing.com%2F

```json
{
  "errors": 0,
  "warnings": 0
}
```

Google Rich Results Test receipt, where run:

```json
{
  "status": "Not run for this site; separate Schema.org and public live checks completed."
}
```

Search Console URL Inspection was not performed; no indexed-state or indexing request is claimed. Hosting receipts tie all six deployments to the exact approved source commits; RRM also emits matching live build-info.json. Other sites do not emit that revision file, so the hosting receipt plus affected live output is the available revision proof. GitHub check-runs/statuses were absent; successful Netlify production builds are the deployment evidence.

## Baseline, measurement and next checkpoint

Baseline/cohort: pre-change production/source snapshots from this audit and the exact URLs above; comparison confirms the scoped technical correction. No fresh performance baseline or paid collection was invented. No attribution of ranking, traffic, leads or AI visibility to this release.

Unavailable in this execution: cnry --version / cnry --help returned no output and hung until stopped. No paid sweep, sync or indexing operation was invoked. Relevant existing scheduled recheck remains due.

Measurement window: allow 28 complete post-release days (2026-10-31 through 2026-11-27 UTC) before comparing like-for-like available search data against an equal pre-release cohort/window. Performance measurement remains open and requires actual data. Next checkpoint: the existing scheduled health/Canonry recheck, then outcome review on or after 2026-11-28. This receipt creates no automation and changes no owner designation.

Separate unresolved items: RRM exact GBP identity; Kristy hours/review-count verification; EnviroTest identity/source parity and home-address prohibition; RestoPros franchise CMS access. New supporting check also found an unchanged Kristy schema image URL /assets/images/kristy-enhanced.png returning 404. It is recorded without extending the six presented fixes.

This documentation-only acceptance commit uses [skip netlify] to keep the accepted production artifact intact without a redundant build, following https://docs.netlify.com/deploy/manage-deploys/manage-deploys-overview/#skip-a-deploy. It changes no site code or runtime configuration. Grok owns routine Notion Fulfillment synchronization from this Git receipt.
