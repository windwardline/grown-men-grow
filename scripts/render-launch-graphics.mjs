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
  storyCanvas,
  strip,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

const CHAIR = "editorial/repairing-wooden-chair.png";
const TABLE = "editorial/sunlit-writing-table.png";
const FRIENDS = "editorial/friends-in-conversation.png";

function writeNumbered(directory, assets) {
  assets.forEach((svg, index) => writeAsset(directory, String(index + 1).padStart(2, "0"), svg));
}

const foundational = [
  portraitCanvas({
    id: "foundation-01",
    number: 1,
    body: `${photo({name: CHAIR, x: 34, y: 142, width: 1012, height: 650, rotation: -0.6, position: "xMidYMid", backing: GREEN, id: "foundation-01"})}
    ${tape(106, 124, 220, -4)}
    ${strip({x: 46, y: 748, width: 690, height: 132, fill: PAPER_LIGHT, text: "I still believe", color: INK, size: 102, family: SERIF, rotation: -1})}
    ${strip({x: 154, y: 874, width: 878, height: 148, fill: OXBLOOD, text: "IN STRENGTH.", color: PAPER_LIGHT, size: 108, rotation: 1.1})}
    ${scribble("M76 1064 C250 1028 430 1078 602 1042 C754 1012 882 1054 1008 1032", RUST, 9)}`,
  }),
  portraitCanvas({
    id: "foundation-02",
    number: 2,
    background: PAPER,
    body: `<rect x="724" y="128" width="356" height="510" fill="url(#foundation-02-dots)"/>
    <text x="56" y="298" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.22" stroke-width="3" font-family="${SANS}" font-size="264" font-weight="900">02</text>
    ${strip({x: 54, y: 248, width: 578, height: 114, fill: PAPER_LIGHT, text: "COURAGE.", color: INK, size: 90, rotation: -1.3})}
    ${strip({x: 196, y: 368, width: 790, height: 116, fill: OXBLOOD, text: "DISCIPLINE.", color: PAPER_LIGHT, size: 91, rotation: 1})}
    ${strip({x: 52, y: 490, width: 752, height: 116, fill: PAPER_LIGHT, text: "COMPETENCE.", color: INK, size: 90, rotation: -0.8})}
    ${scribble("M82 660 C224 634 372 682 516 646 C666 610 822 670 986 638", RUST, 8)}
    ${lines(["The ability to stay steady", "when things get ugly."], {x: 64, y: 772, size: 57, leading: 74, fill: INK, family: SERIF, weight: 400})}
    ${strip({x: 148, y: 976, width: 884, height: 152, fill: GREEN, text: "I WANT MORE OF THAT,", color: PAPER_LIGHT, size: 72, rotation: 0.8})}
    <text x="1000" y="1190" text-anchor="end" fill="${OXBLOOD}" font-family="${SERIF}" font-size="55" font-style="italic">not less.</text>`,
  }),
  portraitCanvas({
    id: "foundation-03",
    number: 3,
    body: `${photo({name: TABLE, x: 594, y: 132, width: 446, height: 696, rotation: 1.2, position: "xMidYMid", backing: OXBLOOD, id: "foundation-03"})}
    ${tape(714, 116, 184, 5)}
    <text x="52" y="328" fill="${RUST}" font-family="${SERIF}" font-size="186">“</text>
    ${lines(["Strength tells us", "what a man can do."], {x: 58, y: 414, size: 66, leading: 78, fill: INK})}
    ${strip({x: 48, y: 742, width: 982, height: 190, fill: OXBLOOD, text: "IT DOES NOT TELL US", color: PAPER_LIGHT, size: 72, rotation: -0.8})}
    ${strip({x: 212, y: 916, width: 818, height: 148, fill: PAPER, text: "WHAT HE SERVES.", color: OXBLOOD, size: 82, family: SERIF, rotation: 1})}
    ${scribble("M72 1108 C252 1076 412 1128 586 1094 C746 1062 856 1108 1004 1086", RUST, 8)}`,
  }),
  portraitCanvas({
    id: "foundation-04",
    number: 4,
    body: `${photo({name: FRIENDS, x: 42, y: 142, width: 996, height: 616, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "foundation-04"})}
    ${tape(800, 126, 176, 4)}
    ${strip({x: 48, y: 724, width: 744, height: 114, fill: PAPER_LIGHT, text: "YOU FIND THAT OUT", color: INK, size: 72, rotation: -1})}
    ${lines(["when he is"], {x: 68, y: 930, size: 70, leading: 80, fill: OXBLOOD, family: SERIF, weight: 400, style: "italic"})}
    ${strip({x: 282, y: 842, width: 748, height: 116, fill: OXBLOOD, text: "ASHAMED,", color: PAPER_LIGHT, size: 82, rotation: 1})}
    ${strip({x: 72, y: 964, width: 936, height: 114, fill: INK, text: "REJECTED, FRIGHTENED,", color: PAPER_LIGHT, size: 68, rotation: -0.7})}
    ${strip({x: 404, y: 1080, width: 604, height: 112, fill: RUST, text: "OR WRONG.", color: PAPER_LIGHT, size: 78, rotation: 1.1})}`,
  }),
  portraitCanvas({
    id: "foundation-05",
    number: 5,
    background: PAPER,
    body: `<text x="1008" y="524" text-anchor="end" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.14" stroke-width="3" font-family="${SERIF}" font-size="520">?</text>
    <rect x="36" y="158" width="516" height="380" fill="url(#foundation-05-dots)"/>
    ${strip({x: 54, y: 222, width: 650, height: 126, fill: OXBLOOD, text: "CAN HE STAY?", color: PAPER_LIGHT, size: 91, rotation: -1.1})}
    ${strip({x: 202, y: 406, width: 812, height: 126, fill: PAPER_LIGHT, text: "CAN HE HEAR", color: INK, size: 88, family: SERIF, rotation: 1})}
    ${strip({x: 50, y: 532, width: 854, height: 128, fill: INK, text: "THE TRUTH?", color: PAPER_LIGHT, size: 94, rotation: -0.6})}
    ${scribble("M84 712 C222 680 368 736 512 700 C672 662 830 724 996 688", RUST, 9)}
    ${lines(["Can he ask for help", "before the crisis belongs", "to everyone?"], {x: 70, y: 830, size: 62, leading: 82, fill: OXBLOOD, family: SERIF, weight: 700})}`,
  }),
  portraitCanvas({
    id: "foundation-06",
    number: 6,
    body: `${photo({name: CHAIR, x: 626, y: 128, width: 414, height: 1040, rotation: 1.2, position: "xMidYMid", backing: GREEN, id: "foundation-06"})}
    ${tape(740, 112, 180, 5)}
    ${strip({x: 50, y: 234, width: 720, height: 118, fill: PAPER, text: "STRENGTH", color: INK, size: 92, family: SERIF, rotation: -1.2})}
    ${strip({x: 116, y: 354, width: 652, height: 122, fill: OXBLOOD, text: "HAS TO GROW", color: PAPER_LIGHT, size: 78, rotation: 0.8})}
    ${lines(["with the rest", "of the man."], {x: 58, y: 618, size: 74, leading: 84, fill: INK, family: SERIF, weight: 700})}
    ${scribble("M66 790 C182 754 304 814 426 776 C490 756 544 764 600 752", RUST, 8)}
    <text x="58" y="1036" fill="${SMOKE}" font-family="${SANS}" font-size="18" font-weight="900" letter-spacing="2.7">THE UNFINISHED WORK</text>`,
  }),
  portraitCanvas({
    id: "foundation-07",
    number: 7,
    body: `${photo({name: TABLE, x: 38, y: 140, width: 1004, height: 572, rotation: -0.8, position: "xMidYMid", backing: OXBLOOD, id: "foundation-07"})}
    ${tape(116, 122, 210, -4)}
    <text x="58" y="782" fill="${OXBLOOD}" font-family="${SANS}" font-size="22" font-weight="900" letter-spacing="3.6">THE FIRST FIELD NOTE</text>
    ${strip({x: 48, y: 814, width: 728, height: 126, fill: PAPER, text: "Strength Has to", color: INK, size: 84, family: SERIF, rotation: -1})}
    ${strip({x: 232, y: 934, width: 800, height: 136, fill: OXBLOOD, text: "GROW UP", color: PAPER_LIGHT, size: 104, rotation: 1})}
    ${scribble("M76 1118 C236 1086 398 1138 558 1100 C720 1064 860 1114 1004 1088", RUST, 8)}
    <text x="64" y="1202" fill="${INK}" font-family="${SERIF}" font-size="48" font-style="italic">Link in bio.</text>`,
  }),
];

