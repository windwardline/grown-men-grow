import fs from "node:fs";
import path from "node:path";

const ROOT = "/Users/peacock/Projects/grown-men-grow";
const OUTPUT = path.join(ROOT, "assets/drafts");

const OXBLOOD = "#3A1518";
const IVORY = "#F2EBDD";
const PORTRAIT = { width: 1080, height: 1350 };
const STORY = { width: 1080, height: 1920 };
const SOCIAL = { width: 1200, height: 630 };
const SANS = "Helvetica Neue, Arial, sans-serif";
const SERIF = "Georgia, Times New Roman, serif";

function escapeXml(value) {
  const entities = { "&": "&amp;", "<": "&lt;", ">": "&gt;" };
  return value.replace(/[&<>]/g, (character) => entities[character]);
}

function textLines(
  lines,
  {
    x = 90,
    y,
    size,
    leading,
    family = SERIF,
    weight = 700,
    style = "normal",
    fill,
    letterSpacing = -1.4,
    anchor = "start",
  },
) {
  return `<text x="${x}" y="${y}" text-anchor="${anchor}" fill="${fill}" font-family="${family}" font-size="${size}" font-weight="${weight}" font-style="${style}" letter-spacing="${letterSpacing}">${lines
    .map(
      (line, index) =>
        `<tspan x="${x}" dy="${index === 0 ? 0 : leading}">${escapeXml(line)}</tspan>`,
    )
    .join("")}</text>`;
}

function strengthSlide({ number, background, foreground, body }) {
  const decoration =
    number % 3 === 1
      ? `<text x="1020" y="405" text-anchor="end" fill="${foreground}" fill-opacity="0.055" font-family="${SANS}" font-size="310" font-weight="800">${String(number).padStart(2, "0")}</text>`
      : number % 3 === 2
        ? `<rect x="0" y="0" width="18" height="1350" fill="${foreground}"/><rect x="38" y="0" width="3" height="1350" fill="${foreground}" fill-opacity="0.34"/>`
        : `<rect x="830" y="0" width="250" height="34" fill="${foreground}"/><rect x="960" y="34" width="120" height="120" fill="${foreground}" fill-opacity="0.1"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT.width}" height="${PORTRAIT.height}" viewBox="0 0 ${PORTRAIT.width} ${PORTRAIT.height}">
  <rect width="${PORTRAIT.width}" height="${PORTRAIT.height}" fill="${background}"/>
  ${decoration}
  <text x="90" y="92" fill="${foreground}" font-family="${SANS}" font-size="20" font-weight="700" letter-spacing="2.6">GROWN MEN GROW</text>
  <text x="90" y="128" fill="${foreground}" fill-opacity="0.62" font-family="${SANS}" font-size="17" font-weight="700" letter-spacing="2.1">FIELD NOTE 01</text>
  <text x="990" y="92" text-anchor="end" fill="${foreground}" font-family="${SANS}" font-size="20" font-weight="700" letter-spacing="1.8">${String(number).padStart(2, "0")} / 07</text>
  ${body}
  <text x="990" y="1270" text-anchor="end" fill="${foreground}" font-family="${SANS}" font-size="19" font-weight="700" letter-spacing="1.5">@GROWNMENGROW</text>
</svg>`;
}

