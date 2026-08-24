import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { parseFrontmatter, extractEssaySource, essayHtml, buildPostPayload, assertPublishInstant, parseStagingArgs, assertRenderableEssay } from '../lib/field-note-post.mjs';

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

// Raw HTML is refused by the guard now, so what remains to escape is the
// ampersand that is not an entity and the angle bracket that is not a tag —
// both of which are ordinary prose and must still reach the reader intact.
test('essayHtml escapes HTML-significant characters that are ordinary prose', () => {
  assert.equal(essayHtml('Tom & Jerry, and a < b.'), '<p>Tom &amp; Jerry, and a &lt; b.</p>');
});

test('essayHtml refuses raw HTML rather than escaping it into view', () => {
  assert.throws(() => essayHtml('He was <b>never</b> sure.'), /raw HTML/);
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

// The builder understands four things. Everything else survives HTML-escaped
// inside a <p> — silent mangling, not a throw — and lands in a post scheduled
// with the newsletter bound. A published page can be corrected afterwards; a
// sent newsletter cannot. So the builder refuses.
test('essayHtml refuses Markdown it would render as literal text', () => {
  const cases = [
    ['- one\n- two', /block markup/],
    ['* one\n* two', /block markup/],
    ['+ one', /block markup/],
    ['1. first', /numbered list/],
    ['10) tenth', /numbered list/],
    ['> a quotation', /block markup/],
    ['### deeper heading', /block markup/],
    ['# top heading', /block markup/],
    ['---', /block markup/],
    ['| a | b |', /block markup/],
    ['See [the note](https://example.test).', /inline link/],
    ['![alt](img.png)', /image/],
    ['a `code` span', /code formatting/],
    // The near misses of the enumerated version, each one character away from
    // an entry it had. All four passed it; the derived block rule and the three
    // added inline entries close them.
    ['-----', /block markup/],
    ['****', /block markup/],
    ['_____', /block markup/],
    ['===', /block markup/],
    ['See [the note][ref].', /reference link/],
    ['[ref]: https://example.test', /link reference definition/],
    ['He was <em>never</em> sure.', /raw HTML/],
    ['close&mdash;quarters', /HTML entity/],
    ['an escaped \\* asterisk', /backslash escape/],
  ];
  for (const [body, expected] of cases) {
    assert.throws(() => essayHtml(body), expected, `${JSON.stringify(body)} was rendered instead of refused`);
  }
});

// `## ` is the one supported construct whose correctness depends on POSITION.
// essayHtml only treats it as a heading when it opens a block; anywhere else it
// is literal hashes in running text — valid CommonMark everywhere else, mangled
// here, and bound to a newsletter that cannot be unsent.
test('assertRenderableEssay refuses a "## " heading that does not begin its paragraph', () => {
  assert.throws(() => assertRenderableEssay('A sentence here.\n## A heading'), /does not begin its paragraph/);
  assert.throws(() => assertRenderableEssay('one\n\ntwo\n\nthree\n## bad'), /Essay line 6/);
});

// The mirror of the case above, and the worse of the two: essayHtml's h2 branch
// takes the WHOLE block, so text under a heading with no blank line between is
// swallowed INTO the heading rather than merely printed with its hashes.
test('assertRenderableEssay refuses a "## " heading with text on the line below it', () => {
  assert.throws(() => assertRenderableEssay('## A heading\nText below.'), /blank line after it/);
  assert.throws(() => assertRenderableEssay('## A heading\n   \nText.'), /blank line after it/);
});

test('assertRenderableEssay allows a "## " heading that ends the body', () => {
  assert.doesNotThrow(() => assertRenderableEssay('## A heading'));
  assert.doesNotThrow(() => assertRenderableEssay('Text.\n\n## A heading'));
});

test('assertRenderableEssay allows a "## " heading that opens its block', () => {
  assert.doesNotThrow(() => assertRenderableEssay('## Opening the essay'));
  assert.doesNotThrow(() => assertRenderableEssay('A sentence.\n\n## A heading\n\nMore.'));
});

// `/\n{2,}/` splits on consecutive newlines, so a whitespace-only line does NOT
// separate blocks for the renderer. Treating it as a separator here would wave
// through a heading the renderer keeps inside the paragraph.
test('assertRenderableEssay does not treat a whitespace-only line as a block break', () => {
  const body = 'A sentence.\n   \n## A heading';
  assert.equal(body.split(/\n{2,}/).length, 1, 'precondition: the renderer sees one block');
  assert.throws(() => assertRenderableEssay(body), /does not begin its paragraph/);
});

test('essayHtml refuses the underscore spellings of the constructs it does support', () => {
  assert.throws(() => essayHtml('He was _never_ sure.'), /underscore emphasis/);
  assert.throws(() => essayHtml('He was __certainly__ sure.'), /underscore strong/);
  assert.throws(() => essayHtml('He was ~~calm~~.'), /strikethrough/);
});

// The opening underscore must sit at a word boundary, or an identifier written
// into running prose would be refused as emphasis.
test('assertRenderableEssay allows a snake_case identifier in running prose', () => {
  assert.doesNotThrow(() => assertRenderableEssay('The field is social_copy_status in the frontmatter.'));
  assert.doesNotThrow(() => assertRenderableEssay('Both personal_claims and artwork_status are set.'));
});

// The block rule is derived from CommonMark's line-opening set, so the supported
// inline constructs must be masked before it runs — `*Never* again.` legitimately
// opens a line with an asterisk.
test('assertRenderableEssay allows supported inline markup at the start of a line', () => {
  assert.doesNotThrow(() => assertRenderableEssay('*Never* again.'));
  assert.doesNotThrow(() => assertRenderableEssay('**Never** again.'));
});

// The inline half is enumerated rather than derived, and the reason is that the
// derived version would refuse ordinary prose. These are the shapes that must
// keep working.
test('assertRenderableEssay allows prose punctuation that carries no Markdown meaning', () => {
  assert.doesNotThrow(() => assertRenderableEssay('He said [sic] and meant it.'));
  assert.doesNotThrow(() => assertRenderableEssay('It cost 40 (roughly) an hour.'));
  assert.doesNotThrow(() => assertRenderableEssay('He worked in R&D, less than before.'));
  assert.doesNotThrow(() => assertRenderableEssay('Half-finished work sat there.'));
});

// A soft-wrapped paragraph can begin with a year. That must not read as a list.
test('assertRenderableEssay allows a line beginning with a four-digit year', () => {
  assert.doesNotThrow(() => assertRenderableEssay('1994. A firefighter on television said so.'));
});

test('assertRenderableEssay allows the four things the builder does understand', () => {
  assert.doesNotThrow(() => assertRenderableEssay('A paragraph.\n\n## A heading\n\n**Bold** and *emphasis*.'));
});

test('assertRenderableEssay names the line number so the fix is findable', () => {
  assert.throws(() => assertRenderableEssay('fine\n\nalso fine\n\n- a list'), /Essay line 5 /);
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

test('parseStagingArgs reads a real run', () => {
  assert.deepEqual(parseStagingArgs(['a-slug', '2026-09-01T12:00:00.000Z']), {
    slug: 'a-slug', publishAt: '2026-09-01T12:00:00.000Z', dryRun: false,
  });
});

test('parseStagingArgs reads a dry run with or without a publish time', () => {
  assert.equal(parseStagingArgs(['a-slug', '--dry-run']).dryRun, true);
  assert.equal(parseStagingArgs(['--dry-run', 'a-slug']).slug, 'a-slug');
  assert.equal(parseStagingArgs(['a-slug', '2026-09-01T12:00:00.000Z', '--dry-run']).dryRun, true);
});

// The whole reason this is strict. Each of these fails an `includes` check and
// survives a filter, so both positionals stay intact, every later check passes,
// and a verification run becomes a real one that binds a newsletter send.
test('parseStagingArgs refuses a near miss on the dry-run flag rather than running for real', () => {
  for (const typo of ['--dry-runn', '-dry-run', '--dryrun', '--dry_run', '--DRY-RUN']) {
    assert.throws(
      () => parseStagingArgs(['a-slug', '2026-09-01T12:00:00.000Z', typo]),
      /Unrecognised argument/,
      `${typo} was accepted, which would have staged for real`,
    );
  }
});

test('parseStagingArgs refuses an extra positional', () => {
  assert.throws(() => parseStagingArgs(['a-slug', '2026-09-01T12:00:00.000Z', 'dry-run']), /at most a slug and a publish time/);
});

test('parseStagingArgs requires a slug, and a publish time unless the run is dry', () => {
  assert.throws(() => parseStagingArgs([]), /slug is required/);
  assert.throws(() => parseStagingArgs(['--dry-run']), /slug is required/);
  assert.throws(() => parseStagingArgs(['a-slug']), /publish time is required/);
});

// A fixed instant, because a test that reads the clock proves something
// different every time it runs.
const NOW = Date.parse('2026-08-24T14:00:00.000Z');
const NEXT_SLOT = '2026-09-01T12:00:00.000Z';

test('assertPublishInstant accepts a future UTC instant and returns its epoch', () => {
  assert.equal(assertPublishInstant(NEXT_SLOT, { now: NOW }), Date.parse(NEXT_SLOT));
});

// `2026-09-01T12:00:00` parses cleanly and is read as LOCAL time, so the slot
// lands at another hour while every verification line still reads correct.
test('assertPublishInstant rejects an instant with no zone', () => {
  assert.throws(() => assertPublishInstant('2026-09-01T12:00:00', { now: NOW }), /does not end in Z/);
});

test('assertPublishInstant rejects an offset-form instant', () => {
  assert.throws(() => assertPublishInstant('2026-09-01T08:00:00-04:00', { now: NOW }), /does not end in Z/);
});

test('assertPublishInstant rejects an unparseable string', () => {
  assert.throws(() => assertPublishInstant('not-a-dateZ', { now: NOW }), /not a parseable ISO instant/);
});

test('assertPublishInstant rejects a missing or non-string value', () => {
  for (const value of [undefined, null, '', 42]) {
    assert.throws(() => assertPublishInstant(value, { now: NOW }), /required as an ISO instant/);
  }
});

// Last week's command re-run: a well-formed instant ending in Z, which the shape
// checks pass. Ghost either refuses it after the upload and the create, or
// accepts it and sends the newsletter immediately and unreviewed.
test('assertPublishInstant rejects a stale instant', () => {
  assert.throws(() => assertPublishInstant('2026-08-18T12:00:00.000Z', { now: NOW }), /five minutes ahead/);
});

test('assertPublishInstant rejects an instant inside the lead-time floor', () => {
  assert.throws(() => assertPublishInstant('2026-08-24T14:04:00.000Z', { now: NOW }), /five minutes ahead/);
  assert.equal(assertPublishInstant('2026-08-24T14:05:00.000Z', { now: NOW }), NOW + 5 * 60 * 1000);
});

test('buildPostPayload refuses a falsy feature image', () => {
  for (const featureImage of [undefined, null, '']) {
    assert.throws(() => buildPostPayload({ source: NOTE, featureImage }), /feature image URL/);
  }
});

test('buildPostPayload refuses a note the founder has not approved', () => {
  const draft = NOTE.replace('status: founder-approved', 'status: draft');
  assert.throws(() => buildPostPayload({ source: draft, featureImage: 'x' }), /not "founder-approved"/);
});

test('buildPostPayload refuses a note carrying no status at all', () => {
  const none = NOTE.replace('status: founder-approved\n', '');
  assert.throws(() => buildPostPayload({ source: none, featureImage: 'x' }), /status "none"/);
});

// The executable builds the payload BEFORE the upload so that an invalid note
// cannot leave an orphaned image in Ghost storage. That ordering only protects
// anything if validation does not depend on the real image URL.
test('buildPostPayload validates without a real feature image URL', () => {
  const draft = NOTE.replace('status: founder-approved', 'status: draft');
  assert.throws(() => buildPostPayload({ source: draft, featureImage: 'pending-upload' }), /not "founder-approved"/);
  const noSubject = NOTE.replace('email_subject: A Title\n', '');
  assert.throws(() => buildPostPayload({ source: noSubject, featureImage: 'pending-upload' }), /email_subject/);
});

test('buildPostPayload refuses a note missing a field the send depends on', () => {
  const noSubject = NOTE.replace('email_subject: A Title\n', '');
  assert.throws(() => buildPostPayload({ source: noSubject, featureImage: 'x' }), /email_subject/);
});

// The register's whole remaining bank runs through this builder on some future
// Monday. Proving it against the real corpus is the only way a note that breaks
// it is found before the morning it is staged.
// The boundary is derived here rather than named, because a list of headings to
// keep out inherits the blind spots of whoever wrote it. Twelve notes are
// followed by `# Instagram carousel source`; `call-your-friends-before-theres-a-reason`
// is followed by `# Metadata` — and that section holds the very meta_title whose
// divergence from the live post matters to Medium's importer. A blocklist of the
// common headings would not have caught a leak of the uncommon one.
function essaySliceByLine(source) {
  const lines = source.split('\n');
  const start = lines.findIndex((line) => line.trim() === '# Ghost essay source');
  assert.notEqual(start, -1, 'note has no "# Ghost essay source" heading');
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => line.startsWith('# '));
  return (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
}

test('every approved field note in the bank builds a payload', () => {
  const notes = readdirSync(notesDir).filter((name) => name.endsWith('.md'));
  assert.ok(notes.length >= 13, `expected the bank, found ${notes.length} notes`);
  for (const name of notes) {
    const source = readFileSync(path.join(notesDir, name), 'utf8');
    const payload = buildPostPayload({ source, featureImage: 'https://example.test/f.png' });
    assert.ok(payload.html.length > 0, `${name} produced empty HTML`);
    assert.doesNotMatch(payload.html, /\*/, `${name} left a stray asterisk in its HTML`);
    assert.equal(extractEssaySource(source), essaySliceByLine(source), `${name} essay slice disagrees with its section boundaries`);
    assert.doesNotThrow(() => assertRenderableEssay(extractEssaySource(source)), `${name} carries Markdown the builder would render as literal text`);
    assert.equal(payload.slug, name.replace(/\.md$/, ''), `${name} frontmatter slug disagrees with its filename`);
  }
});

test('the bank contains a note whose essay is followed by something other than the Instagram section', () => {
  const followers = readdirSync(notesDir)
    .filter((name) => name.endsWith('.md'))
    .map((name) => {
      const lines = readFileSync(path.join(notesDir, name), 'utf8').split('\n');
      const start = lines.findIndex((line) => line.trim() === '# Ghost essay source');
      return lines.slice(start + 1).find((line) => line.startsWith('# ')) ?? '';
    });
  assert.ok(new Set(followers).size > 1, 'the derived slice test is only meaningful while the bank has more than one following heading');
});
