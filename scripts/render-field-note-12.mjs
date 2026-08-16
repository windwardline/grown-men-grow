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

// Field Note 12 — "Nobody Rigs to the Breaking Strength".
// Signature vocabulary: a small hand-drawn two-leg sling — a hook point above,
// two legs down to a load bar. The included angle is narrow while the essay is
// describing a rating held on purpose, splays wide where the tension multiplies,
// and returns narrow at the close. Same load, different tension, purely from
// geometry nobody looked at. No prior vocabularies.
const TAG = "editorial/sling-capacity-tag.png";
const HARDWARE = "editorial/rigging-shackles-bench.png";
const CALENDAR = "editorial/wall-calendar-kitchen.png";
const HOOP = "editorial/driveway-hoop-late-afternoon.png";

const otherArticles = ["friends-in-conversation", "repairing-wooden-chair", "sunlit-writing-table", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "morning-armchair-mug", "truck-hood-map", "compass-in-hand", "pegboard-end-of-day", "trail-fork-daylight", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread", "bp-cuff-notebook", "running-shoes-alarm", "cutting-board-vegetables", "base-plates-anchor-bolts", "punch-list-tailgate", "transfer-switch-cabinet", "restaurant-table-after-lunch"];

// `spread` runs 0 (legs near vertical, the rated case) to 1 (legs splayed, where
// the same load pulls far harder). The load bar stays a fixed width throughout —
// the load never changed; only the geometry did.
function slingMark(x, y, spread, color = RUST, scale = 1) {
  const s = scale;
  const barHalf = 46 * s;
  const drop = 74 * s;
  const apexX = x + barHalf;
  const legHalf = (10 + spread * 36) * s;
  const barY = y + drop;
  return `<g>
    <circle cx="${apexX}" cy="${y}" r="${7 * s}" fill="${color}"/>
    <path d="M ${apexX} ${y} L ${apexX - legHalf} ${barY}" fill="none" stroke="${color}" stroke-width="${5 * s}" stroke-linecap="round"/>
    <path d="M ${apexX} ${y} L ${apexX + legHalf} ${barY}" fill="none" stroke="${color}" stroke-width="${5 * s}" stroke-linecap="round"/>
    <line x1="${apexX - barHalf}" y1="${barY}" x2="${apexX + barHalf}" y2="${barY}" stroke="${color}" stroke-width="${7 * s}" stroke-linecap="round"/>
  </g>`;
}

const slides = [
  portraitCanvas({
    id: "fn12-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 12",
    body: `${lines(["NOBODY RIGS TO"], {x: 64, y: 250, size: 78, leading: 94, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["THE BREAKING STRENGTH."], {x: 64, y: 360, size: 62, leading: 94, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${slingMark(872, 206, 0, RUST, 1.2)}
    ${photo({name: TAG, x: 128, y: 452, width: 824, height: 748, rotation: 0.9, position: "xMidYMid", backing: GREEN, id: "fn12-01"})}
    ${tape(286, 428, 214, 4)}`,
  }),
  portraitCanvas({
    id: "fn12-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 12",
    background: PAPER,
    body: `${lines(["A sling rated at two tons", "does not fail at two tons."], {x: 72, y: 330, size: 64, leading: 86, family: SERIF, weight: 700})}
    ${lines(["It fails somewhere well past ten.", "The smaller number is the one", "printed on the tag."], {x: 74, y: 640, size: 48, leading: 66, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${slingMark(788, 906, 0, OXBLOOD, 1.05)}`,
  }),
  portraitCanvas({
    id: "fn12-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 12",
    body: `${lines(["A capacity that only holds", "when conditions are perfect"], {x: 88, y: 500, size: 66, leading: 88, family: SERIF, weight: 700})}
    ${lines(["is not a capacity."], {x: 90, y: 700, size: 66, leading: 88, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${slingMark(90, 880, 0, INK, 1)}`,
  }),
  portraitCanvas({
    id: "fn12-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 12",
    background: PAPER,
    body: `${photo({name: HARDWARE, x: 88, y: 168, width: 904, height: 764, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn12-04"})}
    ${tape(206, 146, 214, 3)}
    <rect x="68" y="1004" width="944" height="196" fill="${PAPER_LIGHT}" transform="rotate(0.6 540 1102)"/>
    <text x="100" y="1074" fill="${INK}" font-family="${SERIF}" font-size="46" font-weight="700" transform="rotate(0.6 540 1102)">Asked what he can handle, a man</text>
    <text x="100" y="1134" fill="${INK}" font-family="${SERIF}" font-size="46" font-weight="700" transform="rotate(0.6 540 1102)">answers with his breaking strength.</text>`,
  }),
  portraitCanvas({
    id: "fn12-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 12",
    body: `${photo({name: CALENDAR, x: 150, y: 142, width: 782, height: 726, rotation: 1.2, position: "xMidYMid", backing: GREEN, id: "fn12-05"})}
    ${tape(322, 120, 198, -4)}
    ${lines(["He does not get to choose", "what fails."], {x: 72, y: 964, size: 56, leading: 74, family: SERIF, weight: 700})}
    ${lines(["What parts first is whatever has", "the least tension on it."], {x: 74, y: 1112, size: 46, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${slingMark(838, 1216, 1, RUST, 1)}`,
  }),
  portraitCanvas({
    id: "fn12-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 12",
    background: PAPER,
    body: `<rect x="82" y="252" width="916" height="762" fill="${PAPER_LIGHT}" transform="rotate(0.7 540 633)"/>
    ${tape(214, 228, 226, 4)}
    ${lines(["The plan was to hold", "this pace until spring."], {x: 144, y: 452, size: 62, leading: 82, family: SERIF, weight: 700})}
    ${lines(["It is a different", "spring now."], {x: 144, y: 706, size: 62, leading: 82, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${slingMark(742, 862, 1, RUST, 1.1)}`,
  }),
  portraitCanvas({
    id: "fn12-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 12",
    body: `${photo({name: HOOP, x: 126, y: 158, width: 828, height: 706, rotation: -1.1, position: "xMidYMid", backing: OXBLOOD, id: "fn12-07"})}
    ${tape(338, 136, 202, -3)}
    ${lines(["The margin is where", "the rest of it lives."], {x: 72, y: 960, size: 56, leading: 74, family: SERIF, weight: 700})}
    ${lines(["That number was never", "a promise about the rope."], {x: 74, y: 1104, size: 48, leading: 64, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${slingMark(830, 1208, 0, GREEN, 1.05)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn12-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="0" y="0" width="404" height="1000" fill="${PAPER}"/>
  ${photo({name: TAG, x: 452, y: 96, width: 714, height: 812, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn12-feature"})}
  ${photo({name: CALENDAR, x: 1194, y: 224, width: 306, height: 610, rotation: -1.5, position: "xMidYMid", backing: GREEN, id: "fn12-feature"})}
  ${tape(560, 72, 224, 3)}
  ${tape(1258, 200, 186, -4)}
  ${slingMark(150, 172, 0, RUST, 1.3)}
  ${slingMark(150, 742, 1, GREEN, 1.15)}
  ${grain(1600, 1000, "fn12-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 12 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-12-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "nobody-rigs-to-the-breaking-strength", feature);

console.log("Rendered the Field Note 12 feature image and seven carousel SVG and PNG pairs.");
