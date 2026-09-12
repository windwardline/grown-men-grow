# Substack notes register

What actually went out on Substack, reconciled against the live profile feed by
`scripts/verify-substack-notes.mjs`.

**This exists because the log was wrong twice.** Until 2026-09-12 the only record
of whether a note was posted was prose in `handoff-log.md`, written by whoever
ran the note task. That task hands the copy to the founder and finishes; the
founder posts minutes later. So the entry asserts a terminal outcome while the
outcome is still pending, and on both 2026-09-08 and 2026-09-12 it merged to
`main` saying "nothing posted" shortly before a note went out. Each time a
correction entry followed, and each time it followed because a person happened
to be watching. Nothing could have detected either on its own.

The checker reconciles in **both** directions. A row claiming `posted` must name
a note the feed carries, and the live text must equal the pack's approved copy
byte-for-byte. A row claiming `missed`, or still blank, must have **no** live
note carrying its copy — that is the direction that was wrong in `main`, and it
is the reason the check is not merely a presence test.

The feed is public and needs no credential, so this runs in CI as well as
locally. An unreachable feed fails closed: an unread feed is not an empty one.

## Columns

- **Essay** — the canonical slug, which resolves the distribution pack.
- **Note** — the note number inside that pack's `# Substack Notes` section.
- **Slot (ET)** — the scheduled slot from `publish-timing.md`: Note 1 Tuesday
  12:00, Note 2 Saturday 18:30 (09:30 before the 2026-08-30 move). An em dash
  means the note had no scheduled slot, which is true of launch week only.
- **State** — `posted`, `missed`, or blank for a slot that has not come yet.
- **Permalink** — the note id, `c-<id>`, required on every `posted` row.

## Register

| Essay | Note | Slot (ET) | State | Permalink |
|---|---|---|---|---|
| `strength-has-to-grow-up` | 1 | — | posted | `c-312749789` |
| `strength-has-to-grow-up` | 2 | — | posted | `c-316146997` |
| `call-your-friends-before-theres-a-reason` | 1 | 2026-08-18 12:00 | posted | `c-317395608` |
| `call-your-friends-before-theres-a-reason` | 2 | 2026-08-22 09:30 | missed |  |
| `a-confession-can-still-be-selfish` | 1 | 2026-08-25 12:00 | posted | `c-322382776` |
| `a-confession-can-still-be-selfish` | 2 | 2026-08-29 09:30 | missed |  |
| `friendship-has-a-maintenance-schedule` | 1 | 2026-09-01 12:00 | missed |  |
| `friendship-has-a-maintenance-schedule` | 2 | 2026-09-05 18:30 | missed |  |
| `rest-is-not-a-reward` | 1 | 2026-09-08 12:00 | posted | `c-332603638` |
| `rest-is-not-a-reward` | 2 | 2026-09-12 18:30 | posted | `c-335779365` |

## What the rows say, as of 2026-09-12

Six of ten notes posted. The two launch-week notes had no slot to be late
against. Of the eight that did, four went out and four were missed, and the four
misses have three distinct causes: the old 09:30 Saturday slot that could not
fire (two), a lateness guard correctly refusing a slot 378 minutes gone (one),
and a classifier refusal at the composer after a clean handover (one).

**Every note that has ever gone out went out with a person at the keyboard.**
That is the standing observation this register was built to make measurable
rather than arguable, and it is the evidence behind the open founder question:
authorize a keystroke mechanism for the composer, or record the Substack slots
as founder-run rather than scheduled.

Lateness is reported by the checker, never failed on — it is a fact about a
human's evening, not a defect. The figures it derives are the baseline the
Friday analytics task reads.

## Backfill provenance

Rows were not typed from memory. Every live note was matched to its pack by
comparing the feed's text against `extractNote()` output for each pack and note
number, so the six `posted` rows are the six the feed carries and their pack
assignment is derived rather than asserted. Slots come from `publish-timing.md`;
the four `missed` rows are the slots that passed with no matching live note, and
the checker re-derives that claim on every run.
