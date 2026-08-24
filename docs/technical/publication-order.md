# Publication order

Status: the register of record for which approved field note takes the next Ghost slot. Established 2026-08-16 under the founder's instruction to close every open decision rather than carry it.

`publish-timing.md` decides **when** a slot happens — Tuesday 8:00 AM ET. This decides **which note goes in it**. Before this existed, that question came back to the founder every week, and the weekly staging task had nothing to read.

## The order is constrained, not preferred

This is the part that matters. **Three of the approved notes reference each other in their published copy.** Publishing them out of sequence does not merely read oddly — it prints sentences that are false to the reader.

| Constraint | The sentence that requires it |
|---|---|
| `friendship-has-a-maintenance-schedule` **before** `rest-is-not-a-reward` | Maintenance: *"Maintenance sounds unromantic because it is. That is the point."* → Rest: *"The maintenance model is unromantic, **which by now is a family trait**"* |
| `rest-is-not-a-reward` **immediately before** `you-cant-outwork-a-wrong-direction` | Direction: *"the same calendar that holds the oil change and now, **if the last field note landed, the rest**"* — "the last field note" means the one immediately prior, so this is adjacency, not just order |
| `rest-is-not-a-reward` **before** `your-body-keeps-the-books` | Body: *"booked by the calendar and not by crisis. **You know this argument by now**: by interval, not by feeling"* — that phrasing is Rest's |

These were found by reading the bank, not by preference, and they were latent: nothing in the repository recorded them and any arbitrary running order would have broken at least one. `verify-repository.mjs` now fails if the order below violates any of them.

### A fourth reference was found in a caption, and the caption gave way

The scan that produced the three constraints above read **essay bodies only**. It did not read the Instagram captions or the platform packs, and one of them carried a cross-reference of exactly the same kind — found 2026-08-17 by the Monday staging task, which held the carousel rather than posting it.

Field Note 2's caption closed: *"The next field note is about the friendships men say matter and the maintenance we keep pretending they do not require."* That named the note in the slot immediately after Field Note 2, which the order does not hold — `a-confession-can-still-be-selfish` sits there and was already scheduled on Ghost for 2026-08-25.

**Founder ruling, 2026-08-17: the line was cut and the order stands.** Moving `friendship-has-a-maintenance-schedule` up to position 2 would also have made the sentence true, and satisfied every constraint above, but it would have meant reordering the register to accommodate one promotional sentence — the thing this document explicitly forbids — while un-scheduling a staged post and running two friendship pieces back to back. The line was cut rather than rewritten because any rewrite that named the next piece would rebuild the same coupling.

**The order below is unchanged by this.** No slot moved.

### Why a fourth one could hide, and what now catches the fifth

The three constraints above were found by reading and then hardcoded. A hardcoded list inherits the blind spots of the scan that produced it, which is precisely how a caption went unread.

`verify-repository.mjs` now scans **every approved field note and platform pack** — essay bodies, Instagram captions, alt text, and packs alike — for explicit relative references to another note ("the next field note", "the last field note", and the like). Every hit must be registered against a constraint; an unregistered one fails the build. Adding such a sentence to any caption from now on either registers as a constraint or does not ship.

Stated plainly because the alternative is a gate implying coverage it does not have: this catches **explicit** relative references only. The `rest-is-not-a-reward` and `your-body-keeps-the-books` callbacks — *"which by now is a family trait"*, *"you know this argument by now"* — carry no phrase a regex can find. They are registered by hand, and a future callback written that way will still need a human to read for it.

## The order

Sequence is the authority. Dates are projections from the Tuesday 8:00 AM slot and shift by a week whenever the staging task's hold fires.

| # | Slug | Projected | State |
|---|---|---|---|
| — | `strength-has-to-grow-up` (Essay 1) | 2026-08-09 | published |
| 1 | `call-your-friends-before-theres-a-reason` | 2026-08-18 | scheduled |
| 2 | `a-confession-can-still-be-selfish` | 2026-08-25 | scheduled |
| 3 | `friendship-has-a-maintenance-schedule` | 2026-09-01 | |
| 4 | `anger-is-a-terrible-manager` | 2026-09-08 | |
| 5 | `rest-is-not-a-reward` | 2026-09-15 | |
| 6 | `you-cant-outwork-a-wrong-direction` | 2026-09-22 | |
| 7 | `your-body-keeps-the-books` | 2026-09-29 | |
| 8 | `ask-for-help-while-its-still-cheap` | 2026-10-06 | |
| 9 | `comparison-is-a-bad-map` | 2026-10-13 | |
| 10 | `the-lights-never-flickered` | 2026-10-20 | |
| 11 | `nobody-rigs-to-the-breaking-strength` | 2026-10-27 | |
| 12 | `you-can-walk-on-it-tomorrow` | 2026-11-03 | |
| 13 | `somebody-is-up-on-his-ladder` | 2026-11-10 | |

