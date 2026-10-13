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

// Field Note 25 — "He Stays at Short". Founder-approved 2026-10-13;
// register position 24, no Ghost slot named.
//
// Signature vocabulary: a hand-drawn scorebook-box mark — a square scorebook
// cell with a small diamond inscribed in it and a run's path drawn around the
// diamond, home to first to second to third and home. In its book state the
// scorer's short diagonal closes the cell's lower-right corner, the mark for an
// inning ended, and the run is drawn dashed: in the book the inning is over and
// the run belongs to nobody throwing. In its field state the corner is open and
// the same run is drawn solid: it counts on the scoreboard and everybody is
// still out there. Same cell, same diamond, same run, and the only thing that
// changes is whether the book says the inning has ended. No prior vocabularies:
// not the trunk taper, guide-coat profile, contact gap, counterbalance, load
// path, tolerance stack, downspout, strength curve, sling, transfer switch,
// battery gauge, route line, tally, ledger, alarm arc, diverging fork, anode
// section, bubble vial, branch stub or bead mark.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const GLOVE = "editorial/infield-glove-raked-dirt.png";
const BASE = "editorial/base-chalk-line-low-sun.png";
const MOUND = "editorial/pitchers-mound-rosin-bag.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "pulled-stakes-young-tree", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "sanding-longboard-bench", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "staked-sapling-front-lawn", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "walking-after-the-work", "wall-calendar-kitchen", "water-heater-top-fittings", "workbench-hand-tools"];

// Proportions are fractions of the cell's side, fixed so every render is
// byte-identical and the review sheet never drifts between runs.
const DIAMOND = 0.31;
const BAG = 0.05;
const SLASH = 0.26;

function scorebookBox(x, y, {
  size = 200,
  scale = 1,
  book = false,
  line = INK,
  fill = PAPER,
  run = RUST,
  slash = INK,
} = {}) {
  const s = scale;
  const S = size * s;
  const f = (value) => value.toFixed(1);
  const half = S / 2;
  const d = S * DIAMOND;

  // The cell is drawn first, identical in both states.
  const cell = `<rect x="${f(x - half)}" y="${f(y - half)}" width="${f(S)}" height="${f(S)}" fill="${fill}" stroke="${line}" stroke-width="${4 * s}"/>`;

  // Home at the bottom, then first, second and third counter-clockwise as a
  // scorer draws them.
  const home = [x, y + d];
  const first = [x + d, y];
  const second = [x, y - d];
  const third = [x - d, y];
  const diamond = `<path d="M${f(home[0])} ${f(home[1])} L${f(first[0])} ${f(first[1])} L${f(second[0])} ${f(second[1])} L${f(third[0])} ${f(third[1])} Z" fill="none" stroke="${line}" stroke-width="${2 * s}" opacity="0.45"/>`;

  // The run, inset a hair inside the diamond so it reads as pencil over print.
  const inset = 0.88;
  const p = (point) => [x + (point[0] - x) * inset, y + (point[1] - y) * inset];
  const path = [home, first, second, third, home].map(p);
  const runPath = `<path d="M${path.map(([px, py]) => `${f(px)} ${f(py)}`).join(" L")}" fill="none" stroke="${run}" stroke-width="${6 * s}" stroke-linejoin="round" stroke-linecap="round"${book ? ` stroke-dasharray="${f(10 * s)} ${f(9 * s)}" opacity="0.8"` : ""}/>`;

  const b = S * BAG;
  const bags = [first, second, third].map(([bx, by]) => `<rect x="${f(bx - b / 2)}" y="${f(by - b / 2)}" width="${f(b)}" height="${f(b)}" fill="${fill}" stroke="${line}" stroke-width="${2.5 * s}" transform="rotate(45 ${f(bx)} ${f(by)})"/>`).join("");
  const plate = `<path d="M${f(home[0] - b / 2)} ${f(home[1] - b / 2)} L${f(home[0] + b / 2)} ${f(home[1] - b / 2)} L${f(home[0] + b / 2)} ${f(home[1])} L${f(home[0])} ${f(home[1] + b / 2)} L${f(home[0] - b / 2)} ${f(home[1])} Z" fill="${fill}" stroke="${line}" stroke-width="${2.5 * s}"/>`;

  // The scorer's diagonal across the lower-right corner: the inning is over.
  const c = S * SLASH;
  const corner = book
    ? `<line x1="${f(x + half - c)}" y1="${f(y + half)}" x2="${f(x + half)}" y2="${f(y + half - c)}" stroke="${slash}" stroke-width="${6 * s}" stroke-linecap="round"/>`
    : "";

  return `${cell}${diamond}${runPath}${bags}${plate}${corner}`;
}

const LABEL = "FIELD NOTE 25";

