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

// Field Note 23 — "Everything Looks Straight in Primer". Draft 2026-09-23; not
// founder-approved and holding no register position.
//
// Signature vocabulary: a hand-drawn guide-coat profile — a panel's surface
// drawn edge-on as one line with three shallow dips in it. In its primer state
// the line sits over a flat grey band and the dips read as nothing, because
// one colour gives the eye nothing to find. In its blocked state a long flat
// sanding block rests on the highs and the dips fill with dark: the lows keep
// the guide coat. Same line, same dips, and the only thing that changes is
// whether something from outside has been laid across it. No prior
// vocabularies: not the contact gap, counterbalance, load path, tolerance
// stack, downspout, strength curve, sling, transfer switch, battery gauge,
// route line, tally, ledger, alarm arc, diverging fork, anode section, bubble
// vial, branch stub or bead mark.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const PANEL = "editorial/primer-panel-guide-coat.png";
const BLOCK = "editorial/sanding-longboard-bench.png";
const GLOSS = "editorial/gloss-panel-low-sun.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "water-heater-top-fittings", "workbench-hand-tools"];

// Dip centres, depths, and half-widths as fractions of the mark's width. Fixed
// rather than random, so every render is byte-identical and the review sheet
// never drifts between runs.
const DIPS = [
  {at: 0.2, depth: 14, spread: 0.07},
  {at: 0.52, depth: 22, spread: 0.09},
  {at: 0.8, depth: 10, spread: 0.05},
];
const STEPS = 60;

// Depths are in pixels at the 360-wide reference size and grow with the mark,
// so a full-width mark shows its lows as plainly as a small one.
function profileY(t, y, s, width) {
  const k = s * (width / 360);
  return y + DIPS.reduce((sum, dip) => sum + dip.depth * k * Math.exp(-(((t - dip.at) / dip.spread) ** 2)), 0);
}

function guideCoat(x, y, {
  width = 360,
  scale = 1,
  blocked = false,
  color = RUST,
  line = INK,
  dark = INK,
  panel = SMOKE,
} = {}) {
  const s = scale;
  const W = width * s;
  const points = Array.from({length: STEPS + 1}, (_, index) => {
    const t = index / STEPS;
    return [x + W * t, profileY(t, y, s, width)];
  });
  const curve = points.map(([px, py], index) => `${index === 0 ? "M" : "L"}${px.toFixed(1)} ${py.toFixed(1)}`).join(" ");

  // The panel body under the surface line. Identical in both states.
  const body = `<path d="${curve} L${x + W} ${y + 60 * s} L${x} ${y + 60 * s} Z" fill="${panel}" opacity="0.28"/>`;

  // The lows keep the dark: the region between the flat line through the highs
  // and the surface itself, which is zero-thickness everywhere except the dips.
  const pools = blocked
    ? `<path d="${curve} L${x + W} ${y} L${x} ${y} Z" fill="${dark}" opacity="0.85"/>`
    : "";

  // A long flat block resting on the highs, spanning two of the three dips so
  // it visibly cannot reach into them.
  const blockH = 24 * s;
  const block = blocked
    ? `<rect x="${x + W * 0.08}" y="${y - blockH - 3 * s}" width="${W * 0.62}" height="${blockH}" rx="${4 * s}" fill="${color}" opacity="0.95"/>
    <line x1="${x + W * 0.08}" y1="${y - 1.5 * s}" x2="${x + W * 0.7}" y2="${y - 1.5 * s}" stroke="${line}" stroke-width="${3 * s}" opacity="0.7"/>`
    : "";

  const surface = `<path d="${curve}" fill="none" stroke="${line}" stroke-width="${6 * s}" stroke-linecap="round" stroke-linejoin="round" opacity="0.9"/>`;

  return `${body}${pools}${surface}${block}`;
}

const LABEL = "FIELD NOTE 23";

