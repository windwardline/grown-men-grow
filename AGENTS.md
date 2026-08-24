# Project Agent Rules

All machine-wide engineering and safety standards remain in force. This file adds rules specific to Grown Men Grow. Work here follows the CONVERGE cycle and delivery discipline in `FLEET.md` (windwardline/windwardline) — find → refute → verify yourself → fix → re-rank → test → update → report; enumerate the gates rather than counting them, stage explicit paths, validate before mutating, preserve standing claims, derive populations rather than curating them, and never let a harness failure read as the subject refusing. `FLEET.md` governs where it and this summary differ.

## Purpose and stack

This repository is the private operational source for the Grown Men Grow Ghost publication and its approved distribution assets. It does not deploy the public website.

- Ghost(Pro) hosts the publication, membership, newsletter, and native analytics.
- Cloudflare provides public DNS and routed inbound email.
- Instagram is the primary launch social channel. The founder also approved the zero-cost discovery network recorded in `docs/technical/distribution-plan.md` on 2026-08-08.
- Node.js rendering scripts generate review and launch assets. The repository has no root application runtime. `theme/package.json` exists only to validate and package the static Ghost theme with GScan.

Stack exception (owner-approved 2026-08-07): Ghost(Pro), rather than Vercel, hosts the publication because native publishing, membership, newsletters, analytics, and export are launch requirements. This repository stores content and operational assets; it does not deploy the public site.

## Editorial and identity contract

- Founder-approved public copy under `content/` is canonical. Do not rewrite it during implementation or distribution without a new founder decision.
- The voice is organic, nuanced, sophisticated, adult, and visibly human. It may be dry, funny, imperfect, or occasionally profane when emphasis earns it. Do not polish it into generic therapy language, self-help packaging, slogans, or an AI cadence.
- Avoid formulaic titles and captions, including interchangeable comma-chain constructions. Concrete observations, tension, and earned humor carry the writing.
- **No event may be invented for narrative force** (founder ruling 2026-08-08, reaffirmed 2026-08-12). Copy may assert that something *happens*; it may not assert that a particular thing *happened* unless the founder supplied the fact. The founder guides tone, edits, and approves — they do not supply source material, so the generic present is the working register and reportage is not available to this publication. First person is confirmed by the founder before approval, never proposed as fact. A composite is still an asserted event and is covered by the same rule.
- Grown Men Grow is pro-male and responsibility-centered. It rejects grievance, domination, gender-war framing, anti-male shame, forced ideological pandering, and the pursuit of anyone's approval as proof of virtue. Do not use the manosphere, women, or feminism as profile positioning.
- Do not identify Gartner in public pages, essays, newsletters, metadata, social copy, captions, alt text, or public account fields.
- Keep Grown Men Grow primary. The publication runs in publication voice on every public surface (founder ruling 2026-08-10): the founder's name and face appear nowhere public — no bylines, author cards, staff names, or metadata credits. Internal repository records may still name the founder.
- Follow `docs/editorial-underpinning.md` (founder-approved 2026-08-11): take the reader's pain seriously, create space rather than prescribe, never let care become control, and never use shame as a lever. Run every new draft against its nine tests before the founder sees it. That document governs reasoning only — its source tradition's names and terms never appear in public copy.
- Follow `docs/editorial-visual-system.md`: bright, energetic, tactile editorial collage; maintained environments; visible human authorship; varied compositions; and no despair-coded, dilapidated, or visibly synthetic imagery.

## Distribution boundary

- Ghost is the canonical publication, archive, and only master email list.
- Medium is the only approved full-essay syndication surface, and only through URL import with the Ghost canonical verified.
- Other platforms receive reviewed native excerpts, visuals, conversation, or links.
- Never import Ghost members into another service or synchronize subscriber lists.
- Automation may create drafts and scheduling stubs. It may not publish unreviewed platform copy.
- Social profiles remain brand-first. Every public identity, including Ghost and Medium, is Grown Men Grow; the founder's name is never attached publicly (founder ruling 2026-08-10).

## Commands and gates

Run these before committing material changes:

