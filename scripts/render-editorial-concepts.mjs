import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "assets/concepts/editorial-v1");

const OXBLOOD = "#3A1518";
const PAPER = "#EEE6D8";
const INK = "#121416";
const RUST = "#9A493F";
const SMOKE = "#71706B";
const SERIF = "Bodoni 72, Didot, Georgia, Times New Roman, serif";
const SANS = "Arial Narrow, Helvetica Neue Condensed, Helvetica Neue, Arial, sans-serif";
const PHOTO = "essay-01-hero-source.png";
const photoPath = path.join(output, PHOTO);
const photoDataUri = `data:image/png;base64,${fs.readFileSync(photoPath).toString("base64")}`;

fs.mkdirSync(output, { recursive: true });

function writeSvg(name, svg) {
  const svgPath = path.join(output, `${name}.svg`);
  const pngPath = path.join(output, `${name}.png`);
  const temporarySvgPath = path.join(os.tmpdir(), `grown-men-grow-${process.pid}-${name}.svg`);

  fs.writeFileSync(svgPath, svg);

  try {
    const embeddedSvg = svg.replaceAll(`href="${PHOTO}"`, `href="${photoDataUri}"`);
    fs.writeFileSync(temporarySvgPath, embeddedSvg);

    const result = spawnSync("sips", ["-s", "format", "png", temporarySvgPath, "--out", pngPath], {
      encoding: "utf8",
    });

    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || `sips exited with status ${result.status}`);
    }
  } finally {
    fs.rmSync(temporarySvgPath, { force: true });
  }
}

function lines(items, { x, y, size, leading, fill, family = SERIF, weight = 700, anchor = "start", tracking = -1 }) {
  return items
    .map(
      (item, index) =>
        `<text x="${x}" y="${y + index * leading}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" text-anchor="${anchor}" letter-spacing="${tracking}">${item}</text>`,
    )
    .join("");
}

function defs(id) {
  return `<defs>
    <linearGradient id="${id}-shadow" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#000" stop-opacity="0.02"/>
      <stop offset="0.62" stop-color="#000" stop-opacity="0.14"/>
      <stop offset="1" stop-color="#000" stop-opacity="0.72"/>
    </linearGradient>
    <filter id="${id}-grain" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.82" numOctaves="3" seed="11"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.14"/></feComponentTransfer>
    </filter>
  </defs>`;
}

