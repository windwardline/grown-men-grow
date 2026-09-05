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

// Field Note 18 — "The Error Is Half the Difference". DRAFT, not
// founder-approved.
//
// Signature vocabulary: a hand-drawn bubble-vial mark — a horizontal capsule
// with two etched graduation lines and a bubble drawn off centre by a stated
// amount. Its second state is the same vial turned end for end, which puts the
// same physical error on the opposite side of the reading, and a bracket drawn
// between the two bubble positions marks half the gap, which is the error
// itself. No prior vocabularies: not the load path, tolerance stack, downspout,
// strength curve, sling, transfer switch, battery gauge, route line, tally,
// ledger, alarm arc, diverging fork or anode section.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const TOP_PLATE = "editorial/level-on-top-plate.png";
const VIAL = "editorial/bubble-vial-close.png";
const PENCIL_MARK = "editorial/level-reversed-pencil-mark.png";

const otherArticles = ["friends-in-conversation", "repairing-wooden-chair", "sunlit-writing-table", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "morning-armchair-mug", "truck-hood-map", "compass-in-hand", "pegboard-end-of-day", "trail-fork-daylight", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread", "bp-cuff-notebook", "running-shoes-alarm", "cutting-board-vegetables", "base-plates-anchor-bolts", "punch-list-tailgate", "transfer-switch-cabinet", "restaurant-table-after-lunch", "sling-capacity-tag", "rigging-shackles-bench", "wall-calendar-kitchen", "driveway-hoop-late-afternoon", "covered-slab-curing", "hose-wetting-fresh-pour", "garage-floor-hairline-crack", "ladder-against-eave-autumn", "gutter-leaves-from-above", "downspout-extension-turned", "machinist-caliper-part", "cabinet-seam-proud-door", "datum-face-square", "temp-wall-open-room", "shims-top-plate", "filled-holes-floor", "anode-rod-pulled", "water-heater-top-fittings", "tap-running-hot"];

// `offset` is the bubble's displacement from true centre, signed, in units of
// the distance from centre to a graduation line. 0 is a true reading; 1 sits
// hard against a line. `reversed` draws the same physical error after the tool
// is turned end for end, which puts the bubble the same distance on the other
// side — the disagreement between the two is the only evidence the vial is out,
// which is why sameness proves nothing and only the reversal produces anything.
// `bracket` marks half the gap between the two bubble positions, and half the
// gap is the error. A bubble at true centre is drawn in `trueColor`, because
// the one state worth distinguishing at a glance is the honest one.
function bubbleVial(x, y, {
  offset = 0,
  width = 300,
  scale = 1,
  color = RUST,
  trueColor = GREEN,
  reversed = false,
  bracket = false,
  structure = INK,
} = {}) {
  const s = scale;
  const w = width * s;
  const h = 74 * s;
  const cx = x + w / 2;
  const cy = y + h / 2;
  // The graduation gap is wide relative to the bubble on purpose. At the
  // first geometry the bubble was large enough to cover the graduation line it
  // was sitting nearest, so the mark rendered with one visible line instead of
  // two and read as a dot in a capsule rather than as a reading off true.
  const gradGap = w * 0.2;
  const span = gradGap;
  const bubbleR = 15 * s;
  const shown = reversed ? -offset : offset;
  const bubbleX = cx + shown * span;
  const fill = offset === 0 ? trueColor : color;

  // The vial body: a capsule with a fine liquid line through it.
  const body = `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${h / 2}" fill="none" stroke="${structure}" stroke-width="${5 * s}" opacity="0.85"/>`;
  const graduations = [-1, 1].map((d) =>
    `<line x1="${cx + d * gradGap}" y1="${y + 7 * s}" x2="${cx + d * gradGap}" y2="${y + h - 7 * s}" stroke="${structure}" stroke-width="${4.2 * s}" opacity="0.75"/>`
  ).join("");
  const bubble = `<circle cx="${bubbleX}" cy="${cy}" r="${bubbleR}" fill="${fill}"/>`;

  // The half-difference bracket sits under the vial and runs from true centre
  // to the bubble, because that distance — not the gap between the two
  // readings — is what the tool has been adding to every line struck off it.
  const halfBracket = bracket
    ? `<g>
      <line x1="${cx}" y1="${y + h + 22 * s}" x2="${bubbleX}" y2="${y + h + 22 * s}" stroke="${color}" stroke-width="${4.4 * s}"/>
      <line x1="${cx}" y1="${y + h + 13 * s}" x2="${cx}" y2="${y + h + 31 * s}" stroke="${color}" stroke-width="${4.4 * s}"/>
      <line x1="${bubbleX}" y1="${y + h + 13 * s}" x2="${bubbleX}" y2="${y + h + 31 * s}" stroke="${color}" stroke-width="${4.4 * s}"/>
    </g>`
    : "";

  return `<g>${body}${graduations}${bubble}${halfBracket}</g>`;
}

const LABEL = "FIELD NOTE 18";

const slides = [
  // 1 — cover. Title lockup, the top-plate photograph, and a vial reading off.
  portraitCanvas({
    id: "fn18-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["THE ERROR IS"], {x: 64, y: 250, size: 96, leading: 112, family: SANS, weight: 900, tracking: 0.8})}
    ${lines(["HALF THE DIFFERENCE."], {x: 64, y: 350, size: 72, leading: 88, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["A bubble goes to the highest point available."], {x: 68, y: 420, size: 34, leading: 48, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: TOP_PLATE, x: 150, y: 480, width: 800, height: 620, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "fn18-01"})}
    ${tape(258, 456, 214, -4)}
    ${bubbleVial(716, 1156, {offset: 0.62, width: 300, scale: 0.62, color: RUST})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. No mark.
  portraitCanvas({
    id: "fn18-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="228" width="968" height="704" fill="${OXBLOOD}" transform="rotate(-0.8 540 580)"/>
    ${tape(212, 206, 226, -4)}
    ${tape(704, 908, 198, 3)}
    ${lines(["A level that is out", "does not read", "erratically."], {x: 106, y: 364, size: 76, leading: 98, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["It reads by the same amount,", "in the same direction, every time."], {x: 108, y: 692, size: 42, leading: 58, family: SERIF, weight: 400, fill: PAPER, tracking: 0.2})}
    ${lines(["Repeatability is its most reliable quality."], {x: 108, y: 832, size: 38, leading: 52, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${lines(["Nothing about it looks any different."], {x: 76, y: 1062, size: 52, leading: 68, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — mark-led. Type left, the vial off true at scale on the right.
  portraitCanvas({
    id: "fn18-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${lines(["Every line struck", "off it agrees with", "every other line", "struck off it."], {x: 74, y: 316, size: 74, leading: 94, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The work checks out", "because it is internally correct."], {x: 76, y: 700, size: 52, leading: 68, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${lines(["Square to a lie, and square to it beautifully."], {x: 76, y: 856, size: 38, leading: 52, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${bubbleVial(300, 1000, {offset: 0.62, width: 480, scale: 1, color: RUST})}`,
  }),
  // 4 — image-led. The vial photograph carries the beat; the type names the
  // intuition it defeats.
  portraitCanvas({
    id: "fn18-04",
    number: 4,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `${photo({name: VIAL, x: 120, y: 168, width: 840, height: 700, rotation: 0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn18-04"})}
    ${tape(218, 146, 214, -3)}
    ${lines(["Measuring twice", "does not find it."], {x: 74, y: 962, size: 62, leading: 78, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The second reading comes off the same vial.", "That agreement is the defect, not a disproof."], {x: 76, y: 1170, size: 34, leading: 48, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 5 — sparse. The test itself, and the paired marks that are the argument:
  // the same error read from both ends, with half the gap bracketed.
  portraitCanvas({
    id: "fn18-05",
    number: 5,
    total: 7,
    label: LABEL,
    body: `${lines(["Set it down.", "Mark the bubble.", "Turn it end for end.", "Read it again."], {x: 82, y: 330, size: 68, leading: 88, family: SERIF, weight: 700, tracking: 0})}
    ${bubbleVial(300, 720, {offset: 0.62, width: 480, scale: 1, color: RUST})}
    ${bubbleVial(300, 900, {offset: 0.62, width: 480, scale: 1, color: RUST, reversed: true, bracket: true})}
    ${lines(["The gap between the two readings", "is twice the error."], {x: 82, y: 1140, size: 48, leading: 64, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 6 — the caveat the piece exists to keep. Halftone field, and the one mark
  // in the set drawn true, because here the instrument is not the problem.
  portraitCanvas({
    id: "fn18-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="636" y="234" width="380" height="448" fill="url(#fn18-06-dots)"/>
    ${lines(["Some men will run it,", "find the level true,", "and still be facing", "a crooked wall."], {x: 74, y: 330, size: 62, leading: 80, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The instrument was never the problem.", "It was in the bag the whole time."], {x: 74, y: 740, size: 40, leading: 56, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${lines(["No test on any workbench catches that."], {x: 74, y: 872, size: 44, leading: 58, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${bubbleVial(300, 1000, {offset: 0, width: 480, scale: 1, trueColor: GREEN})}`,
  }),
  // 7 — close. The pencil tick and the level going back down the other way.
  portraitCanvas({
    id: "fn18-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: PENCIL_MARK, x: 240, y: 152, width: 600, height: 640, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn18-07"})}
    ${tape(334, 130, 206, 3)}
    ${lines(["The one instrument that never gets checked", "is the one every other check runs through."], {x: 78, y: 876, size: 40, leading: 56, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Turn it around,", "and it will tell you."], {x: 80, y: 1024, size: 56, leading: 72, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${bubbleVial(716, 1156, {offset: 0.62, width: 300, scale: 0.62, color: RUST, reversed: true, bracket: true})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The top-plate photograph
// dominant, the pencil tick small beside it, and the mark run as a reversal
// pair in the oxblood margin — bubble right, then the same vial turned end for
// end with the bubble left and half the gap bracketed.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn18-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1226" y="0" width="374" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: TOP_PLATE, x: 80, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn18-feature"})}
  ${photo({name: PENCIL_MARK, x: 790, y: 140, width: 400, height: 560, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn18-feature"})}
  ${tape(212, 46, 226, -4)}
  ${tape(862, 116, 198, 4)}
  ${bubbleVial(1266, 300, {offset: 0.62, width: 300, scale: 0.98, color: RUST, structure: PAPER})}
  ${bubbleVial(1266, 560, {offset: 0.62, width: 300, scale: 0.98, color: RUST, reversed: true, bracket: true, structure: PAPER})}
  ${scribble("M800 786 C902 748 1010 800 1112 762", RUST, 10)}
  ${grain(1600, 1000, "fn18-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published Instagram asset, so this build
// asserts that nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 18 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-18-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-error-is-half-the-difference", feature);

console.log("Rendered the Field Note 18 feature image and seven carousel SVG and PNG pairs.");