function recognitionSlide({ number, background, foreground, body }) {
  const isDark = background === OXBLOOD;
  const marker = isDark
    ? `<text x="68" y="510" fill="${foreground}" fill-opacity="0.07" font-family="${SERIF}" font-size="430" font-weight="700">“</text>`
    : `<line x1="68" y1="190" x2="68" y2="1160" stroke="${foreground}" stroke-opacity="0.34" stroke-width="3"/><circle cx="68" cy="190" r="9" fill="${foreground}"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT.width}" height="${PORTRAIT.height}" viewBox="0 0 ${PORTRAIT.width} ${PORTRAIT.height}">
  <rect width="${PORTRAIT.width}" height="${PORTRAIT.height}" fill="${background}"/>
  ${marker}
  <text x="108" y="102" fill="${foreground}" font-family="${SANS}" font-size="19" font-weight="700" letter-spacing="1.8">GROWN MEN GROW</text>
  <text x="990" y="102" text-anchor="end" fill="${foreground}" font-family="${SANS}" font-size="19" font-weight="700" letter-spacing="1.8">${String(number).padStart(2, "0")} / 07</text>
  ${body}
  <text x="108" y="1265" fill="${foreground}" font-family="${SANS}" font-size="19" font-weight="700" letter-spacing="1.5">GROWN MEN GROW</text>
</svg>`;
}