const recognition = [
  portraitCanvas({
    id: "recognition-01",
    number: 1,
    label: "RECOGNITION",
    body: `${photo({name: TABLE, x: 44, y: 140, width: 992, height: 654, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "recognition-01"})}
    ${tape(786, 124, 184, 4)}
    ${strip({x: 48, y: 752, width: 780, height: 130, fill: PAPER_LIGHT, text: "A CONFESSION", color: INK, size: 92, rotation: -1})}
    ${strip({x: 174, y: 878, width: 856, height: 142, fill: OXBLOOD, text: "CAN STILL", color: PAPER_LIGHT, size: 105, rotation: 1})}
    ${strip({x: 50, y: 1016, width: 654, height: 138, fill: RUST, text: "BE SELFISH.", color: PAPER_LIGHT, size: 91, rotation: -0.8})}
    ${scribble("M82 1194 C248 1164 402 1210 564 1178 C724 1146 872 1192 1000 1170", OXBLOOD, 8)}`,
  }),
  portraitCanvas({
    id: "recognition-02",
    number: 2,
    label: "RECOGNITION",
    background: PAPER,
    body: `<rect x="668" y="138" width="412" height="514" fill="url(#recognition-02-dots)"/>
    ${strip({x: 48, y: 220, width: 930, height: 140, fill: PAPER_LIGHT, text: "OPENING UP MATTERS.", color: INK, size: 88, family: SERIF, rotation: -1})}
    ${scribble("M76 414 C264 378 436 434 618 398 C756 370 878 406 1002 388", RUST, 9)}
    <text x="56" y="610" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.18" stroke-width="3" font-family="${SANS}" font-size="286" font-weight="900">02</text>
    ${strip({x: 54, y: 650, width: 974, height: 144, fill: OXBLOOD, text: "DISCLOSURE IS NOT", color: PAPER_LIGHT, size: 82, rotation: 0.8})}
    ${strip({x: 174, y: 790, width: 854, height: 138, fill: INK, text: "THE SAME THING", color: PAPER_LIGHT, size: 80, rotation: -0.7})}
    ${strip({x: 416, y: 926, width: 612, height: 138, fill: GREEN, text: "AS REPAIR.", color: PAPER_LIGHT, size: 86, rotation: 1})}`,
  }),
  portraitCanvas({
    id: "recognition-03",
    number: 3,
    label: "RECOGNITION",
    body: `${photo({name: FRIENDS, x: 482, y: 136, width: 554, height: 642, rotation: 1, position: "xMidYMid", backing: GREEN, id: "recognition-03"})}
    ${tape(670, 118, 174, 5)}
    <text x="46" y="414" fill="${RUST}" font-family="${SERIF}" font-size="190">“</text>
    ${lines(["A man can cry", "and still leave"], {x: 58, y: 492, size: 68, leading: 78, fill: INK})}
    ${strip({x: 46, y: 742, width: 980, height: 146, fill: OXBLOOD, text: "EVERYONE ELSE", color: PAPER_LIGHT, size: 92, rotation: -0.8})}
    ${strip({x: 148, y: 882, width: 878, height: 136, fill: PAPER, text: "CARRYING WHAT", color: INK, size: 86, family: SERIF, rotation: 1})}
    ${strip({x: 46, y: 1012, width: 980, height: 136, fill: INK, text: "HIS TEARS MEAN.", color: PAPER_LIGHT, size: 80, rotation: -0.6})}`,
  }),
  portraitCanvas({
    id: "recognition-04",
    number: 4,
    label: "RECOGNITION",
    body: `${photo({name: TABLE, x: 40, y: 140, width: 1000, height: 570, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "recognition-04"})}
    ${tape(104, 122, 206, -4)}
    ${strip({x: 46, y: 670, width: 936, height: 132, fill: PAPER_LIGHT, text: "HE CAN TELL THE STORY", color: INK, size: 76, family: SERIF, rotation: -1})}
    ${strip({x: 250, y: 794, width: 780, height: 138, fill: OXBLOOD, text: "FIRST", color: PAPER_LIGHT, size: 110, rotation: 1})}
    ${lines(["so nobody gets to", "tell it differently."], {x: 62, y: 1050, size: 70, leading: 82, fill: INK, family: SERIF, weight: 700})}
    ${scribble("M72 1206 C214 1176 364 1224 504 1190 C672 1150 830 1210 1008 1178", RUST, 8)}`,
  }),
  portraitCanvas({
    id: "recognition-05",
    number: 5,
    label: "RECOGNITION",
    body: `${photo({name: FRIENDS, x: 40, y: 140, width: 1000, height: 612, rotation: -0.8, position: "xMidYMid", backing: GREEN, id: "recognition-05"})}
    ${tape(790, 122, 176, 4)}
    ${strip({x: 46, y: 712, width: 980, height: 126, fill: PAPER_LIGHT, text: "VULNERABILITY BECOMES REAL", color: INK, size: 63, rotation: -0.8})}
    ${lines(["when it leaves room for", "the other person’s reaction."], {x: 62, y: 936, size: 62, leading: 75, fill: OXBLOOD, family: SERIF, weight: 700})}
    ${strip({x: 230, y: 1080, width: 798, height: 126, fill: OXBLOOD, text: "EVEN THE ONE HE DOES NOT WANT.", color: PAPER_LIGHT, size: 52, rotation: 0.9})}`,
  }),
  portraitCanvas({
    id: "recognition-06",
    number: 6,
    label: "RECOGNITION",
    background: PAPER,
    body: `<rect x="42" y="142" width="996" height="310" fill="url(#recognition-06-dots)"/>
    ${strip({x: 48, y: 222, width: 884, height: 142, fill: PAPER_LIGHT, text: "THE PAIN CAN BE REAL.", color: INK, size: 76, family: SERIF, rotation: -1})}
    ${scribble("M76 430 C228 396 386 450 542 414 C698 378 844 432 1002 398", RUST, 9)}
    <text x="58" y="696" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.18" stroke-width="3" font-family="${SANS}" font-size="300" font-weight="900">06</text>
    ${strip({x: 50, y: 682, width: 976, height: 146, fill: OXBLOOD, text: "THE ARRANGEMENT", color: PAPER_LIGHT, size: 83, rotation: 0.8})}
    ${strip({x: 246, y: 824, width: 780, height: 142, fill: INK, text: "CAN STILL", color: PAPER_LIGHT, size: 96, rotation: -0.7})}
    ${strip({x: 424, y: 962, width: 602, height: 142, fill: RUST, text: "BE UNFAIR.", color: PAPER_LIGHT, size: 88, rotation: 1})}`,
  }),
  portraitCanvas({
    id: "recognition-07",
    number: 7,
    label: "RECOGNITION",
    body: `${photo({name: CHAIR, x: 42, y: 142, width: 996, height: 594, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "recognition-07"})}
    ${tape(106, 124, 204, -4)}
    <text x="58" y="806" fill="${OXBLOOD}" font-family="${SANS}" font-size="22" font-weight="900" letter-spacing="3.6">MORE IN</text>
    ${strip({x: 48, y: 840, width: 722, height: 126, fill: PAPER, text: "Strength Has to", color: INK, size: 84, family: SERIF, rotation: -1})}
    ${strip({x: 232, y: 960, width: 796, height: 136, fill: OXBLOOD, text: "GROW UP", color: PAPER_LIGHT, size: 102, rotation: 1})}
    ${scribble("M76 1140 C232 1108 396 1160 554 1124 C716 1088 858 1138 1006 1114", RUST, 8)}
    <text x="64" y="1218" fill="${INK}" font-family="${SERIF}" font-size="47" font-style="italic">Link in bio.</text>`,
  }),
];

