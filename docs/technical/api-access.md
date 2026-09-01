# API access

All programmatic access to the publication's platforms follows the machine-wide credential policy: every secret lives in the macOS Keychain (account `peacock`), service names are kebab-case `provider-purpose`, dashboard key names equal Keychain names, and one active key per provider. No secret appears in this repository, in shell profiles, or in agent transcripts; agents read keys through the Keychain at call time and print only statuses.

## Keychain map (verified live 2026-08-10; Ghost row re-verified 2026-08-11)

| Service name | Provider surface | Purpose | Verified by |
| --- | --- | --- | --- |
| `ghost-admin-key` | Ghost(Pro) Admin API on `https://grown-men-grow.ghost.io` (custom integration `ghost-admin-api`) | Content operations; member, tier, and settings reads (settings writes return 403) | HTTP 200 on `/ghost/api/admin/posts/?limit=1` |
| `bluesky-app-password` | Bluesky app password (DM access excluded) | Direct AT Protocol operations (profile, posts) | HTTP 200 `createSession` as `grownmengrow.com` |
| `bluesky-buffer` | Bluesky app password held by Buffer | Lets Buffer post to Bluesky on the schedule; no local script reads it | Listed by `listAppPasswords` as `bluesky-buffer` |
| `buffer-api-token` | Buffer personal access key on `https://api.buffer.com` (GraphQL) | Reading and scheduling the week's Bluesky, LinkedIn, and Instagram posts | `node scripts/check-buffer-access.mjs` returning the pinned organization |
| `cloudflare-dns-edit` | Cloudflare API token (Zone.DNS edit) | DNS for `windwardline.com` and `grownmengrow.com` via the `cf-dns` helper | Zone lookup returned `grownmengrow.com` |

The Cloudflare entry predates this publication; its token was scope-extended to include the `grownmengrow.com` zone on 2026-08-10 (same secret, no new key).

Two rows were renamed on 2026-08-17 to satisfy the `provider-purpose` convention: `ghost-admin-api` became `ghost-admin-key` (the old name read as a provider named "ghost-admin"), and `bluesky-claude-code` became `bluesky-app-password` (a credential is named for what it is, never for the client that happens to use it). The Ghost integration keeps its original dashboard name because renaming it there would re-issue the key. **This table is the operating instruction** — no script reads the Bluesky credential, so an agent following a stale name here runs a Keychain lookup that fails with nothing to explain why. `ops/credentials-check.sh` asserts the names still resolve.

`bluesky-buffer` was renamed at Bluesky on 2026-09-01. It had been created as
`buffer` — the name Bluesky suggests when a service asks for an app password —
which is not `provider-purpose` kebab-case. That single missing hyphen was the
entire "Bluesky provider population differs from the exact manifest" failure on
2026-08-31; the app-password API had not changed, and every row still carried
exactly `name`, `createdAt`, and `privileged`. **A provider's default name is
not a name this fleet accepts.** Any app password created at a provider's
prompting needs renaming before it is done.

`buffer-api-token` was removed on 2026-08-17 and re-issued on 2026-08-18. The removal reasoning was that the key was dead (Buffer returned 401) and had no executing consumer — only this table. The second half was true and is now fixed: `scripts/lib/buffer-api.mjs` is the executing consumer, so the credential is exercised by code rather than described by prose. **The first half does not survive its own timeline.** The same key scheduled four posts through this API on 2026-08-17, each verified by re-query, hours before it was called dead. A 401 was read as expiry without asking which host answered it — Buffer's older REST surface at `api.bufferapp.com` rejects a personal access key exactly that way, and so does the GraphQL host if the `Bearer` prefix is dropped. The key could not be recovered either way (Buffer shows a personal key once), so the fix was a new key, not an argument about the old one. The helper pins the host and names the 401 ambiguity in the error text so the next reading of it starts from the right question.

## Ghost Admin API

Every Admin call goes through `scripts/lib/ghost-admin.mjs`, which signs the token and issues the request. It reads the Keychain at call time, pins the `grown-men-grow.ghost.io` host, and never returns or prints the key or the token. Do not re-derive the signing at a call site.

