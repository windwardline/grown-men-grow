# Technical Decision Log

## 2026-08-07 — Approve the Ghost + Instagram launch plan

- **Status:** Approved
- **Decision:** Implement the launch with Ghost as the canonical home and Instagram as the only launch social channel.
- **Reason:** This is the smallest system that supports publishing, email signup, distribution, analytics, and export.
- **Alternatives considered:** Additional publishing platforms, social channels, email services, analytics services, automation, and a custom application.
- **Cost/complexity:** One managed Ghost subscription, a domain, and manual Instagram operation.
- **Reversibility:** High. Ghost provides content and member exports; Instagram assets remain locally retained.
- **External services:** Ghost, Instagram, and the existing domain/DNS provider only.
- **Founder action required:** Founder retains final authority over all account, editorial, billing, DNS, and publication decisions.
- **Later resolution:** The 2026-08-08 zero-cost distribution decision supersedes the Instagram-only channel boundary while keeping Ghost canonical and Instagram primary.

## 2026-08-07 — Keep imported source material outside Git

- **Status:** Approved by implementation of the privacy-safe default
- **Decision:** Treat the handoff pack and legacy PDFs as local inputs and exclude them from Git.
- **Reason:** The pack contains confidential reputation material and should not be exposed through a future remote.
- **Alternatives considered:** Track the complete handoff pack in a private repository.
- **Cost/complexity:** Approved public assets must be copied into tracked content files after review.
- **Reversibility:** High. The local inputs remain in place.
- **External services:** None.
- **Founder action required:** Decide repository visibility before any remote is created.

## 2026-08-07 — Use Ghost(Pro) Publisher for launch

- **Status:** Approved
- **Decision:** Use Ghost(Pro) Publisher, subject to confirming the current price immediately before purchase.
- **Reason:** It is the smallest current Ghost plan that explicitly satisfies the required native page-traffic analytics without adding another analytics platform.
- **Alternatives considered:** Starter with reduced analytics or a third-party analytics service.
- **Cost/complexity:** Publisher subscription; no separate analytics account.
- **Reversibility:** High. The plan can be changed later.
- **External services:** Ghost(Pro) only.
- **Founder action required:** Approve purchase after the final price check.

### Price verification — 2026-08-07

- Ghost lists Publisher at **$29 USD per month billed yearly**, or **$348 USD per year before tax**, for up to 1,000 members.
- Publisher includes advanced native analytics, custom domains, one or more newsletter configurations, member export, managed backups, and the other launch-critical capabilities in this plan.
- Ghost gives new Ghost(Pro) accounts a 14-day free trial and states that the account is not billed automatically when the trial expires.
- **Implementation choice:** Configure the private staging publication during the trial. Present the paid annual subscription only after the founder approves the configured preview.

## 2026-08-07 — Launch with the unmodified Source theme

- **Status:** Superseded on 2026-08-08 by the approved editorial system and custom Ghost theme; Source is retained only as rollback material
- **Decision:** Use Ghost's Source theme without custom theme code.
- **Reason:** Source is the maintained default, supports publication and newsletter layouts through native settings, and minimizes implementation and update burden.
- **Alternatives considered:** Solo, another official theme, a premium theme, or a custom theme.
- **Cost/complexity:** No theme purchase or build system.
- **Reversibility:** High. Themes can be previewed and changed later.
- **External services:** None beyond Ghost.
- **Founder action required:** Approve the configured preview before launch.

## 2026-08-07 — Use an Instagram Creator account

- **Status:** Approved
- **Decision:** Use a public Creator account and convert it before launch content is published.
- **Reason:** Creator is appropriate for an individual publisher and enables native Instagram Insights from the beginning of the launch period.
- **Alternatives considered:** Personal or Business account.
- **Cost/complexity:** No additional charge; account must remain public for professional features.
- **Reversibility:** High. Instagram account type can be changed later.
- **External services:** Instagram only.
- **Founder action required:** Retain account ownership, two-factor authentication, and final profile approval.

## 2026-08-07 — Adopt the Grown Men Grow identity

- **Status:** Approved and claimed
- **Decision:** Use **Grown Men Grow** as the publication name, `grownmengrow.com` as the launch domain, and `@grownmengrow` as the Instagram username.
- **Reason:** The name works as a social identity, publication title, and potential book title without centering the founder's personal name.
- **Screening:** The founder accepted the preliminary availability and copyright/trademark risk review. This is not a legal opinion or formal trademark clearance.
- **Reversibility:** Low after public launch; moderate before content publication.
- **External services:** Cloudflare and Instagram.
- **Founder action required:** Decide whether formal legal clearance or trademark registration is warranted before material investment in the mark.

## 2026-08-07 — Configure the project domain and routed email

- **Status:** Complete for pre-Ghost setup
- **Decision:** Register `grownmengrow.com` in the founder's Cloudflare Windward Line account and route `michael@grownmengrow.com` to the founder-controlled inbox.
- **Reason:** The address provides a project-owned account identity without adding an email-hosting service.
- **Scope:** Email routing and required mail DNS records are active. The Ghost custom-domain records are not configured yet.
- **Reversibility:** High.
- **External services:** Cloudflare Email Routing and the founder's existing inbox only.
- **Resolution:** The address remains the private Ghost owner identity. The later public-identity decision assigns support and newsletter replies to `hello@grownmengrow.com`.

## 2026-08-07 — Configure the Instagram launch profile

- **Status:** Complete except for the website link and founder-deferred two-factor authentication
- **Decision:** Configure `@grownmengrow` as a public Creator profile with display name **Grown Men Grow**, bio “Some assembly still required.”, and the approved stacked wordmark profile image.
- **Reason:** The profile presents the publication without exposing the founder's personal name and enables native Instagram Insights.
- **Controls:** Category and contact information are hidden publicly. Account suggestions, manual tag approval, mentions, comment filtering, and scam-message filtering are configured.
- **Asset:** `assets/source/grown-men-grow-instagram-avatar.png`
- **Reversibility:** High.
- **External services:** Instagram only.
- **Founder action required:** Add the approved Ghost link from the Instagram mobile app after the destination is live. Two-factor authentication remains deferred at the founder's direction.

## 2026-08-07 — Center and propagate the stacked wordmark avatar

- **Status:** Complete
- **Decision:** Treat `assets/source/grown-men-grow-instagram-avatar.png` as the canonical, square profile-image master with the word block centered horizontally and vertically.
- **Implementation:** The corrected source replaces the earlier low-set version. The reusable brand copy and circular crop preview derive from it without another positional shift. Instagram and Ghost now use the corrected master, and the pinned-introduction renderer has been regenerated from the same source.
- **Controls:** Brand-avatar uses inherit this asset. Michael Peacock's separate Ghost staff photograph is not a brand-avatar use and remains unchanged.
- **Reversibility:** High. The source and renderer remain in the repository.

