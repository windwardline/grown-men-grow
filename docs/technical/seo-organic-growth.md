# Organic Discovery Standard

Status: founder-approved; technical baseline implemented and launch execution authorized on 2026-08-08.

## Objective

Earn qualified, organic discovery without turning the publication into generic self-help, grievance content, or keyword paste. Ghost is the canonical source and only master email list. The approved channel network is defined in `distribution-plan.md`. No paid SEO platform, advertising product, tracking pixel, link shortener, or paid scheduler is approved.

## Implemented Ghost baseline

- Canonical hostname: `https://grownmengrow.com/`; both the apex and `www` serve HTTPS, and `www` redirects to the apex.
- Ghost root-domain DNS records are DNS-only in Cloudflare. Existing Email Routing records are preserved.
- Publication title: **Grown Men Grow**.
- Site description and homepage meta description: **Essays on the unfinished work of being a man.**
- Homepage meta title: **Grown Men Grow**.
- English language and Eastern Time are set.
- Ghost's structured-data setting for LLM and AI search discovery is enabled.
- Homepage, Start Here, About, and Essay 1 have approved search metadata and distinct 1200×630 social images.
- Custom canonical fields remain blank. Ghost must generate self-canonicals and keep pages in its sitemap.
- The original theme requests `max-image-preview:large` so Google may use the full editorial feature images in search and Discover.
- Source remains the private rollback theme. The locally validated replacement theme uses semantic Ghost templates, responsive image helpers, local fonts, and no external tracking or font scripts. Activation remains pending.
- Member sources, email opens, email clicks, and outbound tagging use Ghost's native controls. Full web analytics requires the approved Publisher plan and remains unavailable until purchase.

Ghost automatically supplies XML sitemaps, canonical tags, structured data, and fallback metadata. Private mode intentionally suppresses indexing, so crawl verification happens only after launch authorization.

## Launch indexing sequence

1. Recheck the Ghost trial and plan state at the launch checkpoint. The founder deferred the Publisher purchase while the trial remains active; do not complete a charge from the earlier approval alone.
2. Live discovery 2026-08-09: the trial's pre-launch mode locks public access entirely, so launch waits for the founder's Publisher checkout. On purchase, remove privacy, then enable full native web analytics.
3. Remove private mode only when the founder authorizes launch.
4. Verify `robots.txt`, `/sitemap.xml`, page canonicals, titles, descriptions, Open Graph data, `max-image-preview:large`, and response codes on the public domain.
5. Publish Start Here, About, and Essay 1 under the approved slugs.
6. Add the approved tracked Start Here URL to Instagram.
7. Add the verified domain to Google Search Console and submit Ghost's sitemap.
8. Import the verified property into Bing Webmaster Tools and submit the same sitemap.
9. Keep the Ghost records DNS-only. Cloudflare Crawler Hints requires proxied traffic and is therefore not enabled for the current Ghost(Pro) topology. Do not risk the working Ghost certificate and domain mapping for this optional signal.
10. Record day-0 baselines.

## Search discovery accounts

Google Search Console and Bing Webmaster Tools are approved. Search Console submits Ghost's sitemap, inspects indexing, and reports Google queries, impressions, and clicks without a tracking script. Bing can import the verified Search Console property.

Cloudflare Crawler Hints was approved for evaluation but is not compatible with the current DNS-only Ghost(Pro) mapping because it depends on proxied traffic. Leave it off. Ghost's sitemap and Bing Webmaster Tools provide the launch indexing path without changing the working domain topology.

Do not add Google Analytics, Tag Manager, Meta Pixel, Semrush, a keyword service, or a backlink service at launch.

Google News and Google Discover require no separate publication submission. Eligibility comes from a public, indexed, policy-compliant site. Discover favors relevant high-resolution images; every essay therefore needs a text-light landscape feature image at least 1200 pixels wide in addition to its platform-specific social compositions.

## Editorial topic architecture

Use reader problems as the organizing system. Do not repeat a target phrase until the prose sounds mechanical.

| Editorial lane | Search intent to serve | Existing launch asset |
|---|---|---|
| Strength and performance | Why men hide behind competence; strength versus emotional avoidance | Essay 1 and foundational carousel |
| Emotional maturity and accountability | What emotional maturity looks like in men; explanation versus repair | Start Here and recognition carousel |
| Anger and shame | How men handle anger without suppression; shame as avoidance | Essay 1 |
| Loneliness and male friendship | Why men lack emotional support; how male friendship carries hard truth | Essay 1 |
| Desire, consent, and relationships | How desire remains honest without becoming entitlement | Essay 1 |
| Grief, divorce, and rebuilding | How men rebuild identity after loss | About and future field notes |
| Fatherhood, ambition, work, and identity | How adulthood changes the strengths men rely on | Future field notes |

One essay should answer one primary reader question. The title still has to sound like Grown Men Grow. A clear subtitle, opening paragraph, headings, metadata, internal links, and image description can carry search context without corrupting the title.

## Ghost publishing standard for every essay

Before publication:

