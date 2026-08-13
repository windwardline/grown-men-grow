# Content Pipeline

Status: operating standard, 2026-08-13. Written after the first automated draft run delivered an essay with none of the collateral an essay needs to ship.

The unit of work is not an essay. It is a **complete field note**: the essay, the platform copy for every surface, and the imagery — delivered together, in chat, for the founder to approve in one pass. A draft without its pack cannot be scheduled, and half a unit is not progress.

## What a complete unit contains

| Artifact | Path | Notes |
|---|---|---|
| Essay source | `content/field-notes/<slug>.md` | Carries the Ghost essay, carousel slide copy, caption, alt text, visual direction, and production notes — mirror an existing note exactly |
| Platform pack | `content/distribution/field-note-NN-platforms.md` | Four sections: Medium, Bluesky, LinkedIn Page, Substack Notes |
| Source photography | `assets/source/editorial/<name>.png` | New per article; never reused across articles |
| Render script | `scripts/render-field-note-NN.mjs` | Bespoke composition with a signature mark used by no other note |
| Carousel | `assets/drafts/instagram/field-note-NN-carousel/` | 7 slides, 1080×1350 |
| Feature image | via `scripts/render-ghost-feature-images.mjs` | Add the note to its `assets` map |
| Review sheet | via `scripts/render-review-contact-sheets.mjs` | Add a sheet entry |
| Gate entries | `scripts/verify-repository.mjs` | The render script in the required list, plus a `validateAssetFamily` line |

Adding a note without its gate entries means the checker cannot see it. Add them in the same change set.

## Imagery

Images are generated in ChatGPT, in the founder's saved project **Grown Men Grow**, through Chrome. This is not optional tooling preference — that project holds the accumulated style context, and starting a fresh chat elsewhere produces images that do not match the library.

`../editorial-visual-system.md` is the authority on what the images must be. Read its Imagery, Image-generation quality gate, and Image uniqueness sections before writing a prompt. The rules that bite most often: one obvious synthetic tell rejects the whole image; imagery is unique per article and the renderers fail mechanically if a photograph strays outside its article's family; and weak generation is never rescued with grain, darkness, or an aggressive crop.

### The house prompt

Every prompt in the project follows one shape. Hold to it — the consistency is why the library looks like one publication.

> Now a [ordinal], separate image in the same editorial photography style, portrait orientation 2:3, single image. [Subject, concrete and specific]; the image suggests [the qualities it should carry]. [Setting, described as maintained and in use]. [People constraint — hands and forearms only, or no people]. Contemporary editorial photography with the polish of a major men's magazine, natural texture, restrained fine film grain, candid rather than posed. [Composition: dynamic off-center, or asymmetric, with clean negative space]. [Light], warm, optimistic, grounded. Adult subject, pristine natural anatomy, maintained welcoming setting, no logos, no readable text, no watermark. Avoid: [failure modes specific to this subject].

The `Avoid:` list is written fresh per image against what that particular subject would plausibly get wrong — decay and wilted plants for a balcony, grime and rust and macho workshop cliches for a workbench. A generic avoid list produces generic failures.

### The procedure

1. Open Chrome and confirm the extension responds. If it does not, stop image work, say so plainly at the top of the report, and deliver everything else — never quietly skip the images.
2. Open `chatgpt.com`, then the pinned **Grown Men Grow** project, then the most recent *Editorial Photography Request* thread. Continue that thread rather than starting a new one when the run needs images in an established style; start a new one in the project only when the note's family is genuinely new.
3. Send one prompt per image, waiting for each to finish before the next.
4. Download each result, then move it from `~/Downloads` into `assets/source/editorial/` with a descriptive kebab-case name matching the note's visual direction.
5. Review each at full resolution against the quality gate before it enters the repository. Reject and regenerate rather than shipping a tell.
6. Record the exact prompt and source path in the note's production notes, per the visual system's requirement.

## Delivery — how the founder approves

Everything goes in chat, in one pass, because that is where approval happens. A report that points at files is not a delivery.

1. The essay title, its stance, and a two-sentence summary of the argument.
2. **The full essay text inline.**
3. **Every platform's copy inline** — Medium subtitle and tags, all Bluesky posts, the LinkedIn post, all Substack Notes, the Instagram caption, and all seven carousel slides.
4. **The images themselves**, sent as files so they render in chat. The seven carousel slides, the feature image, and the review sheet. Not paths — the images.
5. The nine tests from `../editorial-underpinning.md`, with anything that came close to failing named rather than smoothed over.
6. What is still missing, if anything, and why.

Ask nothing. The founder reviews on their own schedule.

## Boundaries

Nothing here publishes, sends, or posts. Drafts land in `drafts/`; only the founder moves work into `content/`. Where a note is already approved and in `content/` but missing collateral, the collateral is built for it directly — that backfill takes priority over writing anything new, because an approved essay that cannot ship is a worse problem than one fewer draft.
