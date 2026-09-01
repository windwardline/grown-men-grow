# Email Identity

Status: accepted 2026-08-13. SMTP2GO account created, `grownmengrow.com` verified, the three CNAMEs live in Cloudflare, an SMTP user created with open and click tracking disabled, and both send-as aliases confirmed by SMTP2GO and Gmail. See Acceptance below for what was verified and the one residual.

## The problem

`hello@grownmengrow.com` is inbound only. Cloudflare Email Routing forwards it to the founder's Gmail, which is the intended design — the mail should land there. But the route has no outbound identity, so replying today sends from the founder's personal Gmail address.

That breaks the 2026-08-10 publication-voice ruling on the surface where it matters most: a private reply to a reader who just disclosed something. It is also not a headers-only leak. Outlook and several other clients render `michaellynnpeacock@gmail.com on behalf of hello@grownmengrow.com` directly in the message list.

The welcome email invites every new member to reply. The invitation is good and stays. The sending path is what needs fixing.

## Why not Resend

Resend is the fleet's standard transactional provider and the account is on the free plan, which includes exactly one domain. `windwardline.com` occupies it and carries magic-link delivery for Levelflow and pathfinder. Adding `grownmengrow.com` requires a paid upgrade, which the founder ruled out.

## Why not Gmail's own SMTP

Gmail can relay a send-as alias through `smtp.gmail.com` with an app password, and it needs no new account. It fails the actual requirement. The envelope sender stays the personal Gmail address, DKIM signs as `gmail.com`, and the "on behalf of" annotation appears in common clients. It hides nothing.

## The path: SMTP2GO free

A pure SMTP relay rather than a marketing platform. The free plan does not expire: 1,000 emails per month, 200 per day, and five sender domains. Expected use is a few replies a week.

It authenticates by three CNAME records, so SMTP2GO manages the DKIM keys and the return path lives on a subdomain of `grownmengrow.com`. Nothing touches the existing apex SPF TXT record, which means the Cloudflare inbound route cannot be disturbed by this change. Mail then leaves with DKIM aligned to `grownmengrow.com` and no reference to the personal address anywhere in the message.

