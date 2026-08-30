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
  strip,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Field Note 16 — "A Temp Wall Comes Out in April".
// Field Note family: image-led, with type-led and mark-led slides between the
// photographs so no two consecutive slides share a skeleton. Signature
// vocabulary: a hand-drawn load-path mark — a short horizontal load bar above a
// vertical post above a hatched ground line, where the post is drawn only as far
// as the load has actually travelled. It stops well short of the ground early,
// runs the full distance at the turn, and on the close the post is gone and the
// bar sits on a beam seated directly on the hatched line. No prior vocabularies.
const TEMPWALL = "editorial/temp-wall-open-room.png";
const SHIMS = "editorial/shims-top-plate.png";
const HOLES = "editorial/filled-holes-floor.png";

const otherArticles = ["repairing-wooden-chair", "sunlit-writing-table", "friends-in-conversation", "cooking-breakfast-together", "doorway-running-shoes", "balcony-plant-care", "workbench-hand-tools", "walking-after-the-work", "deck-board-detail", "truck-tailgate-loading", "porch-coffee-pause", "garage-doorway-call", "oil-check-detail", "smoke-detector-battery", "hallway-duffel-set-down", "tool-bag-handoff", "porch-two-chairs", "hardware-counter-question", "open-wall-wiring", "paperwork-second-eyes", "detector-test-press", "breaker-panel-check", "kitchen-counter-pause", "hammock-midday-rest", "pegboard-end-of-day", "morning-armchair-mug", "truck-hood-map", "trail-fork-daylight", "compass-in-hand", "garden-beds-two-heights", "car-odometer-daylight", "photos-notebook-spread", "bp-cuff-notebook", "running-shoes-alarm", "cutting-board-vegetables", "base-plates-anchor-bolts", "transfer-switch-cabinet", "covered-slab-curing", "garage-floor-hairline-crack", "hose-wetting-fresh-pour", "sling-capacity-tag", "wall-calendar-kitchen", "rigging-shackles-bench", "punch-list-tailgate", "ladder-against-eave-autumn", "downspout-extension-turned", "gutter-leaves-from-above", "driveway-hoop-late-afternoon", "restaurant-table-after-lunch", "machinist-caliper-part", "cabinet-seam-proud-door", "datum-face-square"];

function loadPath(x, y, {reach = 0.45, width = 260, drop = 150, color = RUST, scale = 1, seated = false}) {
  const s = scale;
  const w = width * s;
  const h = drop * s;
  const midX = x + w / 2;
  const groundY = y + h;
  const hatchCount = 7;
  const hatchStep = w / (hatchCount - 1);
  const hatch = Array.from({length: hatchCount}, (_, i) => {
    const hx = x + i * hatchStep;
    return `<line x1="${hx}" y1="${groundY}" x2="${hx - 12 * s}" y2="${groundY + 16 * s}" stroke="${INK}" stroke-width="${2.6 * s}" opacity="0.5"/>`;
  }).join("");
  const ground = `<line x1="${x - 16 * s}" y1="${groundY}" x2="${x + w + 16 * s}" y2="${groundY}" stroke="${INK}" stroke-width="${3.4 * s}" opacity="0.7"/>${hatch}`;
  const bar = `<line x1="${x}" y1="${y}" x2="${x + w}" y2="${y}" stroke="${color}" stroke-width="${8 * s}" stroke-linecap="round"/>`;
  if (seated) {
    // The permanent condition: no temporary post, a beam bearing on the ground.
    const beamY = groundY - 22 * s;
    return `<g>${bar}
    <rect x="${x + w * 0.16}" y="${beamY}" width="${w * 0.68}" height="${22 * s}" fill="${color}" rx="${3 * s}"/>
    ${ground}
  </g>`;
  }
  const postEnd = y + h * Math.max(0, Math.min(reach, 1));
  const short = reach < 0.98;
  // The post is only drawn as far as the load has actually travelled; where it
  // stops short of the ground the remaining distance is left open, not dashed
  // over, because the gap is the whole point of the mark.
  return `<g>${bar}
    <line x1="${midX}" y1="${y}" x2="${midX}" y2="${postEnd}" stroke="${color}" stroke-width="${7 * s}" stroke-linecap="round"/>${
    short ? `\n    <line x1="${midX - 13 * s}" y1="${postEnd}" x2="${midX + 13 * s}" y2="${postEnd}" stroke="${color}" stroke-width="${3.2 * s}" opacity="0.8"/>` : ""}
    ${ground}
  </g>`;
}