1. `node scripts/verify-ghost-theme.mjs`
2. `pnpm --dir theme install --frozen-lockfile`
3. `pnpm --dir theme test`
4. `pnpm --dir theme zip && theme/node_modules/.bin/gscan -z --fatal --verbose dist/grown-men-grow.zip`
5. `node --test 'scripts/test/**/*.test.mjs'`
6. `node scripts/verify-repository.mjs`
7. `bash scripts/verify-svg-xml.sh`
8. Review `git diff --check` and the complete staged file list.

Every workflow this repository runs is named here by filename — `ci.yml`, `security.yml`, `claude-review.yml`, and `dependabot-auto-merge.yml` — because a gate that is not in this contract is a gate nobody knows to look for. CI (`ci.yml`, on pushes and pull requests against `main`) repeats the script unit tests and the Ghost theme, repository, and SVG verification: it installs the theme dependencies from `theme/pnpm-lock.yaml` with a frozen lockfile, runs GScan over both the theme and the packaged zip, and installs `libxml2-utils` for the SVG check. The repository check also enforces photograph exclusivity, the founder's 2026-08-16 ruling (Gate 8): a photograph belongs to at most one published Instagram asset. Repeats within a single asset stay fine — a carousel is one narrative unit and may use its article's photography across its own slides. The four posted Essay 1 launch families are grandfathered against each other **only**; any unpublished asset sharing a photograph with anything else fails, including with a grandfathered family. Two narrower checks written earlier the same day (feed-tile rectangle overlap, and a single-image-post rule) were removed once this one landed, because it subsumes both and a gate that can never fire implies coverage it does not have. It also derives its own manifest in both directions: every file named in `requiredFiles` must exist, and every tracked `scripts/lib/*.mjs` and `scripts/test/*.test.mjs` must be named there, so adding a module or a test file without registering it fails the check. The reverse direction was added 2026-08-23 after a test file arrived unregistered in the same commit that added it to stop a silent regression, and it found `scripts/lib/buffer-api.mjs` unregistered since it shipped; the scope is those two directories only, because that is where an unheld file is a hole in the test surface rather than manifest noise. It enforces the founder's 2026-08-24 alt-text ruling: the agent that generates the artwork writes its alt text, and no reader-facing image ships without it. Every note under `content/field-notes/` must carry a `feature_image_alt` in its frontmatter long enough to describe an image, and must carry exactly one `- Slide n:` alt line per `## Slide n` in its carousel — counted both ways, so a slide added without a line and a line left without a slide each fail. That replaced a hand-written list of ten of the thirteen notes which asserted only that the phrase "alt text" appeared somewhere in the file, so three notes went unchecked and a heading with nothing under it passed. `buildPostPayload` omits `feature_image_alt` rather than sending an empty string, because an empty alt marks an image decorative to a screen reader and is worse than an absent one — the gate is what makes the omission unreachable. It resolves every relative ESM specifier in every tracked `scripts/` JavaScript file against the filesystem, and fails on any that does not name a regular file. `node --check` cannot see this class: specifiers resolve at link time, not parse time, so a syntax gate over forty files opens none of their imports. `stage-next-field-note.mjs` shipped in `892f1aa` with a specifier one directory deep and died on `ERR_MODULE_NOT_FOUND` on its first line in every invocation until 2026-08-24, unnoticed because the publication register always held a scheduled slot and so nothing ever ran it. The check demands a regular file rather than mere existence, because a directory specifier throws `ERR_UNSUPPORTED_DIR_IMPORT` at the same link-time moment and a bare existence test would pass it. It reads raw source rather than a parse tree, so a relative path quoted **after `from` or `import`** is scanned wherever it appears, comments and string literals included; a path quoted on its own in prose is not. That direction only ever fails loudly on something real, never waves a broken import through, which is why the regex was kept over a comment-stripping scanner that could desync and miss one.

Security analysis (`security.yml`) runs on pull requests and pushes against `main`, `workflow_dispatch`, a Monday full sweep, and a daily 13:17 UTC dependency check. Semgrep and secret scanning run on every non-daily trigger; the unguarded OSV job runs on every trigger and scans `theme/pnpm-lock.yaml`, failing on any known vulnerability. The secret-scan job also carries the SHA-pinned fleet `verify-action-pins` action as a step rather than a job, so the pin audit rides an already-required check. It mints a fleet App token when `FLEET_AUTOMERGE_APP_ID` is set, because on a private repository a Dependabot-scoped `GITHUB_TOKEN` cannot list a pull request's commits and gitleaks fails on every Dependabot PR without it. Skipping the job for Dependabot is not the remedy: GitHub counts a skipped required check as satisfied, so the gate would report green having scanned nothing. Accepted risks live in the root `osv-scanner.toml`, each with a stated rationale and an expiry date; the file sits at the root rather than beside the lockfile because every tracked file under `theme/` ships inside the published theme zip. One entry is live: extract-zip 2.0.1 (GHSA-jmr9-qjv8-65gv), expiring 2026-11-09, at which point the gate fails again and the risk must be re-accepted on that day's facts.

