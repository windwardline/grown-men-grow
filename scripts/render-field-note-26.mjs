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

// Field Note 26 — "He Hasn't Been Bad at Anything in Years". Founder-approved
// 2026-10-13; register position 24, no Ghost slot named.
//
// Signature vocabulary: a hand-drawn centering mark — a wheel head seen from
// above, drawn as one ink circle with a small rust cross at its true center,
// and inside it three throwing rings of clay. In its off state the rings sit
// to one side of the cross and the innermost ring is broken, the wobble a
// beginner's clay makes on its first night. In its true state the same three
// rings share the cross and close. Same wheel, same clay, and the only thing
// that changes is whether the clay has found the center. No prior
// vocabularies: not the scorebook box, trunk taper, guide-coat profile,
// contact gap, counterbalance, load path, tolerance stack, downspout,
// strength curve, sling, transfer switch, battery gauge, route line, tally,
// ledger, alarm arc, diverging fork, anode section, bubble vial, branch stub
// or bead mark.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const BOWL = "editorial/first-bowl-studio-shelf.png";
const CUPS = "editorial/ware-board-six-cups.png";
const LOPSIDED = "editorial/lopsided-bowl-entry-console.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-chalk-line-low-sun", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "infield-glove-raked-dirt", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "pitchers-mound-rosin-bag", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "pulled-stakes-young-tree", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "sanding-longboard-bench", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "staked-sapling-front-lawn", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "water-heater-top-fittings", "workbench-hand-tools"];

// Proportions are fractions of the wheel's radius, fixed so every render is
// byte-identical and the review sheet never drifts between runs.
const RINGS = [0.62, 0.44, 0.26];
const OFFSET = 0.2;
const CROSS = 0.09;

function centeringMark(x, y, {
  radius = 120,
  centered = false,
  line = INK,
  clay = SMOKE,
  center = RUST,
} = {}) {
  const r = radius;
  const f = (value) => value.toFixed(1);
  const cx = centered ? x : x + r * OFFSET;
  const cy = centered ? y : y - r * OFFSET * 0.6;

  const wheel = `<circle cx="${f(x)}" cy="${f(y)}" r="${f(r)}" fill="none" stroke="${line}" stroke-width="${f(r * 0.035)}"/>`;
  const rings = RINGS.map((ratio, index) => {
    const rr = r * ratio;
    const width = f(r * (0.05 - index * 0.008));
    // Off center, the innermost ring does not close: a gap on the side the
    // clay is pulling toward.
    if (!centered && index === RINGS.length - 1) {
      const start = -0.15 * Math.PI;
      const end = 1.55 * Math.PI;
      const sx = cx + rr * Math.cos(start);
      const sy = cy + rr * Math.sin(start);
      const ex = cx + rr * Math.cos(end);
      const ey = cy + rr * Math.sin(end);
      return `<path d="M${f(sx)} ${f(sy)} A${f(rr)} ${f(rr)} 0 1 1 ${f(ex)} ${f(ey)}" fill="none" stroke="${clay}" stroke-width="${width}" stroke-linecap="round"/>`;
    }
    return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(rr)}" fill="none" stroke="${clay}" stroke-width="${width}"/>`;
  }).join("");
  const c = r * CROSS;
  const cross = `<line x1="${f(x - c)}" y1="${f(y)}" x2="${f(x + c)}" y2="${f(y)}" stroke="${center}" stroke-width="${f(r * 0.04)}" stroke-linecap="round"/>
    <line x1="${f(x)}" y1="${f(y - c)}" x2="${f(x)}" y2="${f(y + c)}" stroke="${center}" stroke-width="${f(r * 0.04)}" stroke-linecap="round"/>`;

  return `${wheel}${rings}${cross}`;
}

const LABEL = "FIELD NOTE 26";

