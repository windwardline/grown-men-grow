# {{NAME}} — operating contract

Operating contract for AI work in this repo; the global `~/AGENTS.md` still applies. {{NAME}} is TODO(one sentence: what this is). Live at {{DOMAIN}}.

## Stack — do not substitute without flagging

TODO(framework + notable deps with versions worth pinning or flagging)

## Commands

TODO(exact dev/test/lint/typecheck/build commands)

## Gates — CI in order

TODO(ci.yml steps in order). Push to main deploys production. A parallel `security.yml` (PRs, pushes, weekly cron) gates Semgrep and secret scan; a post-deploy job asserts the production security headers. An advisory Claude review runs on every same-repo PR via `claude-review.yml`, which deliberately calls the fleet reusable at `@main` — one merge updates every repo. It activates only when the `CLAUDE_CODE_OAUTH_TOKEN` secret is present — reviews bill the owner's Claude subscription, not Console credits; fork PRs never receive secrets, so they skip it by security design.

## Laws

- TODO(the 3-6 non-obvious facts a fresh agent would get wrong — encode what the gates cannot catch: silent failure modes, generated files, deliberate exceptions, spec locations that are source of truth)
