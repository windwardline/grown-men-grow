# Ghost Setup Runbook

No production setting is changed without explicit founder approval.

## Approved identity inputs

- Publication title: **Grown Men Grow**.
- Domain: `grownmengrow.com`.
- Instagram: `@grownmengrow`.
- Routed project address: `michael@grownmengrow.com`.
- Active private theme: Source v1.7.1, retained as rollback material.
- Approved replacement: original Grown Men Grow theme v1.0.0; locally validated package at `dist/grown-men-grow.zip` after packaging.
- Publication icon: approved stacked wordmark.
- Accent color: oxblood `#3A1518`.
- Replacement-theme typography: bundled Bodoni Moda, Barlow Condensed, and Source Serif 4.
- Publication logo and cover: none at launch.
- Newsletter sender: **Grown Men Grow**.
- Public support address: `hello@grownmengrow.com`.
- Newsletter reply-to: `hello@grownmengrow.com`; verified and displayed by Ghost.

The canonical hostname is apex `grownmengrow.com`, with `www` redirected to apex. Ghost credits **Michael Peacock** as the writer while **Grown Men Grow** remains the primary publication identity. Instagram remains brand-only. The approved site description, homepage metadata, and homepage/per-page social images are staged. Do not reuse the Instagram bio as site metadata.

Approved concise staff bio: **Michael Peacock writes Grown Men Grow, a publication about the unfinished work of being a man.** Use no staff profile photograph until the founder supplies or approves one; the theme supports the text-only author card.

## Publication

- [x] Create Ghost(Pro) trial publication under founder ownership.
- [ ] Recheck the trial and plan state at the launch checkpoint. The founder reported 13 trial days remaining on 2026-08-08 and explicitly deferred the Publisher purchase while the trial remains active.
- [x] Keep the publication in Ghost pre-launch/private mode during setup and review.
- [x] Set the approved publication title.
- [x] Set the approved publication description.
- [x] Set publication language to English.
- [x] Set timezone to Eastern Time (US & Canada).
- [x] Preserve Source v1.7.1 as the active private rollback baseline.
- [x] Build and validate the original replacement theme locally.
- [ ] Upload and activate the replacement theme in private Ghost.
- [ ] Preserve a downloadable copy of the previously active Source theme and current Ghost export before activation.
- [x] Configure the approved icon, no logo, no cover, and oxblood accent.

## Navigation and pages

- [x] Create Start Here as a Page with its approved slug.
- [x] Create About as a Page with its approved slug.
- [x] Add Start Here and About to primary navigation manually.
- [ ] Verify the replacement theme's editorial homepage with the staged content.
- [x] Verify Start Here, About, and Essay 1 in Ghost's phone and desktop previews.
- [ ] Verify the public tablet layout during the launch smoke test.

## Membership and newsletter

- [x] Set signup access to anyone.
- [x] Offer free membership only.
- [x] Do not connect Stripe.
- [x] Configure Ghost's native signup Portal with the brand name, approved icon, free tier only, and no extra signup notice.
- [x] Set the member account-page support address to `hello@grownmengrow.com`.
- [x] Set the public support and newsletter reply-to address to `hello@grownmengrow.com`.
- [x] Enable one newsletter.
- [x] Set the approved sender name and `hello@grownmengrow.com` reply-to address.
- [x] Replace Ghost's generic welcome scaffold with the founder-approved canonical body and verify the preview.
- [ ] Enable the free-member welcome email only at the authorized launch gate.
- [ ] Test signup, magic link, welcome delivery, account management, and unsubscribe.

## Essay 1

- [x] Transfer approved copy without rewriting.
- [x] Confirm title, dek, slug, Michael Peacock byline, excerpt, public access level, metadata, and current social cards.
- [x] Approve the title-free collage feature image.
- [ ] Attach the approved title-free collage feature image and accurate alt text.
- [x] Review web desktop, web phone, email, and social previews.
- [x] Confirm web publication is authorized and launch remains publish-only.
- [ ] Do not send Essay 1 as a newsletter without a later explicit authorization.

## SEO and metadata

- [x] Configure approved homepage metadata.
- [x] Configure approved Start Here, About, and Essay 1 metadata.
- [x] Configure the initial approved homepage and per-page X/Open Graph social images.
- [x] Approve the locally prepared collage-led social cards.
- [ ] Replace the staged social cards with the approved collage-led files.
- [ ] Verify automatic canonical URLs and sitemap.
- [x] Confirm private-site removal is authorized only after the remaining technical launch checks pass.

## Domain

- [x] Approve apex `grownmengrow.com` as canonical and `www` as the redirecting alternate host.
- [x] Inventory current DNS records before changes.
- [x] Add the root-domain Ghost records as DNS-only: `CNAME @` to `grown-men-grow.ghost.io`; `A www` to `178.128.137.126`.
- [x] Preserve the three Cloudflare Email Routing MX records, SPF, DKIM, and unrelated records. No DMARC record existed at cutover.
- [x] Verify apex DNS, apex HTTPS, Ghost custom-domain acceptance, and the `ghost.io` redirect to the apex.
- [x] Verify `www` HTTPS provisioning and its redirect to the apex.

## Backup and recovery

- [x] Download a current Ghost content-and-settings export to the ignored `backups/` area without opening or printing its contents.
- [x] Confirm Ghost(Pro) managed backups are being created automatically every three hours; restore/download requests go through Ghost support.
- [x] Keep the export ignored; do not inspect, print, or commit member data or account exports.

## Staging cleanup

- [x] Remove Ghost's generic “About this site” scaffold page.
- [x] Confirm the only page drafts are Start Here and About.
- [x] Confirm the only post draft is Essay 1, “Strength Has to Grow Up.”
