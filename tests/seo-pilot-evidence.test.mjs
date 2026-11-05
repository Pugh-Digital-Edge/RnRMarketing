import test from 'node:test';
import assert from 'node:assert/strict';
import{readFileSync}from'node:fs';
const root=new URL('../docs/seo/pilot/2026-10-16/',import.meta.url);
const baseline=JSON.parse(readFileSync(new URL('baseline.json',root),'utf8'));
test('frozen CTA derivations match corrected links and source fragments do not masquerade as live evidence',()=>{
 for(const p of baseline.pages){assert.deepEqual(p.cta,p.links.filter(l=>/\/(contact|schedule)\//.test(l.url)||l.url.startsWith('tel:')).map(l=>l.url),p.url);assert.equal('ids' in p,false);assert.match(p.fragmentEvidence.liveState,/not independently verified/);}
 assert.equal(baseline.pages.filter(p=>p.cta.length).length,108);
 assert.deepEqual(baseline.summary.fragmentCorrection.localBaselineBrokenFragments,[]);
});
test('recorded intervention scope equals the exhaustive rendered comparison',()=>{
 const rendered=JSON.parse(readFileSync(new URL('rendered-before-after.json',root),'utf8'));
 const csv=readFileSync(new URL('intervention-plan.csv',root),'utf8');
 const urls=csv.trim().split(/\r?\n/).slice(1).map(line=>line.split(',')[1].replaceAll('"',''));
 assert.equal(rendered.pagesCompared,110);assert.equal(rendered.semanticChanged,11);
 assert.deepEqual([...urls].sort(),[...rendered.changedURLs].sort());
 const cohort=JSON.parse(readFileSync(new URL('query-cohort.json',root),'utf8'));
 assert.deepEqual(cohort.cohorts.map(c=>c.url).sort(),[...urls].sort());
 assert.equal(cohort.cohorts.reduce((sum,c)=>sum+c.cells.length,0),734);
 for(const c of cohort.cohorts){assert.equal(new Set(c.cells.map(cell=>JSON.stringify(cell))).size,c.cells.length);assert.ok(c.cells.every(cell=>/^[a-f0-9]{64}$/.test(cell.querySHA256)&&cell.country&&cell.device));}
 const actions=readFileSync(new URL('page-search-baseline.csv',root),'utf8');
 assert.equal(actions.split(/\r?\n/).filter(line=>line.includes('draft implementation; pending review/live acceptance')).length,11);
});
