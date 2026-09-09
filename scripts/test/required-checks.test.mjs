import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import {
  EXEMPT_JOBS,
  parseWorkflowJobs,
  reconcileRequiredChecks,
} from '../lib/required-checks.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const workflows = path.join(root, '.github', 'workflows');

// --- parseWorkflowJobs

test('a job takes its check name from `name:`, and its id when it has none', () => {
  const jobs = parseWorkflowJobs(`
on:
  pull_request:
    branches: [main]
jobs:
  verify:
    name: Repository verification
    runs-on: ubuntu-latest
    steps:
      - run: echo hi
  bare-job:
    runs-on: ubuntu-latest
    steps:
      - run: echo hi
`, 'ci.yml');
  assert.deepEqual(jobs.map((j) => j.checkName), ['Repository verification', 'bare-job']);
});

test('a workflow with no pull_request trigger contributes no required checks', () => {
  const jobs = parseWorkflowJobs(`
on:
  schedule:
    - cron: "17 13 * * *"
jobs:
  nightly:
    name: Nightly
    runs-on: ubuntu-latest
    steps:
      - run: echo hi
`, 'cron.yml');
  assert.deepEqual(jobs.filter((j) => j.runsOnPullRequest), []);
});

// Ghost managed edge is the live instance of this: requiring a job that never
// reports on a pull request would block every merge permanently.
test('a job guarded against pull_request is marked as not running on one', () => {
  const jobs = parseWorkflowJobs(`
on:
  pull_request:
  push:
jobs:
  edge:
    name: Ghost managed edge
    if: github.event_name != 'pull_request'
    runs-on: ubuntu-latest
    steps:
      - run: echo hi
`, 'security.yml');
  assert.equal(jobs[0].runsOnPullRequest, false);
});

test('a reusable-workflow caller reports the caller name, which GitHub prefixes', () => {
  const jobs = parseWorkflowJobs(`
on:
  pull_request:
jobs:
  dependency-scan:
    name: Dependency scan
    uses: google/osv-scanner-action/.github/workflows/osv-scanner-reusable.yml@abc
`, 'security.yml');
  assert.equal(jobs[0].checkName, 'Dependency scan');
  assert.equal(jobs[0].reusable, true);
});

// Fail closed. A workflow this cannot read must stop the check, never be
// silently contributed as zero jobs — that is how a job hides from the gate.
test('a workflow with no jobs block is an error rather than an empty contribution', () => {
  assert.throws(() => parseWorkflowJobs('on:\n  pull_request:\n', 'broken.yml'), /no `jobs:`/i);
});

// --- reconcileRequiredChecks

const ok = (jobs, required) => reconcileRequiredChecks({ jobs, requiredContexts: required });

test('every pull-request job that is required passes', () => {
  const result = ok(
    [{ checkName: 'Repository verification', runsOnPullRequest: true, workflow: 'ci.yml', id: 'verify' }],
    ['Repository verification'],
  );
  assert.deepEqual(result.failures, []);
});

// The defect this whole check exists for: a job added without its ruleset entry
// goes red beside a mergeable pull request.
const VERIFY = { checkName: 'Repository verification', runsOnPullRequest: true, workflow: 'ci.yml', id: 'verify' };

test('a pull-request job missing from the ruleset fails, naming it', () => {
  const result = ok(
    [VERIFY, { checkName: 'Exemption premises', runsOnPullRequest: true, workflow: 'security.yml', id: 'exemption-premises' }],
    ['Repository verification'],
  );
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /Exemption premises/);
  assert.match(result.failures[0], /required status check/i);
});

test('a job that never runs on a pull request is not demanded', () => {
  const result = ok(
    [VERIFY, { checkName: 'Ghost managed edge', runsOnPullRequest: false, workflow: 'security.yml', id: 'ghost-managed-edge' }],
    ['Repository verification'],
  );
  assert.deepEqual(result.failures, []);
});

test('a named exemption is honoured, and the reason travels with it', () => {
  const result = ok(
    [VERIFY, { checkName: 'dependabot-auto-merge', runsOnPullRequest: true, workflow: 'dependabot-auto-merge.yml', id: 'dependabot-auto-merge' }],
    ['Repository verification'],
  );
  assert.deepEqual(result.failures, []);
  assert.ok(EXEMPT_JOBS.has('dependabot-auto-merge'));
  assert.match(EXEMPT_JOBS.get('dependabot-auto-merge'), /arms auto-merge/);
});

// The reverse direction. A context required but no longer produced by any job
// blocks every merge forever, because a check that never reports never passes.
test('a required context no job produces fails', () => {
  const result = ok(
    [{ checkName: 'Repository verification', runsOnPullRequest: true, workflow: 'ci.yml', id: 'verify' }],
    ['Repository verification', 'Check That Left'],
  );
  assert.equal(result.failures.length, 1);
  assert.match(result.failures[0], /Check That Left/);
  assert.match(result.failures[0], /no job/i);
});

test('a reusable caller matches its prefixed context', () => {
  const result = ok(
    [{ checkName: 'Dependency scan', runsOnPullRequest: true, reusable: true, workflow: 'security.yml', id: 'dependency-scan' }],
    ['Dependency scan / osv-scan'],
  );
  assert.deepEqual(result.failures, []);
});

test('examining nothing is an error, never a pass', () => {
  assert.throws(() => ok([], ['anything']), /no jobs/i);
  assert.throws(() => ok([{ checkName: 'x', runsOnPullRequest: true, workflow: 'w', id: 'x' }], []), /no required/i);
});

// --- against this repository's real workflows, so the check is anchored to
// the files it actually governs rather than only to fixtures.

test('every workflow file in this repository parses', () => {
  const files = readdirSync(workflows).filter((f) => f.endsWith('.yml'));
  assert.ok(files.length >= 4, `expected the four documented workflows, saw ${files.length}`);
  let total = 0;
  for (const file of files) {
    const jobs = parseWorkflowJobs(readFileSync(path.join(workflows, file), 'utf8'), file);
    assert.ok(jobs.length > 0, `${file} yielded no jobs`);
    total += jobs.length;
  }
  assert.ok(total >= 8, `expected at least eight jobs across the fleet workflows, saw ${total}`);
});

test('the live workflows produce exactly the job names the contract names', () => {
  const names = new Set();
  for (const file of readdirSync(workflows).filter((f) => f.endsWith('.yml'))) {
    for (const job of parseWorkflowJobs(readFileSync(path.join(workflows, file), 'utf8'), file)) {
      names.add(job.checkName);
    }
  }
  for (const expected of [
    'Repository verification', 'Semgrep CE', 'Secret scan',
    'Dependency scan', 'Exemption premises', 'Ghost managed edge',
  ]) {
    assert.ok(names.has(expected), `${expected} was not derived from the workflow files`);
  }
});
