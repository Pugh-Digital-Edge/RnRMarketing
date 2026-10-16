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
test('only real element IDs and anchors count; scripts, comments and data attributes never create fragments',()=>{
 const html=`<!-- <a href='/ghost/' id=comment>ghost</a> --><script>const id = 'analytics-pseudo'; const markup = '<a id="script" href="/script/">fake</a>';</script><p data-id="data" title="id='quoted'">id='plain'</p><h2 id=real>Real</h2><a href='/real/#real'>Visit</a>`;
 assert.deepEqual(fragmentIds(html),['real']);
 assert.deepEqual(links(html,'https://example.test/'),[{url:'https://example.test/real/#real',anchor:'Visit'}]);
});
