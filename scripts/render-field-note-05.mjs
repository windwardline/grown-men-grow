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
  escapeXml,
  grain,
  lines,
  photo,
  portraitCanvas,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 5 — "Ask for Help While It's Still Cheap".
// Field Note family: image-led with practical energy. Signature vocabulary:
// small hand-drawn price tags on strings, tied to key phrases. No FN2 route
// lines, FN3 tally marks, FN4 weight bars, or Essay 1 stacked center strips.
//
// Per-article image rule: these three photographs belong to Field Note 5 alone.
const COUNTER = "editorial/hardware-counter-question.png";
const WALL = "editorial/open-wall-wiring.png";
const PAPERWORK = "editorial/paperwork-second-eyes.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs"];

function priceTag(x, y, label, color = RUST, rotation = -6) {
  const w = 148;
  const h = 64;
  return `<g transform="rotate(${rotation} ${x + w / 2} ${y + h / 2})">
    <path d="M${x + 18} ${y - 26} C${x + 4} ${y - 12} ${x + 10} ${y - 4} ${x + 16} ${y}" fill="none" stroke="${color}" stroke-width="4" stroke-linecap="round"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${PAPER_LIGHT}" stroke="${color}" stroke-width="4"/>
    <circle cx="${x + 18}" cy="${y + 14}" r="5" fill="none" stroke="${color}" stroke-width="3"/>
    <text x="${x + 34}" y="${y + 43}" fill="${color}" font-family="${SANS}" font-size="28" font-weight="900" letter-spacing="1.4">${escapeXml(label)}</text>
  </g>`;
}

const slides = [
  portraitCanvas({
    id: "fn5-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 05",
    body: `${lines(["ASK FOR HELP"], {x: 64, y: 250, size: 88, leading: 100, family: SANS, weight: 900, tracking: 1.2})}
    ${lines(["WHILE IT’S STILL CHEAP."], {x: 64, y: 360, size: 60, leading: 74, family: SANS, weight: 900, tracking: 1.2, fill: OXBLOOD})}
    ${priceTag(820, 210, "CHEAP", GREEN, 8)}
    ${photo({name: COUNTER, x: 140, y: 440, width: 820, height: 760, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn5-01"})}
    ${tape(250, 416, 210, -4)}`,
  }),
  portraitCanvas({
    id: "fn5-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 05",
    background: PAPER,
    body: `${lines(["There is a window where", "asking costs almost nothing."], {x: 72, y: 300, size: 80, leading: 96, family: SERIF, weight: 700})}
    ${lines(["A question at the counter.", "A text.", "Twenty minutes of looking", "less capable than advertised."], {x: 74, y: 560, size: 50, leading: 68, family: SERIF, weight: 400, style: "italic"})}
    ${priceTag(720, 880, "PRIDE", RUST, -5)}`,
  }),
  portraitCanvas({
    id: "fn5-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 05",
    body: `${lines(["We let the window close.", "Then we pay", "the crisis rate."], {x: 90, y: 540, size: 80, leading: 98, family: SERIF, weight: 700, style: "italic"})}
    ${priceTag(92, 800, "×100", OXBLOOD, -4)}`,
  }),
  portraitCanvas({
    id: "fn5-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 05",
    background: PAPER,
    body: `${photo({name: WALL, x: 96, y: 160, width: 888, height: 780, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn5-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1000" width="936" height="110" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1055)"/>
    <text x="102" y="1074" fill="${INK}" font-family="${SERIF}" font-size="47" font-weight="700" transform="rotate(-0.5 540 1055)">The plumbing question becomes</text>
    <rect x="72" y="1128" width="936" height="104" fill="${GREEN}" transform="rotate(-0.5 540 1180)"/>
    <text x="102" y="1196" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="38" font-weight="900" letter-spacing="1.1" transform="rotate(-0.5 540 1180)">A FLOORING QUESTION. BUDGET BECOMES DEBT.</text>`,
  }),
  portraitCanvas({
    id: "fn5-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 05",
    body: `${lines(["Knowing when to ask", "is part of the skill."], {x: 88, y: 400, size: 88, leading: 102, family: SERIF, weight: 700})}
    ${lines(["The electrician calls the inspector.", "The pilot calls the tower.", "That call is what good looks like."], {x: 90, y: 680, size: 50, leading: 70, family: SERIF, weight: 400, style: "italic"})}
    ${priceTag(90, 900, "SKILL", GREEN, -5)}`,
  }),
  portraitCanvas({
    id: "fn5-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 05",
    background: PAPER,
    body: `${photo({name: PAPERWORK, x: 200, y: 150, width: 780, height: 700, rotation: 1.1, position: "xMidYMid", backing: GREEN, id: "fn5-06"})}
    ${tape(330, 128, 200, 3)}
    ${lines(["The cheap question:"], {x: 72, y: 970, size: 62, leading: 76, family: SERIF, weight: 700})}
    ${lines(["“Can you look at this", "before I make it worse?”"], {x: 74, y: 1070, size: 56, leading: 72, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${priceTag(760, 1160, "SMALL", RUST, 5)}`,
  }),
  portraitCanvas({
    id: "fn5-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 05",
    body: `${lines(["The window is open", "right now, on something."], {x: 90, y: 480, size: 84, leading: 100, family: SERIF, weight: 700})}
    ${lines(["You know which one."], {x: 92, y: 700, size: 64, leading: 80, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD})}
    ${priceTag(92, 860, "TODAY", GREEN, -4)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn5-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="0" y="0" width="440" height="1000" fill="${PAPER}"/>
  ${photo({name: COUNTER, x: 400, y: 80, width: 800, height: 840, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "fn5-feature"})}
  ${photo({name: WALL, x: 1190, y: 240, width: 360, height: 520, rotation: 1.5, position: "xMidYMid", backing: OXBLOOD, id: "fn5-feature"})}
  ${tape(510, 56, 220, -4)}
  ${tape(1260, 216, 180, 4)}
  ${priceTag(120, 140, "CHEAP", GREEN, -6)}
  ${priceTag(150, 320, "PRIDE", RUST, 4)}
  ${priceTag(110, 500, "×100", OXBLOOD, -3)}
  <rect x="96" y="740" width="280" height="170" fill="${GREEN}" transform="rotate(-1.4 236 825)"/>
  ${grain(1600, 1000, "fn5-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 5 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-05-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "ask-for-help-while-its-still-cheap", feature);

console.log("Rendered the Field Note 5 feature image and seven carousel SVG and PNG pairs.");