`Accept-Version` tracks the live instance's major — `v6.0` against Ghost 6.57. Ghost supports the current major and the one before it, so a pin left a major behind breaks on the next platform upgrade with nothing local to explain it. Re-pin when Ghost(Pro) upgrades: the response's `Content-Version` header carries the server's version on every call.

The host is not interchangeable with the public domain: the apex 302-redirects every admin path to `grown-men-grow.ghost.io`, the cross-origin hop strips the `Authorization` header, and the unauthenticated replay returns `403 NoPermissionError`.

Diagnose a 403 by its message, never by the URL in the error — the redirect makes an apex failure surface as `grown-men-grow.ghost.io`. `Unable to determine the authenticated user or integration` is an auth failure: issued to the apex it is the host, issued to `grown-men-grow.ghost.io` it is the key, its permissions, or a token signed against the un-decoded hex secret. `API tokens do not have permission to access this endpoint` means the key is sound and the endpoint is closed to integrations — `emails/`, `links/`, and `stats/*` answer that way, so email click counts and Ghost's own stats routes are unreachable with this key.

`/ghost/api/admin/site/` returns 200 on `grown-men-grow.ghost.io` with no `Authorization` header at all. It proves reachability and nothing about the key; probe with a path that requires auth.

## Buffer GraphQL API

Every Buffer call goes through `scripts/lib/buffer-api.mjs`. It reads the Keychain at call time, pins `https://api.buffer.com`, sends the key as a `Bearer` token, and never returns or prints it. `node scripts/check-buffer-access.mjs` is the status-only probe; it exits non-zero on any failure, so a refusal cannot be read as a pass.

The key is created at `https://publish.buffer.com/settings/api` under **Personal Access**, and it is named `buffer-api-token` there as well as in the Keychain — the credential policy makes a differently-named provider key an orphan, and Buffer's own key list is the only place the name is visible. Creating one requires organization ownership and a verified account email.

The probe does not stop at a 200. A valid key issued from a different Buffer account authenticates cleanly and then reads an empty queue, which reports as "nothing scheduled" rather than as a failure, so the probe also asserts the pinned organization id is among the ones the key can see.

A GraphQL server answers errors with HTTP 200 and an `errors` array. The helper throws on that array rather than returning the partial `data` beside it.

Query shapes are measured, not remembered: `introspectType()` reads the live schema for a type before any new query is written against it. Three scheduled-task files had each re-derived the `posts` shape from error messages, which is how `PostsInput` acquired a `limit` argument it has never had. Measured 2026-08-18: `posts` returns `PostsResults { edges { cursor node } }` and takes `first` and `after` as siblings of `input`, so pagination exists and simply is not on `PostsInput` — the folklore was half right for the wrong reason. `PostStatus` is `draft | needs_approval | scheduled | sending | sent | error`, and both sort enums are lowercase (`dueAt|createdAt`, `asc|desc`). `Idea.createdAt` is epoch seconds, not the `DateTime` string `Post` carries; compared as text it sorts wrongly and quietly.

Buffer has no API that enumerates personal keys, so the provider side of the credential rule — is there a key at Buffer with no Keychain counterpart? — is a manual look at the Personal Access tab. It belongs in `ops/credentials-provider-check.sh`'s console-only list, with the date it was last checked by eye.

## Deliberately keyless

- **Zapier** — the client OAuth session self-manages and is exempt under the credential policy. The Ghost Admin key inside the Zap's connection is Zapier-held, not local.
- **LinkedIn and Instagram** — no practical direct API for this use (organization posting requires platform app review). Buffer is their API layer, reached three ways: this machine's `buffer-api-token`, the live Zapier Zap (Zapier-held OAuth connection, exempt from the one-key rule as a client session), and the browser.
- **Medium** — issues no new API tokens; syndication remains manual URL import.
- **Substack** — no public API; Notes remain native.

## Boundaries

API access changes no publishing rules: automation creates drafts and staging objects only, nothing publishes without founder review, Ghost remains the only master email list, and launch actions remain founder-gated.