## 2026-08-07 — Set the founder-credit hierarchy by platform

- **Status:** Approved
- **Decision:** Ghost may identify Michael Peacock as the writer, with Grown Men Grow remaining the primary publication identity. Instagram remains brand-led and does not display the founder's name.
- **Reason:** Ghost benefits from honest byline attribution without turning the publication into a personal brand. Instagram should preserve the stronger standalone social identity.
- **Implementation:** Keep Ghost's publication title and brand presentation dominant, retain Michael Peacock as the staff author for credited work, and do not add his name to the Instagram display name, bio, contact display, or launch graphics.
- **Reversibility:** High before public launch.

## 2026-08-07 — Configure the private Ghost staging baseline

- **Status:** Complete for private staging
- **Decision:** Create the Ghost(Pro) trial publication under `michael@grownmengrow.com` and configure the approved launch baseline without making the site public or purchasing a plan.
- **Configuration:** Title **Grown Men Grow**; Source v1.7.1; English; Eastern Time; Instagram structured-data link; Ghost Explore off; one free newsletter; sender **Grown Men Grow**; initial verified reply-to `michael@grownmengrow.com`; oxblood `#3A1518`; approved stacked wordmark icon; no separate logo or cover; Source typography defaults. A later decision moves newsletter replies to `hello@grownmengrow.com` after Ghost verification.
- **Cleanup:** Removed Ghost's generic site description, default X and Facebook links, and scaffold “Coming soon” post. The welcome email remains disabled because its copy is not approved.
- **Controls:** The trial publication remains in pre-launch/private mode. No paid plan, custom domain, public page, post, metadata description, welcome email, or newsletter delivery has been activated.
- **Later resolution:** The founder subsequently approved the launch copy and metadata. They are now staged; the welcome automation remains disabled and no content has been published or sent.
- **Reversibility:** High. The design uses native Ghost settings and the unmodified default theme.
- **External services:** Ghost(Pro) trial only.
- **Founder action required:** Approve the staged visual direction, Publisher purchase, canonical hostname, public identity and metadata, and revised launch assets before production work.

## 2026-08-07 — Approve the public identity and email separation

- **Status:** Approved and verified
- **Decision:** Use **Grown Men Grow** as the public author, `hello@grownmengrow.com` as the public support and newsletter reply-to address, and retain `michael@grownmengrow.com` for private account ownership and recovery.
- **Reason:** This keeps the founder's personal name out of the publication's visible identity without adding another email platform.
- **Implementation:** The active Cloudflare route for `hello@grownmengrow.com` forwards to the existing verified destination. Ghost has sent its required reply-to confirmation message to the alias.
- **Resolution:** Ghost now displays `hello@grownmengrow.com` as the welcome/newsletter reply-to and Portal support address.
- **Constraint:** Cloudflare Email Routing receives and forwards mail; it is not a full outbound mailbox. Test the identity exposed by a manual reply before promising two-way support publicly.
- **Founder action required:** Confirm the Ghost verification email, then participate in one controlled outbound-reply test.

## 2026-08-07 — Approve the canonical hostname and public-copy revision

- **Status:** Approved for preparation; production changes remain gated
- **Decision:** Use apex `grownmengrow.com` as canonical, redirect `www` to apex, and use **Grown Men Grow** as the public author. Authorize a restrained revision of the draft launch assets for founder review in chat.
- **Reason:** The apex address matches the social identity and is the shortest form for print and Instagram. The existing launch draft predates the final brand and over-centers the account holder.
- **Controls:** Preserve the draft's substantive thesis, reputation boundaries, non-therapist boundary, and source attributions. Do not publish revised copy, change DNS, or purchase Ghost until separately authorized.
- **Founder action required:** Review every revised public asset before transfer into Ghost.

## 2026-08-07 — Exclude Gartner from public copy

- **Status:** Approved standing restriction
- **Decision:** Describe the founder's background only as consulting experience. Do not identify Gartner in public pages, essays, newsletters, metadata, social copy, captions, or alt text.
- **Reason:** The founder identified unnecessary litigation and reputation exposure from naming the company.
- **Scope:** This restriction applies to every current and future public asset. Internal source documents remain private and are not rewritten merely to remove historical references.
- **Founder action required:** None unless the restriction is later changed explicitly.

## 2026-08-07 — Establish pro-male, non-grievance positioning

- **Status:** Approved standing editorial and community standard
- **Decision:** Grown Men Grow is a pro-male publication about integrated masculinity. It rejects grievance, domination, gender-war framing, and the treatment of women as a collective enemy. It also rejects anti-male shame, ideological pandering, and the pursuit of female approval as proof of virtue.
- **Editorial rule:** Treat men's strength, desire, ambition, anger, pain, and need for connection seriously. The work asks men to integrate those parts rather than suppress them, worship them, or make other people responsible for them.
- **First-glance rule:** Keep the Instagram bio `Some assembly still required.` Do not use women, feminism, red-pill ideology, or the manosphere as profile or metadata positioning. Let the work establish the distinction, with `No gurus. No gender war.` as the approved restrained line for the pinned introduction.
- **Distribution rule:** Do not use grievance, domination, gender-war controversy, or adversarial engagement to attract reach. Do not turn the publication into ideological counterprogramming or use female approval as a trust signal.
- **Visual rule:** Masculine force, physicality, ambition, sex, competition, competence, anger, and edge remain available. Avoid generic alpha-status shorthand and stock dominance clichés that substitute posture for thought.
- **Reason:** The publication should take men and masculinity seriously without becoming grievance content, anti-male correction, or an appeal for ideological approval.
- **Founder action required:** None. Exact public assets still require normal founder approval before publication.

## 2026-08-07 — Approve revised public launch copy

- **Status:** Approved for private staging
- **Decision:** Approve the v0.3 Start Here page, About page, subscriber welcome email, Essay 1 `Strength Has to Grow Up`, Instagram launch copy, and publication metadata.
- **Canonical copy:** Stored under `content/ghost/`, `content/instagram/`, and `content/metadata.md`.
- **Scope:** Approval authorizes private Ghost staging and production preparation. It does not authorize Ghost publication, newsletter delivery, Instagram posting, DNS cutover, or plan purchase.
- **Founder action required:** Review the private Ghost rendering and later authorize each production gate.

## 2026-08-07 — Establish a cross-client handoff protocol

