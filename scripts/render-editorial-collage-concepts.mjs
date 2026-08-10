import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "assets/concepts/editorial-collage-v1");
const source = path.join(root, "assets/source/editorial");

const OXBLOOD = "#3A1518";
const PAPER = "#EEE6D8";
const PAPER_LIGHT = "#F8F3EA";
const INK = "#121416";
const RUST = "#B14F3F";
const GREEN = "#60735A";
const SMOKE = "#71706B";
const SERIF = "Bodoni 72, Didot, Georgia, Times New Roman, serif";
const SANS = "Arial Narrow, Helvetica Neue Condensed, Helvetica Neue, Arial, sans-serif";

const sources = {
  "repairing-wooden-chair.png": path.join(source, "repairing-wooden-chair.png"),
  "sunlit-writing-table.png": path.join(source, "sunlit-writing-table.png"),
  "friends-in-conversation.png": path.join(source, "friends-in-conversation.png"),
};

fs.mkdirSync(output, {recursive: true});

function imageHref(name) {
  return `../../source/editorial/${name}`;
}

function embedImages(svg) {
  let embedded = svg;
  for (const [name, file] of Object.entries(sources)) {
    const data = fs.readFileSync(file).toString("base64");
    embedded = embedded.replaceAll(imageHref(name), `data:image/png;base64,${data}`);
  }
  return embedded;
}

function textureDefs(prefix) {
  return `<defs>
    <filter id="${prefix}-paper" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="19"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.1"/></feComponentTransfer>
    </filter>
    <filter id="${prefix}-photo" x="-5%" y="-5%" width="110%" height="110%">
      <feColorMatrix type="saturate" values="0.88"/>
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.04" intercept="0.01"/>
        <feFuncG type="linear" slope="1.02" intercept="0.01"/>
        <feFuncB type="linear" slope="0.98" intercept="0"/>
      </feComponentTransfer>
    </filter>
    <pattern id="${prefix}-dots" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.6" fill="${INK}" opacity="0.22"/>
    </pattern>
    <clipPath id="${prefix}-torn-a">
      <polygon points="18,26 294,10 566,28 832,8 1080,30 1062,316 1078,584 1054,840 786,826 528,846 274,824 12,842 28,572 8,298"/>
    </clipPath>
    <clipPath id="${prefix}-torn-b">
      <polygon points="16,18 328,6 634,24 1018,10 1034,350 1014,690 1030,1018 720,1006 414,1024 12,1008 28,672 8,334"/>
    </clipPath>
  </defs>`;
}

function grain(width, height, prefix, opacity = 0.32) {
  return `<rect width="${width}" height="${height}" filter="url(#${prefix}-paper)" opacity="${opacity}" pointer-events="none"/>`;
}

function tape(x, y, width, rotation = 0) {
  return `<g transform="rotate(${rotation} ${x + width / 2} ${y + 24})">
    <rect x="${x}" y="${y}" width="${width}" height="48" fill="#D9CBAF" opacity="0.76"/>
    <line x1="${x + 8}" y1="${y + 7}" x2="${x + width - 10}" y2="${y + 4}" stroke="#fff" stroke-opacity="0.38"/>
  </g>`;
}

