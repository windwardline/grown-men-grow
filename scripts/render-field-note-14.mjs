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
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 14 — "Somebody Is Up on His Ladder".
// Signature vocabulary: a small hand-drawn downspout — a short vertical run, an
// elbow at the base, and a horizontal extension out to the yard — with a water
// line that only exists as far as it has actually travelled. It sits high in the
// vertical run at the open, reaches the elbow where the essay turns, and clears
// the extension entirely at the close. No prior vocabularies: the bank already
// holds tally marks, alarm arcs, a battery gauge, a diverging fork, a looping
// dashed path, a ledger, a transfer switch, a two-leg sling, and a strength
// curve, and this shares a skeleton with none of them.
//
// The photography is exclusive to this article and travels with it across its
// feature image and its carousel. The 2026-08-16 exclusivity ruling governs two
// separately published FEED posts sharing a picture, which is why
// verify-repository.mjs scans the Instagram families and not this pair.
// Slides 2, 4, 6 and the close stay type-led so the sequence keeps mixed weight.
const LADDER = "editorial/ladder-against-eave-autumn.png";
const LEAVES = "editorial/gutter-leaves-from-above.png";
const EXTENSION = "editorial/downspout-extension-turned.png";

const otherArticles = ["friends-in-conversation", "repairing-wooden-chair", "sunlit-writing-table", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "morning-armchair-mug", "truck-hood-map", "compass-in-hand", "pegboard-end-of-day", "trail-fork-daylight", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread", "bp-cuff-notebook", "running-shoes-alarm", "cutting-board-vegetables", "base-plates-anchor-bolts", "punch-list-tailgate", "transfer-switch-cabinet", "restaurant-table-after-lunch", "sling-capacity-tag", "rigging-shackles-bench", "wall-calendar-kitchen", "driveway-hoop-late-afternoon", "covered-slab-curing", "hose-wetting-fresh-pour", "garage-floor-hairline-crack"];

// `travel` runs 0 to 1 along the whole path: down the vertical run, around the
// elbow, and out the extension. The water line is drawn only that far, so the
// mark cannot show water leaving a downspout it has not reached yet.
function downspoutMark(x, y, travel, color = RUST, scale = 1) {
  const drop = 84 * scale;
  const reach = 76 * scale;
  const radius = 15 * scale;
  const topY = y;
  const elbowY = y + drop;
  const outX = x + reach;
  // The vertical run is the first two thirds of the journey; the elbow and the
  // extension share the last third.
  const split = 0.66;
  const moved = Math.min(1, Math.max(0, travel));
  let water = "";
  if (moved > 0.02) {
    if (moved <= split) {
      const endY = topY + drop * (moved / split);
      water = `<line x1="${x}" y1="${topY}" x2="${x}" y2="${endY.toFixed(1)}" stroke="${color}" stroke-width="${7 * scale}" stroke-linecap="round"/>`;
    } else {
      const along = (moved - split) / (1 - split);
      const endX = x + radius + (reach - radius) * along;
      water = `<path d="M${x} ${topY} L${x} ${elbowY - radius} Q${x} ${elbowY} ${x + radius} ${elbowY} L${endX.toFixed(1)} ${elbowY}" fill="none" stroke="${color}" stroke-width="${7 * scale}" stroke-linecap="round" stroke-linejoin="round"/>`;
    }
  }
  // The downspout itself is drawn faintly for its full length at every stage —
  // the pipe is always there; only the water moves.
  return `<g>
    <path d="M${x} ${topY} L${x} ${elbowY - radius} Q${x} ${elbowY} ${x + radius} ${elbowY} L${outX} ${elbowY}" fill="none" stroke="${color}" stroke-width="${3.5 * scale}" stroke-linecap="round" stroke-linejoin="round" opacity="0.45"/>
    <line x1="${x - 9 * scale}" y1="${topY}" x2="${x + 9 * scale}" y2="${topY}" stroke="${color}" stroke-width="${3.5 * scale}" stroke-linecap="round" opacity="0.45"/>
    ${water}
  </g>`;
}

const slides = [
  portraitCanvas({
    id: "fn14-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 14",
    body: `<rect x="648" y="146" width="384" height="286" fill="url(#fn14-01-dots)"/>
    ${lines(["SOMEBODY IS UP"], {x: 62, y: 258, size: 68, leading: 86, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["ON HIS LADDER."], {x: 62, y: 346, size: 68, leading: 86, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${lines(["He is not going out there."], {x: 64, y: 410, size: 38, leading: 50, family: SERIF, weight: 400, style: "italic", fill: SMOKE})}
    ${downspoutMark(872, 190, 0.18, RUST, 1.05)}
    ${photo({name: LADDER, x: 124, y: 466, width: 832, height: 736, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn14-01"})}
    ${tape(292, 442, 218, -4)}`,
  }),
  portraitCanvas({
    id: "fn14-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 14",
    background: PAPER,
    body: `${lines(["A gutter has nothing to do", "with keeping the roof dry."], {x: 72, y: 384, size: 58, leading: 80, family: SERIF, weight: 700})}
    <line x1="72" y1="506" x2="1008" y2="506" stroke="${OXBLOOD}" stroke-width="3"/>
    ${lines(["It is there for the six inches", "of dirt at the bottom", "of the wall."], {x: 74, y: 642, size: 54, leading: 74, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${downspoutMark(84, 924, 0.34, OXBLOOD, 1.9)}`,
  }),
  portraitCanvas({
    id: "fn14-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 14",
    background: PAPER,
    body: `${photo({name: LEAVES, x: 84, y: 150, width: 912, height: 768, rotation: 0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn14-03"})}
    ${tape(212, 128, 216, -3)}
    <rect x="66" y="974" width="948" height="240" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1094)"/>
    <text x="98" y="1042" fill="${INK}" font-family="${SERIF}" font-size="50" font-weight="700" transform="rotate(-0.5 540 1094)">The back goes in October.</text>
    <text x="98" y="1104" fill="${OXBLOOD}" font-family="${SERIF}" font-size="44" font-style="italic" transform="rotate(-0.5 540 1094)">The leaves come down on the same</text>
    <text x="98" y="1162" fill="${OXBLOOD}" font-family="${SERIF}" font-size="44" font-style="italic" transform="rotate(-0.5 540 1094)">schedule they always do.</text>
    ${downspoutMark(846, 1232, 0.46, RUST, 1)}`,
  }),
  portraitCanvas({
    id: "fn14-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 14",
    background: OXBLOOD,
    footerColor: PAPER,
    headerColor: PAPER,
    body: `${lines(["He has a window,", "a chair, and", "eleven weeks."], {x: 70, y: 486, size: 84, leading: 106, family: SERIF, weight: 700, fill: PAPER})}
    <line x1="72" y1="828" x2="470" y2="828" stroke="${RUST}" stroke-width="4"/>
    ${downspoutMark(72, 936, 0.52, PAPER, 1.6)}`,
  }),
  portraitCanvas({
    id: "fn14-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 14",
    background: INK,
    footerColor: PAPER,
    headerColor: PAPER,
    // Skeleton inverted against slide 3 on purpose — type above, photograph
    // below — so two image-led slides do not share a shape.
    body: `${lines(["They set the ladder on the", "soft ground and put the", "extension back pointed", "at the wall."], {x: 66, y: 254, size: 50, leading: 66, family: SERIF, weight: 700, fill: PAPER})}
    ${lines(["He taps the window.", "Nobody has ever heard a window."], {x: 68, y: 452, size: 40, leading: 54, family: SERIF, weight: 400, style: "italic", fill: PAPER_LIGHT})}
    ${downspoutMark(880, 216, 0.6, RUST, 1)}
    ${photo({name: EXTENSION, x: 74, y: 588, width: 932, height: 600, rotation: -0.6, position: "xMidYMid", backing: RUST, id: "fn14-05"})}
    ${tape(270, 566, 224, 4)}`,
  }),
  portraitCanvas({
    id: "fn14-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 14",
    body: `${lines(["Nobody asked him."], {x: 78, y: 470, size: 82, leading: 104, family: SERIF, weight: 700})}
    ${lines(["Asked, he says no,", "and every man in that", "driveway knows it."], {x: 78, y: 640, size: 56, leading: 76, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    <line x1="78" y1="900" x2="470" y2="900" stroke="${RUST}" stroke-width="4"/>
    ${downspoutMark(78, 1006, 0.72, RUST, 1.7)}`,
  }),
  portraitCanvas({
    id: "fn14-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 14",
    body: `<rect x="0" y="184" width="1080" height="6" fill="${OXBLOOD}"/>
    ${lines(["Nobody has ever climbed", "a ladder out of concern", "for a gutter."], {x: 68, y: 396, size: 62, leading: 82, family: SERIF, weight: 700})}
    ${lines(["They go up because", "of the wall."], {x: 70, y: 610, size: 54, leading: 72, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    <rect x="0" y="852" width="1080" height="6" fill="${RUST}"/>
    ${lines(["Nothing on the house records", "who turned the extension."], {x: 68, y: 976, size: 50, leading: 68, family: SERIF, weight: 700})}
    ${downspoutMark(68, 1096, 1, GREEN, 2)}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The phrases carried here
// are observations rather than the headline.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn14-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1196" y="0" width="404" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: LADDER, x: 434, y: 92, width: 716, height: 816, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn14-feature"})}
  ${photo({name: EXTENSION, x: 100, y: 226, width: 306, height: 610, rotation: 1.5, position: "xMidYMid", backing: OXBLOOD, id: "fn14-feature"})}
  ${tape(542, 68, 224, -3)}
  ${tape(164, 202, 186, 4)}
  ${downspoutMark(1290, 214, 0.18, PAPER, 1.5)}
  ${lines(["THE ROOF"], {x: 1290, y: 404, size: 28, leading: 38, family: SANS, weight: 900, tracking: 3, fill: PAPER})}
  ${downspoutMark(1290, 610, 1, RUST, 1.5)}
  ${lines(["THE WALL"], {x: 1290, y: 800, size: 28, leading: 38, family: SANS, weight: 900, tracking: 3, fill: PAPER})}
  ${grain(1600, 1000, "fn14-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 14 composes editorial/${name}.png, which belongs to another article.`);
  }
}
// Every photograph generated for this note must actually appear. A source that
// is banked, documented, and then silently composed out is the quiet way an
// article ends up reusing another's imagery later because "there wasn't enough".
for (const source of [LADDER, LEAVES, EXTENSION]) {
  if (!all.includes(`/assets/source/${source}`)) {
    throw new Error(`Field Note 14 banked ${source} but composes it nowhere.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-14-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "somebody-is-up-on-his-ladder", feature);

console.log("Rendered the Field Note 14 feature image and seven carousel SVG and PNG pairs.");
