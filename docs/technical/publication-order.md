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
| 7 | `nobody-rigs-to-the-breaking-strength` | 2026-09-29 | |
| 8 | `ask-for-help-while-its-still-cheap` | 2026-10-06 | |
| 9 | `the-lights-never-flickered` | 2026-10-13 | |
| 10 | `comparison-is-a-bad-map` | 2026-10-20 | |
| 11 | `you-can-walk-on-it-tomorrow` | 2026-10-27 | |
| 12 | `your-body-keeps-the-books` | 2026-11-03 | |
| 13 | `somebody-is-up-on-his-ladder` | 2026-11-10 | |
| 14 | `every-part-passed-inspection` | 2026-11-17 | |

## Why this order and not another

The three constraints above fix positions 3, 5, 6, and 12 relative to each other. Everything else is editorial and was decided on three grounds, recorded so a future change can disagree with them knowingly.

- **Two friendship pieces do not run back to back.** Positions 1 and 3 are both about friendship; position 2 separates them with a piece about repair.
- **The two witness pieces run late and apart.** `the-lights-never-flickered` sits at 9 and `somebody-is-up-on-his-ladder` at 13, both in the back half so a change of stance reads as deliberate rather than as the publication's default register, and four slots apart so they do not read as a series. Neither is labelled and neither is announced.
- **Build-trade openings are separated.** This is the preference that had quietly failed, and the reorder of 2026-08-26 is what fixed it.

### The reorder of 2026-08-26, and the miscount that delayed it

Positions 12, 13, and 14 were each appended in turn, each append recorded the same strain, and each deferred the fix. Appending moves nothing, which is its virtue and was here its defect: the run grew one slot at a time and no single append looked like the problem.

**The run was also undercounted.** It was recorded as four consecutive build-trade openings — rigging, concrete, gutters, machining. It was five. `the-lights-never-flickered` opens on anchor bolts set an inch and a half off a template, which is as much a jobsite fact as a lifting sling is, and it sat at position 10 directly above them. The same miscount named it as one of the pieces available to break the run, when it was one of the pieces making it.

**What the reorder does.** Five build-trade pieces need four separators to be fully spread, and the bank offers three that are unambiguously not build-trade — `ask-for-help-while-its-still-cheap`, `comparison-is-a-bad-map`, and `your-body-keeps-the-books`. Three separators is enough to reduce the longest run from five to two, and no arrangement of this bank does better. The remaining pair is 13 and 14, at the end, where the reader has the most distance from the last one.

`your-body-keeps-the-books` moved from 7 to 12 to supply the third separator. That is the only constraint-bearing piece the reorder touches, and it moved later, which the constraint allows — `rest-is-not-a-reward` must precede it and now precedes it by seven slots rather than two.

**Nothing scheduled moved.** Positions 1 and 2 are staged on Ghost and are untouched. Every position from 3 onward is a projection, and the checker proves the three binding constraints still hold — verified by breaking each one and confirming the named failure.

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

It reads the approved source, parses the frontmatter, builds the HTML, resolves the feature image, and prints the exact payloads without touching the network. This exists because of what 2026-08-24 found: the script had an unresolvable import and died on its first line in every invocation since it shipped, and everything below its argument check had never executed at all. Nothing caught that, because this register always held a scheduled slot and so the Monday task verified rather than staged, every week of the script's life. The first week the register runs dry would have been the first week the code ran — with the slot empty and no time to fix it. What the dry run proves, precisely, is the payload the real run would send, on the real note, every week. It does not exercise any of the five Ghost calls or the order they happen in — the duplicate-slug read, the upload, the create, the draft→scheduled transition that binds the newsletter, and the verify read are all still first run for real on the day they are needed. Saying otherwise would be this document claiming coverage it does not have. `scripts/test/field-note-post.test.mjs` covers the other half in CI by building a payload for every note in the bank.

**Every note carries `feature_image_alt` in its frontmatter, and the build fails without it.** Founder ruling, 2026-08-24: the agent that generates the artwork writes its alt text, and no image ships without one. A dry run reporting `alt text: MISSING` now means a real defect rather than a known gap. The descriptions are plain sentences about what the photographs show, in the register Essay 1 set — the carousel's per-slide alt text is held to the same rule, one line per slide, counted both ways.

**The script refuses a note whose frontmatter is not `status: founder-approved`, and it decides that before it uploads anything.** Staging binds a newsletter send, so the approval rule lives in `buildPostPayload` rather than in an instruction the weekly task has to remember. The payload is built and validated first and the uploaded image URL attached afterwards — the reverse order would leave an orphaned PNG in Ghost storage and a stack trace on the morning a slot is due, and `AGENTS.md` states the rule outright: validate before mutating. The publish time is checked at the same point, before any network call rather than at the transition that consumes it. It must parse, **end in `Z`**, and be at least five minutes ahead of now. The zone matters because a timestamp without one is read as local time and an 8:00 AM ET slot silently becomes a different hour. Staleness matters more: re-running last week's command hands over a well-formed instant that Ghost either refuses after the image and the draft are already made, or accepts — firing the scheduler on a past date and sending the newsletter immediately and unreviewed, which the launch-authority rule forbids.