// Rebuilt type-only on 2026-08-16, second correction.
//
// The first version placed `sunlit-writing-table.png` in a wide top band — the
// Recognition cover's photograph in nearly its rectangle. The second version
// swapped to `friends-in-conversation.png` because no other grid COVER used it.
// That reasoning was too narrow and the founder caught it: a reader sees every
// slide, not just the tile, and `friends-in-conversation.png` was already on the
// feed four times inside the pinned introduction and the two carousels.
//
// There was no photograph that would have worked. Essay 1 has exactly three, and
// the per-article rule confines everything derived from Essay 1 to those three.
// Across the four posted assets each of the three already appears five times, so
// a single-image post carved out of that set repeats by construction.
//
// So this post carries no photograph at all. That is the Marginalia treatment
// the visual system already defines — "typographic, spare, abrupt scale shifts,
// no required photograph" — and three of the launch set's posted slides are
// already type-only, so it is an established register rather than a retreat.
// Approved copy is untouched.
const staticPost = portraitCanvas({
  id: "static-post",
  number: 1,
  total: 1,
  background: PAPER,
  body: `<rect x="742" y="96" width="338" height="1254" fill="${OXBLOOD}"/>
  <rect x="64" y="936" width="512" height="286" fill="url(#static-post-dots)"/>
  <text x="70" y="332" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.16" stroke-width="3" font-family="${SERIF}" font-size="330">“</text>
  ${strip({x: 58, y: 296, width: 606, height: 150, fill: PAPER_LIGHT, text: "SOME OF WHAT", color: INK, size: 78, family: SERIF, rotation: -1.2})}
  ${strip({x: 128, y: 462, width: 872, height: 122, fill: INK, text: "WE CALLED STRENGTH", color: PAPER_LIGHT, size: 68, rotation: 0.9})}
  ${strip({x: 62, y: 604, width: 430, height: 188, fill: PAPER_LIGHT, text: "WAS FEAR", color: OXBLOOD, size: 104, family: SERIF, rotation: -0.7})}
  ${scribble("M84 838 C244 806 404 856 566 822 C712 792 850 838 996 812", RUST, 9)}
  ${strip({x: 210, y: 870, width: 828, height: 132, fill: RUST, text: "WITH GOOD POSTURE.", color: PAPER_LIGHT, size: 74, rotation: 1.1})}
  <text x="1014" y="1204" text-anchor="end" fill="${PAPER}" font-family="${SANS}" font-size="19" font-weight="900" letter-spacing="3.2">THE UNFINISHED WORK</text>`,
});

