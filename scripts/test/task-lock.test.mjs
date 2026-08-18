import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';

import { acquireTaskLock, releaseTaskLock, inspectTaskLock } from '../lib/task-lock.mjs';

function scratch(t) {
  const dir = mkdtempSync(path.join(tmpdir(), 'gmg-lock-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  return dir;
}

const HOUR = 60 * 60 * 1000;

test('the first run acquires and the second is refused', (t) => {
  const dir = scratch(t);
  const first = acquireTaskLock({ task: 'gmg-tuesday-note', dir, ttlMs: HOUR, epochMs: 1000, holder: 'run-a' });
  assert.equal(first.acquired, true);
  assert.match(first.token, /^[0-9a-f]{32}$/);

  // The 2026-08-18 defect: a run firing early and a run firing on schedule were
  // live at once against the same public profile. Only a re-read of the profile
  // stopped a double post.
  const second = acquireTaskLock({ task: 'gmg-tuesday-note', dir, ttlMs: HOUR, epochMs: 2000, holder: 'run-b' });
  assert.equal(second.acquired, false);
  assert.equal(second.reason, 'held');
  assert.equal(second.heldBy.holder, 'run-a');
  assert.equal(second.heldBy.expiresAtMs, 1000 + HOUR);
});

test('a holder releases with its token and the lock frees', (t) => {
  const dir = scratch(t);
  const { token } = acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: 0, holder: 'a' });
  assert.deepEqual(releaseTaskLock({ task: 'note', dir, token }), { released: true });
  assert.equal(inspectTaskLock({ task: 'note', dir, epochMs: 1 }), null);
  assert.equal(acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: 1, holder: 'b' }).acquired, true);
});

test('a foreign token cannot release someone else lock', (t) => {
  const dir = scratch(t);
  acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: 0, holder: 'a' });
  const result = releaseTaskLock({ task: 'note', dir, token: 'f'.repeat(32) });
  assert.equal(result.released, false);
  assert.equal(result.reason, 'token-mismatch');
  assert.equal(inspectTaskLock({ task: 'note', dir, epochMs: 1 }).holder, 'a');
});

test('an expired lock is taken over and its old token goes dead', (t) => {
  const dir = scratch(t);
  const stale = acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: 0, holder: 'crashed' });
  const fresh = acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: HOUR + 1, holder: 'next' });
  assert.equal(fresh.acquired, true);
  assert.equal(fresh.takenOverFrom, 'crashed');
  assert.notEqual(fresh.token, stale.token);
  assert.equal(releaseTaskLock({ task: 'note', dir, token: stale.token }).released, false);
});

test('a lock exactly at its expiry is still held', (t) => {
  const dir = scratch(t);
  acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: 0, holder: 'a' });
  assert.equal(acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: HOUR, holder: 'b' }).acquired, false);
});

test('different tasks do not block each other', (t) => {
  const dir = scratch(t);
  assert.equal(acquireTaskLock({ task: 'gmg-tuesday-note', dir, ttlMs: HOUR, epochMs: 0, holder: 'a' }).acquired, true);
  assert.equal(acquireTaskLock({ task: 'gmg-saturday-note', dir, ttlMs: HOUR, epochMs: 0, holder: 'b' }).acquired, true);
});

test('a task name that would escape the lock directory is refused', (t) => {
  const dir = scratch(t);
  for (const task of ['../escape', 'a/b', '', '.', 'a\0b']) {
    assert.throws(() => acquireTaskLock({ task, dir, ttlMs: HOUR, epochMs: 0, holder: 'a' }), /task name/i, `${JSON.stringify(task)} should throw`);
  }
});

test('releasing a lock that is not there reports it rather than throwing', (t) => {
  const dir = scratch(t);
  assert.deepEqual(releaseTaskLock({ task: 'note', dir, token: '0'.repeat(32) }), { released: false, reason: 'absent' });
});

test('a corrupt lock file is treated as stale rather than wedging the task forever', (t) => {
  const dir = scratch(t);
  acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: 0, holder: 'a' });
  writeFileSync(path.join(dir, 'note.lock'), '{ this is not json');
  const result = acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: 1, holder: 'b' });
  assert.equal(result.acquired, true);
  assert.equal(result.takenOverFrom, 'unreadable');
});

test('the lock file names its holder in plain text for a human debugging it', (t) => {
  const dir = scratch(t);
  acquireTaskLock({ task: 'note', dir, ttlMs: HOUR, epochMs: 0, holder: 'session-xyz' });
  const written = JSON.parse(readFileSync(path.join(dir, 'note.lock'), 'utf8'));
  assert.equal(written.holder, 'session-xyz');
  assert.equal(written.task, 'note');
});
