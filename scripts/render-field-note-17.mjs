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

// Field Note 17 — "The Rod Goes First". DRAFT, not founder-approved.
//
// Signature vocabulary: a hand-drawn anode-section mark — a vertical rod
// hanging beside a tank wall line notched with three pits, where the rod is
// drawn only as thick as the material still left in it. Full at the open,
// visibly eaten opposite the pits through the middle, and on the close reduced
// to a bare core wire while the three pits are drawn closed and filled. No
// prior vocabularies: not the load path, tolerance stack, downspout, strength
// curve, sling, transfer switch, battery gauge, route line, tally, ledger,
// alarm arc or diverging fork.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it. The first build of this script was type-led because
// the Chrome extension was unreachable; the photographs landed later the same
// day and slides 1, 4 and 7 were rebuilt against them.
const ROD = "editorial/anode-rod-pulled.png";
const FITTINGS = "editorial/water-heater-top-fittings.png";
const TAP = "editorial/tap-running-hot.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "pegboard-end-of-day", "morning-armchair-mug", "truck-hood-map", "trail-fork-daylight", "compass-in-hand", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread", "bp-cuff-notebook", "running-shoes-alarm", "cutting-board-vegetables", "base-plates-anchor-bolts", "transfer-switch-cabinet", "covered-slab-curing", "garage-floor-hairline-crack", "hose-wetting-fresh-pour", "sling-capacity-tag", "wall-calendar-kitchen", "rigging-shackles-bench", "punch-list-tailgate", "ladder-against-eave-autumn", "downspout-extension-turned", "gutter-leaves-from-above", "driveway-hoop-late-afternoon", "restaurant-table-after-lunch", "machinist-caliper-part", "cabinet-seam-proud-door", "datum-face-square", "temp-wall-open-room", "shims-top-plate", "filled-holes-floor"];

// consumed: 0 = a new rod at full section, 1 = nothing left but the core wire.
// The rod is drawn as a stack of segments whose widths are eaten from the side
// facing the wall, hardest opposite the pits, because that is where the current
// concentrates. `closed` fills the pits, which only happens on the close.
// `structure` colours the tank wall line and the threaded head. It defaults
// to Ink for a paper ground and is lightened where the mark sits on Oxblood,
// because a dark wall line on a dark field renders the pits meaningless.
function anodeSection(x, y, {consumed = 0, height = 300, scale = 1, color = RUST, closed = false, structure = INK}) {
  const s = scale;
  const h = height * s;
  const wallX = x + 132 * s;
  const coreWidth = 5 * s;
  const fullWidth = 30 * s;
  const segments = 16;
  const pitAt = [0.24, 0.52, 0.78];

  // The tank wall: a heavy vertical line notched with three pits. Open pits are
  // drawn as gaps in the wall with a rust arc behind them; closed pits are
  // filled solid, which is the only state in which the wall line is unbroken.
  const pits = pitAt.map((t) => {
    const py = y + h * t;
    const r = 16 * s;
    return closed
      ? `<path d="M${wallX} ${py - r} A ${r} ${r} 0 0 1 ${wallX} ${py + r} Z" fill="${GREEN}"/>`
      : `<path d="M${wallX} ${py - r} A ${r} ${r} 0 0 1 ${wallX} ${py + r}" fill="none" stroke="${color}" stroke-width="${4.4 * s}"/>`;
  }).join("");
  const wallSegments = closed
    ? `<line x1="${wallX}" y1="${y - 18 * s}" x2="${wallX}" y2="${y + h + 18 * s}" stroke="${structure}" stroke-width="${7 * s}" opacity="0.8"/>`
    : pitAt.reduce((acc, t, index) => {
      const py = y + h * t;
      const prev = index === 0 ? y - 18 * s : y + h * pitAt[index - 1] + 16 * s;
      return `${acc}<line x1="${wallX}" y1="${prev}" x2="${wallX}" y2="${py - 16 * s}" stroke="${structure}" stroke-width="${7 * s}" opacity="0.8"/>`;
    }, "") + `<line x1="${wallX}" y1="${y + h * pitAt[2] + 16 * s}" x2="${wallX}" y2="${y + h + 18 * s}" stroke="${structure}" stroke-width="${7 * s}" opacity="0.8"/>`;

  // Each segment keeps its left edge and loses material toward the wall, so the
  // rod thins asymmetrically the way a real one does.
  const eaten = Math.max(0, Math.min(consumed, 1));
  const body = Array.from({length: segments}, (_, i) => {
    const t = (i + 0.5) / segments;
    const segY = y + (h / segments) * i;
    const nearPit = Math.min(...pitAt.map((p) => Math.abs(p - t)));
    const bias = 1 + 0.85 * Math.exp(-((nearPit / 0.09) ** 2));
    const remaining = Math.max(coreWidth, fullWidth - (fullWidth - coreWidth) * Math.min(1, eaten * bias));
    return `<rect x="${x}" y="${segY}" width="${remaining}" height="${h / segments + 0.6 * s}" fill="${color}"/>`;
  }).join("");

  // The threaded head at the top of the rod, which never corrodes because it
  // sits above the water line.
  const head = `<rect x="${x - 9 * s}" y="${y - 22 * s}" width="${fullWidth + 18 * s}" height="${18 * s}" fill="${structure}" rx="${2 * s}"/>`;

  return `<g>${head}${body}${wallSegments}${pits}</g>`;
}

