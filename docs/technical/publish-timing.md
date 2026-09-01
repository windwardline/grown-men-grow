# Publish timing

Decided 2026-08-10, before any owned data existed. Every number below is an industry aggregate, not a measurement of this audience; the validation protocol at the end replaces this page's assumptions with our own analytics and takes precedence the moment it produces results.

## Audience assumption

US-skewed, adult men, Eastern Time as the anchor (site timezone is already America/New_York). All times below are ET.

## What the aggregate data says

**Email/newsletter sends** (the essay email is the publish event on Ghost): Tuesday is the most consistent top day across 2025 studies, with Thursday close behind and Wednesday third; newsletter opens peak in the 8–10 AM window, with a secondary click-oriented window late afternoon ([Mailmunch](https://www.mailmunch.com/blog/best-time-to-send-email), [EmailToolTester](https://www.emailtooltester.com/en/blog/best-times-to-send-newsletters/), [OptinMonster](https://optinmonster.com/the-best-time-to-send-emails-heres-what-studies-show/)).

**Long-form essay platforms**: Substack-focused analyses find Tuesday–Thursday 7–9 AM strongest for articles, opens peaking 9–11 AM — and, specifically for personal-essay/culture niches, a real weekend counter-signal: leisure-reading engagement rises on Saturday and Sunday when most publishers go quiet ([Narrareach](https://www.narrareach.com/blog/best-time-to-post-on-substack), [Unstackit](https://unstackit.substack.com/p/best-time-to-publish-substack), [The Writing Edge, 789k-note analysis](https://thewritingedge.substack.com/p/i-analyzed-789362-substack-notes)). First-two-hours engagement also feeds platform recommendation algorithms.

**Instagram**: the large 2025–26 datasets converge on midweek — [Buffer's 9.6M-post analysis](https://buffer.com/resources/when-is-the-best-time-to-post-on-instagram/) peaks Thursday 9 AM and Wednesday 12 PM; [Sprout Social's 2B-engagement study](https://sproutsocial.com/insights/best-times-to-post-on-instagram/) shows Tuesday–Thursday middays; weekends are the weakest across nearly all verticals.

**LinkedIn and Bluesky**: LinkedIn follows the weekday-worktime pattern (Tuesday–Thursday, mid-morning; [Sprout Social](https://sproutsocial.com/insights/best-times-to-post-on-social-media/)). Bluesky has no large published timing dataset; treat it as weekday-evening/US and let owned data decide.

## Schedule of record (until owned data overrides)

Each platform gets its own slot, staggered so every surface has its own moment and the canonical page is always indexed first.

| When (ET) | Platform | What | Basis |
| --- | --- | --- | --- |
| **Tuesday 8:00 AM** | Ghost | Weekly field note: publish + email send | Strongest email day × 8–10 AM newsletter window × essay-platform 7–9 AM article window |
| **Tuesday 12:00 PM** | Bluesky + Substack Notes | First short fragment from the fresh essay | Rides day-of momentum; weekday-midday conversation window; feeds first-hours algorithmic signals |
| **Wednesday 10:00 AM** | LinkedIn Page | The pack's LinkedIn adaptation | LinkedIn's Tue–Wed mid-morning worktime peak (Sprout); one clear day after the email |
| **Thursday 7:00 AM** | Medium | URL import of the essay, canonical verified | ~48h after publish so search indexes the canonical first; Medium weekday-morning readership; import timing is low-stakes — recirculation is algorithmic |
| **Thursday 9:00 AM** | Instagram | The essay's carousel | Buffer's 9.6M-post peak slot (Thu 9 AM); Sprout midweek convergence |
| **Saturday 6:30 PM** | Substack Notes + Bluesky | Second fragment or canonical-link post | Weekend Notes engagement-per-post peak (Writing Edge analyses); low-competition leisure window. Moved from 9:30 AM on 2026-08-30 — see "The Saturday slot moved because it could not fire" below |
| **Sunday 9:00 AM** | Ghost | Essay B, when the second weekly slot activates | Personal-essay weekend counter-signal; contested — first A/B target |

Essay B's cross-platform posts mirror the same pattern shifted: fragments Sunday midday, LinkedIn Monday 10:00 AM, Medium import Tuesday 7:00 AM, carousel Wednesday 12:00 PM (Buffer's second peak).

Essay B's Sunday slot is the one genuinely contested call: email aggregates say weekends underperform, essay-niche data says the opposite. It is scheduled first for A/B resolution rather than assumed correct.

## Validation protocol

1. **Instrument:** Ghost native analytics (opens, clicks, 48-hour pageviews, member conversions per post), Instagram Insights (reach, saves, shares, profile visits per post), Buffer analytics for Bluesky/LinkedIn.
2. **Weeks 1–4:** hold the schedule of record steady to establish a baseline. No timing changes.
3. **Weeks 5–8:** A/B the contested slot — alternate essay B between Sunday 9 AM and Thursday 8 AM (two sends each). Primary metric: open rate; secondary: 48-hour pageviews and member conversions.
4. **Weeks 9+:** adopt the winner, then A/B the next-largest uncertainty (Tuesday 8 AM vs 9:30 AM send). One variable at a time, minimum four sends per arm before concluding anything — small-list open-rate noise is large, so differences under ~5 points are not decisions.
5. Record each decision here with the numbers that made it.

## The protocol is suspended at step 3, and why

**Precondition, added 2026-08-26: steps 3 and 4 do not run below 30 newsletter recipients.** The 2026-08-23 analytics readout found the list at one member. Open rate on a single recipient is 0% or 100%; it is not a measurement, and no number of sends per arm repairs a sample of one. Step 4's "minimum four sends per arm" was written to control noise on a small list and reads, without this precondition, as though four sends were sufficient at any size — which is how a protocol that cannot run comes to look like a protocol that is running.

Thirty is a floor rather than a target: below it a five-point open-rate difference — step 4's stated decision threshold — is smaller than the swing of a single reader opening or not, so the protocol's own threshold cannot be resolved. It is not a claim that thirty is enough for confidence.

**What this is not.** It is not a timing decision, and it does not change the schedule of record. The schedule stands as written and steps 1 and 2 continue. **This is a distribution problem, and no amount of slot-tuning reaches it** — the readout said so and was right; the only change here is that the protocol now says so too, rather than specifying an experiment that silently produces noise.

**Marker, read by `verify-repository.mjs`.** The gate fails if this line is missing or duplicated, so the suspension cannot be lifted by quietly deleting the sentence that records it.

**A/B minimum recipients:** 30

## The Saturday slot moved because it could not fire

**Founder-directed, 2026-08-30.** The Saturday slot ran at 9:30 AM and missed twice in a row — 2026-08-23 with no note posted at all, and 2026-08-30 when `gmg-saturday-note` fired at 6:36 PM ET and its lateness guard correctly refused a slot 547 minutes gone.

**The cause is measured rather than guessed.** Across the ten scheduled tasks on this machine, every Monday-through-Thursday morning task fired within a minute of its slot — fleet health 09:02, Monday staging 09:31, Tuesday publish check 08:35, Tuesday note 11:45, Wednesday draft 10:01, Thursday Medium 06:51. Every Friday and Saturday task fired hours late: Friday analytics +338 minutes, Saturday note +556, Saturday draft +481. Scheduled tasks fire while the desktop application is open and otherwise on next launch, so a slot is only real if the application is open at it. On weekday mornings it is. On Friday and Saturday mornings it demonstrably is not.

**A slot that never fires posts nothing, which is strictly worse than posting at a less optimal hour.** The research behind this row distinguishes weekend from weekday — leisure-reading engagement rising Saturday and Sunday while publishers go quiet — not morning from evening. Saturday 6:30 PM sits inside the same weekend window the row was chosen for, so the move spends no part of the stated rationale.

**What it rests on, stated honestly:** one observation that the application was open at 6:36 PM on a Saturday, against two observations that it was not open at 9:30 AM. That is thin evidence for the new time and strong evidence against the old one. If the Saturday note misses from the evening slot as well, the conclusion is that no unattended Saturday slot is reachable on this machine and the note becomes a founder-run action rather than a scheduled one.

**Changed together, because a half-move is worse than none:** this row, the `gmg-saturday-note` cron (`15 9 * * 6` → `15 18 * * 6`), and the `--slot` argument in that task's `SKILL.md` (`09:30` → `18:30`). The guard computes lateness against the slot it is passed, so moving the cron without the argument would have produced a task that fires on time and refuses itself as nine hours late.



**Also unreachable, and separate from the sample-size problem.** Ghost's `/stats/` family and `/links/` return 403 to an Admin API integration key; they are session-authenticated for the admin UI only. Step 3's secondary metrics — 48-hour pageviews and per-post member conversions — cannot be collected programmatically. When the precondition is met, either those two numbers are read from the Ghost admin UI by hand or they are dropped from the protocol; that choice is still open and belongs with whoever restarts the A/B.

## The weekday premise broke on a Tuesday

**Observed 2026-09-01, not a decision.** `gmg-tuesday-note` fired at about 6:14 PM ET against an 11:45 AM cron and a 12:00 PM slot. The preflight's lateness guard refused it at 378 minutes past, and no Substack note went out. The profile was read afterwards to confirm rather than assume: the top note on `@grownmengrow` was seven days old, so Note 1 for this essay was never posted.

**This narrows the cause recorded in the Saturday section above.** That analysis measured ten tasks on 2026-08-30, found every Monday-through-Thursday task on time and every Friday and Saturday task hours late, and concluded that scheduled tasks fire only while the desktop application is open. The mechanism survives today intact. The generalisation drawn from it does not: **"weekday" was never the operative variable, and this row's own entry — Tuesday note, 11:45, on time that week — is the one that missed today.** A single dated survey was read as a standing property of weekdays, and it was a snapshot of one week's application usage.

**What can be said with the evidence in hand.** A slot is real only if the application happens to be open at it, and nothing about the day of week makes that reliable. Morning slots have a better record than midday and evening ones, which is consistent with when the machine is first used rather than with anything about audience timing. That is an observation about this machine, not about readers.

**Deliberately not changed here.** No slot moves on this evidence. The Saturday move was founder-directed and this would be a second timing change made from a single miss, which is the reasoning the Saturday section itself flagged as thin. The open question is whether the Tuesday fragment slot should stay unattended at all, or join the Saturday note as a founder-run action; that is a founder decision and it is listed as open in the handoff log rather than settled here.
