// The publication register, reconciled against Ghost instead of trusted.
//
// docs/technical/publication-order.md carries a State column — published,
// scheduled, or blank for a projection. It is hand-maintained, and on
// 2026-09-09 row 4 still read `scheduled` for a note Ghost had published the
// previous morning. Nothing detected it, and nothing could: the only record of
// what had actually happened was the column that was wrong.
//
// The register drives the Monday staging task, which takes the lowest-numbered
// note with no Ghost post. A stale row is therefore not cosmetic — it is the
// input to the decision about what publishes next.
//
// Pure. The Ghost calls live in the runner.

const ROW = /^\|\s*([\d—-]+)\s*\|\s*`([a-z0-9-]+)`[^|]*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|$/gm;

export const STATES = new Set(['published', 'scheduled', '']);

/** Every register row, derived from the table rather than listed here. */
export function parseRegister(markdown) {
  const rows = [...String(markdown).matchAll(ROW)].map((m) => ({
    position: m[1].trim(),
    slug: m[2],
    projected: m[3].trim(),
    state: m[4].trim(),
  }));

  if (rows.length === 0) {
    throw new Error(
      'publication-order.md yielded no register rows; the reconciliation examined nothing and must not report success.',
    );
  }

  for (const row of rows) {
    if (!STATES.has(row.state)) {
      throw new Error(
        `${row.slug} has State "${row.state}", which is not one of published, scheduled, or blank. `
        + 'An unreadable state cannot be reconciled against Ghost.',
      );
    }
  }

  const seen = new Set();
  for (const row of rows) {
    if (seen.has(row.slug)) throw new Error(`${row.slug} appears in the register more than once.`);
    seen.add(row.slug);
  }

  return rows;
}

/**
 * Compare each row's claimed state against what Ghost actually holds.
 *
 * `live` maps slug -> {status} or null when Ghost has no such post. A slug
 * missing from the map entirely means the lookup did not happen, which is a
 * failure rather than an absence: an unchecked row is not a reconciled one.
 */
export function reconcileRegister({ rows, live }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('The register reconciliation received no rows; it examined nothing.');
  }

  const failures = [];

  for (const row of rows) {
    if (!(row.slug in live)) {
      failures.push(
        `${row.slug}: Ghost was not asked about this row, so its State was not reconciled. `
        + 'A row that could not be checked is not a row that agrees.',
      );
      continue;
    }

    const post = live[row.slug];
    const actual = post ? post.status : 'absent';

    if (row.state === '' && actual !== 'absent') {
      failures.push(
        `${row.slug} is a projection with a blank State, but Ghost holds it as "${actual}". `
        + 'Set the State column to match, because the Monday staging task takes the lowest-numbered note with no Ghost post.',
      );
      continue;
    }
    if (row.state === 'published' && actual !== 'published') {
      failures.push(`${row.slug} reads "published" in the register but Ghost reports "${actual}".`);
      continue;
    }
    if (row.state === 'scheduled' && actual !== 'scheduled') {
      failures.push(
        `${row.slug} reads "scheduled" in the register but Ghost reports "${actual}". `
        + (actual === 'published'
          ? 'It went out and the register was never updated; run this check with --fix to record it.'
          : 'The scheduled post is gone from Ghost.'),
      );
    }
  }

  return { failures, examined: rows.length };
}

/**
 * Record in the register what Ghost's scheduler has already done.
 *
 * Exactly one disagreement is absorbed: a row reading `scheduled` whose post
 * Ghost reports `published`. That is the scheduler executing a decision the
 * register already records, so writing it down decides nothing. Row 6 went
 * stale that way on three consecutive Tuesdays, each time fixed by hand after
 * this check failed. Every other disagreement — a post gone, a draft, a blank
 * row Ghost holds — means a person acted outside the register, and is left
 * for `reconcileRegister` to fail on. `sent` is not `published`: an email-only
 * post never reached the site.
 *
 * Returns the rewritten markdown and the slugs recorded. Throws on a row the
 * lookup did not answer for, because a flip on a guess is worse than none.
 */
export function recordPublished(markdown, live) {
  const rows = parseRegister(markdown);
  for (const row of rows) {
    if (!(row.slug in live)) {
      throw new Error(`${row.slug}: Ghost was not asked about this row, so nothing was recorded.`);
    }
  }

  const due = new Set(
    rows.filter((row) => row.state === 'scheduled' && live[row.slug]?.status === 'published').map((row) => row.slug),
  );
  if (due.size === 0) return { markdown, recorded: [] };

  const recorded = [];
  const rewritten = String(markdown).replace(
    /^(\|\s*[\d—-]+\s*\|\s*`([a-z0-9-]+)`[^|]*\|\s*[^|]*?\s*\|\s*)scheduled(\s*\|)$/gm,
    (line, head, slug, tail) => {
      if (!due.has(slug)) return line;
      recorded.push(slug);
      return `${head}published${tail}`;
    },
  );

  if (recorded.length !== due.size) {
    throw new Error(`Expected to record ${[...due].join(', ')} but rewrote ${recorded.join(', ') || 'nothing'}.`);
  }
  return { markdown: rewritten, recorded };
}
