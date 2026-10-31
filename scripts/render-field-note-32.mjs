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

// Field Note 32 — "He Won't Remember the Drive." Draft for founder review,
// written 2026-10-31; not founder-approved, no register position assigned.
//
// Signature vocabulary: a hand-drawn viewfinder mark — the four corner
// brackets of a camera viewfinder with a small recording dot inside the
// top-left corner. In its blank state the dot is a hollow ring: the camera
// running with no tape in it. In its witnessed state a second viewfinder
// stands beside the first and its dot is filled rust: the driver, the one who
// is recording. In its morning state a single viewfinder stands alone with its
// dot filled in ink: the day is his to keep again. The brackets never change;
// only which dot is filled.
// No prior vocabularies: not the table plan, bolt circle, flashlight mark,
// sweep mark, bitting profile, centering mark, scorebook box, trunk taper,
// guide-coat profile, contact gap, counterbalance, load path, tolerance stack,
// downspout, strength curve, sling, transfer switch, battery gauge, route
// line, tally, ledger, alarm arc, diverging fork, anode section, bubble vial,
// branch stub or bead mark.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const WAITING = "editorial/waiting-room-chairs-morning.png";
const JUICE = "editorial/apple-juice-recovery-tray.png";
const KEYS = "editorial/keys-folded-sheet-counter.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-chalk-line-low-sun", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "cafe-table-two-bottles", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "first-bowl-studio-shelf", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hallway-flashlight-first-light", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "infield-glove-raked-dirt", "kitchen-counter-pause", "kitchen-table-milk-towel", "ladder-against-eave-autumn", "lawn-chairs-loose-circle", "level-on-top-plate", "level-reversed-pencil-mark", "lopsided-bowl-entry-console", "lug-wrench-driveway-tire", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "pitchers-mound-rosin-bag", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "pulled-stakes-young-tree", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "saddle-bag-kit-bench", "sanding-longboard-bench", "screwdriver-flashlight-tub-floor", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "staked-sapling-front-lawn", "sunlit-writing-table", "switchback-climb-morning", "tap-running-hot", "temp-wall-open-room", "tongs-handed-over", "tongs-kettle-grill-shelf", "tool-bag-handoff", "torque-wrench-shop-towel", "torque-wrenches-wall-rack", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "two-flashlights-porch-step", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "ware-board-six-cups", "water-heater-top-fittings", "workbench-hand-tools", "worn-hammer-handle-pegboard", "worn-key-and-copy-counter"];

function viewfinder(cx, cy, {
  size = 120,
  state = "blank",
  line = INK,
  accent = RUST,
  ground = PAPER_LIGHT,
} = {}) {
  const f = (value) => value.toFixed(1);
  const stroke = f(size * 0.045);
  const width = size * 1.4;
  const height = size;
  const arm = size * 0.28;
  const dotRadius = size * 0.085;

  const frame = (x0, y0, dot) => {
    const x1 = x0 + width;
    const y1 = y0 + height;
    const corners = [
      `M${f(x0)} ${f(y0 + arm)} L${f(x0)} ${f(y0)} L${f(x0 + arm)} ${f(y0)}`,
      `M${f(x1 - arm)} ${f(y0)} L${f(x1)} ${f(y0)} L${f(x1)} ${f(y0 + arm)}`,
      `M${f(x1)} ${f(y1 - arm)} L${f(x1)} ${f(y1)} L${f(x1 - arm)} ${f(y1)}`,
      `M${f(x0 + arm)} ${f(y1)} L${f(x0)} ${f(y1)} L${f(x0)} ${f(y1 - arm)}`,
    ].map((d) => `<path d="${d}" fill="none" stroke="${line}" stroke-width="${stroke}" stroke-linecap="round" stroke-linejoin="round"/>`).join("");
    const dx = x0 + size * 0.36;
    const dy = y0 + size * 0.34;
    const mark = dot === "hollow"
      ? `<circle cx="${f(dx)}" cy="${f(dy)}" r="${f(dotRadius)}" fill="${ground}" stroke="${line}" stroke-width="${stroke}"/>`
      : `<circle cx="${f(dx)}" cy="${f(dy)}" r="${f(dotRadius)}" fill="${dot}"/>`;
    return corners + mark;
  };

  // His frame always comes first; the driver's, when present, stands to its right.
  const dots = {
    blank: ["hollow"],
    witnessed: ["hollow", accent],
    morning: [line],
  }[state];
  const gap = size * 0.6;
  const total = dots.length * width + (dots.length - 1) * gap;
  const left = cx - total / 2;
  const top = cy - height / 2;
  const frames = dots.map((dot, i) => frame(left + i * (width + gap), top, dot)).join("");
  return `<g opacity="0.94">${frames}</g>`;
}

const LABEL = "FIELD NOTE 32";