writeSvg(
  "ghost-feature-hero",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  ${defs("ghost")}
  <rect width="1600" height="1000" fill="${PAPER}"/>
  <rect x="650" y="142" width="882" height="790" fill="${INK}"/>
  <image href="${PHOTO}" x="650" y="142" width="882" height="790" preserveAspectRatio="xMaxYMid slice"/>
  <rect x="650" y="142" width="882" height="790" fill="${OXBLOOD}" opacity="0.08"/>
  <rect x="650" y="142" width="882" height="790" filter="url(#ghost-grain)" opacity="0.3"/>
  <rect x="606" y="142" width="44" height="790" fill="${OXBLOOD}"/>
  <line x1="68" y1="92" x2="1532" y2="92" stroke="${INK}" stroke-width="2"/>
  <text x="68" y="68" fill="${INK}" font-family="${SANS}" font-size="24" font-weight="800" letter-spacing="4.2">GROWN MEN GROW</text>
  <text x="1532" y="68" fill="${INK}" font-family="${SANS}" font-size="18" font-weight="700" text-anchor="end" letter-spacing="2.8">FIELD NOTE 01 · 2026</text>
  <text x="112" y="220" fill="${OXBLOOD}" font-family="${SANS}" font-size="18" font-weight="800" letter-spacing="3.4">ESSAY 01</text>
  ${lines(["Strength", "Has to", "Grow Up"], { x: 68, y: 330, size: 102, leading: 96, fill: INK, tracking: -4 })}
  <line x1="70" y1="630" x2="180" y2="630" stroke="${RUST}" stroke-width="10"/>
  ${lines(["A man can look strong", "and still be hiding."], { x: 68, y: 694, size: 30, leading: 40, fill: OXBLOOD, family: SERIF, weight: 400, tracking: -0.4 })}
  <text x="68" y="920" fill="${INK}" font-family="${SANS}" font-size="18" font-weight="700" letter-spacing="2.1">MICHAEL PEACOCK</text>
  <text x="68" y="950" fill="${SMOKE}" font-family="${SANS}" font-size="15" font-weight="700" letter-spacing="1.9">GROWNMENGROW.COM</text>
  <text x="630" y="910" fill="${PAPER}" font-family="${SANS}" font-size="15" font-weight="700" letter-spacing="2.8" transform="rotate(-90 630 910)">THE UNFINISHED WORK OF BEING A MAN</text>
</svg>`,
);

writeSvg(
  "instagram-cover",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  ${defs("feed")}
  <rect width="1080" height="1350" fill="${INK}"/>
  <image href="${PHOTO}" x="0" y="0" width="1080" height="1350" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1080" height="1350" fill="url(#feed-shadow)"/>
  <rect width="1080" height="1350" filter="url(#feed-grain)" opacity="0.24"/>
  <rect x="0" y="0" width="1080" height="116" fill="${OXBLOOD}"/>
  <text x="54" y="73" fill="${PAPER}" font-family="${SANS}" font-size="24" font-weight="800" letter-spacing="4.4">GROWN MEN GROW</text>
  <text x="1026" y="73" fill="${PAPER}" font-family="${SANS}" font-size="18" font-weight="800" text-anchor="end" letter-spacing="3">FIELD NOTE 01</text>
  <text x="58" y="310" fill="none" stroke="${PAPER}" stroke-opacity="0.6" stroke-width="2" font-family="${SANS}" font-size="210" font-weight="800" letter-spacing="-8">01</text>
  <rect x="54" y="874" width="16" height="324" fill="${RUST}"/>
  ${lines(["Strength", "Has to", "Grow Up"], { x: 104, y: 948, size: 100, leading: 92, fill: PAPER, family: SANS, weight: 800, tracking: -3.5 })}
  <text x="104" y="1254" fill="${PAPER}" font-family="${SERIF}" font-size="27" font-style="italic">A man can look strong and still be hiding.</text>
  <text x="1026" y="1296" fill="${PAPER}" font-family="${SANS}" font-size="16" font-weight="700" text-anchor="end" letter-spacing="2.5">@GROWNMENGROW</text>
  <rect x="34" y="34" width="1012" height="1282" fill="none" stroke="${PAPER}" stroke-opacity="0.24"/>
</svg>`,
);

