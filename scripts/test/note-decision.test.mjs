import test from 'node:test';
import assert from 'node:assert/strict';

import { decide } from '../lib/note-decision.mjs';

const ET = 'America/New_York';

// The regression this file guards did not live in the arithmetic. It lived in
// the four lines of `note-task-preflight.mjs` that wired the arithmetic up, and
// 34 passing tests said nothing about a task that stood down every week.
// `note-slot.test.mjs` proves the predicate; this file proves the wiring, at the
// granularity the tasks actually read — the verdict.

// Field Note 2, published Tuesday 2026-08-18 08:00 EDT. Its pack is tracked, so
// the copy assertions run against the approved text rather than a fixture.
const ESSAY = {
  title: 'Call Your Friends Before There’s a Reason',
  slug: 'call-your-friends-before-theres-a-reason',
  url: 'https://grownmengrow.com/call-your-friends-before-theres-a-reason/',
  published_at: '2026-08-18T12:00:00.000Z',
};
const STALE = { ...ESSAY, published_at: '2026-08-11T12:00:00.000Z' };

const at = (iso, over = {}) => decide({
  epochMs: Date.parse(iso), slot: '09:30', note: 2, graceMinutes: 60,
  timeZone: ET, post: ESSAY, ...over,
});

test('Note 2 posts at the Saturday slot from the Tuesday essay it belongs to', () => {
  const d = at('2026-08-22T13:30:00Z');
  assert.equal(d.verdict, 'post');
  assert.equal(d.essay.slug, ESSAY.slug);
  assert.match(d.pack, /field-note-02-platforms\.md$/);
  assert.ok(d.copy.length > 0);
});

test('Note 1 posts at the Tuesday slot four hours after the essay', () => {
  const d = at('2026-08-18T16:00:00Z', { slot: '12:00', note: 1 });
  assert.equal(d.verdict, 'post');
  assert.equal(d.essay.slug, ESSAY.slug);
});

test('the two notes of a week are different copy', () => {
  const one = at('2026-08-18T16:00:00Z', { slot: '12:00', note: 1 }).copy;
  const two = at('2026-08-22T13:30:00Z').copy;
  assert.notEqual(one, two);
});

// Inverting the essay check, or transposing its two instants, flips this one.
test('a week whose essay never published stands down at the Saturday slot', () => {
  const d = at('2026-08-22T13:30:00Z', { post: STALE });
  assert.equal(d.verdict, 'stand-down');
  assert.match(d.reason, /essay has not published/);
  assert.equal(d.copy, undefined);
});

test('a week whose essay never published stands down at the Tuesday slot too', () => {
  const d = at('2026-08-18T16:00:00Z', { slot: '12:00', note: 1, post: STALE });
  assert.equal(d.verdict, 'stand-down');
  assert.match(d.reason, /essay has not published/);
});

test('the essay check runs before the copy is lifted', () => {
  // A stale essay must not resolve a pack; the note it would carry is a
  // fragment of the wrong week and must never reach a payload.
  const d = at('2026-08-22T13:30:00Z', { post: STALE });
  assert.equal(d.pack, undefined);
});

test('a late run stands down on the window with the essay still valid', () => {
  const d = at('2026-08-22T19:00:00Z');
  assert.equal(d.verdict, 'stand-down');
  assert.match(d.reason, /past the 09:30 slot/);
  assert.equal(d.essay.slug, ESSAY.slug); // it got past the essay check
});

test('an early run waits and reports how long', () => {
  const d = at('2026-08-22T13:00:00Z');
  assert.equal(d.verdict, 'wait');
  assert.equal(d.timing.waitMs, 30 * 60 * 1000);
});

test('a note number the pack does not carry is an error, not an empty post', () => {
  assert.throws(() => at('2026-08-22T13:30:00Z', { note: 99 }));
});

// `latestPublishedPost()` documents itself as returning null when nothing has
// published. Nothing having published is a decidable stand-down, not a preflight
// that could not decide — the exit-code contract makes that 20, never 1.
test('nothing published yet stands down, and says so distinctly', () => {
  const d = at('2026-08-22T13:30:00Z', { post: null });
  assert.equal(d.verdict, 'stand-down');
  assert.match(d.reason, /nothing has published/);
  assert.doesNotMatch(d.reason, /this week's essay has not published/);
});

// NaN >= anything is false, so an unparseable date would otherwise report the
// exact reason string a genuinely essay-less week reports. A post that exists
// but cannot be dated is a broken input, and it has to say so.
test('a post whose date cannot be parsed raises rather than reading as no essay', () => {
  assert.throws(
    () => at('2026-08-22T13:30:00Z', { post: { slug: 's', published_at: 'not-a-date' } }),
    /published_at/,
  );
});

test('a post missing published_at entirely raises too', () => {
  assert.throws(() => at('2026-08-22T13:30:00Z', { post: { slug: 's' } }), /published_at/);
});
