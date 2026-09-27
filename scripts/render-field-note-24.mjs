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

// Field Note 24 — "The Stake Was Supposed to Come Off". Founder-approved
// 2026-09-27; register position 23, no Ghost slot named.
//
// Signature vocabulary: a hand-drawn trunk taper — a young tree's trunk drawn
// as its two edges from a hatched ground line. In its staked state a stake
// stands beside it with a strap run across to the trunk, and the trunk rises
// straight and even, pinched at the strap and a little wider above it than
// below. In its free state there is no stake, the trunk flares at the ground
// like the bottom of a bell, and two short wind strokes pass the top. Same
// ground, same height, and the only thing that changes is whether anything is
// holding it still. No prior vocabularies: not the guide-coat profile, contact
// gap, counterbalance, load path, tolerance stack, downspout, strength curve,
// sling, transfer switch, battery gauge, route line, tally, ledger, alarm arc,
// diverging fork, anode section, bubble vial, branch stub or bead mark.
//
// Photography: two source images generated for this note under the house
// prompt and unique to it. Slide 6 is type-led by design: five generated bark
// close-ups all failed the quality gate at full resolution, so the grown-in
// strap is drawn rather than photographed.
const SAPLING = "editorial/staked-sapling-front-lawn.png";
const PULLED = "editorial/pulled-stakes-young-tree.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "sanding-longboard-bench", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "water-heater-top-fittings", "workbench-hand-tools"];

// Proportions are fractions of the mark's height, fixed so every render is
// byte-identical and the review sheet never drifts between runs.
const TOP_WIDTH = 0.045;
const BASE_FLARE = 0.17;
const STRAP_AT = 0.36;
const STAKE_HEIGHT = 0.55;

