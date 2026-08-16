#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { lstat, readFile, readdir } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const failures = [];

function fail(message) {
  failures.push(message);
}

function relative(file) {
  return path.relative(root, file).split(path.sep).join('/');
}

async function filesUnder(directory, extension) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  return entries
    .filter((entry) => entry.isFile() && entry.name.endsWith(extension))
    .map((entry) => path.join(root, directory, entry.name))
    .sort();
}

function trackedFiles() {
  const result = spawnSync('git', ['ls-files', '-z'], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`git ls-files failed: ${result.stderr.trim()}`);
    return [];
  }
  return result.stdout.split('\0').filter(Boolean);
}

function checkNodeSyntax(file) {
  const result = spawnSync(process.execPath, ['--check', file], { cwd: root, encoding: 'utf8' });
  if (result.status !== 0) {
    fail(`${relative(file)} failed node --check: ${result.stderr.trim()}`);
  }
}

async function pngDimensions(file) {
  const buffer = await readFile(file);
  const signature = '89504e470d0a1a0a';
  if (buffer.length < 24 || buffer.subarray(0, 8).toString('hex') !== signature) {
    fail(`${relative(file)} is not a valid PNG header.`);
    return null;
  }
  return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
}

async function validateAssetFamily(directory, count, width, height) {
  const pngs = await filesUnder(directory, '.png');
  const svgs = await filesUnder(directory, '.svg');
  if (pngs.length !== count) fail(`${directory} has ${pngs.length} PNG files; expected ${count}.`);
  if (svgs.length !== count) fail(`${directory} has ${svgs.length} SVG files; expected ${count}.`);

  const svgNames = new Set(svgs.map((file) => path.basename(file, '.svg')));
  for (const png of pngs) {
    const name = path.basename(png, '.png');
    if (!svgNames.has(name)) fail(`${relative(png)} has no matching SVG source.`);
    const dimensions = await pngDimensions(png);
    if (dimensions && (dimensions.width !== width || dimensions.height !== height)) {
      fail(`${relative(png)} is ${dimensions.width}x${dimensions.height}; expected ${width}x${height}.`);
    }
  }
}

async function validateEditorialConcepts() {
  const directory = 'assets/concepts/editorial-collage-v1';
  const expected = new Map([
    ['ghost-feature-hero', { width: 1600, height: 1000 }],
    ['instagram-cover', { width: 1080, height: 1350 }],
    ['carousel-spread', { width: 1080, height: 1350 }],
    ['story-cover', { width: 1080, height: 1920 }],
    ['social-card', { width: 1200, height: 630 }],
  ]);
  const pngs = await filesUnder(directory, '.png');
  const svgs = await filesUnder(directory, '.svg');

  if (pngs.length !== expected.size) {
    fail(`${directory} has ${pngs.length} PNG files; expected ${expected.size}.`);
  }
  if (svgs.length !== expected.size) {
    fail(`${directory} has ${svgs.length} SVG files; expected ${expected.size}.`);
  }

  const svgNames = new Set(svgs.map((file) => path.basename(file, '.svg')));
  for (const [name, dimensions] of expected) {
    const png = pngs.find((file) => path.basename(file, '.png') === name);
    if (!png) {
      fail(`${directory} is missing ${name}.png.`);
      continue;
    }
    if (!svgNames.has(name)) fail(`${relative(png)} has no matching SVG source.`);
    const actual = await pngDimensions(png);
    if (actual && (actual.width !== dimensions.width || actual.height !== dimensions.height)) {
      fail(`${relative(png)} is ${actual.width}x${actual.height}; expected ${dimensions.width}x${dimensions.height}.`);
    }
  }
}

async function validateNamedPngs(directory, expected) {
  const pngs = await filesUnder(directory, '.png');
  if (pngs.length !== expected.size) {
    fail(`${directory} has ${pngs.length} PNG files; expected ${expected.size}.`);
  }

  for (const [name, dimensions] of expected) {
    const file = pngs.find((item) => path.basename(item, '.png') === name);
    if (!file) {
      fail(`${directory} is missing ${name}.png.`);
      continue;
    }
    const actual = await pngDimensions(file);
    if (actual && (actual.width !== dimensions.width || actual.height !== dimensions.height)) {
      fail(`${relative(file)} is ${actual.width}x${actual.height}; expected ${dimensions.width}x${dimensions.height}.`);
    }
  }
}

