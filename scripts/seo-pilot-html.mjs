import {decodeHTML} from 'entities';
export function links(html,url){return [...html.matchAll(/<a\b[^>]*\shref\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))[^>]*>([\s\S]*?)<\/a>/gi)].flatMap(m=>{try{const u=new URL(decodeHTML(m[1]??m[2]??m[3]),url);return [{url:u.href,anchor:decodeHTML(m[4].replace(/<[^>]*>/g,'')).replace(/\s+/g,' ').trim()}];}catch{return[];}});}
export function fragmentIds(html){return [...html.matchAll(/\sid\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].map(m=>m[1]??m[2]??m[3]);}
export function imagesMissingAlt(html){return [...html.matchAll(/<img\b[^>]*>/gi)].filter(m=>!(/\salt(?:\s*=|\s|>)/i.test(m[0]))).length;}