function storyCanvas({ background, foreground, body, decoration = "" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${STORY.width}" height="${STORY.height}" viewBox="0 0 ${STORY.width} ${STORY.height}">
  <rect width="${STORY.width}" height="${STORY.height}" fill="${background}"/>
  ${decoration}
  ${body}
  <text x="90" y="1780" fill="${foreground}" font-family="${SANS}" font-size="22" font-weight="700" letter-spacing="1.8">@GROWNMENGROW</text>
</svg>`;
}

function socialCard({ background, foreground, body }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${SOCIAL.width}" height="${SOCIAL.height}" viewBox="0 0 ${SOCIAL.width} ${SOCIAL.height}">
  <rect width="${SOCIAL.width}" height="${SOCIAL.height}" fill="${background}"/>
  <rect x="28" y="28" width="1144" height="574" rx="2" fill="none" stroke="${foreground}" stroke-opacity="0.18" stroke-width="2"/>
  <text x="70" y="88" fill="${foreground}" font-family="${SANS}" font-size="23" font-weight="700" letter-spacing="2.4">GROWN MEN GROW</text>
  <line x1="70" y1="120" x2="1130" y2="120" stroke="${foreground}" stroke-opacity="0.38" stroke-width="2"/>
  ${body}
  <text x="70" y="565" fill="${foreground}" font-family="${SANS}" font-size="19" font-weight="600" letter-spacing="1.4">GROWNMENGROW.COM</text>
</svg>`;
}

function writeSet(relativeDirectory, svgs) {
  const directory = path.join(OUTPUT, relativeDirectory);
  fs.mkdirSync(directory, { recursive: true });
  svgs.forEach((svg, index) => {
    const number = String(index + 1).padStart(2, "0");
    fs.writeFileSync(path.join(directory, `${number}.svg`), svg);
  });
  return svgs.length;
}

function writeNamed(relativeDirectory, files) {
  const directory = path.join(OUTPUT, relativeDirectory);
  fs.mkdirSync(directory, { recursive: true });
  for (const [name, svg] of Object.entries(files)) {
    fs.writeFileSync(path.join(directory, `${name}.svg`), svg);
  }
  return Object.keys(files).length;
}

const foundational = [
  strengthSlide({
    number: 1,
    background: OXBLOOD,
    foreground: IVORY,
    body: textLines(["I still believe", "in strength."], {
      y: 500,
      size: 116,
      leading: 132,
      family: SANS,
      weight: 800,
      fill: IVORY,
    }),
  }),
  strengthSlide({
    number: 2,
    background: IVORY,
    foreground: OXBLOOD,
    body: `${textLines(["Courage.", "Discipline.", "Competence."], {
      y: 300,
      size: 82,
      leading: 96,
      family: SANS,
      weight: 800,
      fill: OXBLOOD,
    })}
    ${textLines(["The ability to stay steady", "when things get ugly."], {
      y: 710,
      size: 54,
      leading: 76,
      family: SERIF,
      weight: 400,
      fill: OXBLOOD,
    })}
    ${textLines(["I want more of that,", "not less."], {
      y: 990,
      size: 67,
      leading: 82,
      family: SANS,
      weight: 800,
      fill: OXBLOOD,
    })}`,
  }),
  strengthSlide({
    number: 3,
    background: OXBLOOD,
    foreground: IVORY,
    body: `${textLines(["But strength tells us", "what a man can do."], {
      y: 350,
      size: 75,
      leading: 96,
      family: SERIF,
      fill: IVORY,
    })}
    <line x1="90" y1="640" x2="430" y2="640" stroke="${IVORY}" stroke-width="9"/>
    ${textLines(["It does not tell us", "what he serves."], {
      y: 820,
      size: 84,
      leading: 106,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}`,
  }),
  strengthSlide({
    number: 4,
    background: IVORY,
    foreground: OXBLOOD,
    body: `${textLines(["You find that out", "when he is"], {
      y: 310,
      size: 68,
      leading: 86,
      family: SERIF,
      weight: 400,
      fill: OXBLOOD,
    })}
    ${textLines(["ashamed,", "rejected,", "frightened,", "or wrong."], {
      y: 590,
      size: 86,
      leading: 103,
      family: SANS,
      weight: 800,
      fill: OXBLOOD,
    })}`,
  }),
  strengthSlide({
    number: 5,
    background: OXBLOOD,
    foreground: IVORY,
    body: `${textLines(["Can he stay?"], {
      y: 320,
      size: 91,
      leading: 100,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}
    ${textLines(["Can he hear", "the truth?"], {
      y: 590,
      size: 78,
      leading: 96,
      family: SERIF,
      fill: IVORY,
    })}
    ${textLines(["Can he ask for help", "before the crisis belongs", "to everyone?"], {
      y: 890,
      size: 52,
      leading: 70,
      family: SANS,
      weight: 700,
      fill: IVORY,
      letterSpacing: -0.8,
    })}`,
  }),
  strengthSlide({
    number: 6,
    background: IVORY,
    foreground: OXBLOOD,
    body: textLines(["Strength has to", "grow with the rest", "of the man."], {
      y: 425,
      size: 88,
      leading: 112,
      family: SERIF,
      fill: OXBLOOD,
    }),
  }),
  strengthSlide({
    number: 7,
    background: OXBLOOD,
    foreground: IVORY,
    body: `${textLines(["THE FIRST FIELD NOTE"], {
      y: 350,
      size: 27,
      leading: 32,
      family: SANS,
      weight: 700,
      fill: IVORY,
      letterSpacing: 3.2,
    })}
    ${textLines(["Strength Has to", "Grow Up"], {
      y: 520,
      size: 104,
      leading: 120,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}
    ${textLines(["Link in bio."], {
      y: 925,
      size: 50,
      leading: 60,
      family: SERIF,
      weight: 400,
      style: "italic",
      fill: IVORY,
    })}`,
  }),
];

const recognition = [
  recognitionSlide({
    number: 1,
    background: IVORY,
    foreground: OXBLOOD,
    body: textLines(["A confession", "can still", "be selfish."], {
      y: 410,
      size: 106,
      leading: 122,
      family: SANS,
      weight: 800,
      fill: OXBLOOD,
    }),
  }),
  recognitionSlide({
    number: 2,
    background: OXBLOOD,
    foreground: IVORY,
    body: `${textLines(["Opening up matters."], {
      y: 390,
      size: 91,
      leading: 100,
      family: SERIF,
      fill: IVORY,
    })}
    <line x1="90" y1="620" x2="430" y2="620" stroke="${IVORY}" stroke-width="9"/>
    ${textLines(["Disclosure is not", "the same thing", "as repair."], {
      y: 800,
      size: 78,
      leading: 94,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}`,
  }),
  recognitionSlide({
    number: 3,
    background: IVORY,
    foreground: OXBLOOD,
    body: textLines(["A man can cry", "and still leave", "everyone else carrying", "what his tears mean."], {
      y: 360,
      size: 74,
      leading: 99,
      family: SERIF,
      fill: OXBLOOD,
    }),
  }),
  recognitionSlide({
    number: 4,
    background: OXBLOOD,
    foreground: IVORY,
    body: textLines(["He can tell the story", "first so nobody gets", "to tell it differently."], {
      y: 430,
      size: 78,
      leading: 105,
      family: SANS,
      weight: 800,
      fill: IVORY,
    }),
  }),
  recognitionSlide({
    number: 5,
    background: IVORY,
    foreground: OXBLOOD,
    body: `${textLines(["Vulnerability becomes real", "when it leaves room for", "the other person’s reaction."], {
      y: 320,
      size: 61,
      leading: 83,
      family: SERIF,
      fill: OXBLOOD,
    })}
    ${textLines(["Even the reaction", "he does not want."], {
      y: 780,
      size: 83,
      leading: 102,
      family: SANS,
      weight: 800,
      fill: OXBLOOD,
    })}`,
  }),
  recognitionSlide({
    number: 6,
    background: OXBLOOD,
    foreground: IVORY,
    body: `${textLines(["The pain can be real."], {
      y: 420,
      size: 81,
      leading: 96,
      family: SERIF,
      fill: IVORY,
    })}
    <line x1="90" y1="650" x2="430" y2="650" stroke="${IVORY}" stroke-width="9"/>
    ${textLines(["The arrangement can", "still be unfair."], {
      y: 840,
      size: 76,
      leading: 98,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}`,
  }),
  recognitionSlide({
    number: 7,
    background: IVORY,
    foreground: OXBLOOD,
    body: `${textLines(["MORE IN"], {
      y: 340,
      size: 27,
      leading: 32,
      family: SANS,
      weight: 700,
      fill: OXBLOOD,
      letterSpacing: 3.2,
    })}
    ${textLines(["Strength Has to", "Grow Up"], {
      y: 510,
      size: 104,
      leading: 120,
      family: SANS,
      weight: 800,
      fill: OXBLOOD,
    })}
    ${textLines(["Link in bio."], {
      y: 920,
      size: 50,
      leading: 60,
      family: SERIF,
      weight: 400,
      style: "italic",
      fill: OXBLOOD,
    })}`,
  }),
];

const staticPost = `<svg xmlns="http://www.w3.org/2000/svg" width="${PORTRAIT.width}" height="${PORTRAIT.height}" viewBox="0 0 ${PORTRAIT.width} ${PORTRAIT.height}">
  <rect width="${PORTRAIT.width}" height="${PORTRAIT.height}" fill="${OXBLOOD}"/>
  <text x="70" y="95" fill="${IVORY}" font-family="${SANS}" font-size="23" font-weight="700" letter-spacing="2.5">GROWN MEN GROW</text>
  <text x="1010" y="95" text-anchor="end" fill="${IVORY}" fill-opacity="0.62" font-family="${SANS}" font-size="18" font-weight="700" letter-spacing="2">FIELD NOTE</text>
  <text x="1070" y="1210" transform="rotate(-90 1070 1210)" fill="${IVORY}" fill-opacity="0.055" font-family="${SANS}" font-size="230" font-weight="800" letter-spacing="-6">POSTURE</text>
  ${textLines(["Some of what", "we called strength"], {
    x: 70,
    y: 365,
    size: 83,
    leading: 106,
    family: SERIF,
    fill: IVORY,
  })}
  <line x1="70" y1="650" x2="520" y2="650" stroke="${IVORY}" stroke-width="10"/>
  ${textLines(["was fear with", "good posture."], {
    x: 70,
    y: 850,
    size: 94,
    leading: 116,
    family: SANS,
    weight: 800,
    fill: IVORY,
  })}
  <text x="70" y="1270" fill="${IVORY}" font-family="${SANS}" font-size="20" font-weight="700" letter-spacing="1.6">@GROWNMENGROW</text>
</svg>`;

const stories = [
  storyCanvas({
    background: OXBLOOD,
    foreground: IVORY,
    decoration: `<text x="1010" y="640" text-anchor="end" fill="${IVORY}" fill-opacity="0.045" font-family="${SANS}" font-size="380" font-weight="800" letter-spacing="-12">NEW</text>
    <text x="90" y="210" fill="${IVORY}" font-family="${SANS}" font-size="24" font-weight="700" letter-spacing="2.7">GROWN MEN GROW</text>`,
    body: `${textLines(["I made a new thing."], {
      y: 590,
      size: 91,
      leading: 110,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}
    ${textLines(["It is called Grown Men Grow,", "which is either a thesis", "or a reminder."], {
      y: 900,
      size: 57,
      leading: 82,
      family: SERIF,
      weight: 400,
      fill: IVORY,
    })}`,
  }),
  storyCanvas({
    background: IVORY,
    foreground: IVORY,
    decoration: `<rect x="0" y="960" width="1080" height="960" fill="${OXBLOOD}"/>
    <text x="90" y="200" fill="${OXBLOOD}" font-family="${SANS}" font-size="24" font-weight="700" letter-spacing="2.7">GROWN MEN GROW</text>`,
    body: `${textLines(["One field note a week", "about the unfinished work", "of being a man."], {
      y: 430,
      size: 67,
      leading: 93,
      family: SERIF,
      fill: OXBLOOD,
    })}
    ${textLines(["No gurus.", "No gender war."], {
      y: 1190,
      size: 92,
      leading: 116,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}`,
  }),
  storyCanvas({
    background: OXBLOOD,
    foreground: IVORY,
    decoration: `<text x="990" y="520" text-anchor="end" fill="none" stroke="${IVORY}" stroke-opacity="0.12" stroke-width="4" font-family="${SANS}" font-size="430" font-weight="800">01</text>`,
    body: `${textLines(["THE FIRST ONE IS LIVE"], {
      y: 450,
      size: 29,
      leading: 36,
      family: SANS,
      weight: 700,
      fill: IVORY,
      letterSpacing: 3.2,
    })}
    ${textLines(["Strength Has to", "Grow Up"], {
      y: 720,
      size: 111,
      leading: 132,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}`,
  }),
  storyCanvas({
    background: IVORY,
    foreground: OXBLOOD,
    decoration: `<circle cx="910" cy="390" r="245" fill="none" stroke="${OXBLOOD}" stroke-opacity="0.08" stroke-width="70"/>
    <text x="90" y="200" fill="${OXBLOOD}" font-family="${SANS}" font-size="24" font-weight="700" letter-spacing="2.7">GROWN MEN GROW</text>`,
    body: `${textLines(["Which gets mistaken", "for strength", "most often?"], {
      y: 500,
      size: 81,
      leading: 105,
      family: SERIF,
      fill: OXBLOOD,
    })}
    <line x1="90" y1="1120" x2="990" y2="1120" stroke="${OXBLOOD}" stroke-opacity="0.1" stroke-width="3"/>
    <line x1="90" y1="1250" x2="990" y2="1250" stroke="${OXBLOOD}" stroke-opacity="0.1" stroke-width="3"/>
    <line x1="90" y1="1380" x2="990" y2="1380" stroke="${OXBLOOD}" stroke-opacity="0.1" stroke-width="3"/>`,
  }),
  storyCanvas({
    background: OXBLOOD,
    foreground: IVORY,
    decoration: `<text x="1010" y="1550" text-anchor="end" fill="${IVORY}" fill-opacity="0.045" font-family="${SERIF}" font-size="1180" font-weight="700">?</text>
    <text x="90" y="200" fill="${IVORY}" font-family="${SANS}" font-size="24" font-weight="700" letter-spacing="2.7">GROWN MEN GROW</text>`,
    body: `${textLines(["What did nobody", "teach you about", "becoming a man?"], {
      y: 500,
      size: 86,
      leading: 111,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}`,
  }),
];

const reelCover = `<svg xmlns="http://www.w3.org/2000/svg" width="${STORY.width}" height="${STORY.height}" viewBox="0 0 ${STORY.width} ${STORY.height}">
  <rect width="${STORY.width}" height="${STORY.height}" fill="${OXBLOOD}"/>
  <rect x="0" y="0" width="330" height="1920" fill="${IVORY}" fill-opacity="0.055"/>
  <rect x="58" y="300" width="964" height="1320" fill="none" stroke="${IVORY}" stroke-opacity="0.2" stroke-width="3"/>
  <text x="90" y="380" fill="${IVORY}" font-family="${SANS}" font-size="23" font-weight="700" letter-spacing="2.5">GROWN MEN GROW</text>
  ${textLines(["A man can", "look strong", "and still", "be hiding."], {
    x: 90,
    y: 650,
    size: 103,
    leading: 121,
    family: SANS,
    weight: 800,
    fill: IVORY,
  })}
  <text x="90" y="1370" fill="${IVORY}" font-family="${SERIF}" font-size="43" font-style="italic">Strength Has to Grow Up</text>
  <text x="90" y="1540" fill="${IVORY}" fill-opacity="0.62" font-family="${SANS}" font-size="19" font-weight="700" letter-spacing="1.9">FIELD NOTE 01</text>
</svg>`;

const socialCards = {
  publication: socialCard({
    background: OXBLOOD,
    foreground: IVORY,
    body: `${textLines(["Essays on the unfinished work", "of being a man."], {
      x: 70,
      y: 280,
      size: 64,
      leading: 82,
      family: SERIF,
      weight: 700,
      fill: IVORY,
    })}`,
  }),
  "start-here": socialCard({
    background: IVORY,
    foreground: OXBLOOD,
    body: `${textLines(["START HERE"], {
      x: 70,
      y: 190,
      size: 26,
      leading: 32,
      family: SANS,
      weight: 700,
      fill: OXBLOOD,
      letterSpacing: 3.2,
    })}
    ${textLines(["Most of us learned how to look", "like men before we learned", "how to live as one."], {
      x: 70,
      y: 285,
      size: 55,
      leading: 68,
      family: SERIF,
      fill: OXBLOOD,
    })}`,
  }),
  about: socialCard({
    background: OXBLOOD,
    foreground: IVORY,
    body: `${textLines(["ABOUT"], {
      x: 70,
      y: 190,
      size: 26,
      leading: 32,
      family: SANS,
      weight: 700,
      fill: IVORY,
      letterSpacing: 3.2,
    })}
    ${textLines(["Why Grown Men Grow exists", "and where the writing", "comes from."], {
      x: 70,
      y: 285,
      size: 60,
      leading: 72,
      family: SANS,
      weight: 800,
      fill: IVORY,
    })}`,
  }),
  "strength-has-to-grow-up": socialCard({
    background: IVORY,
    foreground: OXBLOOD,
    body: `${textLines(["Strength Has to Grow Up"], {
      x: 70,
      y: 260,
      size: 74,
      leading: 86,
      family: SANS,
      weight: 800,
      fill: OXBLOOD,
    })}
    ${textLines(["A man can look strong and still be hiding."], {
      x: 70,
      y: 385,
      size: 42,
      leading: 54,
      family: SERIF,
      weight: 400,
      style: "italic",
      fill: OXBLOOD,
    })}`,
  }),
};

let total = 0;
total += writeSet("instagram/foundational-carousel", foundational);
total += writeSet("instagram/recognition-carousel", recognition);
total += writeNamed("instagram/static-post", { "fear-with-good-posture": staticPost });
total += writeSet("instagram/launch-stories", stories);
total += writeNamed("instagram/reel", { "strength-has-to-grow-up-cover": reelCover });
total += writeNamed("ghost/social-cards", socialCards);

console.log(`Rendered ${total} SVG launch graphics to ${OUTPUT}`);
