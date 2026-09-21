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

// Field Note 22 — "He Writes Both Parts". Draft, not founder-approved; no
// register position and no Ghost slot.
//
// Signature vocabulary: a hand-drawn contact gap — a fixed lower contact block
// on a short stem and a hinged upper arm carrying the upper contact. Its closed
// state sets the two faces flush on one line; its chattering state lifts the arm
// a few degrees, throws a jagged spark across the gap, and scatters small pits
// along the lower face. Same two parts, same pivot, and the only thing that
// changes is whether they are touching, which is the whole argument. No prior
// vocabularies: not the counterbalance, load path, tolerance stack, downspout,
// strength curve, sling, transfer switch, battery gauge, route line, tally,
// ledger, alarm arc, diverging fork, anode section, bubble vial, branch stub or
// bead mark.
//
// Photography: two source images generated for this note under the house prompt
// and unique to it.
const DRIVEWAY = "editorial/driveway-house-dusk-dash.png";
const RELAY = "editorial/control-relay-din-rail.png";
const CONTACTS = "editorial/relay-contacts-open-bench.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "filled-holes-floor", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "punch-list-tailgate", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "water-heater-top-fittings", "workbench-hand-tools"];

// The spark zigzag and the pit positions are fixed arrays rather than random
// numbers, so every render of the chattering state is byte-identical and the
// review sheet never drifts between runs.
const SPARK = [0.0, 0.34, -0.28, 0.42, -0.2, 0.3, 0.0];
const PITS = [0.14, 0.31, 0.46, 0.55, 0.72, 0.83];

function contactGap(x, y, {
  width = 300,
  scale = 1,
  chattering = false,
  color = RUST,
  line = INK,
} = {}) {
  const s = scale;
  const W = width * s;
  const lift = chattering ? 9 : 0; // degrees the arm swings up about its pivot

  // Lower half: a fixed contact block on a short stem. Identical in both
  // states, and it never moves — the whole point of the mark is that only the
  // arm does.
  const blockW = W * 0.3;
  const blockH = 17 * s;
  const blockX = x + W * 0.56;
  const cx = blockX + blockW / 2;
  const lower = `<rect x="${blockX}" y="${y}" width="${blockW}" height="${blockH}" rx="${3 * s}" fill="${color}" opacity="0.95"/>
    <line x1="${cx}" y1="${y + blockH}" x2="${cx}" y2="${y + blockH + 38 * s}" stroke="${line}" stroke-width="${7 * s}" stroke-linecap="round" opacity="0.9"/>`;

  // Upper half: pivot, arm, and the upper contact, whose bottom face rests
  // exactly on the lower block when the arm is down.
  const pivotX = x;
  const armY = y - blockH;
  const arm = `<g transform="rotate(${-lift} ${pivotX} ${armY})">
      <line x1="${pivotX}" y1="${armY}" x2="${blockX + blockW}" y2="${armY}" stroke="${line}" stroke-width="${7 * s}" stroke-linecap="round" opacity="0.9"/>
      <rect x="${blockX}" y="${armY}" width="${blockW}" height="${blockH}" rx="${3 * s}" fill="${color}" opacity="0.95"/>
    </g>
    <circle cx="${pivotX}" cy="${armY}" r="${8 * s}" fill="none" stroke="${line}" stroke-width="${6 * s}" opacity="0.9"/>
    <line x1="${pivotX}" y1="${armY - 34 * s}" x2="${pivotX}" y2="${armY - 8 * s}" stroke="${line}" stroke-width="${7 * s}" stroke-linecap="round" opacity="0.9"/>`;

  // Where the lifted upper face actually ends up, computed from the same
  // rotation the arm group uses rather than guessed, so the spark always spans
  // the real gap.
  const theta = (-lift * Math.PI) / 180;
  const dx = cx - pivotX;
  const dy = y - armY;
  const tipX = pivotX + dx * Math.cos(theta) - dy * Math.sin(theta);
  const tipY = armY + dx * Math.sin(theta) + dy * Math.cos(theta);

  const spark = chattering
    ? `<path d="${SPARK.map((offset, index) => {
      const t = index / (SPARK.length - 1);
      const px = cx + (tipX - cx) * t + offset * 15 * s;
      const py = y + (tipY - y) * t;
      return `${index === 0 ? "M" : "L"}${px} ${py}`;
    }).join(" ")}" fill="none" stroke="${color}" stroke-width="${5 * s}" stroke-linecap="round" stroke-linejoin="round" opacity="0.95"/>`
    : "";
  const pits = chattering
    ? PITS.map((at) => `<circle cx="${blockX + blockW * at}" cy="${y + 3.5 * s}" r="${2.6 * s}" fill="${line}" opacity="0.8"/>`).join("")
    : "";

  return `${lower}${pits}${spark}${arm}`;
}

const LABEL = "FIELD NOTE 22";