- **Status:** Complete
- **Decision:** Codex, Claude Code, and any later coding agent must read and append `docs/technical/handoff-log.md` around material work.
- **Implementation:** Project `AGENTS.md` contains the rule. `CLAUDE.md` is a symlink to the same file so both clients receive identical instructions.
- **Controls:** The log is append-only and excludes credentials, cookies, access codes, member data, private correspondence, and confidential source material.
- **Reason:** The repository will be operated by more than one coding client and needs one durable operational history.
- **Founder action required:** None.

## 2026-08-07 — Stage the corrected visual and social-sharing system

- **Status:** Complete for private staging
- **Decision:** Use the corrected, square, centered wordmark as the canonical brand-avatar master. Keep the launch graphics visually related without making every carousel, Story, Reel, and social card identical.
- **Implementation:** Instagram and Ghost use the corrected avatar. Thirty-two launch SVG/PNG assets were regenerated. Distinct design families are retained for the pinned introduction, foundational carousel, recognition carousel, Stories, static post, Reel cover, and Ghost social cards.
- **Verification:** The source and reusable brand copy have identical hashes. Output dimensions and five review contact sheets were checked. Homepage, Start Here, About, and Essay 1 have X and Facebook/Open Graph cards staged in Ghost.
- **Controls:** No Ghost page/post was published and no Instagram content was posted.
- **Founder action required:** Approve the rendered launch sets before any posting.

## 2026-08-07 — Implement the organic-discovery baseline without paid SEO services

- **Status:** Complete for private staging
- **Decision:** Use Ghost's native technical SEO, Ghost native analytics, Instagram Insights, original publishing, and a disciplined topic architecture. Do not add paid SEO software, third-party on-site analytics, pixels, schedulers, link shorteners, or extra launch channels.
- **Implementation:** Approved homepage/per-page metadata and social cards are staged. Ghost's AI-search structured-data control remains enabled. The ongoing Ghost and Instagram standard is documented in `docs/technical/seo-organic-growth.md`.
- **Search Console:** Recommend the free Google Search Console after the site is live because it can submit the sitemap and report indexing and search queries without a tracking script. It remains a founder decision because it adds an account platform.
- **Instagram:** Keep the approved handle, display name, and bio. Put discovery context in captions, on-screen text, honest alt text, and narrowly relevant hashtags rather than keyword-stuffing the profile.
- **Founder action required:** Approve Search Console and the proposed launch-post classification additions before they are used.
- **Later resolution:** The founder approved Search Console, Bing Webmaster Tools, the exact launch classifications, and the broader distribution plan on 2026-08-08. The paid-service and tracking exclusions remain in force.

## 2026-08-07 — Cut over the approved apex domain without disturbing routed email

- **Status:** Complete
- **Decision:** Connect Ghost at `grownmengrow.com` as the canonical hostname and use `www.grownmengrow.com` as the redirecting alternate.
- **Implementation:** Added DNS-only `CNAME @` to `grown-men-grow.ghost.io` and DNS-only `A www` to `178.128.137.126` in the Windward Line Cloudflare zone. The founder gave action-time authorization before the live DNS change. Ghost accepted activation for `grownmengrow.com`.
- **Verification:** The apex resolves through Ghost's current addresses, `www` resolves to the Ghost redirect address, and all three Cloudflare Email Routing MX records plus SPF and DKIM still resolve. On 2026-08-08, `https://www.grownmengrow.com/` completed TLS negotiation and returned a `302` redirect to `https://grownmengrow.com/`.
- **Controls:** The publication remains private. No page/post was published, no newsletter was sent, and no Instagram post was made.
- **Founder action required:** None for DNS. Complete the separate Ghost Publisher checkout when presented; public launch remains separately gated.

## 2026-08-08 — Reconcile every launch surface before handoff

- **Status:** Complete for private staging
- **Decision:** Treat stale scaffolds, mismatched support identities, generic platform copy, outdated operational documents, and generated local logs as release defects.
- **Ghost cleanup:** Removed the generic “About this site” draft. Confirmed that Start Here and About are the only page drafts and “Strength Has to Grow Up” is the only post draft. Replaced Ghost's generic welcome-email body with the founder-approved canonical copy, verified its rendering and `hello@grownmengrow.com` reply-to, and left the automation disabled. Set the member Portal support address to `hello@grownmengrow.com`.
- **Ghost verification:** Reviewed Start Here, About, and Essay 1 in the available desktop and phone previews; reviewed Essay 1's email preview. Ghost accepts `grownmengrow.com`; the apex serves the private site over HTTPS; and both `www` and the legacy `ghost.io` host redirect to the apex.
- **Instagram cleanup:** Verified the brand-only public profile, public professional controls, and Account Status. All Account Status categories showed checkmarks. Disabled both category-label and contact-information display.
- **Repository cleanup:** Reconciled the README, approved plan, runbooks, decision evidence, analytics plan, SEO standard, and release checklist against live platform state. Added `docs/README.md` as the document map; removed generated browser logs and OS metadata; and excluded future browser logs from Git.
- **Controls:** The site remains private. The welcome automation remains off. No Ghost content was published or sent, no Instagram content was posted, and no subscription was purchased.
- **Founder action required:** Complete the prepared Publisher checkout, approve the remaining publication gates, and use the Instagram mobile app to add the tracked site link only after the destination is public.

## 2026-08-08 — Authorize the repository completion workflow

- **Status:** Approved
- **Decision:** For this project, coding agents may test, verify, commit, push, open or update pull requests, merge after required gates pass, and clean merged branches or temporary worktrees without requesting separate permission for each repository step.
- **Scope:** The GitHub repository is private under the `windwardline` account. The authority covers repository operations only and does not authorize a public repository, Ghost plan purchase, privacy removal, content publication, newsletter delivery, Instagram posting, or another launch action.
- **Controls:** Preserve ignored private inputs and unrelated founder work; use non-default branches and pull requests; never force-push or bypass required checks.
- **Founder action required:** None unless repository visibility or launch authority changes.

## 2026-08-08 — Raise the visual system to an editorial-publication standard

- **Status:** Superseded by the approved representative system and custom-theme build below
- **Decision:** Preserve the approved written voice and overhaul its presentation across Ghost and Instagram. The target is an original, visually arresting editorial system with the authority, hierarchy, pacing, and art direction of a high-end men's magazine.
- **Scope:** Rework typography, composition, image strategy, page rhythm, carousel pacing, Stories, Reel covers, post cards, social previews, and Ghost article presentation. Maintain one recognizable brand without forcing every surface into one template.
- **Controls:** Do not copy another publication's trade dress or rewrite approved launch copy. Nothing is published or posted during design development. Any departure from the previously approved unmodified Source theme requires a specific founder decision after representative surfaces are reviewed.
- **Founder action required:** Review the proposed editorial direction and representative Ghost, feed, carousel, Story, and social-card surfaces before full propagation.

