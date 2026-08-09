import {
  GREEN,
  INK,
  OXBLOOD,
  PAPER,
  PAPER_LIGHT,
  RUST,
  SANS,
  SERIF,
  lines,
  photo,
  portraitCanvas,
  scribble,
  strip,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

const AVATAR = "grown-men-grow-instagram-avatar.png";
const CHAIR = "editorial/repairing-wooden-chair.png";
const TABLE = "editorial/sunlit-writing-table.png";
const FRIENDS = "editorial/friends-in-conversation.png";

const slides = [
  portraitCanvas({
    id: "intro-01",
    number: 1,
    label: "INTRODUCTION",
    body: `<rect x="74" y="158" width="932" height="1000" fill="url(#intro-01-dots)"/>
    ${photo({name: AVATAR, x: 162, y: 208, width: 756, height: 756, rotation: -1.2, position: "xMidYMid", backing: GREEN, id: "intro-01"})}
    ${tape(402, 188, 246, 4)}
    <text x="540" y="1082" text-anchor="middle" fill="${INK}" font-family="${SANS}" font-size="24" font-weight="900" letter-spacing="4">SOME ASSEMBLY STILL REQUIRED.</text>
    ${scribble("M126 1138 C286 1106 444 1156 606 1120 C744 1088 860 1128 960 1110", RUST, 8)}`,
  }),
  portraitCanvas({
    id: "intro-02",
    number: 2,
    label: "INTRODUCTION",
    body: `${photo({name: TABLE, x: 42, y: 140, width: 996, height: 610, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "intro-02"})}
    ${tape(790, 122, 178, 4)}
    ${strip({x: 48, y: 710, width: 966, height: 126, fill: PAPER_LIGHT, text: "MOST OF US LEARNED", color: INK, size: 79, family: SERIF, rotation: -1})}
    ${strip({x: 184, y: 830, width: 844, height: 130, fill: OXBLOOD, text: "HOW TO LOOK LIKE MEN", color: PAPER_LIGHT, size: 73, rotation: 1})}
    ${strip({x: 48, y: 954, width: 916, height: 126, fill: PAPER, text: "BEFORE WE LEARNED", color: INK, size: 75, family: SERIF, rotation: -0.7})}
    ${strip({x: 304, y: 1074, width: 724, height: 132, fill: RUST, text: "HOW TO LIVE AS ONE.", color: PAPER_LIGHT, size: 68, rotation: 1})}`,
  }),
  portraitCanvas({
    id: "intro-03",
    number: 3,
    label: "INTRODUCTION",
    body: `${photo({name: CHAIR, x: 520, y: 138, width: 516, height: 674, rotation: 1, position: "xMidYMid", backing: GREEN, id: "intro-03"})}
    ${tape(686, 120, 182, 5)}
    ${lines(["A lot of that", "training was useful."], {x: 58, y: 372, size: 65, leading: 76, fill: INK, family: SERIF, weight: 700})}
    ${scribble("M70 566 C194 536 318 582 444 548 C486 538 510 540 534 534", RUST, 8)}
    ${strip({x: 48, y: 744, width: 970, height: 140, fill: OXBLOOD, text: "SOME OF IT WAS JUST", color: PAPER_LIGHT, size: 75, rotation: -0.8})}
    ${strip({x: 174, y: 880, width: 844, height: 144, fill: PAPER, text: "FEAR WITH", color: INK, size: 96, family: SERIF, rotation: 1})}
    ${strip({x: 354, y: 1018, width: 664, height: 144, fill: RUST, text: "GOOD POSTURE.", color: PAPER_LIGHT, size: 78, rotation: -0.7})}`,
  }),
  portraitCanvas({
    id: "intro-04",
    number: 4,
    label: "INTRODUCTION",
    background: PAPER,
    body: `<rect x="680" y="130" width="400" height="530" fill="url(#intro-04-dots)"/>
    <text x="1010" y="512" text-anchor="end" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.17" stroke-width="3" font-family="${SANS}" font-size="430" font-weight="900">04</text>
    ${strip({x: 48, y: 236, width: 864, height: 142, fill: PAPER_LIGHT, text: "I STILL BELIEVE", color: INK, size: 96, family: SERIF, rotation: -1})}
    ${strip({x: 190, y: 372, width: 838, height: 146, fill: OXBLOOD, text: "IN STRENGTH.", color: PAPER_LIGHT, size: 108, rotation: 1})}
    ${scribble("M78 576 C246 542 416 596 584 558 C742 522 874 574 1002 548", RUST, 9)}
    ${lines(["I just no longer think", "looking strong tells us", "much about a man."], {x: 62, y: 750, size: 62, leading: 80, fill: INK, family: SERIF, weight: 700})}`,
  }),
  portraitCanvas({
    id: "intro-05",
    number: 5,
    label: "INTRODUCTION",
    body: `${photo({name: FRIENDS, x: 42, y: 140, width: 996, height: 622, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "intro-05"})}
    ${tape(792, 122, 176, 4)}
    ${strip({x: 48, y: 722, width: 974, height: 126, fill: PAPER_LIGHT, text: "THE UNFINISHED WORK", color: INK, size: 78, family: SERIF, rotation: -1})}
    ${strip({x: 300, y: 842, width: 722, height: 132, fill: OXBLOOD, text: "OF BEING A MAN.", color: PAPER_LIGHT, size: 77, rotation: 1})}
    ${scribble("M78 1024 C236 992 400 1044 560 1008 C720 972 864 1022 1004 996", RUST, 8)}
    ${strip({x: 50, y: 1058, width: 484, height: 118, fill: INK, text: "NO GURUS.", color: PAPER_LIGHT, size: 74, rotation: -0.8})}
    ${strip({x: 416, y: 1104, width: 612, height: 118, fill: RUST, text: "NO GENDER WAR.", color: PAPER_LIGHT, size: 64, rotation: 1})}`,
  }),
  portraitCanvas({
    id: "intro-06",
    number: 6,
    label: "INTRODUCTION",
    body: `${photo({name: CHAIR, x: 42, y: 140, width: 996, height: 568, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "intro-06"})}
    ${tape(108, 122, 206, -4)}
    <text x="58" y="784" fill="${OXBLOOD}" font-family="${SANS}" font-size="22" font-weight="900" letter-spacing="3.6">ONE FIELD NOTE EACH WEEK · START WITH</text>
    ${strip({x: 48, y: 818, width: 720, height: 126, fill: PAPER, text: "Strength Has to", color: INK, size: 84, family: SERIF, rotation: -1})}
    ${strip({x: 232, y: 938, width: 796, height: 138, fill: OXBLOOD, text: "GROW UP", color: PAPER_LIGHT, size: 103, rotation: 1})}
    ${scribble("M76 1122 C236 1088 402 1142 560 1106 C720 1070 864 1120 1004 1094", RUST, 8)}`,
  }),
  portraitCanvas({
    id: "intro-07",
    number: 7,
    label: "INTRODUCTION",
    background: PAPER,
    body: `<rect x="58" y="146" width="964" height="756" fill="url(#intro-07-dots)"/>
    <text x="540" y="656" text-anchor="middle" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.18" stroke-width="3" font-family="${SANS}" font-size="520" font-weight="900">→</text>
    ${strip({x: 70, y: 482, width: 940, height: 178, fill: OXBLOOD, text: "LINK IN BIO.", color: PAPER_LIGHT, size: 142, rotation: -1})}
    ${scribble("M100 736 C252 702 414 758 574 720 C734 684 870 734 984 710", RUST, 10)}
    <text x="540" y="940" text-anchor="middle" fill="${INK}" font-family="${SERIF}" font-size="46" font-style="italic">Strength Has to Grow Up</text>
    <text x="540" y="1054" text-anchor="middle" fill="${OXBLOOD}" font-family="${SANS}" font-size="22" font-weight="900" letter-spacing="3.4">GROWNMENGROW.COM</text>`,
  }),
];

slides.forEach((svg, index) => writeAsset("instagram/pinned-introduction", String(index + 1).padStart(2, "0"), svg));

console.log("Rendered seven collage-directed pinned-introduction SVG and PNG pairs.");
