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
  assert.throws(() => at('2026-08-22T13:30:00Z', { note: 99 }), /Note 99/);
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

// --- the wrong day ---------------------------------------------------------
// 2026-09-20: `gmg-saturday-note` fired on Sunday because the desktop app had
// been closed all Saturday evening. The essay precondition passes on a Sunday —
// it is inside the week its Tuesday essay opened — so the day was checked by
// nothing at all, and the clock alone decided.
test('a wrong-day run stands down even where the clock would have said post', () => {
  // Sunday 2026-08-23 13:30Z is 09:30 ET — the 09:30 slot exactly, to the minute.
  const clockPerfect = at('2026-08-23T13:30:00Z');
  assert.equal(clockPerfect.verdict, 'post', 'precondition: the day-blind reading posts');

  const guarded = at('2026-08-23T13:30:00Z', { slotWeekday: 6 });
  assert.equal(guarded.verdict, 'stand-down');
  assert.match(guarded.reason, /Sunday/);
  assert.match(guarded.reason, /Saturday/);
});

test('a wrong-day stand-down still carries the copy, so the founder can post it', () => {
  // The lateness stand-down carries copy for exactly this reason; a run that
  // refuses the slot has not stopped being able to hand the note over.
  const guarded = at('2026-08-23T13:30:00Z', { slotWeekday: 6 });
  assert.equal(guarded.verdict, 'stand-down');
  assert.equal(guarded.essay.slug, ESSAY.slug);
  assert.ok(guarded.copy.length > 0);
});

test('a wrong-day run against last week’s essay still fails on the essay first', () => {
  const guarded = at('2026-08-23T13:30:00Z', { slotWeekday: 6, post: STALE });
  assert.equal(guarded.verdict, 'stand-down');
  assert.match(guarded.reason, /essay has not published/);
  assert.equal(guarded.essay, undefined, 'the wrong week must never reach a payload');
});

test('the weekday guard changes nothing for a run on its own day', () => {
  for (const [iso, expected] of [['2026-08-22T13:30:00Z', 'post'], ['2026-08-22T12:30:00Z', 'wait'], ['2026-08-22T15:00:00Z', 'stand-down']]) {
    assert.equal(at(iso).verdict, expected, `${iso} baseline`);
    assert.equal(at(iso, { slotWeekday: 6 }).verdict, expected, `${iso} guarded`);
  }
});
