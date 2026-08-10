# Distribution and Discovery Plan

Status: founder-approved on 2026-08-08. The exact Essay 1 platform pack is approved; account creation, publication, and automation remain subject to the canonical-launch sequence and platform-specific verification.

## Operating rule

Ghost is the canonical publication, permanent archive, and only master email-subscriber system. Every other surface exists to help a reader discover the work and return to `grownmengrow.com`.

- Publish complete original work on Ghost first.
- Publish a complete copy elsewhere only when Ghost can remain the explicit canonical source. Medium is the sole approved full-essay syndication channel at launch.
- Use native excerpts, conversations, document posts, images, and links on every other network.
- Do not import Ghost members into another platform or synchronize subscriber lists.
- Automation may prepare drafts and scheduling stubs. It must not turn one essay into unreviewed public posts.
- Grown Men Grow is the public identity on social platforms. Michael Peacock remains a secondary credited writer on Ghost and Medium where appropriate, not the Instagram identity.

## Approved launch network

| Surface | Launch use | Method | Incremental cost |
|---|---|---|---|
| Ghost | Canonical essays, pages, newsletter, membership | Native publication | Existing approved plan |
| Instagram | Carousels, Stories, Reels, and profile link | Meta native tools | $0 |
| Ghost Social Web and Explore | Fediverse and Ghost discovery | Ghost native distribution | $0 |
| Medium | Full essay imported from its live Ghost URL | Manual URL import with canonical verification | $0 |
| Bluesky | Short posts, discussion, and links | Buffer | $0 |
| LinkedIn Page | Select work, leadership, identity, and relationship angles | Buffer or native scheduling | $0 |
| Facebook Page | Adapted Instagram assets and direct links | Meta Business Suite | $0 |
| Substack | Notes, excerpts, and Ghost links | Native scheduling | No paid feature approved |
| Google and Bing | Search, Discover, News, image search, and Copilot discovery | Ghost sitemap and webmaster tools | $0 |

Reserve `@grownmengrow` on YouTube, TikTok, and X when available. YouTube and TikTok remain inactive until original motion work exists. X is a reservation only. Flipboard, Apple News, and an audio feed remain later-stage options.

Cloudflare Crawler Hints was approved for evaluation but is intentionally not enabled. The working Ghost(Pro) records are DNS-only, while Crawler Hints requires proxied traffic. Do not change the domain topology for an optional indexing signal.

## Brand and account standard

- Display name: **Grown Men Grow**
- Preferred handle: `@grownmengrow`
- Bluesky handle after DNS verification: `@grownmengrow.com`
- Standard non-Instagram profile line: **Essays on the unfinished work of being a man.**
- Canonical profile URL: `https://grownmengrow.com/` with a platform-specific `utm_source`
- Instagram keeps its approved bio: **Some assembly still required.**
- Credentials stay in founder-controlled authenticated sessions, the password manager, macOS Keychain, or provider secret stores. Never place them in this repository.

## Account and handle audit

Public checks were run on 2026-08-08. A 404 or unresolved handle is only provisional; availability is confirmed only inside the platform's own account-creation flow.

| Platform | Target | Current evidence | Required confirmation |
|---|---|---|---|
| Ghost | `grownmengrow.com` | Founder-owned and configured | Verify paid-plan and public-launch state in Ghost Admin |
| Instagram | `@grownmengrow` | Founder-owned public Creator profile | None |
| Medium | `@grownmengrow` | Public request blocked by Medium | Confirm in signup flow |
| Substack | `grownmengrow.substack.com` | Public URL returned 404 | Confirm in signup flow |
| Bluesky | `@grownmengrow.com` | `grownmengrow.bsky.social` did not resolve; domain handle not configured | Create account, then verify the domain handle by DNS |
| LinkedIn | `/company/grown-men-grow` | Public URL returned 404 | Confirm while creating the Page |
| Facebook | `/grownmengrow` | Public response was inconclusive | Confirm while creating the Page |
| YouTube | `@grownmengrow` | Public URL returned 404 | Reserve in YouTube Studio |
| TikTok | `@grownmengrow` | Public page reported that it could not find the account | Confirm in signup flow |
| X | `@grownmengrow` | Public URL returned 404 | Reserve only; do not activate content |

Do not create look-alike handles or add punctuation without a founder decision if the preferred handle is unavailable.

## Founder-controlled account inputs

No secret belongs in source files, Markdown, chat, commit messages, browser logs, or screenshots.

- Access to the routed `michael@grownmengrow.com` inbox for verification messages
- The existing founder-owned Ghost, Instagram/Meta, Cloudflare, Google, and LinkedIn sessions where applicable
- A unique password generated and saved by the founder's password manager for each service that does not use OAuth
- Platform verification codes, CAPTCHA, age/date-of-birth confirmation, or identity steps completed in the provider UI
- The founder's personal LinkedIn account as the private administrator of the public Grown Men Grow Page
- The connected Facebook Page through the existing Instagram identity
- The founder's Google account for Search Console, YouTube Brand Account administration, and Bing's optional Search Console import authorization
- Cloudflare DNS authority for the future Bluesky `_atproto` verification record
- OAuth consent connecting only the approved Bluesky and LinkedIn Page accounts to Buffer
- OAuth consent connecting Ghost and Buffer to the single approved Zapier draft-creation workflow

