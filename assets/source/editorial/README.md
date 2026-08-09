# Editorial image sources

These private working sources support the approved editorial redesign. The founder approved their use inside the final collage-led launch compositions on 2026-08-08. Do not publish a source study as standalone documentary photography or reuse it outside an approved, full-resolution-reviewed composition.

## Quality standard

Hyperreal generated imagery must pass the full-resolution believability gate in `docs/editorial-visual-system.md`. The image world is constructive, warm, maintained, and alive. Darkness, dilapidation, staged despair, and obvious synthetic artifacts are rejection conditions.

## Current composition studies

### `repairing-wooden-chair.png`

- Status: composition study; not a final launch asset
- Consumers: `scripts/render-editorial-collage-concepts.mjs`, `scripts/render-ghost-feature-images.mjs`, `scripts/render-launch-graphics.mjs`, and `scripts/render-instagram-pinned-intro.mjs` through `scripts/lib/editorial-collage.mjs`
- Built-in image generation prompt:

  > Use case: photorealistic-natural
  >
  > Asset type: original editorial photograph for a sophisticated independent magazine, adaptable to a vertical Instagram carousel and a wide Ghost crop
  >
  > Primary request: an adult man restoring a well-made wooden dining chair in a bright home workshop, tightening a joint with a hand tool; the image should suggest attention, patience, repair, and useful competence
  >
  > Scene/backdrop: clean, lived-in work area beside a large window, healthy houseplants, orderly shelves, warm wood and off-white plaster in good condition; aspirational through care, not luxury
  >
  > Subject: capable hands and forearms at work, natural skin and ordinary clothing, chair and tool clearly readable, no face required
  >
  > Style/medium: contemporary editorial photography with the polish of a major men's magazine, natural texture, restrained fine film grain, candid rather than posed
  >
  > Composition/framing: portrait orientation, dynamic off-center composition with ample clean negative space; preserve useful crops at 4:5, 9:16, and 16:9
  >
  > Lighting/mood: clear late-morning daylight, warm, optimistic, grounded, quietly energetic; luminous paper-toned highlights and natural color
  >
  > Constraints: adult subject; pristine anatomy; home is maintained and welcoming; no logos; no text; no watermark
  >
  > Avoid: peeling paint, decay, grime, darkness, lonely or mournful mood, rustic poverty cues, macho workshop clichés, luxury signaling, watches as status symbols, cigars, alcohol, gym imagery, glossy stock-photo smiles

### `sunlit-writing-table.png`

- Status: composition study; not a final launch asset
- Consumers: `scripts/render-editorial-collage-concepts.mjs`, `scripts/render-ghost-feature-images.mjs`, `scripts/render-launch-graphics.mjs`, and `scripts/render-instagram-pinned-intro.mjs` through `scripts/lib/editorial-collage.mjs`
- Built-in image generation prompt:

  > Use case: photorealistic-natural
  >
  > Asset type: original editorial still-life photograph for a sophisticated independent magazine, adaptable to Instagram and Ghost layouts
  >
  > Primary request: a bright, thoughtfully composed writing table that feels actively used: an open unlined notebook with no visible writing, a sharpened pencil, a plain ceramic cup, reading glasses, and a healthy green plant reaching toward an open window
  >
  > Scene/backdrop: well-kept lived-in apartment in late morning, warm wood, clean off-white wall, fresh air moving a light curtain; refined through attention rather than expense
  >
  > Subject: the table and ordinary objects, suggesting reflection that leads back into life and action
  >
  > Style/medium: contemporary magazine still-life photography, tactile natural materials, crisp but not sterile, subtle film grain
  >
  > Composition/framing: portrait orientation, asymmetric editorial composition with a broad clean area of wall and window light for typography; preserve useful crops at 4:5, 9:16, and 16:9
  >
  > Lighting/mood: abundant soft daylight, optimistic, clear, calm, and alive; warm paper highlights with small deep-red accents from one modest object
  >
  > Constraints: room is maintained and welcoming; notebook pages are blank; no people; no logos; no readable text; no watermark
  >
  > Avoid: peeling paint, decay, clutter, gloom, memorial or abandoned-room cues, luxury catalog styling, staged self-help props, whiskey, cigars, watches, weapons, heavy shadows, desaturated despair

### `friends-in-conversation.png`

- Status: composition study; not a final launch asset
- Consumers: `scripts/render-editorial-collage-concepts.mjs`, `scripts/render-ghost-feature-images.mjs`, `scripts/render-launch-graphics.mjs`, and `scripts/render-instagram-pinned-intro.mjs` through `scripts/lib/editorial-collage.mjs`
- Built-in image generation prompt:

  > Use case: photorealistic-natural
  >
  > Asset type: original editorial photograph for a sophisticated independent magazine, adaptable to a vertical Instagram carousel and Ghost article imagery
  >
  > Primary request: two adult male friends in an easy, substantive conversation on broad front steps in daylight; one is listening with real attention while the other makes a small natural gesture, and both look engaged rather than troubled
  >
  > Scene/backdrop: well-kept urban neighborhood with mature trees, warm brick, clean steps, bicycles and ordinary life softly out of focus; cared-for but not affluent or staged
  >
  > Subject: two men in simple well-fitting everyday clothes, different ages or backgrounds welcome, natural posture and expressions, friendship without performance
  >
  > Style/medium: candid contemporary editorial photography with the polish and composition of a major men's magazine, natural skin and fabric texture, restrained fine film grain
  >
  > Composition/framing: portrait orientation, medium-wide asymmetric frame; subjects placed low and to one side with sunlit architecture or greenery providing clean negative space; preserve useful 4:5 and 16:9 crops
  >
  > Lighting/mood: bright open shade in late morning, warm, intelligent, alive, and quietly hopeful; genuine connection without forced laughter
  >
  > Constraints: adults; natural anatomy; well-maintained environment; no logos; no text; no watermark
  >
  > Avoid: dusk, heavy shadows, despair, crisis counseling, staged hand-on-shoulder sympathy, performative hugging, beer, cigars, suits, gym or sports cues, macho posing, luxury signaling, glossy stock-photo grins

## Rejected studies

Three earlier dusk-heavy studies were rejected and removed from the repository because distressed walls, isolation, and dark staging communicated decline rather than building, repair, and growth.

## Planned studies — pending generation quota (2026-08-09)

The founder ruled that no photograph may appear on more than one surface and that the fix for repetition is a growing library of newly generated photography, with collage-rich compositions restored once these exist. Four prompts are validated (`mmx image generate`, model `image-01`, aspect 2:3, dry-run confirmed) and blocked only on MiniMax token-plan quota; the founder controls the top-up. Planned assignments keep the friends photograph exclusive to the Essay 1 body:

- `cooking-breakfast-together.png` — two friends cooking breakfast in a bright kitchen; planned About dominant. Prompt: house structure; candid two-figure domestic scene, late-morning daylight, friendship without performance; avoid staged laughter, gloom, luxury, alcohol.
- `doorway-running-shoes.png` — still life, cared-for running shoes by a front door in morning light; planned Start Here inset (threshold and forward motion). No people; one deep-red accent; avoid gym cues and branding.
- `balcony-plant-care.png` — hands repotting a healthy plant on a bright balcony; planned About inset (patience and care). Hands and forearms only; avoid wilted plants and catalog staging.
- `workbench-hand-tools.png` — still life, tidy workbench with maintained hand tools and warm hardwood; planned Essay 1 inset (competence and work in progress). No people; avoid grime, rust, macho cliches.

Each generated study must pass the full-resolution believability gate before entering this directory, and its final prompt is recorded here in full at that point.
