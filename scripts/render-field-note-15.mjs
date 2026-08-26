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
  portraitCanvas,
  strip,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 15 — "Every Part Passed Inspection".
// Marginalia family: type-led, spare, no photograph. Signature vocabulary: a
// hand-drawn tolerance stack — a ruled datum line with a run of short measured
// segments beneath it, each carrying a plus-or-minus band at its right edge, and
// a bracket marking the accumulated gap at the far end. The run walks away from
// the datum through the middle slides and re-references to it on the close, so
// the gap collapses to a single band. No prior vocabularies.
//
// This note carries no photography on purpose. Under the 2026-08-16
// photograph-exclusivity ruling a note without its own new source images takes a
// type-led composition rather than re-cropping a picture that is already spent,
// and no new photography could be generated this run. The assertion at the foot
// of this file enforces that mechanically rather than by comment.

function toleranceStack(x, y, {count = 6, span = 92, drop = 0, color = RUST, scale = 1, showGap = true, datumRun = null}) {
  const s = scale;
  const segment = span * s;
  const width = datumRun ?? count * segment + 54 * s;
  const step = (drop * s) / Math.max(count, 1);
  const bar = (index) => {
    const barX = x + index * segment;
    const barY = y + 34 * s + step * (index + 1);
    return `<line x1="${barX}" y1="${barY}" x2="${barX + segment - 10 * s}" y2="${barY}" stroke="${color}" stroke-width="${7 * s}" stroke-linecap="round"/>
    <line x1="${barX + segment - 10 * s}" y1="${barY - 11 * s}" x2="${barX + segment - 10 * s}" y2="${barY + 11 * s}" stroke="${color}" stroke-width="${3.4 * s}" opacity="0.72"/>`;
  };
  const endY = y + 34 * s + step * count;
  const gapX = x + count * segment + 20 * s;
  const gap = showGap
    ? `<line x1="${gapX}" y1="${y}" x2="${gapX}" y2="${endY}" stroke="${color}" stroke-width="${3.4 * s}"/>
    <line x1="${gapX - 10 * s}" y1="${y}" x2="${gapX + 10 * s}" y2="${y}" stroke="${color}" stroke-width="${3.4 * s}"/>
    <line x1="${gapX - 10 * s}" y1="${endY}" x2="${gapX + 10 * s}" y2="${endY}" stroke="${color}" stroke-width="${3.4 * s}"/>`
    : "";
  return `<g>
    <line x1="${x - 20 * s}" y1="${y}" x2="${x + width}" y2="${y}" stroke="${INK}" stroke-width="${3.2 * s}" opacity="0.55"/>
    ${Array.from({length: count}, (_, index) => bar(index)).join("")}${gap ? `\n    ${gap}` : ""}
  </g>`;
}