function scribble(pathData, color = RUST, width = 7) {
  return `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

function writeSvg(name, svg) {
  const svgPath = path.join(output, `${name}.svg`);
  const pngPath = path.join(output, `${name}.png`);
  const temporarySvgPath = path.join(os.tmpdir(), `grown-men-grow-collage-${process.pid}-${name}.svg`);

  fs.writeFileSync(svgPath, svg);

  try {
    fs.writeFileSync(temporarySvgPath, embedImages(svg));
    const result = spawnSync("sips", ["-s", "format", "png", temporarySvgPath, "--out", pngPath], {
      encoding: "utf8",
    });
    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || `sips exited with status ${result.status}`);
    }
  } finally {
    fs.rmSync(temporarySvgPath, {force: true});
  }
}

writeSvg(
  "ghost-feature-hero",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${textureDefs("ghost-collage")}
  <rect width="1600" height="1000" fill="${PAPER_LIGHT}"/>
  <text x="62" y="760" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.16" stroke-width="3" font-family="${SANS}" font-size="690" font-weight="900" letter-spacing="-40">01</text>
  <rect x="782" y="72" width="742" height="824" fill="${OXBLOOD}" transform="rotate(2 1153 484)"/>
  <g transform="rotate(-1.6 1150 490)">
    <path d="M740 52 L1518 72 L1498 906 L754 928 L766 680 L744 430 Z" fill="${PAPER}"/>
    <image href="${imageHref("repairing-wooden-chair.png")}" x="754" y="62" width="752" height="850" preserveAspectRatio="xMidYMid slice" filter="url(#ghost-collage-photo)"/>
    <path d="M754 62 L1506 62 L1490 164 L760 218 Z" fill="url(#ghost-collage-dots)" opacity="0.55"/>
  </g>
  ${tape(1070, 42, 250, -3)}
  <line x1="62" y1="78" x2="1538" y2="78" stroke="${INK}" stroke-width="2"/>
  <text x="62" y="57" fill="${INK}" font-family="${SANS}" font-size="23" font-weight="800" letter-spacing="4.5">GROWN MEN GROW</text>
  <text x="1538" y="57" fill="${INK}" font-family="${SANS}" font-size="17" font-weight="800" text-anchor="end" letter-spacing="3">FIELD NOTE 01 · 2026</text>
  <g transform="rotate(-1.2 365 390)">
    <rect x="54" y="198" width="570" height="126" fill="${PAPER}"/>
    <text x="78" y="298" fill="${INK}" font-family="${SERIF}" font-size="112" font-weight="700" letter-spacing="-4">Strength</text>
  </g>
  <g transform="rotate(1.4 390 505)">
    <rect x="116" y="326" width="528" height="118" fill="${OXBLOOD}"/>
    <text x="140" y="418" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="95" font-weight="900" letter-spacing="-3">HAS TO</text>
  </g>
  <g transform="rotate(-0.8 420 620)">
    <rect x="50" y="444" width="674" height="132" fill="${PAPER}"/>
    <text x="76" y="550" fill="${INK}" font-family="${SERIF}" font-size="116" font-weight="700" letter-spacing="-5">Grow Up</text>
  </g>
  ${scribble("M76 594 C184 624 314 584 420 608 C512 630 612 602 694 618")}
  <text x="66" y="684" fill="${OXBLOOD}" font-family="${SERIF}" font-size="30" font-style="italic">A man can look strong and still be hiding.</text>
  <rect x="62" y="836" width="430" height="2" fill="${INK}"/>
  <text x="62" y="882" fill="${INK}" font-family="${SANS}" font-size="18" font-weight="800" letter-spacing="2.6">GROWN MEN GROW</text>
  <text x="62" y="915" fill="${SMOKE}" font-family="${SANS}" font-size="16" font-weight="700" letter-spacing="2.2">GROWNMENGROW.COM</text>
  ${grain(1600, 1000, "ghost-collage", 0.24)}
</svg>`,
);

