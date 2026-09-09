// Re-derive the premise under every accepted dependency risk.
//
// osv-scanner.toml's expiry dates already force a re-decision on a fixed day.
// This closes the other half: a premise that stops being true *inside* the
// window. On 2026-09-09 both extract-zip rationales asserted registry facts
// that had gone stale within a month, and nothing could tell, because the only
// thing checking them was the prose that had gone stale.
//
// Population comes from the policy file. Premises come from OSV and the npm
// registry. Nothing here reads a rationale, so nothing here can be fooled by
// one. See scripts/lib/dependency-exemptions.mjs for the reasoning and
// scripts/test/dependency-exemptions.test.mjs for what each rule guarantees.
//
// Network failures exit non-zero. A premise that could not be checked is not a
// premise that holds, and this must never report the result of a check it did
// not run.

import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { assessExemption, parseIgnoredVulns } from './lib/dependency-exemptions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const POLICY = path.join(root, 'osv-scanner.toml');
const TIMEOUT_MS = 20000;

async function getJson(url, what) {
  let response;
  try {
    response = await fetch(url, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { accept: 'application/json' },
    });
  } catch (error) {
    throw new Error(`Could not reach ${what} (${url}): ${error.message}`);
  }
  if (!response.ok) throw new Error(`${what} returned HTTP ${response.status} for ${url}`);
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`${what} returned unreadable JSON for ${url}: ${error.message}`);
  }
}

const osvRecord = (id) => getJson(`https://api.osv.dev/v1/vulns/${encodeURIComponent(id)}`, 'the OSV API');

// The registry's abbreviated document is enough and is far smaller than the
// full packument, which for a busy package runs to megabytes.
async function publishedVersionsOf(name) {
  const url = `https://registry.npmjs.org/${name.split('/').map(encodeURIComponent).join('/')}`;
  const doc = await getJson(url, 'the npm registry');
  return Object.keys(doc.versions ?? {});
}

const today = new Date().toISOString().slice(0, 10);
const failures = [];

let entries;
try {
  entries = parseIgnoredVulns(await readFile(POLICY, 'utf8'));
} catch (error) {
  console.error(`Dependency exemption check failed:\n- ${error.message}`);
  process.exit(1);
}

console.log(`Re-deriving the premise under ${entries.length} accepted advisor${entries.length === 1 ? 'y' : 'ies'} from osv-scanner.toml.`);

for (const entry of entries) {
  let record;
  try {
    record = await osvRecord(entry.id);
  } catch (error) {
    failures.push(`${entry.id}: ${error.message}`);
    continue;
  }

  // Fetch the registry for every npm package the advisory names, so a lagging
  // OSV record cannot hide a shipped patch.
  const publishedVersions = {};
  for (const affected of record.affected ?? []) {
    const pkg = affected?.package;
    if (pkg?.ecosystem !== 'npm' || publishedVersions[pkg.name]) continue;
    try {
      publishedVersions[pkg.name] = await publishedVersionsOf(pkg.name);
    } catch (error) {
      failures.push(`${entry.id}: ${error.message}`);
    }
  }

  const verdict = assessExemption({ entry, record, publishedVersions, today });
  if (verdict.ok) {
    console.log(`  ${entry.id}: premise holds — no patched release available, expiry ${entry.ignoreUntil} not reached.`);
  } else {
    failures.push(...verdict.messages);
  }
}

if (failures.length > 0) {
  console.error('\nDependency exemption check failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error(
    '\nAn accepted risk is only "there is nothing to upgrade to" for as long as that is true. '
    + 'Fix it upstream, or make the acceptance again on today\'s facts and say so in osv-scanner.toml.',
  );
  process.exit(1);
}

console.log('Every accepted risk still has the premise it was accepted on.');
