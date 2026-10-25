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

// Field Note 30 — "The First Nut Waits." Founder-approved 2026-10-25;
// register position 29, no Ghost slot named.
//
// Signature vocabulary: a hand-drawn bolt-circle mark — five studs on a circle,
// a wheel hub seen face-on. In its one state a single stud is filled solid and
// the other four are open rings: one nut run all the way down. In its star
// state a dashed line runs through all five in tightening order, across the
// circle and back, each stud numbered: the pattern, not yet done. In its seated
// state the star is gone, all five studs are filled, and each carries a rust
// torque stripe: the wheel down flat and checked. The circle never changes;
// only the order anybody went around it.
// No prior vocabularies: not the flashlight mark, sweep mark, bitting profile,
// centering mark, scorebook box, trunk taper, guide-coat profile, contact gap,
// counterbalance, load path, tolerance stack, downspout, strength curve, sling,
// transfer switch, battery gauge, route line, tally, ledger, alarm arc,
// diverging fork, anode section, bubble vial, branch stub or bead mark.
//
// Photography: three source images generated for this note under the house
// prompt and unique to it.
const TORQUE = "editorial/torque-wrench-shop-towel.png";
const LUG = "editorial/lug-wrench-driveway-tire.png";
const RACK = "editorial/torque-wrenches-wall-rack.png";

const otherArticles = ["anode-rod-pulled", "balcony-plant-care", "base-chalk-line-low-sun", "base-plates-anchor-bolts", "basement-main-run-tees", "bend-test-bars-bench", "bend-test-strips-bench", "bp-cuff-notebook", "breaker-panel-check", "bubble-vial-close", "cabinet-seam-proud-door", "cafe-table-two-bottles", "capped-copper-stub-wall", "car-odometer-daylight", "compass-in-hand", "control-relay-din-rail", "cooking-breakfast-together", "covered-slab-curing", "cutting-board-vegetables", "datum-face-square", "deck-board-detail", "detector-test-press", "doorway-running-shoes", "downspout-extension-turned", "driveway-hoop-late-afternoon", "driveway-house-dusk-dash", "filled-holes-floor", "first-bowl-studio-shelf", "flat-plate-butt-weld-bench", "friends-in-conversation", "garage-door-partly-open-morning", "garage-doorway-call", "garage-floor-hairline-crack", "garden-beds-two-heights", "gloss-panel-low-sun", "gutter-leaves-from-above", "hallway-duffel-set-down", "hallway-flashlight-first-light", "hammock-midday-rest", "hardware-counter-question", "hose-wetting-fresh-pour", "infield-glove-raked-dirt", "kitchen-counter-pause", "kitchen-table-milk-towel", "ladder-against-eave-autumn", "level-on-top-plate", "level-reversed-pencil-mark", "lopsided-bowl-entry-console", "machinist-caliper-part", "morning-armchair-mug", "oil-check-detail", "open-wall-wiring", "opener-head-ceiling-rail", "paperwork-second-eyes", "pegboard-end-of-day", "photos-notebook-spread", "pipe-positioner-seam-up", "pitchers-mound-rosin-bag", "porch-coffee-pause", "porch-two-chairs", "practice-plate-angle-foot", "primer-panel-guide-coat", "pulled-stakes-young-tree", "punch-list-tailgate", "relay-contacts-open-bench", "repairing-wooden-chair", "restaurant-table-after-lunch", "rigging-shackles-bench", "running-shoes-alarm", "saddle-bag-kit-bench", "sanding-longboard-bench", "screwdriver-flashlight-tub-floor", "shims-top-plate", "sling-capacity-tag", "smoke-detector-battery", "staked-sapling-front-lawn", "sunlit-writing-table", "switchback-climb-morning", "tap-running-hot", "temp-wall-open-room", "tool-bag-handoff", "torsion-spring-shaft-header", "trail-fork-daylight", "transfer-switch-cabinet", "truck-hood-map", "truck-tailgate-loading", "tubing-cutter-on-copper", "two-flashlights-porch-step", "vertical-practice-plate-beads", "walking-after-the-work", "wall-calendar-kitchen", "ware-board-six-cups", "water-heater-top-fittings", "workbench-hand-tools", "worn-hammer-handle-pegboard", "worn-key-and-copy-counter"];

// Star order for a five-stud hub: skip one each time, 1-3-5-2-4.
const STAR_ORDER = [0, 2, 4, 1, 3];