## Why this order and not another

The constraints above fix positions 3, 5, 6, and 7 relative to each other. The remaining choices are editorial and were made on three grounds:

- **Two friendship pieces do not run back to back.** Position 1 and position 3 are both about friendship; position 2 separates them with a piece about repair.
- **The witness piece runs late.** `the-lights-never-flickered` is the only note where the reader is held rather than asked. It sits at position 10, after the voice is established, so it reads as a deliberate change of stance rather than as the publication's default register. It is not a series and nothing labels it.
- **Related machinery is spread.** `rest-is-not-a-reward` and `nobody-rigs-to-the-breaking-strength` both argue about capacity and both run on maintenance metaphors; they sit at 5 and 11 rather than adjacent.

`you-can-walk-on-it-tomorrow` was appended at 12 on 2026-08-19 because appending moves nothing, and two slots are already scheduled. **It sits directly after `nobody-rigs-to-the-breaking-strength`, and both open on a jobsite material fact** — which is the one preference above that an append cannot honour. The arguments do not overlap: 11 is about how much load a man books himself at, 12 is about how long a thing takes to become load-bearing. But they will read as neighbours, and a reader who noticed the first opening will notice the second. Moving 12 earlier is a founder decision and would push two scheduled posts; it is recorded here rather than taken.

`somebody-is-up-on-his-ladder` was appended at 13 on 2026-08-23, for the same reason: appending moves nothing and two slots are already scheduled. Two preferences above take strain and are recorded rather than quietly overridden.

**The witness preference holds, and gets a second test.** This is the second `witness` note, and at 13 it runs three slots after `the-lights-never-flickered` at 10. Late is right for the same reason it was right at 10 — a change of stance reads as deliberate only once the default register is established — and three slots apart is far enough that two witness pieces will not read as a series. Nothing labels either one.

**The machinery preference now takes real strain, and this is the third slot in a row to do it.** Positions 11, 12, and 13 all run on building metaphors — rigging, concrete, gutters — and 12 and 13 both open on a physical fact about a house. The arguments do not overlap: 11 is how much load a man books himself at, 12 is how long a thing takes to become load-bearing, 13 is what happens to the part that carries water off everything else. But three construction-adjacent openings in a row is more than the spread-the-machinery preference intends, and a reader who noticed the first two will notice the third. Moving 13 earlier, or interleaving one of positions 8 through 10 between 12 and 13, is a founder decision and would push scheduled posts; it is recorded here rather than taken.

## How this is used

The Monday staging task reads this file, takes the lowest-numbered note with no Ghost post, and stages it for the coming Tuesday with:

```
node scripts/stage-next-field-note.mjs <slug> <ISO-utc>
```

That script uploads the feature image, builds the post from the approved source under `content/field-notes/`, and transitions draft→scheduled with the newsletter bound — the binding only takes on that transition, so it cannot be set on an already-scheduled post. It prints a verification block; a run that reports `newsletter: NONE` has staged a post that will publish without sending.

**Run the dry run first, every week, whether or not the slot needs staging.**

```
node scripts/stage-next-field-note.mjs <slug> <ISO-utc> --dry-run
```

It reads the approved source, parses the frontmatter, builds the HTML, resolves the feature image, and prints the exact payloads without touching the network. This exists because of what 2026-08-24 found: the script had an unresolvable import and died on its first line in every invocation since it shipped, and everything below its argument check had never executed at all. Nothing caught that, because this register always held a scheduled slot and so the Monday task verified rather than staged, every week of the script's life. The first week the register runs dry would have been the first week the code ran — with the slot empty and no time to fix it. What the dry run proves, precisely, is the payload the real run would send, on the real note, every week. It does not exercise the three Ghost calls or the order they happen in — the upload, the create, and the draft→scheduled transition that binds the newsletter are still first run for real on the day they are needed. Saying otherwise would be this document claiming coverage it does not have. `scripts/test/field-note-post.test.mjs` covers the other half in CI by building a payload for every note in the bank.

A dry run that reports `alt text: MISSING` is accurate rather than broken: no field note carries `feature_image_alt` in its frontmatter yet, so the Ghost feature image ships without alt text. The staged post passes the value through the moment a note supplies one.

**The script refuses a note whose frontmatter is not `status: founder-approved`, and it decides that before it uploads anything.** Staging binds a newsletter send, so the approval rule lives in `buildPostPayload` rather than in an instruction the weekly task has to remember. The payload is built and validated first and the uploaded image URL attached afterwards — the reverse order would leave an orphaned PNG in Ghost storage and a stack trace on the morning a slot is due, and `AGENTS.md` states the rule outright: validate before mutating.

**The hold check in that task still runs first and still governs** — a held week shifts every projection below it by one slot and changes nothing about the order.

Changing the order is a founder decision recorded here. The checker enforces the constraints; it does not enforce the preferences, which are stated above so a future change can disagree with them knowingly.
