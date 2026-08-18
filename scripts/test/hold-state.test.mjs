import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseHold, HOLD_MARKER_LABEL } from '../lib/hold-state.mjs';

const cadence = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'docs', 'technical', 'operating-cadence.md',
);

test('an explicit "none" is not a hold', () => {
  assert.deepEqual(parseHold(`intro\n\n**${HOLD_MARKER_LABEL}:** none\n\nrest`), { held: false, reason: 'none' });
  assert.deepEqual(parseHold(`**${HOLD_MARKER_LABEL}:** None.`), { held: false, reason: 'None.' });
});

test('anything else is a hold, and carries its reason forward', () => {
  const held = parseHold(`**${HOLD_MARKER_LABEL}:** 2026-08-20 — a death in the founder's family.`);
  assert.equal(held.held, true);
  assert.match(held.reason, /death in the founder/);
});

// Fail closed. A marker that quietly disappears — a doc rewrite, a bad merge —
// must stop the task, not wave it through. A sameness check cannot see a
// mechanism that is broken and stable.
test('a missing marker is an error, never an implied "no hold"', () => {
  assert.throws(
    () => parseHold('# Operating Cadence\n\nNo marker anywhere.\n'),
    (error) => /found no/i.test(error.message) && error.message.includes(HOLD_MARKER_LABEL),
  );
});

test('two markers are an error rather than a coin flip', () => {
  assert.throws(
    () => parseHold(`**${HOLD_MARKER_LABEL}:** none\n\n**${HOLD_MARKER_LABEL}:** held`),
    /more than one/i,
  );
});

test('an empty marker value is an error, not a pass', () => {
  assert.throws(() => parseHold(`**${HOLD_MARKER_LABEL}:**   \n`), /empty/i);
});

// The assertion that the mechanism is still wired to the document it governs.
test('the live operating cadence carries exactly one parseable marker', () => {
  const state = parseHold(readFileSync(cadence, 'utf8'));
  assert.equal(typeof state.held, 'boolean');
});
