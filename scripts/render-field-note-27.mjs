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
  scribble,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 27 — "The Wear Copies Too". Draft, not founder-approved.
//
// Signature vocabulary: a hand-drawn bitting profile — a house key seen from
// the side, its bow a ring and its blade carrying five cuts along the top
// edge. In its worn state the cuts are shallow and every peak and valley is
// rounded, the way twenty years in a pocket leaves them, and a copy of a copy
// is drawn rounder still. In its code state the same five cuts are crisp and
// flat-bottomed, and a short rust depth tick stands above each one, the
// manufacturer's number for how deep it should go. Same key, same cuts; the
// only thing that changes is whether it is read from the wear or from the
// code. No prior vocabularies: not the centering mark, scorebook box, trunk
// taper, guide-coat profile, contact gap, counterbalance, load path, tolerance
// stack, downspout, strength curve, sling, transfer switch, battery gauge,
// route line, tally, ledger, alarm arc, diverging fork, anode section, bubble
// vial, branch stub or bead mark.
//
// Photography: three source images specified for this note under the house
// prompt and unique to it. They had not been generated when this script was
// written; see the note's production notes.
const KEYS = "editorial/worn-key-and-copy-counter.png";
const MILK = "editorial/kitchen-table-milk-towel.png";
const HAMMER = "editorial/worn-hammer-handle-pegboard.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-chalk-line-low-sun", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "first-bowl-studio-shelf", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "infield-glove-raked-dirt", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "lopsided-bowl-entry-console", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "pitchers-mound-rosin-bag", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "pulled-stakes-young-tree", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "sanding-longboard-bench", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "staked-sapling-front-lawn", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "ware-board-six-cups", "water-heater-top-fittings", "workbench-hand-tools"];

// Cut depths as fractions of the blade's height, and the share of each cut's
// width that is flat at the bottom. Fixed so every render is byte-identical
// and the review sheet never drifts between runs.
const DEPTHS = [0.5, 0.26, 0.64, 0.36, 0.56];
const FLAT = 0.24;

// wear runs from 0 (cut from code) to 1 (several copies down). Worn cuts are
// shallower and drawn as curves, so no peak or valley keeps a corner.
function bittingMark(x, y, {
  width = 300,
  wear = 0,
  ticks = wear === 0,
  line = INK,
  fill = "none",
  tick = RUST,
} = {}) {
  const f = (value) => value.toFixed(1);
  const h = width * 0.18;
  const stroke = f(width * 0.012);
  const start = x + width * 0.06;
  const cut = (width * 0.8) / DEPTHS.length;
  const tip = x + width * 0.9;

  let top = `M${f(x)} ${f(y)} L${f(start)} ${f(y)}`;
  const tickMarks = [];
  DEPTHS.forEach((depth, index) => {
    const left = start + cut * index;
    const right = left + cut;
    const middle = left + cut / 2;
    const bottom = y + h * depth * (1 - 0.55 * wear);
    if (wear === 0) {
      top += ` L${f(middle - cut * FLAT / 2)} ${f(bottom)} L${f(middle + cut * FLAT / 2)} ${f(bottom)} L${f(right)} ${f(y)}`;
    } else {
      // Level tangents at every peak and valley, so neither keeps a corner.
      const ease = cut * 0.25;
      top += ` C${f(left + ease)} ${f(y)} ${f(middle - ease)} ${f(bottom)} ${f(middle)} ${f(bottom)}`;
      top += ` C${f(middle + ease)} ${f(bottom)} ${f(right - ease)} ${f(y)} ${f(right)} ${f(y)}`;
    }
    if (ticks) {
      const tickTop = y - h * 0.3 - h * depth * 0.7;
      tickMarks.push(`<line x1="${f(middle)}" y1="${f(y - h * 0.3)}" x2="${f(middle)}" y2="${f(tickTop)}" stroke="${tick}" stroke-width="${f(width * 0.016)}" stroke-linecap="round"/>`);
    }
  });
  top += ` L${f(tip)} ${f(y)} L${f(x + width)} ${f(y + h * 0.55)} L${f(tip)} ${f(y + h)} L${f(x)} ${f(y + h)} Z`;

  const bowRadius = h * 0.95;
  const bowX = x - bowRadius;
  const bowY = y + h / 2;
  const bow = `<circle cx="${f(bowX)}" cy="${f(bowY)}" r="${f(bowRadius)}" fill="${fill}" stroke="${line}" stroke-width="${stroke}"/>
    <circle cx="${f(bowX - bowRadius * 0.3)}" cy="${f(bowY)}" r="${f(bowRadius * 0.28)}" fill="none" stroke="${line}" stroke-width="${stroke}"/>`;
  const blade = `<path d="${top}" fill="${fill}" stroke="${line}" stroke-width="${stroke}" stroke-linejoin="${wear === 0 ? "miter" : "round"}"/>`;

  return `${bow}${blade}${tickMarks.join("")}`;
}

