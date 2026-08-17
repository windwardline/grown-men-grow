# Operating Cadence

Status: current operating standard. Publication and production cadences approved by the founder on 2026-08-10; full weekly automation directed on 2026-08-11 ("full automation every week for everything, wherever possible").

Two cadences run at different speeds. **Publication** is one essay per week. **Production** is two new drafts per week. The gap is deliberate — it builds a bank, so a bad week never forces a thin essay.

## Publication cadence

One field note per week, Tuesday, with the newsletter. Everything else in the week radiates from it. Per-platform slots and their evidence live in `publish-timing.md`, which is the schedule of record; the table below is a summary and defers to that file.

| Day | Time (ET) | Surface | Who |
|---|---|---|---|
| Tuesday | 8:00 AM | Ghost essay publishes and emails | Automated |
| Tuesday | 12:00 PM | Bluesky fragment | Buffer |
| Tuesday | 12:00 PM | Substack Note 1 | Automated (browser) |
| Wednesday | 10:00 AM | LinkedIn post | Buffer |
| Thursday | 7:00 AM | Medium import, canonical-first | Automated |
| Thursday | 9:00 AM | Instagram carousel | Buffer |
| Saturday | 9:30 AM | Bluesky weekend fragment | Buffer |
| Saturday | 9:30 AM | Substack Note 2 | Automated (browser) |

## Production cadence

Two new drafts per week, Wednesday and Saturday, written to `drafts/` and delivered inline for the founder to read without opening anything. The two drafts of a week must not be siblings — if Wednesday's is interior and reflective, Saturday's goes concrete and external.

Every draft runs against the nine tests in `../editorial-underpinning.md` before delivery, and the report names anything that came close to failing. Drafts are never quietly sanded down to pass. Only the founder moves work from `drafts/` into `content/`.

## Weekly task roster

Eight recurring tasks. Every one of them either does the work or hands the founder exact step-by-step instructions — which app, which button, what to paste, in what order. A bare to-do is a defect.

| Task | When (ET) | Does |
|---|---|---|
| `gmg-monday-staging` | Mon 9:30 AM | Verifies Tuesday's post is scheduled with the newsletter bound; stages it if missing; queues the week's Buffer posts; builds the iCloud phone kit |
| `gmg-tuesday-publish-check` | Tue 8:30 AM | Confirms the essay published, emailed, and fed the pipeline |
| `gmg-tuesday-note` | Tue 11:45 AM | Posts Note 1 verbatim to the Substack profile and verifies it live |
| `gmg-wednesday-draft` | Wed 10:00 AM | Writes and delivers the week's first new draft |
| `gmg-thursday-medium` | Thu 6:45 AM | Runs the Medium URL import with canonical verification |
| `gmg-friday-analytics` | Fri 9:00 AM | Numbers against the validation protocol, plus what readers actually said back |
| `gmg-saturday-note` | Sat 9:15 AM | Posts Note 2 verbatim to the Substack profile and verifies it live |
| `gmg-saturday-draft` | Sat 10:30 AM | Writes and delivers the week's second new draft |

Tasks fire while the desktop app is open; a task due while it is closed runs at next launch.

## What stays with the founder

Instagram's app-only features — link stickers, pinning, native-audio reels. Each arrives as steps with the copy already written. Everything else is automated, and anything that lands on the founder without instructions is a bug in the task, not a chore for the founder.

**The two Substack Notes moved to the agents on 2026-08-17** (founder ruling). Substack still has no API; the path is keystroke injection into its contenteditable composer through the founder's logged-in Chrome, which became possible when the permission that blocked it on 2026-08-16 was granted. The tasks post verbatim pack copy and verify on the live profile rather than on the click.

**Autonomy changed what a missed schedule costs, so both note tasks carry a lateness guard.** These tasks fire while the desktop app is open and otherwise at next launch — on 2026-08-16 `gmg-saturday-note` ran at 3:39 PM against a 9:15 AM schedule because the app was closed. Handing over copy six hours late cost nothing. Posting six hours late misses a researched window and pollutes the timing data the Friday task reads. So a note task firing more than an hour past its slot does not post: it hands the founder the copy and the decision. Each task also refuses to post when the week's essay did not publish, when the note is already the top note on the profile, or when the week is held.

Every failure degrades to the old behaviour — the founder gets the copy and the steps. Nothing about this makes a missed note worse than it was.

## The iCloud phone kit

Each week's kit lives at `~/Library/Mobile Documents/com~apple~CloudDocs/Grown Men Grow/Instagram/Week NN — <Essay Title>/`. Action subfolders are named `<n> — <DAY> — <action>`, where `<DAY>` is the three-letter all-caps day the action happens (founder ruling, 2026-08-11). The no-action folder is `9 — Backup — Buffer auto-posts these (no action)`. A `READ ME — links and copy.txt` at the week root carries every founder action with its day, time, steps, and paste-ready copy.

## The hold

Every week this publication auto-fires: Ghost publishes and emails Tuesday at 8:00, and Buffer posts four more times without a human in the loop. That is the point of it. It also means the machine will publish cheerfully into a week that has stopped being ordinary unless someone stops it.

**Any agent may hold. Only the founder may resume.** The asymmetry is deliberate — holding costs a week's momentum, resuming into the wrong moment costs something that cannot be taken back. An agent that holds says so immediately and prominently, and never quietly restarts what it stopped.

Hold when any of these is true, without waiting to be asked:

- A death, illness, or crisis in the founder's life.
- A public event that would make the queued copy read as oblivious. The test is not whether the essay mentions it; it is whether a reader who just read the news would find the post tone-deaf arriving that morning.
- An unresolved escalation in the replies — a reader in real distress, a threat, a live harassment problem. Publishing on schedule into that is its own answer, and the wrong one.
- A factual error found in queued copy, or copy that names someone who did not consent to being named.
- Any sign of account compromise on Ghost, Buffer, or a distribution surface.

**How to actually stop each thing.** Ghost: set the scheduled post back to draft through the Admin API helper — and remember that re-scheduling later must re-bind the newsletter with `?newsletter=default-newsletter&email_segment=all`, because the binding is lost on the way down. Buffer: delete or move the scheduled posts for the affected days; a paused channel is safer than editing five posts under time pressure. iCloud kit: overwrite the week's `READ ME` first line so the founder is not following stale instructions from their phone.

Then say what was held, why, and what it costs to resume. The founder decides.

## Boundaries

Automation stages and verifies. It does not publish unreviewed platform copy, send an unauthorized newsletter, or post to Instagram outside the approved pack copy at schedule-of-record slots. Those boundaries are set in `../../AGENTS.md` and are not relaxed by anything here.
