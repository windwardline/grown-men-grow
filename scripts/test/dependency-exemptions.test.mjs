import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  assessExemption,
  npmPackagesWithFixes,
  parseIgnoredVulns,
} from '../lib/dependency-exemptions.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const policy = path.join(root, 'osv-scanner.toml');

// --- parseIgnoredVulns: the population comes from the file, never a list here.

test('every accepted advisory in the policy file is returned, with its expiry', () => {
  const entries = parseIgnoredVulns(readFileSync(policy, 'utf8'));
  assert.ok(entries.length > 0, 'the repository policy must yield at least one entry');
  for (const entry of entries) {
    assert.match(entry.id, /^(GHSA|CVE)-/, `${entry.id} does not look like an advisory id`);
    assert.match(entry.ignoreUntil, /^\d{4}-\d{2}-\d{2}$/, `${entry.id} has no readable expiry`);
  }
});

test('entries are parsed out of the TOML rather than matched by name', () => {
  const entries = parseIgnoredVulns(`
[[IgnoredVulns]]
id = "GHSA-aaaa-bbbb-cccc"
ignoreUntil = 2027-01-31
reason = "because"

[[IgnoredVulns]]
id = "CVE-2026-99999"
ignoreUntil = 2026-02-01
reason = "also because"
`);
  assert.deepEqual(entries.map((e) => e.id), ['GHSA-aaaa-bbbb-cccc', 'CVE-2026-99999']);
  assert.equal(entries[0].ignoreUntil, '2027-01-31');
});

// Examining nothing must never read as a pass. This mirrors the rule the
// repository already applies to its cross-reference and corpus scans.
test('a policy file with no entries is an error, not an empty success', () => {
  assert.throws(() => parseIgnoredVulns('# just a comment\n'), /no \[\[IgnoredVulns\]\]/i);
});

test('an entry without an expiry is refused rather than treated as forever', () => {
  assert.throws(
    () => parseIgnoredVulns('[[IgnoredVulns]]\nid = "GHSA-x"\nreason = "r"\n'),
    /ignoreUntil/i,
  );
});

// --- npmPackagesWithFixes: reading a real OSV record shape.

test('a fixed event in an npm range is reported as a patch being available', () => {
  const record = {
    affected: [{
      package: { ecosystem: 'npm', name: 'left-pad' },
      ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }, { fixed: '1.3.1' }] }],
    }],
  };
  assert.deepEqual(npmPackagesWithFixes(record), [{ name: 'left-pad', fixed: ['1.3.1'] }]);
});

test('a range with no fixed event yields no patch', () => {
  const record = {
    affected: [{
      package: { ecosystem: 'npm', name: 'extract-zip' },
      ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }] }],
    }],
  };
  assert.deepEqual(npmPackagesWithFixes(record), [{ name: 'extract-zip', fixed: [] }]);
});

test('non-npm ecosystems are ignored, so a Go fix never reads as an npm one', () => {
  const record = {
    affected: [{
      package: { ecosystem: 'Go', name: 'example.com/thing' },
      ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }, { fixed: '1.0.0' }] }],
    }],
  };
  assert.deepEqual(npmPackagesWithFixes(record), []);
});

test('a record with no affected list is refused rather than read as "no fix"', () => {
  assert.throws(() => npmPackagesWithFixes({}), /affected/i);
});

// --- assessExemption: the verdict.

const TODAY = '2026-09-09';

test('an unpatched advisory inside its window still holds', () => {
  const verdict = assessExemption({
    entry: { id: 'GHSA-x', ignoreUntil: '2026-11-09' },
    record: {
      affected: [{
        package: { ecosystem: 'npm', name: 'extract-zip' },
        ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }] }],
      }],
    },
    publishedVersions: { 'extract-zip': ['1.7.0', '2.0.0', '2.0.1'] },
    today: TODAY,
  });
  assert.equal(verdict.ok, true);
  assert.equal(verdict.id, 'GHSA-x');
});

