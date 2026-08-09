# Shared Handoff Log

This append-only log gives Codex, Claude Code, and future agents one operational history. Public copy remains canonical in `content/`; founder rulings remain canonical in `decision-log.md` and `founder-decisions.md`.

## Entry format

- Date and client
- Scope completed
- Files changed
- External state changed
- Verification
- Open blockers or decisions
- Ordered next actions

Never include credentials, private access codes, cookies, member data, or private correspondence.

## 2026-08-07 — Codex — Handoff logging established

- **Scope completed:** Added a shared, mandatory handoff protocol for all coding agents used in this repository.
- **Files changed:** `AGENTS.md`, `CLAUDE.md` (symlink to `AGENTS.md`), and this log.
- **External state changed:** None.
- **Verification:** Pending symlink and inode verification after file creation.
- **Open blockers or decisions:** None.
- **Next actions:** Continue the active Ghost, domain, SEO, Instagram, and launch-asset work; append a complete operational entry before ending the session.

## 2026-08-08 — Codex — Private launch staging completed and reconciled

- **Scope completed:** Completed the private Ghost and Instagram launch baseline; corrected and propagated the centered brand avatar; rendered the full launch graphic system; staged approved Ghost pages, Essay 1, metadata, social cards, and welcome email; configured organic-discovery standards; attached the custom apex domain; created a prelaunch export; removed stale scaffolds and generated artifacts; reconciled every active document; and prepared the repository rename to Grown Men Grow.
- **Files changed:** `.env.example`, `.gitignore`, `AGENTS.md`, `CLAUDE.md` (symlink), `README.md`, `docs/README.md`, all active files under `docs/technical/`, canonical content under `content/`, brand/source/draft assets under `assets/`, and the five rendering scripts under `scripts/`.
- **External state changed — Ghost:** `grownmengrow.com` accepted as the custom domain; apex HTTPS active; Source v1.7.1 and approved branding active in private mode; Start Here and About staged as the only page drafts; “Strength Has to Grow Up” staged as the only post draft with Michael Peacock credited; approved homepage/per-page metadata and social cards staged; approved welcome body staged and previewed with automation off; `hello@grownmengrow.com` used for reply-to and Portal support; generic “About this site” scaffold deleted; newsletter enabled but nothing sent; Ghost Explore off; Network disabled by private mode; Publisher checkout prepared but not confirmed.
- **External state changed — Cloudflare:** DNS-only `CNAME @` points to `grown-men-grow.ghost.io`; DNS-only `A www` points to `178.128.137.126`; existing Email Routing MX, SPF, and DKIM records preserved. Apex and mail DNS resolve. `www` resolves globally but its Ghost redirect certificate is still provisioning.
- **External state changed — Instagram:** Public professional profile remains `@grownmengrow`, display name **Grown Men Grow**, bio “Some assembly still required.”, corrected centered avatar, and no Michael Peacock public identity. Category and contact display are both off. Account Status showed checkmarks for removed-content/messaging issues, availability to people under 18, and feature access. No content was posted and the website link remains blank until launch.
- **Verification:** Corrected avatar source and brand PNG hashes match (`b46abba3e8658304ca260b57a2697a4ab8d2b638acdcbfe39f809c6dd61aa4ff`). All 32 launch PNGs and 32 source SVGs are present; dimensions are correct for feed, Story/Reel, and 1200×630 social-card outputs; five contact sheets were reviewed. All JavaScript files pass `node --check`; all SVGs pass `xmllint`; Ghost desktop/phone previews for Start Here, About, and Essay 1 and the Essay 1/welcome email previews were reviewed. The ignored Ghost export exists with SHA-256 `80e65ca422662f727ab2c2949822f6c8d3e7ca9494147c361dbddf3b5b7c6a8b`. No obsolete project-title/path reference, generic welcome copy, stale `noreply` support address, Gartner mention in public assets, founder name in Instagram assets, empty directory, or target-directory collision remains.
- **Correction to prior entry:** `CLAUDE.md -> AGENTS.md` is verified. `ls -laiL` reports inode `115893254` for both paths.
- **Repository state:** Branch `chore/launch-foundation`; no commit or remote was created. All repository deliverables remain untracked because commits require a separate explicit founder request. Ignored private inputs, PDFs, exports, backups, browser logs, and OS metadata remain outside version control.
- **Open blockers or decisions:** Ghost must finish the `www` TLS certificate; founder must complete the prepared $348/year Publisher checkout; founder test inbox is still needed for signup, magic link, welcome, reply, account-management, and unsubscribe testing; launch date, Essay 1 publish-only versus publish-and-email, staff bio, Google Search Console, launch-post classification additions, repository visibility, and every public release gate remain founder decisions.
- **Ordered next actions:** (1) Rename the checkout to `/Users/peacock/Projects/grown-men-grow/` as the final filesystem action of this session. (2) Founder completes the prepared Publisher checkout. (3) Codex enables native web analytics and rechecks `www` TLS. (4) Founder approves the concise Ghost staff bio and launch-post discovery additions. (5) Founder supplies a test-inbox destination and completes any inbox-side actions. (6) Codex runs end-to-end private tests. (7) Founder decides launch timing and Essay 1 delivery. (8) Codex performs the authorized public launch, adds the live tracked link, verifies indexing/analytics, and records day-0 metrics.

## 2026-08-08 — Codex — Repository rename and domain TLS closure verified

- **Scope completed:** Closed the two items left at the prior usage-limit boundary: verified the completed repository rename and rechecked the pending Ghost `www` certificate. Reconciled active operational documents against the current domain state.
- **Files changed:** `README.md`, `docs/technical/decision-log.md`, `docs/technical/founder-decisions.md`, `docs/technical/ghost-setup.md`, `docs/technical/seo-organic-growth.md`, `docs/technical/release-checklist.md`, and this log.
- **External state changed:** No external setting was changed by Codex. Ghost's provider-managed certificate completed provisioning independently; `www.grownmengrow.com` now serves HTTPS and redirects to the canonical apex. The publication remains private. Nothing was published, sent, posted, purchased, or deployed.
- **Verification:** The checkout exists at `/Users/peacock/Projects/grown-men-grow/`; the obsolete checkout path is absent; no obsolete project-title or path reference remains in active repository content. `curl -IL` confirmed `https://www.grownmengrow.com/` returns `302` to `https://grownmengrow.com/`, the apex returns the expected private-site flow, and the legacy `ghost.io` hostname redirects to the apex.
- **Repository checks:** `AGENTS.md` and `CLAUDE.md` still resolve to inode `115893254`; every renderer passes `node --check`; every SVG passes `xmllint`; no active document still describes the repository rename or `www` certificate as pending. This repository has no package manifest or configured typecheck, lint, or test runner beyond those direct checks.
- **Open blockers or decisions:** Founder must complete the prepared Publisher checkout; a founder test inbox is still needed for signup, magic-link, welcome, reply, account-management, and unsubscribe testing; launch date, Essay 1 publish-only versus publish-and-email, staff bio, Google Search Console, launch-post classification additions, repository visibility, and every public release gate remain founder decisions.
- **Ordered next actions:** (1) Founder completes the prepared Publisher checkout. (2) Codex enables native web analytics. (3) Founder approves the concise Ghost staff bio and launch-post discovery additions. (4) Founder supplies a test-inbox destination and completes any inbox-side actions. (5) Codex runs end-to-end private tests. (6) Founder decides launch timing and Essay 1 delivery. (7) Codex performs only the separately authorized public launch actions, adds the live tracked link, verifies indexing and analytics, and records day-0 metrics.
