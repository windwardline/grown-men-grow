import test from 'node:test';
import assert from 'node:assert/strict';

import {
  publicationWeekStartMs,
  publishedThisPublicationWeek,
  slotEpochMs,
  slotVerdict,
  zonedDayParts,
} from '../lib/note-slot.mjs';

const ET = 'America/New_York';

// Epoch helpers. A slot is a wall-clock time in the publication's zone, so the
// UTC instant it names moves with daylight saving. Both sides of the boundary
// are pinned here because getting this wrong shifts every verdict by an hour.
test('slotEpochMs resolves a wall-clock slot through daylight saving', () => {
  const august = Date.parse('2026-08-18T14:30:00Z'); // 10:30 EDT, UTC-4
  assert.equal(slotEpochMs({ epochMs: august, slot: '12:00', timeZone: ET }), Date.parse('2026-08-18T16:00:00Z'));

  const january = Date.parse('2026-01-20T15:30:00Z'); // 10:30 EST, UTC-5
  assert.equal(slotEpochMs({ epochMs: january, slot: '12:00', timeZone: ET }), Date.parse('2026-01-20T17:00:00Z'));
});

test('slotEpochMs anchors to the zone day, not the UTC day', () => {
  // 00:30 UTC on the 19th is still the evening of the 18th in New York.
  const lateEvening = Date.parse('2026-08-19T00:30:00Z');
  assert.deepEqual(zonedDayParts(lateEvening, ET), { year: 2026, month: 8, day: 18 });
  assert.equal(slotEpochMs({ epochMs: lateEvening, slot: '12:00', timeZone: ET }), Date.parse('2026-08-18T16:00:00Z'));
});

// The defect this file exists for: on 2026-08-18 a run fired at 10:53 ET
// against a 12:00 slot. The guard of the day only covered lateness, so a
// literal reading permitted posting 67 minutes early.
test('an early run waits rather than posting', () => {
  const verdict = slotVerdict({ epochMs: Date.parse('2026-08-18T14:53:00Z'), slot: '12:00', timeZone: ET });
  assert.equal(verdict.verdict, 'wait');
  assert.equal(verdict.waitMs, 67 * 60 * 1000);
  assert.equal(verdict.offsetMinutes, -67);
});

test('the slot itself and the whole grace window post', () => {
  for (const [iso, offset] of [['2026-08-18T16:00:00Z', 0], ['2026-08-18T16:01:00Z', 1], ['2026-08-18T16:59:00Z', 59], ['2026-08-18T17:00:00Z', 60]]) {
    const verdict = slotVerdict({ epochMs: Date.parse(iso), slot: '12:00', timeZone: ET });
    assert.equal(verdict.verdict, 'post', `${iso} should post`);
    assert.equal(verdict.offsetMinutes, offset);
    assert.equal(verdict.waitMs, 0);
  }
});

test('past the grace window it stands down', () => {
  const verdict = slotVerdict({ epochMs: Date.parse('2026-08-18T17:01:00Z'), slot: '12:00', timeZone: ET });
  assert.equal(verdict.verdict, 'stand-down');
  assert.equal(verdict.offsetMinutes, 61);
});

test('the 2026-08-16 six-hour late fire stands down', () => {
  // gmg-saturday-note ran at 15:39 ET against a 09:15 slot.
  const verdict = slotVerdict({ epochMs: Date.parse('2026-08-16T19:39:00Z'), slot: '09:15', timeZone: ET });
  assert.equal(verdict.verdict, 'stand-down');
  assert.equal(verdict.offsetMinutes, 384);
});

test('the grace window is configurable and zero grace still posts on the minute', () => {
  const onTime = slotVerdict({ epochMs: Date.parse('2026-08-18T16:00:00Z'), slot: '12:00', graceMinutes: 0, timeZone: ET });
  assert.equal(onTime.verdict, 'post');
  const aMinuteLate = slotVerdict({ epochMs: Date.parse('2026-08-18T16:01:00Z'), slot: '12:00', graceMinutes: 0, timeZone: ET });
  assert.equal(aMinuteLate.verdict, 'stand-down');
});

test('a malformed slot is refused rather than silently defaulted', () => {
  for (const slot of ['noon', '25:00', '12:60', '1200', '', undefined]) {
    assert.throws(() => slotVerdict({ epochMs: Date.now(), slot, timeZone: ET }), /slot/i, `${slot} should throw`);
  }
});

