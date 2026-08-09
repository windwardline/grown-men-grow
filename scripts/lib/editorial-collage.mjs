import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
export const OUTPUT = path.join(ROOT, "assets/drafts");

export const OXBLOOD = "#3A1518";
export const PAPER = "#EEE6D8";
export const PAPER_LIGHT = "#F8F3EA";
export const INK = "#121416";
export const RUST = "#B14F3F";
export const GREEN = "#60735A";
export const SMOKE = "#71706B";
export const SERIF = "Bodoni 72, Didot, Georgia, Times New Roman, serif";
export const SANS = "Arial Narrow, Helvetica Neue Condensed, Helvetica Neue, Arial, sans-serif";


export function escapeXml(value) {
  const entities = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"};
  return String(value).replace(/[&<>"]/g, (character) => entities[character]);
}

export function defs(id) {
  return `<defs>
    <filter id="${id}-paper" x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="4" seed="23"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer><feFuncA type="table" tableValues="0 0.1"/></feComponentTransfer>
    </filter>
    <filter id="${id}-photo" x="-5%" y="-5%" width="110%" height="110%">
      <feColorMatrix type="saturate" values="0.9"/>
      <feComponentTransfer>
        <feFuncR type="linear" slope="1.03" intercept="0.01"/>
        <feFuncG type="linear" slope="1.02" intercept="0.01"/>
        <feFuncB type="linear" slope="0.99" intercept="0"/>
      </feComponentTransfer>
    </filter>
    <pattern id="${id}-dots" width="12" height="12" patternUnits="userSpaceOnUse">
      <circle cx="2" cy="2" r="1.55" fill="${INK}" opacity="0.2"/>
    </pattern>
  </defs>`;
}

export function grain(width, height, id, opacity = 0.22) {
  return `<rect width="${width}" height="${height}" filter="url(#${id}-paper)" opacity="${opacity}" pointer-events="none"/>`;
}

export function lines(items, {
  x,
  y,
  size,
  leading,
  fill = INK,
  family = SERIF,
  weight = 700,
  style = "normal",
  anchor = "start",
  tracking = -1.6,
} = {}) {
  return items.map((item, index) =>
    `<text x="${x}" y="${y + index * leading}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" text-anchor="${anchor}" letter-spacing="${tracking}">${escapeXml(item)}</text>`,
  ).join("");
}

export function strip({x, y, width, height, fill, text, color, size, family = SANS, weight = 900, rotation = 0, tracking = -2.5}) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  return `<g transform="rotate(${rotation} ${centerX} ${centerY})">
    <rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${fill}"/>
    <text x="${x + 24}" y="${y + height * 0.76}" fill="${color}" font-family="${family}" font-size="${size}" font-weight="${weight}" letter-spacing="${tracking}">${escapeXml(text)}</text>
  </g>`;
}

export function tape(x, y, width, rotation = 0) {
  return `<g transform="rotate(${rotation} ${x + width / 2} ${y + 23})">
    <rect x="${x}" y="${y}" width="${width}" height="46" fill="#D9CBAF" opacity="0.74"/>
    <line x1="${x + 8}" y1="${y + 7}" x2="${x + width - 10}" y2="${y + 4}" stroke="#fff" stroke-opacity="0.38"/>
  </g>`;
}

export function scribble(pathData, color = RUST, width = 7) {
  return `<path d="${pathData}" fill="none" stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

export function photo({name, x, y, width, height, rotation = 0, position = "xMidYMid", backing = OXBLOOD, id}) {
  const centerX = x + width / 2;
  const centerY = y + height / 2;
  return `<g transform="rotate(${rotation} ${centerX} ${centerY})">
    <rect x="${x - 12}" y="${y + 10}" width="${width + 24}" height="${height + 14}" fill="${backing}"/>
    <rect x="${x - 4}" y="${y - 4}" width="${width + 8}" height="${height + 8}" fill="${PAPER_LIGHT}"/>
    <image href="/assets/source/${name}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="${position} slice" filter="url(#${id}-photo)"/>
  </g>`;
}

export function header({number, total, label = "FIELD NOTE 01", color = INK, y = 94}) {
  return `<text x="58" y="${y}" fill="${color}" font-family="${SANS}" font-size="22" font-weight="900" letter-spacing="4.1">GROWN MEN GROW</text>
  <text x="1022" y="${y}" fill="${color}" font-family="${SANS}" font-size="18" font-weight="900" text-anchor="end" letter-spacing="2.7">${escapeXml(label)} · ${String(number).padStart(2, "0")} / ${String(total).padStart(2, "0")}</text>`;
}

export function portraitCanvas({id, body, background = PAPER_LIGHT, number, total = 7, label = "FIELD NOTE 01", footerColor = SMOKE}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  ${defs(id)}
  <rect width="1080" height="1350" fill="${background}"/>
  ${header({number, total, label})}
  ${body}
  <text x="58" y="1292" fill="${footerColor}" font-family="${SANS}" font-size="17" font-weight="900" letter-spacing="2.5">@GROWNMENGROW</text>
  ${grain(1080, 1350, id)}
</svg>`;
}

export function storyCanvas({id, body, background = PAPER_LIGHT, label = "GROWN MEN GROW", footerColor = SMOKE}) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  ${defs(id)}
  <rect width="1080" height="1920" fill="${background}"/>
  <text x="58" y="94" fill="${INK}" font-family="${SANS}" font-size="24" font-weight="900" letter-spacing="4.2">${escapeXml(label)}</text>
  ${body}
  <text x="58" y="1868" fill="${footerColor}" font-family="${SANS}" font-size="18" font-weight="900" letter-spacing="2.6">@GROWNMENGROW</text>
  ${grain(1080, 1920, id)}
</svg>`;
}

// Resolve every source-image href dynamically so a newly added photograph can
// never silently render as an empty frame.
function embedImages(svg) {
  return svg.replace(/\/assets\/source\/[^"]+/g, (href) => {
    const file = path.join(ROOT, href.slice(1));
    const data = fs.readFileSync(file).toString("base64");
    return `data:image/png;base64,${data}`;
  });
}

export function writeAsset(relativeDirectory, name, svg) {
  const directory = path.join(OUTPUT, relativeDirectory);
  const svgPath = path.join(directory, `${name}.svg`);
  const pngPath = path.join(directory, `${name}.png`);
  const tempSvg = path.join(os.tmpdir(), `grown-men-grow-${process.pid}-${relativeDirectory.replaceAll("/", "-")}-${name}.svg`);

  fs.mkdirSync(directory, {recursive: true});
  fs.writeFileSync(svgPath, svg);

  try {
    fs.writeFileSync(tempSvg, embedImages(svg));
    const result = spawnSync("sips", ["-s", "format", "png", tempSvg, "--out", pngPath], {encoding: "utf8"});
    if (result.status !== 0) {
      throw new Error(result.stderr || result.stdout || `sips exited with status ${result.status}`);
    }
  } finally {
    fs.rmSync(tempSvg, {force: true});
  }
}
