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
  escapeXml,
  grain,
  lines,
  photo,
  portraitCanvas,
  scribble,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 2 — "Call Your Friends Before There's a Reason".
// Approved direction: bright friendship-led collage, movement, daylight,
// ordinary life, torn tracing paper, a hand-drawn route line, receipt
// fragments with no readable data, one green block. The route line is this
// family's signature; it must not reuse Essay 1's stacked center strips.
//
// Founder rule (2026-08-09): every photograph appears on exactly one surface
// family. These four sources belong to Field Note 2 alone.
const WALKING = "editorial/walking-after-the-work.png";
const DECK = "editorial/deck-board-detail.png";
const TRUCK = "editorial/truck-tailgate-loading.png";
const PORCH = "editorial/porch-coffee-pause.png";

const usedElsewhere = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools"];

function routeLine(pathData, color = RUST, width = 9) {
  return scribble(pathData, color, width);
}

function routeArrow(x, y, color = RUST) {
  return `<path d="M${x - 34} ${y - 26} L${x} ${y} L${x - 40} ${y + 16}" fill="none" stroke="${color}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function tracingPaper(x, y, width, height, rotation = 0) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  return `<g transform="rotate(${rotation} ${cx} ${cy})">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#FFFFFF" opacity="0.55"/>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${INK}" stroke-opacity="0.12" stroke-width="2"/>
  </g>`;
}

function receiptFragment(x, y, width, height, rotation = 0) {
  const cx = x + width / 2;
  const cy = y + height / 2;
  const rows = [];
  for (let i = 1; i <= 3; i += 1) {
    rows.push(`<rect x="${x + 14}" y="${y + i * (height / 4.4)}" width="${width - 28 - (i % 2) * 26}" height="7" fill="${SMOKE}" opacity="0.55"/>`);
  }
  return `<g transform="rotate(${rotation} ${cx} ${cy})">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="#FBF8F1"/>
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="none" stroke="${INK}" stroke-opacity="0.14" stroke-width="1.6"/>
    ${rows.join("")}
  </g>`;
}

function verticalTitle(x, yBottom, text, size, color) {
  return `<text x="${x}" y="${yBottom}" fill="${color}" font-family="${SANS}" font-size="${size}" font-weight="900" letter-spacing="2.4" transform="rotate(-90 ${x} ${yBottom})">${escapeXml(text)}</text>`;
}

const slides = [
  // 1 — cover: wide photograph, vertical title at the left edge, figures low.
  portraitCanvas({
    id: "fn2-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 02",
    body: `${tracingPaper(64, 150, 520, 420, -1.5)}
    ${photo({name: WALKING, x: 150, y: 258, width: 878, height: 940, rotation: -0.8, position: "xMidYMax", backing: GREEN, id: "fn2-01"})}
    ${tape(258, 236, 220, -4)}
    ${routeLine("M96 1176 C300 1120 560 1204 812 1140 C930 1112 990 1128 1026 1120")}
    ${routeArrow(1030, 1118)}
    ${verticalTitle(104, 1120, "CALL YOUR FRIENDS", 64, OXBLOOD)}
    ${verticalTitle(176, 1120, "BEFORE THERE’S A REASON.", 34, INK)}`,
  }),
  // 2 — dense type page.
  portraitCanvas({
    id: "fn2-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 02",
    background: PAPER,
    body: `${tracingPaper(560, 96, 470, 350, 2)}
    ${lines(["Doing something", "together counts."], {x: 72, y: 320, size: 108, leading: 112, family: SERIF, weight: 700})}
    ${lines(["The game. The drive. The project.", "The job that somehow required three", "trips to the hardware store."], {x: 74, y: 560, size: 46, leading: 62, family: SERIF, weight: 400})}
    <rect x="72" y="760" width="560" height="112" fill="${GREEN}" transform="rotate(-1 352 816)"/>
    <text x="100" y="832" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="42" font-weight="900" letter-spacing="1.6" transform="rotate(-1 352 816)">THAT IS HOW TRUST GETS BUILT.</text>
    ${receiptFragment(700, 900, 250, 180, 3)}
    ${tape(120, 742, 170, -5)}
    ${routeLine("M96 1150 C300 1108 620 1168 984 1108")}`,
  }),
  // 3 — almost-empty question page.
  portraitCanvas({
    id: "fn2-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 02",
    body: `${lines(["The problem begins", "when the activity has to", "carry every subject", "forever."], {x: 90, y: 560, size: 76, leading: 92, family: SERIF, weight: 700, style: "italic"})}
    ${routeLine("M120 1010 C260 972 420 1024 560 986", OXBLOOD, 8)}`,
  }),
  // 4 — detail crop.
  portraitCanvas({
    id: "fn2-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 02",
    background: PAPER,
    body: `${photo({name: DECK, x: 96, y: 170, width: 888, height: 760, rotation: 0.9, position: "xMidYMid", backing: OXBLOOD, id: "fn2-04"})}
    ${tape(190, 148, 210, -3)}
    ${tape(736, 892, 190, 4)}
    <rect x="72" y="1010" width="936" height="128" fill="${PAPER_LIGHT}" transform="rotate(-0.6 540 1074)"/>
    <text x="104" y="1092" fill="${INK}" font-family="${SERIF}" font-size="49" font-weight="700" transform="rotate(-0.6 540 1074)">Male friendship deserves more than</text>
    <rect x="72" y="1146" width="936" height="104" fill="${OXBLOOD}" transform="rotate(-0.6 540 1198)"/>
    <text x="104" y="1218" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="48" font-weight="900" letter-spacing="1.4" transform="rotate(-0.6 540 1198)">EMERGENCY CONTACT INFORMATION.</text>`,
  }),
  // 5 — practical prompt card.
  portraitCanvas({
    id: "fn2-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 02",
    body: `<rect x="88" y="200" width="904" height="880" fill="${PAPER}" transform="rotate(-1 540 640)"/>
    ${tape(200, 176, 220, -4)}
    ${tape(700, 1040, 200, 3)}
    ${lines(["Ask better than", "“You good?”"], {x: 150, y: 380, size: 88, leading: 100, family: SERIF, weight: 700})}
    ${routeLine("M150 520 C260 492 380 540 470 508", GREEN, 8)}
    ${lines(["What has been taking up", "your head lately?"], {x: 150, y: 660, size: 52, leading: 66, family: SERIF, weight: 400, style: "italic"})}
    ${lines(["Do you want advice, help,", "or ten minutes to say", "the ugly version?"], {x: 150, y: 850, size: 52, leading: 66, family: SERIF, weight: 400, style: "italic"})}
    ${receiptFragment(730, 300, 220, 160, -3)}`,
  }),
  // 6 — two-photo spread.
  portraitCanvas({
    id: "fn2-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 02",
    background: PAPER,
    body: `${photo({name: TRUCK, x: 62, y: 190, width: 500, height: 660, rotation: -1.4, position: "xMidYMid", backing: OXBLOOD, id: "fn2-06"})}
    ${photo({name: PORCH, x: 560, y: 320, width: 470, height: 620, rotation: 1.6, position: "xMidYMid", backing: GREEN, id: "fn2-06"})}
    ${tape(150, 168, 190, -4)}
    ${tape(660, 300, 180, 4)}
    ${lines(["Friendship is not", "crisis management."], {x: 72, y: 1060, size: 74, leading: 84, family: SERIF, weight: 700})}
    ${lines(["It needs honesty, limits, reciprocity,", "and an ordinary life."], {x: 74, y: 1190, size: 44, leading: 58, family: SERIF, weight: 400})}`,
  }),
  // 7 — quiet closing page.
  portraitCanvas({
    id: "fn2-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 02",
    body: `${lines(["Call him while there", "is no emergency."], {x: 90, y: 480, size: 92, leading: 104, family: SERIF, weight: 700})}
    ${lines(["Give the friendship something", "besides history to live on."], {x: 92, y: 680, size: 50, leading: 66, family: SERIF, weight: 400, style: "italic"})}
    ${routeLine("M96 900 C280 852 520 916 760 860 C880 832 940 848 972 840")}
    ${routeArrow(978, 838)}
    ${receiptFragment(96, 980, 240, 170, -2)}`,
  }),
];

const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn2-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1140" y="0" width="460" height="1000" fill="url(#fn2-feature-dots)"/>
  ${tracingPaper(80, 90, 700, 520, -1.2)}
  <rect x="1150" y="620" width="380" height="290" fill="${GREEN}" transform="rotate(1.4 1340 765)"/>
  ${photo({name: WALKING, x: 210, y: 120, width: 1120, height: 760, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "fn2-feature"})}
  ${tape(330, 96, 230, -4)}
  ${tape(1080, 846, 210, 3)}
  ${receiptFragment(96, 700, 250, 180, -3)}
  ${receiptFragment(1330, 96, 210, 150, 4)}
  ${routeLine("M96 940 C340 890 640 952 940 896 C1180 852 1380 902 1520 862", RUST, 11)}
  ${routeArrow(1526, 860, RUST)}
  ${grain(1600, 1000, "fn2-feature", 0.22)}
</svg>`;

// Enforce this family's photo assignments and the global no-reuse rule.
const all = [...slides, feature].join("");
for (const name of usedElsewhere) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 2 composes editorial/${name}.png, which belongs to another surface.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-02-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "call-your-friends-before-theres-a-reason", feature);

console.log("Rendered the Field Note 2 feature image and seven carousel SVG and PNG pairs.");
