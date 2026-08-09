# Ghost and Instagram Organic Discovery

Status: technical baseline implemented; public launch and account additions remain gated.

## Objective

Earn qualified, organic discovery without turning the publication into generic self-help, grievance content, or keyword paste. Ghost is the canonical source. Instagram is the only launch social channel. No paid SEO platform, advertising product, tracking pixel, scheduler, link shortener, or additional social account is required.

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
- Source remains unmodified. No external scripts were added.
- Member sources, email opens, email clicks, and outbound tagging use Ghost's native controls. Full web analytics requires the approved Publisher plan and remains unavailable until purchase.

Ghost automatically supplies XML sitemaps, canonical tags, structured data, and fallback metadata. Private mode intentionally suppresses indexing, so crawl verification happens only after launch authorization.

## Launch indexing sequence

1. Purchase Ghost(Pro) Publisher at the founder-approved checkout gate.
2. Enable native web analytics.
3. Remove private mode only when the founder authorizes launch.
4. Verify `robots.txt`, `/sitemap.xml`, page canonicals, titles, descriptions, Open Graph data, and response codes on the public domain.
5. Publish Start Here, About, and Essay 1 under the approved slugs.
6. Add the approved tracked Start Here URL to Instagram.
7. Record day-0 baselines.

## Search Console recommendation

Add `grownmengrow.com` to Google Search Console after the site is public. This is the one additional account platform recommended for launch. It is free, adds no tracking script, and is the direct way to submit Ghost's sitemap, inspect indexing, and see Google queries, impressions, and clicks. It is not configured without founder approval.

Do not add Google Analytics, Tag Manager, Meta Pixel, Semrush, a keyword service, or a backlink service at launch.

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

### Launch classification recommendations

These additions are prepared for founder approval before posting; they do not alter the approved captions yet.

| Post | Primary discovery phrase | Suggested hashtags |
|---|---|---|
| Pinned introduction | the unfinished work of being a man | `#MensGrowth` `#EmotionalMaturity` `#GrownMenGrow` |
| Foundational carousel | strength and emotional avoidance | `#HealthyMasculinity` `#EmotionalGrowth` `#GrownMenGrow` |
| Recognition carousel | vulnerability, accountability, and repair | `#Accountability` `#EmotionalMaturity` `#GrownMenGrow` |
| Static post | fear disguised as strength | `#MensGrowth` `#SelfAwareness` `#GrownMenGrow` |
| Essay Reel | a man can look strong and still be hiding | `#HealthyMasculinity` `#MensMentalHealth` `#GrownMenGrow` |

Hashtags are classification aids, not a growth strategy. If they make a caption feel packaged, omit them.

## Measurement

Use Ghost native analytics and Instagram Insights at launch. Measure visitors, referral source, Start Here views, Essay 1 views, signups, signup conversion, newsletter opens/clicks, Instagram reach, profile visits, link taps, saves, shares, substantive comments, and follows at day 0, day 7, and day 30.

If approved, Search Console adds indexing status, impressions, clicks, click-through rate, and actual search queries. No ranking guarantee is made; technical SEO makes the work legible, while sustained original publishing and reader response create demand.

## Optional later work

- Enable Ghost Explore after the public site has enough work to represent the publication.
- Reconsider Ghost Network only through a new founder decision; it would expand distribution beyond the locked Instagram-only launch channel.
- Add topic/tag archive pages only after each archive has enough material to avoid thin collections.
- Consider formal keyword research only after Search Console shows real query data.
- Review Search Console and analytics quarterly, then refine titles, internal links, and future editorial coverage from evidence.
