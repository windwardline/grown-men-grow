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

// Field Note 29 — "Nobody Bids a Job at 3 A.M." Founder-approved
// 2026-10-21; register position 28, no Ghost slot named.
//
// Signature vocabulary: a hand-drawn flashlight mark — a short barrel and a
// flared head, with the cone it would throw drawn ahead of it. In its off state
// the cone is only a dashed outline, the shape of a look nobody took: the night
// bid. In its on state the cone is filled rust: the job walked. In its pair
// state two flashlights come in from either side and their cones cross on the
// same spot: the walk with somebody holding the other flashlight. The cone's
// shape never changes; only whether anybody switched it on. No prior
// vocabularies: not the sweep mark, bitting profile, centering mark, scorebook
// box, trunk taper, guide-coat profile, contact gap, counterbalance, load path,
// tolerance stack, downspout, strength curve, sling, transfer switch, battery
// gauge, route line, tally, ledger, alarm arc, diverging fork, anode section,
// bubble vial, branch stub or bead mark.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const HALL = "editorial/hallway-flashlight-first-light.png";
const TOOLS = "editorial/screwdriver-flashlight-tub-floor.png";
const PORCH = "editorial/two-flashlights-porch-step.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-chalk-line-low-sun", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "cafe-table-two-bottles", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "first-bowl-studio-shelf", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "infield-glove-raked-dirt", "kitchen-counter-pause", "kitchen-table-milk-towel", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "lopsided-bowl-entry-console", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "pitchers-mound-rosin-bag", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "pulled-stakes-young-tree", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "saddle-bag-kit-bench", "sanding-longboard-bench", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "staked-sapling-front-lawn", "sunlit-writing-table", "switchback-climb-morning", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "ware-board-six-cups", "water-heater-top-fittings", "workbench-hand-tools", "worn-hammer-handle-pegboard", "worn-key-and-copy-counter"];

// One flashlight pointing right, its barrel starting at (x, y). The cone's
// proportions are fixed so the off and on states differ only in the fill.
function flashlight(x, y, {width, lit, line, beam}) {
  const f = (value) => value.toFixed(1);
  const barrelLength = width * 0.2;
  const barrelHalf = width * 0.032;
  const headLength = width * 0.07;
  const headHalf = width * 0.058;
  const coneEnd = width;
  const coneHalf = width * 0.24;
  const stroke = f(width * 0.012);
  const headStart = x + barrelLength;
  const lens = headStart + headLength;

  const barrel = `<rect x="${f(x)}" y="${f(y - barrelHalf)}" width="${f(barrelLength)}" height="${f(barrelHalf * 2)}" rx="${f(barrelHalf * 0.5)}" fill="${line}"/>`;
  const head = `<polygon points="${f(headStart)},${f(y - barrelHalf)} ${f(lens)},${f(y - headHalf)} ${f(lens)},${f(y + headHalf)} ${f(headStart)},${f(y + barrelHalf)}" fill="${line}"/>`;
  const conePoints = `${f(lens)},${f(y - headHalf)} ${f(x + coneEnd)},${f(y - coneHalf)} ${f(x + coneEnd)},${f(y + coneHalf)} ${f(lens)},${f(y + headHalf)}`;
  const cone = lit
    ? `<polygon points="${conePoints}" fill="${beam}" opacity="0.88"/>`
    : `<polygon points="${conePoints}" fill="none" stroke="${line}" stroke-width="${stroke}" stroke-dasharray="${f(width * 0.03)} ${f(width * 0.026)}" stroke-linejoin="round"/>`;
  return `${cone}${barrel}${head}`;
}

function beamMark(x, y, {
  width = 300,
  state = "off",
  line = INK,
  beam = RUST,
} = {}) {
  if (state !== "pair") {
    return flashlight(x, y, {width, lit: state === "on", line, beam});
  }
  // Two lights held one above the other, each tilted toward the other, so
  // their cones overlap on the same spot near the far end.
  const tilt = 13;
  const offset = width * 0.8 * Math.tan((tilt * Math.PI) / 180);
  const one = flashlight(0, 0, {width, lit: true, line, beam});
  const f = (value) => value.toFixed(1);
  return `<g opacity="0.92"><g transform="translate(${f(x)} ${f(y - offset)}) rotate(${tilt})">${one}</g>`
    + `<g transform="translate(${f(x)} ${f(y + offset)}) rotate(${-tilt})">${one}</g></g>`;
}

const LABEL = "FIELD NOTE 29";

