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

function banner({id, width, height, band = height}) {
  // `band` confines all content to a centered horizontal strip for hosts that
  // display a wider crop than the uploaded file (LinkedIn shows ~1128x191 of a
  // 1584x396 upload, so only the middle ~268px is guaranteed visible).
  const bandTop = Math.round((height - band) / 2);
  const panelHeight = Math.round(band * 0.76);
  const panelWidth = Math.round(panelHeight * 0.94);
  const panelX = Math.round(width * 0.09);
  const panelY = bandTop + Math.round((band - panelHeight) / 2);
  const textX = panelX + panelWidth + Math.round(width * 0.045);
  const taglineSize = Math.round(band * 0.106);
  const urlSize = Math.round(band * 0.062);
  const taglineY = bandTop + Math.round(band * 0.44);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${defs(id)}
  <rect width="${width}" height="${height}" fill="${PAPER_LIGHT}"/>
  ${wordmarkPanel({x: panelX, y: panelY, width: panelWidth, height: panelHeight})}
  ${tape(panelX + panelWidth / 2 - 105, panelY - 23, 210, -3)}
  <text x="${textX}" y="${taglineY}" fill="${INK}" font-family="${SERIF}" font-size="${taglineSize}" font-weight="700" font-style="italic" letter-spacing="-1">Essays on the unfinished</text>
  <text x="${textX}" y="${taglineY + taglineSize * 1.24}" fill="${INK}" font-family="${SERIF}" font-size="${taglineSize}" font-weight="700" font-style="italic" letter-spacing="-1">work of being a man.</text>
  ${scribble(`M${textX + 4} ${taglineY + taglineSize * 1.66} q ${taglineSize * 2.4} ${taglineSize * 0.34} ${taglineSize * 4.9} 0`, RUST, Math.max(4, Math.round(height * 0.012)))}
  <text x="${textX}" y="${bandTop + Math.round(band * 0.82)}" fill="${SMOKE}" font-family="${SANS}" font-size="${urlSize}" font-weight="900" letter-spacing="2.4">GROWNMENGROW.COM</text>
  ${grain(width, height, id, 0.2)}
</svg>`;
}

// LinkedIn and Bluesky both compose the profile's own logo over the banner's
// lower-left corner, so their covers carry no wordmark panel — the tagline is
// the hero, set right of the avatar overlap zone. `band` confines content to
// a centered strip for hosts that crop the display (LinkedIn shows ~1128x191
// of a 1584x396 upload); Bluesky displays the full 3:1 canvas, so band=height.
function taglineBanner({id, width, height, band = height, taglineFactor = 0.152, textXFactor = 0.335}) {
  const bandTop = Math.round((height - band) / 2);
  const textX = Math.round(width * textXFactor);
  const taglineSize = Math.round(band * taglineFactor);
  const urlSize = Math.round(band * 0.066);
  const taglineY = bandTop + Math.round(band * 0.4);
  const sheetX = Math.round(width * 0.295);
  const sheetY = bandTop + Math.round(band * 0.06);
  const sheetW = Math.round(width * 0.44);
  const sheetH = Math.round(band * 0.9);
  const chipX = Math.round(width * 0.775);
  const chipY = bandTop + Math.round(band * 0.3);
  const chipW = Math.round(width * 0.165);
  const chipH = Math.round(band * 0.42);
  const chipTextSize = Math.round(band * 0.072);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${defs(id)}
  <rect width="${width}" height="${height}" fill="${PAPER_LIGHT}"/>
  <rect x="${Math.round(width * 0.74)}" y="0" width="${Math.round(width * 0.26)}" height="${height}" fill="${PAPER}" transform="rotate(1.1 ${Math.round(width * 0.87)} ${Math.round(height / 2)})"/>
  <rect x="${sheetX}" y="${sheetY}" width="${sheetW}" height="${sheetH}" fill="${PAPER}" transform="rotate(-0.9 ${sheetX + sheetW / 2} ${sheetY + sheetH / 2})"/>
  ${tape(sheetX + Math.round(sheetW * 0.28), sheetY - 12, 200, -4)}
  ${tape(sheetX + Math.round(sheetW * 0.78), sheetY + sheetH - 14, 150, 5)}
  <text x="${textX}" y="${taglineY}" fill="${INK}" font-family="${SERIF}" font-size="${taglineSize}" font-weight="700" font-style="italic" letter-spacing="-1">Essays on the unfinished</text>
  <text x="${textX}" y="${taglineY + Math.round(taglineSize * 1.22)}" fill="${INK}" font-family="${SERIF}" font-size="${taglineSize}" font-weight="700" font-style="italic" letter-spacing="-1">work of being a man.</text>
  ${scribble(`M${textX + 4} ${taglineY + Math.round(taglineSize * 1.62)} q ${taglineSize * 2.6} ${taglineSize * 0.3} ${taglineSize * 5.3} 0`, RUST, Math.max(4, Math.round(band * 0.02)))}
  <text x="${textX + 2}" y="${bandTop + Math.round(band * 0.88)}" fill="${SMOKE}" font-family="${SANS}" font-size="${urlSize}" font-weight="900" letter-spacing="2.6">GROWNMENGROW.COM</text>
  <rect x="${chipX}" y="${chipY}" width="${chipW}" height="${chipH}" fill="${GREEN}" transform="rotate(1.4 ${chipX + chipW / 2} ${chipY + chipH / 2})"/>
  ${tape(chipX + Math.round(chipW * 0.32), chipY - 11, 110, -5)}
  <text x="${chipX + Math.round(chipW / 2)}" y="${chipY + Math.round(chipH * 0.42)}" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="${chipTextSize}" font-weight="900" letter-spacing="1.6" text-anchor="middle" transform="rotate(1.4 ${chipX + chipW / 2} ${chipY + chipH / 2})">ONE FIELD NOTE</text>
  <text x="${chipX + Math.round(chipW / 2)}" y="${chipY + Math.round(chipH * 0.78)}" fill="${PAPER_LIGHT}" font-family="${SANS}" font-size="${chipTextSize}" font-weight="900" letter-spacing="1.6" text-anchor="middle" transform="rotate(1.4 ${chipX + chipW / 2} ${chipY + chipH / 2})">A WEEK</text>
  ${scribble(`M${Math.round(width * 0.255)} ${bandTop + Math.round(band * 0.72)} q ${band * 0.09} ${-band * 0.16} ${band * 0.2} ${-band * 0.05} q ${band * 0.09} ${band * 0.09} ${band * 0.02} ${band * 0.14}`, RUST, Math.max(4, Math.round(band * 0.016)))}
  ${grain(width, height, id, 0.22)}
</svg>`;
}

