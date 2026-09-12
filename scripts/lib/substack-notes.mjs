// The Substack notes register, reconciled against the live profile feed
// instead of trusted.
//
// What goes out on Substack was recorded nowhere but handoff-log prose, written
// by whoever ran the note task. That prose asserted a terminal outcome at a
// moment when the outcome was still pending — the agent hands the copy over and
// the founder posts minutes later — so it was false in `main` twice, on
// 2026-09-08 and again on 2026-09-12, both times until a correction entry
// caught up with it. Nothing could detect either, because the only record of
// what had happened was the sentence that was wrong.
//
// This is the same failure `publication-register.mjs` exists for on Ghost, and
// it takes the same shape: a register that claims, and a reconciliation that
// asks the service. It reconciles in both directions — a row claiming `posted`
// must be live, and a row claiming `missed` or still pending must NOT be.
//
// It also compares the live text against the pack byte-for-byte. "Posted
// verbatim" is the one rule this publication's distribution cannot bend, and
// until now nothing checked it after the fact; a note edited on the platform
// after posting would have left no trace at all.
//
// Pure. The network call lives in the runner.

const ROW = /^\|\s*`([a-z0-9-]+)`\s*\|\s*(\d+)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|\s*([^|]*?)\s*\|$/gm;

export const STATES = new Set(['posted', 'missed', '']);

/** Slot wall-clock, as written in the register: `YYYY-MM-DD HH:MM` in ET. */
const SLOT = /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/;

// Launch week ran before the cadence table governed anything, so its two notes
// had no scheduled slot at all. An em dash records that honestly; writing a
// plausible-looking time in the column to keep it uniform would invent the one
// fact the column exists to carry, and lateness measured against an invented
// slot is worse than no lateness figure.
const NO_SLOT = '\u2014';

const NY = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'America/New_York',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hourCycle: 'h23',
});

/**
 * An instant, expressed as the wall-clock minute it lands on in New York.
 *
 * Returned as a pseudo-UTC epoch so two wall-clock readings subtract cleanly.
 * Going through Intl rather than a fixed -4 offset is what keeps this correct
 * across the DST boundary the Saturday slot sits eight weeks away from.
 */
function newYorkWallClock(instant) {
  const p = Object.fromEntries(NY.formatToParts(instant).map((x) => [x.type, x.value]));
  return Date.UTC(+p.year, +p.month - 1, +p.day, +p.hour, +p.minute, +p.second);
}

/** Every register row, derived from the table rather than listed here. */
export function parseRegister(markdown) {
  const rows = [...String(markdown).matchAll(ROW)].map((m) => ({
    essay: m[1],
    note: Number(m[2]),
    slot: m[3].trim(),
    state: m[4].trim(),
    permalink: m[5].trim().replace(/^`|`$/g, ''),
  }));

  if (rows.length === 0) {
    throw new Error(
      'substack-notes.md yielded no register rows; the reconciliation examined nothing and must not report success.',
    );
  }

  for (const row of rows) {
    if (!STATES.has(row.state)) {
      throw new Error(
        `${row.essay} note ${row.note} has State "${row.state}", which is not one of posted, missed, or blank. `
        + 'An unreadable state cannot be reconciled against the live feed.',
      );
    }
    if (row.slot !== NO_SLOT && !SLOT.test(row.slot)) {
      throw new Error(
        `${row.essay} note ${row.note} has Slot "${row.slot}"; expected ET wall-clock as YYYY-MM-DD HH:MM, `
        + `or "${NO_SLOT}" for a note that had no scheduled slot.`,
      );
    }
  }

  const seen = new Set();
  for (const row of rows) {
    const key = `${row.essay}#${row.note}`;
    if (seen.has(key)) throw new Error(`${row.essay} note ${row.note} appears in the register more than once.`);
    seen.add(key);
  }

  return rows;
}

/** The register's own key for a row, and the key the runner resolves copy under. */
export const rowKey = (row) => `${row.essay}#${row.note}`;

/**
 * Compare each row's claim against what the profile actually carries.
 *
 * `copy` maps `essay#note` -> the pack's approved text. A key missing from it
 * means the copy could not be resolved, which is a failure rather than a pass:
 * a row whose approved text is unknown has not been checked against anything.
 *
 * `live` is the feed as an array of {id, date, body}. Null or undefined means
 * the feed could not be read, and that throws rather than reconciling against
 * an empty array — an unreachable service must never read as "nothing posted",
 * which is precisely the false claim this register exists to catch.
 */
export function reconcileNotes({ rows, copy, live }) {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('No register rows to reconcile; refusing to report success over an empty examination.');
  }
  if (!Array.isArray(live)) {
    throw new Error(
      'The Substack notes feed was not read, so nothing can be reconciled against it. '
      + 'An unread feed is not an empty feed.',
    );
  }

  const byId = new Map(live.map((n) => [String(n.id), n]));
  const failures = [];
  const late = [];

  for (const row of rows) {
    const key = rowKey(row);
    const approved = copy[key];
    if (typeof approved !== 'string') {
      failures.push(
        `${key}: the approved copy could not be resolved from its pack, so this row was checked against nothing.`,
      );
      continue;
    }

    if (row.state === 'posted') {
      if (row.permalink === '') {
        failures.push(`${key}: State is posted but the row names no permalink, so nothing identifies the note.`);
        continue;
      }
      const id = row.permalink.replace(/^c-/, '');
      const liveNote = byId.get(id);
      if (!liveNote) {
        failures.push(
          `${key}: State is posted as ${row.permalink}, but the live feed does not carry that note.`,
        );
        continue;
      }
      if (liveNote.body !== approved) {
        failures.push(
          `${key}: ${row.permalink} is live but its text is not the pack's verbatim copy `
          + `(live ${liveNote.body.length} chars, pack ${approved.length}).`,
        );
        continue;
      }
      if (row.slot !== NO_SLOT) {
        const [, y, mo, d, h, mi] = SLOT.exec(row.slot);
        const slotAt = Date.UTC(+y, +mo - 1, +d, +h, +mi);
        const minutes = Math.round((newYorkWallClock(new Date(liveNote.date)) - slotAt) / 60000);
        late.push({ key, permalink: row.permalink, minutes, postedAt: liveNote.date });
      }
      continue;
    }

    // Not claimed as posted: the register says this note is missed or still
    // pending. The live feed must agree. This direction is the one that was
    // wrong in main twice, and it is the reason the check is bidirectional.
    const stray = live.find((n) => n.body === approved);
    if (stray) {
      const claim = row.state === 'missed' ? 'missed' : 'still pending';
      failures.push(
        `${key}: the register records this note as ${claim}, but c-${stray.id} carries its approved copy, `
        + `posted ${stray.date}. The register is stale.`,
      );
    }
  }

  return { examined: rows.length, failures, late };
}