const slides = [
  // 1 — cover. Title lockup, the driveway photograph, the mark small and closed.
  portraitCanvas({
    id: "fn22-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["HE WRITES"], {x: 64, y: 250, size: 76, leading: 90, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["BOTH PARTS."], {x: 64, y: 348, size: 96, leading: 108, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["The speech gets better every time he runs it."], {x: 68, y: 416, size: 32, leading: 46, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: DRIVEWAY, x: 250, y: 472, width: 600, height: 640, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn22-01"})}
    ${tape(600, 448, 218, -4)}
    ${contactGap(96, 1206, {width: 230, scale: 0.7})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. The speech in the driveway.
  portraitCanvas({
    id: "fn22-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="716" fill="${OXBLOOD}" transform="rotate(-0.8 540 584)"/>
    ${tape(180, 204, 222, -3)}
    ${tape(660, 918, 196, 4)}
    ${lines(["Somewhere", "between the job", "and the driveway,", "a man gives", "a speech."], {x: 106, y: 330, size: 62, leading: 84, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["It has been through drafts."], {x: 108, y: 772, size: 40, leading: 56, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${contactGap(110, 880, {width: 300, scale: 1, color: PAPER_LIGHT, line: PAPER})}
    ${lines(["He has never lost this argument."], {x: 76, y: 1076, size: 46, leading: 62, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — sparse, mark-led at full scale, closed. The rehearsal is not stupid.
  portraitCanvas({
    id: "fn22-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${lines(["Nobody rehearses", "for no reason."], {x: 74, y: 320, size: 74, leading: 96, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["He was caught flat once."], {x: 76, y: 536, size: 48, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${contactGap(300, 800, {width: 440, scale: 1})}
    ${lines(["His head is going back over the ground", "to find where the answer was."], {x: 76, y: 1072, size: 40, leading: 56, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}`,
  }),
  // 4 — type and the mark at full scale, chattering. The loop.
  portraitCanvas({
    id: "fn22-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${contactGap(300, 340, {width: 440, scale: 1, chattering: true})}
    ${lines(["Chatter."], {x: 74, y: 596, size: 92, leading: 108, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The coil pulls in, the load drops the", "voltage, the coil lets go, the voltage", "comes back."], {x: 76, y: 706, size: 42, leading: 58, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${lines(["Closing is the thing", "that causes the opening."], {x: 76, y: 1000, size: 52, leading: 70, family: SERIF, weight: 700, fill: OXBLOOD, tracking: 0})}
    ${scribble("M80 1184 C300 1146 520 1208 742 1162 C862 1138 942 1172 1002 1152", RUST, 9)}`,
  }),
  // 5 — halftone field, the casting problem.
  portraitCanvas({
    id: "fn22-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="576" y="196" width="418" height="506" fill="url(#fn22-05-dots)"/>
    ${lines(["He plays", "himself,", "which is fair", "enough."], {x: 74, y: 296, size: 60, leading: 78, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["And he also plays the other man,", "which is not."], {x: 74, y: 812, size: 46, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${lines(["He never brings the one fact that would", "be genuinely inconvenient."], {x: 74, y: 1008, size: 38, leading: 54, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${contactGap(640, 1212, {width: 280, scale: 0.8, chattering: true})}`,
  }),
  // 6 — image-led on the relay in the cabinet.
  portraitCanvas({
    id: "fn22-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `${photo({name: RELAY, x: 140, y: 158, width: 800, height: 706, rotation: 0.7, position: "xMidYMid", backing: GREEN, id: "fn22-06"})}
    ${tape(660, 136, 210, 4)}
    ${lines(["Every make and break", "draws a small arc."], {x: 74, y: 952, size: 54, leading: 70, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The device is not killed by the load.", "It is killed by the cycling."], {x: 76, y: 1082, size: 38, leading: 54, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 7 — close, image-led on the open relay and its contact faces.
  portraitCanvas({
    id: "fn22-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: CONTACTS, x: 244, y: 152, width: 612, height: 660, rotation: -0.6, position: "xMinYMid", backing: OXBLOOD, id: "fn22-07"})}
    ${tape(300, 130, 204, -3)}
    ${lines(["The body has no", "category for rehearsal."], {x: 78, y: 900, size: 54, leading: 70, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["He comes through his own front door", "having just been insulted by nobody."], {x: 80, y: 1044, size: 38, leading: 54, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The driveway dominant, the
// relay small beside it, and the mark run as a pair in the oxblood margin —
// closed and quiet above, open and sparking below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn22-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="0" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: DRIVEWAY, x: 410, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn22-feature"})}
  ${photo({name: RELAY, x: 1120, y: 200, width: 400, height: 560, rotation: 1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn22-feature"})}
  ${tape(700, 46, 222, -4)}
  ${tape(1180, 176, 196, 4)}
  ${contactGap(46, 336, {width: 250, scale: 1, color: PAPER_LIGHT, line: PAPER})}
  ${contactGap(46, 660, {width: 250, scale: 1, chattering: true, color: RUST, line: PAPER})}
  ${scribble("M420 854 C524 816 632 868 736 830", RUST, 10)}
  ${grain(1600, 1000, "fn22-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 22 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-22-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "he-writes-both-parts", feature);

console.log("Rendered the Field Note 22 feature image and seven carousel SVG and PNG pairs.");
