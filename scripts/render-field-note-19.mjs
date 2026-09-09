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

// Field Note 19 — "The Line Was Capped, Not Removed". DRAFT, not
// founder-approved.
//
// Signature vocabulary: a hand-drawn branch-stub mark — a horizontal main run
// with a tee dropping to a short branch closed by a filled cap bar, the water
// standing in the branch drawn as a hatched segment. Its second state is the
// branch cut back flush to the tee: no drop, no cap, and flow chevrons along a
// main that has nothing hanging off it. No prior vocabularies: not the load
// path, tolerance stack, downspout, strength curve, sling, transfer switch,
// battery gauge, route line, tally, ledger, alarm arc, diverging fork, anode
// section or bubble vial.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const STUB = "editorial/capped-copper-stub-wall.png";
const MAIN_RUN = "editorial/basement-main-run-tees.png";
const CUTTER = "editorial/tubing-cutter-on-copper.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-plates-anchor-bolts", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "car-odometer-daylight", "compass-in-hand", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "filled-holes-floor", "friends-in-conversation", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gutter-leaves-from-above", "hallway-duffel-set-down", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "kitchen-counter-pause", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "porch-coffee-pause", "porch-two-chairs", "punch-list-tailgate", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "sunlit-writing-table", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "walking-after-the-work", "wall-calendar-kitchen", "water-heater-top-fittings", "workbench-hand-tools"];

