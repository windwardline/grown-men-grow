import test from 'node:test';
import assert from 'node:assert/strict';

import { slotEpochMs, slotVerdict, zonedDayParts } from '../lib/note-slot.mjs';

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