// A single-line lettering mark for header "wordmark" slots (Substack renders
// these small, so it carries no tagline, panel, or texture — just the name).
function wordmarkStrip({id, width, height}) {
  const size = Math.round(height * 0.46);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${defs(id)}
  <text x="${width / 2}" y="${Math.round(height * 0.66)}" fill="${OXBLOOD}" font-family="${SANS}" font-size="${size}" font-weight="900" text-anchor="middle" letter-spacing="6">GROWN MEN GROW</text>
</svg>`;
}

const targets = [
  {name: "ghost-publication-cover", width: 2000, height: 840},
  {name: "social-banner-wide", width: 1584, height: 396},
];

for (const target of targets) {
  writeAsset("brand/banners", target.name, banner({id: target.name, width: target.width, height: target.height}));
}
writeAsset("brand/banners", "linkedin-banner", taglineBanner({id: "linkedin-banner", width: 1584, height: 396, band: 268}));
// Bluesky's profile header displays the 3:1 upload center-cropped to roughly
// 4:1 depending on viewport, so content stays inside a ~350px center band.
writeAsset("brand/banners", "bluesky-banner", taglineBanner({id: "bluesky-banner", width: 1500, height: 500, band: 350, taglineFactor: 0.18, textXFactor: 0.3}));
// Substack caps wordmark uploads at a 21:4 aspect ratio.
writeAsset("brand/banners", "substack-wordmark", wordmarkStrip({id: "substack-wordmark", width: 1400, height: 280}));

console.log(`Rendered ${targets.length + 3} brand banner SVG and PNG pairs.`);
