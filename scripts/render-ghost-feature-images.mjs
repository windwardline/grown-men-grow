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

const CHAIR = "editorial/repairing-wooden-chair.png";
const TABLE = "editorial/sunlit-writing-table.png";
const FRIENDS = "editorial/friends-in-conversation.png";

function landscape(id, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs(id)}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  ${body}
  ${grain(1600, 1000, id, 0.22)}
</svg>`;
}

const assets = {
  "strength-has-to-grow-up": landscape("feature-essay", `<rect x="34" y="46" width="520" height="864" fill="url(#feature-essay-dots)"/>
    <rect x="510" y="58" width="1038" height="872" fill="${OXBLOOD}" transform="rotate(1 1029 494)"/>
    ${photo({name: CHAIR, x: 548, y: 44, width: 988, height: 860, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "feature-essay"})}
    ${photo({name: TABLE, x: 62, y: 126, width: 512, height: 590, rotation: -2, position: "xMidYMid", backing: PAPER, id: "feature-essay"})}
    ${tape(192, 104, 220, -4)}
    ${tape(1120, 28, 236, 3)}
    <rect x="74" y="760" width="420" height="78" fill="${OXBLOOD}" transform="rotate(-1 284 799)"/>
    ${scribble("M84 880 C294 838 506 900 716 852 C914 806 1122 882 1510 818", RUST, 11)}`),
  "start-here": landscape("feature-start", `<rect x="0" y="0" width="1600" height="1000" fill="${PAPER}"/>
    <rect x="1050" y="0" width="550" height="1000" fill="url(#feature-start-dots)"/>
    ${photo({name: TABLE, x: 60, y: 66, width: 1010, height: 850, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "feature-start"})}
    ${photo({name: FRIENDS, x: 1034, y: 202, width: 500, height: 604, rotation: 1.5, position: "xMidYMid", backing: GREEN, id: "feature-start"})}
    ${tape(244, 44, 232, -4)}
    ${tape(1168, 184, 200, 5)}
    <path d="M1112 878 C1210 814 1344 822 1434 750" fill="none" stroke="${OXBLOOD}" stroke-width="10" stroke-linecap="round"/>
    <path d="M1402 730 L1454 736 L1438 786" fill="none" stroke="${OXBLOOD}" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/>`),
  about: landscape("feature-about", `<rect x="0" y="0" width="1600" height="1000" fill="${PAPER_LIGHT}"/>
    <rect x="36" y="84" width="968" height="820" fill="${GREEN}" transform="rotate(-1 520 494)"/>
    ${photo({name: FRIENDS, x: 72, y: 54, width: 970, height: 832, rotation: 0.8, position: "xMidYMid", backing: OXBLOOD, id: "feature-about"})}
    ${photo({name: CHAIR, x: 1048, y: 176, width: 492, height: 664, rotation: -1.4, position: "xMidYMid", backing: PAPER, id: "feature-about"})}
    ${tape(314, 32, 226, -4)}
    ${tape(1180, 154, 190, 5)}
    <rect x="1100" y="42" width="500" height="72" fill="url(#feature-about-dots)"/>
    ${scribble("M86 930 C294 886 504 948 714 902 C918 856 1138 924 1514 866", RUST, 11)}`),
};

for (const [name, svg] of Object.entries(assets)) writeAsset("ghost/feature-images", name, svg);

console.log("Rendered three title-free Ghost feature-image SVG and PNG pairs.");
