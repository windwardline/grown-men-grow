# Email Identity

Status: **migrated to Resend 2026-09-15**, and the residual this document carried since 2026-08-13 is closed. `grownmengrow.com` is a verified Resend domain, both Gmail send-as aliases relay through `smtp.resend.com:465` on a sending-only key scoped to this domain, and the three SMTP2GO CNAMEs have been removed from Cloudflare. Acceptance is now read off the wire rather than inferred. The SMTP2GO history below is kept because the reasoning still explains why the requirement exists.

## The problem

`hello@grownmengrow.com` is inbound only. Cloudflare Email Routing forwards it to the founder's Gmail, which is the intended design — the mail should land there. But the route has no outbound identity, so replying today sends from the founder's personal Gmail address.

That breaks the 2026-08-10 publication-voice ruling on the surface where it matters most: a private reply to a reader who just disclosed something. It is also not a headers-only leak. Outlook and several other clients render `michaellynnpeacock@gmail.com on behalf of hello@grownmengrow.com` directly in the message list.

The welcome email invites every new member to reply. The invitation is good and stays. The sending path is what needs fixing.

## Why not Resend — the 2026-08-11 reasoning, and why it expired

Resend is the fleet's standard transactional provider and the account was on the free plan, which then included exactly one domain. `windwardline.com` occupied it and carried magic-link delivery for Levelflow and pathfinder. Adding `grownmengrow.com` required a paid upgrade, which the founder ruled out.

**That premise died on 2026-09-02** and nothing noticed for thirteen days. Resend moved the free tier from one verified domain to three. The exception this document exists to justify had exactly one load-bearing reason, and it was a number on someone else's pricing page — a premise that cannot be re-derived locally and so goes stale in silence. The decision was correct when it was made and wrong within three weeks, which is the ordinary lifespan of a constraint borrowed from a vendor.

The closing rule: **an exception whose premise lives outside this repository names the fact it depends on, so a later reader can check it.** This one said "requires a paid upgrade" without saying "because the free tier allows one domain, as of 2026-08-11" — and the checker that would have caught it could not exist, because SMTP2GO left no trace in any file, dependency or manifest. It was Gmail configuration and three DNS records.

## Why not Gmail's own SMTP

Gmail can relay a send-as alias through `smtp.gmail.com` with an app password, and it needs no new account. It fails the actual requirement. The envelope sender stays the personal Gmail address, DKIM signs as `gmail.com`, and the "on behalf of" annotation appears in common clients. It hides nothing.

## The path taken 2026-08-13, retired 2026-09-15: SMTP2GO free

A pure SMTP relay rather than a marketing platform. The free plan does not expire: 1,000 emails per month, 200 per day, and five sender domains. Expected use is a few replies a week.

It authenticates by three CNAME records, so SMTP2GO manages the DKIM keys and the return path lives on a subdomain of `grownmengrow.com`. Nothing touches the existing apex SPF TXT record, which means the Cloudflare inbound route cannot be disturbed by this change. Mail then leaves with DKIM aligned to `grownmengrow.com` and no reference to the personal address anywhere in the message.

