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

// Field Note 31 — "He's Been at the Grill Since Noon." Draft for founder
// review, 2026-10-29; not approved, no register position.
//
// Signature vocabulary: a hand-drawn table-plan mark — a long table seen from
// above with chairs drawn as small rings along both sides, the way a caterer
// sketches a seating plan, and a small barred circle for the kettle standing off to one side
// for the grill. In its post state every chair is filled but his, which is a
// dashed ring, and a single rust dot stands at the grill: his chair, and
// where he is instead. In its handed state a second dot, ink, stands at the
// grill beside the rust one. In its seated state the ink dot is alone at the
// grill and every chair is filled, his in rust. The table never changes; only
// where he is in relation to it.
// No prior vocabularies: not the bolt circle, flashlight mark, sweep mark,
// bitting profile, centering mark, scorebook box, trunk taper, guide-coat
// profile, contact gap, counterbalance, load path, tolerance stack, downspout,
// strength curve, sling, transfer switch, battery gauge, route line, tally,
// ledger, alarm arc, diverging fork, anode section, bubble vial, branch stub
// or bead mark.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const TONGS = "editorial/tongs-kettle-grill-shelf.png";
const CHAIRS = "editorial/lawn-chairs-loose-circle.png";
const HANDOFF = "editorial/tongs-handed-over.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-chalk-line-low-sun", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "cafe-table-two-bottles", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "first-bowl-studio-shelf", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hallway-flashlight-first-light", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "infield-glove-raked-dirt", "kitchen-counter-pause", "kitchen-table-milk-towel", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "lopsided-bowl-entry-console", "lug-wrench-driveway-tire", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "pitchers-mound-rosin-bag", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "pulled-stakes-young-tree", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "saddle-bag-kit-bench", "sanding-longboard-bench", "screwdriver-flashlight-tub-floor", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "staked-sapling-front-lawn", "sunlit-writing-table", "switchback-climb-morning", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torque-wrench-shop-towel", "torque-wrenches-wall-rack", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "two-flashlights-porch-step", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "ware-board-six-cups", "water-heater-top-fittings", "workbench-hand-tools", "worn-hammer-handle-pegboard", "worn-key-and-copy-counter"];

// His chair is the end seat on the near side, the one closest to the grill.
const CHAIRS_PER_SIDE = 4;
const HIS_CHAIR = CHAIRS_PER_SIDE - 1;

function tablePlan(cx, cy, {
  size = 120,
  state = "post",
  line = INK,
  accent = RUST,
  ground = PAPER_LIGHT,
} = {}) {
  const f = (value) => value.toFixed(1);
  const stroke = f(size * 0.035);
  const tableWidth = size * 2.2;
  const tableHeight = size * 0.62;
  const left = cx - size * 1.45;
  const top = cy - tableHeight / 2;
  const chairRadius = size * 0.12;
  const gap = size * 0.24;

  const table = `<rect x="${f(left)}" y="${f(top)}" width="${f(tableWidth)}" height="${f(tableHeight)}" rx="${f(size * 0.04)}" fill="none" stroke="${line}" stroke-width="${stroke}"/>`;

  const chairs = [];
  for (const side of ["far", "near"]) {
    for (let i = 0; i < CHAIRS_PER_SIDE; i += 1) {
      const x = left + tableWidth * ((i + 0.5) / CHAIRS_PER_SIDE);
      const y = side === "far" ? top - gap : top + tableHeight + gap;
      const his = side === "near" && i === HIS_CHAIR;
      if (his && state !== "seated") {
        chairs.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(chairRadius)}" fill="${ground}" stroke="${line}" stroke-width="${stroke}" stroke-dasharray="${f(size * 0.05)} ${f(size * 0.04)}"/>`);
      } else {
        chairs.push(`<circle cx="${f(x)}" cy="${f(y)}" r="${f(chairRadius)}" fill="${his ? accent : line}"/>`);
      }
    }
  }

  // The grill stands off the end of the table: a kettle seen from above, its
  // grate bars running across the bowl.
  const grillRadius = size * 0.22;
  const grillX = left + tableWidth + size * 0.4 + grillRadius;
  const grillY = top + tableHeight + gap;
  const bars = [-0.5, 0, 0.5].map((t) => {
    const dy = grillRadius * t;
    const half = Math.sqrt(grillRadius ** 2 - dy ** 2) * 0.8;
    return `<line x1="${f(grillX - half)}" y1="${f(grillY + dy)}" x2="${f(grillX + half)}" y2="${f(grillY + dy)}" stroke="${line}" stroke-width="${stroke}"/>`;
  }).join("");
  const grill = `<circle cx="${f(grillX)}" cy="${f(grillY)}" r="${f(grillRadius)}" fill="none" stroke="${line}" stroke-width="${stroke}"/>${bars}`;

  // Whoever is holding the tongs stands just past the grill.
  const standX = grillX + grillRadius + size * 0.2;
  const dotRadius = chairRadius * 0.85;
  const standing = {
    post: [accent],
    handed: [accent, line],
    seated: [line],
  }[state].map((fill, i, all) => {
    const y = grillY + (i - (all.length - 1) / 2) * dotRadius * 2.6;
    return `<circle cx="${f(standX)}" cy="${f(y)}" r="${f(dotRadius)}" fill="${fill}"/>`;
  }).join("");

  return `<g opacity="0.94">${table}${chairs.join("")}${grill}${standing}</g>`;
}

