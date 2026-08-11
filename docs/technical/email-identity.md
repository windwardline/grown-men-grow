# Email Identity

Status: plan approved in principle by the founder on 2026-08-11 ("My personal email should not be visible at all... Fix it, without adding spend, so that hello@grownmengrow.com is seen"). Awaiting the three founder steps below; DNS and verification are automated.

## The problem

`hello@grownmengrow.com` is inbound only. Cloudflare Email Routing forwards it to the founder's Gmail, which is the intended design — the mail should land there. But the route has no outbound identity, so replying today sends from the founder's personal Gmail address.

That breaks the 2026-08-10 publication-voice ruling on the surface where it matters most: a private reply to a reader who just disclosed something. It is also not a headers-only leak. Outlook and several other clients render `michaellynnpeacock@gmail.com on behalf of hello@grownmengrow.com` directly in the message list.

The welcome email invites every new member to reply. The invitation is good and stays. The sending path is what needs fixing.

## Why not Resend

Resend is the fleet's standard transactional provider and the account is on the free plan, which includes exactly one domain. `windwardline.com` occupies it and carries magic-link delivery for Levelflow, TimeShift, and pathfinder. Adding `grownmengrow.com` requires a paid upgrade, which the founder ruled out.

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

## Acceptance

Not accepted until a real delivered message is inspected in full headers and the personal address appears nowhere in From, Reply-To, Return-Path, Sender, or any client's rendered header line.