If a platform issues an API key or app password later, store it in the provider secret store or macOS Keychain under a descriptive kebab-case service name. Do not create API credentials merely to automate a task already covered by native scheduling or OAuth.

## Per-essay distribution flow

1. Approve the Ghost essay, metadata, feature image, social card, and internal links.
2. Publish the canonical Ghost URL.
3. Verify the public response, canonical, sitemap entry, social preview, and analytics.
4. Allow Ghost Social Web and RSS to distribute the canonical page; use Search Console and Bing Webmaster Tools for indexing visibility.
5. Create platform-specific text and visual variants in the repository.
6. Review those variants before scheduling.
7. Import the live URL into Medium and verify the Ghost canonical before publishing.
8. Schedule native excerpts and links on Bluesky, LinkedIn, Facebook, and Substack.
9. Review referral traffic and Ghost signups at day 7 and day 30.

## Automation boundary

The approved low-cost workflow is:

`Ghost post published -> Zapier Free -> Buffer idea`

**Built, verified, and LIVE as of 2026-08-10.** The Zap "Ghost post published → Buffer idea (launch distribution stub)" is published and running in the founder's Zapier account. The trigger was upgraded from the interim RSS design to the **Ghost app's instant Post Published trigger** (webhook-based, fires in seconds, works on the private staging site): the founder personally pasted the Ghost Admin API key into Zapier's connection dialog — no credential passed through an agent. The action creates a Buffer Idea titled with the post title, containing the title, canonical URL, and the campaign note. End-to-end verification ran against real staged Essay 1 data ("Strength Has to Grow Up") and the resulting Idea was retained on Buffer's board as Essay 1's ready launch stub, since already-published staged posts will not re-fire the trigger at launch. Because the Zap is already on, the former launch-day activation step is removed from the checklist. Note for future essays: publish events on the private site will create Idea stubs immediately — this is intended (drafts only; nothing posts without review).

The Buffer idea is a distribution stub containing the title, canonical URL, and campaign slug. A person or coding agent writes and reviews each channel version before scheduling.

- Buffer Free is reserved for Bluesky and the LinkedIn Page, leaving one of its three free channel slots open.
- The current Zapier Free allowance supports one trigger plus one action and 100 tasks per month. This workflow uses exactly one Ghost `Post Published` trigger and one Buffer `Create Idea` action.
- Meta Business Suite handles Instagram and Facebook.
- Medium remains a manual URL import because Medium no longer issues new API tokens.
- Substack Notes, YouTube, and TikTok use native tools.
- Do not build a custom cross-posting service while the free workflow meets the publishing cadence.
- Recheck provider limits before connection. If a free-plan limit changes, fall back to native manual drafts instead of accepting a paid upgrade without founder approval.

## Attribution

Use direct canonical URLs. Do not add a link shortener.

```text
utm_source=<platform>
utm_medium=social|syndication|referral|video|audio
utm_campaign=<essay-slug>
```

Profile links use `utm_medium=profile` and `utm_campaign=launch` until a later campaign replaces it.

## Measurement

The primary result is a qualified action on Ghost, not raw follower count.

- Referral sessions and engaged reading
- Start Here and essay views
- Newsletter signups and source attribution
- Saves, shares, replies, and substantive comments
- Profile visits and link taps
- Production time required per platform

Review each active channel after 60 and 90 days. Pause a high-maintenance channel that produces no meaningful reading, signup, or conversation. A nearly automatic RSS or Social Web channel may remain active at lower volume.

## Later channels and exclusions

- Activate YouTube Shorts before TikTok once a credible motion system exists. Reuse clean source video without platform watermarks.
- Submit Flipboard only after the publication has a steady archive and feed.
- Consider founder-narrated audio essays after six to eight published essays; use one Ghost-hosted RSS feed rather than a second CMS.
- Revisit Apple News after the publication has an established editorial archive.
- Use Reddit and Quora only through sincere manual participation. Never automate promotion there.
- Do not add Beehiiv, Kit, Patreon, Discord, Circle, another newsletter CMS, paid SEO software, ads, or another analytics stack at launch.

## Pinterest elimination (founder decision, 2026-08-09)

Pinterest was removed from the network before any pin was published: the surface is board-and-visual-led rather than essay-led, and its audience skews away from the publication's readership. The founder closed the account personally the same day. Platform packs, the pack-completeness gate, and the prep register no longer carry Pinterest sections.

## Threads elimination (founder decision, 2026-08-10)

Threads was removed from the network before any post was published: Meta suspended the account at creation, denied the appeal with no further review available, and a replacement would require a different Instagram identity the publication does not want. The founder ruled the surface out entirely. Platform packs, the pack-completeness gate, and the prep register no longer carry Threads sections; the drafted Threads copy was removed with them.