const slides = [
  // 1 — title. Heavy condensed lockup high left, the stack already drifting below it.
  portraitCanvas({
    id: "fn15-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 15",
    body: `${lines(["EVERY PART"], {x: 64, y: 402, size: 108, leading: 122, family: SANS, weight: 900, tracking: 0.8})}
    ${lines(["PASSED"], {x: 64, y: 520, size: 108, leading: 122, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["INSPECTION."], {x: 64, y: 638, size: 108, leading: 122, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["Nothing went out of spec."], {x: 68, y: 742, size: 44, leading: 58, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${toleranceStack(96, 900, {count: 6, span: 128, drop: 168, color: RUST, scale: 1.05})}`,
  }),
  // 2 — the honest number. Quiet page, one segment, one band.
  portraitCanvas({
    id: "fn15-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 15",
    background: PAPER,
    body: `${lines(["Every dimension carries", "a second number", "in smaller type."], {x: 74, y: 330, size: 72, leading: 92, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["Plus or minus five thousandths —", "the engineer admitting that nothing", "gets made exactly."], {x: 76, y: 660, size: 44, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${toleranceStack(320, 940, {count: 1, span: 300, drop: 0, color: OXBLOOD, scale: 1.2})}`,
  }),
  // 3 — the stack. The mark carries the slide; type sits above it.
  portraitCanvas({
    id: "fn15-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 15",
    body: `${lines(["Six parts, each allowed", "five thousandths, every one", "drifting the same way."], {x: 72, y: 300, size: 58, leading: 76, family: SERIF, weight: 700, tracking: 0})}
    ${toleranceStack(88, 620, {count: 6, span: 142, drop: 300, color: RUST, scale: 1.1})}
    <rect x="72" y="1108" width="936" height="112" fill="${OXBLOOD}" transform="rotate(-0.6 540 1164)"/>
    <text x="102" y="1180" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="42" font-weight="900" letter-spacing="0.6" transform="rotate(-0.6 540 1164)">NOT ONE BAD PART IN THE ASSEMBLY.</text>`,
  }),
  // 4 — the audit. Rotated paper card, stack running faint behind it.
  portraitCanvas({
    id: "fn15-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 15",
    background: PAPER,
    body: `<g opacity="0.42">${toleranceStack(120, 1010, {count: 6, span: 140, drop: 150, color: RUST, scale: 1.1, showGap: false})}</g>
    <rect x="86" y="330" width="908" height="612" fill="${PAPER_LIGHT}" transform="rotate(-1.1 540 636)"/>
    ${tape(214, 306, 224, -4)}
    ${tape(690, 918, 206, 3)}
    ${lines(["A man runs the audit", "at a bad hour, and it", "comes back clean."], {x: 148, y: 470, size: 62, leading: 82, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The job was right. The move", "was right. There is no affair", "in the file."], {x: 150, y: 730, size: 46, leading: 62, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 5 — pressure point. Almost nothing on the page.
  portraitCanvas({
    id: "fn15-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 15",
    body: `${lines(["Innocence is not", "a repair."], {x: 92, y: 540, size: 104, leading: 126, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It is a finding."], {x: 94, y: 826, size: 88, leading: 104, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 6 — the two tools. Heavy strips, abrupt scale shift against slide 5.
  portraitCanvas({
    id: "fn15-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 15",
    background: PAPER,
    body: `${strip({x: 68, y: 286, width: 944, height: 104, fill: INK, text: "FAULT IS AN INSPECTION.", color: PAPER_LIGHT, size: 50, rotation: -0.7, tracking: -0.4})}
    ${lines(["It looks backward, returns a verdict,", "and the moment it reads no defect", "found, the tool is finished."], {x: 74, y: 470, size: 44, leading: 60, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${strip({x: 68, y: 700, width: 944, height: 104, fill: OXBLOOD, text: "RESPONSIBILITY IS A GAUGE.", color: PAPER_LIGHT, size: 50, rotation: 0.6, tracking: -0.4})}
    ${lines(["It never asks who did it. It reads the", "same number whether the answer is his", "fault, someone else’s, or nobody’s."], {x: 74, y: 884, size: 44, leading: 60, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${toleranceStack(660, 1136, {count: 2, span: 128, drop: 46, color: RUST, scale: 0.9})}`,
  }),
  // 7 — close. The run re-references to one datum and the gap collapses to a band.
  portraitCanvas({
    id: "fn15-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 15",
    body: `${lines(["Somebody has to hold", "the gauge against the part."], {x: 88, y: 470, size: 68, leading: 88, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["There is exactly one man", "standing in front of it."], {x: 90, y: 700, size: 64, leading: 82, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${toleranceStack(150, 950, {count: 6, span: 122, drop: 0, color: GREEN, scale: 1.1})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The stack carries it: a
// long drifting run against the datum, with the closed run set small beneath.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn15-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="0" y="0" width="430" height="1000" fill="${PAPER}"/>
  <rect x="1240" y="0" width="360" height="1000" fill="${OXBLOOD}"/>
  <rect x="980" y="120" width="212" height="700" fill="url(#fn15-feature-dots)"/>
  ${toleranceStack(150, 230, {count: 6, span: 110, drop: 300, color: RUST, scale: 1.15, datumRun: 800})}
  ${tape(206, 196, 236, -4)}
  <rect x="150" y="712" width="762" height="16" fill="${INK}" transform="rotate(-0.5 531 720)"/>
  ${toleranceStack(150, 800, {count: 5, span: 96, drop: 0, color: GREEN, scale: 0.95})}
  ${grain(1600, 1000, "fn15-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Field Note 15 is type-led by design. Any photograph appearing here would be
// one already spent on another article, which the 2026-08-16 exclusivity ruling
// forbids — so assert the absence rather than enumerate what to exclude.
if (all.includes("/assets/source/")) {
  throw new Error("Field Note 15 is a type-led composition and must reference no source photography.");
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-15-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "every-part-passed-inspection", feature);

console.log("Rendered the Field Note 15 feature image and seven carousel SVG and PNG pairs.");