function boltCircle(cx, cy, {
  radius = 120,
  state = "one",
  line = INK,
  accent = RUST,
  ground = PAPER_LIGHT,
  numbers = state === "star",
} = {}) {
  const f = (value) => value.toFixed(1);
  const studRadius = radius * 0.17;
  const stroke = f(radius * 0.045);
  const studs = Array.from({length: 5}, (_, i) => {
    const angle = (-90 + i * 72) * (Math.PI / 180);
    return {x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle)};
  });

  const hub = `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(radius * 1.6)}" fill="none" stroke="${line}" stroke-width="${stroke}" opacity="0.55"/>`
    + `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(radius * 0.42)}" fill="none" stroke="${line}" stroke-width="${stroke}" opacity="0.55"/>`;

  // The star is drawn only as the numbered, dashed instruction. Once the wheel
  // is seated the pattern is gone and each stud carries the torque stripe a
  // mechanic paints across a nut that has been checked.
  let path = "";
  if (state === "star") {
    const points = [...STAR_ORDER, STAR_ORDER[0]].map((i) => `${f(studs[i].x)},${f(studs[i].y)}`).join(" ");
    path = `<polyline points="${points}" fill="none" stroke="${line}" stroke-width="${stroke}" stroke-dasharray="${f(radius * 0.12)} ${f(radius * 0.09)}" stroke-linejoin="round"/>`;
  }
  const stripes = state === "seated"
    ? studs.map((stud) => {
      const dx = (stud.x - cx) / radius;
      const dy = (stud.y - cy) / radius;
      const reach = studRadius * 1.5;
      return `<line x1="${f(stud.x - dx * reach)}" y1="${f(stud.y - dy * reach)}" x2="${f(stud.x + dx * reach)}" y2="${f(stud.y + dy * reach)}" stroke="${accent}" stroke-width="${f(radius * 0.07)}" stroke-linecap="round"/>`;
    }).join("")
    : "";

  const dots = studs.map((stud, i) => {
    const filled = state === "seated" || (state === "one" && i === 0);
    return filled
      ? `<circle cx="${f(stud.x)}" cy="${f(stud.y)}" r="${f(studRadius)}" fill="${state === "one" ? accent : line}"/>`
      : `<circle cx="${f(stud.x)}" cy="${f(stud.y)}" r="${f(studRadius)}" fill="${ground}" stroke="${line}" stroke-width="${stroke}"/>`;
  }).join("");

  const labels = numbers
    ? STAR_ORDER.map((studIndex, order) => {
      const stud = studs[studIndex];
      const dx = stud.x - cx;
      const dy = stud.y - cy;
      const scale = 1.36;
      return `<text x="${f(cx + dx * scale)}" y="${f(cy + dy * scale + radius * 0.09)}" font-family="${SANS}" font-weight="700" font-size="${f(radius * 0.24)}" fill="${line}" text-anchor="middle">${order + 1}</text>`;
    }).join("")
    : "";

  return `<g opacity="0.94">${hub}${path}${dots}${stripes}${labels}</g>`;
}

const LABEL = "FIELD NOTE 30";

