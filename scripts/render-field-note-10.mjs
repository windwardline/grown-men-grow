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

// Field Note 10 — "Your Body Keeps the Books".
// Signature vocabulary: a small hand-drawn double-entry ledger mark — two short
// ruled columns with tick entries, balanced by the close. No prior vocabularies.
const CUFF = "editorial/bp-cuff-notebook.png";
const SHOES = "editorial/running-shoes-alarm.png";
const BOARD = "editorial/cutting-board-vegetables.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "pegboard-end-of-day", "morning-armchair-mug", "truck-hood-map", "trail-fork-daylight", "compass-in-hand", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread"];

function ledgerMark(x, y, entries, color = RUST, scale = 1) {
  const s = scale;
  const columnWidth = 54 * s;
  const gap = 18 * s;
  const ticks = (columnX, count) =>
    Array.from({length: count}, (_, index) =>
      `<line x1="${columnX + 8 * s}" y1="${y + 26 * s + index * 16 * s}" x2="${columnX + columnWidth - 8 * s}" y2="${y + 26 * s + index * 16 * s}" stroke="${color}" stroke-width="${4 * s}" stroke-linecap="round"/>`,
    ).join("");
  return `<g>
    <line x1="${x}" y1="${y}" x2="${x + columnWidth}" y2="${y}" stroke="${color}" stroke-width="${5 * s}" stroke-linecap="round"/>
    <line x1="${x + columnWidth + gap}" y1="${y}" x2="${x + 2 * columnWidth + gap}" y2="${y}" stroke="${color}" stroke-width="${5 * s}" stroke-linecap="round"/>
    <line x1="${x + columnWidth / 2}" y1="${y + 8 * s}" x2="${x + columnWidth / 2}" y2="${y + 78 * s}" stroke="${color}" stroke-width="${3 * s}" opacity="0.5"/>
    <line x1="${x + columnWidth + gap + columnWidth / 2}" y1="${y + 8 * s}" x2="${x + columnWidth + gap + columnWidth / 2}" y2="${y + 78 * s}" stroke="${color}" stroke-width="${3 * s}" opacity="0.5"/>
    ${ticks(x, entries[0])}
    ${ticks(x + columnWidth + gap, entries[1])}
  </g>`;
}

const slides = [
  portraitCanvas({
    id: "fn10-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 10",
    body: `${lines(["YOUR BODY KEEPS"], {x: 64, y: 250, size: 82, leading: 96, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["THE BOOKS."], {x: 64, y: 364, size: 82, leading: 96, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${ledgerMark(840, 210, [3, 2], RUST, 1.3)}
    ${photo({name: CUFF, x: 150, y: 440, width: 800, height: 760, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn10-01"})}
    ${tape(260, 416, 210, -4)}`,
  }),
  portraitCanvas({
    id: "fn10-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 10",
    background: PAPER,
    body: `${lines(["The statements arrive:", "the knee, the 3 a.m. ceiling,", "the stairs with a new opinion."], {x: 72, y: 320, size: 66, leading: 86, family: SERIF, weight: 700})}
    ${lines(["The pile grows, unopened."], {x: 74, y: 660, size: 56, leading: 74, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${ledgerMark(760, 880, [4, 1], OXBLOOD, 1.1)}`,
  }),
  portraitCanvas({
    id: "fn10-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 10",
    body: `${lines(["Ignoring a number", "has never once", "changed it."], {x: 90, y: 500, size: 90, leading: 106, family: SERIF, weight: 700, style: "italic"})}
    ${ledgerMark(92, 880, [2, 2], INK, 1)}`,
  }),
  portraitCanvas({
    id: "fn10-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 10",
    background: PAPER,
    body: `${photo({name: SHOES, x: 96, y: 160, width: 888, height: 780, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn10-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1000" width="936" height="110" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1055)"/>
    <text x="102" y="1074" fill="${INK}" font-family="${SERIF}" font-size="50" font-weight="700" transform="rotate(-0.5 540 1055)">The accounting is flawless.</text>
    <rect x="72" y="1128" width="936" height="104" fill="${GREEN}" transform="rotate(-0.5 540 1180)"/>
    <text x="102" y="1196" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="40" font-weight="900" letter-spacing="1.1" transform="rotate(-0.5 540 1180)">EVERY ENTRY POSTS. NOTHING IS FORGOTTEN.</text>`,
  }),
  portraitCanvas({
    id: "fn10-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 10",
    body: `<rect x="88" y="220" width="904" height="820" fill="${PAPER}" transform="rotate(-0.8 540 630)"/>
    ${tape(200, 196, 220, -4)}
    ${lines(["Somewhere, ignoring the body", "got misfiled as strength."], {x: 150, y: 400, size: 58, leading: 76, family: SERIF, weight: 700})}
    ${lines(["Actual toughness", "reads its own mail."], {x: 150, y: 640, size: 62, leading: 80, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${ledgerMark(700, 900, [3, 3], RUST, 1)}`,
  }),
  portraitCanvas({
    id: "fn10-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 10",
    background: PAPER,
    body: `${photo({name: BOARD, x: 220, y: 150, width: 760, height: 720, rotation: 1.1, position: "xMidYMid", backing: GREEN, id: "fn10-06"})}
    ${tape(350, 128, 200, 3)}
    ${lines(["The audit comes either way."], {x: 72, y: 980, size: 60, leading: 78, family: SERIF, weight: 700})}
    ${lines(["The scheduled kind, on a Tuesday", "you chose — or the kind that", "picks its own date."], {x: 74, y: 1120, size: 46, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}`,
  }),
  portraitCanvas({
    id: "fn10-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 10",
    body: `${lines(["You’re funding the man", "who shows up later."], {x: 90, y: 480, size: 74, leading: 92, family: SERIF, weight: 700})}
    ${lines(["Open the mail.", "It’s addressed to him."], {x: 92, y: 740, size: 66, leading: 84, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD})}
    ${ledgerMark(560, 960, [4, 4], GREEN, 1.3)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn10-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1160" y="0" width="440" height="1000" fill="${PAPER}"/>
  ${photo({name: CUFF, x: 130, y: 90, width: 730, height: 820, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn10-feature"})}
  ${photo({name: BOARD, x: 890, y: 210, width: 500, height: 640, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn10-feature"})}
  ${tape(240, 66, 220, -4)}
  ${tape(990, 186, 190, 4)}
  ${ledgerMark(1400, 150, [4, 1], RUST, 1.3)}
  ${ledgerMark(1390, 820, [4, 4], GREEN, 1.1)}
  ${grain(1600, 1000, "fn10-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 10 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-10-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "your-body-keeps-the-books", feature);

console.log("Rendered the Field Note 10 feature image and seven carousel SVG and PNG pairs.");
