# Editorial Visual System

Status: representative direction prepared; founder approval required before full propagation or any live change.

## Objective

Make Grown Men Grow feel like an original editorial publication on Ghost and Instagram. The writing remains primary. Art direction gives each piece tension, pace, and an unmistakable point of view without copying another publication's trade dress.

The approved voice and launch copy do not change as part of this work.

## Locked visual character

- Adult, restrained, tactile, and confident.
- Masculine without alpha-status shorthand, luxury cosplay, or grievance cues.
- High contrast and visually assertive, but never loud for its own sake.
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

- Display serif: high-contrast, tightly set, used for feature titles and large quotations.
- Condensed grotesk: publication name, folios, labels, navigation, captions, and selected social headlines.
- Reading face: calm and highly legible at long-form sizes.
- Scale changes by surface. Hierarchy, not one fixed lockup, creates recognition.

The concept renderer uses local system fonts as stand-ins. A Ghost theme implementation should bundle approved open-source web fonts so the published result is stable and does not require a paid font service.

### Imagery

- Original editorial portraits, documentary details, still life, interiors, and restrained illustration.
- Ordinary environments rendered with care: plaster, wood, worn fabric, window light, weather, hands, rooms, thresholds, and useful objects.
- Natural skin and texture. Imperfection stays visible.
- Negative space is composed for titles and crops; copy does not cover a face.
- Avoid gyms, boxing shorthand, weapons, cigars, whiskey, watches, sports cars, shirtless dominance, staged therapy, and polished corporate-stock behavior.

### Editorial devices

- Asymmetric grids.
- Full-bleed and edge crops.
- Folios, issue numbers, and restrained publication labels.
- Hairline rules, occasional heavy rules, pull quotes, drop caps, marginal notes, and image breaks.
- Paper texture or grain used lightly enough to preserve type clarity.
- Deliberate empty space. Not every area needs text.

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

## Representative concept set

The first concept package is under `assets/concepts/editorial-v1/`:

- Ghost feature hero
- Instagram feed cover
- Carousel interior spread
- Story cover
- Social-sharing card

The package uses only approved Essay 1 copy. It is for review and is not authorized for publication or posting.

## Implementation sequence after approval

1. Approve or revise the representative direction.
2. Approve a custom Ghost theme as the replacement for unmodified Source.
3. Build and locally validate the theme against Ghost's current theme contract.
4. Regenerate the complete launch asset set in distinct content families.
5. Review Ghost desktop, phone, email, search, and social previews.
6. Review the complete Instagram feed, carousel, Story, and Reel exports in chat.
7. Stage the approved theme and assets privately.
8. Preserve the existing Source configuration and prior exports as rollback material.
9. Make no public change until the separate launch gates are authorized.