const slides = [
  // 1 — cover. Title lockup over the torque wrench on the towel; the mark small, one stud down.
  portraitCanvas({
    id: "fn30-01",
    number: 1,
    total: 7,
    label: LABEL,
    body: `${lines(["THE FIRST NUT"], {x: 64, y: 250, size: 88, leading: 98, family: SANS, weight: 900, tracking: 0.6})}
    ${lines(["WAITS"], {x: 64, y: 348, size: 88, leading: 98, family: SANS, weight: 900, tracking: 0.6, fill: OXBLOOD})}
    ${lines(["A man getting his life in order tends to run", "one nut all the way down before he touches", "the others."], {x: 68, y: 422, size: 28, leading: 38, family: SERIF, weight: 400, style: "italic", fill: SMOKE, tracking: 0.2})}
    ${photo({name: TORQUE, x: 330, y: 540, width: 600, height: 640, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn30-01"})}
    ${tape(560, 518, 214, 3)}
    ${boltCircle(170, 1060, {radius: 70})}`,
  }),
  // 2 — torn oxblood field, reverse serif type; one stud filled.
  portraitCanvas({
    id: "fn30-02",
    number: 2,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="56" y="226" width="968" height="760" fill="${OXBLOOD}" transform="rotate(-0.6 540 606)"/>
    ${tape(220, 204, 222, -3)}
    ${tape(740, 962, 196, 4)}
    ${lines(["There's a strong, almost moral", "urge to run that one all the way", "down before touching the others."], {x: 106, y: 350, size: 50, leading: 70, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${boltCircle(540, 720, {radius: 120, line: PAPER_LIGHT, accent: RUST, ground: OXBLOOD})}
    ${lines(["Because a wheel isn't five jobs.", "It's one."], {x: 76, y: 1100, size: 44, leading: 58, family: SERIF, weight: 700, style: "italic", fill: OXBLOOD, tracking: 0})}`,
  }),
  // 3 — documentary detail: the lug wrench against the tire.
  portraitCanvas({
    id: "fn30-03",
    number: 3,
    total: 7,
    label: LABEL,
    body: `${photo({name: LUG, x: 150, y: 150, width: 780, height: 740, rotation: 0.6, position: "xMidYMid", backing: GREEN, id: "fn30-03"})}
    ${tape(420, 128, 220, -3)}
    ${lines(["Start every nut by hand,", "so none of them goes on crooked."], {x: 78, y: 1000, size: 50, leading: 66, family: SERIF, weight: 700, tracking: 0})}`,
  }),
  // 4 — sparse, mark-led at full scale, one stud down.
  portraitCanvas({
    id: "fn30-04",
    number: 4,
    total: 7,
    label: LABEL,
    body: `${lines(["People blame", "the rotors."], {x: 74, y: 290, size: 84, leading: 100, family: SERIF, weight: 700, tracking: 0})}
    ${boltCircle(540, 720, {radius: 190})}
    ${lines(["The rotors were just", "standing closest."], {x: 78, y: 1070, size: 56, leading: 70, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${scribble("M80 1184 C250 1170 440 1182 640 1174", RUST, 8)}`,
  }),
  // 5 — halftone field; the star drawn dashed and numbered.
  portraitCanvas({
    id: "fn30-05",
    number: 5,
    total: 7,
    label: LABEL,
    background: PAPER,
    body: `<rect x="596" y="196" width="398" height="560" fill="url(#fn30-05-dots)"/>
    ${lines(["Snugging the", "second nut at", "this point doesn't", "bring the wheel flat."], {x: 74, y: 300, size: 64, leading: 84, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["It clamps the crooked", "down harder."], {x: 74, y: 880, size: 52, leading: 68, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0.2})}
    ${boltCircle(830, 1060, {radius: 96, state: "star", ground: PAPER})}`,
  }),
  // 6 — type-led on an oxblood field: the star at full scale, still dashed.
  portraitCanvas({
    id: "fn30-06",
    number: 6,
    total: 7,
    label: LABEL,
    background: OXBLOOD,
    headerColor: PAPER_LIGHT,
    footerColor: PAPER,
    body: `${lines(["Sometimes the only way", "to seat the wheel is to", "back the first nut off."], {x: 74, y: 290, size: 62, leading: 82, family: SERIF, weight: 700, fill: PAPER_LIGHT, tracking: 0})}
    ${lines(["Nobody gets a trophy for loosening something."], {x: 78, y: 560, size: 38, leading: 52, family: SERIF, weight: 400, style: "italic", fill: PAPER, tracking: 0.2})}
    ${boltCircle(540, 900, {radius: 180, state: "star", line: PAPER_LIGHT, ground: OXBLOOD})}`,
  }),
  // 7 — close, image-led on the wrench rack; the wheel seated.
  portraitCanvas({
    id: "fn30-07",
    number: 7,
    total: 7,
    label: LABEL,
    body: `${photo({name: RACK, x: 230, y: 150, width: 620, height: 680, rotation: -0.6, position: "xMidYMid", backing: OXBLOOD, id: "fn30-07"})}
    ${tape(500, 128, 204, -3)}
    ${lines(["Come back after fifty miles", "and we'll check the torque."], {x: 78, y: 920, size: 46, leading: 60, family: SERIF, weight: 700, tracking: 0})}
    ${lines(["The offer just stands,", "the wrench hangs on the wall."], {x: 80, y: 1050, size: 36, leading: 50, family: SERIF, weight: 400, style: "italic", fill: OXBLOOD, tracking: 0})}
    ${boltCircle(880, 1120, {radius: 78, state: "seated"})}`,
  }),
];

// Title-free, per the Ghost feature-image convention. The torque wrench
// dominant, the lug wrench small beside it, and the mark run as a pair in the
// oxblood margin: one stud down above, the wheel seated below.
const feature = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("fn30-feature")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <rect x="1244" y="0" width="356" height="1000" fill="${OXBLOOD}"/>
  ${photo({name: TORQUE, x: 90, y: 70, width: 660, height: 860, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "fn30-feature"})}
  ${photo({name: LUG, x: 790, y: 230, width: 400, height: 540, rotation: 1.4, position: "xMidYMid", backing: GREEN, id: "fn30-feature"})}
  ${tape(420, 46, 222, -4)}
  ${tape(880, 206, 196, 4)}
  ${boltCircle(1422, 300, {radius: 80, line: PAPER_LIGHT, ground: OXBLOOD})}
  ${boltCircle(1422, 700, {radius: 80, state: "seated", line: PAPER_LIGHT, ground: OXBLOOD})}
  ${scribble("M620 972 C724 948 832 984 936 956", RUST, 10)}
  ${grain(1600, 1000, "fn30-feature", 0.22)}
</svg>`;

const all = [...slides, feature].join("");

// Cross-article boundary (founder ruling 2026-08-09, refined 2026-08-16). A
// photograph belongs to at most one published asset, so this build asserts that
// nothing from another article's family reaches this composition.
for (const name of otherArticles) {
  if (all.includes(`editorial/${name}.png`)) {
    throw new Error(`Field Note 30 composes editorial/${name}.png, which belongs to another article.`);
  }
}

slides.forEach((svg, index) => writeAsset("instagram/field-note-30-carousel", String(index + 1).padStart(2, "0"), svg));
writeAsset("ghost/feature-images", "the-first-nut-waits", feature);

console.log("Rendered the Field Note 30 feature image and seven carousel SVG and PNG pairs.");