**Stack note.** This deviates from the fleet's preferred Resend standard, forced by the one-domain free-tier cap and the no-spend constraint. On adoption, record in `AGENTS.md`: `Stack exception (owner-approved 2026-08-11): SMTP2GO free relay provides outbound identity for hello@grownmengrow.com; Resend's free tier allows one domain, held by windwardline.com.`

## Steps (as executed for SMTP2GO, 2026-08-13 — historical)

**Founder — 1.** Create a free account at smtp2go.com. Use `michael@grownmengrow.com` as the account address, not the personal Gmail.

**Founder — 2.** In the dashboard: Sending → Verified Senders → Sender Domains → Add Domain → `grownmengrow.com`. It will display three CNAME records. Leave the page open, or paste the three records into chat.

**Agent — 3.** Add the three CNAMEs to the Cloudflare zone (`grownmengrow.com`, zone `291a09b7029fee05cf32596753f88db8`) with the `cf-dns` helper, DNS-only, then trigger verification and confirm the domain shows verified.

**Founder — 4.** In the dashboard, Sending → SMTP Users: copy the SMTP username and password. Then in Gmail: Settings → Accounts and Import → "Send mail as" → Add another email address. Name `Grown Men Grow`, address `hello@grownmengrow.com`, leave "Treat as an alias" **checked**. Next screen: SMTP server `mail.smtp2go.com`, port `465`, SSL, with the SMTP user and password. Gmail emails a confirmation code to `hello@`, which routes to the same inbox — paste it back.

Store the SMTP password in the macOS Keychain as `smtp2go-grownmengrow` (account `peacock`) rather than anywhere in this repository. The agent never handles the value.

**Founder — 5.** In Gmail, Settings → Accounts and Import → "When replying to a message" → select **Reply from the same address the message was sent to**. Without this, a reply to a member still defaults to the personal address and the whole exercise fails silently.

**Agent — 6.** Add a DMARC record (`_dmarc.grownmengrow.com`, `v=DMARC1; p=none; rua=mailto:hello@grownmengrow.com`) once sending is aligned, then verify a live send: reply to a test member email and confirm the received message shows `hello@grownmengrow.com` in From, a `grownmengrow.com` DKIM signature, no `gmail.com` return path, and no "on behalf of" in a second client.

## The path now: Resend

One provider carries every outbound path the fleet has. `smtp.resend.com` port 465 SSL, username `resend`, password a Resend API key — the same four fields Gmail's send-as asks for, so the migration was a field swap rather than a redesign.

**The key is scoped, and the scope is proven rather than trusted.** It is a `sending_access` key bound to this domain's `domain_id`: it can send as `grownmengrow.com` and do nothing else — it cannot read the account's email logs, cannot touch `windwardline.com`, cannot enumerate or create anything. That matters because the value is pasted into Google's configuration and is therefore held by Google. Resend's `/api-keys` list endpoint omits `permission` and `domain_id`, so the scope cannot be read back and was instead demonstrated on 2026-09-15: sending as `login@windwardline.com` returns `403 This API key is not authorized to send emails from windwardline.com`, and sending as `hello@grownmengrow.com` returns 200. A property you cannot read is verified by behaviour or it is assumed.

The key lives in the macOS Keychain as `resend-gmg-sending` and carries a row in `ops/credentials.tsv`. Its predecessor did not, and that is the more instructive half of this migration: `email-identity.md` step 4 prescribed a Keychain item `smtp2go-grownmengrow`, it was never created, and for a month the SMTP password existed only inside Gmail's send-as config — a surface that does not display it. It could not be enumerated, audited or rotated, and the Keychain/manifest check passed **vacuously** because both sides were empty. A local copy of a remote secret is what makes the remote secret governable.

Four DNS records, all on subdomains, so the apex MX and SPF that carry Cloudflare inbound routing are untouched exactly as they were under SMTP2GO:

| Type | Name | Value |
|---|---|---|
| TXT | `resend._domainkey` | DKIM public key |
| MX | `send` | `feedback-smtp.us-east-1.amazonses.com` (priority 10) |
| TXT | `send` | `v=spf1 include:amazonses.com ~all` |
| CNAME | `rsend` | `send.forge.rmta.net` |

The zone was diffed before and after: four records added, zero removed, and the apex MX, apex SPF, DMARC and every Ghost record verified present afterward. The three SMTP2GO CNAMEs (`em790852`, `s790852._domainkey`, `link`) were then removed and the zone re-derived to confirm no `smtp2go` reference survives.

**Deliverability is now watched rather than assumed.** `ops/resend-health.py` runs in the weekly fleet-health cadence and fails on a suppressed recipient, an unverified domain, or a bounce rate over ceiling. Under SMTP2GO nothing watched anything: `~/AGENTS.md` asserted that a check on those three CNAMEs "runs from the Cloudflare credential already held", and no such check was ever written.

## Two addresses, on purpose

Both `hello@grownmengrow.com` and `michael@grownmengrow.com` are configured as Gmail send-as aliases through SMTP2GO, and both are confirmed.

`hello@` remains the public funnel — it is what the site, the Ghost Portal, and the newsletter reply-to expose. `michael@` is what a reader sees when they get an answer. The founder's reasoning, 2026-08-13: "If someone actually uses hello@grownmengrow.com, I want it to appear as though a real human is behind it. Nobody responds from a 'hello' email address. They are used as a funnel." That is the responsiveness principle applied to the reply surface — a man who writes in is answered by a person, not by a queue.

This supersedes the 2026-08-10 record that designated `michael@` for private account ownership and recovery only. A first name now appears on a semi-public surface. That is a deliberate, founder-made trade and is not to be "corrected" back: the 2026-08-10 publication-voice ruling governs bylines, author cards, staff names, and metadata credits on public pages, none of which this touches, and the exposure is a first name inside a private one-to-one exchange.

**Gmail reply behavior.** Keep "When replying to a message" set to *Reply from the same address the message was sent to*, and select `michael@` by hand when answering a reader. With both aliases configured this setting is a safety net rather than a hazard: if Gmail ever falls back it lands on `hello@`, a brand address, not the founder's personal Gmail. The remaining failure mode is cosmetic — a reply from the funnel address instead of the human one — and nothing leaks.

Making `michael@` the Gmail default with "always reply from default address" would automate the choice, and is rejected: it would stamp `michael@grownmengrow.com` onto the founder's ordinary personal correspondence, which shares the same mailbox.

**Tracking is off.** Open and click tracking are disabled on the Resend domain (confirmed on the domain record 2026-09-15), as they were on the SMTP2GO user before it. Click tracking rewrites every link through `link.grownmengrow.com`, which on a private reply to a man who has just disclosed something would log his click and show him a URL other than the one that was sent. The tracking CNAME exists because domain verification requires all three; it is not used.

## Acceptance

**Accepted 2026-09-15 on a delivered message, with the full headers read directly.** This supersedes the 2026-08-13 acceptance and closes the residual that one recorded.

A message sent from Gmail as `michael@grownmengrow.com` to a Gmail address, received copy read via the Gmail API:

```
Authentication-Results: mx.google.com;
  dkim=pass header.i=@grownmengrow.com header.s=resend header.b=gHXSzti8;
  dkim=pass header.i=@amazonses.com header.s=224i4yxa5dv7c2xz3womw6peuasteono;
  spf=pass (google.com: domain of ...@send.grownmengrow.com designates
    54.240.9.1 as permitted sender) smtp.mailfrom=...@send.grownmengrow.com;
  dmarc=pass (p=NONE sp=NONE dis=NONE) header.from=grownmengrow.com
