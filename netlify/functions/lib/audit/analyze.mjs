import { parse } from 'parse5';

const CATEGORY_DEFINITIONS = [
  { id: 'mobile-contact', label: 'Mobile contact HTML' },
  { id: 'service-location', label: 'Service & location clarity' },
  { id: 'trust', label: 'Visible trust cues' },
  { id: 'search-technical', label: 'Basic search signals' },
];

export function cleanText(value, length = 220) {
  return String(value || '').replace(/[\u0000-\u001f\u007f-\u009f\u200b-\u200f\u202a-\u202e\u2060-\u206f\ufeff]/gu, ' ')
    .replace(/[<>]/g, '').replace(/\s+/gu, ' ').trim().slice(0, length);
}

const excluded = new Set(['script', 'style', 'noscript', 'template', 'svg', 'canvas', 'iframe', 'object', 'head']);
const attributes = node => Object.fromEntries((node.attrs || []).map(attribute => [attribute.name, attribute.value]));
const isHidden = attrs => 'hidden' in attrs || attrs['aria-hidden'] === 'true' || /(?:display\s*:\s*none|visibility\s*:\s*hidden)/i.test(attrs.style || '');

function isContactForm(node, attrs) {
  if (attrs.role === 'search' || /\b(?:search|newsletter|subscribe|login|sign-in)\b/i.test(`${attrs.id || ''} ${attrs.name || ''} ${attrs.action || ''}`)) return false;
  if (/\b(?:contact|quote|estimate|inquiry|enquiry)\b/i.test(`${attrs.id || ''} ${attrs.name || ''} ${attrs['aria-label'] || ''} ${attrs.action || ''}`)) return true;
  const stack = [...(node.childNodes || [])];
  let contactField = false;
  let messageField = false;
  let visited = 0;
  while (stack.length && ++visited < 10_000) {
    const child = stack.pop();
    const childAttrs = attributes(child);
    if (isHidden(childAttrs)) continue;
    if (child.tagName === 'input' && (['email', 'tel'].includes(childAttrs.type) || /^(?:email|phone|telephone)$/i.test(childAttrs.name || ''))) contactField = true;
    if (child.tagName === 'textarea') messageField = true;
    for (const descendant of child.childNodes || []) stack.push(descendant);
  }
  return contactField && messageField;
}

function elementText(node) {
  const stack = [node];
  const parts = [];
  let length = 0;
  let visited = 0;
  while (stack.length && length < 1500 && ++visited < 10_000) {
    const current = stack.pop();
    if (current.nodeName === '#text') { parts.push(current.value); length += current.value.length; continue; }
    if (excluded.has(current.tagName) || isHidden(attributes(current))) continue;
    for (const child of [...(current.childNodes || [])].reverse()) stack.push(child);
  }
  return cleanText(parts.join(' '), 1200);
}

