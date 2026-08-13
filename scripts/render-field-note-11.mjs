import {
  GREEN,
  INK,
  OXBLOOD,
  PAPER,
  PAPER_LIGHT,
  RUST,
  SANS,
  SERIF,
  defs,
  grain,
  lines,
  photo,
  portraitCanvas,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 11 — "The Lights Never Flickered".
// Signature vocabulary: a small hand-drawn two-position transfer switch — a
// lever pivoting between two contacts. It rests on the first contact early,
// catches mid-throw at the turn, and settles on the second by the close, so the
// mark carries the essay's argument across the sequence rather than decorating
// it. No prior vocabularies.
const PLATES = "editorial/base-plates-anchor-bolts.png";
const PUNCH = "editorial/punch-list-tailgate.png";
const SWITCH = "editorial/transfer-switch-cabinet.png";
const TABLE = "editorial/restaurant-table-after-lunch.png";

const otherArticles = ["friends-in-conversation", "repairing-wooden-chair", "sunlit-writing-table", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "morning-armchair-mug", "truck-hood-map", "compass-in-hand", "pegboard-end-of-day", "trail-fork-daylight", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread", "bp-cuff-notebook", "running-shoes-alarm", "cutting-board-vegetables"];

// `throwPosition` runs 0 (resting on the first contact) to 1 (settled on the
// second). 0.5 catches the lever mid-throw, which is where the essay turns.
function switchMark(x, y, throwPosition, color = RUST, scale = 1) {
  const s = scale;
  const span = 96 * s;
  const pivotX = x + span / 2;
  const pivotY = y + 58 * s;
  const contactRadius = 9 * s;
  const leverLength = 62 * s;
  const angle = -140 + throwPosition * 100;
  const radians = (angle * Math.PI) / 180;
  const tipX = pivotX + Math.cos(radians) * leverLength;
  const tipY = pivotY + Math.sin(radians) * leverLength;
  const seated = throwPosition <= 0.02 || throwPosition >= 0.98;
  return `<g>
    <line x1="${x}" y1="${y}" x2="${x + span}" y2="${y}" stroke="${color}" stroke-width="${4 * s}" stroke-linecap="round" opacity="0.55"/>
    <circle cx="${x}" cy="${y}" r="${contactRadius}" fill="none" stroke="${color}" stroke-width="${4 * s}"/>
    <circle cx="${x + span}" cy="${y}" r="${contactRadius}" fill="none" stroke="${color}" stroke-width="${4 * s}"/>
    ${seated ? `<circle cx="${throwPosition < 0.5 ? x : x + span}" cy="${y}" r="${contactRadius - 3 * s}" fill="${color}"/>` : ""}
    <line x1="${pivotX}" y1="${pivotY}" x2="${tipX}" y2="${tipY}" stroke="${color}" stroke-width="${6 * s}" stroke-linecap="round"/>
    <circle cx="${pivotX}" cy="${pivotY}" r="${6 * s}" fill="${color}"/>
  </g>`;
}

const slides = [
  portraitCanvas({
    id: "fn11-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 11",
    body: `${lines(["THE LIGHTS"], {x: 64, y: 250, size: 82, leading: 96, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["NEVER FLICKERED."], {x: 64, y: 364, size: 82, leading: 96, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${switchMark(848, 214, 0, RUST, 1.25)}
    ${photo({name: PLATES, x: 150, y: 440, width: 800, height: 760, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn11-01"})}
    ${tape(260, 416, 210, -4)}`,
  }),
  portraitCanvas({
    id: "fn11-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 11",
    background: PAPER,
    body: `${lines(["The bolts get set an inch", "and a half off, and in the", "wrong direction."], {x: 72, y: 320, size: 66, leading: 86, family: SERIF, weight: 700})}
    ${lines(["The base plates come off the truck", "and do not go down over the bolts."], {x: 74, y: 660, size: 50, leading: 68, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${switchMark(766, 886, 0, OXBLOOD, 1.05)}`,
  }),
  portraitCanvas({
    id: "fn11-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 11",
    body: `${lines(["He drives in Monday", "with the sentence ready."], {x: 90, y: 470, size: 74, leading: 92, family: SERIF, weight: 700})}
    ${lines(["He intends to be fired", "with some dignity about it."], {x: 92, y: 720, size: 62, leading: 80, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${switchMark(92, 900, 0, INK, 1)}`,
  }),
  portraitCanvas({
    id: "fn11-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 11",
    background: PAPER,
    body: `${photo({name: PUNCH, x: 96, y: 160, width: 888, height: 780, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn11-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1010" width="936" height="176" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1098)"/>
    <text x="102" y="1084" fill="${INK}" font-family="${SERIF}" font-size="50" font-weight="700" transform="rotate(-0.5 540 1098)">He is told to go finish</text>
    <text x="102" y="1148" fill="${INK}" font-family="${SERIF}" font-size="50" font-weight="700" transform="rotate(-0.5 540 1098)">the punch list on the other job.</text>`,
  }),
  portraitCanvas({
    id: "fn11-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 11",
    body: `${photo({name: SWITCH, x: 130, y: 130, width: 820, height: 740, rotation: -1, position: "xMidYMid", backing: GREEN, id: "fn11-05"})}
    ${tape(300, 108, 200, 3)}
    ${lines(["The power drops, the switch throws,", "the load lands somewhere else."], {x: 72, y: 960, size: 52, leading: 70, family: SERIF, weight: 700})}
    ${lines(["One tube stutters.", "The desks keep typing."], {x: 74, y: 1112, size: 50, leading: 66, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}`,
  }),
  portraitCanvas({
    id: "fn11-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 11",
    background: PAPER,
    body: `<rect x="88" y="220" width="904" height="820" fill="${PAPER_LIGHT}" transform="rotate(-0.8 540 630)"/>
    ${tape(200, 196, 220, -4)}
    ${lines(["Anyone who has worked a trade", "has heard a version of this,", "details swapped."], {x: 150, y: 400, size: 56, leading: 74, family: SERIF, weight: 700})}
    ${lines(["The number changes.", "The eleven days do not."], {x: 150, y: 680, size: 62, leading: 80, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${switchMark(700, 900, 0.5, RUST, 1.1)}`,
  }),
  portraitCanvas({
    id: "fn11-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 11",
    body: `${photo({name: TABLE, x: 130, y: 150, width: 820, height: 700, rotation: 1.1, position: "xMidYMid", backing: OXBLOOD, id: "fn11-07"})}
    ${tape(330, 128, 200, 4)}
    ${lines(["Her father skipped his draw in August", "and again in September."], {x: 72, y: 950, size: 48, leading: 66, family: SERIF, weight: 700})}
    ${lines(["Then somebody starts", "arguing about the parking."], {x: 74, y: 1090, size: 52, leading: 70, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${switchMark(788, 1230, 1, GREEN, 1.05)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn11-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1160" y="0" width="440" height="1000" fill="${PAPER}"/>
  ${photo({name: PLATES, x: 130, y: 90, width: 730, height: 820, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn11-feature"})}
  ${photo({name: SWITCH, x: 890, y: 210, width: 500, height: 640, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn11-feature"})}
  ${tape(240, 66, 220, -4)}
  ${tape(990, 186, 190, 4)}
  ${switchMark(1396, 150, 0, RUST, 1.25)}
  ${switchMark(1396, 830, 1, GREEN, 1.1)}
  ${grain(1600, 1000, "fn11-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 11 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-11-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-lights-never-flickered", feature);

console.log("Rendered the Field Note 11 feature image and seven carousel SVG and PNG pairs.");