Return-Path: <...@send.grownmengrow.com>
DKIM-Signature: v=1; a=rsa-sha256; ... s=resend; d=grownmengrow.com;
From: Grown Men Grow <michael@grownmengrow.com>
```

Every clause the 2026-08-13 entry could only infer is now stated by the receiving server: DKIM signed by and aligned to `grownmengrow.com`, SPF passing on a return path inside `send.grownmengrow.com`, DMARC aligned, and **no `gmail.com` anywhere in the path**. The display name reads `Grown Men Grow`, which is the 2026-08-10 publication-voice ruling holding on a semi-public surface.

Resend's own log records the same message delivered, so both ends of the path are evidenced independently rather than one being assumed from the other.

**How the residual closed, and what it teaches.** The 2026-08-13 entry could not read these headers for a stated reason: Outlook exposed no message-source view in the founder's build, and Gmail's Sent-folder copy cannot supply them because those three headers are written in transit. Both facts were true. What was missing was the third option — read the *received* copy through the Gmail API, which is the same message after transit. The residual stayed open for a month not because the evidence was unreachable but because two blocked routes read as no route. Both messages appeared in this verification: the 562-byte Sent copy with no transit headers, and the 5,718-byte received copy carrying all of them, which is the distinction the original entry described correctly and then stopped at.

**Both aliases were then read back from Gmail's own settings, 2026-09-15.** The delivered-message test ran from `michael@` only, and the earlier version of this paragraph left `hello@` resting on a scope argument — one endpoint, one credential, one verified domain, therefore alignment carries. That reasoning was sound and it was still an assumption about a configuration nobody had looked at, which is the precise shape of the SMTP2GO credential failure recorded above. So it was looked at:

```
Grown Men Grow <hello@grownmengrow.com>
  Mail is sent through: smtp.resend.com
  Secured connection on port 465 using SSL
Grown Men Grow <michael@grownmengrow.com>
  Mail is sent through: smtp.resend.com
  Secured connection on port 465 using SSL
```

Neither alias references SMTP2GO. This mattered more than it looks: the three SMTP2GO CNAMEs were deleted in this change set, so an alias still pointing at `mail.smtp2go.com` would have lost DKIM alignment immediately and stopped sending entirely once the account is deleted — a silent break of the publication's reply path, discoverable only by a reader not getting an answer.

Two settings confirmed in the same read: the display name is `Grown Men Grow` on both, so the 2026-08-10 publication-voice ruling holds on the semi-public surface; and **When replying to a message** is still *Reply from the same address the message was sent to*, the safety net this document requires.

**What remains unobserved** is narrow and honest: a delivered message *from* `hello@` with its headers read. Configuration is now evidence rather than inference, but a send is still the only thing that proves a send. One reply from `hello@` closes it at no cost.
