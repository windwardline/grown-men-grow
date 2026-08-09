# Editorial Visual System

Status: cross-surface system and custom-theme build approved. The collage-led replacement set is ready for founder review. Nothing is authorized for public use.

## Objective

Make Grown Men Grow feel like an original editorial publication on Ghost and Instagram. The writing remains primary. Art direction gives each piece tension, pace, and an unmistakable point of view without copying another publication's trade dress.

The approved voice and launch copy do not change as part of this work.

## Locked visual character

- Adult, restrained, tactile, and confident.
- Masculine without alpha-status shorthand, luxury cosplay, or grievance cues.
- High contrast and visually assertive, but never loud for its own sake.
- Constructive, warm, and alive. Growth must read as present-tense possibility, not recovery staged as despair.
- One coherent publication identity with materially different compositions by story and surface.
- Photography and illustration serve the argument. They do not merely decorate text.

## Core system

### Color

| Role | Value | Use |
|---|---|---|
| Oxblood | `#3A1518` | Primary brand field, rules, selected headlines, and CTAs |
| Paper | `#EEE6D8` | Warm reading ground and typographic cards |
| Ink | `#121416` | Body copy, dark fields, and high-contrast structure |
| Rust | `#9A493F` | Small editorial accents only |
| Smoke | `#71706B` | Folios, metadata, and secondary labels |

Oxblood, Paper, and Ink remain dominant. Rust and Smoke add depth without turning the brand into a five-color template.

### Type

- Display serif: Bodoni Moda, tightly set for feature titles and large quotations.
- Condensed grotesk: Barlow Condensed for the publication name, folios, labels, navigation, captions, and selected social headlines.
- Reading face: Source Serif 4 at a calm long-form measure.
- Scale changes by surface. Hierarchy, not one fixed lockup, creates recognition.

The Ghost theme bundles the three open-source families. Social renderers use system stand-ins where the rasterizer cannot load the theme fonts. No paid font service or remote font request is required.

### Imagery

- Original editorial portraits, documentary details, still life, interiors, and restrained illustration.
- Ordinary environments rendered with care: maintained plaster, warm wood, useful objects, healthy plants, daylight, hands at work, conversation, and forward motion.
- Natural skin and texture. Signs of use may remain visible; neglect, decay, and poverty-coded distress do not stand in for depth.
- Bright and open imagery should lead the system. Oxblood and Ink provide graphic weight without pulling every photograph into darkness.
- Negative space is composed for titles and crops; copy does not cover a face.
- Avoid gyms, boxing shorthand, weapons, cigars, whiskey, watches, sports cars, shirtless dominance, staged therapy, lonely brooding, dilapidated rooms, and polished corporate-stock behavior.

### Image-generation quality gate

- Hyperreal generated imagery is acceptable only when it survives full-resolution review as a believable commissioned photograph.
- Hands, tools, furniture, reflections, architecture, shadows, fabric, depth of field, and object continuity must all make physical sense. One obvious synthetic tell rejects the entire image.
- Avoid generic model casting, showroom-perfect rooms, excessive bokeh, cinematic blue-orange grading, waxy skin, over-sharpened eyes, symbolic isolation, and implausibly arranged props.
- Use generated people sparingly. Real founder-shot video or photography is preferred whenever the human presence itself is the point.
- Do not attempt to hide weak generation with grain, darkness, distressed texture, or an aggressive crop.
- Record the exact generation prompt, source path, disposition, and any consuming assets. Composition studies are not launch assets.

### Editorial devices

- Asymmetric grids.
- Full-bleed and edge crops.
- Folios, issue numbers, and restrained publication labels.
- Hairline rules, occasional heavy rules, pull quotes, drop caps, marginal notes, and image breaks.
- Paper texture or grain used lightly enough to preserve type clarity.
- Deliberate empty space. Not every area needs text.

### Collage system

Photography is source material, not a finished post by itself. Visible paper edges, tape, offset blocks, halftone fields, pencil marks, irregular crops, and changes in scale give the work a made-by-hand editorial character.

The material vocabulary stays consistent. The composition does not. Rotate image dominance, crop, color field, headline position, paper treatment, and pacing among posts. No two consecutive feed covers should share the same skeleton. Texture must add energy without making the work look distressed, nostalgic, or damaged.

Collage is the default launch treatment because it reduces dependence on synthetic perfection and makes authorship visible. Straight photography remains available when a source image is strong enough to carry a surface without camouflage.

