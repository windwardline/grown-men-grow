import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { extractNote, resolvePackForSlug, noteCopyForSlug } from '../lib/note-pack.mjs';

const distribution = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..', 'content', 'distribution');

const PACK = [
  '# Substack Notes',
  '',
  'Do not import the Ghost subscriber list or publish the complete essay as a Substack post.',
  '',
  '## Note 1',
  '',
  'First line of note one.',
  '',
  'Second line of note one.',
  '',
  '## Note 2',
  '',
  'Note two body.',
  '',
  '## Note 3 — canonical link',
  '',
  'Note three body. [canonical link]',
  '',
  '# Instagram',
  '',
  'Not a note at all.',
  '',
].join('\n');

test('a note is extracted without its heading, its neighbours, or the preamble', () => {
  assert.equal(extractNote(PACK, 1), 'First line of note one.\n\nSecond line of note one.');
  assert.equal(extractNote(PACK, 2), 'Note two body.');
});

test('the last note stops at the next top-level section', () => {
  assert.equal(extractNote(PACK, 3), 'Note three body. [canonical link]');
});

test('a missing note is refused rather than returning empty copy', () => {
  assert.throws(() => extractNote(PACK, 4), /Note 4/);
  assert.throws(() => extractNote('# Instagram\n\nbody\n', 1), /Substack Notes/);
});

test('a Substack Notes section with no body under the heading is refused', () => {
  assert.throws(() => extractNote('# Substack Notes\n\n## Note 1\n\n## Note 2\n\nbody\n', 1), /empty/i);
});

test('note numbers must be real note numbers', () => {
  for (const n of [0, -1, 1.5, '1', null]) {
    assert.throws(() => extractNote(PACK, n), /note number/i);
  }
});

// The two frontmatter spellings in the live repository. essay-01-launch.md uses
// `canonical_url:`; the field-note packs use `canonical:` with a trailing
// parenthetical. A matcher that knew only one of them would silently find no
// pack for half the catalogue.
test('both canonical frontmatter spellings resolve', (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'gmg-packs-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(path.join(dir, 'a.md'), '---\ncanonical_url: https://grownmengrow.com/alpha/\n---\n');
  writeFileSync(path.join(dir, 'b.md'), '---\ncanonical: https://grownmengrow.com/beta/ (live only after launch)\n---\n');
  assert.equal(path.basename(resolvePackForSlug({ slug: 'alpha', dir })), 'a.md');
  assert.equal(path.basename(resolvePackForSlug({ slug: 'beta', dir })), 'b.md');
});

test('an unknown slug and an ambiguous slug both refuse', (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'gmg-packs-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(path.join(dir, 'a.md'), '---\ncanonical: https://grownmengrow.com/same/\n---\n');
  assert.throws(() => resolvePackForSlug({ slug: 'nothing-here', dir }), /No distribution pack/);
  writeFileSync(path.join(dir, 'b.md'), '---\ncanonical: https://grownmengrow.com/same/\n---\n');
  assert.throws(() => resolvePackForSlug({ slug: 'same', dir }), /more than one/i);
});

test('a slug is matched whole, never as a prefix of a longer one', (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'gmg-packs-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(path.join(dir, 'long.md'), '---\ncanonical: https://grownmengrow.com/rest-is-not-a-reward-yet/\n---\n');
  assert.throws(() => resolvePackForSlug({ slug: 'rest-is-not-a-reward', dir }), /No distribution pack/);
});

// Against the real content, so a rename or a reordering of the catalogue fails
// here rather than at noon on a Tuesday.
test('the live catalogue resolves the slugs the note tasks actually use', () => {
  assert.equal(
    path.basename(resolvePackForSlug({ slug: 'call-your-friends-before-theres-a-reason', dir: distribution })),
    'field-note-02-platforms.md',
  );
  assert.equal(
    path.basename(resolvePackForSlug({ slug: 'strength-has-to-grow-up', dir: distribution })),
    'essay-01-launch.md',
  );
});

test('the note posted on 2026-08-18 is what the pack still yields', () => {
  const copy = noteCopyForSlug({ slug: 'call-your-friends-before-theres-a-reason', note: 1, dir: distribution });
  assert.equal(
    copy,
    'Doing something together counts as intimacy for many men. The job matters, but so does the side-by-side arrangement. Nobody has to maintain eye contact while finding the sentence.',
  );
});
