import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CANONICAL_ORIGIN, canonicalSlug, extractNote, resolvePackForSlug, noteCopyForSlug } from '../lib/note-pack.mjs';

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

test('markdown emphasis is removed, because Substack stores a note body as plain text', () => {
  const pack = '# Substack Notes\n\n## Note 1\n\nNever says *somebody covered for me* or **ever**.\n';
  assert.equal(extractNote(pack, 1), 'Never says somebody covered for me or ever.');
});

test('an asterisk that is not emphasis is left alone', () => {
  const pack = '# Substack Notes\n\n## Note 1\n\nTwo * three is six, and a footnote*.\n';
  assert.equal(extractNote(pack, 1), 'Two * three is six, and a footnote*.');
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

// verify-repository.mjs reads a pack's slug to hold its Medium subtitle to the
// essay's dek. It reads it here, so the gate and the note tasks can never
// disagree about which essay a pack belongs to.
test('canonicalSlug reads the slug from either frontmatter spelling', () => {
  assert.equal(canonicalSlug('---\ncanonical_url: https://grownmengrow.com/alpha/\n---\n'), 'alpha');
  assert.equal(canonicalSlug('---\ncanonical: https://grownmengrow.com/beta/ (live only after launch)\n---\n'), 'beta');
  assert.equal(canonicalSlug('---\ncanonical: https://grownmengrow.com/gamma\n---\n'), 'gamma');
});

test('canonicalSlug returns undefined, never a guess, when there is no single slug', () => {
  assert.equal(canonicalSlug('---\nstatus: founder-approved\n---\n'), undefined);
  assert.equal(canonicalSlug('---\ncanonical: https://grownmengrow.com/\n---\n'), undefined);
  assert.equal(canonicalSlug('---\ncanonical: https://grownmengrow.com/a/b/\n---\n'), undefined);
  assert.equal(canonicalSlug('---\ncanonical: not a url\n---\n'), undefined);
});

// The regex canonicalSlug replaced pinned grownmengrow.com. A pack whose
// canonical points at another surface (a Medium URL pasted by mistake) must
// not yield a slug, or the subtitle gate passes a pack the Medium import
// would then point at the wrong place.
test('canonicalSlug refuses any host or scheme but https://grownmengrow.com', () => {
  assert.equal(canonicalSlug('---\ncanonical: https://medium.com/rest-is-not-a-reward\n---\n'), undefined);
  assert.equal(canonicalSlug('---\ncanonical: http://grownmengrow.com/rest-is-not-a-reward/\n---\n'), undefined);
  assert.equal(canonicalSlug('---\ncanonical: mailto:rest-is-not-a-reward\n---\n'), undefined);
});

// One malformed pack must not take resolution down for every other slug: the
// note tasks look up a valid slug and previously died on a TypeError thrown
// from inside the filter while parsing an unrelated pack.
test('a malformed canonical on one pack does not break resolution of another', (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'gmg-packs-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(path.join(dir, 'bad.md'), '---\ncanonical: not a url\n---\n');
  writeFileSync(path.join(dir, 'good.md'), '---\ncanonical: https://grownmengrow.com/good/\n---\n');
  assert.equal(path.basename(resolvePackForSlug({ slug: 'good', dir })), 'good.md');
  assert.throws(() => resolvePackForSlug({ slug: 'missing', dir }), /No distribution pack/);
});

// queue-week-buffer.mjs builds each post's canonical link as
// `${CANONICAL_ORIGIN}/${slug}/`. The reader must accept exactly what the
// builder writes, or a host change would split them silently.
test('the URL the queue script builds is one the reader accepts', () => {
  assert.equal(canonicalSlug(`---\ncanonical: ${CANONICAL_ORIGIN}/the-lights-never-flickered/\n---\n`), 'the-lights-never-flickered');
});

// A pack whose canonical points elsewhere is still sitting in the directory.
// "No distribution pack has slug X" sends the operator looking for a file
// that exists, so the resolver names the packs it could not read instead.
test('a wrong-host canonical is named as the cause, not reported as a missing pack', (t) => {
  const dir = mkdtempSync(path.join(tmpdir(), 'gmg-packs-'));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  writeFileSync(path.join(dir, 'pasted.md'), '---\ncanonical: https://medium.com/@x/some-essay-abc123\n---\n');
  assert.throws(
    () => resolvePackForSlug({ slug: 'some-essay', dir }),
    (error) => /pasted\.md/.test(error.message) && error.message.includes(`${CANONICAL_ORIGIN}/<slug>/`),
  );
});
