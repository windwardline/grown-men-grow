import {
  GREEN,
  INK,
  OXBLOOD,
  PAPER,
  PAPER_LIGHT,
  RUST,
  SANS,
  SERIF,
  SMOKE,
  defs,
  grain,
  lines,
  photo,
  portraitCanvas,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 13 — "You Can Walk on It Tomorrow".
// Signature vocabulary: a small hand-drawn strength-gain curve — a baseline, a
// line rising steeply out of it and then flattening toward an asymptote, with a
// short tick at the early point where the slab is walkable and a second, taller
// tick far out where it reaches the number it was designed for. The curve fills
// progressively across the sequence, so the second tick does not exist until the
// line has actually travelled far enough to earn it. No prior vocabularies.
//
// Photography landed 2026-08-19. The three sources are exclusive to this
// article and travel with it across its feature image and its carousel, which
// is how every other note in the bank is built: the 2026-08-16 exclusivity
// ruling governs two separately published FEED posts sharing a picture, which
// is why verify-repository.mjs scans the Instagram families and not this pair.
// Slides 2, 3, 4 and the close stay type-led so the sequence keeps mixed weight.
const SLAB = "editorial/covered-slab-curing.png";
const HOSE = "editorial/hose-wetting-fresh-pour.png";
const CRACK = "editorial/garage-floor-hairline-crack.png";

const otherArticles = ["friends-in-conversation", "repairing-wooden-chair", "sunlit-writing-table", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "morning-armchair-mug", "truck-hood-map", "compass-in-hand", "pegboard-end-of-day", "trail-fork-daylight", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread", "bp-cuff-notebook", "running-shoes-alarm", "cutting-board-vegetables", "base-plates-anchor-bolts", "punch-list-tailgate", "transfer-switch-cabinet", "restaurant-table-after-lunch", "sling-capacity-tag", "rigging-shackles-bench", "wall-calendar-kitchen", "driveway-hoop-late-afternoon"];

// `fill` runs 0 to 1 and is how far along the cure the curve has been drawn.
// The set tick sits at 0.08 — walkable almost immediately. The cure tick sits at
// 0.85 and is only drawn once the line has reached it.
function cureMark(x, y, fill, color = RUST, scale = 1) {
  const width = 132 * scale;
  const height = 74 * scale;
  const base = y + height;
  const gain = (t) => 1 - Math.exp(-3.4 * t);
  const ceiling = gain(1);
  const at = (t) => [x + width * t, base - height * (gain(t) / ceiling)];
  const drawn = Math.min(1, Math.max(0.02, fill));
  const points = [];
  for (let step = 0; step <= 30; step += 1) {
    const [px, py] = at((drawn * step) / 30);
    points.push(`${px.toFixed(1)} ${py.toFixed(1)}`);
  }
  const [setX, setY] = at(0.08);
  const [cureX, cureY] = at(0.85);
  const parts = [
    `<line x1="${x}" y1="${base}" x2="${x + width}" y2="${base}" stroke="${color}" stroke-width="${3.5 * scale}" stroke-linecap="round" opacity="0.5"/>`,
    `<polyline points="${points.join(" ")}" fill="none" stroke="${color}" stroke-width="${5 * scale}" stroke-linecap="round" stroke-linejoin="round"/>`,
    `<line x1="${setX}" y1="${setY + 10 * scale}" x2="${setX}" y2="${setY - 10 * scale}" stroke="${color}" stroke-width="${4 * scale}" stroke-linecap="round"/>`,
  ];
  // The cure tick is drawn only once the line has actually reached it.
  if (drawn >= 0.85) {
    parts.push(`<line x1="${cureX}" y1="${cureY + 13 * scale}" x2="${cureX}" y2="${cureY - 13 * scale}" stroke="${color}" stroke-width="${4 * scale}" stroke-linecap="round"/>`);
  }
  return `<g>${parts.map((part) => `\n    ${part}`).join("")}\n  </g>`;
}

const slides = [
  portraitCanvas({
    id: "fn13-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 13",
    body: `<rect x="640" y="150" width="392" height="300" fill="url(#fn13-01-dots)"/>
    ${lines(["YOU CAN WALK ON IT"], {x: 62, y: 262, size: 66, leading: 84, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["TOMORROW."], {x: 62, y: 348, size: 66, leading: 84, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${lines(["Set is not the same as cured."], {x: 64, y: 412, size: 38, leading: 50, family: SERIF, weight: 400, style: "italic", fill: SMOKE})}
    ${cureMark(858, 212, 0.08, RUST, 1.05)}
    ${photo({name: SLAB, x: 128, y: 468, width: 824, height: 732, rotation: 0.9, position: "xMidYMid", backing: GREEN, id: "fn13-01"})}
    ${tape(286, 444, 214, 4)}`,
  }),
  portraitCanvas({
    id: "fn13-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 13",
    background: PAPER,
    body: `${lines(["Concrete sets in two days", "and cures for twenty-eight."], {x: 72, y: 380, size: 62, leading: 84, family: SERIF, weight: 700})}
    <line x1="72" y1="500" x2="1008" y2="500" stroke="${OXBLOOD}" stroke-width="3"/>
    ${lines(["Set and cured are", "two different events."], {x: 74, y: 636, size: 58, leading: 78, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${cureMark(74, 940, 1, OXBLOOD, 1.9)}`,
  }),
  portraitCanvas({
    id: "fn13-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 13",
    background: OXBLOOD,
    footerColor: PAPER,
    headerColor: PAPER,
    body: `${lines(["Six weeks out,", "he says he’s fine."], {x: 70, y: 420, size: 76, leading: 96, family: SERIF, weight: 700, fill: PAPER})}
    ${lines(["He isn’t performing.", "The surface really is hard."], {x: 72, y: 720, size: 50, leading: 68, family: SERIF, weight: 400, style: "italic", fill: PAPER_LIGHT})}
    ${cureMark(72, 1004, 0.12, RUST, 1.6)}`,
  }),
  portraitCanvas({
    id: "fn13-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 13",
    body: `${lines(["He’s running", "a surface test"], {x: 78, y: 528, size: 82, leading: 104, family: SERIF, weight: 700})}
    ${lines(["on a question", "about depth."], {x: 78, y: 740, size: 82, leading: 104, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    <line x1="78" y1="892" x2="470" y2="892" stroke="${RUST}" stroke-width="4"/>`,
  }),
  portraitCanvas({
    id: "fn13-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 13",
    background: PAPER,
    body: `${photo({name: HOSE, x: 88, y: 158, width: 904, height: 762, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn13-05"})}
    ${tape(206, 136, 214, 3)}
    <rect x="66" y="978" width="948" height="236" fill="${PAPER_LIGHT}" transform="rotate(0.6 540 1096)"/>
    <text x="98" y="1046" fill="${INK}" font-family="${SERIF}" font-size="50" font-weight="700" transform="rotate(0.6 540 1096)">It doesn’t dry. It cures —</text>
    <text x="98" y="1108" fill="${OXBLOOD}" font-family="${SERIF}" font-size="46" font-style="italic" transform="rotate(0.6 540 1096)">and the reaction needs the water</text>
    <text x="98" y="1166" fill="${OXBLOOD}" font-family="${SERIF}" font-size="46" font-style="italic" transform="rotate(0.6 540 1096)">kept in it.</text>
    ${cureMark(834, 1236, 0.34, RUST, 1)}`,
  }),
  portraitCanvas({
    id: "fn13-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 13",
    background: INK,
    footerColor: PAPER,
    headerColor: PAPER,
    // Skeleton inverted against slide 5 on purpose — type above, photograph
    // below — so two consecutive image-led slides do not share a shape. The
    // photograph runs large because a hairline crack that cannot be read is
    // just a grey floor.
    body: `${lines(["Load it early and it rarely", "fails on the spot."], {x: 66, y: 258, size: 58, leading: 76, family: SERIF, weight: 700, fill: PAPER})}
    ${lines(["It takes hairline cracks and a lower ceiling,", "and you meet them years later, under", "something ordinary."], {x: 68, y: 396, size: 40, leading: 54, family: SERIF, weight: 400, style: "italic", fill: PAPER_LIGHT})}
    ${cureMark(852, 214, 0.22, RUST, 1)}
    ${photo({name: CRACK, x: 74, y: 592, width: 932, height: 596, rotation: -0.6, position: "xMidYMid", backing: RUST, id: "fn13-06"})}
    ${tape(268, 570, 224, 3)}`,
  }),
  portraitCanvas({
    id: "fn13-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 13",
    body: `<rect x="0" y="184" width="1080" height="6" fill="${OXBLOOD}"/>
    ${lines(["Nobody prints your", "twenty-eight days."], {x: 68, y: 402, size: 70, leading: 90, family: SERIF, weight: 700})}
    ${lines(["There is no chart. Anyone", "offering the number is", "selling something."], {x: 70, y: 596, size: 48, leading: 66, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    <rect x="0" y="856" width="1080" height="6" fill="${RUST}"/>
    ${lines(["It needs a month,", "and it needs to not dry out."], {x: 68, y: 980, size: 54, leading: 74, family: SERIF, weight: 700})}
    ${cureMark(68, 1116, 1, GREEN, 2)}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The phrase carried here is
// an observation rather than the headline, which is what the Marginalia family
// is for.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn13-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="0" y="0" width="404" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: SLAB, x: 452, y: 96, width: 714, height: 812, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn13-feature"})}
  ${photo({name: CRACK, x: 1194, y: 224, width: 306, height: 610, rotation: -1.5, position: "xMidYMid", backing: OXBLOOD, id: "fn13-feature"})}
  ${tape(560, 72, 224, 3)}
  ${tape(1258, 200, 186, -4)}
  ${cureMark(96, 214, 0.08, PAPER, 1.5)}
  ${lines(["TWO DAYS"], {x: 96, y: 386, size: 28, leading: 38, family: SANS, weight: 900, tracking: 3, fill: PAPER})}
  ${cureMark(96, 640, 1, RUST, 1.5)}
  ${lines(["TWENTY-EIGHT DAYS"], {x: 96, y: 812, size: 28, leading: 38, family: SANS, weight: 900, tracking: 3, fill: PAPER})}
  ${grain(1600, 1000, "fn13-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 13 composes editorial/${name}.png, which belongs to another article.`);
  }
}
// Every photograph generated for this note must actually appear. A source that
// is banked, documented, and then silently composed out is the quiet way an
// article ends up reusing another's imagery later because "there wasn't enough".
for (const source of [SLAB, HOSE, CRACK]) {
  if (!all.includes(`/assets/source/${source}`)) {
    throw new Error(`Field Note 13 banked ${source} but composes it nowhere.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-13-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "you-can-walk-on-it-tomorrow", feature);

console.log("Rendered the Field Note 13 feature image and seven carousel SVG and PNG pairs.");
