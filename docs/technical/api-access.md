# API access

All programmatic access to the publication's platforms follows the machine-wide credential policy: every secret lives in the macOS Keychain (account `peacock`), service names are kebab-case `provider-purpose`, dashboard key names equal Keychain names, and one active key per provider. No secret appears in this repository, in shell profiles, or in agent transcripts; agents read keys through the Keychain at call time and print only statuses.

## Keychain map (verified live 2026-08-10; Ghost row re-verified 2026-08-11)

| Service name | Provider surface | Purpose | Verified by |
| --- | --- | --- | --- |
| `ghost-admin-api` | Ghost(Pro) Admin API on `https://grown-men-grow.ghost.io` (custom integration `ghost-admin-api`) | Content operations; member, tier, and settings reads (settings writes return 403) | HTTP 200 on `/ghost/api/admin/posts/?limit=1` |
| `buffer-api-token` | Buffer GraphQL API (`https://api.buffer.com`, Personal Access key) | Staging channel drafts and Ideas without the browser | HTTP 200 on account/organizations query |
| `bluesky-claude-code` | Bluesky app password (DM access excluded) | Direct AT Protocol operations (profile, posts) | HTTP 200 `createSession` as `grownmengrow.com` |
| `cloudflare-dns-edit` | Cloudflare API token (Zone.DNS edit) | DNS for `windwardline.com` and `grownmengrow.com` via the `cf-dns` helper | Zone lookup returned `grownmengrow.com` |

The Cloudflare entry predates this publication; its token was scope-extended to include the `grownmengrow.com` zone on 2026-08-10 (same secret, no new key).

## Ghost Admin API

Every Admin call goes through `scripts/lib/ghost-admin.mjs`, which signs the token and issues the request. It reads the Keychain at call time, pins the `grown-men-grow.ghost.io` host, and never returns or prints the key or the token. Do not re-derive the signing at a call site.

The host is not interchangeable with the public domain: the apex 302-redirects every admin path to `grown-men-grow.ghost.io`, the cross-origin hop strips the `Authorization` header, and the unauthenticated replay returns `403 NoPermissionError`.

Diagnose a 403 by its message, never by the URL in the error — the redirect makes an apex failure surface as `grown-men-grow.ghost.io`. `Unable to determine the authenticated user or integration` is an auth failure: issued to the apex it is the host, issued to `grown-men-grow.ghost.io` it is the key, its permissions, or a token signed against the un-decoded hex secret. `API tokens do not have permission to access this endpoint` means the key is sound and the endpoint is closed to integrations — `emails/`, `links/`, and `stats/*` answer that way, so email click counts and Ghost's own stats routes are unreachable with this key.

`/ghost/api/admin/site/` returns 200 on `grown-men-grow.ghost.io` with no `Authorization` header at all. It proves reachability and nothing about the key; probe with a path that requires auth.

## Deliberately keyless

- **Zapier** — the client OAuth session self-manages and is exempt under the credential policy. The Ghost Admin key inside the Zap's connection is Zapier-held, not local.
- **LinkedIn and Instagram** — no practical direct API for this use (organization posting requires platform app review). Buffer is their API layer; `buffer-api-token` covers both.
- **Medium** — issues no new API tokens; syndication remains manual URL import.
- **Substack** — no public API; Notes remain native.

## Boundaries

API access changes no publishing rules: automation creates drafts and staging objects only, nothing publishes without founder review, Ghost remains the only master email list, and launch actions remain founder-gated.
