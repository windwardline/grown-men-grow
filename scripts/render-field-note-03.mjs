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

// Field Note 3 — "Friendship Has a Maintenance Schedule".
// Recognition family: documentary crops, object detail, prose-led pacing.
// Signature vocabulary: maintenance-interval tally marks and one hand-drawn
// ellipse circling the ordinary Tuesday. No Field Note 2 route lines or
// tracing paper; no Essay 1 stacked center strips.
//
// Per-article image rule (founder-ruled 2026-08-09): these three photographs
// belong to Field Note 3 alone.
const GARAGE = "editorial/garage-doorway-call.png";
const OIL = "editorial/oil-check-detail.png";
const DETECTOR = "editorial/smoke-detector-battery.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause"];

function tally(x, y, groups, color = OXBLOOD, height = 34) {
  const parts = [];
  for (let g = 0; g < groups; g += 1) {
    const gx = x + g * 64;
    for (let i = 0; i < 4; i += 1) {
      parts.push(`<line x1="${gx + i * 11}" y1="${y}" x2="${gx + i * 11 - 3}" y2="${y + height}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`);
    }
    parts.push(`<line x1="${gx - 8}" y1="${y + height - 4}" x2="${gx + 40}" y2="${y + 6}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>`);
  }
  return parts.join("");
}

function circled(cx, cy, rx, ry, color = RUST) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${color}" stroke-width="7" transform="rotate(-2 ${cx} ${cy})" stroke-linecap="round"/>`;
}

const slides = [
  // 1 — cover: horizontal stacked title, documentary lead low.
  portraitCanvas({
    id: "fn3-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 03",
    body: `${lines(["FRIENDSHIP HAS A"], {x: 64, y: 250, size: 84, leading: 96, family: SANS, weight: 900, tracking: 1.2, fill: INK})}
    <rect x="56" y="292" width="792" height="112" fill="${OXBLOOD}" transform="rotate(-0.8 452 348)"/>
    <text x="84" y="374" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="82" font-weight="900" letter-spacing="1.2" transform="rotate(-0.8 452 348)">MAINTENANCE</text>
    ${lines(["SCHEDULE."], {x: 64, y: 508, size: 84, leading: 96, family: SANS, weight: 900, tracking: 1.2})}
    ${tally(866, 150, 2)}
    ${photo({name: GARAGE, x: 120, y: 570, width: 850, height: 640, rotation: -0.8, position: "xMidYMin", backing: GREEN, id: "fn3-01"})}
    ${tape(220, 548, 210, -4)}`,
  }),
  // 2 — dense type.
  portraitCanvas({
    id: "fn3-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 03",
    background: PAPER,
    body: `${lines(["Men maintain everything", "they value."], {x: 72, y: 300, size: 92, leading: 104, family: SERIF, weight: 700})}
    ${lines(["Oil that hasn’t failed.", "Decks against rain that hasn’t fallen.", "Smoke detectors, twice a year."], {x: 74, y: 540, size: 50, leading: 72, family: SERIF, weight: 400, style: "italic"})}
    ${tally(74, 820, 3, GREEN)}
    ${tally(74, 900, 2, OXBLOOD)}`,
  }),
  // 3 — almost empty.
  portraitCanvas({
    id: "fn3-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 03",
    body: `${lines(["Then we put the friendships", "we’d run into traffic for", "on a schedule of never."], {x: 90, y: 560, size: 76, leading: 94, family: SERIF, weight: 700, style: "italic"})}
    ${tally(92, 780, 1, RUST)}`,
  }),
  // 4 — oil detail with strips.
  portraitCanvas({
    id: "fn3-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 03",
    background: PAPER,
    body: `${photo({name: OIL, x: 96, y: 160, width: 888, height: 780, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn3-04"})}
    ${tape(190, 138, 210, -3)}
    <rect x="72" y="1000" width="936" height="110" fill="${PAPER_LIGHT}" transform="rotate(-0.5 540 1055)"/>
    <text x="102" y="1074" fill="${INK}" font-family="${SERIF}" font-size="47" font-weight="700" transform="rotate(-0.5 540 1055)">“A real friendship shouldn’t need upkeep”</text>
    <rect x="72" y="1128" width="936" height="104" fill="${GREEN}" transform="rotate(-0.5 540 1180)"/>
    <text x="102" y="1198" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="44" font-weight="900" letter-spacing="1.2" transform="rotate(-0.5 540 1180)">NOBODY CALLS A TRUCK WORTHLESS FOR NEEDING BRAKES.</text>`,
  }),
  // 5 — big serif page.
  portraitCanvas({
    id: "fn3-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 03",
    body: `${lines(["History is why the", "friendship stands."], {x: 88, y: 420, size: 96, leading: 108, family: SERIF, weight: 700})}
    ${lines(["It is not why", "the lights are on."], {x: 90, y: 720, size: 96, leading: 108, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD})}`,
  }),
  // 6 — detector photo + schedule card with circled Tuesday.
  portraitCanvas({
    id: "fn3-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 03",
    background: PAPER,
    body: `${photo({name: DETECTOR, x: 470, y: 150, width: 545, height: 620, rotation: 1.2, position: "xMidYMid", backing: GREEN, id: "fn3-06"})}
    ${tape(600, 128, 190, 3)}
    <rect x="64" y="820" width="952" height="420" fill="${PAPER_LIGHT}" transform="rotate(-0.6 540 1030)"/>
    ${tape(150, 796, 200, -4)}
    <text x="104" y="912" fill="${INK}" font-family="${SANS}" font-size="46" font-weight="900" letter-spacing="1.6" transform="rotate(-0.6 540 1030)">THE SCHEDULE:</text>
    ${lines(["A call on a Tuesday.", "A specific question.", "One honest sentence back.", "A plan with a date on it."], {x: 104, y: 990, size: 47, leading: 64, family: SERIF, weight: 400})}
    ${circled(310, 975, 240, 46)}`,
  }),
  // 7 — quiet close.
  portraitCanvas({
    id: "fn3-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 03",
    body: `${lines(["Somebody has to", "go first."], {x: 90, y: 480, size: 100, leading: 112, family: SERIF, weight: 700})}
    ${lines(["Going first isn’t losing.", "It’s ownership."], {x: 92, y: 700, size: 56, leading: 72, family: SERIF, weight: 400, style: "italic"})}
    ${tally(92, 860, 2, GREEN)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn3-feature")}
  <rect width="1600" height="1000" fill="${PAPER}"/>
  <rect x="0" y="0" width="470" height="1000" fill="${PAPER_LIGHT}"/>
  ${photo({name: GARAGE, x: 430, y: 70, width: 780, height: 850, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn3-feature"})}
  ${photo({name: OIL, x: 1180, y: 250, width: 370, height: 500, rotation: 1.6, position: "xMidYMid", backing: GREEN, id: "fn3-feature"})}
  ${tape(540, 48, 220, -4)}
  ${tape(1250, 226, 180, 4)}
  ${tally(90, 120, 2, OXBLOOD)}
  ${tally(90, 210, 2, GREEN)}
  ${tally(90, 300, 1, RUST)}
  <rect x="84" y="700" width="300" height="180" fill="${GREEN}" transform="rotate(-1.4 234 790)"/>
  ${grain(1600, 1000, "fn3-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 3 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-03-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "friendship-has-a-maintenance-schedule", feature);

console.log("Rendered the Field Note 3 feature image and seven carousel SVG and PNG pairs.");
