# API access

All programmatic access to the publication's platforms follows the machine-wide credential policy: every secret lives in the macOS Keychain (account `peacock`), service names are kebab-case `provider-purpose`, dashboard key names equal Keychain names, and one active key per provider. No secret appears in this repository, in shell profiles, or in agent transcripts; agents read keys through the Keychain at call time and print only statuses.

## Keychain map (verified live 2026-08-10)

| Service name | Provider surface | Purpose | Verified by |
| --- | --- | --- | --- |
| `ghost-admin-api` | Ghost(Pro) Admin API (custom integration `ghost-admin-api`) | Content, settings, and member-free admin operations | HTTP 200 on `/ghost/api/admin/site/` |
| `buffer-api-token` | Buffer GraphQL API (`https://api.buffer.com`, Personal Access key) | Staging channel drafts and Ideas without the browser | HTTP 200 on account/organizations query |
| `bluesky-claude-code` | Bluesky app password (DM access excluded) | Direct AT Protocol operations (profile, posts) | HTTP 200 `createSession` as `grownmengrow.com` |
| `cloudflare-dns-edit` | Cloudflare API token (Zone.DNS edit) | DNS for `windwardline.com` and `grownmengrow.com` via the `cf-dns` helper | Zone lookup returned `grownmengrow.com` |

The Cloudflare entry predates this publication; its token was scope-extended to include the `grownmengrow.com` zone on 2026-08-10 (same secret, no new key).

## Deliberately keyless

- **Zapier** — the client OAuth session self-manages and is exempt under the credential policy. The Ghost Admin key inside the Zap's connection is Zapier-held, not local.
- **LinkedIn and Instagram** — no practical direct API for this use (organization posting requires platform app review). Buffer is their API layer; `buffer-api-token` covers both.
- **Medium** — issues no new API tokens; syndication remains manual URL import.
- **Substack** — no public API; Notes remain native.

## Boundaries

API access changes no publishing rules: automation creates drafts and staging objects only, nothing publishes without founder review, Ghost remains the only master email list, and launch actions remain founder-gated.
