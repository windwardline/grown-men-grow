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

// Field Note 20 — "The Opener Doesn't Lift the Door". Founder-approved
// 2026-09-12; register position 19, no Ghost slot named.
//
// Signature vocabulary: a hand-drawn counterbalance mark — a horizontal spring
// shaft drawn as a run of coil turns, a cable dropping from the drum end to a
// door-panel bar, and a small filled square for the opener sitting on that
// cable. Its slack state draws five open turns, an oversized opener square, and
// the door bar down at the bottom of its travel; its wound state draws nine
// tight turns, the bar carried near the top, and the opener reduced to a
// hairline tick. Same shaft, same door, same weight — the only thing that
// changes between the two states is which part is drawn as though it were doing
// the work, which is the whole argument. No prior vocabularies: not the load
// path, tolerance stack, downspout, strength curve, sling, transfer switch,
// battery gauge, route line, tally, ledger, alarm arc, diverging fork, anode
// section, bubble vial or branch stub.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const DOOR = "editorial/garage-door-partly-open-morning.png";
const SPRING = "editorial/torsion-spring-shaft-header.png";
const OPENER = "editorial/opener-head-ceiling-rail.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-plates-anchor-bolts", "basement-main-run-tees", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "filled-holes-floor", "friends-in-conversation", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "porch-coffee-pause", "porch-two-chairs", "punch-list-tailgate", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "walking-after-the-work", "wall-calendar-kitchen", "water-heater-top-fittings", "workbench-hand-tools"];

// The two states are the argument, so nothing is added between them and the
// door never changes size. A door bar drawn at one width in both states is the
// point: the weight is identical, and the reader is looking at which element is
// drawn large enough to be plausibly responsible for it.
//
// The coil turns are drawn as narrow vertical ellipses rather than a zigzag.
// A zigzag reads as a compression spring under load — motion along its axis —
// and a torsion spring does not move that way at all; it twists in place. Flat
// rings stacked along the shaft hold still, which is the correct behaviour to
// draw.
function counterbalance(x, y, {
  width = 360,
  drop = 190,
  scale = 1,
  color = RUST,
  trueColor = GREEN,
  wound = false,
  structure = INK,
} = {}) {
  const s = scale;
  const w = width * s;
  const d = drop * s;
  const cableX = x + w * 0.84;
  const stroke = 9 * s;

  const shaft = `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${structure}" stroke-width="${stroke}" stroke-linecap="round" opacity="0.9"/>`;

  const turns = wound ? 9 : 5;
  const coilStart = x + w * 0.08;
  const coilEnd = x + w * 0.6;
  const span = coilEnd - coilStart;
  const coil = Array.from({length: turns}, (_, index) => {
    const t = turns === 1 ? 0 : index / (turns - 1);
    const px = coilStart + span * t;
    return `<ellipse cx="${px}" cy="${y}" rx="${5.4 * s}" ry="${15 * s}" fill="none" stroke="${wound ? trueColor : color}" stroke-width="${5 * s}" opacity="${wound ? 0.95 : 0.55}"/>`;
  }).join("");

  // The drum the cable leaves from. Drawn in both states because the drum is
  // hardware, not argument.
  const drum = `<circle cx="${cableX}" cy="${y}" r="${13 * s}" fill="none" stroke="${structure}" stroke-width="${5 * s}" opacity="0.85"/>`;

  const barY = wound ? y + d * 0.24 : y + d;
  const cable = `<line x1="${cableX}" y1="${y + 13 * s}" x2="${cableX}" y2="${barY}" stroke="${structure}" stroke-width="${5 * s}" stroke-linecap="round" opacity="0.8"/>`;
  const bar = `<rect x="${cableX - 62 * s}" y="${barY}" width="${124 * s}" height="${20 * s}" rx="${4 * s}" fill="${wound ? trueColor : structure}" opacity="${wound ? 0.95 : 0.7}"/>`;

  // The opener: oversized while the coil is drawn slack, and a hairline tick
  // once the spring is drawn doing what it actually does.
  const opener = wound
    ? `<line x1="${cableX - 12 * s}" y1="${y + d * 0.12}" x2="${cableX + 12 * s}" y2="${y + d * 0.12}" stroke="${color}" stroke-width="${4 * s}" stroke-linecap="round" opacity="0.85"/>`
    : `<rect x="${cableX - 31 * s}" y="${y + d * 0.42}" width="${62 * s}" height="${62 * s}" rx="${5 * s}" fill="${color}"/>`;

  return `<g>${shaft}${coil}${drum}${cable}${opener}${bar}</g>`;
}

const LABEL = "FIELD NOTE 20";

