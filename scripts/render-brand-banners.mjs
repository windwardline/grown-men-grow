import {
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
  scribble,
  tape,
  writeAsset,
} from "./lib/editorial-collage.mjs";

// Brand banners for profile headers. These are brand surfaces, not article
// posts, so they use only the wordmark, palette, and tagline — never an
// article's photographs, which travel exclusively with their own field note.

function wordmarkPanel({x, y, width, height}) {
  const size = height * 0.238;
  const leading = size * 1.04;
  const textX = x + width / 2;
  const firstY = y + height / 2 - leading + size * 0.36;
  const rows = ["GROWN", "MEN", "GROW"];
  return `<rect x="${x}" y="${y}" width="${width}" height="${height}" fill="${OXBLOOD}"/>
    ${rows.map((row, index) =>
      `<text x="${textX}" y="${firstY + index * leading}" fill="${PAPER}" font-family="${SANS}" font-size="${size}" font-weight="900" text-anchor="middle" letter-spacing="1">${row}</text>`,
    ).join("")}`;
}

function banner({id, width, height}) {
  const panelHeight = Math.round(height * 0.76);
  const panelWidth = Math.round(panelHeight * 0.94);
  const panelX = Math.round(width * 0.09);
  const panelY = Math.round((height - panelHeight) / 2);
  const textX = panelX + panelWidth + Math.round(width * 0.045);
  const taglineSize = Math.round(height * 0.106);
  const urlSize = Math.round(height * 0.062);
  const taglineY = Math.round(height * 0.44);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${defs(id)}
  <rect width="${width}" height="${height}" fill="${PAPER_LIGHT}"/>
  ${wordmarkPanel({x: panelX, y: panelY, width: panelWidth, height: panelHeight})}
  ${tape(panelX + panelWidth / 2 - 105, panelY - 23, 210, -3)}
  <text x="${textX}" y="${taglineY}" fill="${INK}" font-family="${SERIF}" font-size="${taglineSize}" font-weight="700" font-style="italic" letter-spacing="-1">Essays on the unfinished</text>
  <text x="${textX}" y="${taglineY + taglineSize * 1.24}" fill="${INK}" font-family="${SERIF}" font-size="${taglineSize}" font-weight="700" font-style="italic" letter-spacing="-1">work of being a man.</text>
  ${scribble(`M${textX + 4} ${taglineY + taglineSize * 1.66} q ${taglineSize * 2.4} ${taglineSize * 0.34} ${taglineSize * 4.9} 0`, RUST, Math.max(4, Math.round(height * 0.012)))}
  <text x="${textX}" y="${Math.round(height * 0.82)}" fill="${SMOKE}" font-family="${SANS}" font-size="${urlSize}" font-weight="900" letter-spacing="2.4">GROWNMENGROW.COM</text>
  ${grain(width, height, id, 0.2)}
</svg>`;
}

const targets = [
  {name: "bluesky-banner", width: 1500, height: 500},
  {name: "ghost-publication-cover", width: 2000, height: 840},
  {name: "social-banner-wide", width: 1584, height: 396},
];

for (const target of targets) {
  writeAsset("brand/banners", target.name, banner({id: target.name, width: target.width, height: target.height}));
}

console.log(`Rendered ${targets.length} brand banner SVG and PNG pairs.`);
