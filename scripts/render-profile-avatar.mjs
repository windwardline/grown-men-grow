import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE_PNG = path.join(
  ROOT,
  "assets/source/grown-men-grow-instagram-avatar.png",
);
const BRAND_DIR = path.join(ROOT, "assets/brand");
const PREVIEW_DIR = path.join(ROOT, "assets/drafts/brand");

const SIZE = 1254;
const BACKGROUND = "#3A1518";

fs.mkdirSync(BRAND_DIR, { recursive: true });
fs.mkdirSync(PREVIEW_DIR, { recursive: true });

if (!fs.existsSync(SOURCE_PNG)) {
  throw new Error(`Missing canonical avatar source: ${SOURCE_PNG}`);
}

// The source PNG is the corrected, centered master. Keep the platform-safe
// brand copy synchronized without applying another positional adjustment.
fs.copyFileSync(
  SOURCE_PNG,
  path.join(BRAND_DIR, "grown-men-grow-profile-safe.png"),
);

const safeMaster = `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
  <rect width="${SIZE}" height="${SIZE}" fill="${BACKGROUND}"/>
  <image href="../source/grown-men-grow-instagram-avatar.png" x="0" y="0" width="${SIZE}" height="${SIZE}"/>
</svg>`;

const circlePreview = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8">
    <style>
      html, body {
        width: 720px;
        height: 720px;
        margin: 0;
        background: #111518;
        display: grid;
        place-items: center;
      }
      .avatar {
        width: 600px;
        height: 600px;
        border-radius: 50%;
        background: ${BACKGROUND} url("../../brand/grown-men-grow-profile-safe.png") center / cover no-repeat;
        box-shadow: 0 0 0 6px rgb(242 235 221 / 22%);
      }
    </style>
  </head>
  <body><div class="avatar"></div></body>
</html>`;

fs.writeFileSync(path.join(BRAND_DIR, "grown-men-grow-profile-safe.svg"), safeMaster);
fs.writeFileSync(path.join(PREVIEW_DIR, "grown-men-grow-profile-safe-circle.html"), circlePreview);

console.log("Synced the centered profile master and rendered its crop preview");
