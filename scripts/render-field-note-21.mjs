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

// Field Note 21 — "Everything Comes to Him Flat". Founder-approved
// 2026-09-16; register position 20, no Ghost slot named.
//
// Signature vocabulary: a hand-drawn bead mark — a straight joint line with a
// run of overlapping crescent ripples laid along it. Its flat state lays the
// ripples on top of the line, evenly spaced and all one size; its overhead state
// hangs the same bead from the underside of the same line, the ripples spaced
// unevenly, and small drops pulling off it. Same bead, same length, and the only
// thing that changes is which way gravity is pulling on it, which is the whole
// argument. No prior vocabularies: not the counterbalance, load path, tolerance
// stack, downspout, strength curve, sling, transfer switch, battery gauge, route
// line, tally, ledger, alarm arc, diverging fork, anode section, bubble vial or
// branch stub.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const FLAT = "editorial/flat-plate-butt-weld-bench.png";
const VERTICAL = "editorial/practice-plate-angle-foot.png";
const BEND = "editorial/bend-test-bars-bench.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-plates-anchor-bolts", "basement-main-run-tees", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "filled-holes-floor", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "porch-coffee-pause", "porch-two-chairs", "punch-list-tailgate", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "walking-after-the-work", "wall-calendar-kitchen", "water-heater-top-fittings", "workbench-hand-tools"];

// The ripple offsets and drops are fixed arrays rather than random numbers, so
// every render of the overhead state is byte-identical and the review sheet
// never drifts between runs.
const OVERHEAD_SPACING = [0, 0.9, 1.5, 2.8, 3.3, 4.6, 5.0, 6.4, 7.1, 8.0];
const DROPS = [{at: 0.18, length: 30}, {at: 0.47, length: 18}, {at: 0.71, length: 38}, {at: 0.9, length: 14}];

function beadMark(x, y, {
  length = 440,
  scale = 1,
  overhead = false,
  color = RUST,
  line = INK,
} = {}) {
  const s = scale;
  const L = length * s;
  const r = 22 * s;

  // The joint line is identical in both states. In the overhead state a short
  // hatched run above it marks the ceiling the joint is stuck to.
  const joint = `<line x1="${x}" y1="${y}" x2="${x + L}" y2="${y}" stroke="${line}" stroke-width="${7 * s}" stroke-linecap="round" opacity="0.9"/>`;
  const ceiling = overhead
    ? Array.from({length: 9}, (_, index) => {
      const hx = x + ((L - 18 * s) / 8) * index;
      return `<line x1="${hx}" y1="${y - 8 * s}" x2="${hx + 16 * s}" y2="${y - 26 * s}" stroke="${line}" stroke-width="${3 * s}" stroke-linecap="round" opacity="0.55"/>`;
    }).join("")
    : "";

  // Crescents: each ripple is a half-arc sitting on the line (flat) or hanging
  // from it (overhead). Flat ripples are evenly stepped across the length.
  const count = OVERHEAD_SPACING.length;
  const step = (L - 2 * r) / OVERHEAD_SPACING[count - 1];
  const flatStep = (L - 2 * r) / (count - 1);
  const ripples = OVERHEAD_SPACING.map((offset, index) => {
    const cx = x + r + (overhead ? offset * step : index * flatStep);
    const rr = overhead ? r * (index % 3 === 1 ? 0.78 : index % 3 === 2 ? 1.12 : 0.94) : r;
    const sweep = overhead ? 0 : 1;
    const arcY = overhead ? y + 4 * s : y - 4 * s;
    return `<path d="M${cx - rr} ${arcY} A${rr} ${rr} 0 0 ${sweep} ${cx + rr} ${arcY}" fill="none" stroke="${color}" stroke-width="${5 * s}" stroke-linecap="round" opacity="${overhead ? 0.8 : 0.95}"/>`;
  }).join("");

  // Drops only exist upside down.
  const drops = overhead
    ? DROPS.map(({at, length: dl}) => {
      const dx = x + L * at;
      const top = y + r + 4 * s;
      const bottom = top + dl * s;
      return `<path d="M${dx} ${top} C${dx + 7 * s} ${bottom - 8 * s} ${dx + 7 * s} ${bottom} ${dx} ${bottom} C${dx - 7 * s} ${bottom} ${dx - 7 * s} ${bottom - 8 * s} ${dx} ${top} Z" fill="${color}" opacity="0.85"/>`;
    }).join("")
    : "";

  return `<g>${ceiling}${joint}${ripples}${drops}</g>`;
}

const LABEL = "FIELD NOTE 21";

