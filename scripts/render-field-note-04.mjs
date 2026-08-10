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

// Field Note 4 — "A Confession Can Still Be Selfish".
// Recognition family: object-detail and weight-led. Signature vocabulary:
// heavy ink weight-bars set under key phrases, like a burden underlining the
// words. No FN2 route lines, no FN3 tally marks or circled day, no Essay 1
// stacked center strips.
//
// Per-article image rule: these three photographs belong to Field Note 4 alone.
const DUFFEL = "editorial/hallway-duffel-set-down.png";
const HANDOFF = "editorial/tool-bag-handoff.png";
const CHAIRS = "editorial/porch-two-chairs.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery"];

function weightBar(x, y, width, color = INK, height = 18, rotation = -0.6) {
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${color}" transform="rotate(${rotation} ${x + width / 2} ${y + height / 2})"/>`;
}

const slides = [
  // 1 — cover: title upper-left, duffel photo lower-right.
  portraitCanvas({
    id: "fn4-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 04",
    body: `${lines(["A CONFESSION CAN"], {x: 64, y: 240, size: 78, leading: 90, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["STILL BE SELFISH."], {x: 64, y: 350, size: 78, leading: 90, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${weightBar(64, 392, 560, INK, 20)}
    ${photo({name: DUFFEL, x: 230, y: 480, width: 790, height: 740, rotation: 0.9, position: "xMidYMid", backing: GREEN, id: "fn4-01"})}
    ${tape(330, 456, 210, -3)}
    ${weightBar(96, 1240, 300, OXBLOOD, 16, -1)}`,
  }),
  // 2 — dense type: the exhale.
  portraitCanvas({
    id: "fn4-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 04",
    background: PAPER,
    body: `${lines(["Say the hard thing,", "feel the pressure drop."], {x: 72, y: 320, size: 88, leading: 102, family: SERIF, weight: 700})}
    ${weightBar(74, 480, 480, OXBLOOD, 18)}
    ${lines(["The relief is real.", "It arrives whether or not", "anything else happens."], {x: 74, y: 640, size: 52, leading: 70, family: SERIF, weight: 400, style: "italic"})}
    ${weightBar(74, 880, 220, GREEN, 16, -1)}`,
  }),
  // 3 — almost empty: the trap.
  portraitCanvas({
    id: "fn4-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 04",
    body: `${lines(["That is the trap.", "The exhale feels", "like completion."], {x: 90, y: 540, size: 82, leading: 100, family: SERIF, weight: 700, style: "italic"})}
    ${weightBar(92, 800, 380, INK, 18)}`,
  }),
  // 4 — handoff photo with strips.
  portraitCanvas({
    id: "fn4-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 04",
    background: PAPER,
    body: `${photo({name: HANDOFF, x: 96, y: 160, width: 888, height: 780, rotation: -0.9, position: "xMidYMid", backing: OXBLOOD, id: "fn4-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1000" width="936" height="110" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1055)"/>
    <text x="102" y="1074" fill="${INK}" font-family="${SERIF}" font-size="46" font-weight="700" transform="rotate(-0.5 540 1055)">“I told you about my temper”</text>
    <rect x="72" y="1128" width="936" height="104" fill="${OXBLOOD}" transform="rotate(-0.5 540 1180)"/>
    <text x="102" y="1198" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="44" font-weight="900" letter-spacing="1.2" transform="rotate(-0.5 540 1180)">IS NOT THE SAME AS MANAGING IT.</text>`,
  }),
  // 5 — the tells, card page.
  portraitCanvas({
    id: "fn4-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 04",
    body: `<rect x="88" y="210" width="904" height="860" fill="${PAPER}" transform="rotate(-0.8 540 640)"/>
    ${tape(200, 186, 220, -4)}
    ${tape(700, 1032, 200, 3)}
    ${lines(["The tells:"], {x: 150, y: 360, size: 84, leading: 96, family: SERIF, weight: 700})}
    ${weightBar(150, 404, 260, RUST, 16)}
    ${lines(["It arrives on his schedule.", "Detailed about feelings,", "vague about actions.", "It asks to be admired."], {x: 150, y: 540, size: 54, leading: 84, family: SERIF, weight: 400, style: "italic"})}`,
  }),
  // 6 — repair definition with chairs photo.
  portraitCanvas({
    id: "fn4-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 04",
    background: PAPER,
    body: `${photo({name: CHAIRS, x: 250, y: 150, width: 760, height: 700, rotation: 1.1, position: "xMidYMid", backing: GREEN, id: "fn4-06"})}
    ${tape(380, 128, 200, 3)}
    ${lines(["Repair is disclosure plus", "everything disclosure", "lets you skip."], {x: 72, y: 970, size: 66, leading: 80, family: SERIF, weight: 700})}
    ${weightBar(74, 1180, 420, OXBLOOD, 18)}
    ${lines(["It repeats. It is a pattern, not a speech."], {x: 74, y: 1256, size: 44, leading: 58, family: SERIF, weight: 400, style: "italic"})}`,
  }),
  // 7 — quiet close.
  portraitCanvas({
    id: "fn4-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 04",
    body: `${lines(["Open up.", "Take the exhale."], {x: 90, y: 460, size: 96, leading: 110, family: SERIF, weight: 700})}
    ${lines(["Then stay in the room."], {x: 92, y: 680, size: 64, leading: 80, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${weightBar(92, 740, 500, INK, 18)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn4-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="0" y="640" width="1600" height="360" fill="${PAPER}"/>
  ${photo({name: DUFFEL, x: 120, y: 90, width: 760, height: 810, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn4-feature"})}
  ${photo({name: CHAIRS, x: 940, y: 180, width: 540, height: 620, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn4-feature"})}
  ${tape(230, 66, 220, -4)}
  ${tape(1040, 156, 190, 4)}
  ${weightBar(950, 860, 480, INK, 22, -0.8)}
  ${weightBar(950, 908, 300, OXBLOOD, 18, -0.8)}
  ${grain(1600, 1000, "fn4-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 4 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-04-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "a-confession-can-still-be-selfish", feature);

console.log("Rendered the Field Note 4 feature image and seven carousel SVG and PNG pairs.");
