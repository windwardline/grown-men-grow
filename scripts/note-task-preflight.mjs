#!/usr/bin/env node
// Preflight for the weekly Substack note tasks (gmg-tuesday-note, gmg-saturday-note).
//
// Every precondition those tasks are supposed to check, evaluated in one place
// and answered with an exit code, so an agent cannot proceed by reading past a
// paragraph. What it does NOT check is whether the note is already on the
// profile: that needs the browser, it is the last thing to verify before the
// composer opens, and it must be re-read after any wait. See the task files.
//
// Exit codes
//   0   post now
//   10  wait — `waitSeconds` in the payload, then re-verify the profile
//   20  stand down — `reason` says why; nothing is posted this week
//   1   the preflight itself could not decide
//
// Usage
//   node scripts/note-task-preflight.mjs --task gmg-tuesday-note --slot 12:00 --note 1
//   node scripts/note-task-preflight.mjs --task gmg-tuesday-note --release <token>

import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { acquireTaskLock, releaseTaskLock, DEFAULT_LOCK_DIR } from './lib/task-lock.mjs';
import { parseHold } from './lib/hold-state.mjs';
import { slotVerdict, zonedDayParts, DEFAULT_GRACE_MINUTES, DEFAULT_TIME_ZONE } from './lib/note-slot.mjs';
import { resolvePackForSlug, extractNote } from './lib/note-pack.mjs';
import { latestPublishedPost } from './lib/ghost-admin.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CADENCE = path.join(root, 'docs', 'technical', 'operating-cadence.md');

const EXIT = { post: 0, error: 1, wait: 10, standDown: 20 };

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) throw new Error(`Unexpected argument "${token}".`);
    const key = token.slice(2);
    const value = argv[i + 1];
    if (value === undefined || value.startsWith('--')) throw new Error(`Option --${key} needs a value.`);
    args[key] = value;
    i += 1;
  }
  return args;
}

// The task posts through the founder logged-in Chrome, so the browser being up
// is a precondition — and on 2026-08-18 it was down, which nothing had written
// anywhere. Reported rather than fatal: launching Chrome fixes it.
function isChromeRunning() {
  const result = spawnSync('pgrep', ['-x', 'Google Chrome'], { encoding: 'utf8' });
  return result.status === 0;
}

function emit(payload, code) {
  process.stdout.write(`${JSON.stringify(payload, null, 2)}\n`);
  process.exit(code);
}

const args = parseArgs(process.argv.slice(2));
const task = args.task;
if (!task) emit({ ok: false, error: '--task is required.' }, EXIT.error);
const lockDir = args['lock-dir'] ?? DEFAULT_LOCK_DIR;

// --- release ---------------------------------------------------------------
if (args.release) {
  const result = releaseTaskLock({ task, dir: lockDir, token: args.release });
  const ok = result.released || result.reason === 'absent';
  emit({ ok, task, ...result }, ok ? EXIT.post : EXIT.error);
}

// --- evaluate --------------------------------------------------------------
const slot = args.slot;
const note = Number(args.note ?? 1);
const graceMinutes = args['grace-minutes'] === undefined ? DEFAULT_GRACE_MINUTES : Number(args['grace-minutes']);
const timeZone = args['time-zone'] ?? DEFAULT_TIME_ZONE;
const epochMs = args.now ? Date.parse(args.now) : Date.now();
const holder = args.holder ?? `pid-${process.pid}`;

let held = null;
function standDown(reason, extra = {}) {
  if (held) releaseTaskLock({ task, dir: lockDir, token: held.token });
  emit({ ok: false, task, verdict: 'stand-down', reason, ...extra }, EXIT.standDown);
}

try {
  if (!Number.isFinite(epochMs)) throw new Error(`Could not parse --now ${JSON.stringify(args.now)}.`);

  // 1. The hold. Cheapest, most absolute, and it must not even take the lock.
  const hold = parseHold(readFileSync(CADENCE, 'utf8'));
  if (hold.held) standDown('the week is held', { hold: hold.reason });

  // 2. The lock. Before any network call, so two runs cannot race through it.
  //    TTL runs to the far edge of the posting window plus a margin, so a run
  //    that dies mid-wait frees the task rather than wedging it past its slot.
  const timing = slotVerdict({ epochMs, slot, graceMinutes, timeZone });
  const ttlMs = Math.min(4 * 60 * 60_000, Math.max(15 * 60_000, timing.slotEpochMs + graceMinutes * 60_000 + 15 * 60_000 - epochMs));
  const lock = acquireTaskLock({ task, dir: lockDir, ttlMs, epochMs, holder });
  if (!lock.acquired) {
    emit(
      {
        ok: false,
        task,
        verdict: 'stand-down',
        reason: 'another run of this task holds the lock',
        heldBy: { holder: lock.heldBy.holder, acquiredAt: lock.heldBy.acquiredAt, expiresAt: lock.heldBy.expiresAt },
      },
      EXIT.standDown,
    );
  }
  held = lock;

  // 3. The essay. A note is a fragment of a fresh essay; without one it means nothing.
  const post = await latestPublishedPost();
  const today = zonedDayParts(epochMs, timeZone);
  const publishedDay = zonedDayParts(Date.parse(post.published_at), timeZone);
  const sameDay = today.year === publishedDay.year && today.month === publishedDay.month && today.day === publishedDay.day;
  if (!sameDay) {
    standDown("this week's essay has not published", {
      latestPublished: { slug: post.slug, publishedAt: post.published_at },
    });
  }

  // 4. The copy, from the approved pack, verbatim.
  const pack = resolvePackForSlug({ slug: post.slug });
  const copy = extractNote(readFileSync(pack, 'utf8'), note);

  const payload = {
    ok: timing.verdict !== 'stand-down',
    task,
    verdict: timing.verdict,
    slot,
    offsetMinutes: timing.offsetMinutes,
    graceMinutes,
    waitSeconds: Math.ceil(timing.waitMs / 1000),
    lock: { token: lock.token, expiresAt: new Date(lock.expiresAtMs).toISOString(), dir: lockDir },
    essay: { title: post.title, slug: post.slug, url: post.url, publishedAt: post.published_at },
    pack: path.relative(root, pack),
    note,
    copy,
    hold: hold.reason,
    browser: { chromeRunning: isChromeRunning() },
  };

  // 5. The window.
  if (timing.verdict === 'stand-down') {
    standDown(`${timing.offsetMinutes} minutes past the ${slot} slot, beyond the ${graceMinutes}-minute grace window`, payload);
  }
  emit(payload, timing.verdict === 'wait' ? EXIT.wait : EXIT.post);
} catch (error) {
  if (held) releaseTaskLock({ task, dir: lockDir, token: held.token });
  emit({ ok: false, task, error: error.message }, EXIT.error);
}