writeSvg(
  "carousel-spread",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  ${defs("spread")}
  <rect width="1080" height="1350" fill="${PAPER}"/>
  <rect x="594" y="0" width="486" height="780" fill="${INK}"/>
  <image href="${PHOTO}" x="594" y="0" width="486" height="780" preserveAspectRatio="xMaxYMid slice"/>
  <rect x="594" y="0" width="486" height="780" fill="${OXBLOOD}" opacity="0.1"/>
  <rect x="594" y="0" width="486" height="780" filter="url(#spread-grain)" opacity="0.22"/>
  <text x="58" y="72" fill="${OXBLOOD}" font-family="${SANS}" font-size="20" font-weight="800" letter-spacing="3.7">GROWN MEN GROW</text>
  <text x="58" y="145" fill="${SMOKE}" font-family="${SANS}" font-size="18" font-weight="700" letter-spacing="2.8">FIELD NOTE 01 · 03 / 07</text>
  <text x="54" y="370" fill="${RUST}" font-family="${SERIF}" font-size="170">“</text>
  ${lines(["Some of what", "we called", "strength"], { x: 58, y: 438, size: 72, leading: 76, fill: INK, tracking: -2.4 })}
  <rect x="58" y="690" width="180" height="9" fill="${OXBLOOD}"/>
  ${lines(["was fear with", "good posture."], { x: 58, y: 766, size: 64, leading: 68, fill: OXBLOOD, family: SANS, weight: 800, tracking: -2.5 })}
  <line x1="58" y1="1012" x2="1022" y2="1012" stroke="${INK}" stroke-opacity="0.25"/>
  <text x="58" y="1075" fill="${INK}" font-family="${SANS}" font-size="17" font-weight="800" letter-spacing="3">BUT STRENGTH TELLS US WHAT A MAN CAN DO.</text>
  <text x="58" y="1134" fill="${INK}" font-family="${SERIF}" font-size="30">It does not tell us what he serves.</text>
  <text x="58" y="1288" fill="${SMOKE}" font-family="${SANS}" font-size="16" font-weight="700" letter-spacing="2.4">GROWNMENGROW.COM</text>
  <text x="1022" y="1288" fill="${OXBLOOD}" font-family="${SANS}" font-size="16" font-weight="800" text-anchor="end" letter-spacing="2.4">SWIPE →</text>
</svg>`,
);

writeSvg(
  "story-cover",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  ${defs("story")}
  <rect width="1080" height="1920" fill="${INK}"/>
  <image href="${PHOTO}" x="0" y="0" width="1080" height="1920" preserveAspectRatio="xMidYMid slice"/>
  <rect width="1080" height="1920" fill="url(#story-shadow)"/>
  <rect width="1080" height="1920" filter="url(#story-grain)" opacity="0.24"/>
  <rect x="0" y="1328" width="1080" height="592" fill="${OXBLOOD}" opacity="0.94"/>
  <text x="62" y="106" fill="${PAPER}" font-family="${SANS}" font-size="25" font-weight="800" letter-spacing="4.5">GROWN MEN GROW</text>
  <text x="1018" y="106" fill="${PAPER}" font-family="${SANS}" font-size="18" font-weight="800" text-anchor="end" letter-spacing="3">ESSAY 01</text>
  <line x1="62" y1="142" x2="1018" y2="142" stroke="${PAPER}" stroke-opacity="0.55"/>
  <text x="58" y="522" fill="none" stroke="${PAPER}" stroke-opacity="0.5" stroke-width="2" font-family="${SANS}" font-size="300" font-weight="800">01</text>
  ${lines(["Strength", "Has to", "Grow Up"], { x: 62, y: 1458, size: 112, leading: 102, fill: PAPER, family: SANS, weight: 800, tracking: -4 })}
  <text x="62" y="1798" fill="${PAPER}" font-family="${SERIF}" font-size="29" font-style="italic">A man can look strong and still be hiding.</text>
  <text x="1018" y="1860" fill="${PAPER}" font-family="${SANS}" font-size="17" font-weight="700" text-anchor="end" letter-spacing="2.8">GROWNMENGROW.COM</text>
</svg>`,
);

writeSvg(
  "social-card",
  `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  ${defs("social")}
  <rect width="1200" height="630" fill="${PAPER}"/>
  <rect x="0" y="0" width="512" height="630" fill="${INK}"/>
  <image href="${PHOTO}" x="0" y="0" width="512" height="630" preserveAspectRatio="xMaxYMid slice"/>
  <rect x="0" y="0" width="512" height="630" fill="${OXBLOOD}" opacity="0.1"/>
  <rect x="0" y="0" width="512" height="630" filter="url(#social-grain)" opacity="0.22"/>
  <rect x="512" y="0" width="18" height="630" fill="${OXBLOOD}"/>
  <text x="576" y="72" fill="${INK}" font-family="${SANS}" font-size="21" font-weight="800" letter-spacing="3.8">GROWN MEN GROW</text>
  <text x="1140" y="72" fill="${SMOKE}" font-family="${SANS}" font-size="16" font-weight="700" text-anchor="end" letter-spacing="2.6">FIELD NOTE 01</text>
  ${lines(["Strength Has to", "Grow Up"], { x: 576, y: 230, size: 72, leading: 74, fill: OXBLOOD, tracking: -2.8 })}
  <line x1="578" y1="405" x2="692" y2="405" stroke="${RUST}" stroke-width="8"/>
  <text x="576" y="468" fill="${INK}" font-family="${SERIF}" font-size="27" font-style="italic">A man can look strong and still be hiding.</text>
  <text x="576" y="574" fill="${SMOKE}" font-family="${SANS}" font-size="16" font-weight="700" letter-spacing="2.4">GROWNMENGROW.COM</text>
  <rect x="24" y="24" width="1152" height="582" fill="none" stroke="${INK}" stroke-opacity="0.18"/>
</svg>`,
);

console.log(`Rendered five editorial concept SVG and PNG pairs in ${output}`);
