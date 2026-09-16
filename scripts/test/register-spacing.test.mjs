import test from 'node:test';
import assert from 'node:assert/strict';

import {
  MAX_TRADE_RUN,
  tradeRunFaults,
  witnessSkeletonFaults,
  witnessSpacingFaults,
} from '../lib/register-spacing.mjs';

const row = (slug, {state = '', opening = 'other', stance = 'assignment'} = {}) => ({slug, state, opening, stance});

test('a trade run at the limit passes and one past it fails, naming the run', () => {
  const atLimit = [row('a'), ...Array.from({length: MAX_TRADE_RUN}, (_, i) => row(`t${i}`, {opening: 'trade'})), row('b')];
  assert.deepEqual(tradeRunFaults(atLimit), []);

  const over = [...atLimit.slice(0, -1), row('t-extra', {opening: 'trade'})];
  const faults = tradeRunFaults(over);
  assert.equal(faults.length, 1);
  assert.match(faults[0], /t0.*t-extra/);
});

test('published rows are history and do not count toward a trade run', () => {
  const rows = [
    ...Array.from({length: 5}, (_, i) => row(`p${i}`, {state: 'published', opening: 'trade'})),
    row('open-1', {opening: 'trade'}),
    row('open-2'),
  ];
  assert.deepEqual(tradeRunFaults(rows), []);
});

test('a scheduled row is still open to the run check', () => {
  const rows = Array.from({length: MAX_TRADE_RUN + 1}, (_, i) => row(`s${i}`, {state: i === 0 ? 'scheduled' : '', opening: 'trade'}));
  assert.equal(tradeRunFaults(rows).length, 1);
});

test('witness pieces closer than three slots fail', () => {
  const rows = [row('w1', {stance: 'witness'}), row('a'), row('w2', {stance: 'witness'})];
  const faults = witnessSpacingFaults(rows);
  assert.equal(faults.length, 1);
  assert.match(faults[0], /w1.*w2.*2/);
});

test('four witness pieces on an exact beat fail; one uneven gap breaks the beat', () => {
  const beat = (gaps) => {
    const rows = [row('w0', {stance: 'witness'})];
    gaps.forEach((gap, index) => {
      for (let filler = 1; filler < gap; filler += 1) rows.push(row(`f${index}-${filler}`));
      rows.push(row(`w${index + 1}`, {stance: 'witness'}));
    });
    return rows;
  };
  assert.equal(witnessSpacingFaults(beat([3, 3, 3])).length, 1);
  assert.deepEqual(witnessSpacingFaults(beat([3, 4, 3, 3])), []);
});

test('a fixed beat across five pieces is reported once, not once per gap', () => {
  const rows = [];
  for (let i = 0; i < 5; i += 1) rows.push(row(`w${i}`, {stance: 'witness'}), row(`x${i}`), row(`y${i}`));
  assert.equal(witnessSpacingFaults(rows).length, 1);
});

test('the witness skeleton headings are caught and ordinary headings are not', () => {
  assert.equal(witnessSkeletonFaults(['The switch', 'It is not done gracefully']).length, 1);
  assert.equal(witnessSkeletonFaults(['None of it is done well']).length, 1);
  assert.equal(witnessSkeletonFaults(['It does not get built well']).length, 1);
  assert.equal(witnessSkeletonFaults(['Nobody winds one gently']).length, 1);
  assert.equal(witnessSkeletonFaults(['Most doors are hung on one spring']).length, 1);
  assert.deepEqual(witnessSkeletonFaults(['Ten thousand cycles', 'He finds out sideways', 'Almost nobody asks']), []);
});