const LABEL = "FIELD NOTE 17";

const slides = [
  // 1 — cover. Title lockup and a rod at full section beside three open pits.
  portraitCanvas({
    id: "fn17-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["THE ROD"], {x: 64, y: 250, size: 104, leading: 116, family: SANS, weight: 900, tracking: 0.8})}
    ${lines(["GOES FIRST."], {x: 64, y: 358, size: 104, leading: 116, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["The lining was never the plan."], {x: 68, y: 428, size: 38, leading: 52, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: ROD, x: 150, y: 486, width: 800, height: 610, rotation: -0.8, position: "xMidYMax", backing: GREEN, id: "fn17-01"})}
    ${tape(262, 462, 214, -4)}
    ${anodeSection(700, 1148, {consumed: 0, height: 142, scale: 0.6, color: RUST})}`,
  }),
  // 2 — torn oxblood field, tape, serif reverse type. No mark.
  portraitCanvas({
    id: "fn17-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="230" width="968" height="700" fill="${OXBLOOD}" transform="rotate(-0.8 540 580)"/>
    ${tape(214, 208, 226, -4)}
    ${tape(700, 906, 198, 3)}
    ${lines(["Every tank leaves", "the factory with flaws", "in its lining."], {x: 106, y: 366, size: 74, leading: 96, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["Pinholes. A thin spot on the seam.", "Bare steel at the fittings."], {x: 108, y: 690, size: 42, leading: 58, family: SERIF, weight: 400, fill: PAPER, tracking: 0.2})}
    ${lines(["The lining was never the plan on its own."], {x: 108, y: 830, size: 40, leading: 54, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${lines(["The plan is a rod."], {x: 76, y: 1064, size: 66, leading: 80, family: SERIF, weight: 700, fill: INK, tracking: 0})}`,
  }),
  // 3 — the mechanism. Type left, mark right, rod eaten opposite the pits.
  portraitCanvas({
    id: "fn17-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${lines(["The rod does not", "protect the tank", "evenly."], {x: 74, y: 320, size: 82, leading: 102, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It protects the places", "where the lining failed."], {x: 76, y: 640, size: 66, leading: 84, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${lines(["The current concentrates at the defect.", "The good glass needs nothing", "and gets nothing."], {x: 76, y: 828, size: 38, leading: 52, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${anodeSection(618, 972, {consumed: 0.45, height: 254, scale: 0.95, color: RUST})}`,
  }),
  // 4 — image-led. The fittings photograph carries the no-signal beat better
  // than two more bars of type; the strips this replaced said it twice.
  portraitCanvas({
    id: "fn17-04",
    number: 4,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `${photo({name: FITTINGS, x: 120, y: 168, width: 840, height: 700, rotation: 0.7, position: "xMidYMax", backing: OXBLOOD, id: "fn17-04"})}
    ${tape(220, 146, 214, -3)}
    ${lines(["There is no light for this.", "Nothing on the front of the", "appliance reports it."], {x: 74, y: 950, size: 50, leading: 64, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Water goes in cold and comes out hot for", "twelve years, and the tank is never told."], {x: 76, y: 1168, size: 36, leading: 50, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 5 — pressure point. Almost nothing on the page and no mark at all.
  portraitCanvas({
    id: "fn17-05",
    number: 5,
    total: 7,
    label: LABEL,
    body: `${lines(["The tank is not", "a party to any of it."], {x: 86, y: 520, size: 90, leading: 114, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It cannot be grateful", "and it cannot decline."], {x: 88, y: 792, size: 74, leading: 92, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${lines(["It holds water at a temperature."], {x: 88, y: 954, size: 42, leading: 56, family: SERIF, weight: 400, fill: SMOKE, tracking: 0.2})}`,
  }),
  // 6 — the misread signal. Halftone field, mark low and nearly spent.
  portraitCanvas({
    id: "fn17-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="640" y="236" width="376" height="452" fill="url(#fn17-06-dots)"/>
    ${lines(["The rotten-egg smell", "is the protection", "running."], {x: 74, y: 336, size: 72, leading: 92, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It is the only signal the system puts out,", "and it is a terrible one. It does not read", "as protection. It reads as a problem", "with the water."], {x: 74, y: 720, size: 40, leading: 56, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${lines(["Real diligence, wrong thing."], {x: 74, y: 948, size: 50, leading: 64, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${anodeSection(660, 1010, {consumed: 0.82, height: 236, scale: 0.85, color: RUST})}`,
  }),
  // 7 — close. Bare core wire, pits filled, wall line unbroken.
  portraitCanvas({
    id: "fn17-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: TAP, x: 240, y: 152, width: 600, height: 640, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn17-07"})}
    ${tape(336, 130, 206, 3)}
    ${lines(["Most of the weight is gone", "somewhere it does not come back from."], {x: 78, y: 872, size: 46, leading: 62, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The water at the tap is the same", "temperature it was yesterday."], {x: 80, y: 1020, size: 48, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${anodeSection(700, 1148, {consumed: 1, height: 142, scale: 0.6, color: RUST, closed: true})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The rod photograph
// dominant, the fittings small beside it, and the mark run as a two-state
// plate — full section against bare core wire — in the oxblood margin.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn17-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1230" y="0" width="370" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: ROD, x: 80, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn17-feature"})}
  ${photo({name: FITTINGS, x: 790, y: 140, width: 400, height: 560, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn17-feature"})}
  ${tape(214, 46, 226, -4)}
  ${tape(864, 116, 198, 4)}
  ${anodeSection(1272, 210, {consumed: 0, height: 300, scale: 0.72, color: RUST, structure: PAPER})}
  ${anodeSection(1272, 620, {consumed: 1, height: 300, scale: 0.72, color: RUST, closed: true, structure: PAPER})}
  ${scribble("M800 786 C902 748 1010 800 1112 762", RUST, 10)}
  ${grain(1600, 1000, "fn17-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). This
// build composes no photograph at all, so the assertion holds trivially — it is
// kept because the image-led rebuild will need it the moment photography lands.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 17 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-17-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-rod-goes-first", feature);

console.log("Rendered the Field Note 17 feature image and seven carousel SVG and PNG pairs.");
