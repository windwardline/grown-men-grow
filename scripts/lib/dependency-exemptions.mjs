// Accepted dependency risks, re-derived instead of re-read.
//
// osv-scanner.toml suppresses findings. Each entry states why the risk is
// accepted and carries an expiry, and the expiry is real: when it passes the
// scanner fails again. What the expiry cannot catch is the premise going stale
// *inside* the window, and on 2026-09-09 that is exactly what had happened —
// the extract-zip rationale named "gscan 6.4.2, the current release" and
// "@tryghost/zip's own latest, 3.5.6" while the registry had moved to 6.6.0
// and 3.5.12. Nothing was wrong with the acceptance; the facts under it had
// simply stopped being facts, and no gate could tell, because the gate read
// the same prose that had gone stale.
//
// So this module never reads the rationale. It takes the advisory ids out of
// the policy file, asks OSV what the advisory actually affects, asks the npm
// registry what has actually shipped, and answers one question per entry: is
// there something to upgrade to yet? The day there is, the acceptance stops
// being "there is no fix" and becomes "we are choosing to stay here", which is
// a different decision and has to be made deliberately.
//
// Everything here is pure. The network lives in the runner.

/** Advisory ids and expiries, derived from the policy file itself. */
export function parseIgnoredVulns(tomlText) {
  const text = String(tomlText);
  const blocks = text.split(/^\s*\[\[IgnoredVulns\]\]\s*$/m).slice(1);
  if (blocks.length === 0) {
    throw new Error(
      'osv-scanner.toml contains no [[IgnoredVulns]] entries; the exemption check examined nothing. '
      + 'Remove this check rather than letting it report success over an empty population.',
    );
  }

  return blocks.map((block) => {
    // Stop at the next table header so a following entry cannot bleed in.
    const body = block.split(/^\s*\[\[/m)[0];
    const id = body.match(/^\s*id\s*=\s*"([^"]+)"/m)?.[1];
    if (!id) throw new Error('An [[IgnoredVulns]] entry has no id.');

    // TOML dates are bare (2026-11-09), not quoted.
    const ignoreUntil = body.match(/^\s*ignoreUntil\s*=\s*"?(\d{4}-\d{2}-\d{2})"?/m)?.[1];
    if (!ignoreUntil) {
      throw new Error(
        `${id} has no ignoreUntil. An accepted risk that cannot expire is an unreviewed one; give it a date.`,
      );
    }
    return { id, ignoreUntil };
  });
}

/**
 * npm packages an OSV record affects, with any fixed versions the advisory
 * itself declares. Other ecosystems are dropped: a Go fix is not an npm one.
 */
export function npmPackagesWithFixes(record) {
  if (!record || !Array.isArray(record.affected)) {
    throw new Error(
      'OSV record carries no "affected" array; the advisory could not be read and no premise can be derived from it.',
    );
  }

  const byName = new Map();
  for (const affected of record.affected) {
    if (affected?.package?.ecosystem !== 'npm') continue;
    const name = affected.package.name;
    const fixed = byName.get(name) ?? [];
    for (const range of affected.ranges ?? []) {
      for (const event of range.events ?? []) {
        if (event.fixed) fixed.push(event.fixed);
      }
    }
    byName.set(name, fixed);
  }
  return [...byName].map(([name, fixed]) => ({ name, fixed }));
}

/** Every explicitly-enumerated affected version, per npm package. */
function affectedVersions(record, name) {
  const out = [];
  for (const affected of record.affected ?? []) {
    if (affected?.package?.ecosystem !== 'npm' || affected.package.name !== name) continue;
    for (const version of affected.versions ?? []) out.push(version);
  }
  return out;
}

const NUMERIC = /^\d+\.\d+\.\d+$/;

/** Ascending semver compare over plain x.y.z releases. */
function compare(a, b) {
  const left = a.split('.').map(Number);
  const right = b.split('.').map(Number);
  for (let i = 0; i < 3; i += 1) {
    if (left[i] !== right[i]) return left[i] - right[i];
  }
  return 0;
}

/**
 * One verdict for one accepted advisory.
 *
 * Fails when a fix exists (the premise is gone), when the expiry has passed,
 * and — deliberately — when the registry could not answer. An unchecked
 * premise is not a premise that holds, and reporting success over one is the
 * silent failure this repository's standards forbid.
 */
export function assessExemption({ entry, record, publishedVersions, today }) {
  const messages = [];

  if (entry.ignoreUntil < today) {
    messages.push(
      `${entry.id} expired on ${entry.ignoreUntil}. Re-decide it on today's facts and set a new date, or remove the entry.`,
    );
  }

  let packages;
  try {
    packages = npmPackagesWithFixes(record);
  } catch (error) {
    return { id: entry.id, ok: false, messages: [`${entry.id}: ${error.message}`] };
  }

  if (packages.length === 0) {
    messages.push(`${entry.id} affects no npm package in its OSV record; the premise could not be derived.`);
  }

  for (const { name, fixed } of packages) {
    // 1. The advisory itself declares a patched version.
    if (fixed.length > 0) {
      messages.push(
        `${entry.id}: ${name} now has a patched release (${fixed.join(', ')}). `
        + 'The acceptance rests on there being nothing to upgrade to, and there is. Upgrade instead of renewing.',
      );
      continue;
    }

    // 2. The advisory has not been updated, but the registry has moved.
    const published = publishedVersions[name];
    if (!Array.isArray(published) || published.length === 0) {
      messages.push(
        `${entry.id}: could not read published versions of ${name} from the registry, so the "no patch exists" `
        + 'premise was not checked. This is a failure rather than a pass — an unchecked premise is not a held one.',
      );
      continue;
    }

    const affected = affectedVersions(record, name).filter((v) => NUMERIC.test(v));
    if (affected.length === 0) continue;
    const ceiling = affected.sort(compare).at(-1);

    // Prereleases are excluded on purpose: "3.0.0-alpha.1 exists" is not a
    // patch a dependent can be moved onto, and treating it as one would fail
    // the build every time an upstream opened a major.
    const newer = published.filter((v) => NUMERIC.test(v) && compare(v, ceiling) > 0).sort(compare);
    if (newer.length > 0) {
      messages.push(
        `${entry.id}: ${name} has published ${newer.join(', ')}, above every version the advisory lists as `
        + `affected (highest ${ceiling}). OSV may not have recorded the fix yet. Check whether the upgrade is real.`,
      );
    }
  }

  return { id: entry.id, ok: messages.length === 0, messages };
}