// Feed-tile distinctness (added 2026-08-16 after a live repeat).
//
// The per-article image rule permits one article's photographs to travel across
// that article's own surfaces, and the founder approved exactly that for the
// Essay 1 launch set. What it does not permit is two posts landing in the grid
// as the same picture. The visual system states it directly: "No two
// consecutive feed covers should share the same skeleton."
//
// Only the first slide of a carousel becomes a grid tile, so that is what is
// compared, alongside every standalone feed asset. Stories are excluded — they
// never enter the grid. Two tiles collide when they place the SAME source
// photograph in effectively the SAME rectangle; the measure is intersection
// over union of the two placements, which is why a few pixels of difference
// cannot launder a repeat. Text and colour are deliberately not compared: the
// grid is read at thumbnail size, where the photograph is the whole signal.
const TILE_IOU_LIMIT = 0.75;

// Empty, and it should stay that way. One entry lived here on 2026-08-16 for the
// Recognition cover and the launch static post, which shared a photograph at
// overlap 0.88 and both reached the grid. The founder authorised recomposing the
// static post, so the repeat was removed rather than permanently excepted: that
// post now carries a different photograph and an inverted skeleton. An entry
// here is a repeat somebody decided to live with, not a repeat somebody fixed.
const KNOWN_TILE_REPEATS = new Set([]);

function tilePlacements(text) {
  return [...text.matchAll(
    /<image href="\/assets\/source\/([^"]+)" x="([-\d.]+)" y="([-\d.]+)" width="([\d.]+)" height="([\d.]+)"/g,
  )].map((match) => ({
    photo: match[1],
    x: Number(match[2]),
    y: Number(match[3]),
    width: Number(match[4]),
    height: Number(match[5]),
  }));
}

function placementOverlap(a, b) {
  const overlapWidth = Math.max(0, Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x));
  const overlapHeight = Math.max(0, Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  const intersection = overlapWidth * overlapHeight;
  const union = a.width * a.height + b.width * b.height - intersection;
  return union === 0 ? 0 : intersection / union;
}

// A single-asset feed post is one photograph, full stop — there is no sequence to
// carry it, so if that photograph is already anywhere else on the feed the whole
// post reads as a repeat. This is the defect that reached the grid twice on
// 2026-08-16: first with the Recognition cover's photograph, then with one that
// no other COVER used but that was already inside three posted carousels.
//
// Carousels are deliberately exempt. A carousel is one narrative unit and may
// reuse its own article's photography across its slides; the launch set does so
// by founder approval. Stories and Reel covers are exempt too — different
// surface, different crop discipline. The rule is 1080x1350 single-asset only.
// Forward visual rule (founder-ruled 2026-08-16): every separately published
// public asset must be visually its own. A photograph belongs to at most ONE
// Instagram asset. Repeats WITHIN an asset stay fine — a carousel is one
// narrative unit and may use its article's photography across its own slides.
//
// The founder ruled that what is already public stands as-is, so the four posted
// Essay 1 launch families are grandfathered against each other and only against
// each other. Essay 1 has three photographs and five Instagram assets were cut
// from them, which is the arithmetic that produced two live repeats; the ruling
// stops that recurring rather than rewriting what already shipped.
//
// An unposted asset sharing a photograph with ANY other asset fails, including
// with a grandfathered one. That is the whole point of the ruling being forward.
const GRANDFATHERED_LAUNCH_FAMILIES = new Set([
  'pinned-introduction',
  'foundational-carousel',
  'recognition-carousel',
  'launch-stories',
]);

async function validatePhotographExclusivity(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const owners = new Map();
  for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const svgs = await filesUnder(`${directory}/${entry.name}`, '.svg');
    for (const file of svgs) {
      for (const placement of tilePlacements(await readFile(file, 'utf8'))) {
        if (!owners.has(placement.photo)) owners.set(placement.photo, new Set());
        owners.get(placement.photo).add(entry.name);
      }
    }
  }

  if (!owners.size) {
    fail(`${directory} yielded no photographs; the exclusivity check examined nothing.`);
    return;
  }

  for (const [photo, families] of owners) {
    if (families.size < 2) continue;
    const outside = [...families].filter((name) => !GRANDFATHERED_LAUNCH_FAMILIES.has(name));
    if (!outside.length) continue;
    fail(
      `${photo} appears in ${[...families].sort().join(', ')}. A photograph belongs to one published asset only `
      + `(founder ruling 2026-08-16); ${outside.sort().join(', ')} ${outside.length === 1 ? 'is' : 'are'} not covered by the `
      + 'grandfathered Essay 1 launch set. Give the asset photography of its own or make it type-led.',
    );
  }
}

