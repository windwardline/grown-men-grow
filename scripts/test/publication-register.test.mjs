import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseRegister, reconcileRegister, recordPublished } from '../lib/publication-register.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const register = path.join(root, 'docs', 'technical', 'publication-order.md');

const TABLE = `
| # | Slug | Projected | State |
|---|---|---|---|
| — | \`essay-one\` | 2026-08-09 | published |
| 1 | \`note-one\` | 2026-08-18 | published |
| 2 | \`note-two\` | 2026-09-08 | scheduled |
| 3 | \`note-three\` | 2026-09-15 |  |
`;

test('rows are derived from the table, with their state', () => {
  const rows = parseRegister(TABLE);
  assert.deepEqual(rows.map((r) => r.slug), ['essay-one', 'note-one', 'note-two', 'note-three']);
  assert.deepEqual(rows.map((r) => r.state), ['published', 'published', 'scheduled', '']);
});

test('the real register parses and every state is legal', () => {
  const rows = parseRegister(readFileSync(register, 'utf8'));
  assert.ok(rows.length >= 18, `expected the full bank, saw ${rows.length}`);
});

test('a table that yields nothing is an error, never an empty pass', () => {
  assert.throws(() => parseRegister('# no table here\n'), /examined nothing/i);
});

test('an unreadable state is refused rather than skipped', () => {
  assert.throws(
    () => parseRegister('| 1 | `x` | 2026-01-01 | probably out |'),
    /not one of published, scheduled, or blank/,
  );
});

test('a slug listed twice is an error', () => {
  assert.throws(
    () => parseRegister('| 1 | `x` | 2026-01-01 | |\n| 2 | `x` | 2026-01-02 | |'),
    /more than once/,
  );
});

const rows = parseRegister(TABLE);
const allLive = {
  'essay-one': { status: 'published' },
  'note-one': { status: 'published' },
  'note-two': { status: 'scheduled' },
  'note-three': null,
};

test('a register that agrees with Ghost passes', () => {
  assert.deepEqual(reconcileRegister({ rows, live: allLive }).failures, []);
});

// The defect that prompted this: rest-is-not-a-reward published on 2026-09-08
// and the register still read `scheduled` the next day.
test('a scheduled row Ghost has already published fails, and says so plainly', () => {
  const result = reconcileRegister({
    rows,
    live: { ...allLive, 'note-two': { status: 'published' } },
  });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /note-two/);
  assert.match(result.failures[0], /went out and the register was never updated/);
});

test('a published row Ghost does not have published fails', () => {
  const result = reconcileRegister({ rows, live: { ...allLive, 'note-one': null } });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /absent/);
});

// A blank row is what the Monday staging task treats as "not yet on Ghost".
// A blank row that Ghost actually holds would make the task stage a duplicate.
test('a blank projection Ghost already holds fails', () => {
  const result = reconcileRegister({
    rows,
    live: { ...allLive, 'note-three': { status: 'scheduled' } },
  });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /projection with a blank State/);
  assert.match(result.failures[0], /lowest-numbered note with no Ghost post/);
});

// An unchecked row is not a reconciled row. Passing here would report the
// result of a lookup that never happened.
test('a row Ghost was never asked about fails rather than passing', () => {
  const partial = { ...allLive };
  delete partial['note-one'];
  const result = reconcileRegister({ rows, live: partial });
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /was not asked about/);
});

test('reconciling zero rows is an error', () => {
  assert.throws(() => reconcileRegister({ rows: [], live: {} }), /examined nothing/i);
});

// recordPublished: Ghost's scheduler executing a decision already made is the
// one disagreement the register may absorb without a person. Row 6 read
// `scheduled` after publishing on 2026-09-08, 09-15, and 09-22 — three
// Tuesdays in a row, each corrected by hand.
test('recordPublished flips a scheduled row Ghost has published, and only that row', () => {
  const result = recordPublished(TABLE, { ...allLive, 'note-two': { status: 'published' } });
  assert.deepEqual(result.recorded, ['note-two']);
  assert.match(result.markdown, /\| 2 \| `note-two` \| 2026-09-08 \| published \|/);
  assert.equal(result.markdown.replace('| 2026-09-08 | published |', '| 2026-09-08 | scheduled |'), TABLE);
  const after = reconcileRegister({ rows: parseRegister(result.markdown), live: { ...allLive, 'note-two': { status: 'published' } } });
  assert.deepEqual(after.failures, []);
});

test('recordPublished leaves an agreeing register byte-identical', () => {
  const result = recordPublished(TABLE, allLive);
  assert.deepEqual(result.recorded, []);
  assert.equal(result.markdown, TABLE);
});

// Every other disagreement means a person did something — deleted a post,
// staged outside the register — and is left failing for a person to read.
test('recordPublished never absorbs any other disagreement', () => {
  const cases = [
    { 'note-two': null },
    { 'note-two': { status: 'draft' } },
    { 'note-three': { status: 'published' } },
    { 'note-one': null },
  ];
  for (const change of cases) {
    const live = { ...allLive, ...change };
    const result = recordPublished(TABLE, live);
    assert.deepEqual(result.recorded, [], JSON.stringify(change));
    assert.equal(result.markdown, TABLE);
    assert.equal(reconcileRegister({ rows: parseRegister(result.markdown), live }).failures.length, 1);
  }
});

// `sent` is an email-only post: it never reached the site, so it is not what
// the register means by published.
test('recordPublished does not treat an email-only send as published', () => {
  const result = recordPublished(TABLE, { ...allLive, 'note-two': { status: 'sent' } });
  assert.deepEqual(result.recorded, []);
});

test('recordPublished refuses a lookup that did not happen rather than guessing', () => {
  const partial = { ...allLive };
  delete partial['note-two'];
  assert.throws(() => recordPublished(TABLE, partial), /note-two.*not asked/);
});

test('recordPublished refuses a register it cannot parse', () => {
  assert.throws(() => recordPublished('# nothing\n', {}), /examined nothing/i);
});
