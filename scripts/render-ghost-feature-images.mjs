import {
  GREEN,
  OXBLOOD,
  PAPER,
  PAPER_LIGHT,
  RUST,
  defs,
  grain,
  photo,
  scribble,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// One source photograph per surface, so no photo repeats across the site:
// the chair belongs to Essay 1, the table to Start Here, and the friends
// photograph appears only inside the Essay 1 body. About is a photo-free
// graphic collage in the same material vocabulary.
const CHAIR = "editorial/repairing-wooden-chair.png";
const TABLE = "editorial/sunlit-writing-table.png";

function landscape(id, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs(id)}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  ${body}
  ${grain(1600, 1000, id, 0.22)}
</svg>`;
}

const assets = {
  "strength-has-to-grow-up": landscape("feature-essay", `<rect x="34" y="46" width="440" height="864" fill="url(#feature-essay-dots)"/>
    <rect x="452" y="58" width="1096" height="872" fill="${OXBLOOD}" transform="rotate(1 1000 494)"/>
    ${photo({name: CHAIR, x: 492, y: 44, width: 1044, height: 860, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "feature-essay"})}
    ${tape(586, 22, 236, -3)}
    ${tape(1236, 868, 210, 4)}
    <rect x="70" y="132" width="358" height="86" fill="${PAPER}" transform="rotate(-2 249 175)"/>
    <rect x="96" y="760" width="376" height="78" fill="${OXBLOOD}" transform="rotate(-1 284 799)"/>
    ${scribble("M84 560 C170 512 286 584 404 528", RUST, 11)}`),
  "start-here": landscape("feature-start", `<rect x="0" y="0" width="1600" height="1000" fill="${PAPER}"/>
    <rect x="1050" y="0" width="550" height="1000" fill="url(#feature-start-dots)"/>
    ${photo({name: TABLE, x: 60, y: 66, width: 1010, height: 850, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "feature-start"})}
    <rect x="1122" y="128" width="392" height="430" fill="${GREEN}" transform="rotate(2 1318 343)"/>
    <rect x="1160" y="196" width="316" height="80" fill="${PAPER_LIGHT}" transform="rotate(2 1318 236)"/>
    ${tape(244, 44, 232, -4)}
    ${tape(1198, 112, 200, 5)}
    <path d="M1112 878 C1210 814 1344 822 1434 750" fill="none" stroke="${OXBLOOD}" stroke-width="10" stroke-linecap="round"/>
    <path d="M1402 730 L1454 736 L1438 786" fill="none" stroke="${OXBLOOD}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`),
  about: landscape("feature-about", `<rect x="0" y="0" width="1600" height="1000" fill="${PAPER_LIGHT}"/>
    <rect x="1150" y="0" width="450" height="1000" fill="url(#feature-about-dots)"/>
    <rect x="60" y="120" width="880" height="760" fill="${OXBLOOD}" transform="rotate(-1.2 500 500)"/>
    <rect x="130" y="196" width="560" height="150" fill="${PAPER}" transform="rotate(-1.2 410 271)"/>
    <rect x="196" y="470" width="300" height="300" fill="url(#feature-about-dots)" opacity="0.5"/>
    <rect x="560" y="520" width="188" height="188" fill="${GREEN}" transform="rotate(3 654 614)"/>
    <rect x="588" y="552" width="132" height="132" fill="${PAPER_LIGHT}" transform="rotate(3 654 618)"/>
    ${scribble("M188 856 C300 812 452 872 606 820", PAPER, 10)}
    <rect x="800" y="180" width="720" height="190" fill="${GREEN}" transform="rotate(1.6 1160 275)"/>
    <rect x="846" y="228" width="410" height="92" fill="${PAPER_LIGHT}" transform="rotate(1.6 1051 274)"/>
    <rect x="1010" y="452" width="510" height="446" fill="${PAPER}" transform="rotate(-1 1265 675)"/>
    <rect x="1064" y="512" width="404" height="120" fill="${RUST}" transform="rotate(-1 1266 572)"/>
    <rect x="1064" y="676" width="330" height="16" fill="${OXBLOOD}" opacity="0.28" transform="rotate(-1 1229 684)"/>
    <rect x="1064" y="724" width="284" height="16" fill="${OXBLOOD}" opacity="0.28" transform="rotate(-1 1206 732)"/>
    ${tape(214, 96, 226, -4)}
    ${tape(862, 152, 190, 5)}
    ${tape(1096, 428, 204, -3)}
    ${tape(560, 500, 150, -6)}
    ${scribble("M1082 782 C1160 740 1268 800 1380 746", GREEN, 10)}
    ${scribble("M120 930 C330 886 540 948 750 902 C954 856 1174 924 1520 866", RUST, 11)}`),
};

// Founder rule (2026-08-09): no photograph appears on more than one surface.
// The friends photograph is reserved for the Essay 1 body and may not be
// composed into any feature image.
const reserved = new Set(["editorial/friends-in-conversation.png"]);
const seen = new Map();
for (const [name, svg] of Object.entries(assets)) {
  for (const match of svg.matchAll(/href="\/assets\/source\/(editorial\/[^"]+)"/g)) {
    const source = match[1];
    if (reserved.has(source)) {
      throw new Error(`${name} uses ${source}, which is reserved for the Essay 1 body.`);
    }
    if (seen.has(source)) {
      throw new Error(`${source} appears in both ${seen.get(source)} and ${name}; no photograph may repeat across surfaces.`);
    }
    seen.set(source, name);
  }
}

for (const [name, svg] of Object.entries(assets)) writeAsset("ghost/feature-images", name, svg);

console.log("Rendered three title-free Ghost feature-image SVG and PNG pairs.");