const slides = [
  // 1 — cover. Title lockup, the first bowl, the mark small and off center.
  portraitCanvas({
    id: "fn26-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["HE HASN'T BEEN BAD"], {x: 64, y: 250, size: 74, leading: 88, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["AT ANYTHING IN YEARS."], {x: 64, y: 340, size: 74, leading: 88, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["Every hour of his week goes to something", "he's been good at since dial-up."], {x: 68, y: 410, size: 30, leading: 42, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: BOWL, x: 300, y: 500, width: 580, height: 640, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn26-01"})}
    ${tape(360, 476, 214, -4)}
    ${centeringMark(170, 1130, {radius: 90})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. The ashtray.
  portraitCanvas({
    id: "fn26-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="700" fill="${OXBLOOD}" transform="rotate(-0.8 540 576)"/>
    ${tape(150, 204, 222, -3)}
    ${tape(760, 902, 196, 4)}
    ${lines(["The first night", "on a pottery wheel", "produces an ashtray."], {x: 106, y: 350, size: 70, leading: 92, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${centeringMark(830, 760, {radius: 120, line: PAPER, clay: PAPER_LIGHT, center: RUST})}
    ${lines(["It was supposed", "to be a bowl."], {x: 76, y: 1060, size: 56, leading: 72, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 3 — documentary detail: the row of cups, a week apart.
  portraitCanvas({
    id: "fn26-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${photo({name: CUPS, x: 120, y: 150, width: 840, height: 720, rotation: 0.6, position: "xMidYMid", backing: OXBLOOD, id: "fn26-03"})}
    ${tape(420, 128, 220, 3)}
    ${lines(["Beginners improve faster", "than anybody alive."], {x: 78, y: 960, size: 56, leading: 72, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Nearly everything counts."], {x: 80, y: 1130, size: 42, leading: 56, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 4 — sparse, mark-led at full scale, off center. The flat end of the curve.
  portraitCanvas({
    id: "fn26-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${lines(["A man who only does", "what he already does", "well has parked his", "whole life on the flat", "end of every curve", "he owns."], {x: 74, y: 280, size: 58, leading: 76, family: SERIF, weight: 700, tracking: 0})}
    ${centeringMark(700, 940, {radius: 200})}
    ${scribble("M80 1222 C300 1202 520 1218 742 1210 C862 1206 942 1212 1002 1210", RUST, 8)}`,
  }),
  // 5 — halftone field, the room.
  portraitCanvas({
    id: "fn26-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="596" y="196" width="398" height="560" fill="url(#fn26-05-dots)"/>
    ${lines(["Being a", "beginner", "happens in", "front of", "people."], {x: 74, y: 300, size: 80, leading: 98, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["He isn't wrong that it", "costs something."], {x: 74, y: 920, size: 50, leading: 66, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${centeringMark(860, 1180, {radius: 80})}`,
  }),
  // 6 — type-led on an oxblood field, the mark found true.
  portraitCanvas({
    id: "fn26-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["Nobody in the", "beginner's room", "needs him."], {x: 74, y: 300, size: 72, leading: 92, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${centeringMark(780, 800, {radius: 190, centered: true, line: PAPER, clay: PAPER_LIGHT, center: RUST})}
    ${lines(["For two hours, the job", "of knowing belongs", "to somebody else."], {x: 76, y: 1040, size: 44, leading: 60, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}`,
  }),
  // 7 — close, image-led on the bowl that holds keys.
  portraitCanvas({
    id: "fn26-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: LOPSIDED, x: 224, y: 152, width: 632, height: 660, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn26-07"})}
    ${tape(300, 130, 204, -3)}
    ${lines(["It doesn't sit flat. It holds keys."], {x: 78, y: 900, size: 46, leading: 60, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The first thing in years he's", "watched himself get better at."], {x: 80, y: 1010, size: 42, leading: 56, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${centeringMark(940, 1170, {radius: 60, centered: true})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The first bowl dominant,
// the row of cups small beside it, and the mark run as a pair in the oxblood
// margin — off center above, true below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn26-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: BOWL, x: 90, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn26-feature"})}
  ${photo({name: CUPS, x: 790, y: 210, width: 400, height: 560, rotation: 1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn26-feature"})}
  ${tape(380, 46, 222, -4)}
  ${tape(850, 186, 196, 4)}
  ${centeringMark(1422, 290, {radius: 120, line: PAPER, clay: PAPER_LIGHT, center: RUST})}
  ${centeringMark(1422, 720, {radius: 120, centered: true, line: PAPER, clay: PAPER_LIGHT, center: RUST})}
  ${scribble("M620 972 C724 948 832 984 936 956", RUST, 10)}
  ${grain(1600, 1000, "fn26-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 26 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-26-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "he-hasnt-been-bad-at-anything-in-years", feature);

console.log("Rendered the Field Note 26 feature image and seven carousel SVG and PNG pairs.");
