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

// Field Note 7 — "Rest Is Not a Reward".
// Signature vocabulary: a battery gauge — rounded rectangle with fill bars,
// nearly empty in the early slides and full by the close. No prior vocabularies.
const HAMMOCK = "editorial/hammock-midday-rest.png";
const PEGBOARD = "editorial/pegboard-end-of-day.png";
const ARMCHAIR = "editorial/morning-armchair-mug.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "truck-hood-map", "compass-in-hand"];

function batteryGauge(x, y, filledBars, color = RUST, scale = 1) {
  const s = scale;
  const barWidth = 22 * s;
  const barGap = 8 * s;
  const bars = Array.from({length: filledBars}, (_, index) =>
    `<rect x="${x + 10 * s + index * (barWidth + barGap)}" y="${y + 10 * s}" width="${barWidth}" height="${44 * s}" fill="${color}"/>`,
  ).join("");
  return `<g>
    <rect x="${x}" y="${y}" width="${10 * s + 4 * (barWidth + barGap) + 2 * s}" height="${64 * s}" rx="${10 * s}" fill="none" stroke="${color}" stroke-width="${5 * s}"/>
    <rect x="${x + 10 * s + 4 * (barWidth + barGap) + 6 * s}" y="${y + 20 * s}" width="${9 * s}" height="${24 * s}" rx="${4 * s}" fill="${color}"/>${bars}</g>`;
}

const slides = [
  portraitCanvas({
    id: "fn7-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 07",
    body: `${lines(["REST IS NOT"], {x: 64, y: 250, size: 92, leading: 104, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["A REWARD."], {x: 64, y: 364, size: 92, leading: 104, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${batteryGauge(790, 210, 1, RUST, 1.5)}
    ${photo({name: HAMMOCK, x: 150, y: 440, width: 800, height: 760, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn7-01"})}
    ${tape(260, 416, 210, -4)}`,
  }),
  portraitCanvas({
    id: "fn7-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 07",
    background: PAPER,
    body: `${lines(["The tools get wiped down.", "The cords get coiled", "the right way."], {x: 72, y: 320, size: 74, leading: 92, family: SERIF, weight: 700})}
    ${lines(["Then he treats himself like the", "one tool that doesn’t need it."], {x: 74, y: 680, size: 52, leading: 70, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${batteryGauge(760, 880, 1, OXBLOOD, 1.1)}`,
  }),
  portraitCanvas({
    id: "fn7-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 07",
    body: `${lines(["The earning model", "sounds disciplined."], {x: 90, y: 520, size: 86, leading: 102, family: SERIF, weight: 700})}
    ${lines(["It is actually just debt."], {x: 92, y: 740, size: 74, leading: 88, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD})}
    ${batteryGauge(92, 850, 0, INK, 1)}`,
  }),
  portraitCanvas({
    id: "fn7-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 07",
    background: PAPER,
    body: `${photo({name: PEGBOARD, x: 96, y: 160, width: 888, height: 780, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn7-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1000" width="936" height="110" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1055)"/>
    <text x="102" y="1074" fill="${INK}" font-family="${SERIF}" font-size="52" font-weight="700" transform="rotate(-0.5 540 1055)">Collapse is not rest.</text>
    <rect x="72" y="1128" width="936" height="104" fill="${GREEN}" transform="rotate(-0.5 540 1180)"/>
    <text x="102" y="1196" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="36" font-weight="900" letter-spacing="1.1" transform="rotate(-0.5 540 1180)">IF THE NAP WORKS LIKE A FINE, IT WAS REPOSSESSION.</text>`,
  }),
  portraitCanvas({
    id: "fn7-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 07",
    body: `<rect x="88" y="220" width="904" height="820" fill="${PAPER}" transform="rotate(-0.8 540 630)"/>
    ${tape(200, 196, 220, -4)}
    ${lines(["Rest is chosen."], {x: 150, y: 400, size: 84, leading: 96, family: SERIF, weight: 700})}
    ${lines(["Before empty.", "", "It returns something:", "attention, patience, grace."], {x: 150, y: 540, size: 54, leading: 76, family: SERIF, weight: 400, style: "italic"})}
    ${batteryGauge(680, 320, 2, RUST, 1)}`,
  }),
  portraitCanvas({
    id: "fn7-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 07",
    background: PAPER,
    body: `${photo({name: ARMCHAIR, x: 220, y: 150, width: 760, height: 720, rotation: 1.1, position: "xMidYMid", backing: GREEN, id: "fn7-06"})}
    ${tape(350, 128, 200, 3)}
    ${lines(["The maintenance model:", "scheduled, not earned.", "By interval, not by feeling."], {x: 72, y: 980, size: 58, leading: 76, family: SERIF, weight: 700})}
    ${lines(["By the time you feel it, you’re past due."], {x: 74, y: 1250, size: 46, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}`,
  }),
  portraitCanvas({
    id: "fn7-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 07",
    body: `${lines(["Nobody calls the truck", "lazy for needing oil."], {x: 90, y: 480, size: 80, leading: 96, family: SERIF, weight: 700})}
    ${lines(["Put it on the schedule.", "Not after. On."], {x: 92, y: 720, size: 66, leading: 84, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD})}
    ${batteryGauge(560, 900, 4, GREEN, 1.3)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn7-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1160" y="0" width="440" height="1000" fill="${PAPER}"/>
  ${photo({name: HAMMOCK, x: 130, y: 90, width: 730, height: 820, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn7-feature"})}
  ${photo({name: ARMCHAIR, x: 890, y: 210, width: 500, height: 640, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn7-feature"})}
  ${tape(240, 66, 220, -4)}
  ${tape(990, 186, 190, 4)}
  ${batteryGauge(1400, 130, 1, RUST, 1.4)}
  ${batteryGauge(1390, 820, 4, GREEN, 1.2)}
  ${grain(1600, 1000, "fn7-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 7 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-07-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "rest-is-not-a-reward", feature);

console.log("Rendered the Field Note 7 feature image and seven carousel SVG and PNG pairs.");