## Content families

The system must not become one template with new words.

| Family | Primary visual behavior | Typical use |
|---|---|---|
| Field Note | Image-led, cinematic, large title, quiet metadata | Weekly Ghost essay, launch Reel cover, feature post |
| Recognition | Documentary crop or object detail with prose-led carousel pacing | Accountability, shame, repair, friendship |
| Marginalia | Typographic, spare, abrupt scale shifts, no required photograph | One thought, quotation, or brief observation |
| Dispatch | Vertical image sequence, motion, close crops, minimal text | Stories and behind-the-piece material |
| Conversation | Direct-to-camera or voice-led, clean captions, face left unobstructed | Reels and occasional founder-led explanation |

In a representative twelve-post run, aim for four image-led features, three typographic pieces, three documentary or detail-led carousels, and two motion or portrait-led posts. This is a variation check, not a publishing quota.

## Surface rules

### Ghost

- Homepage: one dominant current feature, a strong publication statement, visible membership entry, and a paced archive rather than a uniform card grid.
- Essay opening: feature image, title, dek, byline, and date compose as one editorial spread.
- Essay body: generous reading measure, selective drop cap, image breaks, pull quotes, differentiated section headings, and one restrained signup interruption.
- Author treatment: Grown Men Grow remains primary. Michael Peacock appears as the credited writer at secondary scale.
- Start Here and About: page-specific art direction rather than generic article chrome.
- Social previews: title-first at small sizes with image crops designed for 1200 by 630.

Unmodified Source can support clean typography, feature images, and simple layout choices. It cannot carry this full composition system. The recommended implementation is a small original Ghost theme maintained in this repository. It adds no platform or paid service. Theme activation remains a separate founder-controlled live action.

### Instagram feed

- Feed artwork uses native 1080 by 1350 composition, not a cropped Story or Ghost card.
- The publication mark and folio system may recur, but their placement and scale should move.
- Covers communicate one idea at thumbnail size.
- The face, central object, or critical image detail remains unobstructed.
- Captions carry discovery language naturally. Artwork is not a keyword field.

### Carousels

- Pace the sequence like magazine pages: opening image or premise, developed thought, visual interruption, pressure point, and earned close.
- Mix image-led, type-led, and quiet slides within one carousel.
- Do not put every sentence in a centered box.
- Keep approved wording exact when adapting an approved piece.

### Stories and Reels

- Stories receive 1080 by 1920 crops and their own safe-area composition.
- Motion may be slow and editorial: crop movement, type reveal, page turn, light shift, or restrained grain.
- Reel covers remain legible in both the profile grid crop and the full Reels surface.
- Burned-in captions are mandatory for spoken video. Decorative text never competes with captions.

## Accessibility and production controls

- Maintain strong text contrast and mobile legibility.
- Keep critical feed content inside crop-safe margins.
- Provide honest alt text for meaningful imagery; do not stuff it with search terms.
- Preserve semantic Ghost headings and one H1 per page.
- Export responsive web imagery through Ghost's image helpers in the theme.
- Retain editable SVG or source artwork and the final platform PNG for every published asset.
- Record the image-generation prompt and source path for every generated photograph or illustration.

## Approved launch set

The current concept package is under `assets/concepts/editorial-collage-v1/`:

- Ghost feature hero
- Instagram feed cover
- Carousel interior spread
- Story cover
- Social-sharing card

The complete replacement set is under `assets/drafts/`, with five contact sheets under `assets/drafts/review/`. Title-free Ghost feature images are under `assets/drafts/ghost/feature-images/`. The package uses only approved launch copy and was approved for staging and launch on 2026-08-08. Live rendering still must pass the release checklist.

## Implementation status

1. [x] Approve the editorial system and original Ghost theme build.
2. [x] Build and locally validate the theme against Ghost's current theme contract.
3. [x] Regenerate the complete launch asset set in distinct content families.
4. [x] Review local Ghost desktop and phone fixtures.
5. [x] Prepare the complete Instagram feed, carousel, Story, Reel, and Ghost social-card contact sheets.
6. [x] Founder approved the collage-led replacement set on 2026-08-08.
7. [ ] Stage the approved theme and assets in private Ghost.
8. [ ] Review private Ghost desktop, phone, email, search, and social previews.
9. [ ] Preserve Source and the prior export as rollback material.
10. [x] Founder authorized Ghost web and Instagram launch changes after the technical gates pass; newsletter delivery remains separately gated.