const LABEL = "FIELD NOTE 27";

const slides = [
  // 1 — cover. Title lockup, the worn key and its copy, the mark small and worn.
  portraitCanvas({
    id: "fn27-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["THE WEAR"], {x: 64, y: 250, size: 84, leading: 96, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["COPIES TOO."], {x: 64, y: 346, size: 84, leading: 96, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["The key machine can't tell the pattern", "from twenty years in somebody's pocket."], {x: 68, y: 420, size: 30, leading: 42, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: KEYS, x: 330, y: 510, width: 560, height: 630, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn27-01"})}
    ${tape(560, 486, 214, 4)}
    ${bittingMark(110, 1150, {width: 200, wear: 0.7})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. Three generations of copy.
  portraitCanvas({
    id: "fn27-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="760" fill="${OXBLOOD}" transform="rotate(0.7 540 606)"/>
    ${tape(170, 204, 222, -3)}
    ${tape(770, 962, 196, 4)}
    ${lines(["Copy a copy", "and the errors stack."], {x: 106, y: 350, size: 70, leading: 92, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${bittingMark(250, 560, {width: 300, wear: 0.35, line: PAPER_LIGHT})}
    ${bittingMark(370, 700, {width: 300, wear: 0.7, line: PAPER_LIGHT})}
    ${bittingMark(490, 840, {width: 300, wear: 1, line: PAPER_LIGHT})}
    ${lines(["Somewhere around the third", "generation, the key sticks."], {x: 76, y: 1100, size: 50, leading: 66, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 3 — sparse, mark-led at full scale, cut from code.
  portraitCanvas({
    id: "fn27-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${lines(["A real locksmith", "doesn't need", "the key."], {x: 74, y: 290, size: 76, leading: 96, family: SERIF, weight: 700, tracking: 0})}
    ${bittingMark(250, 760, {width: 700})}
    ${lines(["He cuts from the code."], {x: 78, y: 1120, size: 52, leading: 66, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${scribble("M80 1176 C260 1160 440 1172 620 1166", RUST, 8)}`,
  }),
  // 4 — documentary detail: the morning the sentence comes out.
  portraitCanvas({
    id: "fn27-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${photo({name: MILK, x: 120, y: 150, width: 840, height: 720, rotation: -0.6, position: "xMidYMid", backing: OXBLOOD, id: "fn27-04"})}
    ${tape(410, 128, 220, -3)}
    ${lines(["The milk goes over, and", "a sentence leaves his", "mouth in his father's voice."], {x: 78, y: 960, size: 52, leading: 68, family: SERIF, weight: 700, tracking: 0})}`,
  }),
  // 5 — halftone field, the father as a copy.
  portraitCanvas({
    id: "fn27-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="596" y="196" width="398" height="560" fill="url(#fn27-05-dots)"/>
    ${lines(["His father", "was a copy", "too."], {x: 74, y: 300, size: 84, leading: 102, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Most of the wear was", "nobody's design."], {x: 74, y: 900, size: 52, leading: 68, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${bittingMark(760, 1150, {width: 200, wear: 0.7})}`,
  }),
  // 6 — type-led on an oxblood field: the worn key under its own code ticks.
  portraitCanvas({
    id: "fn27-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["“That's just how I am”", "is what a worn key", "would say if it", "could talk."], {x: 74, y: 300, size: 66, leading: 86, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${bittingMark(260, 900, {width: 620, wear: 0.8, ticks: true, line: PAPER_LIGHT})}`,
  }),
  // 7 — close, image-led on the handed-down hammer.
  portraitCanvas({
    id: "fn27-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: HAMMER, x: 224, y: 152, width: 632, height: 660, rotation: 0.6, position: "xMidYMid", backing: GREEN, id: "fn27-07"})}
    ${tape(520, 130, 204, 3)}
    ${lines(["The old key still opens the door."], {x: 78, y: 900, size: 46, leading: 60, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Somebody's being cut", "from him right now."], {x: 80, y: 1010, size: 42, leading: 56, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${bittingMark(800, 1150, {width: 180})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The keys dominant, the
// hammer small beside them, and the mark run as a pair in the oxblood margin —
// worn above, cut from code below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn27-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: KEYS, x: 90, y: 70, width: 660, height: 860, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn27-feature"})}
  ${photo({name: HAMMER, x: 790, y: 210, width: 400, height: 560, rotation: -1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn27-feature"})}
  ${tape(420, 46, 222, 4)}
  ${tape(880, 186, 196, -4)}
  ${bittingMark(1330, 290, {width: 230, wear: 0.8, line: PAPER_LIGHT})}
  ${bittingMark(1330, 720, {width: 230, line: PAPER_LIGHT})}
  ${scribble("M620 972 C724 948 832 984 936 956", RUST, 10)}
  ${grain(1600, 1000, "fn27-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 27 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-27-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-wear-copies-too", feature);

console.log("Rendered the Field Note 27 feature image and seven carousel SVG and PNG pairs.");