const slides = [
  // 1 — cover. Title lockup, the door photograph, the mark small and slack.
  portraitCanvas({
    id: "fn20-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["THE OPENER DOESN'T"], {x: 64, y: 250, size: 66, leading: 84, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["LIFT THE DOOR."], {x: 64, y: 344, size: 92, leading: 108, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["It has never lifted the door."], {x: 68, y: 414, size: 34, leading: 48, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: DOOR, x: 250, y: 470, width: 596, height: 640, rotation: -0.7, position: "xMidYMax", backing: GREEN, id: "fn20-01"})}
    ${tape(340, 446, 214, -4)}
    ${counterbalance(646, 1172, {width: 330, drop: 96, scale: 0.6, color: RUST})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. The arithmetic, stated.
  portraitCanvas({
    id: "fn20-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="228" width="968" height="712" fill="${OXBLOOD}" transform="rotate(-0.8 540 584)"/>
    ${tape(212, 206, 226, -4)}
    ${tape(704, 916, 198, 3)}
    ${lines(["A third of", "a horsepower.", "A door that weighs", "two hundred pounds."], {x: 106, y: 336, size: 64, leading: 88, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["Those two numbers do not go together."], {x: 108, y: 740, size: 40, leading: 56, family: SERIF, weight: 400, fill: PAPER, tracking: 0.2})}
    ${lines(["And a man can watch that door go up ten thousand", "times without the arithmetic ever once coming up."], {x: 108, y: 848, size: 32, leading: 46, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${lines(["The opener is not lifting it."], {x: 76, y: 1064, size: 50, leading: 66, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — image-led. The spring carries the beat; the type names the division
  // of labour the photograph cannot show on its own.
  portraitCanvas({
    id: "fn20-03",
    number: 3,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `${photo({name: SPRING, x: 120, y: 168, width: 840, height: 700, rotation: 0.7, position: "xMidYMin", backing: OXBLOOD, id: "fn20-03"})}
    ${tape(218, 146, 214, -3)}
    ${lines(["It overcomes friction and settles", "an argument about direction."], {x: 74, y: 958, size: 48, leading: 64, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The lifting is done by a spring on a shaft above the", "opening, painted the same colour as the ceiling."], {x: 76, y: 1166, size: 32, leading: 46, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 4 — mark-led at full scale, wound. The balance test is the only place the
  // spring is visible at all, so the mark is drawn true here.
  portraitCanvas({
    id: "fn20-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${lines(["A balanced door", "stays where it is."], {x: 74, y: 322, size: 76, leading: 96, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Halfway up, with the opener", "disconnected. It does not fall", "and it does not rise."], {x: 76, y: 500, size: 44, leading: 60, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${counterbalance(300, 736, {width: 470, drop: 230, scale: 1, wound: true})}
    ${lines(["Something overhead is holding exactly", "as much as it weighs."], {x: 76, y: 1152, size: 40, leading: 56, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 5 — sparse, halftone. The misattribution, with the mark slack and the
  // opener square drawn as the loudest object on the page.
  portraitCanvas({
    id: "fn20-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="636" y="234" width="380" height="448" fill="url(#fn20-05-dots)"/>
    ${lines(["The spring", "makes no noise.", "The opener", "makes all of it."], {x: 74, y: 326, size: 60, leading: 78, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The loudest thing in the building", "is doing the least work in it."], {x: 74, y: 786, size: 44, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${counterbalance(300, 964, {width: 470, drop: 230, scale: 1, color: RUST})}`,
  }),
  // 6 — image-led on the opener head, which is the part that gets the credit.
  portraitCanvas({
    id: "fn20-06",
    number: 6,
    total: 7,
    label: LABEL,
    body: `${photo({name: OPENER, x: 240, y: 152, width: 600, height: 640, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn20-06"})}
    ${tape(334, 130, 206, 3)}
    ${lines(["He credits the motor."], {x: 78, y: 890, size: 62, leading: 78, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It is the part with his name on it.", "The part that answers when", "he pushes the button."], {x: 80, y: 1000, size: 42, leading: 58, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 7 — close. Type-led, and the mark in its wound state at cover scale, so
  // the set opens and closes on the same object with the credit moved.
  portraitCanvas({
    id: "fn20-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${lines(["Ten thousand cycles,", "and no counter on it."], {x: 78, y: 336, size: 68, leading: 88, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["No light comes on at nine thousand.", "The door in its last week goes up", "exactly like the door in its first."], {x: 80, y: 536, size: 42, leading: 58, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${counterbalance(300, 784, {width: 470, drop: 230, scale: 1, wound: true})}
    ${lines(["The motor is the only part of it", "anybody in the house can hear."], {x: 78, y: 1196, size: 42, leading: 58, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The door photograph
// dominant, the spring small beside it, and the mark run as a pair in the
// oxblood margin — slack with the opener oversized, then wound with the door
// carried and the opener reduced to a tick.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn20-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1226" y="0" width="374" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: DOOR, x: 80, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMax", backing: OXBLOOD, id: "fn20-feature"})}
  ${photo({name: SPRING, x: 790, y: 140, width: 400, height: 560, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn20-feature"})}
  ${tape(212, 46, 226, -4)}
  ${tape(862, 116, 198, 4)}
  ${counterbalance(1266, 210, {width: 310, drop: 200, scale: 0.96, color: RUST, structure: PAPER})}
  ${counterbalance(1266, 650, {width: 310, drop: 200, scale: 0.96, wound: true, structure: PAPER})}
  ${scribble("M800 786 C902 748 1010 800 1112 762", RUST, 10)}
  ${grain(1600, 1000, "fn20-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 20 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-20-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-opener-doesnt-lift-the-door", feature);

console.log("Rendered the Field Note 20 feature image and seven carousel SVG and PNG pairs.");