async function validateSingleAssetFeedPosts(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const families = [];
  for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const svgs = await filesUnder(`${directory}/${entry.name}`, '.svg');
    if (!svgs.length) continue;
    const photos = [];
    for (const file of svgs) {
      for (const placement of tilePlacements(await readFile(file, 'utf8'))) photos.push(placement.photo);
    }
    families.push({ name: entry.name, count: svgs.length, photos, files: svgs });
  }

  for (const family of families) {
    if (family.count !== 1) continue;
    const png = (await filesUnder(`${directory}/${family.name}`, '.png'))[0];
    const size = png ? await pngDimensions(png) : null;
    if (!size || size.width !== 1080 || size.height !== 1350) continue;
    for (const photo of family.photos) {
      const alsoIn = families
        .filter((other) => other.name !== family.name && other.photos.includes(photo))
        .map((other) => other.name);
      if (alsoIn.length) {
        fail(
          `${directory}/${family.name} is a single-image feed post carrying ${photo}, which already appears in ${alsoIn.join(', ')}. `
          + 'A one-image post has no sequence to carry it, so a photograph used elsewhere makes the whole post a repeat — '
          + 'give it a photograph of its own or make it type-only.',
        );
      }
    }
  }
}

async function validateFeedTileDistinctness(directory) {
  const entries = await readdir(path.join(root, directory), { withFileTypes: true });
  const tiles = [];
  for (const entry of entries.filter((item) => item.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name === 'launch-stories') continue;
    const svgs = await filesUnder(`${directory}/${entry.name}`, '.svg');
    if (!svgs.length) continue;
    // A carousel contributes only its cover; a standalone family contributes all of it.
    for (const file of svgs.length === 1 ? svgs : [svgs[0]]) {
      tiles.push({ name: relative(file), placements: tilePlacements(await readFile(file, 'utf8')) });
    }
  }

  if (tiles.length < 2) {
    fail(`${directory} produced ${tiles.length} feed tiles; the distinctness check examined nothing.`);
    return;
  }

  for (let i = 0; i < tiles.length; i += 1) {
    for (let j = i + 1; j < tiles.length; j += 1) {
      for (const a of tiles[i].placements) {
        for (const b of tiles[j].placements) {
          if (a.photo !== b.photo) continue;
          const overlap = placementOverlap(a, b);
          if (overlap < TILE_IOU_LIMIT) continue;
          const key = `${tiles[i].name.replace('assets/drafts/', '')}::${tiles[j].name.replace('assets/drafts/', '')}`;
          if (KNOWN_TILE_REPEATS.has(key)) continue;
          fail(
            `${tiles[i].name} and ${tiles[j].name} place ${a.photo} in the same frame `
            + `(overlap ${overlap.toFixed(2)} against a limit of ${TILE_IOU_LIMIT}); two feed tiles would read as one repeated image.`,
          );
        }
      }
    }
  }
}

