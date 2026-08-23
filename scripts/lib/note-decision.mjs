// The decision a note task makes once it holds its lock, separated from the
// process that carries it out.
//
// The 2026-08-23 regression was not in the arithmetic. `gmg-saturday-note`
// required the essay to have published *today*, which is unsatisfiable at a
// Saturday slot, and it stood down every week from the day it shipped. The
// arithmetic had no tests; the wiring that used it had none either, and the
// wiring was where the bug lived — four lines inlined in an executable that
// calls the Ghost API at import time and so cannot be imported under a test.
//
// Everything here is a pure function of an already-fetched post, so the verdict
// the tasks actually read is covered by tests without a network call or a
// credential. The lock, the hold, the Ghost call, and the exit codes stay in
// `note-task-preflight.mjs`; ordering between them is that file's business.

import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { slotVerdict, publicationWeekStartMs, publishedThisPublicationWeek, DEFAULT_GRACE_MINUTES, DEFAULT_PUBLISH_WEEKDAY, DEFAULT_TIME_ZONE } from './note-slot.mjs';
import { resolvePackForSlug, extractNote } from './note-pack.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Post now, wait, or stand down — given the week's latest published post.
 *
 * Returns `{ verdict, reason?, timing, essay?, pack?, copy? }`. A stand-down on
 * the essay carries neither `pack` nor `copy`: a note from the wrong week must
 * never reach a payload, whatever the caller then does with it.
 */
export function decide({
  epochMs,
  slot,
  note,
  post,
  graceMinutes = DEFAULT_GRACE_MINUTES,
  timeZone = DEFAULT_TIME_ZONE,
  publishWeekday = DEFAULT_PUBLISH_WEEKDAY,
}) {
  const timing = slotVerdict({ epochMs, slot, graceMinutes, timeZone });

  // Nothing published at all is a decidable stand-down, and it must not read as
  // the same thing as a week that skipped: `latestPublishedPost()` returns null
  // by contract, and dereferencing it here would surface as exit 1, "could not
  // decide", when the answer was clear.
  if (!post) {
    return { verdict: 'stand-down', reason: 'nothing has published on Ghost yet', timing };
  }

  // A post that exists but cannot be dated is a broken input, not an absent
  // essay. NaN >= anything is false, so left alone this would stand down with
  // the exact reason string a genuinely essay-less week reports.
  const publishedAtMs = Date.parse(post.published_at);
  if (!Number.isFinite(publishedAtMs)) {
    throw new Error(`Post ${JSON.stringify(post.slug ?? '(no slug)')} has an unparseable published_at: ${JSON.stringify(post.published_at)}.`);
  }

  // The essay first. A note is a fragment of this week's essay; the unit is the
  // publication week, not the day, because Note 2's slot is the Saturday of the
  // week its Tuesday essay opened.
  if (!publishedThisPublicationWeek({ publishedAtMs, epochMs, publishWeekday, timeZone })) {
    return {
      verdict: 'stand-down',
      reason: "this week's essay has not published",
      timing,
      latestPublished: { slug: post.slug, publishedAt: post.published_at },
      publicationWeekStart: new Date(publicationWeekStartMs({ epochMs, publishWeekday, timeZone })).toISOString(),
    };
  }

  const packPath = resolvePackForSlug({ slug: post.slug });
  const decision = {
    verdict: timing.verdict,
    timing,
    essay: { title: post.title, slug: post.slug, url: post.url, publishedAt: post.published_at },
    pack: path.relative(root, packPath),
    copy: extractNote(readFileSync(packPath, 'utf8'), note),
  };

  if (timing.verdict === 'stand-down') {
    decision.reason = `${timing.offsetMinutes} minutes past the ${slot} slot, beyond the ${graceMinutes}-minute grace window`;
  }
  return decision;
}
