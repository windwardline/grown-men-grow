#!/usr/bin/env node

import {mkdir, rm} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const themeRoot = path.join(root, 'theme');
const destination = path.join(root, 'dist', 'grown-men-grow.zip');

await mkdir(path.dirname(destination), {recursive: true});
await rm(destination, {force: true});

// Package every tracked theme file so a new template can never be silently
// omitted, and development files or untracked strays can never ship.
const listing = spawnSync('git', ['ls-files', '-z'], {cwd: themeRoot, encoding: 'utf8'});
if (listing.status !== 0) {
    console.error(`git ls-files failed: ${(listing.stderr || '').trim()}`);
    process.exit(1);
}
const excluded = new Set(['pnpm-lock.yaml', 'pnpm-workspace.yaml']);
const files = listing.stdout.split('\0').filter(Boolean).filter((file) => !excluded.has(file)).sort();
if (!files.includes('package.json') || !files.includes('default.hbs')) {
    console.error('Theme packaging refused: package.json or default.hbs is missing from the tracked theme tree.');
    process.exit(1);
}

const result = spawnSync('zip', ['-q', '-X', destination, ...files], {
    cwd: themeRoot,
    encoding: 'utf8',
});

if (result.error) {
    console.error(`Unable to run zip: ${result.error.message}`);
    process.exit(1);
}

if (result.status !== 0) {
    console.error(result.stderr.trim() || 'Theme packaging failed.');
    process.exit(result.status ?? 1);
}

console.log(`Packaged ${path.relative(root, destination)}.`);
