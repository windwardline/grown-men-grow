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

/** The day of the week `epochMs` falls on in `timeZone`, Sunday first. */
export function zonedWeekday(epochMs, timeZone = DEFAULT_TIME_ZONE) {
  return new Date(epochMs + zoneOffsetMs(epochMs, timeZone)).getUTCDay();
}

function assertWeekday(weekday, label) {
  if (!Number.isInteger(weekday) || weekday < 0 || weekday > 6) {
    throw new TypeError(`Invalid ${label} ${JSON.stringify(weekday)}; expected an integer 0-6, Sunday first.`);
  }
}

/**
 * The UTC instant of `slot` on the zone's day, shifted by `dayOffset` days.
 *
 * `dayOffset` defaults to 0, which is today — the only reading this had until
 * a slot needed to name a weekday as well as a time.
 */
export function slotEpochMs({ epochMs, slot, timeZone = DEFAULT_TIME_ZONE, dayOffset = 0 }) {
  const { hour, minute } = parseSlot(slot);
  const { year, month, day } = zonedDayParts(epochMs, timeZone);
  const naive = Date.UTC(year, month - 1, day + dayOffset, hour, minute, 0);
  // Converge: the offset depends on the instant, which depends on the offset.
  // Two passes settle every real zone, including across a DST transition.
  let resolved = naive;
  for (let pass = 0; pass < 2; pass += 1) resolved = naive - zoneOffsetMs(resolved, timeZone);
  return resolved;
}

/**
 * The occurrence of `slot` on `slotWeekday` nearest to `epochMs`, either side.
 *
 * Nearest rather than most-recent because both directions are real: a catch-up
 * burst fires after the slot, and a scheduler that runs early fires before it.
 * Whichever it is, the number this yields is the run's true distance from the
 * slot it was serving, which is the number worth reporting.
 */
export function weekdaySlotEpochMs({ epochMs, slot, slotWeekday, timeZone = DEFAULT_TIME_ZONE }) {
  assertWeekday(slotWeekday, 'slotWeekday');
  const runWeekday = zonedWeekday(epochMs, timeZone);
  let nearest = null;
  // -7..7 covers both neighbouring occurrences whatever day the run falls on.
  for (let dayOffset = -7; dayOffset <= 7; dayOffset += 1) {
    if ((((runWeekday + dayOffset) % 7) + 7) % 7 !== slotWeekday) continue;
    const candidate = slotEpochMs({ epochMs, slot, timeZone, dayOffset });
    if (nearest === null || Math.abs(candidate - epochMs) < Math.abs(nearest - epochMs)) nearest = candidate;
  }
  return nearest;
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
  slotWeekday,
}) {
  const bound = slotWeekday !== undefined;
  const slotMs = bound
    ? weekdaySlotEpochMs({ epochMs, slot, slotWeekday, timeZone })
    : slotEpochMs({ epochMs, slot, timeZone });
  const deltaMs = epochMs - slotMs;
  const graceMs = graceMinutes * 60_000;
  const runWeekday = zonedWeekday(epochMs, timeZone);
  const weekdayMismatch = bound && runWeekday !== slotWeekday;

  // A wrong-day run is refused before the clock is consulted. It must never
  // reach `wait`: told to sleep, it would wake inside the wrong day's window
  // and post there, which is the failure this branch exists to prevent.
  let verdict = 'post';
  if (weekdayMismatch) verdict = 'stand-down';
  else if (deltaMs < 0) verdict = 'wait';
  else if (deltaMs > graceMs) verdict = 'stand-down';

  return {
    verdict,
    slotEpochMs: slotMs,
    offsetMinutes: Math.round(deltaMs / 60_000),
    waitMs: verdict === 'wait' ? -deltaMs : 0,
    graceMinutes,
    runWeekday,
    weekdayMismatch,
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

/** Weekday names, Sunday first — for reasons a person has to read. */
export const WEEKDAY_NAMES = Object.freeze(['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

/**
 * The weekday each note task's slot belongs to, Sunday 0.
 *
 * The weekday was knowable only from the task's cron, which lives outside this
 * repository in a `SKILL.md` the gates cannot read — so on 2026-09-20 a Saturday
 * run that fired on Sunday had nothing to check itself against. Holding it here
 * puts the guard where a gate can reach it: `verify-repository.mjs` reconciles
 * this table against the schedule of record in `publish-timing.md`, so a slot
 * that moves days cannot move in one file and not the other.
 */
export const NOTE_TASK_SLOT_WEEKDAYS = Object.freeze({
  'gmg-tuesday-note': 2,
  'gmg-saturday-note': 6,
});

/** Ghost publishes Tuesday 08:00 ET — `docs/technical/publish-timing.md`. */
export const DEFAULT_PUBLISH_WEEKDAY = 2; // 0 = Sunday

/** The UTC instant that opened the publication week `epochMs` falls in. */
export function publicationWeekStartMs({
  epochMs,
  publishWeekday = DEFAULT_PUBLISH_WEEKDAY,
  timeZone = DEFAULT_TIME_ZONE,
}) {
  assertWeekday(publishWeekday, 'publishWeekday');
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