// The mark has two states and the argument is the difference between them.
//
// `cut: false` draws what the essay is about: a main run, a tee, a branch
// dropping off it, and a filled bar closing the end. `hatch` fills the branch
// with short diagonal ticks — the water that is standing in it. The cap is
// drawn in `color` rather than in `structure` because the cap is the decision,
// and it is the only part of the assembly a man chose.
//
// `cut: true` draws the same run after the branch is taken back to the main:
// the drop and the cap are gone, a short tick marks where the tee was, and
// chevrons along the main show it flowing with nothing hanging off it. Nothing
// is added in that state — the mark gets simpler, which is the whole point and
// the reason the two states are legible side by side at carousel scale.
function branchStub(x, y, {
  width = 340,
  drop = 120,
  scale = 1,
  color = RUST,
  trueColor = GREEN,
  cut = false,
  hatch = true,
  structure = INK,
} = {}) {
  const s = scale;
  const w = width * s;
  const d = drop * s;
  const tx = x + w * 0.6;
  const stroke = 9 * s;

  const main = `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${structure}" stroke-width="${stroke}" stroke-linecap="round" opacity="0.9"/>`;

  if (cut) {
    // The scar where the branch used to leave the main: a short tick, no drop.
    const scar = `<line x1="${tx}" y1="${y - 9 * s}" x2="${tx}" y2="${y + 9 * s}" stroke="${structure}" stroke-width="${6 * s}" opacity="0.55"/>`;
    const chevrons = [0.22, 0.44, 0.86].map((t) => {
      const cxp = x + w * t;
      return `<path d="M${cxp - 11 * s} ${y - 11 * s} L${cxp + 5 * s} ${y} L${cxp - 11 * s} ${y + 11 * s}" fill="none" stroke="${trueColor}" stroke-width="${7 * s}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }).join("");
    return `<g>${main}${scar}${chevrons}</g>`;
  }

  const branch = `<line x1="${tx}" y1="${y}" x2="${tx}" y2="${y + d}" stroke="${structure}" stroke-width="${stroke}" stroke-linecap="round" opacity="0.9"/>`;
  const cap = `<rect x="${tx - 30 * s}" y="${y + d - 4 * s}" width="${60 * s}" height="${18 * s}" rx="${4 * s}" fill="${color}"/>`;
  // Level rungs rather than diagonal ticks. The first version hatched the
  // branch on a diagonal and the four ticks read as a spring, which is motion —
  // the opposite of the thing being drawn. Standing water sits level, so the
  // rungs do.
  const standing = hatch
    ? [0.26, 0.44, 0.62, 0.8].map((t) => {
      const ty = y + d * t;
      return `<line x1="${tx - 15 * s}" y1="${ty}" x2="${tx + 15 * s}" y2="${ty}" stroke="${color}" stroke-width="${4.4 * s}" stroke-linecap="round" opacity="0.8"/>`;
    }).join("")
    : "";

  return `<g>${main}${branch}${standing}${cap}</g>`;
}

const LABEL = "FIELD NOTE 19";

const slides = [
  // 1 — cover. Title lockup, the stub photograph, the capped mark small.
  portraitCanvas({
    id: "fn19-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["THE LINE WAS CAPPED,"], {x: 64, y: 250, size: 74, leading: 90, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["NOT REMOVED."], {x: 64, y: 344, size: 92, leading: 108, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["It stopped serving anything years ago."], {x: 68, y: 414, size: 34, leading: 48, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: STUB, x: 250, y: 470, width: 596, height: 640, rotation: -0.7, position: "xMidYMax", backing: GREEN, id: "fn19-01"})}
    ${tape(340, 446, 214, -4)}
    ${branchStub(700, 1132, {width: 320, drop: 92, scale: 0.62, color: RUST})}`,
  }),
  // 2 — torn oxblood field, reverse serif type. The code, stated.
  portraitCanvas({
    id: "fn19-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="228" width="968" height="712" fill="${OXBLOOD}" transform="rotate(-0.8 540 584)"/>
    ${tape(212, 206, 226, -4)}
    ${tape(704, 916, 198, 3)}
    ${lines(["A branch that", "loses its fixture", "gets cut back", "to the main."], {x: 106, y: 342, size: 72, leading: 92, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["Not capped where it stands."], {x: 108, y: 736, size: 44, leading: 60, family: SERIF, weight: 400, fill: PAPER, tracking: 0.2})}
    ${lines(["Pipe holding water with nothing pulling on it", "is a problem the rest of the building inherits."], {x: 108, y: 846, size: 34, leading: 48, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${lines(["The trade calls it a dead leg."], {x: 76, y: 1064, size: 50, leading: 66, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — mark-led. Type left, the capped branch at full scale below it.
  portraitCanvas({
    id: "fn19-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${lines(["The cap is not", "the mistake."], {x: 74, y: 322, size: 82, leading: 102, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["On the day, the cap is correct.", "Four minutes and a fitting."], {x: 76, y: 528, size: 46, leading: 62, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${lines(["The mistake is that it is a", "complete-looking answer."], {x: 76, y: 690, size: 52, leading: 68, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${lines(["It holds. It does not drip."], {x: 76, y: 838, size: 38, leading: 52, family: SERIF, weight: 400, fill: SMOKE, tracking: 0.2})}
    ${branchStub(330, 968, {width: 440, drop: 160, scale: 1, color: RUST})}`,
  }),
  // 4 — image-led. The main run carries the beat; the type names what the
  // stub is actually connected to.
  portraitCanvas({
    id: "fn19-04",
    number: 4,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `${photo({name: MAIN_RUN, x: 120, y: 168, width: 840, height: 700, rotation: 0.7, position: "xMidYMin", backing: OXBLOOD, id: "fn19-04"})}
    ${tape(218, 146, 214, -3)}
    ${lines(["Water that sits is a different", "substance in about a week."], {x: 74, y: 958, size: 54, leading: 70, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The stub is not a sealed jar. It is open at one end", "to the line everything else runs through."], {x: 76, y: 1166, size: 34, leading: 48, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 5 — sparse. The failure mode, and the mark with the standing water made
  // the loudest thing on the page.
  portraitCanvas({
    id: "fn19-05",
    number: 5,
    total: 7,
    label: LABEL,
    body: `${lines(["It never shows up", "as a leak."], {x: 82, y: 330, size: 76, leading: 96, family: SERIF, weight: 700, tracking: 0})}
    ${branchStub(300, 636, {width: 480, drop: 210, scale: 1, color: RUST})}
    ${lines(["No incident. No date.", "Nothing to point at."], {x: 82, y: 1006, size: 52, leading: 68, family: SERIF, weight: 400, fill: INK, tracking: 0})}
    ${lines(["Nothing to fix is not the same", "as nothing being wrong."], {x: 82, y: 1148, size: 46, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 6 — the test. Halftone field, and the one mark in the set drawn cut, in
  // green, because this is the state the question is asked against.
  portraitCanvas({
    id: "fn19-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="636" y="234" width="380" height="448" fill="url(#fn19-06-dots)"/>
    ${lines(["The trade's test", "has no opinion", "about intention."], {x: 74, y: 336, size: 64, leading: 82, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Is there a fixture", "on the end of it?"], {x: 74, y: 742, size: 62, leading: 80, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${lines(["Not is one planned. Not could there be."], {x: 74, y: 904, size: 36, leading: 50, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${lines(["Intention has no flow rate."], {x: 74, y: 972, size: 44, leading: 58, family: SERIF, weight: 700, fill: INK, tracking: 0})}
    ${branchStub(300, 1104, {width: 480, drop: 160, scale: 1, cut: true})}`,
  }),
  // 7 — close. The cutter photograph and the mark cut back to the main.
  portraitCanvas({
    id: "fn19-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: CUTTER, x: 240, y: 152, width: 600, height: 640, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn19-07"})}
    ${tape(334, 130, 206, 3)}
    ${lines(["A cap is private.", "A cut is not."], {x: 78, y: 890, size: 62, leading: 78, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Go and look at what", "is on the end."], {x: 80, y: 1042, size: 54, leading: 70, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${branchStub(700, 1176, {width: 320, drop: 92, scale: 0.62, cut: true})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The stub photograph
// dominant, the cutter small beside it, and the mark run as a before-and-after
// pair in the oxblood margin — capped with the water standing in it, then the
// same run cut back to the main and flowing.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn19-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1226" y="0" width="374" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: STUB, x: 80, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMax", backing: OXBLOOD, id: "fn19-feature"})}
  ${photo({name: CUTTER, x: 790, y: 140, width: 400, height: 560, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn19-feature"})}
  ${tape(212, 46, 226, -4)}
  ${tape(862, 116, 198, 4)}
  ${branchStub(1272, 250, {width: 300, drop: 190, scale: 0.98, color: RUST, structure: PAPER})}
  ${branchStub(1272, 680, {width: 300, drop: 190, scale: 0.98, cut: true, structure: PAPER})}
  ${scribble("M800 786 C902 748 1010 800 1112 762", RUST, 10)}
  ${grain(1600, 1000, "fn19-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 19 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-19-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-line-was-capped-not-removed", feature);

console.log("Rendered the Field Note 19 feature image and seven carousel SVG and PNG pairs.");
