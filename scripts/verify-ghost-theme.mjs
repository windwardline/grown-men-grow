#!/usr/bin/env node

import {readFile, stat} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themeRoot = path.join(root, 'theme');
const failures = [];

const requiredFiles = [
  'package.json',
  'default.hbs',
  'index.hbs',
  'post.hbs',
  'page.hbs',
  'page-start-here.hbs',
  'page-about.hbs',
  'author.hbs',
  'tag.hbs',
  'error.hbs',
  'partials/card.hbs',
  'partials/feature-image.hbs',
  'assets/css/screen.css',
  'assets/js/main.js',
  'assets/fonts/OFL-Bodoni-Moda.txt',
  'assets/fonts/OFL-Barlow-Condensed.txt',
  'assets/fonts/OFL-Source-Serif-4.txt',
];

function fail(message) {
  failures.push(message);
}

async function exists(file) {
  try {
    return (await stat(file)).isFile();
  } catch {
    return false;
  }
}

async function read(relativePath) {
  return readFile(path.join(themeRoot, relativePath), 'utf8');
}

for (const relativePath of requiredFiles) {
  if (!(await exists(path.join(themeRoot, relativePath)))) {
    fail(`Missing theme file: ${relativePath}`);
  }
}

if (!failures.length) {
  const packageJson = JSON.parse(await read('package.json'));
  if (packageJson.name !== 'grown-men-grow') fail('Theme package name must be grown-men-grow.');
  if (packageJson.license !== 'UNLICENSED') fail('Theme package must remain proprietary.');
  if (packageJson.engines?.ghost !== '>=6.0.0') {
    fail('Theme package must require Ghost >=6.0.0; GScan validation and the live publication cover 6.x only.');
  }
  if (packageJson.config?.card_assets !== true) fail('Ghost card assets must be enabled.');
  if (Object.keys(packageJson.config?.custom ?? {}).length > 20) fail('Ghost permits at most 20 custom settings.');

  const defaultTemplate = await read('default.hbs');
  for (const token of ['{{ghost_head}}', '{{ghost_foot}}', '{{{body}}}', 'viewport', 'skip-link', '{{search}}']) {
    if (!defaultTemplate.includes(token)) fail(`default.hbs is missing ${token}.`);
  }
  if (!defaultTemplate.includes('max-image-preview:large')) {
    fail('default.hbs must permit large search and Discover image previews.');
  }
  if (!defaultTemplate.includes('@site.signup_url')) fail('default.hbs must use the Ghost signup URL.');

  const indexTemplate = await read('index.hbs');
  for (const token of ['{{#foreach posts}}', '{{> "card"', '{{pagination}}', 'signup-panel']) {
    if (!indexTemplate.includes(token)) fail(`index.hbs is missing ${token}.`);
  }

  const postTemplate = await read('post.hbs');
  for (const token of ['{{#post}}', '{{content}}', '{{> "feature-image"', '{{#foreach authors}}', '{{reading_time}}', '{{comments}}', 'Issue {{date format="YYYY.WW"}}']) {
    if (!postTemplate.includes(token)) fail(`post.hbs is missing ${token}.`);
  }

  const startHereTemplate = await read('page-start-here.hbs');
  for (const token of ['@page.show_title_and_feature_image', '{{#if feature_image}}', '{{> "feature-image"']) {
    if (!startHereTemplate.includes(token)) fail(`page-start-here.hbs is missing ${token}.`);
  }

  const featureImage = await read('partials/feature-image.hbs');
  for (const token of ['format="avif"', 'format="webp"', 'feature_image_alt', 'loading=']) {
    if (!featureImage.includes(token)) fail(`feature-image.hbs is missing ${token}.`);
  }
  if (!featureImage.includes('width="1600"') || !featureImage.includes('height="1000"')) {
    fail('feature-image.hbs must preserve the 8:5 editorial feature-image ratio.');
  }

  const css = await read('assets/css/screen.css');
  for (const token of [
    '--color-oxblood:',
    '--color-paper:',
    '--color-ink:',
    '@font-face',
    '@media (max-width:',
    '@media (prefers-reduced-motion: reduce)',
    ':focus-visible',
    'min-height: 44px',
    '.kg-width-wide',
    '.kg-width-full',
  ]) {
    if (!css.includes(token)) fail(`screen.css is missing ${token}.`);
  }
  if (/https?:\/\/fonts\./i.test(css)) fail('Theme fonts must be hosted locally.');

  const policyFiles = [...requiredFiles.filter((file) => /\.(?:hbs|css|js|json)$/.test(file)), 'README.md'];
  for (const relativePath of policyFiles) {
    const text = await read(relativePath);
    if (/\bGartner\b/i.test(text)) fail(`${relativePath} violates the Gartner exclusion.`);
    if (/healthy[ _-]masculinity[ _-]project/i.test(text)) fail(`${relativePath} uses the obsolete project name.`);
  }
}

if (failures.length) {
  console.error('Ghost theme verification failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`Verified ${requiredFiles.length} required Ghost theme files and the editorial theme contract.`);
