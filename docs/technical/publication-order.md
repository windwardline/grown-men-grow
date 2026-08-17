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

## Why this order and not another

The constraints above fix positions 3, 5, 6, and 7 relative to each other. The remaining choices are editorial and were made on three grounds:

- **Two friendship pieces do not run back to back.** Position 1 and position 3 are both about friendship; position 2 separates them with a piece about repair.
- **The witness piece runs late.** `the-lights-never-flickered` is the only note where the reader is held rather than asked. It sits at position 10, after the voice is established, so it reads as a deliberate change of stance rather than as the publication's default register. It is not a series and nothing labels it.
- **Related machinery is spread.** `rest-is-not-a-reward` and `nobody-rigs-to-the-breaking-strength` both argue about capacity and both run on maintenance metaphors; they sit at 5 and 11 rather than adjacent.

## How this is used

The Monday staging task reads this file, takes the lowest-numbered note with no Ghost post, and stages it for the coming Tuesday with:

```
node scripts/stage-next-field-note.mjs <slug> <ISO-utc>
```

That script uploads the feature image, builds the post from the approved source under `content/field-notes/`, and transitions draft→scheduled with the newsletter bound — the binding only takes on that transition, so it cannot be set on an already-scheduled post. It prints a verification block; a run that reports `newsletter: NONE` has staged a post that will publish without sending.

**The hold check in that task still runs first and still governs** — a held week shifts every projection below it by one slot and changes nothing about the order.

Changing the order is a founder decision recorded here. The checker enforces the constraints; it does not enforce the preferences, which are stated above so a future change can disagree with them knowingly.
