// Spacing rules for docs/technical/publication-order.md, founder-accepted
// 2026-09-16. Both failures they guard against grew one approval at a time: a
// run of trade openings that reached five, and five witness pieces landing on an
// exact three-slot beat. Each append recorded the strain and deferred it, so the
// rules are checked here rather than restated in prose.

// Longest run of consecutive trade openings allowed among rows not yet
// published. Eleven trade pieces against four separators cannot do better than
// three, so three is the honest floor rather than an aspiration.
export const MAX_TRADE_RUN = 3;

// Closer than this and two witness pieces read as a pair.
export const MIN_WITNESS_GAP = 3;

// Published rows are history: a reader has already met them, and nothing here
// can reorder them. Scheduled rows are still open to the check, because a run
// that includes a staged post is a run the reader is about to meet.
export function tradeRunFaults(rows) {
  const faults = [];
  let run = [];
  const close = () => {
    if (run.length > MAX_TRADE_RUN) {
      faults.push(`${run.length} trade openings run consecutively (${run.join(', ')}); the limit is ${MAX_TRADE_RUN}.`);
    }
    run = [];
  };
  for (const entry of rows) {
    if (entry.state === 'published') {
      close();
      continue;
    }
    if (entry.opening === 'trade') run.push(entry.slug);
    else close();
  }
  close();
  return faults;
}

// Spacing runs over every row, published included, because the reader who has
// met the earlier witness pieces is the one who would hear a beat.
//
// A beat is three consecutive equal gaps, which is four pieces in exact rhythm.
// Two equal gaps are unavoidable once witness pieces are spread at the minimum
// gap, so forbidding them would forbid spreading; three is the point at which a
// reader who is counting would be right to hear a series.
export function witnessSpacingFaults(rows) {
  const witness = rows
    .map((entry, index) => ({slug: entry.slug, index, stance: entry.stance}))
    .filter((entry) => entry.stance === 'witness');
  const faults = [];

  for (let i = 1; i < witness.length; i += 1) {
    const gap = witness[i].index - witness[i - 1].index;
    if (gap < MIN_WITNESS_GAP) {
      faults.push(`witness pieces ${witness[i - 1].slug} and ${witness[i].slug} are ${gap} slots apart; the minimum is ${MIN_WITNESS_GAP}.`);
    }
  }

  const gaps = witness.slice(1).map((entry, i) => entry.index - witness[i].index);
  for (let i = 2; i < gaps.length; i += 1) {
    if (gaps[i] === gaps[i - 1] && gaps[i - 1] === gaps[i - 2]) {
      const beat = witness.slice(i - 2, i + 2).map((entry) => entry.slug);
      faults.push(`witness pieces ${beat.join(', ')} fall on an exact ${gaps[i]}-slot beat; move one so the stance change does not read as a series.`);
      break;
    }
  }
  return faults;
}

// The five witness pieces approved by 2026-09-16 converged on one skeleton: a
// section conceding the care is done badly, then a section on the man who has
// less. Each was earned, and five in a row is a formula. This catches the
// section heads in the phrasings that skeleton actually used. It reads headings
// only, and a new draft could rebuild the same shape under different words; it
// narrows the failure, it does not close it, and the draft's own test report
// still has to say whether the shape is back.
const SKELETON_HEADINGS = [
  /\bdone (well|gracefully|badly)\b/i,
  /\bbuilt well\b/i,
  /\bgently\b/i,
  /^most\b/i,
];

export function witnessSkeletonFaults(headings) {
  return headings
    .filter((heading) => SKELETON_HEADINGS.some((pattern) => pattern.test(heading.trim())))
    .map((heading) => `section heading "${heading.trim()}" is the shared witness skeleton; the next witness piece is to be built another way.`);
}
