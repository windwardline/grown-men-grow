import fs from "node:fs";
import path from "node:path";

const ROOT = "/Users/peacock/Projects/grown-men-grow";
const OUTPUT = path.join(ROOT, "assets/drafts/instagram/pinned-introduction");
const AVATAR = path.join(ROOT, "assets/source/grown-men-grow-instagram-avatar.png");

const OXBLOOD = "#3A1518";
const IVORY = "#F2EBDD";
const WIDTH = 1080;
const HEIGHT = 1350;

fs.mkdirSync(OUTPUT, { recursive: true });

function escapeXml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
  return value.replace(/[&<>]/g, (character) => entities[character]);
}

function linesSvg(lines, { x = 90, y, size, leading, family, weight = 700, style = "normal", fill }) {
  return `<text x="${x}" y="${y}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" letter-spacing="-1.4">${lines
    .map((line, index) => `<tspan x="${x}" dy="${index === 0 ? 0 : leading}">${escapeXml(line)}</tspan>`)
    .join("")}</text>`;
}

function frame({ number, background, foreground, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${background}"/>
  <rect x="32" y="32" width="1016" height="1286" rx="2" fill="none" stroke="${foreground}" stroke-opacity="0.18" stroke-width="2"/>
  <text x="90" y="112" fill="${foreground}" font-family="Helvetica Neue, Arial, sans-serif" font-size="25" font-weight="700" letter-spacing="2.4">GROWN MEN GROW</text>
  <text x="990" y="112" text-anchor="end" fill="${foreground}" font-family="Helvetica Neue, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="1.8">${String(number).padStart(2, "0")} / 07</text>
  <line x1="90" y1="154" x2="990" y2="154" stroke="${foreground}" stroke-opacity="0.38" stroke-width="2"/>
  ${body}
  <circle cx="90" cy="1252" r="7" fill="${foreground}"/>
  <text x="114" y="1261" fill="${foreground}" font-family="Helvetica Neue, Arial, sans-serif" font-size="21" font-weight="600" letter-spacing="1.5">@GROWNMENGROW</text>
</svg>`;
}

const avatarBase64 = fs.readFileSync(AVATAR).toString("base64");
const slide1 = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
  <rect width="${WIDTH}" height="${HEIGHT}" fill="${OXBLOOD}"/>
  <image href="data:image/png;base64,${avatarBase64}" x="0" y="135" width="1080" height="1080"/>
</svg>`;

const slides = [
  slide1,
  frame({
    number: 2,
    background: IVORY,
    foreground: OXBLOOD,
    body: linesSvg(["Most of us learned", "how to look like men", "before we learned", "how to live as one."], {
      y: 398,
      size: 82,
      leading: 111,
      family: "Georgia, Times New Roman, serif",
      fill: OXBLOOD,
    }),
  }),
  frame({
    number: 3,
    background: OXBLOOD,
    foreground: IVORY,
    body: `${linesSvg(["A lot of that training", "was useful."], {
      y: 330,
      size: 72,
      leading: 96,
      family: "Georgia, Times New Roman, serif",
      weight: 400,
      fill: IVORY,
    })}
    <line x1="90" y1="590" x2="430" y2="590" stroke="${IVORY}" stroke-width="9"/>
    ${linesSvg(["Some of it was just", "fear with good posture."], {
      y: 770,
      size: 82,
      leading: 105,
      family: "Helvetica Neue, Arial, sans-serif",
      weight: 800,
      fill: IVORY,
    })}`,
  }),
  frame({
    number: 4,
    background: IVORY,
    foreground: OXBLOOD,
    body: `${linesSvg(["I still believe", "in strength."], {
      y: 330,
      size: 104,
      leading: 120,
      family: "Helvetica Neue, Arial, sans-serif",
      weight: 800,
      fill: OXBLOOD,
    })}
    ${linesSvg(["I just no longer think", "looking strong tells us", "much about a man."], {
      y: 735,
      size: 65,
      leading: 91,
      family: "Georgia, Times New Roman, serif",
      weight: 400,
      fill: OXBLOOD,
    })}`,
  }),
  frame({
    number: 5,
    background: OXBLOOD,
    foreground: IVORY,
    body: `${linesSvg(["This is about the", "unfinished work", "of being a man."], {
      y: 318,
      size: 78,
      leading: 103,
      family: "Georgia, Times New Roman, serif",
      weight: 700,
      fill: IVORY,
    })}
    ${linesSvg(["No gurus.", "No gender war."], {
      y: 825,
      size: 92,
      leading: 112,
      family: "Helvetica Neue, Arial, sans-serif",
      weight: 800,
      fill: IVORY,
    })}`,
  }),
  frame({
    number: 6,
    background: IVORY,
    foreground: OXBLOOD,
    body: `${linesSvg(["One field note", "each week."], {
      y: 330,
      size: 86,
      leading: 108,
      family: "Georgia, Times New Roman, serif",
      weight: 700,
      fill: OXBLOOD,
    })}
    <text x="90" y="655" fill="${OXBLOOD}" font-family="Helvetica Neue, Arial, sans-serif" font-size="26" font-weight="700" letter-spacing="3.2">START WITH</text>
    ${linesSvg(["Strength Has to", "Grow Up"], {
      y: 790,
      size: 101,
      leading: 116,
      family: "Helvetica Neue, Arial, sans-serif",
      weight: 800,
      fill: OXBLOOD,
    })}`,
  }),
  frame({
    number: 7,
    background: OXBLOOD,
    foreground: IVORY,
    body: linesSvg(["Link in bio."], {
      y: 660,
      size: 116,
      leading: 120,
      family: "Helvetica Neue, Arial, sans-serif",
      weight: 800,
      fill: IVORY,
    }),
  }),
];

slides.forEach((svg, index) => {
  const number = String(index + 1).padStart(2, "0");
  fs.writeFileSync(path.join(OUTPUT, `${number}.svg`), svg);
});

console.log(`Rendered ${slides.length} SVG drafts to ${OUTPUT}`);
