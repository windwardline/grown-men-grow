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
  strip,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 15 — "Every Part Passed Inspection".
// Field Note family: image-led, with type-led and mark-led slides between the
// photographs so no two consecutive slides share a skeleton. Signature
// vocabulary: a hand-drawn tolerance stack — a ruled datum line with a run of
// short measured segments beneath it, each carrying a plus-or-minus band at its
// right edge, and a bracket marking the accumulated gap at the far end. The run
// walks away from the datum through the middle slides and re-references to it on
// the close, so the gap collapses to a single band. No prior vocabularies.
const CALIPER = "editorial/machinist-caliper-part.png";
const SEAM = "editorial/cabinet-seam-proud-door.png";
const SQUARE = "editorial/datum-face-square.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "pegboard-end-of-day", "morning-armchair-mug", "truck-hood-map", "trail-fork-daylight", "compass-in-hand", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread", "bp-cuff-notebook", "running-shoes-alarm", "cutting-board-vegetables", "base-plates-anchor-bolts", "transfer-switch-cabinet", "covered-slab-curing", "garage-floor-hairline-crack", "hose-wetting-fresh-pour", "sling-capacity-tag", "wall-calendar-kitchen", "rigging-shackles-bench", "punch-list-tailgate", "ladder-against-eave-autumn", "downspout-extension-turned", "gutter-leaves-from-above", "driveway-hoop-late-afternoon", "restaurant-table-after-lunch"];

function toleranceStack(x, y, {count = 6, span = 92, drop = 0, color = RUST, scale = 1, showGap = true, datumRun = null}) {
  const s = scale;
  const segment = span * s;
  const width = datumRun ?? count * segment + 54 * s;
  const step = (drop * s) / Math.max(count, 1);
  const bar = (index) => {
    const barX = x + index * segment;
    const barY = y + 34 * s + step * (index + 1);
    return `<line x1="${barX}" y1="${barY}" x2="${barX + segment - 10 * s}" y2="${barY}" stroke="${color}" stroke-width="${7 * s}" stroke-linecap="round"/>
    <line x1="${barX + segment - 10 * s}" y1="${barY - 11 * s}" x2="${barX + segment - 10 * s}" y2="${barY + 11 * s}" stroke="${color}" stroke-width="${3.4 * s}" opacity="0.72"/>`;
  };
  const endY = y + 34 * s + step * count;
  const gapX = x + count * segment + 20 * s;
  const gap = showGap
    ? `<line x1="${gapX}" y1="${y}" x2="${gapX}" y2="${endY}" stroke="${color}" stroke-width="${3.4 * s}"/>
    <line x1="${gapX - 10 * s}" y1="${y}" x2="${gapX + 10 * s}" y2="${y}" stroke="${color}" stroke-width="${3.4 * s}"/>
    <line x1="${gapX - 10 * s}" y1="${endY}" x2="${gapX + 10 * s}" y2="${endY}" stroke="${color}" stroke-width="${3.4 * s}"/>`
    : "";
  return `<g>
    <line x1="${x - 20 * s}" y1="${y}" x2="${x + width}" y2="${y}" stroke="${INK}" stroke-width="${3.2 * s}" opacity="0.55"/>
    ${Array.from({length: count}, (_, index) => bar(index)).join("")}${gap ? `\n    ${gap}` : ""}
  </g>`;
}

