// Reconcile docs/technical/substack-notes.md against the live Substack profile.
//
// What went out on Substack was recorded only in handoff-log prose until
// 2026-09-12. The note task hands the copy to the founder and finishes, so its
// entry asserts a terminal outcome while the outcome is still pending — and on
// both 2026-09-08 and 2026-09-12 it merged to `main` claiming nothing was
// posted shortly before a note went out. Both were caught by a person noticing,
// which is not a mechanism.
//
// This reconciles in both directions and compares the live text against the
// pack byte-for-byte, so "posted verbatim" is checked after the fact rather
// than only at the moment of posting.
//
// The feed is public, so unlike the Ghost register's checker this needs no
// credential — but Substack answers 403 Forbidden to GitHub Actions runners
// while the identical call from the live machine succeeds. The block is on
// datacenter egress, not on the request. So this is a `cadence:` gate and must
// not become a CI job: a required check that can never pass is a wall across
// every merge rather than a gate.
//
// Fails closed. A feed that could not be read is not an empty feed.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { noteCopyForSlug } from './lib/note-pack.mjs';
import { publicationNotes } from './lib/substack-api.mjs';
import { parseRegister, reconcileNotes, rowKey } from './lib/substack-notes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTER = path.join(root, 'docs/technical/substack-notes.md');

function die(lines) {
  console.error('Substack notes reconciliation failed:');
  for (const line of [].concat(lines)) console.error(`- ${line}`);
  console.error(
    '\nThe register is the record of what actually went out. Correct it to match the live profile '
    + 'rather than leaving the two disagreeing — a row that is wrong here is invisible everywhere else.',
  );
  process.exit(1);
}

let rows;
try {
  rows = parseRegister(await readFile(REGISTER, 'utf8'));
} catch (error) {
  die(error.message);
}

// Approved copy, resolved through the single extractor the note tasks post
// from. A row whose copy cannot be resolved is deliberately left out of the
// map: reconcileNotes fails it as unchecked rather than passing it as absent.
const copy = {};
const unresolved = [];
for (const row of rows) {
  try {
    copy[rowKey(row)] = noteCopyForSlug({ slug: row.essay, note: row.note });
  } catch (error) {
    unresolved.push(`${rowKey(row)}: ${error.message}`);
  }
}

let live;
try {
  live = await publicationNotes();
} catch (error) {
  die([...unresolved, `The notes feed could not be read, so nothing was reconciled — ${error.message}`]);
}

console.log(`Reconciling ${rows.length} register rows against ${live.length} live notes.`);

let result;
try {
  result = reconcileNotes({ rows, copy, live });
} catch (error) {
  die([...unresolved, error.message]);
}

const failures = [...unresolved, ...result.failures];
if (failures.length > 0) die(failures);

const posted = rows.filter((r) => r.state === 'posted').length;
const missed = rows.filter((r) => r.state === 'missed').length;
console.log(
  `The register agrees with Substack on all ${result.examined} rows `
  + `(${posted} posted, ${missed} missed, ${result.examined - posted - missed} pending).`,
);

// Reported, never failed on: lateness is a fact about a human's evening, not a
// defect, and it is the baseline the Friday analytics task reads.
if (result.late.length > 0) {
  const measured = result.late.map((l) => l.minutes);
  const worst = Math.max(...measured);
  console.log(`Lateness against slot, ${result.late.length} measured, worst ${worst} min:`);
  for (const l of result.late) {
    const sign = l.minutes > 0 ? `+${l.minutes}` : `${l.minutes}`;
    console.log(`  ${l.key} ${l.permalink} ${sign} min`);
  }
}
