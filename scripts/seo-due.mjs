import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export function measurementQueue(markdown, today) {
  return markdown.split(/(?=^### SEO-\d+)/m).flatMap(block => {
    const heading = block.match(/^### (SEO-\d+)\s+[^\n]+/m);
    if (!heading) return [];
    const status = block.match(/^- Status:\s*(.+)/m)?.[1]?.trim();
    if (!/^Measuring\b/i.test(status || '')) return [];
    // Prefer the explicit current due field. Historical dated notes cannot override it.
    const date = block.match(/^- Measurement due date:\s*(\d{4}-\d{2}-\d{2})/m)?.[1]
      ?? block.match(/Measurement due:?\s*(\d{4}-\d{2}-\d{2})/)?.[1];
    return [{ id: heading[1], title: heading[0].replace(/^### /, ''), status, due: date ?? null,
      action: !date ? 'needs-measurement-date' : date <= today ? 'measure-when-data-window-complete' : 'waiting' }];
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  const today = process.argv[2] || new Intl.DateTimeFormat('en-CA', { timeZone: 'America/New_York' }).format(new Date());
  if (!/^\d{4}-\d{2}-\d{2}$/.test(today)) throw new Error('Expected YYYY-MM-DD');
  console.log(JSON.stringify({ today, items: measurementQueue(await readFile('docs/seo/backlog.md', 'utf8'), today) }, null, 2));
}
