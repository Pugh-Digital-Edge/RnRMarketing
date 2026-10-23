// Read-only GET crawl. No forms, browser analytics, providers or external links.
import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {signals,pageErrors} from './seo-check.mjs';
import {links,fragmentIds,imagesMissingAlt} from "./seo-pilot-html.mjs";
import {decodeHTML} from 'entities';
const origin='https://remediationrestorationmarketing.com';
const out=process.argv[2];
if(!out) throw Error('Supply an evidence output directory');
await mkdir(out,{recursive:true});
const startedAt=new Date().toISOString();
const hash=s=>createHash('sha256').update(s).digest('hex');
async function files(dir){return (await Promise.all((await readdir(dir,{withFileTypes:true})).map(e=>e.isDirectory()?files(path.join(dir,e.name)):[path.join(dir,e.name)]))).flat();}
const locals=new Map();
for(const file of (await files('dist')).filter(f=>f.endsWith('.html'))){let route='/'+path.relative('dist',file).replaceAll('\\','/').replace(/index\.html$/,'');locals.set(origin+route,await readFile(file,'utf8'));}
const sitemapLocal=[...(await readFile('dist/sitemap-0.xml','utf8')).matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
async function get(url){const start=performance.now();try{const r=await fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:{'User-Agent':'RRM-SEO-Pilot/1.0'}});const body=await r.text();return {status:r.status,location:r.headers.get('location'),robots:r.headers.get('x-robots-tag'),contentType:r.headers.get('content-type'),elapsedMs:Math.round(performance.now()-start),body,observedAt:new Date().toISOString()};}catch(e){return{status:null,error:e.name,body:'',observedAt:new Date().toISOString()};}}
const artifacts={};for(const route of ['/robots.txt','/sitemap-index.xml','/sitemap-0.xml','/build-info.json'])artifacts[route]=await get(origin+route);
const sitemapLive=[...artifacts['/sitemap-0.xml'].body.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
const known=new Set([...locals.keys(),...sitemapLocal,...sitemapLive]);

const fetched=new Map();let iterations=0;
while([...known].some(u=>!fetched.has(u))){if(known.size>500||++iterations>12)throw Error('Crawl cap reached; partial evidence must be retained');const queue=[...known].filter(u=>!fetched.has(u));let i=0;await Promise.all(Array.from({length:3},async()=>{while(i<queue.length){const url=queue[i++],r=await get(url);fetched.set(url,r);if(r.status===200&&r.contentType?.includes('text/html'))for(const l of links(r.body,url)){const u=new URL(l.url);if(u.origin===origin&&!u.search&&!/\.[a-z0-9]+$/i.test(u.pathname))known.add(origin+u.pathname);}}}));}
const pages=[];
for(const url of [...known].sort()){const r=fetched.get(url),local=locals.get(url);let s=null,errors=[];try{s=signals(r.body);}catch{errors.push('invalid JSON-LD');}const noindex=/noindex|none/i.test([...(s?.robots||[]),r.robots||''].join(' '));const admin=new URL(url).pathname==='/admin/';if(s&&!admin&&r.status===200)errors.push(...pageErrors(s,url,noindex));const outgoing=links(r.body,url);const headings=[...r.body.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map(m=>({level:+m[1],text:decodeHTML(m[2].replace(/<[^>]*>/g,'')).trim()}));let parity=null;try{if(local&&s)parity=JSON.stringify(signals(local))===JSON.stringify(s);}catch{}
const ids=fragmentIds(r.body);
pages.push({url,disposition:r.status===null?'blocked':admin||noindex?'excluded':'checked',reason:r.status===null?r.error:admin?'CMS editorial interface; robots-disallowed':noindex?'Intentional noindex conversion/utility route':'GET, metadata, headings, links, schema syntax and eligibility checked; manual/business/runtime limits in report',sourceBuild:!!local,localSitemap:sitemapLocal.includes(url),liveSitemap:sitemapLive.includes(url),status:r.status,redirect:r.location,observedAt:r.observedAt,elapsedMs:r.elapsedMs,bytes:Buffer.byteLength(r.body),contentSha256:hash(r.body),noindex,signals:s,errors,parity,headings,ids,links:outgoing,forms:(r.body.match(/<form\b/gi)||[]).length,imagesMissingAlt:imagesMissingAlt(r.body),cta:outgoing.filter(l=>/\/(contact|schedule)\//.test(l.url)||l.url.startsWith('tel:')).map(l=>l.url)});}
const broken=[];for(const p of pages)for(const l of p.links){const u=new URL(l.url);if(u.origin!==origin||u.search||/\.[a-z0-9]+$/i.test(u.pathname))continue;const target=pages.find(p=>p.url===origin+u.pathname);if(!target||target.status!==200)broken.push({source:p.url,target:l.url,reason:target?`HTTP ${target.status}`:'not fetched'});else if(u.hash&&!target.ids.includes(decodeURIComponent(u.hash.slice(1))))broken.push({source:p.url,target:l.url,reason:'missing fragment'});}
for(const p of pages)p.distinctInbound=pages.filter(source=>source.url!==p.url&&source.links.some(l=>{const u=new URL(l.url);return u.origin+u.pathname===p.url;})).length;
const summary={startedAt,completedAt:new Date().toISOString(),caps:{pages:500,concurrency:3,iterations:12,externalLinks:false,queryVariants:false},buildPages:locals.size,localSitemap:sitemapLocal.length,liveSitemap:sitemapLive.length,union:pages.length,checked:pages.filter(p=>p.disposition==='checked').length,excluded:pages.filter(p=>p.disposition==='excluded').length,blocked:pages.filter(p=>p.disposition==='blocked').length,non200:pages.filter(p=>p.status!==200).map(p=>({url:p.url,status:p.status})),signalErrors:pages.filter(p=>p.errors.length).map(p=>({url:p.url,errors:p.errors})),parityMismatches:pages.filter(p=>p.parity===false).map(p=>p.url),broken,artifacts};
await writeFile(path.join(out,'baseline.json'),JSON.stringify({summary,pages},null,2));
const csv=v=>'"'+String(v??'').replaceAll('"','""')+'"';
await writeFile(path.join(out,'every-page.csv'),[['url','disposition','reason','sourceBuild','localSitemap','liveSitemap','status','noindex','parity','distinctInbound','forms','imagesMissingAlt','title','description','h1','errors'],...pages.map(p=>[p.url,p.disposition,p.reason,p.sourceBuild,p.localSitemap,p.liveSitemap,p.status,p.noindex,p.parity,p.distinctInbound,p.forms,p.imagesMissingAlt,p.signals?.title,p.signals?.description,p.signals?.headings.join(' | '),p.errors.join('; ')])].map(r=>r.map(csv).join(',')).join('\n'));
console.log(JSON.stringify({...summary,artifacts:Object.fromEntries(Object.entries(artifacts).map(([k,v])=>[k,{status:v.status,observedAt:v.observedAt}]))},null,2));