writeSvg(
  "instagram-cover",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  ${textureDefs("feed-collage")}
  <rect width="1080" height="1350" fill="${PAPER_LIGHT}"/>
  <rect x="42" y="42" width="996" height="1266" fill="none" stroke="${INK}" stroke-opacity="0.32" stroke-width="2"/>
  <text x="56" y="98" fill="${INK}" font-family="${SANS}" font-size="23" font-weight="800" letter-spacing="4.2">GROWN MEN GROW</text>
  <text x="1024" y="98" fill="${OXBLOOD}" font-family="${SANS}" font-size="18" font-weight="800" text-anchor="end" letter-spacing="2.8">FIELD NOTE 01</text>
  <rect x="44" y="136" width="992" height="700" fill="${GREEN}" transform="rotate(-1 540 486)"/>
  <g clip-path="url(#feed-collage-torn-a)" transform="translate(0 118)">
    <image href="${imageHref("repairing-wooden-chair.png")}" x="10" y="0" width="1060" height="870" preserveAspectRatio="xMidYMid slice" filter="url(#feed-collage-photo)"/>
  </g>
  ${tape(98, 122, 214, -4)}
  <text x="52" y="820" fill="none" stroke="${PAPER_LIGHT}" stroke-width="3" stroke-opacity="0.76" font-family="${SANS}" font-size="250" font-weight="900">01</text>
  <g transform="rotate(-1.5 540 960)">
    <rect x="40" y="808" width="730" height="150" fill="${PAPER_LIGHT}"/>
    <text x="62" y="926" fill="${INK}" font-family="${SERIF}" font-size="122" font-weight="700" letter-spacing="-5">Strength</text>
  </g>
  <g transform="rotate(1.2 550 1080)">
    <rect x="158" y="948" width="876" height="148" fill="${OXBLOOD}"/>
    <text x="186" y="1065" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="112" font-weight="900" letter-spacing="-4">HAS TO GROW UP</text>
  </g>
  ${scribble("M78 1132 C232 1100 414 1146 566 1114 C704 1086 852 1130 1002 1104", RUST, 9)}
  <text x="62" y="1206" fill="${INK}" font-family="${SERIF}" font-size="29" font-style="italic">A man can look strong and still be hiding.</text>
  <text x="62" y="1284" fill="${SMOKE}" font-family="${SANS}" font-size="17" font-weight="800" letter-spacing="2.5">GROWNMENGROW.COM</text>
  <text x="1016" y="1284" fill="${OXBLOOD}" font-family="${SANS}" font-size="17" font-weight="800" text-anchor="end" letter-spacing="2.5">01 / 07</text>
  ${grain(1080, 1350, "feed-collage", 0.22)}
</svg>`,
);

writeSvg(
  "carousel-spread",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  ${textureDefs("spread-collage")}
  <rect width="1080" height="1350" fill="${PAPER}"/>
  <rect x="646" y="-18" width="462" height="820" fill="${OXBLOOD}" transform="rotate(2 877 392)"/>
  <g transform="rotate(-2 810 370)">
    <path d="M558 10 L1050 30 L1032 762 L580 788 L566 514 Z" fill="${PAPER_LIGHT}"/>
    <image href="${imageHref("sunlit-writing-table.png")}" x="570" y="18" width="470" height="760" preserveAspectRatio="xMidYMid slice" filter="url(#spread-collage-photo)"/>
  </g>
  ${tape(720, 2, 192, 5)}
  <rect x="0" y="0" width="530" height="60" fill="url(#spread-collage-dots)"/>
  <text x="52" y="104" fill="${OXBLOOD}" font-family="${SANS}" font-size="21" font-weight="800" letter-spacing="3.8">GROWN MEN GROW</text>
  <text x="52" y="152" fill="${SMOKE}" font-family="${SANS}" font-size="17" font-weight="800" letter-spacing="2.7">FIELD NOTE 01 · 03 / 07</text>
  <text x="36" y="376" fill="${RUST}" font-family="${SERIF}" font-size="220">“</text>
  <g transform="rotate(-1.5 330 440)">
    <rect x="44" y="312" width="592" height="104" fill="${PAPER_LIGHT}"/>
    <text x="62" y="395" fill="${INK}" font-family="${SERIF}" font-size="76" font-weight="700" letter-spacing="-2.7">Some of what</text>
  </g>
  <g transform="rotate(1.2 360 540)">
    <rect x="78" y="420" width="612" height="104" fill="${INK}"/>
    <text x="96" y="503" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="78" font-weight="900" letter-spacing="-2.5">WE CALLED</text>
  </g>
  <g transform="rotate(-1.1 350 650)">
    <rect x="42" y="528" width="668" height="112" fill="${PAPER_LIGHT}"/>
    <text x="62" y="618" fill="${OXBLOOD}" font-family="${SERIF}" font-size="86" font-weight="700" letter-spacing="-3">strength</text>
  </g>
  <g transform="rotate(0.7 540 854)">
    <rect x="48" y="748" width="980" height="216" fill="${OXBLOOD}"/>
    <text x="78" y="846" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="84" font-weight="900" letter-spacing="-3">WAS FEAR WITH</text>
    <text x="78" y="935" fill="${PAPER_LIGHT}" font-family="${SERIF}" font-size="91" font-weight="700" font-style="italic" letter-spacing="-3">good posture.</text>
  </g>
  ${scribble("M86 1008 C244 1048 400 992 566 1024 C740 1058 868 1014 1004 1038", RUST, 8)}
  <text x="54" y="1112" fill="${INK}" font-family="${SANS}" font-size="17" font-weight="800" letter-spacing="2.8">BUT STRENGTH TELLS US WHAT A MAN CAN DO.</text>
  <text x="54" y="1174" fill="${INK}" font-family="${SERIF}" font-size="34">It does not tell us what he serves.</text>
  <line x1="54" y1="1240" x2="1026" y2="1240" stroke="${INK}" stroke-opacity="0.3"/>
  <text x="54" y="1292" fill="${SMOKE}" font-family="${SANS}" font-size="16" font-weight="800" letter-spacing="2.4">GROWNMENGROW.COM</text>
  <text x="1026" y="1292" fill="${OXBLOOD}" font-family="${SANS}" font-size="17" font-weight="900" text-anchor="end" letter-spacing="2.4">SWIPE →</text>
  ${grain(1080, 1350, "spread-collage", 0.24)}
</svg>`,
);

