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

// Field Note 6 — "Anger Is a Terrible Manager".
// Signature vocabulary: alarm arcs — three short drawn arcs radiating from a
// point, as from a bell. No prior vocabularies.
const DETECTOR = "editorial/detector-test-press.png";
const PANEL = "editorial/breaker-panel-check.png";
const PAUSE = "editorial/kitchen-counter-pause.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes"];

function alarmArcs(x, y, color = RUST, scale = 1) {
  const s = scale;
  return `<g fill="none" stroke="${color}" stroke-width="${6 * s}" stroke-linecap="round">
    <path d="M${x} ${y} a${18 * s} ${18 * s} 0 0 1 ${18 * s} ${-14 * s}"/>
    <path d="M${x + 8 * s} ${y + 14 * s} a${34 * s} ${34 * s} 0 0 1 ${34 * s} ${-26 * s}"/>
    <path d="M${x + 16 * s} ${y + 28 * s} a${50 * s} ${50 * s} 0 0 1 ${50 * s} ${-38 * s}"/>
  </g>`;
}

const slides = [
  portraitCanvas({
    id: "fn6-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 06",
    body: `${lines(["ANGER IS A"], {x: 64, y: 250, size: 88, leading: 100, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["TERRIBLE MANAGER."], {x: 64, y: 364, size: 72, leading: 86, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${alarmArcs(850, 250, RUST, 1.4)}
    ${photo({name: DETECTOR, x: 150, y: 440, width: 800, height: 760, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn6-01"})}
    ${tape(260, 416, 210, -4)}`,
  }),
  portraitCanvas({
    id: "fn6-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 06",
    background: PAPER,
    body: `${lines(["It’s a smoke detector.", "Loud, fast,", "impossible to ignore."], {x: 72, y: 320, size: 82, leading: 98, family: SERIF, weight: 700})}
    ${lines(["And completely unqualified", "to put out the fire."], {x: 74, y: 660, size: 54, leading: 72, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${alarmArcs(830, 300, OXBLOOD, 1.1)}`,
  }),
  portraitCanvas({
    id: "fn6-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 06",
    body: `${lines(["The trouble starts", "when we promote it."], {x: 90, y: 560, size: 86, leading: 102, family: SERIF, weight: 700, style: "italic"})}
    ${alarmArcs(92, 700, INK, 1)}`,
  }),
  portraitCanvas({
    id: "fn6-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 06",
    background: PAPER,
    body: `${photo({name: PANEL, x: 96, y: 160, width: 888, height: 780, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn6-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1000" width="936" height="110" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1055)"/>
    <text x="102" y="1074" fill="${INK}" font-family="${SERIF}" font-size="47" font-weight="700" transform="rotate(-0.5 540 1055)">The alarm only knows one word: now.</text>
    <rect x="72" y="1128" width="936" height="104" fill="${GREEN}" transform="rotate(-0.5 540 1180)"/>
    <text x="102" y="1196" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="38" font-weight="900" letter-spacing="1.1" transform="rotate(-0.5 540 1180)">IT CAN’T TELL A REAL FIRE FROM BURNT TOAST.</text>`,
  }),
  portraitCanvas({
    id: "fn6-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 06",
    body: `<rect x="88" y="220" width="904" height="820" fill="${PAPER}" transform="rotate(-0.8 540 630)"/>
    ${tape(200, 196, 220, -4)}
    ${lines(["The tell:"], {x: 150, y: 380, size: 84, leading: 96, family: SERIF, weight: 700})}
    ${lines(["Your responses arrive", "pre-decided.", "", "The voice. The silence.", "The door. One subroutine."], {x: 150, y: 520, size: 54, leading: 76, family: SERIF, weight: 400, style: "italic"})}
    ${alarmArcs(760, 320, RUST, 1)}`,
  }),
  portraitCanvas({
    id: "fn6-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 06",
    background: PAPER,
    body: `${photo({name: PAUSE, x: 220, y: 150, width: 760, height: 720, rotation: 1.1, position: "xMidYMid", backing: GREEN, id: "fn6-06"})}
    ${tape(350, 128, 200, 3)}
    ${lines(["The demotion: stop.", "Find the actual fire —", "it’s rarely where the", "smoke is thickest."], {x: 72, y: 980, size: 58, leading: 74, family: SERIF, weight: 700})}
    ${lines(["Then decide. You, not it."], {x: 74, y: 1270, size: 48, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}`,
  }),
  portraitCanvas({
    id: "fn6-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 06",
    body: `${lines(["The goal isn’t silence."], {x: 90, y: 520, size: 88, leading: 104, family: SERIF, weight: 700})}
    ${lines(["It’s signal."], {x: 92, y: 680, size: 110, leading: 120, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD})}
    ${alarmArcs(560, 660, GREEN, 1.2)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn6-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1160" y="0" width="440" height="1000" fill="${PAPER}"/>
  ${photo({name: DETECTOR, x: 130, y: 90, width: 730, height: 820, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn6-feature"})}
  ${photo({name: PAUSE, x: 890, y: 210, width: 500, height: 640, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn6-feature"})}
  ${tape(240, 66, 220, -4)}
  ${tape(990, 186, 190, 4)}
  ${alarmArcs(1450, 160, RUST, 1.6)}
  ${alarmArcs(1470, 820, GREEN, 1.2)}
  ${grain(1600, 1000, "fn6-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 6 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-06-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "anger-is-a-terrible-manager", feature);

console.log("Rendered the Field Note 6 feature image and seven carousel SVG and PNG pairs.");
