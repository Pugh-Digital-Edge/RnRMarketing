import { mkdir, readFile, writeFile, unlink } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

export async function manageLock(file, action, owner) {
  if (!['status', 'acquire', 'release'].includes(action)) throw new Error('Use acquire, status, or release.');
  if (action !== 'status' && !/^[a-zA-Z0-9_-]{8,100}$/.test(owner || '')) {
    throw new Error('Supply a unique owner token (8–100 letters, digits, underscores or hyphens).');
  }
  await mkdir(path.dirname(file), { recursive: true });
  if (action === 'acquire') {
    try {
      await writeFile(file, JSON.stringify({ owner, acquiredAt: new Date().toISOString() }), { flag: 'wx' });
      return { acquired: true, owner };
    } catch (error) { if (error.code !== 'EEXIST') throw error; }
  }
  let lock;
  try { lock = JSON.parse(await readFile(file, 'utf8')); }
  catch (error) {
    if (error.code === 'ENOENT') return { locked: false };
    if (error instanceof SyntaxError && action !== 'release') return { locked: true, acquired: false, owner: 'initializing-or-unreadable' };
    throw error;
  }
  if (action === 'release') {
    if (lock.owner !== owner) throw new Error('Owner mismatch; lock was not released.');
    await unlink(file);
    return { released: true, owner };
  }
  return { locked: true, acquired: false, ...lock, ageHours: (Date.now() - Date.parse(lock.acquiredAt)) / 3600000 };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const common = execFileSync('git', ['rev-parse', '--git-common-dir'], { encoding: 'utf8' }).trim();
    const result = await manageLock(path.resolve(common, 'seo-pipeline.lock'), process.argv[2], process.argv[3]);
    console.log(JSON.stringify(result));
    if (process.argv[2] === 'acquire' && !result.acquired) process.exitCode = 2;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
