import {
  GREEN,
  INK,
  OXBLOOD,
  PAPER,
  PAPER_LIGHT,
  RUST,
  SANS,
  SERIF,
  defs,
  grain,
  lines,
  photo,
  portraitCanvas,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 8 — "You Can't Outwork a Wrong Direction".
// Signature vocabulary: a hand-drawn fork of two diverging arrows — one faint,
// one committed. The final slide bolds the chosen arrow. No prior vocabularies.
const MAP = "editorial/truck-hood-map.png";
const FORK = "editorial/trail-fork-daylight.png";
const COMPASS = "editorial/compass-in-hand.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "pegboard-end-of-day", "morning-armchair-mug"];

function divergingArrows(x, y, color = RUST, scale = 1, committed = "up") {
  const s = scale;
  const faint = committed === "up" ? "down" : "up";
  const arrow = (direction, opacity, width) => {
    const dy = direction === "up" ? -46 * s : 46 * s;
    const tip = direction === "up" ? -52 * s : 52 * s;
    return `<g fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" opacity="${opacity}">
      <path d="M${x} ${y} q ${34 * s} 0 ${62 * s} ${dy}"/>
      <path d="M${x + 47 * s} ${y + tip * 0.72} l ${15 * s} ${dy * 0.28} l ${-21 * s} ${direction === "up" ? 7 * s : -7 * s}"/>
    </g>`;
  };
  return `<g>${arrow(committed, 1, 7 * s)}${arrow(faint, 0.38, 5 * s)}</g>`;
}

const slides = [
  portraitCanvas({
    id: "fn8-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 08",
    body: `${lines(["YOU CAN’T OUTWORK"], {x: 64, y: 250, size: 76, leading: 90, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["A WRONG DIRECTION."], {x: 64, y: 356, size: 76, leading: 90, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${divergingArrows(870, 250, RUST, 1.5)}
    ${photo({name: MAP, x: 150, y: 440, width: 800, height: 760, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn8-01"})}
    ${tape(260, 416, 210, -4)}`,
  }),
  portraitCanvas({
    id: "fn8-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 08",
    background: PAPER,
    body: `${lines(["There’s a kind of lost only", "disciplined men achieve:"], {x: 72, y: 320, size: 72, leading: 90, family: SERIF, weight: 700})}
    ${lines(["miles from the truck,", "making excellent time,", "exactly the wrong way."], {x: 74, y: 620, size: 56, leading: 74, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${divergingArrows(800, 950, OXBLOOD, 1.1)}`,
  }),
  portraitCanvas({
    id: "fn8-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 08",
    body: `${lines(["Every mile of effort", "buys another mile", "of wrong."], {x: 90, y: 500, size: 88, leading: 104, family: SERIF, weight: 700, style: "italic"})}
    ${divergingArrows(92, 880, INK, 1)}`,
  }),
  portraitCanvas({
    id: "fn8-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 08",
    background: PAPER,
    body: `${photo({name: FORK, x: 96, y: 160, width: 888, height: 780, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn8-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1000" width="936" height="110" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1055)"/>
    <text x="102" y="1074" fill="${INK}" font-family="${SERIF}" font-size="47" font-weight="700" transform="rotate(-0.5 540 1055)">More effort feels like an answer.</text>
    <rect x="72" y="1128" width="936" height="104" fill="${GREEN}" transform="rotate(-0.5 540 1180)"/>
    <text x="102" y="1196" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="36" font-weight="900" letter-spacing="1.1" transform="rotate(-0.5 540 1180)">MEASURABLE. VIRTUOUS. A HIDING PLACE.</text>`,
  }),
  portraitCanvas({
    id: "fn8-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 08",
    body: `<rect x="88" y="220" width="904" height="820" fill="${PAPER}" transform="rotate(-0.8 540 630)"/>
    ${tape(200, 196, 220, -4)}
    ${lines(["The compass questions:"], {x: 150, y: 380, size: 74, leading: 88, family: SERIF, weight: 700})}
    ${lines(["If this works completely —", "what do I have?", "", "Who set this course?", "", "What’s the cost-per-mile lately?"], {x: 150, y: 510, size: 50, leading: 68, family: SERIF, weight: 400, style: "italic"})}
    ${divergingArrows(780, 300, RUST, 1)}`,
  }),
  portraitCanvas({
    id: "fn8-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 08",
    background: PAPER,
    body: `${photo({name: COMPASS, x: 220, y: 150, width: 760, height: 720, rotation: 1.1, position: "xMidYMid", backing: GREEN, id: "fn8-06"})}
    ${tape(350, 128, 200, 3)}
    ${lines(["Turning is not quitting.", "The endurance transfers.", "The discipline transfers."], {x: 72, y: 980, size: 58, leading: 76, family: SERIF, weight: 700})}
    ${lines(["Only the wrong heading gets left behind."], {x: 74, y: 1250, size: 46, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}`,
  }),
  portraitCanvas({
    id: "fn8-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 08",
    body: `${lines(["Engine off. Map out."], {x: 90, y: 520, size: 92, leading: 106, family: SERIF, weight: 700})}
    ${lines(["Once in a while, the map saves", "you the strong miles."], {x: 92, y: 680, size: 56, leading: 74, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${divergingArrows(560, 900, GREEN, 1.4)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn8-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1160" y="0" width="440" height="1000" fill="${PAPER}"/>
  ${photo({name: MAP, x: 130, y: 90, width: 730, height: 820, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn8-feature"})}
  ${photo({name: COMPASS, x: 890, y: 210, width: 500, height: 640, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn8-feature"})}
  ${tape(240, 66, 220, -4)}
  ${tape(990, 186, 190, 4)}
  ${divergingArrows(1450, 160, RUST, 1.6)}
  ${divergingArrows(1440, 830, GREEN, 1.2)}
  ${grain(1600, 1000, "fn8-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 8 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-08-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "you-cant-outwork-a-wrong-direction", feature);

console.log("Rendered the Field Note 8 feature image and seven carousel SVG and PNG pairs.");
