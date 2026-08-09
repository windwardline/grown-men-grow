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
  'scripts/render-ghost-feature-images.mjs',
  'scripts/render-instagram-pinned-intro.mjs',
  'scripts/render-launch-graphics.mjs',
  'scripts/render-profile-avatar.mjs',
  'scripts/render-review-contact-sheets.mjs',
  'scripts/render-theme-preview.mjs',
  'scripts/lib/editorial-collage.mjs',
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
await validateAssetFamily('assets/drafts/ghost/social-cards', 4, 1200, 630);
await validateAssetFamily('assets/drafts/ghost/feature-images', 3, 1600, 1000);
await validateEditorialConcepts();
await validateNamedPngs('assets/source/editorial', new Map([
  ['friends-in-conversation', { width: 1023, height: 1537 }],
  ['repairing-wooden-chair', { width: 1024, height: 1536 }],
  ['sunlit-writing-table', { width: 1024, height: 1536 }],
]));
await validateNamedPngs('assets/drafts/review', new Map([
  ['foundational-carousel', { width: 1362, height: 1004 }],
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

// Instagram surfaces stay brand-led: the founder's name may not appear in
// Instagram copy or any Instagram-facing rendered asset. Ghost-surface assets
// (feature images, social cards) may credit the writer.
const instagramFacing = (item) =>
  item.startsWith('content/instagram/')
  || (item.endsWith('.svg') && item.startsWith('assets/') && (
    item.includes('instagram')
    || /(?:^|\/)(?:carousel-spread|story-cover)\.svg$/.test(item)
  ));
for (const file of tracked.filter(instagramFacing)) {
  await checkTextPolicy(path.join(root, file), /peacock/i, 'the Instagram founder-identity rule');
}

if (failures.length) {
  console.error('Repository verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Verified ${tracked.length} tracked files, ${scriptFiles.length} JavaScript files, the Ghost theme contract, 35 launch PNG/SVG pairs, five review sheets, three editorial source images, and five editorial concept pairs.`);