/** Parse bounded, inert HTML; no content is passed to a model or rendered. */
export function inspectHtml(html, headers = {}) {
  const document = parse(html);
  const stack = [{ node: document, visible: true, inBody: false }];
  const parts = [];
  const facts = { title: '', description: '', viewport: '', robots: [], h1s: [], links: [], body: '', hasForm: false, companySections: [] };
  let visited = 0;
  while (stack.length) {
    if (++visited > 35_000) throw new Error('HTML complexity limit exceeded.');
    const { node, visible, inBody } = stack.pop();
    const attrs = attributes(node);
    const tag = node.tagName;
    const body = inBody || tag === 'body';
    const shown = visible && !isHidden(attrs) && !excluded.has(tag);
    if (tag === 'title' && !facts.title) facts.title = elementText(node);
    if (tag === 'meta') {
      const name = (attrs.name || '').toLowerCase();
      if (name === 'description') facts.description = cleanText(attrs.content, 500);
      if (name === 'viewport') facts.viewport = cleanText(attrs.content, 400_000);
      if (['robots', 'googlebot', 'bingbot'].includes(name)) facts.robots.push(cleanText(attrs.content, 400_000));
    }
    if (shown && body) {
      if (node.nodeName === '#text') parts.push(node.value);
      if (tag === 'h1' && facts.h1s.length < 10) {
        const heading = elementText(node);
        if (heading) facts.h1s.push(heading);
      }
      if (['h1', 'h2', 'h3'].includes(tag)) {
        const text = elementText(node);
        if (/\b(?:about (?:us|our)|our (?:company|team|story)|who we are)\b/i.test(text)) facts.companySections.push(text);
      }
      if (tag === 'a' && attrs.href && attrs.href.length <= 2048) facts.links.push({ href: attrs.href.trim(), text: elementText(node) });
      if (tag === 'form' && isContactForm(node, attrs)) facts.hasForm = true;
    }
    // Head metadata is inspected, but its text cannot become visible evidence.
    if (['script', 'style', 'noscript', 'template', 'svg', 'canvas', 'iframe', 'object'].includes(tag)) continue;
    for (const child of [...(node.childNodes || [])].reverse()) stack.push({ node: child, visible: shown, inBody: body });
  }
  facts.body = cleanText(parts.join(' '), 400_000);
  const robotHeader = headers['x-robots-tag'];
  if (robotHeader) facts.robots.push(cleanText(Array.isArray(robotHeader) ? robotHeader.join(', ') : robotHeader, 400_000));
  return facts;
}

function excerpt(text, pattern) {
  const match = pattern.exec(text);
  if (!match) return '';
  return cleanText(text.slice(Math.max(0, match.index - 65), match.index + Math.max(match[0].length, 60) + 85));
}

function servicePattern(service) {
  const value = cleanText(service, 120).toLowerCase();
  if (/water|flood/.test(value)) return /\b(?:water\s+(?:damage|restoration|removal|cleanup|mitigation)|flood(?:ing)?\s+(?:damage|restoration|cleanup))\b/i;
  if (/fire|smoke/.test(value)) return /\b(?:fire|smoke)\s+(?:damage|restoration|cleanup|remediation)\b/i;
  if (/mold|mould/.test(value)) return /\b(?:mold|mould)\s+(?:remediation|removal|cleanup|inspection)\b/i;
  if (/storm/.test(value)) return /\bstorm\s+(?:damage|restoration|cleanup)\b/i;
  if (/sewage/.test(value)) return /\bsewage\s+(?:cleanup|removal|restoration)\b/i;
  const tokens = value.split(/[^a-z\d]+/).filter(token => token.length > 2 && !['and', 'the', 'services', 'service', 'multiple', 'other'].includes(token));
  if (!tokens.length) return null;
  return new RegExp(`\\b${tokens.map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('\\s+')}\\b`, 'i');
}