function trunkTaper(x, y, {
  height = 300,
  scale = 1,
  staked = false,
  grown = false,
  line = INK,
  fill = PAPER,
  stake = RUST,
  wind = OXBLOOD,
} = {}) {
  const s = scale;
  const H = height * s;
  const tw = H * TOP_WIDTH;
  const top = y - H;
  const f = (value) => value.toFixed(1);

  // A short hatched ground line, identical in both states.
  const groundWidth = H * 0.5;
  const hatches = Array.from({length: 6}, (_, index) => {
    const hx = x - groundWidth / 2 + (groundWidth / 5) * index;
    return `<line x1="${f(hx)}" y1="${f(y)}" x2="${f(hx - 10 * s)}" y2="${f(y + 12 * s)}" stroke="${line}" stroke-width="${2.5 * s}" opacity="0.6"/>`;
  }).join("");
  const ground = `<line x1="${f(x - groundWidth / 2)}" y1="${f(y)}" x2="${f(x + groundWidth / 2)}" y2="${f(y)}" stroke="${line}" stroke-width="${4 * s}" stroke-linecap="round"/>${hatches}`;

  let trunk;
  let extra = "";
  if (staked) {
    // Straight and even, pinched at the strap, a little wider above than below:
    // the reverse taper a tree held still grows into.
    const strapY = y - H * STRAP_AT;
    const below = tw;
    const above = tw * 1.3;
    trunk = `M${f(x - below / 2)} ${f(y)} L${f(x - below / 2)} ${f(strapY)} L${f(x - above / 2)} ${f(strapY - 8 * s)} L${f(x - above / 2)} ${f(top)} L${f(x + above / 2)} ${f(top)} L${f(x + above / 2)} ${f(strapY - 8 * s)} L${f(x + below / 2)} ${f(strapY)} L${f(x + below / 2)} ${f(y)} Z`;
    const stakeX = x + H * 0.16;
    // Grown in: the stake is long gone, the strap is inside the trunk, and the
    // bark has rolled over it from above and below.
    if (grown) {
      const bulge = below * 2;
      const grownTrunk = `M${f(x - below / 2)} ${f(y)} L${f(x - below / 2)} ${f(strapY)} C${f(x - bulge / 2)} ${f(strapY - 6 * s)} ${f(x - bulge / 2)} ${f(strapY - 26 * s)} ${f(x - above / 2)} ${f(strapY - 44 * s)} L${f(x - above / 2)} ${f(top)} L${f(x + above / 2)} ${f(top)} L${f(x + above / 2)} ${f(strapY - 44 * s)} C${f(x + bulge / 2)} ${f(strapY - 26 * s)} ${f(x + bulge / 2)} ${f(strapY - 6 * s)} ${f(x + below / 2)} ${f(strapY)} L${f(x + below / 2)} ${f(y)} Z`;
      const band = `<line x1="${f(x - below / 2 - 3 * s)}" y1="${f(strapY)}" x2="${f(x + below / 2 + 3 * s)}" y2="${f(strapY)}" stroke="${stake}" stroke-width="${6 * s}" stroke-linecap="round"/>`;
      return `${ground}<path d="${grownTrunk}" fill="${fill}" stroke="${line}" stroke-width="${4 * s}" stroke-linejoin="round"/>${band}`;
    }
    extra = `<rect x="${f(stakeX - 4 * s)}" y="${f(y - H * STAKE_HEIGHT)}" width="${f(8 * s)}" height="${f(H * STAKE_HEIGHT)}" fill="${stake}"/>
    <line x1="${f(x + below / 2)}" y1="${f(strapY)}" x2="${f(stakeX)}" y2="${f(strapY)}" stroke="${stake}" stroke-width="${5 * s}" stroke-linecap="round"/>`;
  } else {
    // Flared at the ground like the bottom of a bell, narrowing to the same top.
    const bw = H * BASE_FLARE;
    const neck = y - H * 0.4;
    trunk = `M${f(x - bw / 2)} ${f(y)} C${f(x - tw / 2 - 2 * s)} ${f(y - H * 0.06)} ${f(x - tw / 2)} ${f(y - H * 0.22)} ${f(x - tw / 2)} ${f(neck)} L${f(x - tw / 2)} ${f(top)} L${f(x + tw / 2)} ${f(top)} L${f(x + tw / 2)} ${f(neck)} C${f(x + tw / 2)} ${f(y - H * 0.22)} ${f(x + tw / 2 + 2 * s)} ${f(y - H * 0.06)} ${f(x + bw / 2)} ${f(y)} Z`;
    // Two short wind strokes passing the top, clear of the trunk on one side.
    const w1 = top + H * 0.08;
    const w2 = top + H * 0.18;
    // Kept well clear of the trunk so the pair reads as moving air, not a flag.
    const gap = tw / 2 + H * 0.16;
    extra = `<path d="M${f(x - gap - H * 0.3)} ${f(w1)} C${f(x - gap - H * 0.2)} ${f(w1 - 12 * s)} ${f(x - gap - H * 0.1)} ${f(w1 + 10 * s)} ${f(x - gap)} ${f(w1 - 4 * s)}" fill="none" stroke="${wind}" stroke-width="${4 * s}" stroke-linecap="round" opacity="0.85"/>
    <path d="M${f(x - gap - H * 0.22)} ${f(w2)} C${f(x - gap - H * 0.14)} ${f(w2 - 8 * s)} ${f(x - gap - H * 0.06)} ${f(w2 + 8 * s)} ${f(x - gap)} ${f(w2 - 3 * s)}" fill="none" stroke="${wind}" stroke-width="${3 * s}" stroke-linecap="round" opacity="0.6"/>`;
  }

  return `${ground}<path d="${trunk}" fill="${fill}" stroke="${line}" stroke-width="${4 * s}" stroke-linejoin="round"/>${extra}`;
}

const LABEL = "FIELD NOTE 24";