An advisory Claude review runs only on eligible same-repo PR events whose original triggering actor (`github.actor`) is not `dependabot[bot]` via `claude-review.yml`, which deliberately calls the fleet reusable at `@main` — one merge updates every repo. It activates only when the `CLAUDE_CODE_OAUTH_TOKEN` secret is present, and reviews bill the owner's Claude subscription rather than Console credits. Fork pull requests and runs without the credential skip by security design.

Dependabot groups every GitHub Actions update into `github-actions` and development-only npm updates under `/theme` into `ghost-theme-tooling`. The auto-merge lane evaluates the highest semver change reported for a grouped pull request, so one major update holds the entire group. `dependabot-auto-merge.yml` merges nothing itself: it arms GitHub's native auto-merge on Dependabot pull requests so the branch ruleset stays the only thing deciding whether a merge happens, and it refuses to arm where the repository reports `allow_auto_merge` off or no required status check, because `gh pr merge --auto` degrades to an immediate merge when nothing is pending. It runs only for same-repository pull requests authored by `dependabot[bot]` under the `windwardline` owner, and holds for a human — withdrawing any auto-merge it armed earlier — on a `no-automerge` label, a release that changed maintainers, a pre-1.0 package, unverifiable Dependabot metadata, a major bump, or an unrecognised update type. It labels major bumps `deferred-major` before holding. It mints a GitHub App token from the `FLEET_AUTOMERGE_APP_ID` and `FLEET_AUTOMERGE_PRIVATE_KEY` **Dependabot** secrets and degrades to `GITHUB_TOKEN` when they are absent; the fallback still arms, but a push attributed to `GITHUB_TOKEN` creates no workflow run at all, so the job's run summary names which credential was used. Its job id carries no `name:`, so the check renders exactly `dependabot-auto-merge` — it must never become a required check. The file is byte-identical in every fleet repository that takes it, and `FLEET.md` governs it. The unused root `vercel.json` is retained solely because it is a fleet-conformance artifact; it is not the publication's hosting configuration.

## Shared handoff log

Codex, Claude Code, and any other coding agent used in this repository must maintain `docs/technical/handoff-log.md` as the shared operational record.

Before starting material work:

1. Read `docs/technical/handoff-log.md` in full.
2. Read `docs/technical/decision-log.md` and `docs/technical/founder-decisions.md` for current founder rulings.
3. Inspect `git status --short` and preserve unrelated or founder-authored changes.

Before ending any session that changes files, decisions, generated assets, or an external account:

1. Append a dated entry to `docs/technical/handoff-log.md`.
2. Record the client used, scope completed, exact files changed, external state changed, verification performed, open blockers, and ordered next actions.
3. Distinguish staged/draft work from anything public, sent, purchased, or deployed.
4. Never write passwords, tokens, access codes, cookies, member data, private correspondence, or other secrets into the log.

The handoff log is append-only. Do not rewrite earlier entries to make later work look cleaner; add a correction in a new entry.

## Repository completion authority

The founder authorizes Codex, Claude Code, and later coding agents working in this repository to complete the normal Git lifecycle without a separate prompt for each step. After scoped work is complete, agents may run the available checks, verify the result, commit on a non-default branch, push, open or update a pull request, merge only after the applicable gates pass, and remove merged local and remote branches or temporary worktrees they created.

This authority is limited to repository operations for Grown Men Grow. The GitHub repository must remain private unless the founder explicitly approves public visibility. Preserve unrelated and founder-authored changes, ignored private source material, exports, and backups. Never force-push or bypass a required check.

## Launch authority

The founder makes final decisions. Do not purchase a Ghost plan, make the site public, publish or send Ghost content, post to Instagram, or make a comparable launch action without the founder's explicit authorization for that action.
