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

const files = [
    'assets',
    'partials',
    'author.hbs',
    'default.hbs',
    'error.hbs',
    'index.hbs',
    'page-about.hbs',
    'page-start-here.hbs',
    'page.hbs',
    'post.hbs',
    'tag.hbs',
    'package.json',
    'README.md',
];

const result = spawnSync('zip', ['-q', '-r', destination, ...files], {
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