## 2026-08-08 — Approve the editorial system and custom Ghost theme

- **Status:** Approved
- **Decision:** Adopt the representative editorial system in `docs/editorial-visual-system.md`, replace the staged launch graphics with the approved art direction, and build an original custom Ghost theme for private staging.
- **Reason:** The approved writing needs stronger hierarchy, imagery, pacing, and variation than the unmodified Source baseline can provide. The representative Ghost, feed, carousel, Story, and social-card concepts establish the intended standard.
- **Implementation:** Preserve Source and the prior Ghost export as rollback material. Build and validate the theme in this repository, regenerate the complete launch asset set in distinct visual families, then stage the result only on the still-private Ghost publication.
- **Controls:** Do not copy another publication's trade dress. Do not rewrite approved launch copy. Do not purchase a plan, remove privacy, publish or email Ghost content, post to Instagram, or make another public launch action under this approval.
- **External services:** None added. The custom theme is repository code uploaded to the existing Ghost publication.
- **Founder action required:** Review the final private Ghost rendering and complete replacement asset set before public launch.

## 2026-08-08 — Reject despair-coded and visibly synthetic launch imagery

- **Status:** Approved standing visual rule
- **Decision:** Keep the high-end editorial standard but make the visual world constructive, warm, maintained, and alive. Hyperreal generated photography remains available only when it passes a strict full-resolution believability review.
- **Reason:** Dilapidated rooms, dusk-heavy isolation, and polished synthetic lifestyle scenes misstate a project about building, repair, and growth. Obvious generation artifacts also make the publication feel anonymous and cheap.
- **Implementation:** Lead with daylight, capable action, conversation, useful objects, and forward motion. Reject an entire image for one physical inconsistency in anatomy, tools, furniture, reflections, architecture, lighting, or object continuity. Use generated people sparingly and prefer real founder footage when human presence is central.
- **Controls:** Do not disguise weak imagery with darkness, grain, distress, or crops. Record prompts and distinguish composition studies from approved launch assets.
- **Founder action required:** Review the final image library and launch compositions before any public use.

## 2026-08-08 — Develop a tactile collage-led replacement set

- **Status:** Approved for private staging and launch on 2026-08-08; live rendering remains subject to technical verification
- **Direction:** Use bright photography as raw material inside an original editorial collage system with visible paper, tape, halftone, drawn marks, irregular crops, and active changes of scale.
- **Reason:** The treatment gives the publication energy and a human editorial hand while reducing the cheap perfection and repeated visual grammar common to generated lifestyle imagery.
- **Variation rule:** Reuse the material vocabulary, not one layout. Consecutive covers must change image dominance, crop, color field, headline placement, and page rhythm.
- **Implementation:** Replaced the working launch exports locally, built three title-free Ghost feature images, and prepared five cross-surface concept proofs and five review contact sheets. Removed the superseded dark concept package from the active tree; its history remains in Git.
- **Controls:** Approved launch copy remains exact. Instagram remains brand-only. Nothing has been uploaded to Ghost, published, sent, or posted.
- **Founder action required:** None for the visual direction or replacement assets. Live Ghost and Instagram output must still pass the release checklist.

## 2026-08-08 — Approve launch execution and Field Note 2

- **Status:** Approved
- **Decision:** Approve the complete collage-led launch set, original Ghost theme, launch classifications, immediate Ghost web launch work, and Instagram launch sequence after technical verification. Approve Field Note 2, “Call Your Friends Before There’s a Reason,” as written and confirm its marked first-person statement as true.
- **Friendship-scene rule:** The current piece is strong enough without another anecdote. A concrete personal scene may be added later only from facts supplied by the founder; no event may be invented for narrative force.
- **Delivery boundary:** Essay 1 may be published on the web. No newsletter send was authorized, so launch remains publish-only unless the founder later says otherwise.
- **Controls:** Complete the theme, page, link, signup, metadata, canonical, analytics, and public-destination checks before removing privacy or posting to Instagram.
- **Founder action required:** Complete any provider checkout or inbox-side verification that the dashboard still requires.

## 2026-08-08 — Approve the zero-cost distribution network

- **Status:** Approved
- **Decision:** Replace the Instagram-only channel rule with the platform roles and sequencing in `distribution-plan.md`.
- **Canonical boundary:** Ghost remains the permanent source and only master email list. Medium is the only approved complete-essay syndication channel and must point its canonical to the live Ghost URL. Other platforms receive native excerpts, visuals, discussion, and tracked links.
- **Approved surfaces:** Ghost Social Web and Explore, Threads, Medium, Bluesky, LinkedIn Page, Pinterest Business, Facebook Page, Substack Notes, Google Search Console, Bing Webmaster Tools, Google Discover/News eligibility work, and evaluation of Cloudflare Crawler Hints. Reserve YouTube, TikTok, and X handles; do not activate video channels without original motion work, and leave X inactive.
- **Crawler Hints disposition:** Do not enable it in the current Ghost(Pro) topology. The working domain records are DNS-only, while Crawler Hints depends on proxied traffic. Ghost's sitemap and Bing Webmaster Tools provide the indexing path without risking the custom domain or certificate.
- **Automation:** Buffer Free and Zapier Free may create reviewed ideas and scheduling drafts. Automated unreviewed public cross-posting, subscriber-list synchronization, and custom cross-posting infrastructure are prohibited.
- **Cost:** No incremental paid platform, ads, or paid SEO service approved.
- **Founder action required:** Retain control of credentials, provider verification messages, and any platform-required identity or MFA step.

## 2026-08-08 — Approve the concise Ghost staff bio

- **Status:** Approved
- **Decision:** Use **Michael Peacock writes Grown Men Grow, a publication about the unfinished work of being a man.** on the Ghost staff profile.
- **Hierarchy:** Grown Men Grow remains the primary publication identity. Michael Peacock appears as the credited writer on Ghost, not as the Instagram identity.
- **Image boundary:** Launch with the text-only author treatment unless the founder later supplies or approves a staff photograph.

## 2026-08-08 — Approve the exact Essay 1 distribution pack

- **Status:** Approved
- **Decision:** Approve the exact platform-specific copy and metadata in `content/distribution/essay-01-launch.md` without rewriting it.
- **Sequence:** Publish and verify the canonical Ghost URL first. Then configure or verify each approved profile, preserve the Ghost canonical on Medium, and use the reviewed native adaptations and tracked links in the order defined by `distribution-plan.md`.
- **Controls:** Approval of the pack does not authorize a duplicate newsletter, member-list synchronization, unreviewed automation, a paid upgrade, or publication before the canonical and platform-specific gates pass.
- **Founder action required:** Complete any provider-owned identity, CAPTCHA, MFA, or consent step that cannot be delegated.

