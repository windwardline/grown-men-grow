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
  const directory = 'assets/concepts/editorial-v1';
  const expected = new Map([
    ['ghost-feature-hero', { width: 1600, height: 1000 }],
    ['instagram-cover', { width: 1080, height: 1350 }],
    ['carousel-spread', { width: 1080, height: 1350 }],
    ['story-cover', { width: 1080, height: 1920 }],
    ['social-card', { width: 1200, height: 630 }],
  ]);
  const pngs = await filesUnder(directory, '.png');
  const svgs = await filesUnder(directory, '.svg');

  if (pngs.length !== expected.size + 1) {
    fail(`${directory} has ${pngs.length} PNG files; expected ${expected.size + 1}.`);
  }
  if (svgs.length !== expected.size) {
    fail(`${directory} has ${svgs.length} SVG files; expected ${expected.size}.`);
  }

  const source = pngs.find((file) => path.basename(file) === 'essay-01-hero-source.png');
  if (!source) {
    fail(`${directory} is missing essay-01-hero-source.png.`);
  } else {
    const dimensions = await pngDimensions(source);
    if (dimensions && (dimensions.width !== 1122 || dimensions.height !== 1402)) {
      fail(`${relative(source)} is ${dimensions.width}x${dimensions.height}; expected 1122x1402.`);
    }
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
  'scripts/render-editorial-concepts.mjs',
  'docs/editorial-visual-system.md',
  'content/ghost/start-here.md',
  'content/ghost/about.md',
  'content/ghost/welcome-email.md',
  'content/ghost/essay-01-strength-has-to-grow-up.md',
  'content/instagram/launch-package.md',
];
for (const file of requiredFiles) {
  if (!tracked.includes(file)) fail(`Required tracked file is missing: ${file}`);
}

const claudePath = path.join(root, 'CLAUDE.md');
const claudeStat = await lstat(claudePath);
if (claudeStat.isSymbolicLink()) fail('CLAUDE.md must be the fleet-standard import file, not a symlink.');
if ((await readFile(claudePath, 'utf8')) !== '@AGENTS.md\n') fail('CLAUDE.md must contain exactly @AGENTS.md.');

const scriptFiles = tracked
  .filter((file) => file.startsWith('scripts/') && /\.(?:mjs|js)$/.test(file))
  .map((file) => path.join(root, file));
for (const script of scriptFiles) checkNodeSyntax(script);

await validateAssetFamily('assets/drafts/instagram/pinned-introduction', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/foundational-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/recognition-carousel', 7, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/launch-stories', 5, 1080, 1920);
await validateAssetFamily('assets/drafts/instagram/static-post', 1, 1080, 1350);
await validateAssetFamily('assets/drafts/instagram/reel', 1, 1080, 1920);
await validateAssetFamily('assets/drafts/ghost/social-cards', 4, 1200, 630);
await validateEditorialConcepts();

const sourceAvatar = await readFile(path.join(root, 'assets/source/grown-men-grow-instagram-avatar.png'));
const brandAvatar = await readFile(path.join(root, 'assets/brand/grown-men-grow-profile-safe.png'));
const sourceHash = createHash('sha256').update(sourceAvatar).digest('hex');
const brandHash = createHash('sha256').update(brandAvatar).digest('hex');
if (sourceHash !== brandHash) fail('The canonical source and reusable brand avatar PNGs differ.');

const oldProjectPattern = new RegExp(['healthy', 'masculinity', 'project'].join('[ _-]'), 'i');
const textExtensions = new Set(['.md', '.mjs', '.js', '.json', '.yml', '.yaml', '.html', '.css', '.txt', '.svg']);
for (const file of tracked.filter((item) => textExtensions.has(path.extname(item)))) {
  await checkTextPolicy(path.join(root, file), oldProjectPattern, 'the obsolete project-name rule');
}

for (const file of tracked.filter((item) => item.startsWith('content/'))) {
  await checkTextPolicy(path.join(root, file), /\bGartner\b/i, 'the public Gartner exclusion');
}

for (const file of tracked.filter((item) => item.startsWith('content/instagram/') || (item.startsWith('assets/drafts/instagram/') && item.endsWith('.svg')))) {
  await checkTextPolicy(path.join(root, file), /\bMichael Peacock\b/i, 'the Instagram founder-identity rule');
}

if (failures.length) {
  console.error('Repository verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Verified ${tracked.length} tracked files, ${scriptFiles.length} JavaScript files, 32 launch PNGs, 32 matching launch SVG sources, and five editorial concept pairs.`);
