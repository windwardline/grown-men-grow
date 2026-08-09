# Project Agent Rules

All machine-wide engineering and safety standards remain in force. This file adds rules specific to Grown Men Grow.

## Purpose and stack

This repository is the private operational source for the Grown Men Grow Ghost publication and its Instagram launch assets. It does not deploy the public website.

- Ghost(Pro) hosts the publication, membership, newsletter, and native analytics.
- Cloudflare provides public DNS and routed inbound email.
- Instagram is the only approved launch social channel.
- Node.js rendering scripts generate review and launch assets. The repository has no root application runtime. `theme/package.json` exists only to validate and package the static Ghost theme with GScan.

Stack exception (owner-approved 2026-08-07): Ghost(Pro), rather than Vercel, hosts the publication because native publishing, membership, newsletters, analytics, and export are launch requirements. This repository stores content and operational assets; it does not deploy the public site.

## Commands and gates

Run these before committing material changes:

1. `node scripts/verify-ghost-theme.mjs`
2. `pnpm --dir theme install --frozen-lockfile`
3. `pnpm --dir theme test`
4. `pnpm --dir theme zip && theme/node_modules/.bin/gscan -z --verbose dist/grown-men-grow.zip`
5. `node scripts/verify-repository.mjs`
6. `bash scripts/verify-svg-xml.sh`
7. Review `git diff --check` and the complete staged file list.

CI repeats the Ghost theme, repository, and SVG verification. Security workflows run Semgrep and secret scanning. The unused root `vercel.json` is retained solely because it is a fleet-conformance artifact; it is not the publication's hosting configuration.

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
