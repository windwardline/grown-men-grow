// Reconcile docs/technical/publication-order.md against Ghost.
//
// The register's State column drives the Monday staging task, which takes the
// lowest-numbered note with no Ghost post. On 2026-09-09 row 4 still read
// `scheduled` for a note published the previous morning, and nothing detected
// it — the only record of what had happened was the column that was wrong.
//
// This needs the Ghost admin key from the local Keychain, so it is a `cadence:`
// gate: it runs on the live machine, not in CI and not at session end. The
// weekly staging task is its natural home, before it decides what to stage.
//
// Fails closed. A row Ghost was not asked about is a failure, not a pass.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { findPostBySlug } from './lib/ghost-admin.mjs';
import { parseRegister, reconcileRegister } from './lib/publication-register.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REGISTER = path.join(root, 'docs/technical/publication-order.md');

function die(lines) {
  console.error('Publication register reconciliation failed:');
  for (const line of [].concat(lines)) console.error(`- ${line}`);
  console.error(
    '\nThe register is the input to the Monday staging decision. Correct the State column to match Ghost '
    + 'rather than leaving the two disagreeing.',
  );
  process.exit(1);
}

let rows;
try {
  rows = parseRegister(await readFile(REGISTER, 'utf8'));
} catch (error) {
  die(error.message);
}

console.log(`Reconciling ${rows.length} register rows against Ghost.`);

const live = {};
const unreachable = [];
for (const row of rows) {
  try {
    live[row.slug] = await findPostBySlug(row.slug);
  } catch (error) {
    // Deliberately not recorded in `live`: a slug the lookup could not answer
    // for must fail as unchecked rather than be guessed at as absent.
    unreachable.push(`${row.slug}: Ghost lookup failed — ${error.message}`);
  }
}

let result;
try {
  result = reconcileRegister({ rows, live });
} catch (error) {
  die([...unreachable, error.message]);
}

const failures = [...unreachable, ...result.failures];
if (failures.length > 0) die(failures);

const published = rows.filter((r) => r.state === 'published').length;
const scheduled = rows.filter((r) => r.state === 'scheduled').length;
console.log(
  `The register agrees with Ghost on all ${result.examined} rows `
  + `(${published} published, ${scheduled} scheduled, ${result.examined - published - scheduled} projected).`,
);