const slides = [
  // 1 — cover. Title lockup over the waiting-room chairs; the mark small, nothing recording.
  portraitCanvas({
    id: "fn32-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["HE WON'T REMEMBER"], {x: 64, y: 250, size: 76, leading: 90, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["THE DRIVE"], {x: 64, y: 340, size: 76, leading: 90, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["The nurse gives the instructions", "to the man who drove him."], {x: 68, y: 414, size: 28, leading: 38, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: WAITING, x: 400, y: 510, width: 560, height: 680, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn32-01"})}
    ${tape(610, 488, 214, 3)}
    ${viewfinder(210, 1060, {size: 92})}`,
  }),
  // 2 — torn oxblood field, reverse serif type; nothing recording.
  portraitCanvas({
    id: "fn32-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="60" y="230" width="960" height="740" fill="${OXBLOOD}" transform="rotate(-0.6 540 600)"/>
    ${tape(220, 208, 222, -3)}
    ${tape(780, 946, 196, 4)}
    ${lines(["He doesn't", "leave alone."], {x: 110, y: 380, size: 80, leading: 96, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${viewfinder(740, 770, {size: 170, line: PAPER_LIGHT, ground: OXBLOOD})}
    ${lines(["Not in a cab, not in a rideshare,", "not on foot."], {x: 76, y: 1090, size: 44, leading: 58, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 3 — documentary detail: the apple juice in the recovery bay.
  portraitCanvas({
    id: "fn32-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${photo({name: JUICE, x: 120, y: 150, width: 820, height: 760, rotation: 0.6, position: "xMidYMid", backing: OXBLOOD, id: "fn32-03"})}
    ${tape(420, 128, 220, -3)}
    ${lines(["The camera's running and", "there's no tape in it."], {x: 78, y: 1010, size: 52, leading: 68, family: SERIF, weight: 700, tracking: 0})}`,
  }),
  // 4 — sparse, mark-led at full scale; still blank.
  portraitCanvas({
    id: "fn32-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${lines(["The rule isn't kindness."], {x: 74, y: 290, size: 66, leading: 80, family: SERIF, weight: 700, tracking: 0})}
    ${viewfinder(540, 660, {size: 250})}
    ${lines(["The kindness is whoever's", "name is on the line."], {x: 78, y: 1020, size: 56, leading: 70, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${scribble("M80 1160 C280 1146 480 1158 700 1150", RUST, 8)}`,
  }),
  // 5 — halftone field; the driver's frame arrives beside his, recording.
  portraitCanvas({
    id: "fn32-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="620" y="196" width="380" height="540" fill="url(#fn32-05-dots)"/>
    ${lines(["Then the nurse", "turns to the", "driver and gives", "him the", "instructions."], {x: 74, y: 300, size: 64, leading: 84, family: SERIF, weight: 700, tracking: 0})}
    ${viewfinder(540, 1000, {size: 150, state: "witnessed", ground: PAPER})}`,
  }),
  // 6 — type-led on an oxblood field: one person recording, and he's driving.
  portraitCanvas({
    id: "fn32-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["The drive has exactly", "one person who'll", "remember it,"], {x: 74, y: 300, size: 70, leading: 88, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["and he's driving."], {x: 78, y: 600, size: 52, leading: 64, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${viewfinder(540, 900, {size: 170, state: "witnessed", line: PAPER_LIGHT, ground: OXBLOOD})}`,
  }),
  // 7 — close, image-led on the counter the next morning; his dot filled again.
  portraitCanvas({
    id: "fn32-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: KEYS, x: 200, y: 150, width: 660, height: 690, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn32-07"})}
    ${tape(470, 128, 204, -3)}
    ${lines(["In somebody else's handwriting,"], {x: 78, y: 930, size: 44, leading: 58, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["the time he's allowed", "to drive again."], {x: 80, y: 1010, size: 40, leading: 54, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${viewfinder(850, 1130, {size: 80, state: "morning"})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The waiting room
// dominant, the counter small beside it, and the mark run as a pair in the
// oxblood margin: nothing recording above, the morning below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn32-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: WAITING, x: 90, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn32-feature"})}
  ${photo({name: KEYS, x: 790, y: 230, width: 400, height: 540, rotation: 1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn32-feature"})}
  ${tape(420, 46, 222, -4)}
  ${tape(880, 206, 196, 4)}
  ${viewfinder(1422, 320, {size: 90, line: PAPER_LIGHT, ground: OXBLOOD})}
  ${viewfinder(1422, 680, {size: 90, state: "morning", line: PAPER_LIGHT, ground: OXBLOOD})}
  ${scribble("M620 972 C724 948 832 984 936 956", RUST, 10)}
  ${grain(1600, 1000, "fn32-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 32 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-32-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "he-wont-remember-the-drive", feature);

console.log("Rendered the Field Note 32 feature image and seven carousel SVG and PNG pairs.");
