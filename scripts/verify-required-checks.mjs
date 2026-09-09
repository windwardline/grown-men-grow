// Every pull-request job is a required status check, and every required check
// is produced by a job.
//
// This exists because on 2026-09-09 `exemption-premises` was added to
// security.yml without a matching ruleset entry, and nothing caught it for a
// day. The fleet conformance checker catches the class weekly; this closes the
// window by failing on the pull request that introduces the job.
//
// Reads the branch's rules through /repos/{owner}/{repo}/rules/branches/{branch},
// which needs only read access — the admin-scoped /rulesets endpoint would not
// be readable by a workflow's GITHUB_TOKEN.
//
// Fails closed. A ruleset that could not be read, or that reports nothing
// required, is a failure rather than a repository with nothing to enforce.

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseWorkflowJobs, reconcileRequiredChecks } from './lib/required-checks.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const WORKFLOWS = path.join(root, '.github', 'workflows');
const REPO = process.env.GITHUB_REPOSITORY || 'windwardline/grown-men-grow';
const BRANCH = process.env.GITHUB_BASE_REF || 'main';
const TIMEOUT_MS = 20000;

function die(lines) {
  console.error('Required-check verification failed:');
  for (const line of [].concat(lines)) console.error(`- ${line}`);
  process.exit(1);
}

async function branchRules() {
  const url = `https://api.github.com/repos/${REPO}/rules/branches/${encodeURIComponent(BRANCH)}`;
  const headers = { accept: 'application/vnd.github+json', 'x-github-api-version': '2022-11-28' };
  // GITHUB_TOKEN in Actions; locally the gh CLI's token if one is exported.
  const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN;
  if (token) headers.authorization = `Bearer ${token}`;

  let response;
  try {
    response = await fetch(url, { headers, signal: AbortSignal.timeout(TIMEOUT_MS) });
  } catch (error) {
    die(`Could not reach the GitHub rules API (${url}): ${error.message}. `
      + 'The ruleset was not read, so nothing was verified.');
  }
  if (!response.ok) {
    die(`The GitHub rules API returned HTTP ${response.status} for ${url}. `
      + 'The ruleset was not read, so nothing was verified.');
  }
  return response.json();
}

const files = (await readdir(WORKFLOWS)).filter((f) => f.endsWith('.yml') || f.endsWith('.yaml'));
if (files.length === 0) die('No workflow files were found; the scan examined nothing.');

const jobs = [];
for (const file of files) {
  try {
    jobs.push(...parseWorkflowJobs(await readFile(path.join(WORKFLOWS, file), 'utf8'), file));
  } catch (error) {
    die(error.message);
  }
}

const rules = await branchRules();
const requiredContexts = rules
  .filter((rule) => rule.type === 'required_status_checks')
  .flatMap((rule) => rule.parameters?.required_status_checks ?? [])
  .map((check) => check.context)
  .filter((context) => typeof context === 'string' && context.length > 0);

let result;
try {
  result = reconcileRequiredChecks({ jobs, requiredContexts });
} catch (error) {
  die(error.message);
}

console.log(
  `Checked ${result.examined} workflow job${result.examined === 1 ? '' : 's'} against `
  + `${result.required} required status check${result.required === 1 ? '' : 's'} on ${REPO}@${BRANCH}.`,
);

if (result.failures.length > 0) die(result.failures);

for (const job of jobs.filter((j) => j.runsOnPullRequest)) {
  console.log(`  ${job.checkName}${job.reusable ? ' (reusable caller)' : ''} — required or exempt by name.`);
}
console.log('Every pull-request job gates, and every required check is produced by a job.');
