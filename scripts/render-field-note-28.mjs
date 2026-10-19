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

// Field Note 28 — "The Sweep Has Nowhere Else to Be". Founder-approved
// 2026-10-19; register position 27, no Ghost slot named.
//
// Signature vocabulary: a hand-drawn sweep mark — a short road line with five
// small open circles strung along it for riders and one solid rust dot for the
// sweep. In its regroup state the circles sit bunched at the far end of a level
// line and the dot is tucked behind the last of them. In its climb state the
// line tilts uphill, four circles string out near the top and the last sits far
// back with a wide gap in front of it, and the dot is still touching it from
// behind. In its flat state the line is level again, the gap is still there,
// and the dot has moved just in front of the last circle: a wheel to sit on.
// The group changes shape; the dot's distance from the last circle never does.
// No prior vocabularies: not the bitting profile, centering mark, scorebook
// box, trunk taper, guide-coat profile, contact gap, counterbalance, load path,
// tolerance stack, downspout, strength curve, sling, transfer switch, battery
// gauge, route line, tally, ledger, alarm arc, diverging fork, anode section,
// bubble vial, branch stub or bead mark.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const CLIMB = "editorial/switchback-climb-morning.png";
const KIT = "editorial/saddle-bag-kit-bench.png";
const CAFE = "editorial/cafe-table-two-bottles.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-chalk-line-low-sun", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "first-bowl-studio-shelf", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "infield-glove-raked-dirt", "kitchen-counter-pause", "kitchen-table-milk-towel", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "lopsided-bowl-entry-console", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "pitchers-mound-rosin-bag", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "pulled-stakes-young-tree", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "sanding-longboard-bench", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "staked-sapling-front-lawn", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "ware-board-six-cups", "water-heater-top-fittings", "workbench-hand-tools", "worn-hammer-handle-pegboard", "worn-key-and-copy-counter"];

// Rider positions along the line, as fractions of its length, front first.
// Fixed so every render is byte-identical and the review sheet never drifts.
const BUNCHED = [0.94, 0.855, 0.77, 0.685, 0.6];
const STRUNG = [0.92, 0.82, 0.72, 0.62, 0.24];
// The one constant: how far the sweep sits from the last rider, either side.
const SWEEP_OFFSET = 0.075;