// --- the publication week -------------------------------------------------
// `gmg-saturday-note` could never pass its essay precondition. The preflight
// required the latest published essay to have published *today*; essays publish
// Tuesday and Note 2's slot is Saturday, so the check was unsatisfiable at that
// slot and the task stood down every week from the day it was written.
//
// The contract it was meant to enforce is in `operating-cadence.md`: refuse
// "when the week's essay did not publish". So the question is which publication
// week an instant falls in, anchored on the publish day rather than on today.

test('the publication week of a Saturday is the Tuesday that opened it', () => {
  const saturday = Date.parse('2026-08-22T13:30:00Z'); // Note 2's slot, 09:30 EDT
  assert.equal(publicationWeekStartMs({ epochMs: saturday, timeZone: ET }), Date.parse('2026-08-18T04:00:00Z'));
});

test('the publication day belongs to its own week from midnight, not from the publish time', () => {
  // Anchoring on the day rather than on 08:00 keeps a minute of scheduler jitter
  // either side of the publish time from throwing the essay out of its own week.
  const beforePublish = Date.parse('2026-08-18T11:00:00Z'); // 07:00 EDT
  const afterPublish = Date.parse('2026-08-18T16:00:00Z'); // 12:00 EDT, Note 1's slot
  const weekStart = Date.parse('2026-08-18T04:00:00Z');
  assert.equal(publicationWeekStartMs({ epochMs: beforePublish, timeZone: ET }), weekStart);
  assert.equal(publicationWeekStartMs({ epochMs: afterPublish, timeZone: ET }), weekStart);
});

test('the day before the next publish day still belongs to the previous week', () => {
  const monday = Date.parse('2026-08-24T13:00:00Z'); // 09:00 EDT, the Monday staging slot
  assert.equal(publicationWeekStartMs({ epochMs: monday, timeZone: ET }), Date.parse('2026-08-18T04:00:00Z'));
});

test('the publication week resolves through standard time as well as daylight time', () => {
  const januarySaturday = Date.parse('2026-01-24T14:30:00Z'); // 09:30 EST, UTC-5
  assert.equal(publicationWeekStartMs({ epochMs: januarySaturday, timeZone: ET }), Date.parse('2026-01-20T05:00:00Z'));
});

test('a publish weekday outside 0-6 is refused rather than silently wrapped', () => {
  const now = Date.parse('2026-08-22T13:30:00Z');
  assert.throws(() => publicationWeekStartMs({ epochMs: now, publishWeekday: 7, timeZone: ET }), TypeError);
  assert.throws(() => publicationWeekStartMs({ epochMs: now, publishWeekday: 1.5, timeZone: ET }), TypeError);
});

// The regression itself, stated as the two slots that share the preflight.
const ESSAY = Date.parse('2026-08-18T12:00:00Z'); // Field Note 2, Tuesday 08:00 EDT

test("Note 2's Saturday slot accepts the Tuesday essay it is a fragment of", () => {
  assert.equal(
    publishedThisPublicationWeek({ publishedAtMs: ESSAY, epochMs: Date.parse('2026-08-22T13:30:00Z'), timeZone: ET }),
    true,
  );
});

test("Note 1's Tuesday slot still accepts the essay published four hours earlier", () => {
  assert.equal(
    publishedThisPublicationWeek({ publishedAtMs: ESSAY, epochMs: Date.parse('2026-08-18T16:00:00Z'), timeZone: ET }),
    true,
  );
});

test('a week whose essay never published is refused at both slots', () => {
  const lastWeeksEssay = Date.parse('2026-08-11T12:00:00Z');
  assert.equal(
    publishedThisPublicationWeek({ publishedAtMs: lastWeeksEssay, epochMs: Date.parse('2026-08-18T16:00:00Z'), timeZone: ET }),
    false,
  );
  assert.equal(
    publishedThisPublicationWeek({ publishedAtMs: lastWeeksEssay, epochMs: Date.parse('2026-08-22T13:30:00Z'), timeZone: ET }),
    false,
  );
});

test('an essay published exactly at the week boundary is inside the week', () => {
  const boundary = Date.parse('2026-08-18T04:00:00Z');
  assert.equal(
    publishedThisPublicationWeek({ publishedAtMs: boundary, epochMs: Date.parse('2026-08-22T13:30:00Z'), timeZone: ET }),
    true,
  );
});
