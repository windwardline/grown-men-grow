# fleet-template

The starting point for every new Windward Line repository. Create from it:

```bash
gh repo create windwardline/<name> --private --template windwardline/fleet-template --clone
```

The template seeds the fleet standard's artifacts; the authority is
`FLEET.md` in `windwardline/windwardline`, enforced by
`scripts/fleet-conformance.sh` there. A template can go stale — the checker
cannot. Run it before first release.

## After creating a repo

1. Replace every `{{DOMAIN}}` and `{{NAME}}` placeholder (LICENSE, SECURITY.md,
   AGENTS.md, security.yml).
2. Fill in `.github/workflows/ci.yml` with the repo's real gates, and complete
   the AGENTS.md operating contract.
3. App-class repos: swap `.github/dependabot.yml` for the npm+actions form
   (copy from mimic), and uncomment the OSV and Headers live blocks in
   `security.yml` (replace `{{DOMAIN}}`). Adjust `vercel.json`'s CSP to the
   app's real needs — the seeded seven-header set is the conformance floor,
   explicit always. App-class also means a header contract test (copy
   timeshift's `security-headers.test.ts`).
4. Enable auto-merge:
   `gh repo edit windwardline/<name> --enable-auto-merge`
5. Create the ruleset (required checks = every PR-running CI and scan job by
   name, linear history, no bypass actors) — copy an existing repo's:
   `gh api repos/windwardline/craft/rulesets --jq '.[0]'` as the shape.
6. Propagate the review secret:
   `security find-generic-password -s anthropic-actions-oauth -w | gh secret set CLAUDE_CODE_OAUTH_TOKEN -R windwardline/<name>`
7. On launch (production URL live): the launch registry rule applies — Labs
   register, portfolio, and both READMEs update in the same change set.
8. Stack: build on the preferred stack (FLEET.md → Preferred stack). A
   deviation needs the owner's approval *before* adoption, recorded in this
   repo's AGENTS.md as `Stack exception (owner-approved YYYY-MM-DD): ...` —
   the conformance checker fails unrecorded deviations.
9. Collects any user data? Ship `/privacy` in the house form — what is kept,
   every processor named, retention, deletion contact — linked from the
   surface where collection happens (copy timeshift's `app/privacy/page.tsx`).
10. Verify: `windwardline/windwardline/scripts/fleet-conformance.sh` passes.