## 2026-08-08 — Defer the Ghost Publisher purchase during the trial

- **Status:** Approved deferral
- **Decision:** Keep using the active Ghost trial and wait on the Publisher purchase. The founder reported 13 trial days remaining on 2026-08-08.
- **Controls:** Recheck the dashboard and current price at the launch checkpoint. Do not rely on the earlier plan approval as authorization to complete a charge after this deferral.
- **Founder action required:** Confirm the purchase when the trial or a required launch feature makes it necessary.

## 2026-08-08 — Authorize the founder-controlled Gmail inbox for private tests

- **Status:** Approved
- **Decision:** Use the founder's signed-in Gmail inbox for private signup, magic-link, welcome-email, reply, account-management, and unsubscribe testing.
- **Controls:** Do not record the Gmail address, credentials, messages, member export, cookies, or access codes in Git, chat, screenshots, or browser logs. This authorization does not permit an Essay 1 newsletter send.
- **Founder action required:** Complete any provider-owned inbox confirmation that the agent cannot safely perform.

## 2026-08-08 — Establish Field Note 2 as the current voice and platform reference

- **Status:** Approved
- **Decision:** Treat “Call Your Friends Before There’s a Reason” as the clearest current calibration for the Grown Men Grow voice: adult, specific, nuanced, dryly funny, imperfect, sincere, and willing to use profanity only when it earns emphasis.
- **Platform direction:** Ghost carries the full canonical essay. Instagram receives a native carousel and caption built from the same argument rather than a mechanical excerpt. Later approved networks receive adaptations suited to their surface; they do not receive one duplicated block of copy.
- **Visual direction:** Use the approved bright friendship-led collage brief with movement, daylight, ordinary life, and visible material texture. The direction is approved; final artwork and publication timing remain gated.
- **Controls:** Do not turn the voice into therapeutic instruction, self-righteous positioning, formulaic comma-chain titles, grievance content, or forced ideological signaling. Preserve the distinct structures of future pieces instead of imitating this essay sentence by sentence.
- **Founder action required:** Decide final artwork and release timing after production review.

## 2026-08-09 — Resolve the launch-sequencing gaps under delegated authority

- **Status:** Decided by Claude Code under the founder's 2026-08-09 delegation ("decide these issues yourself using the same logic … durable fixes that adhere to the stated and implied goals of the project, taking user experience into account")
- **Context:** The independent audit found the release checklist could not be completed under the recorded authorizations: no gate ever authorized enabling the welcome email, the launch-timing rule transitively depended on the deferred Publisher purchase through the analytics gate, two rendered launch slides deviated from the canonical slide copy while the fidelity box was checked, and the "required advisor review" gate was defined nowhere.
- **Rulings:**
  1. Enabling the free-member welcome automation is authorized as part of the already-authorized web launch. It is a signup acknowledgment, not a broadcast; the Essay 1 newsletter send remains unauthorized.
  2. Launch proceeds on the active trial with whatever native analytics the plan provides. The Publisher purchase remains a founder-only checkout at the trial or launch checkpoint and upgrades analytics when completed. **Voided by live discovery 2026-08-09:** Ghost(Pro) trials run in "pre-launch mode" and cannot remove privacy at all — public launch requires the plan purchase first. The founder inspected the live checkout (Publisher $348/yr or $35/mo, billed immediately; no deferred-payment option) and deferred the purchase for affordability, choosing to ride out the remaining trial days while banking content. Launch is blocked solely on the founder's checkout.
  3. The founder-approved rendered artwork wording is canonical for pinned-introduction slide 5 and recognition-carousel slide 5; the slide copy in `content/instagram/launch-package.md` was reconciled to it. The founder approved the complete rendered set on 2026-08-08, and the approved alt text already transcribed the artwork wording.
  4. The undefined "required advisor review" checklist gate is the founder's own pre-launch reputation review per the private addendum; no external advisor exists in any tracked record.
- **Controls:** None of these rulings authorizes a charge, a newsletter send, privacy removal, or a posting action; the existing founder gates for those are unchanged.
- **Founder action required:** Veto or amend any ruling; otherwise none.

## 2026-08-09 — Eliminate Pinterest from the distribution network

- **Status:** Decided by the founder ("I think we eliminate Pinterest. It is mostly for visual boards, not essays, and there are more women that use than men. Everything else about our plan remains, though.")
- **Context:** Pinterest had been part of the approved zero-cost discovery network and the seven-section platform-pack template. The founder's own account had been created earlier the same evening and its profile partially configured; nothing had been published.
- **Effect:** Pinterest sections were removed from the Essay 1 and Field Note 2–6 packs, the pack-completeness gate now requires six platform sections (Medium, Threads, Bluesky, LinkedIn, Facebook, Substack), and the distribution plan and platform prep register no longer carry Pinterest. The founder closed the Pinterest account personally the same evening. Every other element of the distribution plan is unchanged.

## 2026-08-10 — Eliminate Threads from the distribution network

- **Status:** Decided by the founder ("Eliminate the threads material and plan. We are not going to pursue it.")
- **Context:** Meta suspended the Threads account at creation and denied the appeal with no further review available. Because Threads identities ride the Instagram account, a replacement would require abandoning the publication's Instagram identity. Nothing was ever published.
- **Effect:** Threads sections were removed from all ten platform packs, the pack-completeness gate now requires five platform sections (Medium, Bluesky, LinkedIn, Facebook, Substack Notes), and the distribution plan, prep register, analytics targets, and SEO plan no longer carry Threads. Buffer Free now reserves channels for Bluesky and LinkedIn only, leaving one free slot open. The drafted Threads copy was removed with the sections rather than retained.

## 2026-08-10 — Publication voice: remove the founder's name and face from all public surfaces

- **Status:** Decided by the founder ("I would prefer my name not be attached publicly... you can remove my name and face from public facing aspects of this project"), implemented with the anonymous-editorial-voice convention (the Economist model) so no surface reads as "written by an individual named Grown Men Grow."
- **Implementation:** The theme (v1.3.0, live) no longer renders bylines or author cards anywhere; essays carry only the publication mark, date, and reading time. The Ghost staff user was renamed to "Grown Men Grow" (slug grown-men-grow) with the founder's profile photo removed, so metadata, structured data, and the vestigial author archive all resolve to the brand. Content frontmatter now records "byline: none — publication voice." The metadata register, AGENTS.md identity contract, and the repository gate were updated: the founder-name exclusion now covers every public surface, not just Instagram.
- **Also decided (same session):** The Substack user profile was converted to brand identity (Grown Men Grow, brand avatar, brand header) under the founder's "make the cohesive decision" delegation — Notes are a social surface and social surfaces are brand-first. Medium was already brand-bylined.
- **Effect:** The founder's name and face appear on no public surface of the project. Internal repository records (decision logs, handoff logs, git identity) still name the founder.