function sweepMark(x, y, {
  width = 300,
  state = "climb",
  line = INK,
  dot = RUST,
} = {}) {
  const f = (value) => value.toFixed(1);
  const rise = state === "climb" ? width * 0.26 : 0;
  const r = width * 0.03;
  const stroke = f(width * 0.01);
  const at = (t) => [x + width * t, y - rise * t];

  const riders = state === "regroup" ? BUNCHED : STRUNG;
  const last = riders[riders.length - 1];
  const sweepT = state === "flat" ? last + SWEEP_OFFSET : last - SWEEP_OFFSET;

  // Circles sit on the road, so each center is lifted one radius off the line.
  const lift = (t) => {
    const [px, py] = at(t);
    return [px, py - r * 1.15];
  };
  const [x1, y1] = at(0);
  const [x2, y2] = at(1);
  const road = `<line x1="${f(x1)}" y1="${f(y1)}" x2="${f(x2)}" y2="${f(y2)}" stroke="${line}" stroke-width="${stroke}" stroke-linecap="round"/>`;
  const circles = riders.map((t) => {
    const [cx, cy] = lift(t);
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="none" stroke="${line}" stroke-width="${stroke}"/>`;
  }).join("");
  const [sx, sy] = lift(sweepT);
  const sweep = `<circle cx="${f(sx)}" cy="${f(sy)}" r="${f(r * 0.92)}" fill="${dot}"/>`;
  return `${road}${circles}${sweep}`;
}

const LABEL = "FIELD NOTE 28";

const slides = [
  // 1 — cover. Title lockup over the empty climb; the mark small, climbing.
  portraitCanvas({
    id: "fn28-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["THE SWEEP HAS"], {x: 64, y: 250, size: 80, leading: 92, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["NOWHERE ELSE TO BE."], {x: 64, y: 342, size: 80, leading: 92, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["On a no-drop ride, one rider's whole job", "is to finish last, right behind him."], {x: 68, y: 416, size: 30, leading: 42, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: CLIMB, x: 300, y: 500, width: 600, height: 650, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn28-01"})}
    ${tape(540, 478, 214, 3)}
    ${sweepMark(84, 1210, {width: 190})}`,
  }),
  // 2 — torn oxblood field, reverse serif type; the group strung up the hill.
  portraitCanvas({
    id: "fn28-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="760" fill="${OXBLOOD}" transform="rotate(-0.7 540 606)"/>
    ${tape(720, 204, 222, 3)}
    ${tape(150, 962, 196, -4)}
    ${lines(["The gap opens the way", "gaps always open,", "which is politely."], {x: 106, y: 350, size: 66, leading: 86, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${sweepMark(150, 900, {width: 760, line: PAPER_LIGHT})}
    ${lines(["He isn't alone with it.", "The sweep is behind him."], {x: 76, y: 1100, size: 50, leading: 66, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 3 — documentary detail: the spares the sweep carries for everybody.
  portraitCanvas({
    id: "fn28-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${photo({name: KIT, x: 150, y: 150, width: 780, height: 740, rotation: 0.6, position: "xMidYMid", backing: OXBLOOD, id: "fn28-03"})}
    ${tape(420, 128, 220, -3)}
    ${lines(["Nobody rides behind the sweep."], {x: 78, y: 980, size: 54, leading: 68, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The last man is the job."], {x: 80, y: 1070, size: 46, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 4 — sparse, mark-led at full scale, climbing.
  portraitCanvas({
    id: "fn28-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${lines(["If the last man is going", "nine miles an hour", "up the hill, so is", "the sweep,"], {x: 74, y: 290, size: 70, leading: 90, family: SERIF, weight: 700, tracking: 0})}
    ${sweepMark(150, 1000, {width: 780})}
    ${lines(["who could do eighteen."], {x: 78, y: 1130, size: 52, leading: 66, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${scribble("M80 1184 C250 1170 420 1180 600 1174", RUST, 8)}`,
  }),
  // 5 — halftone field, the refusal.
  portraitCanvas({
    id: "fn28-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="596" y="196" width="398" height="560" fill="url(#fn28-05-dots)"/>
    ${lines(["A sweep who", "goes on ahead", "isn't a sweep."], {x: 74, y: 300, size: 78, leading: 98, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["He's a man who left", "somebody on a hill", "and went for coffee."], {x: 74, y: 880, size: 52, leading: 68, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${sweepMark(700, 1200, {width: 240, state: "regroup"})}`,
  }),
  // 6 — type-led on an oxblood field: the sweep moved in front, a wheel to sit on.
  portraitCanvas({
    id: "fn28-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["The sweep takes the", "wind full in the face", "so the man behind him", "doesn't have to."], {x: 74, y: 300, size: 64, leading: 84, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["Nobody mentions it."], {x: 78, y: 720, size: 48, leading: 62, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${sweepMark(150, 1000, {width: 780, state: "flat", line: PAPER_LIGHT})}`,
  }),
  // 7 — close, image-led on the café table.
  portraitCanvas({
    id: "fn28-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: CAFE, x: 230, y: 150, width: 620, height: 680, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn28-07"})}
    ${tape(500, 128, 204, -3)}
    ${lines(["The sweep's ride uploads", "like everyone else's."], {x: 78, y: 920, size: 46, leading: 60, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It sits on his profile under his name", "for anybody to see, with no caption."], {x: 80, y: 1050, size: 36, leading: 50, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${sweepMark(780, 1200, {width: 200, state: "regroup"})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The climb dominant, the
// café table small beside it, and the mark run as a pair in the oxblood margin:
// climbing above, regrouped below, the dot touching the last circle in both.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn28-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: CLIMB, x: 90, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn28-feature"})}
  ${photo({name: CAFE, x: 790, y: 230, width: 400, height: 540, rotation: 1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn28-feature"})}
  ${tape(420, 46, 222, -4)}
  ${tape(880, 206, 196, 4)}
  ${sweepMark(1300, 360, {width: 250, line: PAPER_LIGHT})}
  ${sweepMark(1300, 700, {width: 250, state: "regroup", line: PAPER_LIGHT})}
  ${scribble("M620 972 C724 948 832 984 936 956", RUST, 10)}
  ${grain(1600, 1000, "fn28-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 28 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-28-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-sweep-has-nowhere-else-to-be", feature);

console.log("Rendered the Field Note 28 feature image and seven carousel SVG and PNG pairs.");