function areaPattern(area) {
  const value = cleanText(area, 120);
  // A city + state input checks the city phrase. This is a content-presence
  // signal, not verification that an address is genuine or service is available.
  const city = value.split(',')[0].trim();
  if (city.length < 2) return null;
  const escaped = city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\s+/g, '\\s+');
  return new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{N}])`, 'iu');
}

export function analyzeWebsite({ url, service, area, pages, generatedAt }) {
  const selectedService = cleanText(service, 120);
  const selectedArea = cleanText(area, 120);
  const checked = pages.filter(page => page.status === 'checked');
  const homepage = pages[0]?.status === 'checked' ? pages[0] : null;
  const partial = pages.some(page => page.status === 'unavailable');
  const siteMissingStatus = checked.length && !partial ? 'fail' : 'unknown';
  const evidence = (page, text) => ({ url: page?.url || url, text: cleanText(text) });
  const missing = description => checked.length ? checked.map(page => evidence(page, `${description} was not found in the HTML checked on this page.`)) : [evidence(null, `Homepage could not be checked: ${pages[0]?.reason || 'HTML unavailable'}`)];
  const checks = [];
  const add = (id, category, label, status, found, recommendation, priority, why) => checks.push({ id, category, label, status, evidence: found, recommendation, priority, why });
  const firstMatch = (predicate, describe) => {
    for (const page of checked) {
      const result = predicate(page);
      if (result) return [evidence(page, describe(result, page))];
    }
    return null;
  };
  const telephone = firstMatch(page => page.facts.links.find(link => /^tel:\+?[\d().\s-]+$/i.test(link.href) && (link.href.match(/\d/g) || []).length >= 7 && (link.href.match(/\d/g) || []).length <= 15), link => `Telephone link in HTML: ${link.href}${link.text ? ` (${link.text})` : ''}`);
  add('tap-to-call', 'mobile-contact', 'Telephone link present', telephone ? 'pass' : siteMissingStatus, telephone || missing('A valid tel: link'), 'Add a clearly labeled telephone link using tel: so visitors can start a call from their device. Test it on a real phone.', 100, telephone ? 'A telephone link appears in the inspected HTML; its visibility and behavior on a device are unverified.' : 'No usable telephone link was found in the HTML that could be checked.');
  const contact = firstMatch(page => page.facts.hasForm || page.facts.links.find(link => {
    if (/^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/i.test(link.href)) return true;
    try {
      const destination = new URL(link.href, page.url);
      return destination.origin === new URL(page.url).origin && !destination.username && !destination.password && /(?:^|\/)contact(?:-us)?(?:\/|\.|$)/i.test(destination.pathname);
    } catch { return false; }
  }), found => found === true ? 'A contact form appears in the HTML. It was not submitted or tested.' : `Contact link in HTML: ${found.href}`);
  add('contact-route', 'mobile-contact', 'Contact route present', contact ? 'pass' : siteMissingStatus, contact || missing('A contact page link, email link, or form'), 'Add a clear contact route near the main service information, then manually test its delivery.', 80, contact ? 'A contact route appears in HTML; delivery and usability were not tested.' : 'No contact route was found in the inspected HTML.');
  const viewport = homepage?.facts.viewport;
  const viewportOk = viewport && /(?:^|[,;\s])width\s*=\s*device-width(?=$|[,;\s])/i.test(viewport);
  add('viewport', 'mobile-contact', 'Device-width viewport declared', homepage ? viewportOk ? 'pass' : 'fail' : 'unknown', homepage ? [evidence(homepage, viewport ? `Viewport declaration: ${viewport}` : 'No device-width viewport declaration was found in homepage HTML.')] : missing('Viewport declaration'), 'Declare a device-width viewport and review the actual layout, text size, and contact controls on a phone.', 65, 'The viewport declaration is an HTML signal only; it does not establish mobile layout quality.');
  const selectedServicePattern = servicePattern(selectedService);
  const serviceEvidence = selectedServicePattern && firstMatch(page => excerpt(page.facts.body, selectedServicePattern), text => `Service wording: ${text}`);
  add('service-clarity', 'service-location', 'Selected service named in page text', serviceEvidence ? 'pass' : selectedServicePattern ? siteMissingStatus : 'unknown', serviceEvidence || missing(selectedServicePattern ? `Wording for ${selectedService}` : 'A selected service to compare'), 'Name the selected service in clear customer-facing page text and explain the work customers can request.', 95, serviceEvidence ? 'The selected service is named in the inspected text.' : 'The selected service could not be confirmed in the inspected page text.');
  const selectedAreaPattern = areaPattern(selectedArea);
  const areaEvidence = selectedAreaPattern && firstMatch(page => excerpt(page.facts.body, selectedAreaPattern), text => `Location wording: ${text}`);
  add('area-clarity', 'service-location', 'Selected area named in page text', areaEvidence ? 'pass' : selectedAreaPattern ? siteMissingStatus : 'unknown', areaEvidence || missing(selectedAreaPattern ? `The selected area (${selectedArea})` : 'A selected area to compare'), 'State the actual city or service area in useful page text. Confirm the business truly serves that area before adding it.', 90, areaEvidence ? 'The selected area appears in text; actual service coverage is unverified.' : 'The selected area could not be confirmed in the inspected page text.');
  const company = firstMatch(page => page.facts.companySections[0] || (/(?:^|\/)(?:about(?:-us)?|our-team|company)(?:\/|\.|$)/i.test(new URL(page.url).pathname) && page.facts.body.length >= 80 && page.facts.body.slice(0, 180)), text => `Company information in HTML: ${text}`);
  add('company-information', 'trust', 'Company information present', company ? 'pass' : siteMissingStatus, company || missing('An about/company section or readable about page'), 'Add useful company and team information that explains who will perform the work. Use accurate business facts.', 55, company ? 'Company information is available in the inspected HTML; identity was not independently verified.' : 'No company-information section was identified in the inspected HTML.');
  const trust = firstMatch(page => excerpt(page.facts.body, /\b(?:IICRC|licensed|insured|certified|certification|testimonials?|customer reviews?|years (?:of experience|in business))\b/i), text => `Visible trust wording: ${text}`);
  add('trust-cues', 'trust', 'Trust wording present', trust ? 'pass' : siteMissingStatus, trust || missing('Credential, review, or experience wording'), 'Include relevant, verifiable credentials, experience, or customer evidence. Check permission, accuracy, and currency before publication.', 60, trust ? 'Trust-related wording appears in HTML. Its authenticity and accuracy were not verified.' : 'No credential, review, or experience wording was identified in the inspected text.');
  add('https', 'search-technical', 'Homepage served over HTTPS', homepage ? new URL(homepage.url).protocol === 'https:' ? 'pass' : 'fail' : 'unknown', homepage ? [evidence(homepage, `Homepage HTML was retrieved over ${new URL(homepage.url).protocol === 'https:' ? 'HTTPS' : 'HTTP'}.`)] : missing('Homepage transport'), 'Serve the public site over HTTPS and redirect HTTP visitors to the same secure website.', 85, 'HTTPS describes the retrieved page connection; it is not a full security assessment.');
  add('page-title', 'search-technical', 'Homepage title present', homepage ? homepage.facts.title ? 'pass' : 'fail' : 'unknown', homepage ? [evidence(homepage, homepage.facts.title ? `HTML title: ${homepage.facts.title}` : 'No nonempty title element was found in homepage HTML.')] : missing('Homepage title'), 'Give the homepage a clear, accurate title that identifies the business and its primary offering.', 50, 'A page title helps identify a document; this check does not predict rankings.');
  add('primary-heading', 'search-technical', 'Homepage primary heading present', homepage ? homepage.facts.h1s.some(Boolean) ? 'pass' : 'fail' : 'unknown', homepage ? [evidence(homepage, homepage.facts.h1s.some(Boolean) ? `HTML H1: ${homepage.facts.h1s.find(Boolean)}` : 'No nonempty H1 was found in homepage HTML.')] : missing('Homepage primary heading'), 'Use a clear primary heading that explains the main service to visitors.', 45, 'The primary heading is checked in HTML; its visual presentation is unverified.');
  const noindex = homepage?.facts.robots.find(value => /(?:^|[\s,:])(?:noindex|none)(?=$|[\s,;])/i.test(value));
  add('indexing-directive', 'search-technical', 'No homepage noindex directive observed', homepage ? noindex ? 'fail' : 'pass' : 'unknown', homepage ? [evidence(homepage, noindex ? `Noindex directive found: ${noindex}` : 'No noindex directive was observed in the homepage meta robots or X-Robots-Tag response header.')] : missing('Homepage indexing directives'), 'Confirm the homepage should be public, then review any noindex directive with the site owner. Verify actual indexing in the owner’s search tools.', 75, 'Only the retrieved homepage meta/header directives were checked. Robots.txt, indexing, canonicals, and search visibility were not verified.');
  const categories = CATEGORY_DEFINITIONS.map(category => {
    const group = checks.filter(check => check.category === category.id);
    const known = group.filter(check => check.status !== 'unknown');
    const passed = known.filter(check => check.status === 'pass').length;
    const unknown = group.length - known.length;
    return { ...category, score: known.length ? Math.round(passed / known.length * 100) : null, summary: known.length ? `${passed} of ${known.length} checked HTML signals passed.${unknown ? ` ${unknown} could not be checked.` : ''}` : 'These HTML signals could not be checked.' };
  });
  const scores = categories.filter(category => category.score !== null).map(category => category.score);
  // Unknown categories must not turn a handful of passing technical checks into
  // a misleading 100/100 overall result.
  const score = scores.length === CATEGORY_DEFINITIONS.length ? Math.round(scores.reduce((sum, value) => sum + value, 0) / scores.length) : null;
  const fixes = [];
  if (!homepage) {
    fixes.push({ title: 'Retry the homepage check', why: 'The homepage HTML could not be read, so no readiness score is available.', action: 'Confirm the public URL and that ordinary visitors can open it, then retry. A blocked automated check does not establish that the website is broken.', evidence: missing('Homepage HTML') });
  } else {
    for (const check of checks.filter(check => check.status !== 'pass').sort((a, b) => (a.status === 'fail' ? 0 : 1) - (b.status === 'fail' ? 0 : 1) || b.priority - a.priority).slice(0, 3)) {
      fixes.push({ title: `${check.status === 'unknown' ? 'Verify' : 'Improve'}: ${check.label}`, why: check.status === 'unknown' ? `${check.why} Some relevant HTML could not be checked; this is not a confirmed missing feature.` : check.why, action: check.recommendation, evidence: check.evidence });
    }
  }
  const verification = [
    { title: 'Verify the mobile contact experience', why: 'A static HTML check cannot assess the actual phone layout or complete a call or contact request.', action: 'Open the site on a phone, find the contact controls, and manually verify that they work as intended.', evidence: telephone || [evidence(homepage, 'Mobile layout, tap targets, calls, and form delivery were not tested.')] },
    { title: 'Verify service, area, and trust details', why: 'Text presence does not establish actual service coverage or the authenticity of credentials and reviews.', action: 'Confirm the stated services, service area, company identity, credentials, and customer evidence with the business owner.', evidence: [...(serviceEvidence || []), ...(trust || [])].slice(0, 2).length ? [...(serviceEvidence || []), ...(trust || [])].slice(0, 2) : [evidence(homepage, 'Business facts and trust claims were not independently verified.')] },
    { title: 'Check search visibility with owner data', why: 'HTML signals cannot establish indexing, rankings, traffic, or lead generation.', action: 'Review the owner’s search-console data and indexing reports before choosing further search changes.', evidence: [evidence(homepage, 'Search performance, indexing, rankings, traffic, leads, and revenue were not measured.')] },
  ];
  for (const fix of verification) { if (fixes.length < 3) fixes.push(fix); }
  return {
    version: 1, url, service: selectedService, area: selectedArea, generatedAt, score, categories,
    checks: checks.map(({ priority, why, ...check }) => check), fixes,
    pages: pages.map(({ url: pageUrl, status, reason }) => ({ url: pageUrl, status, ...(reason ? { reason } : {}) })),
    limitations: [
      'This is a bounded HTML readiness check of the homepage and up to four relevant same-origin pages, not a complete site audit.',
      'Visual/mobile layout, text readability, element visibility after CSS/JavaScript, and tap-target size are unverified. A viewport or tel: link is only an HTML signal.',
      'No JavaScript, subresources, calls, or form submissions were executed. Contact delivery and interactive behavior were not tested.',
      'Trust wording is reported as a claim in page text; identity, credentials, reviews, and service coverage were not independently verified.',
      'Robots.txt, canonicals, actual indexing, accessibility, performance, rankings, traffic, leads, and revenue were not measured. The score is a heuristic of the checked HTML signals and predicts none of these.',
      ...(partial ? ['Some HTML was unavailable. Missing site-wide signals are unknown when a selected page could not be checked; unavailable checks are excluded from scores.'] : []),
      ...(homepage && score === null ? ['An overall score is unavailable because at least one category could not be assessed. Available category checks are still shown.'] : []),
      ...(!homepage ? ['The homepage could not be checked; secondary pages were not requested and all readiness checks remain unknown.'] : []),
    ],
  };
}