## Current pending decisions

- Ghost Publisher purchase confirmation at the later trial or launch checkpoint; launch itself proceeds on the trial.
- Inbox-side confirmation only if an end-to-end membership or welcome-email test requires founder interaction.
- Any future newsletter send; Essay 1 is web-only under the current authorization.
- Publication timing and final artwork for Field Note 2.
- Final approval of platform adaptations for later essays; the Essay 1 distribution pack is approved.
- Any future change from private to public repository visibility.

## 2026-08-10 — Forego Facebook; build the LinkedIn Page in full

- **Status:** Decided by the founder ("I want you to build out that LinkedIn page in full, and set it up for automation. Similarly, set up the Instagram automation now that it is setup. I think we will forego Facebook, like Pinterest and Threads.")
- **Context:** The founder created the LinkedIn Page (linkedin.com/company/grown-men-grow, vanity URL `grown-men-grow`) during the same session. No Facebook Page had ever been created, so the elimination unwinds no external account state.
- **Effect:** Facebook sections were removed from all ten platform packs, the pack-completeness gate now requires four platform sections (Medium, Bluesky, LinkedIn, Substack Notes), and the distribution plan, prep register, analytics targets, SEO plan, and founder-decisions checklist no longer carry Facebook. The LinkedIn Page was built out in full — square wordmark logo, a LinkedIn-specific tagline-led cover (new `linkedin-banner` render target whose composition avoids duplicating the logo LinkedIn overlays on the cover; founder-approved in review), tagline, and an About assembled verbatim from approved copy — and connected to Buffer's third channel slot with the founder's OAuth grant. Buffer Free now carries Instagram, Bluesky, and the LinkedIn Page with no open slots. Meta tooling serves Instagram only.

## 2026-08-10 — Leave AI-disclosure fields empty across platforms

- **Status:** Decided by the founder ("I do not want to enter anything in the AI-disclosure fields").
- **Context:** The field audit surfaced two optional AI-disclosure surfaces: Substack's "How I make this" statement and Instagram's AI-creator profile label. Both are public statements about production process, adjacent to the visual system's visible-human-authorship pillar.
- **Effect:** Both remain empty/off. Agents do not fill AI-disclosure fields on any platform without a new founder decision. This governs future platform surfaces of the same kind.

## 2026-08-11 — Ethics-of-care reasoning adopted as the editorial underpinning

- **Status:** Approved as written by the founder on 2026-08-11 ("Approved as written here. Incorporate accordingly."). The founder supplied a ten-part public essay-carousel on why the care in *Ted Lasso* reads as substantive rather than as toxic positivity — grounded in Gilligan (1982), Noddings (1984), and Tronto (1993) — calling it "a fantastic encapsulation of what I am trying to convey through this work" and directing that it become "a general underpinning to how Grown Men Grow thinks and communicates."
- **Context:** The repository governed visual standards (`editorial-visual-system.md`) and editorial refusals (`AGENTS.md`) but had no positive statement of how the writing reasons about its reader. The source material supplies one: care that takes pain seriously, creates space rather than prescribing, and never becomes control.
- **Effect:** New `docs/editorial-underpinning.md` distills seven principles and six draft tests, indexed in `docs/README.md`. It governs reasoning, not vocabulary — the tradition's names and terms stay internal, because the identity contract forbids feminism as positioning and a publication built on a television show inherits that show's shelf life. Approved copy under `content/` is unaffected; this governs new work and future revisions.

## 2026-08-11 — Production cadence automated; operating cadence documented

- **Status:** Implemented under the founder's standing 2026-08-11 directive ("full automation every week for everything, wherever possible") and their 2026-08-10 approval of the two-drafts-per-week production rhythm.
- **Context:** The approved production cadence had no automation at all — Wednesday and Saturday draft delivery depended on a session happening to run. Separately, the weekly task roster existed only as prose scattered through the append-only handoff log, so nothing in the repository stated which tasks exist or what each one offloads.
- **Effect:** Two new weekly tasks, `gmg-wednesday-draft` (Wed 10:00 AM ET) and `gmg-saturday-draft` (Sat 10:30 AM ET), write a new field note to `drafts/`, run it against the editorial underpinning's six tests, deliver it inline for founder review, and stop — they publish nothing. The Saturday task reads the Wednesday draft first so the week's two are not siblings. `gmg-friday-analytics` gained a qualitative pass: reader replies and recurring objections are now reported alongside the numbers, since the underpinning treats how care lands as evidence. `gmg-monday-staging` reads the underpinning and tests any prose it writes. New `docs/technical/operating-cadence.md` records both cadences, the eight-task roster, the founder's remaining app-only actions, and the iCloud kit convention. Three stale one-time task directories were removed.

## 2026-08-11 — Underpinning audit: the bank holds; the gaps are operational

- **Status:** Audit complete; no content change made. Two documentation defects corrected under existing founder rulings; four items raised for founder decision.
- **Context:** With the editorial underpinning approved, all twenty-four approved content files were audited against its seven principles and six tests — one agent per piece, every candidate finding handed to two independent skeptics whose job was to refute it. Thirty-six candidates were raised; none survived. Sixty-seven exemplars were recorded. A completeness critic then audited the audit.
- **Effect on content:** None. The approved bank already reads as though the underpinning was written from it. Two patterns are recorded for future drafting rather than remediation: candidates clustered in the final eighth of pieces, where a writer reaches to leave the reader with something; and compression is where a hedge dies, though the packs generally caught this and Field Note 7's Note 3 improved on its source by cutting the only coercive clause.
- **Defects corrected (no new decision — these contradicted decided rulings):** `ghost-setup.md` — the launch runbook still instructed an executing agent to credit the founder as writer, set a staff bio naming him, and confirm his byline on Essay 1, directly against the 2026-08-10 publication-voice ruling. The live site is clean; the runbook would have reintroduced the name on any future execution. `founder-decisions.md` Gate 1's byline and staff-bio lines were likewise stale and now record their supersession. `community-moderation.md` gained an owned-surfaces section: its remedies were written entirely in Instagram controls while Ghost comments run live, and the `hello@` route has no verified outbound identity.
- **Raised for founder decision:** (1) Ghost comments are live on every post, open to all members, with no decision recorded anywhere and no owner — the Friday task now sweeps them weekly, which leaves a worst case of six days; (2) the welcome email invites every new member to reply, but replying today would send from the founder's personal Gmail identity, exposing the name the same ruling protects; (3) the six draft tests cover five principles — responsiveness and the seventh principle have no test, so a clean audit result against them is an artifact of the instrument, not evidence; (4) across the corpus, nine of ten pieces assign the reader maintenance duties and one sentence in the entire bank describes a man receiving care — a corpus-level balance no per-file audit can see.