const slides = [
  // 1 — cover. Title lockup, the primed panel, the mark small in its primer state.
  portraitCanvas({
    id: "fn23-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["EVERYTHING LOOKS"], {x: 64, y: 250, size: 76, leading: 90, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["STRAIGHT IN PRIMER."], {x: 64, y: 348, size: 88, leading: 104, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["The waves show up later, in the sun."], {x: 68, y: 416, size: 32, leading: 46, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: PANEL, x: 250, y: 472, width: 600, height: 640, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn23-01"})}
    ${tape(600, 448, 218, -4)}
    ${guideCoat(80, 1190, {width: 260, scale: 0.7})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. The ten words.
  portraitCanvas({
    id: "fn23-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="716" fill="${OXBLOOD}" transform="rotate(-0.8 540 584)"/>
    ${tape(180, 204, 222, -3)}
    ${tape(660, 918, 196, 4)}
    ${lines(["“Can I say", "something about", "the way you", "handled that?”"], {x: 106, y: 340, size: 66, leading: 88, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["Ten words. He hears about four of them."], {x: 108, y: 750, size: 38, leading: 54, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${guideCoat(110, 850, {width: 320, scale: 1, color: PAPER_LIGHT, line: PAPER, panel: PAPER})}
    ${lines(["The answer is already moving."], {x: 76, y: 1076, size: 46, leading: 62, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — sparse, mark-led at full scale, primer state. The guard has a reason.
  portraitCanvas({
    id: "fn23-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${lines(["The guard went up", "for a reason."], {x: 74, y: 320, size: 74, leading: 96, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It has kept out plenty that deserved it."], {x: 76, y: 536, size: 42, leading: 58, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${guideCoat(200, 780, {width: 680, scale: 1})}
    ${lines(["The trouble is that it cannot tell", "who is at the door."], {x: 76, y: 1072, size: 40, leading: 56, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}`,
  }),
  // 4 — type and the mark at full scale, blocked. Guide coat.
  portraitCanvas({
    id: "fn23-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${guideCoat(200, 380, {width: 680, scale: 1, blocked: true})}
    ${lines(["Guide coat."], {x: 74, y: 596, size: 92, leading: 108, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The block rides the highs and takes the", "dark off them first. The lows keep it."], {x: 76, y: 706, size: 42, leading: 58, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${lines(["Nothing about", "the panel changed."], {x: 76, y: 1000, size: 52, leading: 70, family: SERIF, weight: 700, fill: OXBLOOD, tracking: 0})}
    ${scribble("M80 1184 C300 1146 520 1208 742 1162 C862 1138 942 1172 1002 1152", RUST, 9)}`,
  }),
  // 5 — halftone field, the spray-gun complaint.
  portraitCanvas({
    id: "fn23-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="576" y="196" width="418" height="506" fill="url(#fn23-05-dots)"/>
    ${lines(["A bad", "delivery is", "a complaint", "about the", "spray gun."], {x: 74, y: 296, size: 60, leading: 78, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The low is still where it is."], {x: 74, y: 812, size: 46, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${lines(["He can be right that it was said badly", "and wrong about the panel."], {x: 74, y: 1008, size: 38, leading: 54, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${guideCoat(560, 1200, {width: 400, scale: 0.8, blocked: true})}`,
  }),
  // 6 — image-led on the sanding block.
  portraitCanvas({
    id: "fn23-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `${photo({name: BLOCK, x: 140, y: 158, width: 800, height: 706, rotation: 0.7, position: "xMidYMid", backing: GREEN, id: "fn23-06"})}
    ${tape(660, 136, 210, 4)}
    ${lines(["Nobody announces any of it.", "They just stop spraying."], {x: 74, y: 952, size: 50, leading: 66, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["And the panel goes back to grey."], {x: 76, y: 1100, size: 38, leading: 54, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 7 — close, image-led on the finished panel in the sun.
  portraitCanvas({
    id: "fn23-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: GLOSS, x: 244, y: 152, width: 612, height: 660, rotation: -0.6, position: "xMidYMid", backing: OXBLOOD, id: "fn23-07"})}
    ${tape(300, 130, 204, -3)}
    ${lines(["The foreman will", "keep telling him."], {x: 78, y: 900, size: 54, leading: 70, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The foreman is paid to."], {x: 80, y: 1044, size: 40, leading: 54, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The primed panel dominant,
// the sanding block small beside it, and the mark run as a pair in the oxblood
// margin — flat grey above, blocked and showing its lows below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn23-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="0" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: PANEL, x: 410, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn23-feature"})}
  ${photo({name: BLOCK, x: 1120, y: 200, width: 400, height: 560, rotation: 1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn23-feature"})}
  ${tape(700, 46, 222, -4)}
  ${tape(1180, 176, 196, 4)}
  ${guideCoat(46, 330, {width: 264, scale: 1, color: PAPER_LIGHT, line: PAPER, panel: PAPER})}
  ${guideCoat(46, 660, {width: 264, scale: 1, blocked: true, color: RUST, line: PAPER, dark: INK, panel: PAPER})}
  ${scribble("M420 854 C524 816 632 868 736 830", RUST, 10)}
  ${grain(1600, 1000, "fn23-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 23 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-23-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "everything-looks-straight-in-primer", feature);

console.log("Rendered the Field Note 23 feature image and seven carousel SVG and PNG pairs.");