const LABEL = "FIELD NOTE 31";

const slides = [
  // 1 — cover. Title lockup over the tongs on the grill shelf; the plan small, his chair empty.
  portraitCanvas({
    id: "fn31-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["HE'S BEEN AT THE GRILL"], {x: 64, y: 250, size: 76, leading: 90, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["SINCE NOON"], {x: 64, y: 340, size: 76, leading: 90, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["The man working the grill is at every party", "and in almost none of it."], {x: 68, y: 414, size: 28, leading: 38, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: TONGS, x: 380, y: 520, width: 560, height: 660, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn31-01"})}
    ${tape(600, 498, 214, -3)}
    ${tablePlan(190, 1060, {size: 74})}`,
  }),
  // 2 — torn oxblood field, reverse serif type; his chair dashed.
  portraitCanvas({
    id: "fn31-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="760" fill="${OXBLOOD}" transform="rotate(0.6 540 606)"/>
    ${tape(760, 204, 222, 3)}
    ${tape(200, 962, 196, -4)}
    ${lines(["Every backyard party has", "a man who hasn't sat down", "since noon."], {x: 106, y: 350, size: 54, leading: 72, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${tablePlan(520, 770, {size: 150, line: PAPER_LIGHT, accent: RUST, ground: OXBLOOD})}
    ${lines(["He is, to be clear,", "doing a real job."], {x: 76, y: 1100, size: 44, leading: 58, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 3 — documentary detail: the circle of lawn chairs.
  portraitCanvas({
    id: "fn31-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${photo({name: CHAIRS, x: 140, y: 150, width: 800, height: 740, rotation: -0.6, position: "xMidYMid", backing: OXBLOOD, id: "fn31-03"})}
    ${tape(440, 128, 220, 3)}
    ${lines(["It gives him a place to stand,", "which is half of what makes", "a party hard."], {x: 78, y: 990, size: 48, leading: 64, family: SERIF, weight: 700, tracking: 0})}`,
  }),
  // 4 — sparse, mark-led at full scale; he's at the grill.
  portraitCanvas({
    id: "fn31-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${lines(["The five most respected", "words in the backyard:"], {x: 74, y: 290, size: 62, leading: 80, family: SERIF, weight: 700, tracking: 0})}
    ${tablePlan(540, 700, {size: 230})}
    ${lines(["“I gotta flip these.”"], {x: 78, y: 1080, size: 64, leading: 76, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${scribble("M80 1150 C260 1136 450 1148 660 1140", RUST, 8)}`,
  }),
  // 5 — halftone field; his chair still dashed.
  portraitCanvas({
    id: "fn31-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="604" y="196" width="390" height="560" fill="url(#fn31-05-dots)"/>
    ${lines(["Every hour", "at the post is", "an hour nobody", "asks him how", "he's doing."], {x: 74, y: 300, size: 64, leading: 84, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The grill answers that", "question for him."], {x: 74, y: 820, size: 52, leading: 68, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${tablePlan(700, 1080, {size: 110, ground: PAPER})}`,
  }),
  // 6 — type-led on an oxblood field: the tongs changing hands.
  portraitCanvas({
    id: "fn31-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["The burgers", "will be worse."], {x: 74, y: 300, size: 86, leading: 104, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["That's just true."], {x: 78, y: 520, size: 44, leading: 56, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${tablePlan(540, 860, {size: 210, state: "handed", line: PAPER_LIGHT, ground: OXBLOOD})}`,
  }),
  // 7 — close, image-led on the hand-off; everyone seated, his chair in rust.
  portraitCanvas({
    id: "fn31-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: HANDOFF, x: 220, y: 150, width: 640, height: 680, rotation: 0.6, position: "xMidYMid", backing: GREEN, id: "fn31-07"})}
    ${tape(480, 128, 204, 3)}
    ${lines(["Close enough to smell what", "he'd have done differently,"], {x: 78, y: 920, size: 44, leading: 58, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["and hear the canoe story", "told with him in it."], {x: 80, y: 1050, size: 38, leading: 52, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${tablePlan(820, 1140, {size: 70, state: "seated"})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The tongs dominant, the
// chairs small beside them, and the mark run as a pair in the oxblood margin:
// him at the grill above, him seated below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn31-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: TONGS, x: 90, y: 70, width: 660, height: 860, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn31-feature"})}
  ${photo({name: CHAIRS, x: 790, y: 230, width: 400, height: 540, rotation: -1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn31-feature"})}
  ${tape(420, 46, 222, 4)}
  ${tape(880, 206, 196, -4)}
  ${tablePlan(1440, 300, {size: 64, line: PAPER_LIGHT, ground: OXBLOOD})}
  ${tablePlan(1440, 700, {size: 64, state: "seated", line: PAPER_LIGHT, ground: OXBLOOD})}
  ${scribble("M620 972 C724 948 832 984 936 956", RUST, 10)}
  ${grain(1600, 1000, "fn31-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 31 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-31-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "hes-been-at-the-grill-since-noon", feature);

console.log("Rendered the Field Note 31 feature image and seven carousel SVG and PNG pairs.");