## 2026-08-11 — Draft tests expanded from six to nine; corpus check added

- **Status:** Directed by the founder ("Expand as necessary. I want full coverage, now and in the future.") after the audit's completeness critic showed the six-test instrument was structurally blind.
- **Context:** The original six tests mapped to five of the seven principles. Responsiveness and the seventh principle had no test at all, so the audit's clean result against them measured nothing. Separately, the tests only pointed one direction — at prescription — and could not catch the opposite failure, a draft that goes soft exactly where the argument gets expensive.
- **Effect:** `docs/editorial-underpinning.md` now carries nine tests in a table mapping each to its principle, so a principle without a test is visible at a glance. Two are new in kind: test 2 catches the pulled punch, and test 7 asks the writer to name the specific man the piece lands worst on. Tests 4 and 9 close the gaps on care-as-control and the seventh principle. A new corpus test is recorded for what no per-piece reading can answer, and `gmg-friday-analytics` runs it on the first Friday of each quarter or whenever the bank grows by ten, recording the judgment and not merely the count. The Saturday draft task carries a standing duty to notice when the recent run has tilted back toward obligation. `AGENTS.md`, both content READMEs, `founder-decisions.md`, `operating-cadence.md`, and all three content-touching tasks updated to nine.

## 2026-08-11 — The fourth column: stance, not subject, answers the corpus imbalance

- **Status:** Implemented under the founder's direction to proceed with the optimal recommendation. Four approaches were generated independently — through stance, structure, subject, and a skeptic told to attack the premise — and each was scored by three judges: the reader himself, an editor protecting the voice, and a hostile critic who thought the exercise would make the writing worse.
- **The skeptic partly won, and it shrank the fix.** Meeting a man as someone with a move to make is the entry fee for this readership. Three quarters of the work stays exactly as it is; this adds a fourth column rather than repositioning the publication.
- **Stance, not subject, is the mechanism.** A new topic gets absorbed into the existing posture without anyone noticing — that is how the bank arrived here, and why "Ask for Help While It's Still Cheap" did not help: asking is an action with a correct execution, so receiving became one more thing to do well. Drafts now carry an internal `stance` field, `assignment` or `witness`, never public and never a series. The subject test decides: a witness piece turns on an event the man neither caused nor can fix. A witness draft clears three gates — no imperative and no closing question, nothing liftable as "so a man should ___", and the cared-for man as grammatical object throughout — and never certifies that the care landed well.
- **The corpus count gains the mark that matters.** Stance alone misses the tell, because a piece the reader merely watches scores as neither. The measure is whether the last hundred words address him, which is where the assignment actually lives. Baseline 2026-08-11: nine of ten, with "Anger Is a Terrible Manager" the only exception. Triggered by bank growth of ten, not by the calendar; no fixed rotation, no run of four.
- **What deliberately does not change:** the machinery metaphors stay. All three judges independently said stripping the smoke detector, the oil interval, and the price curve would make the writing warm, which is a worse failure than the one being fixed.
- **First piece chosen:** the short window after a death when a man is allowed to be held, and then the first ordinary Tuesday when everyone including him agrees the window was never open. It asks nothing of anyone, which is why it goes first. The founder's own story does not go first — humility theater is the failure mode, and Essay 1 diagnoses that move by name.
- **Accepted costs:** these carousels have no directive slide, so saves and shares will likely dip; and a man reading at eleven at night because something is actually wrong is handed nothing by a witness piece. Both were argued and accepted rather than designed away.
## 2026-08-11 — Ghost comments stay on; outbound identity for hello@grownmengrow.com

- **Status:** Comments decided by the founder ("if I receive notifications when comments are made, it is okay to leave this on"). Email path approved in principle, pending three founder steps.
- **Comments:** Verified against the Ghost Admin API — `comment_notifications` is already `true` on the only staff account, so the founder's condition was met before it was stated. Comments remain enabled for all members on every post. The Friday task is the systematic backstop, not the alarm; Ghost emails on each new comment. Zero comments at the time of the decision. `community-moderation.md` now carries the Ghost admin remedies, which had been written only in Instagram's controls.
- **Email:** `hello@grownmengrow.com` is inbound-only, so replying today sends from the founder's personal Gmail — and not merely in headers: Outlook and others render "on behalf of" in the message list. Resend is the fleet standard but its free tier allows one domain, held by `windwardline.com` for three apps' magic links; adding a second requires paid, which the founder ruled out. Gmail's own SMTP relay was rejected because it hides nothing — the envelope sender stays personal and DKIM signs as gmail.com. Chose SMTP2GO's non-expiring free plan (1,000/month, five sender domains), which authenticates by three CNAMEs and therefore cannot disturb the existing apex SPF or the Cloudflare inbound route. Full plan and acceptance criteria in `email-identity.md`; adoption records a stack exception in `AGENTS.md`.

## 2026-08-11 — A hold condition for the automation; boundary replies held to the standard

