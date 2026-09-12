import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseRegister, reconcileNotes, STATES } from '../lib/substack-notes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const register = path.join(root, 'docs', 'technical', 'substack-notes.md');

const TABLE = `
| Essay | Note | Slot (ET) | State | Permalink |
|---|---|---|---|---|
| \`essay-one\` | 1 | 2026-09-08 12:00 | posted | \`c-1001\` |
| \`essay-one\` | 2 | 2026-09-12 18:30 | posted | \`c-1002\` |
| \`essay-two\` | 1 | 2026-09-15 12:00 | missed |  |
| \`essay-two\` | 2 | 2026-09-19 18:30 |  |  |
`;

const COPY = {
  'essay-one#1': 'First note, verbatim.',
  'essay-one#2': 'Second note, verbatim.',
  'essay-two#1': 'Third note, verbatim.',
  'essay-two#2': 'Fourth note, verbatim.',
};

const LIVE = [
  { id: '1001', date: '2026-09-08T16:00:00.000Z', body: 'First note, verbatim.' },
  { id: '1002', date: '2026-09-12T22:46:15.000Z', body: 'Second note, verbatim.' },
];

test('rows are derived from the table, with state and permalink', () => {
  const rows = parseRegister(TABLE);
  assert.deepEqual(rows.map((r) => r.essay), ['essay-one', 'essay-one', 'essay-two', 'essay-two']);
  assert.deepEqual(rows.map((r) => r.note), [1, 2, 1, 2]);
  assert.deepEqual(rows.map((r) => r.state), ['posted', 'posted', 'missed', '']);
  assert.deepEqual(rows.map((r) => r.permalink), ['c-1001', 'c-1002', '', '']);
});

test('a register that yields no rows is a failure, not an empty pass', () => {
  assert.throws(() => parseRegister('# Substack notes\n\nNo table here.\n'), /no register rows/i);
});

test('an unreadable state cannot be reconciled and is refused at parse', () => {
  const bad = TABLE.replace('| posted | `c-1001` |', '| published | `c-1001` |');
  assert.throws(() => parseRegister(bad), /not one of/i);
});

test('the same essay and note number may not appear twice', () => {
  const dupe = `${TABLE}| \`essay-one\` | 1 | 2026-09-08 12:00 | posted | \`c-9999\` |\n`;
  assert.throws(() => parseRegister(dupe), /more than once/i);
});

test('a posted row must name a permalink', () => {
  const bare = TABLE.replace('| posted | `c-1001` |', '| posted |  |');
  const rows = parseRegister(bare);
  const { failures } = reconcileNotes({ rows, copy: COPY, live: LIVE });
  assert.ok(failures.some((f) => /names no permalink/i.test(f)), failures.join('\n'));
});

test('a clean register reconciles with no failures', () => {
  const { failures, examined } = reconcileNotes({ rows: parseRegister(TABLE), copy: COPY, live: LIVE });
  assert.deepEqual(failures, []);
  assert.equal(examined, 4);
});

test('a posted row whose permalink the feed does not carry fails', () => {
  const rows = parseRegister(TABLE);
  const live = LIVE.filter((n) => n.id !== '1002');
  const { failures } = reconcileNotes({ rows, copy: COPY, live });
  assert.ok(failures.some((f) => /c-1002/.test(f) && /feed/i.test(f)), failures.join('\n'));
});

test('a posted note whose live text differs from the pack fails as a verbatim breach', () => {
  const rows = parseRegister(TABLE);
  const live = LIVE.map((n) => (n.id === '1002' ? { ...n, body: 'Second note, improved.' } : n));
  const { failures } = reconcileNotes({ rows, copy: COPY, live });
  assert.ok(failures.some((f) => /verbatim/i.test(f)), failures.join('\n'));
});

test('a trailing space in the live text is still a verbatim breach, not a near-enough match', () => {
  const rows = parseRegister(TABLE);
  const live = LIVE.map((n) => (n.id === '1001' ? { ...n, body: 'First note, verbatim. ' } : n));
  const { failures } = reconcileNotes({ rows, copy: COPY, live });
  assert.ok(failures.some((f) => /verbatim/i.test(f)), failures.join('\n'));
});

// The bug this whole register exists for. On 2026-09-08 and again on
// 2026-09-12 the handoff log asserted a note was unposted, merged that claim to
// main, and the founder posted minutes later. Nothing could detect it, because
// the only record of what had happened was the sentence that was wrong.
test('a pending row whose copy is already live fails as a stale register', () => {
  const rows = parseRegister(TABLE);
  const live = [...LIVE, { id: '1004', date: '2026-09-19T22:46:00.000Z', body: 'Fourth note, verbatim.' }];
  const { failures } = reconcileNotes({ rows, copy: COPY, live });
  assert.ok(failures.some((f) => /essay-two/.test(f) && /c-1004/.test(f)), failures.join('\n'));
});

test('a row recorded as missed that actually went out fails the same way', () => {
  const rows = parseRegister(TABLE);
  const live = [...LIVE, { id: '1003', date: '2026-09-15T16:00:00.000Z', body: 'Third note, verbatim.' }];
  const { failures } = reconcileNotes({ rows, copy: COPY, live });
  assert.ok(failures.some((f) => /essay-two/.test(f) && /c-1003/.test(f)), failures.join('\n'));
});

test('a row whose approved copy could not be resolved fails as unchecked, never as absent', () => {
  const rows = parseRegister(TABLE);
  const { 'essay-two#2': _dropped, ...partial } = COPY;
  const { failures } = reconcileNotes({ rows, copy: partial, live: LIVE });
  assert.ok(failures.some((f) => /essay-two/.test(f) && /approved copy/i.test(f)), failures.join('\n'));
});

test('a feed that could not be read is refused rather than treated as an empty feed', () => {
  const rows = parseRegister(TABLE);
  assert.throws(() => reconcileNotes({ rows, copy: COPY, live: null }), /feed/i);
});

test('lateness is derived from the slot and reported, not failed on', () => {
  const { failures, late } = reconcileNotes({ rows: parseRegister(TABLE), copy: COPY, live: LIVE });
  assert.deepEqual(failures, []);
  const second = late.find((l) => l.permalink === 'c-1002');
  assert.equal(second.minutes, 16);
  const first = late.find((l) => l.permalink === 'c-1001');
  assert.equal(first.minutes, 0);
});

// Launch week ran before the cadence table governed anything, so those notes
// had no scheduled slot. Recording a slot for them to make the column uniform
// would be inventing the fact the column exists to carry.
test('a row with no scheduled slot parses, and is measured for lateness against nothing', () => {
  const table = TABLE.replace('| 2026-09-08 12:00 |', '| \u2014 |');
  const rows = parseRegister(table);
  assert.equal(rows[0].slot, '\u2014');
  const { failures, late } = reconcileNotes({ rows, copy: COPY, live: LIVE });
  assert.deepEqual(failures, []);
  assert.equal(late.find((l) => l.permalink === 'c-1001'), undefined);
  assert.ok(late.find((l) => l.permalink === 'c-1002'), 'slotted rows are still measured');
});

test('the real register parses and every state in it is legal', () => {
  const rows = parseRegister(readFileSync(register, 'utf8'));
  assert.ok(rows.length >= 2, `expected the live register, saw ${rows.length}`);
  for (const row of rows) assert.ok(STATES.has(row.state));
});
