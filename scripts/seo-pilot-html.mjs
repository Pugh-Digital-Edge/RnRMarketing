import {parse} from 'parse5';
// Parse HTML elements, never JavaScript strings, comments or data-* attributes.
function elements(html){const result=[];function visit(node){if(node.tagName)result.push(node);for(const child of node.childNodes||[])visit(child);}visit(parse(html));return result;}
const attrs=node=>Object.fromEntries((node.attrs||[]).map(a=>[a.name,a.value]));
function text(node){if(['script','style'].includes(node.tagName))return '';return node.nodeName==='#text'?node.value:(node.childNodes||[]).map(text).join('');}
export function links(html,url){return elements(html).filter(n=>n.tagName==='a'&&'href' in attrs(n)).flatMap(n=>{try{return[{url:new URL(attrs(n).href,url).href,anchor:text(n).replace(/\s+/g,' ').trim()}];}catch{return[];}});}
export function fragmentIds(html){return elements(html).flatMap(n=>'id' in attrs(n)?[attrs(n).id]:[]);}
export function imagesMissingAlt(html){return elements(html).filter(n=>n.tagName==='img'&&!('alt' in attrs(n))).length;}