- **Status:** Implemented; closes the last two items the audit's completeness critic raised.
- **The hold.** Every week the machine auto-fires — Ghost publishes and emails Tuesday at 8:00, Buffer posts four more times with no human in the loop — and nothing anywhere named who could stop it or what would justify stopping. `operating-cadence.md` now carries a hold section with named conditions (a death or crisis in the founder's life; a public event that would make queued copy read as oblivious; an unresolved escalation in the replies; a factual error or an unconsented name; account compromise) and the actual mechanics for each surface, including the reminder that unscheduling a Ghost post drops its newsletter binding. The governing asymmetry: **any agent may hold, only the founder may resume** — holding costs a week's momentum, resuming into the wrong moment costs something that cannot be taken back. The Monday staging task now checks the hold before staging anything.
- **Boundary replies.** These are the only words the publication ever says to one named man, usually one who has just told the truth about something, and they had never been tested against the standard. Two rules now govern them: acknowledge the thing he said rather than the receipt of his message, and state a limit as the edge of what you can do rather than a policy applied to him — a policy makes him a case. The private-advice reply was rewritten accordingly; the conversation boundary lost its "I understand your point" preamble, which performed an agreement that may not exist and contradicted the reply standard's own ban on performing warmth.
- **Also checked, no change needed:** `content/metadata.md` — meta descriptions and alt text are the most compressed public copy in the repository and the audit's named risk vector. They hold. Nothing prescribes, nothing shames, and the staff-author record already carries the publication-voice ruling.

## 2026-08-11 — Predis declined; short-form video proceeds without a face

- **Status:** Predis declined. Video format recommended and a zero-cost proof produced; the voice question is the founder's open call.
- **Predis fails on price before anything else.** There is no free plan. Current tiers are Core $19/mo (1,300 credits), Rise $40 (3,200), Enterprise+ $212 (10,000), and video bills per second: Standard/UGC at 200 credits per 8 seconds, or 25 credits a second. A 30-second avatar reel costs 750 credits, so one essay a week needs 3,000–3,750 credits monthly — a $40/month floor with no headroom for retakes, against a standing no-new-spend rule. Its avatars are stock presenters from a shared library, which would make the publication's on-camera identity a stranger's face rented alongside every other customer. It posts to Instagram and LinkedIn but not Bluesky, so Buffer stays regardless. Its trial converts to a non-refundable charge; do not start it.
- **A caution about the evidence.** One widely cited "independent" Predis review carried six affiliate-tagged links to the vendor in its own HTML while stating "no affiliate relationship," and its pricing tiers no longer exist. Verification caught it. Aggregated review sites in this category should be treated as marketing until checked against the vendor's live pricing page.
- **Tooling was never the obstacle.** ElevenLabs ships avatar video on the Creator plan the founder already pays for. Rules are the obstacle, and each version costs a different number of them. The founder's own animated face breaks the 2026-08-10 ruling outright. An invented presenter protects the name and face but puts a lip-synced human — the most tell-prone thing in the format — against a visual system that rejects an image for one obvious synthetic tell and names visible human authorship a pillar.
- **A disclosure distinction the standing decision never contemplated.** Meta requires disclosure on organic posts carrying photorealistic video *or* realistic-sounding audio, with stated penalties. Images are exempt, which is why blank fields have been fine until now; video is a different regime. The 2026-08-10 decision covered two *optional* surfaces — Substack's statement and Instagram's profile label. Meta's per-post toggle is a mandatory control. That remains the founder's call, not one already made.
- **Recommended format, one rule instead of three and no money:** a 45-second vertical reel built only from artwork already cleared for that essay. Open on a collage panel held two beats with one sentence burned in as type; roughly 120 spoken words (~800 of 131,000 monthly ElevenLabs characters); motion is typographic plus slow pans; captions burned in throughout because feeds play silent; end card with the essay title and grownmengrow.com. Nothing new is generated, so nothing can carry a synthetic tell. Cut in DaVinci Resolve (free, no export watermark) or Remotion (free for a solo operator, and a fit with the Node rendering scripts already gated in this repository).
- **The open question is whose voice.** A clone of the founder's, a designed brand voice, or the founder at a microphone. The third triggers no disclosure requirement anywhere and touches no ruling — the 2026-08-10 ruling names his name and his face, not his voice.
- **Unverified, and it matters:** whether paid-tier ElevenLabs output carries a SynthID watermark today, which decides the disclosure question. ElevenLabs publishes no credit cost for video ("varies by duration and settings") and Creator cannot buy overage, so avatar video is unpriceable in advance. Some avatar models and reference-image upload are restricted in the United States.

## 2026-08-11 — Voice decision deferred; the field is narrowed to two

- **Status:** Deferred by the founder. No voiceover work proceeds until they decide.
- **Decision:** When voice work begins, the voice will be either a clone of the founder's own or a professional voice from ElevenLabs' offering, licensed through the existing Creator entitlement. The founder-at-a-microphone option and any non-ElevenLabs source are out.
- **A brand constraint, not just a tooling one:** one voice for the whole project. Whichever is chosen becomes the publication's spoken identity across every surface, so it is not a per-piece or per-platform choice and should not be revisited casually once set.
- **Verify at decision time, not now:** if a professional Voice Library voice is chosen, confirm that specific voice's commercial-use license against the Creator tier before any public use — Voice Library terms vary by voice and some carry restrictions that a tier check alone will not surface. If the clone is chosen, professional voice cloning is available on the current plan (one slot, unused) and requires the founder's recorded consent statement.
- **Still unresolved and load-bearing whenever this resumes:** whether paid-tier ElevenLabs output carries a SynthID watermark, which decides whether Meta's mandatory per-post disclosure control applies. That question outranks the choice of voice.

## 2026-08-12 — extract-zip has no fix; the risk is accepted in writing until 2026-11-09

- **Status:** Implemented under the repository's standing completion authority. This is a CI gate, not a publication action, so no founder decision was required.
- **The finding:** GHSA-jmr9-qjv8-65gv / CVE-2026-56876, extract-zip 2.0.1, High 8.6 — symlink targets are not validated during extraction, so a crafted archive can write outside the extraction directory. It began failing the required `Dependency scan / osv-scan` check on 2026-08-12 and blocked every pull request. `main` last passed at 758b865.
- **Upgrading is not available, and this was checked rather than assumed.** extract-zip has published no version above 2.0.1. gscan 6.4.2 is the current release and pins `@tryghost/zip` 3.5.0 exactly; that package's own latest, 3.5.6, still pins extract-zip 2.0.1 exactly. Every link in the chain is an exact pin, so no lockfile refresh moves any of it. The scanner reaches the same conclusion in one line: "0 vulnerabilities can be fixed."
- **Narrowing the scan was rejected.** `theme/pnpm-lock.yaml` is the only lockfile in the repository. Scoping around the finding would leave a required check that passes because it examined nothing — the exact failure the fleet standard names.
- **What was done:** a root `osv-scanner.toml` with one `IgnoredVulns` entry carrying the rationale and `ignoreUntil = 2026-11-09`, and `--config=osv-scanner.toml` added to the workflow's scan-args.
- **Why the root and not beside the lockfile.** OSV-Scanner reads its config from the scanned file's own directory and does not walk up, which would put it in `theme/` — and `scripts/package-ghost-theme.mjs` packages every tracked file under `theme/` into the zip uploaded to Ghost(Pro). The suppression file would have shipped inside the published theme.
- **Why an expiry rather than a standing entry.** An accepted risk that cannot expire is an unreviewed one. 2026-11-09 is a Monday, so the weekly scheduled scan surfaces it rather than someone remembering to.
- **The residual risk, stated plainly.** gscan is a devDependency. The only archive it extracts is the theme zip this repository builds moments earlier from its own tracked files. Nothing untrusted enters that path, and gscan's dependency tree is never shipped to or executed by the publication. If gscan ever extracts an archive originating outside this repository, the calculation changes and the entry comes out.
- **Verified, not assumed.** With the config in place the scan passes while still reading all 297 packages. A copy with the date moved into the past fails on the same finding. A copy naming a different vulnerability ID also fails, so the suppression is one ID wide. The single GHSA entry filters the CVE alias with it.