const stories = [
  storyCanvas({
    id: "story-01",
    body: `${photo({name: TABLE, x: 38, y: 132, width: 1004, height: 970, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "story-01"})}
    ${tape(110, 112, 220, -4)}
    ${strip({x: 48, y: 1060, width: 812, height: 142, fill: PAPER_LIGHT, text: "I MADE A NEW THING.", color: INK, size: 82, rotation: -1})}
    ${lines(["It is called Grown Men Grow,"], {x: 64, y: 1324, size: 58, leading: 72, fill: OXBLOOD, family: SERIF, weight: 700})}
    ${strip({x: 132, y: 1370, width: 898, height: 132, fill: OXBLOOD, text: "WHICH IS EITHER A THESIS", color: PAPER_LIGHT, size: 61, rotation: 0.8})}
    ${strip({x: 290, y: 1498, width: 740, height: 132, fill: PAPER, text: "OR A REMINDER.", color: INK, size: 70, family: SERIF, rotation: -0.7})}
    ${scribble("M78 1688 C250 1656 420 1712 592 1672 C748 1636 876 1684 1006 1658", RUST, 9)}`,
  }),
  storyCanvas({
    id: "story-02",
    body: `${photo({name: FRIENDS, x: 38, y: 132, width: 1004, height: 950, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "story-02"})}
    ${tape(790, 112, 182, 4)}
    ${strip({x: 48, y: 1038, width: 980, height: 132, fill: PAPER_LIGHT, text: "ONE FIELD NOTE A WEEK", color: INK, size: 72, family: SERIF, rotation: -1})}
    ${lines(["about the unfinished work", "of being a man."], {x: 62, y: 1288, size: 61, leading: 78, fill: INK, family: SERIF, weight: 700})}
    ${strip({x: 50, y: 1460, width: 562, height: 130, fill: OXBLOOD, text: "NO GURUS.", color: PAPER_LIGHT, size: 82, rotation: -0.8})}
    ${strip({x: 286, y: 1586, width: 742, height: 132, fill: RUST, text: "NO GENDER WAR.", color: PAPER_LIGHT, size: 78, rotation: 1})}`,
  }),
  storyCanvas({
    id: "story-03",
    body: `${photo({name: CHAIR, x: 38, y: 132, width: 1004, height: 984, rotation: -0.7, position: "xMidYMid", backing: OXBLOOD, id: "story-03"})}
    ${tape(108, 112, 218, -4)}
    <text x="58" y="1196" fill="${OXBLOOD}" font-family="${SANS}" font-size="23" font-weight="900" letter-spacing="3.8">THE FIRST ONE IS LIVE</text>
    ${strip({x: 48, y: 1228, width: 840, height: 144, fill: PAPER_LIGHT, text: "Strength Has to", color: INK, size: 96, family: SERIF, rotation: -1})}
    ${strip({x: 226, y: 1366, width: 802, height: 154, fill: OXBLOOD, text: "GROW UP", color: PAPER_LIGHT, size: 114, rotation: 1})}
    ${scribble("M80 1574 C246 1542 414 1594 578 1558 C736 1522 870 1570 1004 1546", RUST, 9)}
    <rect x="58" y="1654" width="964" height="118" fill="none" stroke="${INK}" stroke-opacity="0.3" stroke-width="2"/>
    <text x="540" y="1728" text-anchor="middle" fill="${SMOKE}" font-family="${SANS}" font-size="20" font-weight="900" letter-spacing="3">LINK STICKER</text>`,
  }),
  storyCanvas({
    id: "story-04",
    body: `<rect x="690" y="120" width="390" height="640" fill="url(#story-04-dots)"/>
    <text x="1008" y="660" text-anchor="end" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.16" stroke-width="3" font-family="${SERIF}" font-size="580">?</text>
    ${strip({x: 48, y: 290, width: 938, height: 140, fill: PAPER_LIGHT, text: "WHICH GETS MISTAKEN", color: INK, size: 78, family: SERIF, rotation: -1})}
    ${strip({x: 212, y: 426, width: 816, height: 146, fill: OXBLOOD, text: "FOR STRENGTH", color: PAPER_LIGHT, size: 98, rotation: 1})}
    ${strip({x: 444, y: 566, width: 584, height: 138, fill: RUST, text: "MOST OFTEN?", color: PAPER_LIGHT, size: 78, rotation: -0.7})}
    ${scribble("M80 770 C252 734 426 790 596 750 C752 716 874 758 1004 740", OXBLOOD, 9)}
    ${["Silence", "Control", "Never needing anyone", "Winning every argument"].map((item, index) => `<g>
      <rect x="62" y="${874 + index * 190}" width="54" height="54" fill="none" stroke="${OXBLOOD}" stroke-width="3"/>
      <text x="150" y="${918 + index * 190}" fill="${INK}" font-family="${SERIF}" font-size="48">${escapeXml(item)}</text>
      <line x1="62" y1="${958 + index * 190}" x2="1018" y2="${958 + index * 190}" stroke="${INK}" stroke-opacity="0.2"/>
    </g>`).join("")}`,
  }),
  storyCanvas({
    id: "story-05",
    body: `${photo({name: TABLE, x: 386, y: 126, width: 654, height: 1008, rotation: 1, position: "xMidYMid", backing: GREEN, id: "story-05"})}
    ${tape(646, 108, 188, 5)}
    <text x="44" y="410" fill="${RUST}" font-family="${SERIF}" font-size="250">?</text>
    ${strip({x: 48, y: 442, width: 922, height: 142, fill: PAPER_LIGHT, text: "WHAT DID NOBODY", color: INK, size: 88, family: SERIF, rotation: -1})}
    ${strip({x: 170, y: 578, width: 858, height: 146, fill: OXBLOOD, text: "TEACH YOU", color: PAPER_LIGHT, size: 110, rotation: 1})}
    ${strip({x: 48, y: 718, width: 980, height: 146, fill: INK, text: "ABOUT BECOMING A MAN?", color: PAPER_LIGHT, size: 68, rotation: -0.7})}
    ${scribble("M76 924 C242 888 414 944 578 904 C742 868 872 916 1008 892", RUST, 9)}
    <rect x="58" y="1214" width="964" height="470" fill="${PAPER}" stroke="${INK}" stroke-opacity="0.18"/>
    <line x1="98" y1="1336" x2="982" y2="1336" stroke="${INK}" stroke-opacity="0.16"/>
    <line x1="98" y1="1460" x2="982" y2="1460" stroke="${INK}" stroke-opacity="0.16"/>
    <line x1="98" y1="1584" x2="982" y2="1584" stroke="${INK}" stroke-opacity="0.16"/>`,
  }),
];