1. Define the reader question in one sentence.
2. Use one descriptive slug and one approved meta title and description.
3. Keep one H1. Use natural H2s that describe the argument.
4. Link to Start Here and at least one relevant earlier field note once those links exist.
5. Add descriptive alt text to meaningful images. Decorative text cards do not need invented visual prose.
6. Cite primary sources when an essay makes factual or clinical claims.
7. Leave the custom canonical blank unless the work is intentionally syndicated from another canonical source.
8. Preview phone, desktop, email, search, X, and Open Graph output.
9. Confirm that the page gives a reader a reason to subscribe without interrupting the essay.
10. Review the published URL, sitemap entry, canonical, and analytics after launch.

## Instagram discovery standard

Keep the public profile as approved:

- Username: `@grownmengrow`
- Name: **Grown Men Grow**
- Bio: **Some assembly still required.**
- Michael Peacock's name remains absent.

Do not turn the name field or bio into a list of generic category terms. The brand is memorable; discovery context belongs in content.

For each post:

1. Put the actual subject in the first sentence of the caption and in the opening on-screen text.
2. Use the language a thoughtful reader would search, but only where it fits the argument: men's emotional maturity, strength, shame, anger, loneliness, male friendship, grief, divorce, desire, repair, fatherhood, or identity.
3. Add accurate alt text for non-text visual information. Do not use alt text as a hidden keyword field.
4. Use three to five specific hashtags only when they classify the post. Avoid broad reach bait, gender-war tags, and repetitive hashtag blocks.
5. Publish original posts. Do not repost watermark-heavy material or imitate trend formats that flatten the voice.
6. Optimize for saves, shares, profile visits, and substantive comments. Do not manufacture controversy or engagement bait.
7. Reply to good-faith comments in the publication voice. Remove misogyny, dehumanization, harassment, and gender-war recruitment instead of debating it for reach.
8. Use the direct tracked site link; no link shortener.

### Approved launch classifications

The founder approved these classifications on 2026-08-08. Append them to the corresponding caption after a blank line; do not expand them into generic hashtag blocks.

| Post | Primary discovery phrase | Suggested hashtags |
|---|---|---|
| Pinned introduction | the unfinished work of being a man | `#MensGrowth` `#EmotionalMaturity` `#GrownMenGrow` |
| Foundational carousel | strength and emotional avoidance | `#HealthyMasculinity` `#EmotionalGrowth` `#GrownMenGrow` |
| Recognition carousel | vulnerability, accountability, and repair | `#Accountability` `#EmotionalMaturity` `#GrownMenGrow` |
| Static post | fear disguised as strength | `#MensGrowth` `#SelfAwareness` `#GrownMenGrow` |
| Essay Reel | a man can look strong and still be hiding | `#HealthyMasculinity` `#MensMentalHealth` `#GrownMenGrow` |

Hashtags are classification aids, not a growth strategy. If they make a caption feel packaged, omit them.

Instagram's professional dashboard is the current source for personalized creation, reach, and hashtag guidance. Recheck it at launch and at each 30-day review because platform recommendations change. Original, materially authored work remains mandatory for recommendation eligibility.

## Cross-platform discovery standard

- Use **Grown Men Grow** as the display name and `@grownmengrow` where available. Use `@grownmengrow.com` on Bluesky after DNS verification.
- Reuse the approved site description on non-Instagram profiles: **Essays on the unfinished work of being a man.**
- Link directly to Ghost with platform-specific UTM parameters.
- Publish full essays on Medium only through URL import and verify the canonical points to Ghost.
- Do not publish full duplicate essays on Substack, LinkedIn, Facebook, or another surface without a verified canonical control.
- Use keyword-complete plain language in titles, captions, alt text, Pin descriptions, and opening lines. Do not hide keywords in inaccessible fields or repeat them mechanically.
- Use Medium topics, LinkedIn framing, and short-form platform language to clarify the actual subject of each piece.
- Treat Ghost Social Web and later Flipboard RSS as canonical-link distribution, not independent publications.
- Keep platform adaptations original enough for the surface. Do not repost watermarked or mechanically duplicated content.

## Measurement

Use Ghost native analytics, webmaster tools, and platform-native insights at launch. Measure visitors, referral source, Start Here views, Essay 1 views, signups, signup conversion, Instagram reach, profile visits, link taps, saves, shares, substantive comments, and follows at day 0, day 7, and day 30. Newsletter opens and clicks begin only after a separately authorized send.

Search Console and Bing add indexing status, impressions, clicks, click-through rate, and actual search queries. No ranking guarantee is made; technical SEO makes the work legible, while sustained original publishing and reader response create demand.

## Optional later work

- Enable Ghost Explore and Social Web when the site becomes public; verify their current beta controls and profile presentation first.
- Activate YouTube Shorts and TikTok only after original motion work is ready.
- Submit Flipboard after the archive and RSS cadence are established.
- Consider founder-narrated audio after six to eight strong essays.
- Add topic/tag archive pages only after each archive has enough material to avoid thin collections.
- Consider formal keyword research only after Search Console shows real query data.
- Review Search Console and analytics quarterly, then refine titles, internal links, and future editorial coverage from evidence.
