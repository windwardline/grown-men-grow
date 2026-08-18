// A cross-process mutex for the weekly scheduled tasks.
//
// On 2026-08-18 two runs of `gmg-tuesday-note` were live at the same moment —
// one that fired early and one that fired on schedule — sharing this
// repository's working tree and pointed at the same public Substack profile.
// Nothing in the task design made either aware of the other. The only thing
// that prevented the same note being posted twice was one run re-reading the
// profile immediately before opening the composer.
//
// That re-read stays (it defends against a human or an earlier week too). This
// lock removes the case where it is the sole defense: a second run now refuses
// at its first step and says who holds the lock.
//
// Deliberately a file, not a daemon: it must survive the agent process, be
// readable by a human mid-incident, and never leave a task wedged. Every
// failure mode — crash, corruption, a forgotten release — expires.

import { randomBytes } from 'node:crypto';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { homedir } from 'node:os';
import path from 'node:path';

export const DEFAULT_LOCK_DIR =
  process.env.GMG_TASK_LOCK_DIR ?? path.join(homedir(), '.claude', 'scheduled-tasks', '.locks');

const SAFE_TASK_NAME = /^[a-z0-9][a-z0-9._-]*$/i;

function lockPath(task, dir) {
  if (typeof task !== 'string' || !SAFE_TASK_NAME.test(task) || task === '.' || task === '..') {
    throw new TypeError(`Invalid task name ${JSON.stringify(task)}; expected letters, digits, dot, dash or underscore.`);
  }
  return path.join(dir, `${task}.lock`);
}

function readLock(file) {
  try {
    return { state: 'present', record: JSON.parse(readFileSync(file, 'utf8')) };
  } catch (error) {
    if (error.code === 'ENOENT') return { state: 'absent' };
    // Unparseable, truncated, or unreadable. Never let a damaged file hold a
    // weekly publication task hostage until someone notices by hand.
    return { state: 'unreadable' };
  }
}

function isLive(record, epochMs) {
  return Number.isFinite(record?.expiresAtMs) && epochMs <= record.expiresAtMs;
}

/**
 * Take the lock for `task`, or report who holds it.
 *
 * @returns {{acquired: true, token: string, expiresAtMs: number, takenOverFrom?: string}
 *          |{acquired: false, reason: 'held', heldBy: object}}
 */
export function acquireTaskLock({ task, dir = DEFAULT_LOCK_DIR, ttlMs, epochMs = Date.now(), holder = 'unnamed' }) {
  const file = lockPath(task, dir);
  if (!Number.isFinite(ttlMs) || ttlMs <= 0) throw new TypeError(`Invalid ttlMs ${JSON.stringify(ttlMs)}.`);
  mkdirSync(dir, { recursive: true });

  const record = {
    task,
    holder,
    token: randomBytes(16).toString('hex'),
    acquiredAtMs: epochMs,
    acquiredAt: new Date(epochMs).toISOString(),
    expiresAtMs: epochMs + ttlMs,
    expiresAt: new Date(epochMs + ttlMs).toISOString(),
  };

  const write = () => writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, { flag: 'wx' });

  try {
    write();
    return { acquired: true, token: record.token, expiresAtMs: record.expiresAtMs };
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
  }

  const existing = readLock(file);
  if (existing.state === 'present' && isLive(existing.record, epochMs)) {
    return { acquired: false, reason: 'held', heldBy: existing.record };
  }

  // Stale or damaged. Clear it and claim once; if that race is lost, the winner
  // holds a live lock and this run refuses, which is the safe direction.
  const takenOverFrom = existing.state === 'unreadable' ? 'unreadable' : (existing.record?.holder ?? 'unknown');
  rmSync(file, { force: true });
  try {
    write();
  } catch (error) {
    if (error.code !== 'EEXIST') throw error;
    const winner = readLock(file);
    return { acquired: false, reason: 'held', heldBy: winner.record ?? { holder: 'unknown' } };
  }
  return { acquired: true, token: record.token, expiresAtMs: record.expiresAtMs, takenOverFrom };
}

/** Release only if `token` matches the live holder. */
export function releaseTaskLock({ task, dir = DEFAULT_LOCK_DIR, token }) {
  const file = lockPath(task, dir);
  const existing = readLock(file);
  if (existing.state === 'absent') return { released: false, reason: 'absent' };
  if (existing.state === 'unreadable') {
    rmSync(file, { force: true });
    return { released: true };
  }
  if (existing.record.token !== token) return { released: false, reason: 'token-mismatch' };
  rmSync(file, { force: true });
  return { released: true };
}

/** The live lock record, or null when nothing holds it. */
export function inspectTaskLock({ task, dir = DEFAULT_LOCK_DIR, epochMs = Date.now() }) {
  const existing = readLock(lockPath(task, dir));
  if (existing.state !== 'present' || !isLive(existing.record, epochMs)) return null;
  return existing.record;
}
