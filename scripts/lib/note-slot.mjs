// Timing arithmetic for the weekly Substack note tasks.
//
// A slot is a wall-clock time in the publication's zone — "Tuesday 12:00 PM ET"
// — and the Friday analytics task reads the resulting timestamps as a baseline.
// So a note posted outside its slot is not merely untidy; it moves the baseline
// every later week is compared against.
//
// The guard these tasks shipped with only caught lateness. On 2026-08-18 a run
// fired at 10:53 ET against a 12:00 slot and a literal reading of that guard
// permitted posting 67 minutes early, which costs exactly what an hour late
// costs. The window here is symmetric: early waits, late stands down.

export const DEFAULT_TIME_ZONE = 'America/New_York';
export const DEFAULT_GRACE_MINUTES = 60;

const SLOT_PATTERN = /^([01]\d|2[0-3]):([0-5]\d)$/;

function parseSlot(slot) {
  if (typeof slot !== 'string' || !SLOT_PATTERN.test(slot)) {
    throw new TypeError(`Invalid slot ${JSON.stringify(slot)}; expected a 24-hour "HH:MM" wall-clock time.`);
  }
  const [hour, minute] = slot.split(':').map(Number);
  return { hour, minute };
}

// Milliseconds to add to a UTC instant to read it as wall-clock in `timeZone`.
function zoneOffsetMs(epochMs, timeZone) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat('en-US', {
      timeZone,
      hour12: false,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    })
      .formatToParts(new Date(epochMs))
      .filter((part) => part.type !== 'literal')
      .map((part) => [part.type, part.value]),
  );
  // hourCycle h23 still renders midnight as "24" in some ICU versions.
  const asIfUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour) % 24,
    Number(parts.minute),
    Number(parts.second),
  );
  return asIfUtc - epochMs;
}

/** The calendar day `epochMs` falls on in `timeZone` — not the UTC day. */
export function zonedDayParts(epochMs, timeZone = DEFAULT_TIME_ZONE) {
  const shifted = new Date(epochMs + zoneOffsetMs(epochMs, timeZone));
  return { year: shifted.getUTCFullYear(), month: shifted.getUTCMonth() + 1, day: shifted.getUTCDate() };
}

/** The UTC instant of today's `slot`, where "today" is the zone's day. */
export function slotEpochMs({ epochMs, slot, timeZone = DEFAULT_TIME_ZONE }) {
  const { hour, minute } = parseSlot(slot);
  const { year, month, day } = zonedDayParts(epochMs, timeZone);
  const naive = Date.UTC(year, month - 1, day, hour, minute, 0);
  // Converge: the offset depends on the instant, which depends on the offset.
  // Two passes settle every real zone, including across a DST transition.
  let resolved = naive;
  for (let pass = 0; pass < 2; pass += 1) resolved = naive - zoneOffsetMs(resolved, timeZone);
  return resolved;
}

/**
 * Should this run act now, wait, or stand down?
 *
 * `wait` carries `waitMs` — the run sleeps and then re-checks the surface
 * before acting, because the state it verified before sleeping is a claim
 * about the past.
 */
export function slotVerdict({
  epochMs,
  slot,
  graceMinutes = DEFAULT_GRACE_MINUTES,
  timeZone = DEFAULT_TIME_ZONE,
}) {
  const slotMs = slotEpochMs({ epochMs, slot, timeZone });
  const deltaMs = epochMs - slotMs;
  const graceMs = graceMinutes * 60_000;

  let verdict = 'post';
  if (deltaMs < 0) verdict = 'wait';
  else if (deltaMs > graceMs) verdict = 'stand-down';

  return {
    verdict,
    slotEpochMs: slotMs,
    offsetMinutes: Math.round(deltaMs / 60_000),
    waitMs: verdict === 'wait' ? -deltaMs : 0,
    graceMinutes,
  };
}

// --- the publication week -------------------------------------------------
// One preflight serves both note tasks, and its essay precondition was written
// for only one of them: it required the latest essay to have published *today*.
// Note 1 posts four hours after the Tuesday essay, so that passed. Note 2 posts
// the Saturday of the same week, so it could not — `gmg-saturday-note` stood
// down every week from the day it was written, and no test covered the check.
//
// `operating-cadence.md` states the rule as refusing "when the week's essay did
// not publish", so the week is the unit, not the day. The week is anchored on
// the publish day at midnight rather than at the 08:00 publish time: a minute of
// scheduler jitter should not throw an essay out of its own week, and the
// anchor still refuses last week's essay at either slot, which is the whole
// point of the precondition.

/** Ghost publishes Tuesday 08:00 ET — `docs/technical/publish-timing.md`. */
export const DEFAULT_PUBLISH_WEEKDAY = 2; // 0 = Sunday

/** The UTC instant that opened the publication week `epochMs` falls in. */
export function publicationWeekStartMs({
  epochMs,
  publishWeekday = DEFAULT_PUBLISH_WEEKDAY,
  timeZone = DEFAULT_TIME_ZONE,
}) {
  if (!Number.isInteger(publishWeekday) || publishWeekday < 0 || publishWeekday > 6) {
    throw new TypeError(`Invalid publishWeekday ${JSON.stringify(publishWeekday)}; expected an integer 0-6, Sunday first.`);
  }
  const shifted = new Date(epochMs + zoneOffsetMs(epochMs, timeZone));
  const daysBack = (shifted.getUTCDay() - publishWeekday + 7) % 7;
  const naive = Date.UTC(shifted.getUTCFullYear(), shifted.getUTCMonth(), shifted.getUTCDate() - daysBack, 0, 0, 0);
  // Same two-pass convergence as slotEpochMs; see the note there.
  let resolved = naive;
  for (let pass = 0; pass < 2; pass += 1) resolved = naive - zoneOffsetMs(resolved, timeZone);
  return resolved;
}

/** Is `publishedAtMs` this week's essay, as seen from `epochMs`? */
export function publishedThisPublicationWeek({
  publishedAtMs,
  epochMs,
  publishWeekday = DEFAULT_PUBLISH_WEEKDAY,
  timeZone = DEFAULT_TIME_ZONE,
}) {
  return publishedAtMs >= publicationWeekStartMs({ epochMs, publishWeekday, timeZone });
}