const reelCover = storyCanvas({
  id: "reel-cover",
  body: `${photo({name: CHAIR, x: 38, y: 130, width: 1004, height: 1050, rotation: -0.7, position: "xMidYMid", backing: GREEN, id: "reel-cover"})}
  ${tape(108, 112, 216, -4)}
  ${strip({x: 48, y: 1138, width: 820, height: 142, fill: PAPER_LIGHT, text: "A MAN CAN", color: INK, size: 105, family: SERIF, rotation: -1})}
  ${strip({x: 188, y: 1274, width: 842, height: 148, fill: OXBLOOD, text: "LOOK STRONG", color: PAPER_LIGHT, size: 100, rotation: 1})}
  ${strip({x: 48, y: 1416, width: 754, height: 138, fill: PAPER, text: "AND STILL", color: INK, size: 100, family: SERIF, rotation: -0.8})}
  ${strip({x: 352, y: 1548, width: 678, height: 146, fill: RUST, text: "BE HIDING.", color: PAPER_LIGHT, size: 92, rotation: 1})}
  ${scribble("M80 1746 C248 1710 414 1766 584 1726 C742 1690 876 1738 1006 1714", OXBLOOD, 9)}`,
});

function socialCanvas(id, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${defs(id)}
  <rect width="1200" height="630" fill="${PAPER_LIGHT}"/>
  <text x="550" y="68" fill="${INK}" font-family="${SANS}" font-size="21" font-weight="900" letter-spacing="3.8">GROWN MEN GROW</text>
  ${body}
  <text x="550" y="568" fill="${SMOKE}" font-family="${SANS}" font-size="16" font-weight="900" letter-spacing="2.4">GROWNMENGROW.COM</text>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${INK}" stroke-opacity="0.2"/>
  ${grain(1200, 630, id)}
</svg>`;
}

const socialCards = {
  publication: socialCanvas("social-publication", `${photo({name: FRIENDS, x: 28, y: 24, width: 472, height: 582, rotation: -1, position: "xMidYMid", backing: GREEN, id: "social-publication"})}
    ${tape(150, 8, 176, 3)}
    ${strip({x: 526, y: 132, width: 642, height: 112, fill: PAPER, text: "ESSAYS ON THE", color: INK, size: 68, family: SERIF, rotation: -0.7})}
    ${strip({x: 596, y: 236, width: 570, height: 106, fill: OXBLOOD, text: "UNFINISHED WORK", color: PAPER_LIGHT, size: 54, rotation: 0.8})}
    ${strip({x: 526, y: 338, width: 520, height: 110, fill: PAPER, text: "OF BEING A MAN.", color: INK, size: 57, family: SERIF, rotation: -0.6})}
    ${scribble("M550 486 C686 462 816 500 946 476 C1022 462 1082 470 1140 460", RUST, 7)}`),
  "start-here": socialCanvas("social-start", `${photo({name: TABLE, x: 28, y: 24, width: 472, height: 582, rotation: -1, position: "xMidYMid", backing: OXBLOOD, id: "social-start"})}
    ${tape(146, 8, 180, 3)}
    <text x="550" y="132" fill="${OXBLOOD}" font-family="${SANS}" font-size="18" font-weight="900" letter-spacing="3">START HERE</text>
    ${lines(["Most of us learned", "how to look like men"], {x: 550, y: 222, size: 55, leading: 58, fill: INK, family: SERIF, weight: 700})}
    ${strip({x: 538, y: 342, width: 628, height: 92, fill: OXBLOOD, text: "BEFORE WE LEARNED", color: PAPER_LIGHT, size: 46, rotation: 0.7})}
    <text x="550" y="492" fill="${INK}" font-family="${SERIF}" font-size="50" font-style="italic">how to live as one.</text>`),
  about: socialCanvas("social-about", `${photo({name: CHAIR, x: 28, y: 24, width: 472, height: 582, rotation: -1, position: "xMidYMid", backing: GREEN, id: "social-about"})}
    ${tape(146, 8, 180, 3)}
    <text x="550" y="132" fill="${OXBLOOD}" font-family="${SANS}" font-size="18" font-weight="900" letter-spacing="3">ABOUT</text>
    ${strip({x: 526, y: 166, width: 638, height: 104, fill: PAPER, text: "WHY GROWN MEN GROW", color: INK, size: 54, family: SERIF, rotation: -0.7})}
    ${strip({x: 602, y: 264, width: 562, height: 100, fill: OXBLOOD, text: "EXISTS", color: PAPER_LIGHT, size: 72, rotation: 0.8})}
    ${lines(["and where the writing", "comes from."], {x: 550, y: 440, size: 45, leading: 50, fill: INK, family: SERIF, weight: 700})}`),
  "strength-has-to-grow-up": socialCanvas("social-essay", `${photo({name: CHAIR, x: 28, y: 24, width: 472, height: 582, rotation: -1, position: "xMidYMid", backing: OXBLOOD, id: "social-essay"})}
    ${tape(146, 8, 180, 3)}
    ${strip({x: 526, y: 142, width: 638, height: 102, fill: PAPER, text: "Strength Has to", color: INK, size: 68, family: SERIF, rotation: -0.7})}
    ${strip({x: 604, y: 238, width: 560, height: 106, fill: OXBLOOD, text: "GROW UP", color: PAPER_LIGHT, size: 78, rotation: 0.8})}
    ${scribble("M550 384 C686 360 818 396 948 374 C1020 362 1084 368 1140 360", RUST, 7)}
    <text x="550" y="454" fill="${INK}" font-family="${SERIF}" font-size="28" font-style="italic">A man can look strong and still be hiding.</text>`),
};

writeNumbered("instagram/foundational-carousel", foundational);
writeNumbered("instagram/recognition-carousel", recognition);
writeAsset("instagram/static-post", "fear-with-good-posture", staticPost);
writeNumbered("instagram/launch-stories", stories);
writeAsset("instagram/reel", "strength-has-to-grow-up-cover", reelCover);
for (const [name, svg] of Object.entries(socialCards)) writeAsset("ghost/social-cards", name, svg);

console.log("Rendered 25 collage-directed launch SVG and PNG pairs.");