const slides = [
  // 1 — cover. Title lockup, the glove on the dirt, the mark small in its field state.
  portraitCanvas({
    id: "fn25-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["HE STAYS"], {x: 64, y: 260, size: 104, leading: 116, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["AT SHORT."], {x: 64, y: 372, size: 104, leading: 116, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["The ball goes under his glove, and the", "inning keeps going with him in it."], {x: 68, y: 444, size: 30, leading: 42, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: GLOVE, x: 330, y: 530, width: 560, height: 620, rotation: -0.9, position: "xMidYMid", backing: GREEN, id: "fn25-01"})}
    ${tape(470, 506, 214, -3)}
    ${scorebookBox(176, 1110, {size: 170})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. The routine ball.
  portraitCanvas({
    id: "fn25-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="60" y="214" width="960" height="690" fill="${OXBLOOD}" transform="rotate(-0.7 540 560)"/>
    ${tape(120, 192, 210, -3)}
    ${tape(780, 880, 196, 4)}
    ${lines(["A routine", "ground ball.", "Two hops, glove", "down, throw", "to first."], {x: 106, y: 334, size: 68, leading: 88, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${scorebookBox(822, 760, {size: 220, line: PAPER, fill: OXBLOOD, run: PAPER_LIGHT})}
    ${lines(["The thousand-and-first", "stays low."], {x: 76, y: 1046, size: 54, leading: 70, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — documentary detail. The base, the chalk, the two characters.
  portraitCanvas({
    id: "fn25-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${photo({name: BASE, x: 70, y: 150, width: 560, height: 700, rotation: 0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn25-03"})}
    ${tape(500, 128, 200, 3)}
    ${lines(["E6.", "Two", "characters."], {x: 676, y: 420, size: 60, leading: 78, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Anybody in the park who can read", "a scorebook knows exactly who."], {x: 78, y: 960, size: 44, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${scribble("M80 1120 C280 1092 500 1146 720 1106 C850 1084 940 1116 1000 1100", RUST, 8)}`,
  }),
  // 4 — the mark at full scale, book state. The scorer's replay.
  portraitCanvas({
    id: "fn25-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${lines(["The scorer replays", "the inning as though", "the ball had been caught."], {x: 74, y: 290, size: 62, leading: 82, family: SERIF, weight: 700, tracking: 0})}
    ${scorebookBox(540, 770, {size: 420, book: true})}
    ${lines(["Once that inning reaches three outs, it's over."], {x: 76, y: 1130, size: 38, leading: 54, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 5 — halftone field, the inning that already ended.
  portraitCanvas({
    id: "fn25-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="610" y="190" width="390" height="540" fill="url(#fn25-05-dots)"/>
    ${lines(["Everybody", "on the field", "is working an", "inning that,", "on paper,", "already ended."], {x: 74, y: 300, size: 66, leading: 84, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["They're playing on past the end", "for a mistake none of them made."], {x: 74, y: 900, size: 40, leading: 56, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${scorebookBox(840, 1150, {size: 180, book: true})}`,
  }),
  // 6 — the mound, and nobody coming out of the dugout.
  portraitCanvas({
    id: "fn25-06",
    number: 6,
    total: 7,
    label: LABEL,
    body: `${photo({name: MOUND, x: 300, y: 140, width: 640, height: 700, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn25-06"})}
    ${tape(360, 118, 210, -4)}
    ${lines(["Nobody comes out", "of the dugout."], {x: 76, y: 940, size: 64, leading: 82, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The pitcher gets the ball back and", "goes to work on the next hitter."], {x: 78, y: 1110, size: 38, leading: 54, family: SERIF, weight: 400, fill: SMOKE, tracking: 0.2})}`,
  }),
  // 7 — type-led close on an oxblood field, the mark in its field state.
  portraitCanvas({
    id: "fn25-07",
    number: 7,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["Nothing that happens", "in the seventh rubs out", "a letter in the third."], {x: 74, y: 300, size: 60, leading: 80, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${scorebookBox(540, 730, {size: 360, line: PAPER, fill: OXBLOOD, run: PAPER_LIGHT})}
    ${lines(["Next week's lineup card", "has him at short."], {x: 76, y: 1040, size: 50, leading: 66, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The glove dominant, the
// mound small beside it, and the mark run as a pair in the oxblood margin —
// book above, field below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn25-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: GLOVE, x: 90, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn25-feature"})}
  ${photo({name: MOUND, x: 790, y: 210, width: 400, height: 560, rotation: 1.3, position: "xMidYMid", backing: OXBLOOD, id: "fn25-feature"})}
  ${tape(330, 46, 222, -3)}
  ${tape(880, 186, 196, 4)}
  ${scorebookBox(1422, 290, {size: 220, book: true, line: PAPER, fill: OXBLOOD, run: PAPER_LIGHT, slash: PAPER_LIGHT})}
  ${scorebookBox(1422, 700, {size: 220, line: PAPER, fill: OXBLOOD, run: PAPER_LIGHT})}
  ${scribble("M640 972 C744 950 852 984 956 958", RUST, 10)}
  ${grain(1600, 1000, "fn25-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 25 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-25-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "he-stays-at-short", feature);

console.log("Rendered the Field Note 25 feature image and seven carousel SVG and PNG pairs.");
