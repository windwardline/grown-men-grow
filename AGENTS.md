# Project Agent Rules

All machine-wide engineering and safety standards remain in force. This file adds rules specific to Grown Men Grow.

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
5. `node scripts/verify-repository.mjs`
6. `bash scripts/verify-svg-xml.sh`
7. Review `git diff --check` and the complete staged file list.

CI repeats the Ghost theme, repository, and SVG verification. The repository check also enforces photograph exclusivity, the founder's 2026-08-16 ruling (Gate 8): a photograph belongs to at most one published Instagram asset. Repeats within a single asset stay fine — a carousel is one narrative unit and may use its article's photography across its own slides. The four posted Essay 1 launch families are grandfathered against each other **only**; any unpublished asset sharing a photograph with anything else fails, including with a grandfathered family. Two narrower checks written earlier the same day (feed-tile rectangle overlap, and a single-image-post rule) were removed once this one landed, because it subsumes both and a gate that can never fire implies coverage it does not have. Security workflows run Semgrep, secret scanning, and an OSV dependency scan of `theme/pnpm-lock.yaml` that fails on any known vulnerability. Accepted risks live in the root `osv-scanner.toml`, each with a stated rationale and an expiry date; the file sits at the root rather than beside the lockfile because every tracked file under `theme/` ships inside the published theme zip. One entry is live: extract-zip 2.0.1 (GHSA-jmr9-qjv8-65gv), expiring 2026-11-09, at which point the gate fails again and the risk must be re-accepted on that day's facts. An advisory Claude review runs on every same-repo PR via `claude-review.yml`, which deliberately calls the fleet reusable at `@main` — one merge updates every repo. It activates only when the `CLAUDE_CODE_OAUTH_TOKEN` secret is present — reviews bill the owner's Claude subscription, not Console credits; fork PRs never receive secrets, so they skip it by security design. The unused root `vercel.json` is retained solely because it is a fleet-conformance artifact; it is not the publication's hosting configuration.

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