const slides = [
  // 1 — cover. Image-led: title lockup, then the caliper, then the drift.
  portraitCanvas({
    id: "fn15-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 15",
    body: `${lines(["EVERY PART"], {x: 64, y: 244, size: 96, leading: 108, family: SANS, weight: 900, tracking: 0.8})}
    ${lines(["PASSED INSPECTION."], {x: 64, y: 348, size: 96, leading: 108, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["Nothing went out of spec."], {x: 68, y: 424, size: 40, leading: 54, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: CALIPER, x: 150, y: 486, width: 800, height: 604, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn15-01"})}
    ${tape(262, 462, 214, -4)}
    ${toleranceStack(150, 1150, {count: 6, span: 128, drop: 82, color: RUST, scale: 0.9})}`,
  }),
  // 2 — the honest number. Quiet type page, one segment, one band.
  portraitCanvas({
    id: "fn15-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 15",
    background: PAPER,
    body: `${lines(["Every dimension carries", "a second number", "in smaller type."], {x: 74, y: 330, size: 72, leading: 92, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Plus or minus five thousandths —", "the engineer admitting that nothing", "gets made exactly."], {x: 76, y: 660, size: 44, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${toleranceStack(320, 940, {count: 1, span: 300, drop: 0, color: OXBLOOD, scale: 1.2})}`,
  }),
  // 3 — the stack. Mark-led; the drawing carries the argument.
  portraitCanvas({
    id: "fn15-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 15",
    body: `${lines(["Six parts, each allowed", "five thousandths, every one", "drifting the same way."], {x: 72, y: 300, size: 58, leading: 76, family: SERIF, weight: 700, tracking: 0})}
    ${toleranceStack(88, 620, {count: 6, span: 142, drop: 300, color: RUST, scale: 1.1})}
    <rect x="72" y="1108" width="936" height="112" fill="${OXBLOOD}" transform="rotate(-0.6 540 1164)"/>
    <text x="102" y="1180" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="42" font-weight="900" letter-spacing="0.6" transform="rotate(-0.6 540 1164)">NOT ONE BAD PART IN THE ASSEMBLY.</text>`,
  }),
  // 4 — the audit. The seam photograph under the clean-verdict copy.
  portraitCanvas({
    id: "fn15-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 15",
    background: PAPER,
    body: `${photo({name: SEAM, x: 120, y: 168, width: 840, height: 700, rotation: 0.7, position: "xMidYMin", backing: OXBLOOD, id: "fn15-04"})}
    ${tape(220, 146, 214, -3)}
    ${lines(["A man runs the audit at a bad hour,", "and it comes back clean."], {x: 74, y: 946, size: 50, leading: 66, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The job was right. The move was right.", "There is no affair in the file."], {x: 76, y: 1104, size: 38, leading: 52, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 5 — pressure point. Almost nothing on the page.
  portraitCanvas({
    id: "fn15-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 15",
    body: `${lines(["Innocence is not", "a repair."], {x: 92, y: 540, size: 104, leading: 126, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It is a finding."], {x: 94, y: 826, size: 88, leading: 104, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 6 — the two tools. Heavy strips, abrupt scale shift against slide 5.
  portraitCanvas({
    id: "fn15-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 15",
    background: PAPER,
    body: `${strip({x: 68, y: 286, width: 944, height: 104, fill: INK, text: "FAULT IS AN INSPECTION.", color: PAPER_LIGHT, size: 50, rotation: -0.7, tracking: -0.4})}
    ${lines(["It looks backward, returns a verdict,", "and the moment it reads no defect", "found, the tool is finished."], {x: 74, y: 470, size: 44, leading: 60, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${strip({x: 68, y: 700, width: 944, height: 104, fill: OXBLOOD, text: "RESPONSIBILITY IS A GAUGE.", color: PAPER_LIGHT, size: 50, rotation: 0.6, tracking: -0.4})}
    ${lines(["It never asks who did it. It reads the", "same number whether the answer is his", "fault, someone else’s, or nobody’s."], {x: 74, y: 884, size: 44, leading: 60, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${toleranceStack(660, 1136, {count: 2, span: 128, drop: 46, color: RUST, scale: 0.9})}`,
  }),
  // 7 — close. The square registered on one face, and the run re-referenced to
  // a single datum so the gap collapses to one band.
  portraitCanvas({
    id: "fn15-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 15",
    body: `${photo({name: SQUARE, x: 150, y: 152, width: 780, height: 606, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn15-07"})}
    ${tape(258, 130, 206, 3)}
    ${lines(["Somebody has to hold", "the gauge against the part."], {x: 88, y: 872, size: 56, leading: 72, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["There is exactly one man", "standing in front of it."], {x: 90, y: 1042, size: 52, leading: 66, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${toleranceStack(150, 1186, {count: 6, span: 110, drop: 0, color: GREEN, scale: 0.8})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. Two photographs, the
// drifting run between them, and the resolved run set small beneath.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn15-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1260" y="0" width="340" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: CALIPER, x: 80, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn15-feature"})}
  ${photo({name: SEAM, x: 790, y: 140, width: 420, height: 560, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn15-feature"})}
  ${tape(214, 46, 226, -4)}
  ${tape(884, 116, 198, 4)}
  ${toleranceStack(800, 782, {count: 4, span: 96, drop: 118, color: RUST, scale: 1.0})}
  ${grain(1600, 1000, "fn15-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16): one
// article's photograph never appears in another article's composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 15 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-15-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "every-part-passed-inspection", feature);

console.log("Rendered the Field Note 15 feature image and seven carousel SVG and PNG pairs.");
