# Founder Decision Packet 01

Date: 2026-08-07

Status: Superseded by `founder-decisions.md`; retained as historical recommendation evidence.

This packet recommended the minimum launch configuration at the start of implementation. It is not a current checklist. The founder makes every final decision.

## Identity decisions completed

- Publication name: **Grown Men Grow**.
- Custom domain: `grownmengrow.com`.
- Instagram username: `@grownmengrow`.
- Instagram display name: **Grown Men Grow**.
- Instagram bio: “Some assembly still required.”
- Instagram profile image: approved stacked wordmark.

The canonical hostname is apex `grownmengrow.com`, with `www` designated to redirect to it. Ghost later adopted Michael Peacock as the credited writer while Grown Men Grow remains the primary publication identity; Instagram remains brand-only. The public support identity is `hello@grownmengrow.com`. The private Ghost visual baseline, metadata, and social-sharing images are now configured. The Instagram bio is not reused as Ghost metadata.

## Ghost subscription

### Recommendation

Use Ghost(Pro) Publisher for launch. Ghost's official price was verified on 2026-08-07 at $29 USD per month billed yearly, or $348 USD per year before tax.

### Reason

Publisher is the smallest current Ghost(Pro) plan that explicitly includes advanced native analytics. That directly satisfies the required page-visit reporting without adding a third-party analytics service. It also permits official marketplace themes and an optional custom sending domain.

### Lower-cost alternative

Use the Starter trial and confirm whether its dashboard exposes enough site traffic data. If it does not, either accept reduced analytics or upgrade. Do not add Google Analytics merely to avoid the Ghost plan difference.

### Reversibility

Ghost plans can be changed later. New accounts receive a 14-day free trial that does not bill automatically at expiry. Configure staging during the trial and defer the annual purchase until the founder approves the preview. No paid membership or Stripe connection is required.

## Ghost theme

### Recommendation

Launch with the unmodified Source theme.

### Reason

- Source is Ghost's current default theme.
- It supports modern publication and newsletter layouts through native settings.
- It needs no theme repository, build system, code injection, or maintenance.
- Ghost automatically updates an unmodified default Source installation.

### Alternative

Solo is the strongest official alternative if the founder prefers a more explicitly individual-writer presentation. It is designed for a single writer and supports Ghost membership and newsletter features.

### Decision method

Review Source and Solo with the approved launch content in Ghost preview. Choose on readability, mobile density, navigation, signup visibility, and fit with the founder's desired presence. Do not purchase a premium third-party theme for launch.

## Homepage and Start Here

### Recommendation

Keep the theme's native homepage and publish Start Here at `/start-here/`, linked first in primary navigation.

### Reason

This preserves the theme's supported structure and avoids custom routing or theme code. Start Here remains a stable destination for Instagram and new readers.

### Alternative

Making Start Here the root homepage may require theme-specific configuration or custom routing. Consider it only after previewing the native layout.

## Instagram account type

### Recommendation

Use a public Creator account and convert it before any launch post is published.

### Reason

Creator accounts suit individual content producers and provide Instagram Insights. Insights do not apply retroactively to content published before conversion. A Facebook Page connection is not required for this launch.

## Email configuration

### Recommendation

- One free newsletter.
- One free-member welcome email.
- One founder-approved public support address.
- One verified reply-to address.
- Ghost's managed sending domain at launch.

A custom sending domain is optional later. It adds DNS work and a warm-up period without creating a launch-critical capability.

## Repository visibility

### Recommendation

Keep the repository local through initial Ghost staging. If a remote becomes useful, create a private repository only after reviewing every tracked file and confirming that the confidential source material remains excluded.

No remote is required to configure or launch Ghost.

## Resolution

The founder approved Publisher, Source, the final identity, metadata, public launch copy, and rendered launch assets for private staging. Current unresolved gates live only in `founder-decisions.md` and `release-checklist.md`.