const slides = [
  // 1 — cover. Title lockup, the staked sapling, the mark small in its staked state.
  portraitCanvas({
    id: "fn24-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["THE STAKE WAS SUPPOSED"], {x: 64, y: 250, size: 70, leading: 84, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["TO COME OFF."], {x: 64, y: 344, size: 88, leading: 104, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["Low on the trunk. Loose enough that the top", "can move. Out in a year."], {x: 68, y: 410, size: 30, leading: 42, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: SAPLING, x: 300, y: 500, width: 580, height: 640, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn24-01"})}
    ${tape(640, 476, 214, 4)}
    ${trunkTaper(160, 1210, {height: 200, staked: true})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. What the stake is for.
  portraitCanvas({
    id: "fn24-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="700" fill="${OXBLOOD}" transform="rotate(0.8 540 576)"/>
    ${tape(760, 204, 222, 3)}
    ${tape(140, 902, 196, -4)}
    ${lines(["The stake is not", "there to hold", "the tree up."], {x: 106, y: 350, size: 72, leading: 94, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${trunkTaper(820, 840, {height: 300, staked: true, line: PAPER, fill: OXBLOOD, stake: PAPER_LIGHT})}
    ${lines(["It is there to hold", "the roots still."], {x: 76, y: 1060, size: 52, leading: 68, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — sparse, mark-led at full scale, free state. What the wind is for.
  portraitCanvas({
    id: "fn24-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${lines(["A tree builds its trunk", "out of being", "pushed around."], {x: 74, y: 300, size: 70, leading: 90, family: SERIF, weight: 700, tracking: 0})}
    ${trunkTaper(620, 1010, {height: 460})}
    ${lines(["Hold the top still and nothing is asking."], {x: 76, y: 1130, size: 40, leading: 56, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 4 — the mark at full scale, staked. Tall and even and thin.
  portraitCanvas({
    id: "fn24-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${trunkTaper(300, 900, {height: 640, staked: true})}
    ${lines(["It comes out", "tall and even", "and thin."], {x: 480, y: 360, size: 66, leading: 86, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Straight as a flagpole,", "right up until the", "stake comes out."], {x: 482, y: 690, size: 42, leading: 58, family: SERIF, weight: 400, fill: OXBLOOD, tracking: 0.2})}
    ${scribble("M80 1150 C300 1112 520 1174 742 1128 C862 1104 942 1138 1002 1118", RUST, 9)}`,
  }),
  // 5 — halftone field, the tightening that is always justified.
  portraitCanvas({
    id: "fn24-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="596" y="196" width="398" height="560" fill="url(#fn24-05-dots)"/>
    ${lines(["Each one", "prevents", "a lean."], {x: 74, y: 320, size: 84, leading: 104, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Each one is true."], {x: 74, y: 700, size: 58, leading: 74, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${lines(["He takes the drill back halfway through", "the hole because the angle is off."], {x: 74, y: 900, size: 36, leading: 52, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${trunkTaper(840, 1200, {height: 180, staked: true})}`,
  }),
  // 6 — type-led on an oxblood field, the mark grown in: no stake, the strap inside the trunk.
  portraitCanvas({
    id: "fn24-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["A strap left on", "long enough stops", "being on the tree", "and starts being", "in it."], {x: 74, y: 300, size: 64, leading: 84, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${trunkTaper(800, 1060, {height: 560, staked: true, grown: true, line: PAPER, fill: OXBLOOD, stake: RUST})}
    ${lines(["All it does now", "is squeeze."], {x: 76, y: 1010, size: 46, leading: 62, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}`,
  }),
  // 7 — close, image-led on a trunk that was let move.
  portraitCanvas({
    id: "fn24-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: PULLED, x: 224, y: 152, width: 632, height: 660, rotation: 0.6, position: "xMidYMid", backing: GREEN, id: "fn24-07"})}
    ${tape(620, 130, 204, 3)}
    ${lines(["The lean is also the first day", "the trunk has had anything to read."], {x: 78, y: 900, size: 42, leading: 58, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The strap is his."], {x: 80, y: 1060, size: 44, leading: 58, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The staked sapling
// dominant, the pulled stakes small beside it, and the mark run as a pair in
// the oxblood margin — staked above, free below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn24-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: SAPLING, x: 90, y: 70, width: 660, height: 860, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn24-feature"})}
  ${photo({name: PULLED, x: 790, y: 210, width: 400, height: 560, rotation: -1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn24-feature"})}
  ${tape(380, 46, 222, 4)}
  ${tape(850, 186, 196, -4)}
  ${trunkTaper(1422, 440, {height: 300, staked: true, line: PAPER, fill: OXBLOOD, stake: PAPER_LIGHT})}
  ${trunkTaper(1422, 900, {height: 300, line: PAPER, fill: OXBLOOD, wind: PAPER_LIGHT})}
  ${scribble("M620 972 C724 948 832 984 936 956", RUST, 10)}
  ${grain(1600, 1000, "fn24-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 24 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-24-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-stake-was-supposed-to-come-off", feature);

console.log("Rendered the Field Note 24 feature image and seven carousel SVG and PNG pairs.");
