import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseFrontmatter, extractEssaySource, essayHtml, buildPostPayload } from '../lib/field-note-post.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const notesDir = path.join(root, 'content', 'field-notes');

const NOTE = [
  '---',
  'title: A Title',
  'slug: a-title',
  'dek: The dek line.',
  'preview: The preview line.',
  'email_subject: A Title',
  'status: founder-approved',
  '---',
  '',
  '# Ghost essay source',
  '',
  'First paragraph.',
  '',
  '## A heading',
  '',
  'Second paragraph, *emphasised* in part.',
  '',
  '# Instagram caption source',
  '',
  'Caption text that must never reach the essay HTML.',
  '',
].join('\n');

test('parseFrontmatter reads every key and stops at the closing fence', () => {
  const front = parseFrontmatter(NOTE);
  assert.equal(front.title, 'A Title');
  assert.equal(front.slug, 'a-title');
  assert.equal(front.dek, 'The dek line.');
  assert.equal(front.preview, 'The preview line.');
  assert.equal(front.email_subject, 'A Title');
  assert.equal(front.status, 'founder-approved');
});

test('parseFrontmatter keeps a colon inside a value', () => {
  const front = parseFrontmatter('---\ndek: One thing: and another.\n---\n');
  assert.equal(front.dek, 'One thing: and another.');
});

test('parseFrontmatter raises on a document with no frontmatter', () => {
  assert.throws(() => parseFrontmatter('# Ghost essay source\n\nBody.\n'), /frontmatter/i);
});

test('extractEssaySource takes only the Ghost block', () => {
  const body = extractEssaySource(NOTE);
  assert.match(body, /^First paragraph\./);
  assert.doesNotMatch(body, /Caption text/);
  assert.doesNotMatch(body, /Instagram/);
});

test('extractEssaySource raises rather than returning undefined when the heading is absent', () => {
  assert.throws(() => extractEssaySource('---\ntitle: x\n---\n\n# Something else\n\nBody.\n'), /Ghost essay source/);
});

test('essayHtml wraps paragraphs and converts h2 headings', () => {
  const html = essayHtml('First paragraph.\n\n## A heading\n\nSecond.');
  assert.equal(html, '<p>First paragraph.</p>\n<h2>A heading</h2>\n<p>Second.</p>');
});

test('essayHtml joins a soft-wrapped paragraph into one line', () => {
  assert.equal(essayHtml('One line\nand its continuation.'), '<p>One line and its continuation.</p>');
});

test('essayHtml escapes HTML-significant characters', () => {
  assert.equal(essayHtml('Tom & Jerry <b>x</b>'), '<p>Tom &amp; Jerry &lt;b&gt;x&lt;/b&gt;</p>');
});

test('essayHtml converts single asterisks to emphasis', () => {
  assert.equal(essayHtml('A *stressed* word.'), '<p>A <em>stressed</em> word.</p>');
});

// The naive /\*([^*]+)\*/ this replaced matched the INNER pair of a `**bold**`
// run, emitting `*<em>bold</em>*` and then pairing the leftover asterisks with
// the next run — corrupting every span between them, not just the bold word.
test('essayHtml converts double asterisks to strong, not stray emphasis', () => {
  assert.equal(essayHtml('He said **never** again.'), '<p>He said <strong>never</strong> again.</p>');
});

test('essayHtml leaves no stray asterisk when bold and emphasis share a paragraph', () => {
  const html = essayHtml('He said **never** again and *maybe* so.');
  assert.equal(html, '<p>He said <strong>never</strong> again and <em>maybe</em> so.</p>');
  assert.doesNotMatch(html, /\*/);
});

test('essayHtml does not let one bold run bleed into the next', () => {
  const html = essayHtml('**one** plain **two**');
  assert.equal(html, '<p><strong>one</strong> plain <strong>two</strong></p>');
});

test('buildPostPayload carries the fields Ghost needs to publish and send', () => {
  const payload = buildPostPayload({ source: NOTE, featureImage: 'https://example.test/f.png' });
  assert.equal(payload.title, 'A Title');
  assert.equal(payload.slug, 'a-title');
  assert.equal(payload.status, 'draft');
  assert.equal(payload.custom_excerpt, 'The preview line.');
  assert.equal(payload.meta_title, 'A Title | Grown Men Grow');
  assert.equal(payload.meta_description, 'The dek line.');
  assert.equal(payload.email_subject, 'A Title');
  assert.equal(payload.feature_image, 'https://example.test/f.png');
  assert.equal(payload.visibility, 'public');
  assert.match(payload.html, /<p>First paragraph\.<\/p>/);
});

// The alt text has no source in the repository, so the payload must omit the
// field rather than send an empty string — an empty alt marks an image
// DECORATIVE to a screen reader, which is a worse answer than none at all.
test('buildPostPayload omits feature_image_alt when frontmatter carries none', () => {
  const payload = buildPostPayload({ source: NOTE, featureImage: 'https://example.test/f.png' });
  assert.ok(!('feature_image_alt' in payload));
});

test('buildPostPayload passes feature_image_alt through when frontmatter supplies it', () => {
  const withAlt = NOTE.replace('status: founder-approved', 'feature_image_alt: A described collage.\nstatus: founder-approved');
  const payload = buildPostPayload({ source: withAlt, featureImage: 'https://example.test/f.png' });
  assert.equal(payload.feature_image_alt, 'A described collage.');
});

test('buildPostPayload refuses a note missing a field the send depends on', () => {
  const noSubject = NOTE.replace('email_subject: A Title\n', '');
  assert.throws(() => buildPostPayload({ source: noSubject, featureImage: 'x' }), /email_subject/);
});

// The register's whole remaining bank runs through this builder on some future
// Monday. Proving it against the real corpus is the only way a note that breaks
// it is found before the morning it is staged.
test('every approved field note in the bank builds a payload', () => {
  const notes = readdirSync(notesDir).filter((name) => name.endsWith('.md'));
  assert.ok(notes.length >= 13, `expected the bank, found ${notes.length} notes`);
  for (const name of notes) {
    const source = readFileSync(path.join(notesDir, name), 'utf8');
    const payload = buildPostPayload({ source, featureImage: 'https://example.test/f.png' });
    assert.ok(payload.html.length > 0, `${name} produced empty HTML`);
    assert.doesNotMatch(payload.html, /\*/, `${name} left a stray asterisk in its HTML`);
    assert.doesNotMatch(payload.html, /Instagram|Visual direction|Production notes/, `${name} leaked a non-essay section`);
    assert.equal(payload.slug, name.replace(/\.md$/, ''), `${name} frontmatter slug disagrees with its filename`);
  }
});
