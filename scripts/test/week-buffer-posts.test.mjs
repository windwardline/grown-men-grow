import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { weekSlots, buildWeekBufferPosts, carouselLabel } from '../lib/week-buffer-posts.mjs';
import { resolvePackForSlug } from '../lib/note-pack.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const URL_ = 'https://example.com/a-title/';

const PACK = [
  '---',
  'canonical: https://example.com/a-title/',
  'status: founder-approved',
  '---',
  '# Bluesky',
  '## Post 1',
  '',
  'First fragment.',
  '',
  '## Post 2',
  '',
  'Second fragment.',
  '',
  '## Post 3 — canonical link',
  '',
  'Closing line. [canonical link]',
  '',
  '# LinkedIn Page',
  '',
  'LinkedIn body. [canonical link]',
  '',
  '# Substack Notes',
  '## Note 1',
  'x',
].join('\n');

const NOTE = [
  '---',
  'status: founder-approved',
  '---',
  '# Instagram caption source',
  '',
  'The caption.',
  '',
  '# Instagram alt text source',
  '',
  '- Slide 1: One.',
  '- Slide 2: Two.',
  '',
  '# Production notes',
].join('\n');

const build = (over = {}) => buildWeekBufferPosts({
  pack: PACK, note: NOTE, canonicalUrl: URL_, publishAt: '2026-09-22T12:00:00.000Z', slideCount: 2, ...over,
});

test('weekSlots derives the four schedule-of-record slots from an 8:00 AM ET Tuesday publish', () => {
  assert.deepEqual(weekSlots('2026-09-22T12:00:00.000Z'), {
    blueskyTuesday: '2026-09-22T16:00:00.000Z',
    linkedin: '2026-09-23T14:00:00.000Z',
    instagram: '2026-09-24T13:00:00.000Z',
    blueskySaturday: '2026-09-26T22:30:00.000Z',
  });
  // Standard time: 8:00 AM EST is 13:00Z and every slot moves with it.
  assert.equal(weekSlots('2026-11-10T13:00:00.000Z').instagram, '2026-11-12T14:00:00.000Z');
});

test('weekSlots refuses a publish instant that is not Tuesday 8:00 AM in New York', () => {
  assert.throws(() => weekSlots('2026-09-22T13:00:00.000Z'), /Tuesday 8:00 AM/);
  assert.throws(() => weekSlots('2026-09-23T12:00:00.000Z'), /Tuesday 8:00 AM/);
});

test('buildWeekBufferPosts lifts the approved copy verbatim with the canonical link filled', () => {
  const posts = build();
  assert.deepEqual(posts.map((p) => [p.service, p.dueAt]), [
    ['bluesky', '2026-09-22T16:00:00.000Z'],
    ['linkedin', '2026-09-23T14:00:00.000Z'],
    ['instagram', '2026-09-24T13:00:00.000Z'],
    ['bluesky', '2026-09-26T22:30:00.000Z'],
  ]);
  assert.equal(posts[0].text, 'First fragment.');
  assert.equal(posts[1].text, `LinkedIn body. ${URL_}`);
  assert.equal(posts[2].text, 'The caption.');
  assert.deepEqual(posts[2].altTexts, ['One.', 'Two.']);
  assert.equal(posts[3].text, `Closing line. ${URL_}`);
});

test('buildWeekBufferPosts refuses a pack or note not marked founder-approved', () => {
  assert.throws(() => build({ pack: PACK.replace('status: founder-approved', 'status: draft') }), /pack.*founder-approved/);
  assert.throws(() => build({ note: NOTE.replace('status: founder-approved', 'status: draft') }), /note.*founder-approved/);
});

test('buildWeekBufferPosts refuses an alt-text count that disagrees with the slides on disk', () => {
  assert.throws(() => build({ slideCount: 3 }), /2 alt-text lines for 3 slides/);
});

test('buildWeekBufferPosts refuses any placeholder left after substitution', () => {
  assert.throws(() => build({ pack: PACK.replace('First fragment.', 'First [TK].') }), /placeholder/);
});

test('carouselLabel names the carousel directory and upload prefix from the pack filename', () => {
  assert.deepEqual(carouselLabel('/x/content/distribution/field-note-08-platforms.md'), {
    carouselDir: 'assets/drafts/instagram/field-note-08-carousel', uploadPrefix: 'fn8',
  });
  assert.throws(() => carouselLabel('/x/content/distribution/essay-01-launch.md'), /field-note/);
});

test('every approved field note with a register slot builds a complete week', () => {
  const slug = 'nobody-rigs-to-the-breaking-strength';
  const packPath = resolvePackForSlug({ slug });
  const posts = buildWeekBufferPosts({
    pack: readFileSync(packPath, 'utf8'),
    note: readFileSync(path.join(root, 'content', 'field-notes', `${slug}.md`), 'utf8'),
    canonicalUrl: `https://grownmengrow.com/${slug}/`,
    publishAt: '2026-09-22T12:00:00.000Z',
    slideCount: 7,
  });
  assert.equal(posts.length, 4);
  assert.equal(posts[2].altTexts.length, 7);
});