**Two more refusals, both of which used to be this document's sentences rather than the script's behaviour.**

The script refuses a slug that already has a Ghost post. Ghost suffixes a duplicate slug instead of rejecting it, so re-running the real command for an already-staged week — typed twice, or run again because it was not clear the first one took — would create a *second* post and schedule it with the newsletter bound to everyone. Two sends of one essay, and the verification block would print a clean result for the duplicate, because it only reads back the post it just made. The check is a read, so it happens before the upload and costs the ordering nothing. "Takes the lowest-numbered note with no Ghost post" above is what the script enforces on a **real** run, rather than only what the operator is told.

**It is not enforced on the dry run, and that matters because the dry run is the weekly action.** The duplicate check is part of the network half, which `--dry-run` skips entirely — so on a verification week the operator's only invocation is the one that cannot answer the question this section sets them. A clean dry run is not evidence that the slot is unstaged; only the Ghost read in step 1 of the weekly task answers that.

The script also refuses any argument it does not recognise. `--dry-run` is the only flag; a near miss on it — `--dry-runn`, `--dryrun`, a stray space — used to survive as a **real run**, because the typo failed the flag test while both positionals stayed intact. Since the instruction above is to pass that flag every week, including weeks that stage nothing, the typo would have been made on exactly the weeks where a real run was least expected. A third positional is refused too.

**A note's own `# Metadata` section wins over anything the script would derive.** `buildPostPayload` synthesises `meta_title` as `<title> | Grown Men Grow` and `meta_description` from the dek — a convenience for the notes that approve neither. Where a note carries `- Meta title:` or `- Meta description:` under a `# Metadata` heading, those values are used instead, because `AGENTS.md` makes founder-approved copy under `content/` canonical and deriving over it is the rewrite that rule forbids. It is not cosmetic: Medium's URL importer takes `meta_title` as the headline, so this decides what a second platform publishes. The dry run labels each value `(approved, from # Metadata)` or `(derived from title)` so the two are never confused, and the corpus test fails any note whose payload would contradict a value approved inside it. Only `call-your-friends-before-theres-a-reason` carries such a section today.

**What the section may look like, and what it refuses.** The heading is matched tolerantly — any heading level, any case, extra words allowed, and the section runs to the next heading of that level or shallower — because every refusal below only fires inside a section the heading match found, so a near miss there would silently revert to the derived value. And nothing that looks like an approved value may go unread wherever it sits: if the note declares more `Meta title:` / `Meta description:` lines than the section yields, the build fails rather than deriving over them. The label may carry any bullet, any case, and bold anywhere or nowhere; a value may be wrapped across lines, and an adjacent line continues it. A **blank line ends an entry**, exactly as it ends a list item in Markdown, so an editorial aside under the bullets is its own line rather than becoming part of the meta title.

The build fails, by name, on: an empty value, the same field approved twice, two metadata headings in one note, a surviving single asterisk in a value, and a line that names a meta field but cannot be read — an unbulleted `Meta description:` after a blank line, for instance. All of those are loud on purpose. The one failure mode this parser exists to prevent is the quiet one, where founder-approved copy is silently replaced by a string the script made up.

**The builder understands four things, and refuses everything else rather than mangling it.** A paragraph, `## ` as a subheading, `**strong**`, and `*emphasis*`. Any other Markdown — a list, a blockquote, a link, `###`, a rule, a table, code, an image, raw HTML, an entity — does not break it; it survives HTML-escaped inside a paragraph, so a list ships as `- like this` in running text and a link ships as literal brackets with the href dead. That lands in a post scheduled with the newsletter bound, and a published page can be corrected afterwards while a sent newsletter cannot. So the builder throws, naming the construct and the line. The block half of that check is derived rather than listed — any line still opening with a character CommonMark reads as block markup is refused, once the supported inline markup is masked — so lists, rules of any length, blockquotes, tables, other heading levels, and setext underlines all fall out of one rule instead of needing an entry each. The inline half is enumerated, and that is a judgement stated in the code: the derived version would refuse every bracket, which rejects ordinary prose like `[sic]`. The whole approved bank is clean of all of it, and the corpus test in `scripts/test/field-note-post.test.mjs` holds every note to the same rule in CI — so a note that needs one of these fails when it is moved into `content/field-notes/`, not on the Monday it is staged. Teaching the builder a new construct is a deliberate change, not something to discover in a reader's inbox. Two subtleties are worth knowing while writing: a `## ` subheading needs a blank line **before and after** it — without the one before, the renderer keeps it inside the paragraph and prints the hashes in running text; without the one after, it swallows the paragraph below into the heading; and emphasis is written with asterisks, never underscores — `_like this_` is the other standard spelling of a construct the builder does support, so it is the easiest one to reach for by habit and it ships with the underscores visible.

**The hold check in that task still runs first and still governs** — a held week shifts every projection below it by one slot and changes nothing about the order.

Changing the order is a founder decision recorded here. The checker enforces the constraints; it does not enforce the preferences, which are stated above so a future change can disagree with them knowingly.