const slides = [
  // 1 — cover. Title lockup over the hallway at first light; the mark small and off.
  portraitCanvas({
    id: "fn29-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["NOBODY BIDS A JOB"], {x: 64, y: 250, size: 80, leading: 92, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["AT 3 A.M."], {x: 64, y: 342, size: 80, leading: 92, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["The man who prices every worry in the house", "at four in the morning has never walked", "a single one of them."], {x: 68, y: 416, size: 28, leading: 38, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: HALL, x: 330, y: 540, width: 600, height: 640, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn29-01"})}
    ${tape(560, 518, 214, -3)}
    ${beamMark(70, 1140, {width: 230})}`,
  }),
  // 2 — torn oxblood field, reverse serif type; the light off.
  portraitCanvas({
    id: "fn29-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="760" fill="${OXBLOOD}" transform="rotate(0.6 540 606)"/>
    ${tape(180, 204, 222, -3)}
    ${tape(760, 962, 196, 4)}
    ${lines(["There's a contractor", "who only works nights."], {x: 106, y: 360, size: 68, leading: 90, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${beamMark(130, 760, {width: 520, line: PAPER_LIGHT})}
    ${lines(["He's never once come in under. In fairness,", "he's never been inside any of the buildings."], {x: 76, y: 1100, size: 38, leading: 54, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 3 — documentary detail: what the estimator brings to a soft floor.
  portraitCanvas({
    id: "fn29-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${photo({name: TOOLS, x: 150, y: 150, width: 780, height: 740, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn29-03"})}
    ${tape(420, 128, 220, 3)}
    ${lines(["Anybody who bids work for a living", "learns early not to price a job", "over the phone."], {x: 78, y: 990, size: 50, leading: 66, family: SERIF, weight: 700, tracking: 0})}`,
  }),
  // 4 — sparse, mark-led at full scale, off.
  portraitCanvas({
    id: "fn29-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${lines(["A bid made with", "no walk at all,", "from bed, in the dark,"], {x: 74, y: 290, size: 70, leading: 90, family: SERIF, weight: 700, tracking: 0})}
    ${beamMark(110, 820, {width: 820})}
    ${lines(["is mostly contingency."], {x: 78, y: 1130, size: 56, leading: 70, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${scribble("M80 1184 C250 1170 440 1182 640 1174", RUST, 8)}`,
  }),
  // 5 — halftone field; the light switched on, small.
  portraitCanvas({
    id: "fn29-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="596" y="196" width="398" height="560" fill="url(#fn29-05-dots)"/>
    ${lines(["Not because", "things look better", "in daylight."], {x: 74, y: 300, size: 74, leading: 96, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The walk changes", "what kind of number it is."], {x: 74, y: 880, size: 52, leading: 68, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${beamMark(640, 1180, {width: 340, state: "on"})}`,
  }),
  // 6 — type-led on an oxblood field: the light on at full scale.
  portraitCanvas({
    id: "fn29-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["What the walk buys", "isn't a better number."], {x: 74, y: 300, size: 68, leading: 88, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["It's a job instead of a dread."], {x: 78, y: 520, size: 50, leading: 64, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${beamMark(110, 920, {width: 820, state: "on", line: PAPER_LIGHT, beam: RUST})}`,
  }),
  // 7 — close, image-led on the porch step; the pair, cones crossing.
  portraitCanvas({
    id: "fn29-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: PORCH, x: 230, y: 150, width: 620, height: 680, rotation: 0.6, position: "xMidYMid", backing: OXBLOOD, id: "fn29-07"})}
    ${tape(500, 128, 204, 3)}
    ${lines(["Nothing gets signed off", "a bid nobody walked."], {x: 78, y: 920, size: 46, leading: 60, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["At seven it can be walked, alone or with", "somebody holding the other flashlight."], {x: 80, y: 1050, size: 36, leading: 50, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${beamMark(720, 1190, {width: 280, state: "pair"})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The hallway dominant, the
// porch step small beside it, and the mark run as a pair in the oxblood margin:
// switched off above, two lights crossing below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn29-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: HALL, x: 90, y: 70, width: 660, height: 860, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn29-feature"})}
  ${photo({name: PORCH, x: 790, y: 230, width: 400, height: 540, rotation: -1.4, position: "xMidYMid", backing: GREEN, id: "fn29-feature"})}
  ${tape(420, 46, 222, 4)}
  ${tape(880, 206, 196, -4)}
  ${beamMark(1290, 330, {width: 260, line: PAPER_LIGHT})}
  ${beamMark(1290, 690, {width: 260, state: "pair", line: PAPER_LIGHT})}
  ${scribble("M620 972 C724 948 832 984 936 956", RUST, 10)}
  ${grain(1600, 1000, "fn29-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 29 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-29-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "nobody-bids-a-job-at-3-am", feature);

console.log("Rendered the Field Note 29 feature image and seven carousel SVG and PNG pairs.");
