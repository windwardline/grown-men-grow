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

// Field Note 9 — "Comparison Is a Bad Map".
// Signature vocabulary: a hand-drawn dashed path that loops back to its own
// start — the only useful comparison runs against yourself. No prior vocabularies.
const BEDS = "editorial/garden-beds-two-heights.png";
const ODOMETER = "editorial/car-odometer-daylight.png";
const PHOTOS = "editorial/photos-notebook-spread.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "pegboard-end-of-day", "morning-armchair-mug", "truck-hood-map", "trail-fork-daylight", "compass-in-hand", "bp-cuff-notebook"];

function dashedLoop(x, y, color = RUST, scale = 1) {
  const s = scale;
  return `<path d="M${x} ${y} c ${70 * s} ${-52 * s} ${150 * s} ${-24 * s} ${138 * s} ${34 * s} c ${-10 * s} ${48 * s} ${-96 * s} ${58 * s} ${-124 * s} ${16 * s} c ${-18 * s} ${-27 * s} ${-6 * s} ${-38 * s} ${-14 * s} ${-50 * s}" fill="none" stroke="${color}" stroke-width="${6 * s}" stroke-linecap="round" stroke-dasharray="${16 * s} ${13 * s}"/>
  <circle cx="${x}" cy="${y}" r="${8 * s}" fill="${color}"/>`;
}

const slides = [
  portraitCanvas({
    id: "fn9-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 09",
    body: `${lines(["COMPARISON IS"], {x: 64, y: 250, size: 86, leading: 100, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["A BAD MAP."], {x: 64, y: 364, size: 86, leading: 100, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${dashedLoop(830, 220, RUST, 1.3)}
    ${photo({name: BEDS, x: 150, y: 440, width: 800, height: 760, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn9-01"})}
    ${tape(260, 416, 210, -4)}`,
  }),
  portraitCanvas({
    id: "fn9-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 09",
    background: PAPER,
    body: `${lines(["Two garden beds,", "one street.", "One is taller."], {x: 72, y: 320, size: 80, leading: 96, family: SERIF, weight: 700})}
    ${lines(["The difference is real.", "There are no instructions in it."], {x: 74, y: 700, size: 54, leading: 72, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${dashedLoop(760, 950, OXBLOOD, 1)}`,
  }),
  portraitCanvas({
    id: "fn9-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 09",
    body: `${lines(["You’re reading someone", "else’s odometer and", "calling it a route."], {x: 90, y: 500, size: 82, leading: 100, family: SERIF, weight: 700, style: "italic"})}
    ${dashedLoop(92, 880, INK, 1)}`,
  }),
  portraitCanvas({
    id: "fn9-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 09",
    background: PAPER,
    body: `${photo({name: ODOMETER, x: 96, y: 160, width: 888, height: 780, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn9-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1000" width="936" height="110" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1055)"/>
    <text x="102" y="1074" fill="${INK}" font-family="${SERIF}" font-size="46" font-weight="700" transform="rotate(-0.5 540 1055)">A man steering by other men isn’t going</text>
    <rect x="72" y="1128" width="936" height="104" fill="${GREEN}" transform="rotate(-0.5 540 1180)"/>
    <text x="102" y="1196" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="38" font-weight="900" letter-spacing="1.1" transform="rotate(-0.5 540 1180)">ANYWHERE. HE’S STAYING IN FORMATION.</text>`,
  }),
  portraitCanvas({
    id: "fn9-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 09",
    body: `<rect x="88" y="220" width="904" height="820" fill="${PAPER}" transform="rotate(-0.8 540 630)"/>
    ${tape(200, 196, 220, -4)}
    ${lines(["The only useful comparison:"], {x: 150, y: 380, size: 66, leading: 80, family: SERIF, weight: 700})}
    ${lines(["you, against you, over time.", "", "Same driver. Same roads.", "Honest odometer."], {x: 150, y: 510, size: 54, leading: 74, family: SERIF, weight: 400, style: "italic"})}
    ${dashedLoop(730, 880, RUST, 1)}`,
  }),
  portraitCanvas({
    id: "fn9-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 09",
    background: PAPER,
    body: `${photo({name: PHOTOS, x: 220, y: 150, width: 760, height: 720, rotation: 1.1, position: "xMidYMid", backing: GREEN, id: "fn9-06"})}
    ${tape(350, 128, 200, 3)}
    ${lines(["Other men are a library,", "not a map."], {x: 72, y: 980, size: 60, leading: 78, family: SERIF, weight: 700})}
    ${lines(["Do I actually want that —", "or do I just want to have it?"], {x: 74, y: 1180, size: 48, leading: 64, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}`,
  }),
  portraitCanvas({
    id: "fn9-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 09",
    body: `${lines(["Want the thing?", "Study the man.", "Run your own route."], {x: 90, y: 440, size: 74, leading: 92, family: SERIF, weight: 700})}
    ${lines(["Want to have it?", "Close the map."], {x: 92, y: 800, size: 66, leading: 84, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD})}
    ${dashedLoop(620, 1000, GREEN, 1.2)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn9-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1160" y="0" width="440" height="1000" fill="${PAPER}"/>
  ${photo({name: BEDS, x: 130, y: 90, width: 730, height: 820, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn9-feature"})}
  ${photo({name: PHOTOS, x: 890, y: 210, width: 500, height: 640, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn9-feature"})}
  ${tape(240, 66, 220, -4)}
  ${tape(990, 186, 190, 4)}
  ${dashedLoop(1400, 150, RUST, 1.3)}
  ${dashedLoop(1390, 810, GREEN, 1.1)}
  ${grain(1600, 1000, "fn9-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 9 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-09-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "comparison-is-a-bad-map", feature);

console.log("Rendered the Field Note 9 feature image and seven carousel SVG and PNG pairs.");
