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

### A fourth constraint, found 2026-08-17, and the order currently violates it

The scan that produced the three constraints above read **essay bodies only**. It did not read the Instagram captions or the platform packs, and one of them carries a cross-reference of exactly the same kind.

Field Note 2's approved Instagram caption closes: *"The next field note is about the friendships men say matter and the maintenance we keep pretending they do not require."* That sentence names the note in the slot **immediately after** Field Note 2 — so it requires `friendship-has-a-maintenance-schedule` at position 2, where the order below has `a-confession-can-still-be-selfish`.

The caption is founder-approved copy from 2026-08-09 and the confession note is already scheduled on Ghost for 2026-08-25, so this is a conflict between two approved artifacts and its resolution is a founder decision, recorded here when it is made. Two clean resolutions exist: move the maintenance note to position 2 (which satisfies the caption and every constraint above, at the cost of the back-to-back-friendship preference), or amend the caption's closing line.

**This constraint is deliberately not enforced by the checker yet.** Adding it while the order violates it would fail `verify-repository.mjs` on every pull request in the repository until the founder rules — a gate that blocks unrelated work is worse than a documented conflict. It goes into the checker in the same change set that resolves the conflict, and the checker's scan is widened to captions and packs at that point so this class of reference cannot hide again.

Until then the Monday staging task holds the Field Note 2 carousel rather than queueing it; the essay body carries no such reference, so the Ghost publish and newsletter are unaffected.

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