writeSvg(
  "story-cover",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  ${textureDefs("story-collage")}
  <rect width="1080" height="1920" fill="${PAPER_LIGHT}"/>
  <rect x="-40" y="128" width="850" height="1170" fill="${GREEN}" transform="rotate(-2 -40 128)"/>
  <g transform="translate(0 112) rotate(1.2 520 560)" clip-path="url(#story-collage-torn-b)">
    <image href="${imageHref("friends-in-conversation.png")}" x="18" y="0" width="1030" height="1220" preserveAspectRatio="xMidYMid slice" filter="url(#story-collage-photo)"/>
  </g>
  <rect x="752" y="100" width="328" height="1150" fill="url(#story-collage-dots)" opacity="0.5"/>
  ${tape(106, 96, 224, -5)}
  ${tape(776, 1160, 196, 4)}
  <text x="58" y="90" fill="${INK}" font-family="${SANS}" font-size="24" font-weight="900" letter-spacing="4.3">GROWN MEN GROW</text>
  <text x="1022" y="90" fill="${OXBLOOD}" font-family="${SANS}" font-size="18" font-weight="900" text-anchor="end" letter-spacing="3">FIELD NOTE 01</text>
  <g transform="rotate(-1.2 530 1350)">
    <rect x="42" y="1242" width="996" height="164" fill="${PAPER_LIGHT}"/>
    <text x="66" y="1370" fill="${INK}" font-family="${SERIF}" font-size="121" font-weight="700" letter-spacing="-4">A man can</text>
  </g>
  <g transform="rotate(1.4 550 1480)">
    <rect x="94" y="1388" width="944" height="154" fill="${OXBLOOD}"/>
    <text x="122" y="1507" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="105" font-weight="900" letter-spacing="-3.5">LOOK STRONG</text>
  </g>
  <g transform="rotate(-0.8 520 1615)">
    <rect x="42" y="1530" width="838" height="144" fill="${PAPER}"/>
    <text x="66" y="1642" fill="${INK}" font-family="${SERIF}" font-size="103" font-weight="700" letter-spacing="-3.5">and still</text>
  </g>
  <g transform="rotate(1 565 1760)">
    <rect x="302" y="1662" width="736" height="150" fill="${RUST}"/>
    <text x="330" y="1780" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="112" font-weight="900" letter-spacing="-3.5">BE HIDING.</text>
  </g>
  ${scribble("M70 1838 C220 1808 382 1852 520 1818 C678 1780 846 1846 1010 1810", OXBLOOD, 9)}
  <text x="58" y="1884" fill="${SMOKE}" font-family="${SANS}" font-size="17" font-weight="900" letter-spacing="2.7">@GROWNMENGROW</text>
  ${grain(1080, 1920, "story-collage", 0.22)}
</svg>`,
);

writeSvg(
  "social-card",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${textureDefs("social-collage")}
  <rect width="1200" height="630" fill="${PAPER_LIGHT}"/>
  <rect x="0" y="0" width="458" height="630" fill="${OXBLOOD}"/>
  <g transform="rotate(-2 260 310)">
    <path d="M22 18 L516 2 L528 616 L6 630 Z" fill="${PAPER}"/>
    <image href="${imageHref("sunlit-writing-table.png")}" x="18" y="8" width="500" height="612" preserveAspectRatio="xMidYMid slice" filter="url(#social-collage-photo)"/>
  </g>
  ${tape(154, 4, 180, 2)}
  <text x="554" y="70" fill="${INK}" font-family="${SANS}" font-size="21" font-weight="900" letter-spacing="3.8">GROWN MEN GROW</text>
  <text x="1144" y="70" fill="${OXBLOOD}" font-family="${SANS}" font-size="16" font-weight="900" text-anchor="end" letter-spacing="2.5">FIELD NOTE 01</text>
  <g transform="rotate(-1 850 230)">
    <rect x="526" y="142" width="636" height="100" fill="${PAPER}"/>
    <text x="548" y="220" fill="${INK}" font-family="${SERIF}" font-size="74" font-weight="700" letter-spacing="-2.8">Strength Has to</text>
  </g>
  <g transform="rotate(1.2 850 330)">
    <rect x="600" y="244" width="562" height="104" fill="${OXBLOOD}"/>
    <text x="624" y="326" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="78" font-weight="900" letter-spacing="-2.7">GROW UP</text>
  </g>
  ${scribble("M552 382 C686 358 790 398 920 372 C1000 356 1070 374 1142 364", RUST, 7)}
  <text x="550" y="446" fill="${INK}" font-family="${SERIF}" font-size="28" font-style="italic">A man can look strong and still be hiding.</text>
  <line x1="550" y1="510" x2="1142" y2="510" stroke="${INK}" stroke-opacity="0.28"/>
  <text x="550" y="560" fill="${SMOKE}" font-family="${SANS}" font-size="16" font-weight="800" letter-spacing="2.4">GROWNMENGROW.COM</text>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${INK}" stroke-opacity="0.2"/>
  ${grain(1200, 630, "social-collage", 0.22)}
</svg>`,
);

console.log(`Rendered five editorial collage concept SVG and PNG pairs in ${output}`);