// The whole point of the script. The acceptance said "there is nothing to
// upgrade to"; the day that stops being true the acceptance is a choice to
// stay vulnerable, and it has to be made again rather than inherited.
test('a published fix kills the premise and fails the check', () => {
  const verdict = assessExemption({
    entry: { id: 'GHSA-x', ignoreUntil: '2026-11-09' },
    record: {
      affected: [{
        package: { ecosystem: 'npm', name: 'extract-zip' },
        ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }, { fixed: '2.0.2' }] }],
      }],
    },
    publishedVersions: { 'extract-zip': ['2.0.1', '2.0.2'] },
    today: TODAY,
  });
  assert.equal(verdict.ok, false);
  assert.match(verdict.messages.join(' '), /2\.0\.2/);
  assert.match(verdict.messages.join(' '), /upgrade/i);
});

// OSV can lag: a maintainer may publish a patched version before the advisory
// record is updated to carry the fixed event. Catching that needs the registry
// as a second source, not the advisory alone.
test('a registry version above every affected one fails even when OSV lists no fix', () => {
  const verdict = assessExemption({
    entry: { id: 'GHSA-x', ignoreUntil: '2026-11-09' },
    record: {
      affected: [{
        package: { ecosystem: 'npm', name: 'extract-zip' },
        ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }] }],
        versions: ['2.0.0', '2.0.1'],
      }],
    },
    publishedVersions: { 'extract-zip': ['2.0.0', '2.0.1', '2.0.2'] },
    today: TODAY,
  });
  assert.equal(verdict.ok, false);
  assert.match(verdict.messages.join(' '), /2\.0\.2/);
});

test('a prerelease above the affected versions does not count as a patch', () => {
  const verdict = assessExemption({
    entry: { id: 'GHSA-x', ignoreUntil: '2026-11-09' },
    record: {
      affected: [{
        package: { ecosystem: 'npm', name: 'extract-zip' },
        ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }] }],
        versions: ['2.0.0', '2.0.1'],
      }],
    },
    publishedVersions: { 'extract-zip': ['2.0.1', '3.0.0-alpha.1'] },
    today: TODAY,
  });
  assert.equal(verdict.ok, true);
});

test('an expiry that has passed fails, so the date is a brake and not a comment', () => {
  const verdict = assessExemption({
    entry: { id: 'GHSA-x', ignoreUntil: '2026-09-08' },
    record: {
      affected: [{
        package: { ecosystem: 'npm', name: 'extract-zip' },
        ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }] }],
      }],
    },
    publishedVersions: { 'extract-zip': ['2.0.1'] },
    today: TODAY,
  });
  assert.equal(verdict.ok, false);
  assert.match(verdict.messages.join(' '), /expired/i);
});

test('the expiry day itself is still inside the window', () => {
  const verdict = assessExemption({
    entry: { id: 'GHSA-x', ignoreUntil: TODAY },
    record: {
      affected: [{
        package: { ecosystem: 'npm', name: 'extract-zip' },
        ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }] }],
      }],
    },
    publishedVersions: { 'extract-zip': ['2.0.1'] },
    today: TODAY,
  });
  assert.equal(verdict.ok, true);
});

// A premise that could not be checked is not a premise that holds. Reporting
// success here would be the silent failure the standards forbid: an operation
// that could not run reporting the result of one that ran and passed.
test('a package the registry could not answer for fails rather than passing', () => {
  const verdict = assessExemption({
    entry: { id: 'GHSA-x', ignoreUntil: '2026-11-09' },
    record: {
      affected: [{
        package: { ecosystem: 'npm', name: 'extract-zip' },
        ranges: [{ type: 'SEMVER', events: [{ introduced: '0' }] }],
      }],
    },
    publishedVersions: {},
    today: TODAY,
  });
  assert.equal(verdict.ok, false);
  assert.match(verdict.messages.join(' '), /could not/i);
});