function stripEmbeddedRaster(text) {
  return text.replace(/data:image\/png;base64,[^"]+/g, '');
}

async function checkTextPolicy(file, policy, label) {
  const raw = await readFile(file, 'utf8');
  const text = file.endsWith('.svg') ? stripEmbeddedRaster(raw) : raw;
  if (policy.test(text)) fail(`${relative(file)} violates ${label}.`);
}

const tracked = trackedFiles();
const forbiddenTracked = tracked.filter((file) =>
  /(^|\/)(codex_handoff_pack_v0_2|backups|private|evidence|legal|exports)(\/|$)/i.test(file)
  || /(^|\/)\.DS_Store$/i.test(file)
  || /\.pdf$/i.test(file)
  || (/^\.env(?:\.|$)/.test(file) && file !== '.env.example')
  || /(?:members|analytics).*\.csv$/i.test(file)
  || /\.ghost\.json$/i.test(file)
);
if (forbiddenTracked.length) fail(`Private or generated files are tracked: ${forbiddenTracked.join(', ')}`);

const requiredFiles = [
  'AGENTS.md',
  'CLAUDE.md',
  'README.md',
  'LICENSE',
  'SECURITY.md',
  '.github/dependabot.yml',
  '.github/workflows/ci.yml',
  '.github/workflows/security.yml',
  '.github/workflows/claude-review.yml',
  'scripts/verify-svg-xml.sh',
  'scripts/verify-ghost-theme.mjs',
  'scripts/verify-repository.mjs',
  'scripts/package-ghost-theme.mjs',
  'scripts/render-editorial-collage-concepts.mjs',
  'scripts/render-field-note-02.mjs',
  'scripts/render-field-note-03.mjs',
  'scripts/render-field-note-04.mjs',
  'scripts/render-field-note-05.mjs',
  'scripts/render-field-note-06.mjs',
  'scripts/render-field-note-07.mjs',
  'scripts/render-field-note-08.mjs',
  'scripts/render-field-note-09.mjs',
  'scripts/render-field-note-10.mjs',
  'scripts/render-field-note-11.mjs',
  'scripts/render-field-note-12.mjs',
  'scripts/render-brand-banners.mjs',
  'scripts/render-ghost-feature-images.mjs',
  'scripts/render-instagram-pinned-intro.mjs',
  'scripts/render-launch-graphics.mjs',
  'scripts/render-profile-avatar.mjs',
  'scripts/render-review-contact-sheets.mjs',
  'scripts/render-theme-preview.mjs',
  'scripts/lib/editorial-collage.mjs',
  'scripts/lib/ghost-admin.mjs',
  'theme/package.json',
  'theme/pnpm-lock.yaml',
  'theme/default.hbs',
  'theme/index.hbs',
  'theme/post.hbs',
  'docs/editorial-visual-system.md',
  'docs/technical/distribution-plan.md',
  'docs/technical/community-moderation.md',
  'assets/concepts/editorial-collage-v1/README.md',
  'assets/source/editorial/README.md',
  'drafts/README.md',
  'content/ghost/start-here.md',
  'content/ghost/about.md',
  'content/ghost/welcome-email.md',
  'content/ghost/essay-01-strength-has-to-grow-up.md',
  'content/instagram/launch-package.md',
  'content/field-notes/call-your-friends-before-theres-a-reason.md',
  'content/distribution/essay-01-launch.md',
];
for (const file of requiredFiles) {
  if (!tracked.includes(file)) fail(`Required tracked file is missing: ${file}`);
}
if (tracked.some((file) => file.startsWith('assets/concepts/editorial-v1/') || file === 'scripts/render-editorial-concepts.mjs')) {
  fail('The superseded dark editorial concept package must not remain in the active tree.');
}
if (tracked.includes('drafts/field-note-02-call-your-friends-before-theres-a-reason.md')) {
  fail('Approved Field Note 2 must live under content/, not drafts/.');
}

const launchPackage = await readFile(path.join(root, 'content/instagram/launch-package.md'), 'utf8');
const captionSource = launchPackage.split('\n## 8. Approved discovery classifications')[0];
const approvedTagLines = [
  '#MensGrowth #EmotionalMaturity #GrownMenGrow',
  '#HealthyMasculinity #EmotionalGrowth #GrownMenGrow',
  '#Accountability #EmotionalMaturity #GrownMenGrow',
  '#MensGrowth #SelfAwareness #GrownMenGrow',
  '#HealthyMasculinity #MensMentalHealth #GrownMenGrow',
];
const captionTagLines = captionSource.match(/^#[A-Za-z]+(?: #[A-Za-z]+){2}$/gm) ?? [];
if (captionTagLines.length !== approvedTagLines.length) {
  fail(`Instagram launch captions contain ${captionTagLines.length} three-tag lines; expected ${approvedTagLines.length}.`);
}
for (const tagLine of approvedTagLines) {
  if (!captionTagLines.includes(tagLine)) fail(`Instagram launch captions are missing the approved tag line: ${tagLine}`);
}

const claudePath = path.join(root, 'CLAUDE.md');
const claudeStat = await lstat(claudePath);
if (claudeStat.isSymbolicLink()) fail('CLAUDE.md must be the fleet-standard import file, not a symlink.');
if ((await readFile(claudePath, 'utf8')) !== '@AGENTS.md\n') fail('CLAUDE.md must contain exactly @AGENTS.md.');

const scriptFiles = tracked
  .filter((file) => file.startsWith('scripts/') && /\.(?:mjs|js)$/.test(file))
  .map((file) => path.join(root, file));
for (const script of scriptFiles) checkNodeSyntax(script);

const themeResult = spawnSync(process.execPath, ['scripts/verify-ghost-theme.mjs'], {
  cwd: root,
  encoding: 'utf8',
});
if (themeResult.status !== 0) {
  fail(`Ghost theme contract failed: ${(themeResult.stderr || themeResult.stdout).trim()}`);
}

await validateAssetFamily('assets/drafts/instagram/pinned-introduction', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/foundational-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/recognition-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/launch-stories', 5, 1080, 1920);
await validateAssetFamily('assets/drafts/instagram/static-post', 1, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/reel', 1, 1080, 1920);
await validateAssetFamily('assets/drafts/instagram/field-note-02-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-03-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-04-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-05-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-06-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-07-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-08-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-09-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-10-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-11-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/field-note-12-carousel', 7, 1080, 1350);
await validateFeedTileDistinctness('assets/drafts/instagram');
await validateSingleAssetFeedPosts('assets/drafts/instagram');
await validatePhotographExclusivity('assets/drafts/instagram');
await validateAssetFamily('assets/drafts/ghost/social-cards', 4, 1200, 630);
await validateAssetFamily('assets/drafts/ghost/feature-images', 14, 1600, 1000);
await validateEditorialConcepts();
await validateNamedPngs('assets/source/editorial', new Map([
  ['friends-in-conversation', { width: 1023, height: 1537 }],
  ['repairing-wooden-chair', { width: 1024, height: 1536 }],
  ['sunlit-writing-table', { width: 1024, height: 1536 }],
  ['cooking-breakfast-together', { width: 1024, height: 1536 }],
  ['doorway-running-shoes', { width: 1024, height: 1536 }],
  ['balcony-plant-care', { width: 1024, height: 1536 }],
  ['workbench-hand-tools', { width: 1024, height: 1536 }],
  ['walking-after-the-work', { width: 1024, height: 1536 }],
  ['deck-board-detail', { width: 1024, height: 1536 }],
  ['truck-tailgate-loading', { width: 1024, height: 1536 }],
  ['porch-coffee-pause', { width: 1024, height: 1536 }],
  ['garage-doorway-call', { width: 1024, height: 1536 }],
  ['oil-check-detail', { width: 1024, height: 1536 }],
  ['smoke-detector-battery', { width: 1024, height: 1536 }],
  ['hallway-duffel-set-down', { width: 1024, height: 1536 }],
  ['tool-bag-handoff', { width: 1024, height: 1536 }],
  ['porch-two-chairs', { width: 1024, height: 1536 }],
  ['hardware-counter-question', { width: 1024, height: 1536 }],
  ['open-wall-wiring', { width: 1024, height: 1536 }],
  ['paperwork-second-eyes', { width: 1024, height: 1536 }],
  ['detector-test-press', { width: 1024, height: 1536 }],
  ['breaker-panel-check', { width: 1024, height: 1536 }],
  ['kitchen-counter-pause', { width: 1024, height: 1536 }],
  ['hammock-midday-rest', { width: 1024, height: 1536 }],
  ['morning-armchair-mug', { width: 1024, height: 1536 }],
  ['truck-hood-map', { width: 1024, height: 1536 }],
  ['compass-in-hand', { width: 1024, height: 1536 }],
  ['pegboard-end-of-day', { width: 1024, height: 1536 }],
  ['trail-fork-daylight', { width: 1024, height: 1536 }],
  ['garden-beds-two-heights', { width: 1024, height: 1536 }],
  ['car-odometer-daylight', { width: 1024, height: 1536 }],
  ['photos-notebook-spread', { width: 1024, height: 1536 }],
  ['bp-cuff-notebook', { width: 1024, height: 1536 }],
  ['running-shoes-alarm', { width: 1024, height: 1536 }],
  ['cutting-board-vegetables', { width: 1024, height: 1536 }],
  ['base-plates-anchor-bolts', { width: 1024, height: 1536 }],
  ['punch-list-tailgate', { width: 1024, height: 1536 }],
  ['transfer-switch-cabinet', { width: 1024, height: 1536 }],
  ['restaurant-table-after-lunch', { width: 1024, height: 1536 }],
  ['sling-capacity-tag', { width: 1024, height: 1536 }],
  ['rigging-shackles-bench', { width: 1024, height: 1536 }],
  ['wall-calendar-kitchen', { width: 1024, height: 1536 }],
  ['driveway-hoop-late-afternoon', { width: 1024, height: 1536 }],
]));
await validateNamedPngs('assets/drafts/brand/banners', new Map([
  ['bluesky-banner', { width: 1500, height: 500 }],
  ['ghost-publication-cover', { width: 2000, height: 840 }],
  ['social-banner-wide', { width: 1584, height: 396 }],
  ['linkedin-banner', { width: 1584, height: 396 }],
  ['substack-wordmark', { width: 1400, height: 280 }],
]));
await validateNamedPngs('assets/drafts/review', new Map([
  ['foundational-carousel', { width: 1362, height: 1004 }],
  ['field-note-02-carousel', { width: 1362, height: 1004 }],
  ['field-note-03-carousel', { width: 1362, height: 1004 }],
  ['field-note-04-carousel', { width: 1362, height: 1004 }],
  ['field-note-05-carousel', { width: 1362, height: 1004 }],
  ['field-note-06-carousel', { width: 1362, height: 1004 }],
  ['field-note-07-carousel', { width: 1362, height: 1004 }],
  ['field-note-08-carousel', { width: 1362, height: 1004 }],
  ['field-note-09-carousel', { width: 1362, height: 1004 }],
  ['field-note-10-carousel', { width: 1362, height: 1004 }],
  ['field-note-11-carousel', { width: 1362, height: 1004 }],
  ['field-note-12-carousel', { width: 1362, height: 1004 }],
  ['ghost-social-cards', { width: 1310, height: 884 }],
  ['pinned-introduction', { width: 1362, height: 1004 }],
  ['recognition-carousel', { width: 1362, height: 1004 }],
  ['stories-static-reel', { width: 1242, height: 1214 }],
]));

const approvedAvatarHash = 'b46abba3e8658304ca260b57a2697a4ab8d2b638acdcbfe39f809c6dd61aa4ff';
const sourceAvatar = await readFile(path.join(root, 'assets/source/grown-men-grow-instagram-avatar.png'));
const brandAvatar = await readFile(path.join(root, 'assets/brand/grown-men-grow-profile-safe.png'));
const sourceHash = createHash('sha256').update(sourceAvatar).digest('hex');
const brandHash = createHash('sha256').update(brandAvatar).digest('hex');
if (sourceHash !== approvedAvatarHash) fail('The canonical avatar source no longer matches the founder-approved fingerprint.');
if (brandHash !== approvedAvatarHash) fail('The reusable brand avatar no longer matches the founder-approved fingerprint.');

const oldProjectPattern = new RegExp(['healthy', 'masculinity', 'project'].join('[ _-]'), 'i');
const textExtensions = new Set(['.md', '.mjs', '.js', '.json', '.yml', '.yaml', '.html', '.hbs', '.css', '.txt', '.svg']);
for (const file of tracked.filter((item) => textExtensions.has(path.extname(item)))) {
  await checkTextPolicy(path.join(root, file), oldProjectPattern, 'the obsolete project-name rule');
}

// The Gartner exclusion covers every surface whose text can reach the public:
// canonical copy, draft copy, rendered asset sources, the theme (its README
// ships inside the uploaded zip), and the renderer code whose copy strings
// generate the public graphics. Internal registers under docs/ and the
// verifier scripts record the rule itself and are deliberately out of scope.
const publicSurface = (item) =>
  ['content/', 'drafts/', 'assets/', 'theme/', 'scripts/render-', 'scripts/lib/'].some((prefix) => item.startsWith(prefix));
for (const file of tracked.filter((item) => publicSurface(item) && textExtensions.has(path.extname(item)))) {
  await checkTextPolicy(path.join(root, file), /gartner/i, 'the public Gartner exclusion');
}

// Publication voice (founder ruling 2026-08-10): the founder's name appears on
// no public surface — canonical copy, rendered asset sources, the theme, or
// renderer copy strings. Internal registers under docs/ stay out of scope.
for (const file of tracked.filter((item) => publicSurface(item) && textExtensions.has(path.extname(item)))) {
  await checkTextPolicy(path.join(root, file), /peacock/i, 'the publication-voice founder-identity rule');
}

// Round-closure rule (founder-ruled 2026-08-09): every piece carries a
// complete cross-platform pack and per-slide Instagram alt text.
// Pinterest (2026-08-09), Threads (2026-08-10), and Facebook (2026-08-10)
// were eliminated from the network by founder decision.
const packSections = ['# Medium', '# Bluesky', '# LinkedIn', '# Substack'];
const packs = new Map([
  ['Essay 1', 'content/distribution/essay-01-launch.md'],
  ['Field Note 2', 'content/distribution/field-note-02-platforms.md'],
  ['Field Note 3', 'content/distribution/field-note-03-platforms.md'],
  ['Field Note 4', 'content/distribution/field-note-04-platforms.md'],
  ['Field Note 5', 'content/distribution/field-note-05-platforms.md'],
  ['Field Note 6', 'content/distribution/field-note-06-platforms.md'],
  ['Field Note 7', 'content/distribution/field-note-07-platforms.md'],
  ['Field Note 8', 'content/distribution/field-note-08-platforms.md'],
  ['Field Note 9', 'content/distribution/field-note-09-platforms.md'],
  ['Field Note 10', 'content/distribution/field-note-10-platforms.md'],
  ['Field Note 11', 'content/distribution/field-note-11-platforms.md'],
]);
// Medium refuses a tag containing anything but letters, numbers, spaces, and
// dashes, and caps one at 25 characters. Observed live on 2026-08-13 while
// importing Essay 1: "Men's Health" was rejected at the publish dialog with
// "Tags only support letters, numbers, spaces and dashes." A pack that ships an
// unenterable tag is a defect nobody sees until the weekly import is already
// running, so it is caught here instead.
const mediumTagLabel = /^-\s*(?:Tags|Suggested topics):\s*/i;
const mediumTag = /^[A-Za-z0-9][A-Za-z0-9 -]*$/;
for (const [label, file] of packs) {
  const text = await readFile(path.join(root, file), 'utf8');
  const lines = text.split('\n');
  for (const section of packSections) {
    if (!lines.some((line) => line.startsWith(section))) {
      fail(`${file} is missing the ${section.slice(2)} section of ${label}'s platform pack.`);
    }
  }

  const mediumStart = lines.findIndex((line) => line.startsWith('# Medium'));
  if (mediumStart === -1) continue;
  const nextSection = lines.findIndex((line, index) => index > mediumStart && line.startsWith('# '));
  const mediumLines = lines.slice(mediumStart, nextSection === -1 ? lines.length : nextSection);
  const tagLine = mediumLines.find((line) => mediumTagLabel.test(line));
  if (!tagLine) {
    fail(`${file} does not list Medium tags for ${label}; the import slot has nothing to enter.`);
    continue;
  }
  const tags = tagLine
    .replace(mediumTagLabel, '')
    .split(',')
    .map((tag) => tag.replaceAll('**', '').trim())
    .filter(Boolean);
  if (tags.length > 5) {
    fail(`${file} lists ${tags.length} Medium tags for ${label}; Medium accepts five.`);
  }
  for (const tag of tags) {
    if (!mediumTag.test(tag)) {
      fail(`${file} lists the Medium tag "${tag}" for ${label}, which Medium refuses — tags accept only letters, numbers, spaces, and dashes.`);
    }
    if (tag.length > 25) {
      fail(`${file} lists the Medium tag "${tag}" for ${label} at ${tag.length} characters; Medium caps a tag at 25.`);
    }
  }
}
const altTexted = [
  'content/instagram/launch-package.md',
  'content/field-notes/call-your-friends-before-theres-a-reason.md',
  'content/field-notes/friendship-has-a-maintenance-schedule.md',
  'content/field-notes/a-confession-can-still-be-selfish.md',
  'content/field-notes/ask-for-help-while-its-still-cheap.md',
  'content/field-notes/anger-is-a-terrible-manager.md',
  'content/field-notes/rest-is-not-a-reward.md',
  'content/field-notes/you-cant-outwork-a-wrong-direction.md',
  'content/field-notes/comparison-is-a-bad-map.md',
  'content/field-notes/your-body-keeps-the-books.md',
];
for (const file of altTexted) {
  const text = await readFile(path.join(root, file), 'utf8');
  if (!/alt text/i.test(text)) fail(`${file} is missing its Instagram alt text section.`);
}

if (failures.length) {

  console.error('Repository verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Verified ${tracked.length} tracked files, ${scriptFiles.length} JavaScript files, the Ghost theme contract, 107 launch PNG/SVG pairs, sixteen review sheets, forty-three editorial source images, five brand banners, and five editorial concept pairs.`);
