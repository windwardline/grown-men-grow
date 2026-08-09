import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {spawnSync} from "node:child_process";
import {fileURLToPath} from "node:url";
import {escapeXml} from "./lib/editorial-collage.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const assetRoot = path.join(root, "assets/drafts");
const output = path.join(assetRoot, "review");
const background = "#121416";
const paper = "#EEE6D8";
const smoke = "#A9A59D";

fs.mkdirSync(output, {recursive: true});

const numbered = (directory, count) => Array.from({length: count}, (_, index) => {
  const file = String(index + 1).padStart(2, "0");
  return {label: file, path: `${directory}/${file}.png`};
});

const sheets = [
  {
    name: "pinned-introduction",
    title: "Pinned introduction",
    items: numbered("instagram/pinned-introduction", 7),
    columns: 4,
    itemWidth: 300,
    itemHeight: 375,
  },
  {
    name: "foundational-carousel",
    title: "Foundational carousel",
    items: numbered("instagram/foundational-carousel", 7),
    columns: 4,
    itemWidth: 300,
    itemHeight: 375,
  },
  {
    name: "recognition-carousel",
    title: "Recognition carousel",
    items: numbered("instagram/recognition-carousel", 7),
    columns: 4,
    itemWidth: 300,
    itemHeight: 375,
  },
  {
    name: "stories-static-reel",
    title: "Stories, static post, and Reel cover",
    items: [
      ...numbered("instagram/launch-stories", 5).map((item) => ({...item, label: `Story ${item.label}`})),
      {label: "Static post", path: "instagram/static-post/fear-with-good-posture.png"},
      {label: "Reel cover", path: "instagram/reel/strength-has-to-grow-up-cover.png"},
    ],
    columns: 4,
    itemWidth: 270,
    itemHeight: 480,
  },
  {
    name: "ghost-social-cards",
    title: "Ghost social cards",
    items: [
      {label: "Publication", path: "ghost/social-cards/publication.png"},
      {label: "Start Here", path: "ghost/social-cards/start-here.png"},
      {label: "About", path: "ghost/social-cards/about.png"},
      {label: "Essay 1", path: "ghost/social-cards/strength-has-to-grow-up.png"},
    ],
    columns: 2,
    itemWidth: 600,
    itemHeight: 315,
  },
];

function dataUri(relativePath) {
  const data = fs.readFileSync(path.join(assetRoot, relativePath)).toString("base64");
  return `data:image/png;base64,${data}`;
}

for (const sheet of sheets) {
  const gap = 26;
  const margin = 42;
  const captionHeight = 38;
  const titleHeight = 68;
  const rows = Math.ceil(sheet.items.length / sheet.columns);
  const width = margin * 2 + sheet.columns * sheet.itemWidth + (sheet.columns - 1) * gap;
  const height = margin * 2 + titleHeight + rows * (sheet.itemHeight + captionHeight) + (rows - 1) * gap;
  const images = sheet.items.map((item, index) => {
    const column = index % sheet.columns;
    const row = Math.floor(index / sheet.columns);
    const x = margin + column * (sheet.itemWidth + gap);
    const y = margin + titleHeight + row * (sheet.itemHeight + captionHeight + gap);
    return `<g>
      <rect x="${x}" y="${y}" width="${sheet.itemWidth}" height="${sheet.itemHeight}" fill="#20262B" stroke="${paper}" stroke-opacity="0.18"/>
      <image href="${dataUri(item.path)}" x="${x}" y="${y}" width="${sheet.itemWidth}" height="${sheet.itemHeight}" preserveAspectRatio="xMidYMid meet"/>
      <text x="${x}" y="${y + sheet.itemHeight + 25}" fill="${smoke}" font-family="Helvetica Neue, Arial, sans-serif" font-size="15">${escapeXml(item.label)}</text>
    </g>`;
  }).join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
    <rect width="${width}" height="${height}" fill="${background}"/>
    <text x="${margin}" y="${margin + 30}" fill="${paper}" font-family="Helvetica Neue, Arial, sans-serif" font-size="30" font-weight="700">${escapeXml(sheet.title)}</text>
    ${images}
  </svg>`;
  const temporarySvg = path.join(os.tmpdir(), `grown-men-grow-review-${process.pid}-${sheet.name}.svg`);
  const pngPath = path.join(output, `${sheet.name}.png`);
  try {
    fs.writeFileSync(temporarySvg, svg);
    const result = spawnSync("sips", ["-s", "format", "png", temporarySvg, "--out", pngPath], {encoding: "utf8"});
    if (result.status !== 0) throw new Error(result.stderr || result.stdout || `sips exited with status ${result.status}`);
  } finally {
    fs.rmSync(temporarySvg, {force: true});
  }
}

console.log(`Rendered ${sheets.length} review contact sheets.`);