const slides = [
  // 1 — cover. Title lockup, the flat plate photograph, the mark small and flat.
  portraitCanvas({
    id: "fn21-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["EVERYTHING COMES"], {x: 64, y: 250, size: 70, leading: 84, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["TO HIM FLAT."], {x: 64, y: 346, size: 96, leading: 108, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["The shop is right to turn the work."], {x: 68, y: 414, size: 34, leading: 48, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: FLAT, x: 260, y: 470, width: 590, height: 640, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn21-01"})}
    ${tape(620, 446, 214, 4)}
    ${beadMark(96, 1186, {length: 300, scale: 0.7})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. The shop rule, quoted.
  portraitCanvas({
    id: "fn21-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="228" width="968" height="712" fill="${OXBLOOD}" transform="rotate(0.9 540 584)"/>
    ${tape(640, 206, 226, 4)}
    ${tape(150, 916, 198, -3)}
    ${lines(["“If you can", "move it,", "weld it flat.”"], {x: 106, y: 360, size: 84, leading: 108, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["Every shop has a version of that rule,", "and every shop is right."], {x: 108, y: 742, size: 40, leading: 56, family: SERIF, weight: 400, fill: PAPER, tracking: 0.2})}
    ${beadMark(110, 872, {length: 420, scale: 1, color: PAPER_LIGHT, line: PAPER})}
    ${lines(["Gravity is on the welder’s side."], {x: 76, y: 1080, size: 50, leading: 66, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — sparse, mark-led at full scale, flat. The certification point.
  portraitCanvas({
    id: "fn21-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${lines(["A welder is", "not certified."], {x: 74, y: 322, size: 80, leading: 100, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["He is certified in a position."], {x: 76, y: 548, size: 50, leading: 64, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${beadMark(270, 790, {length: 540, scale: 1})}
    ${lines(["A man who passes flat has proved", "that he can weld flat."], {x: 76, y: 1080, size: 42, leading: 58, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}`,
  }),
  // 4 — halftone field, turning the work applied to a life.
  portraitCanvas({
    id: "fn21-04",
    number: 4,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="64" y="200" width="420" height="500" fill="url(#fn21-04-dots)"/>
    ${lines(["By forty-five,", "twenty years", "of turning", "the work."], {x: 520, y: 300, size: 60, leading: 78, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The job he is good at. The friends who like", "what he already does. Three subjects at dinner."], {x: 74, y: 810, size: 36, leading: 52, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${lines(["It is the trade’s own advice,", "applied to a life."], {x: 74, y: 1010, size: 48, leading: 64, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${beadMark(620, 1210, {length: 360, scale: 0.8})}`,
  }),
  // 5 — image-led on the vertical practice plate.
  portraitCanvas({
    id: "fn21-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `${photo({name: VERTICAL, x: 150, y: 160, width: 780, height: 700, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn21-05"})}
    ${tape(240, 138, 214, -3)}
    ${lines(["Some joints do not turn."], {x: 74, y: 966, size: 58, leading: 72, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["They come in overhead, and he goes up", "to them with a flat welder’s hands."], {x: 76, y: 1070, size: 38, leading: 54, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 6 — type and the mark at full scale, overhead. Cold lap.
  portraitCanvas({
    id: "fn21-06",
    number: 6,
    total: 7,
    label: LABEL,
    body: `${beadMark(270, 330, {length: 540, scale: 1, overhead: true})}
    ${lines(["Cold lap."], {x: 74, y: 600, size: 92, leading: 108, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The bead is laid on the surface", "of the joint, not fused into it."], {x: 76, y: 732, size: 46, leading: 62, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${lines(["It is often tidy.", "It holds nothing."], {x: 76, y: 1010, size: 58, leading: 76, family: SERIF, weight: 700, fill: OXBLOOD, tracking: 0})}
    ${scribble("M80 1180 C290 1140 520 1204 740 1160 C860 1136 940 1170 1000 1150", RUST, 9)}`,
  }),
  // 7 — close, image-led on the bent test bars.
  portraitCanvas({
    id: "fn21-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: BEND, x: 250, y: 150, width: 600, height: 660, rotation: 0.6, position: "xMidYMid", backing: GREEN, id: "fn21-07"})}
    ${tape(560, 128, 206, 3)}
    ${lines(["Welders practise on scrap."], {x: 78, y: 910, size: 60, leading: 76, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Nothing depends on a coupon.", "That is its entire job."], {x: 80, y: 1024, size: 44, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The flat plate dominant,
// the vertical plate small beside it, and the mark run as a pair in the oxblood
// margin — flat and even above, overhead and dripping below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn21-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1226" y="0" width="374" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: FLAT, x: 80, y: 70, width: 660, height: 860, rotation: 0.8, position: "xMidYMid", backing: GREEN, id: "fn21-feature"})}
  ${photo({name: VERTICAL, x: 790, y: 180, width: 400, height: 560, rotation: -1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn21-feature"})}
  ${tape(480, 46, 226, 4)}
  ${tape(862, 156, 198, -4)}
  ${beadMark(1278, 330, {length: 270, scale: 1, color: PAPER_LIGHT, line: PAPER})}
  ${beadMark(1278, 640, {length: 270, scale: 1, overhead: true, color: RUST, line: PAPER})}
  ${scribble("M800 830 C902 792 1010 844 1112 806", RUST, 10)}
  ${grain(1600, 1000, "fn21-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 21 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-21-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "everything-comes-to-him-flat", feature);

console.log("Rendered the Field Note 21 feature image and seven carousel SVG and PNG pairs.");
