// Required status checks, derived from the workflows rather than remembered.
//
// On 2026-09-09 an `exemption-premises` job was added to security.yml and the
// branch ruleset was not updated in the same change set. The job was green, so
// nothing looked wrong — but a run where it caught a dead premise would have
// gone red beside a mergeable pull request, because a check that is not
// required does not block anything. The gap was found by hand a day later.
//
// The fleet conformance checker catches this class weekly. This closes the
// window between adding a job and that checker next running, by failing on the
// very pull request that introduces the job.
//
// It works in both directions. A job that runs on pull requests and is not
// required is a gate nobody is held to. A required context that no job
// produces is worse: a check that never reports never passes, so it blocks
// every merge forever.

/**
 * Jobs that run on pull requests and are deliberately NOT required.
 *
 * Each carries the reason, because an unexplained exemption is indistinguishable
 * from an oversight. These are policy exclusions rather than derivable facts —
 * a job that simply never runs on a pull request needs no entry here, because
 * `runsOnPullRequest` already answers for it.
 */
export const EXEMPT_JOBS = new Map([
  ['review', 'Advisory Claude review. It skips on fork pull requests and whenever '
    + 'CLAUDE_CODE_OAUTH_TOKEN is absent, and GitHub counts a skipped required check as '
    + 'satisfied — so requiring it would report green having reviewed nothing.'],
  ['dependabot-auto-merge', 'AGENTS.md bars this by name: it arms auto-merge rather than '
    + 'gating, and requiring it would make the arming job a precondition of the merge it arms.'],
]);

const JOB_ID = /^ {2}([A-Za-z0-9_-]+):\s*$/;
const NEXT_TOP_LEVEL = /^\S/;

/**
 * Job ids and their rendered check names, read from a workflow's raw source.
 *
 * Deliberately a narrow reader rather than a YAML parse: the repository has no
 * YAML dependency, and every rule below fails loudly on something it cannot
 * read instead of contributing zero jobs, which is how a job would hide.
 */
export function parseWorkflowJobs(yamlText, filename) {
  const lines = String(yamlText).split('\n');

  const jobsIndex = lines.findIndex((l) => /^jobs:\s*$/.test(l));
  if (jobsIndex === -1) {
    throw new Error(`${filename} has no \`jobs:\` block; the required-check scan could not read it.`);
  }

  // A workflow contributes checks only if it can run on a pull request at all.
  const header = lines.slice(0, jobsIndex).join('\n');
  const triggersOnPullRequest = /^\s{2}pull_request:/m.test(header);

  const jobs = [];
  for (let i = jobsIndex + 1; i < lines.length; i += 1) {
    if (NEXT_TOP_LEVEL.test(lines[i])) break;
    const match = JOB_ID.exec(lines[i]);
    if (!match) continue;

    const id = match[1];
    let name = null;
    let guardedOffPullRequest = false;
    let reusable = false;

    for (let j = i + 1; j < lines.length; j += 1) {
      if (NEXT_TOP_LEVEL.test(lines[j]) || JOB_ID.test(lines[j])) break;
      const body = lines[j];
      const named = /^ {4}name:\s*(.+?)\s*$/.exec(body);
      if (named && name === null) name = named[1].replace(/^["']|["']$/g, '');
      if (/^ {4}uses:\s*\S+/.test(body)) reusable = true;
      // Only a guard that excludes pull_request outright counts. A conditional
      // that merely mentions the event still reports on a pull request.
      const guard = /^ {4}if:\s*(.+?)\s*$/.exec(body);
      if (guard && /github\.event_name\s*!=\s*['"]pull_request['"]/.test(guard[1])) {
        guardedOffPullRequest = true;
      }
    }

    jobs.push({
      id,
      workflow: filename,
      checkName: name ?? id,
      reusable,
      runsOnPullRequest: triggersOnPullRequest && !guardedOffPullRequest,
    });
  }

  if (jobs.length === 0) {
    throw new Error(`${filename} has a \`jobs:\` block but yielded no jobs; the scan could not read it.`);
  }
  return jobs;
}

// GitHub renders a reusable-workflow caller's check as "<caller name> / <inner
// job name>", so the caller matches by prefix rather than equality.
const matchesContext = (job, context) =>
  context === job.checkName || (job.reusable && context.startsWith(`${job.checkName} / `));

/** Both directions: unrequired jobs, and required contexts nothing produces. */
export function reconcileRequiredChecks({ jobs, requiredContexts }) {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    throw new Error('The required-check scan found no jobs; it examined nothing and must not report success.');
  }
  if (!Array.isArray(requiredContexts) || requiredContexts.length === 0) {
    throw new Error(
      'The branch ruleset reported no required status checks. Either the ruleset is gone or the read failed; '
      + 'both are failures rather than a repository with nothing to require.',
    );
  }

  const failures = [];

  for (const job of jobs) {
    if (!job.runsOnPullRequest) continue;
    if (EXEMPT_JOBS.has(job.checkName)) continue;
    if (requiredContexts.some((context) => matchesContext(job, context))) continue;
    failures.push(
      `${job.workflow} job "${job.checkName}" runs on pull requests but is not a required status check. `
      + 'A job that is not required does not block anything, so a run where it catches something goes red '
      + 'beside a mergeable pull request. Add it to the main-requires-green-ci ruleset, or add it to '
      + 'EXEMPT_JOBS with the reason it must not gate.',
    );
  }

  for (const context of requiredContexts) {
    if (jobs.some((job) => matchesContext(job, context))) continue;
    failures.push(
      `The ruleset requires "${context}", which no job in any workflow produces. A required check that never `
      + 'reports never passes, so this blocks every merge. Remove it from the ruleset or restore the job.',
    );
  }

  return { failures, examined: jobs.length, required: requiredContexts.length };
}