**Stack note.** This deviates from the fleet's preferred Resend standard, forced by the one-domain free-tier cap and the no-spend constraint. On adoption, record in `AGENTS.md`: `Stack exception (owner-approved 2026-08-11): SMTP2GO free relay provides outbound identity for hello@grownmengrow.com; Resend's free tier allows one domain, held by windwardline.com.`

## Steps

**Founder — 1.** Create a free account at smtp2go.com. Use `michael@grownmengrow.com` as the account address, not the personal Gmail.

**Founder — 2.** In the dashboard: Sending → Verified Senders → Sender Domains → Add Domain → `grownmengrow.com`. It will display three CNAME records. Leave the page open, or paste the three records into chat.

**Agent — 3.** Add the three CNAMEs to the Cloudflare zone (`grownmengrow.com`, zone `291a09b7029fee05cf32596753f88db8`) with the `cf-dns` helper, DNS-only, then trigger verification and confirm the domain shows verified.

**Founder — 4.** In the dashboard, Sending → SMTP Users: copy the SMTP username and password. Then in Gmail: Settings → Accounts and Import → "Send mail as" → Add another email address. Name `Grown Men Grow`, address `hello@grownmengrow.com`, leave "Treat as an alias" **checked**. Next screen: SMTP server `mail.smtp2go.com`, port `465`, SSL, with the SMTP user and password. Gmail emails a confirmation code to `hello@`, which routes to the same inbox — paste it back.

Store the SMTP password in the macOS Keychain as `smtp2go-grownmengrow` (account `peacock`) rather than anywhere in this repository. The agent never handles the value.

**Founder — 5.** In Gmail, Settings → Accounts and Import → "When replying to a message" → select **Reply from the same address the message was sent to**. Without this, a reply to a member still defaults to the personal address and the whole exercise fails silently.

**Agent — 6.** Add a DMARC record (`_dmarc.grownmengrow.com`, `v=DMARC1; p=none; rua=mailto:hello@grownmengrow.com`) once sending is aligned, then verify a live send: reply to a test member email and confirm the received message shows `hello@grownmengrow.com` in From, a `grownmengrow.com` DKIM signature, no `gmail.com` return path, and no "on behalf of" in a second client.

## Two addresses, on purpose

Both `hello@grownmengrow.com` and `michael@grownmengrow.com` are configured as Gmail send-as aliases through SMTP2GO, and both are confirmed.

`hello@` remains the public funnel — it is what the site, the Ghost Portal, and the newsletter reply-to expose. `michael@` is what a reader sees when they get an answer. The founder's reasoning, 2026-08-13: "If someone actually uses hello@grownmengrow.com, I want it to appear as though a real human is behind it. Nobody responds from a 'hello' email address. They are used as a funnel." That is the responsiveness principle applied to the reply surface — a man who writes in is answered by a person, not by a queue.

This supersedes the 2026-08-10 record that designated `michael@` for private account ownership and recovery only. A first name now appears on a semi-public surface. That is a deliberate, founder-made trade and is not to be "corrected" back: the 2026-08-10 publication-voice ruling governs bylines, author cards, staff names, and metadata credits on public pages, none of which this touches, and the exposure is a first name inside a private one-to-one exchange.

**Gmail reply behavior.** Keep "When replying to a message" set to *Reply from the same address the message was sent to*, and select `michael@` by hand when answering a reader. With both aliases configured this setting is a safety net rather than a hazard: if Gmail ever falls back it lands on `hello@`, a brand address, not the founder's personal Gmail. The remaining failure mode is cosmetic — a reply from the funnel address instead of the human one — and nothing leaks.

Making `michael@` the Gmail default with "always reply from default address" would automate the choice, and is rejected: it would stamp `michael@grownmengrow.com` onto the founder's ordinary personal correspondence, which shares the same mailbox.

**Tracking is off.** Open and click tracking are disabled on the SMTP user. Click tracking rewrites every link through `link.grownmengrow.com`, which on a private reply to a man who has just disclosed something would log his click and show him a URL other than the one that was sent. The tracking CNAME exists because domain verification requires all three; it is not used.

## Acceptance

**Accepted 2026-08-13 on a delivered message, verified in Outlook.**

The test arrived at an Outlook mailbox rendering `Grown Men Grow <hello@grownmengrow.com>` with no "via" and no "on behalf of" appended.

That is the acceptance signal, not a cosmetic one. Outlook appends "via" or "on behalf of" precisely when the authenticated sending domain fails to align with the From domain. Had the send-as still been relaying as the founder's personal Gmail — the exact failure this work existed to close — that is the condition that triggers the annotation, in that client. Its absence is Outlook reporting that the DKIM signature and return path align to `grownmengrow.com`.

Both aliases traverse the same SMTP user and the same verified domain, so the alignment demonstrated for one holds for the other; a separate test per alias is not required.

**One residual, cheap to close if ever wanted.** Raw `Return-Path`, `DKIM-Signature`, and `Authentication-Results` lines were not read directly. Outlook exposes no "Show original" equivalent in the founder's build, and Gmail's Sent-folder copy cannot answer the question — those three headers are written in transit, so the stored pre-transmission copy does not contain them. To close it later: send from Gmail with the From dropdown on a `grownmengrow.com` alias to the founder's own Gmail address, then read the received copy via Show original. The message leaves through SMTP2GO and re-enters through Gmail's MX, so the delivery path is complete. Expected: `d=grownmengrow.com`, `dkim=pass`, `spf=pass`, and no `gmail.com` return path.

The distinction worth preserving: the observable outcome was verified directly; the mechanism behind it is inferred from Outlook's own annotation rule rather than read off the wire.