const slides = [
  // 1 — cover. Image-led: title lockup, the temp wall, and a post nowhere near
  // the ground.
  portraitCanvas({
    id: "fn16-01",
    number: 1,
    total: 7,
    label: "FIELD NOTE 16",
    body: `${lines(["A TEMP WALL"], {x: 64, y: 244, size: 96, leading: 108, family: SANS, weight: 900, tracking: 0.8})}
    ${lines(["COMES OUT IN APRIL."], {x: 64, y: 348, size: 84, leading: 108, family: SANS, weight: 900, tracking: 0.8, fill: OXBLOOD})}
    ${lines(["It holds the whole floor."], {x: 68, y: 424, size: 40, leading: 54, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: TEMPWALL, x: 150, y: 486, width: 800, height: 604, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "fn16-01"})}
    ${tape(262, 462, 214, -4)}
    ${loadPath(330, 1152, {reach: 0.34, width: 380, drop: 120, color: RUST, scale: 1.0})}`,
  }),
  // 2 — mark-led. The drawing carries it; the post still stops in mid-air.
  portraitCanvas({
    id: "fn16-02",
    number: 2,
    total: 7,
    label: "FIELD NOTE 16",
    background: PAPER,
    body: `${lines(["Before a saw goes near", "the studs, a second wall", "goes up three feet away."], {x: 74, y: 300, size: 66, leading: 86, family: SERIF, weight: 700, tracking: 0})}
    ${loadPath(230, 620, {reach: 0.42, width: 560, drop: 300, color: RUST, scale: 1.0})}
    ${lines(["Out of whatever lumber", "is in the truck."], {x: 76, y: 1092, size: 44, leading: 60, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 3 — the mechanism. Type-led, and the post finally reaches.
  portraitCanvas({
    id: "fn16-03",
    number: 3,
    total: 7,
    label: "FIELD NOTE 16",
    body: `${lines(["A temp wall", "is not support."], {x: 88, y: 380, size: 96, leading: 118, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It is a transfer."], {x: 90, y: 596, size: 84, leading: 100, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${lines(["The weight has to keep going — down the", "studs, through the plate, onto a footing", "sitting in dirt."], {x: 76, y: 760, size: 40, leading: 56, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${loadPath(300, 976, {reach: 1, width: 440, drop: 210, color: OXBLOOD, scale: 1.0})}`,
  }),
  // 4 — the shims, and the offer that reaches nothing.
  portraitCanvas({
    id: "fn16-04",
    number: 4,
    total: 7,
    label: "FIELD NOTE 16",
    background: PAPER,
    body: `${photo({name: SHIMS, x: 120, y: 168, width: 840, height: 700, rotation: 0.7, position: "xMidYMin", backing: OXBLOOD, id: "fn16-04"})}
    ${tape(220, 146, 214, -3)}
    ${lines(["“Let me know if you need anything”", "is a wall built with no path", "to the ground."], {x: 74, y: 946, size: 48, leading: 62, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It goes up in four seconds. It is sincere.", "It carries nothing."], {x: 76, y: 1152, size: 36, leading: 50, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}`,
  }),
  // 5 — the two weeks against the nine months. Heavy strips.
  portraitCanvas({
    id: "fn16-05",
    number: 5,
    total: 7,
    label: "FIELD NOTE 16",
    body: `${strip({x: 68, y: 286, width: 944, height: 104, fill: INK, text: "THE FIRST TWO WEEKS ARE STAFFED.", color: PAPER_LIGHT, size: 46, rotation: -0.7, tracking: -0.4})}
    ${lines(["People know what to do with two weeks.", "Food in disposable pans, masking tape on", "the lid, 350 for forty minutes."], {x: 74, y: 470, size: 42, leading: 58, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${strip({x: 68, y: 700, width: 944, height: 104, fill: OXBLOOD, text: "THAT IS NOT THE SHORING.", color: PAPER_LIGHT, size: 46, rotation: 0.6, tracking: -0.4})}
    ${lines(["That is the demolition crew, and", "demolition always draws a crowd."], {x: 74, y: 884, size: 42, leading: 58, family: SERIF, weight: 400, fill: INK, tracking: 0.2})}
    ${loadPath(660, 1108, {reach: 0.5, width: 280, drop: 110, color: RUST, scale: 0.9})}`,
  }),
  // 6 — pressure point. Almost nothing on the page.
  portraitCanvas({
    id: "fn16-06",
    number: 6,
    total: 7,
    label: "FIELD NOTE 16",
    background: PAPER,
    body: `${lines(["Nobody frames", "a temp wall plumb."], {x: 88, y: 546, size: 92, leading: 116, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It is not going to be", "there in April."], {x: 90, y: 830, size: 80, leading: 96, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 7 — close. The filled holes, and the bar seated on a beam with the
  // temporary post gone.
  portraitCanvas({
    id: "fn16-07",
    number: 7,
    total: 7,
    label: "FIELD NOTE 16",
    body: `${photo({name: HOLES, x: 240, y: 152, width: 600, height: 640, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "fn16-07"})}
    ${tape(336, 130, 206, 3)}
    ${lines(["Somebody fills the four holes", "before the floor gets refinished."], {x: 78, y: 872, size: 50, leading: 66, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The filler dries a shade light.", "The room goes into use."], {x: 80, y: 1040, size: 52, leading: 66, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${loadPath(330, 1170, {seated: true, width: 380, drop: 96, color: GREEN, scale: 1.0})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The temp wall large, the
// shims small beside it, and the mark still short of the ground.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn16-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1260" y="0" width="340" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: TEMPWALL, x: 80, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn16-feature"})}
  ${photo({name: SHIMS, x: 790, y: 140, width: 420, height: 560, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn16-feature"})}
  ${tape(214, 46, 226, -4)}
  ${tape(884, 116, 198, 4)}
  ${loadPath(830, 760, {reach: 0.44, width: 340, drop: 150, color: RUST, scale: 1.0})}
  ${grain(1600, 1000, "fn16-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16): one
// article's photograph never appears in another article's composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 16 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-16-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "a-temp-wall-comes-out-in-april", feature);

console.log("Rendered the Field Note 16 feature image and seven carousel SVG and PNG pairs.");
