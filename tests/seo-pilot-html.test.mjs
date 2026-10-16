import test from 'node:test';
import assert from 'node:assert/strict';
import {links,fragmentIds,imagesMissingAlt} from '../scripts/seo-pilot-html.mjs';
test('crawl preserves minified Astro links, quoted attributes and fragments',()=>{
 const found=links('<a href=/services/ppc/>PPC</a><a class=x href="/schedule/#request">Book <b>now</b></a><a href=\'/resources/?a=1&amp;b=2\'>Guide</a>','https://example.test/');
 assert.deepEqual(found,[{url:'https://example.test/services/ppc/',anchor:'PPC'},{url:'https://example.test/schedule/#request',anchor:'Book now'},{url:'https://example.test/resources/?a=1&b=2',anchor:'Guide'}]);
 assert.deepEqual(fragmentIds('<h2 id=request>Start</h2><p id="details">Details</p>'),['request','details']);
});
test('minified empty decorative alt is present; missing alt remains a defect',()=>{
 assert.equal(imagesMissingAlt('<img src=x alt data-sh="true"><img alt="" src=y><img alt="Work" src=z>'),0);
 assert.equal(imagesMissingAlt('<img src=x><img data-alt="not-alt" src=y>'),2);
});
