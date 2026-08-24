// Turning an approved field note into the Ghost post payload that stages it.
//
// This lived inline in `stage-next-field-note.mjs`, an executable that does its
// work at import and calls the Ghost Admin API, so it could not be imported
// under `node --test` and never was. The script shipped in 892f1aa with an
// unresolvable import and died on its first line in every invocation for weeks;
// nothing noticed, because the publication register always had a slot already
// scheduled and so nothing ever ran it. The parsing and the HTML build are pure
// functions of the source text and belong where tests can reach them. What stays
// in the executable is what should: argument parsing, the network calls, and the
// order they happen in.

const REQUIRED_FRONTMATTER = ['title', 'slug', 'dek', 'preview', 'email_subject'];

// Staging binds a newsletter send, so the approval gate belongs in code rather
// than in an instruction an agent has to remember. `gmg-monday-staging` has
// always carried the rule as prose — "only stage a note whose frontmatter shows
// founder approval" — which is exactly the shape of guard this repository keeps
// finding it cannot rely on. Every note in `content/field-notes/` carries this
// value today; a note that does not is one that has not been cleared to send.
const APPROVED_STATUS = 'founder-approved';

/**
 * The YAML-ish frontmatter block, as a flat object. Values keep any colon after
 * the first, so `dek: One thing: and another.` survives intact.
 */
export function parseFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n?---/.exec(source);
  if (!match) throw new Error('Field note has no frontmatter block delimited by ---.');

  const front = {};
  for (const line of match[1].split('\n')) {
    const separator = line.indexOf(':');
    if (separator === -1) continue;
    front[line.slice(0, separator).trim()] = line.slice(separator + 1).trim();
  }
  return front;
}

/**
 * The essay itself: the block between `# Ghost essay source` and the next
 * top-level heading. Raises rather than returning undefined, because the naive
 * `split(...)[1]` this replaced would hand `undefined` to the HTML builder and
 * fail several frames away from the missing heading.
 */
export function extractEssaySource(source) {
  const parts = source.split('# Ghost essay source');
  if (parts.length < 2) throw new Error('Field note has no "# Ghost essay source" section.');
  const body = parts[1].split('\n# ')[0].trim();
  if (!body) throw new Error('Field note\'s "# Ghost essay source" section is empty.');
  return body;
}

function inline(text) {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Bold before emphasis, and never the other way round. The single-asterisk
  // rule alone matches the INNER pair of a `**bold**` run — it emits
  // `*<em>bold</em>*`, then pairs each leftover asterisk with the next run's,
  // so one bold word corrupts every span between it and the following one.
  return escaped
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
}

/** The essay block as the HTML Ghost stores, one block element per paragraph. */
export function essayHtml(body) {
  return body
    .split(/\n{2,}/)
    .map((paragraph) => {
      const block = paragraph.trim();
      if (block.startsWith('## ')) return `<h2>${inline(block.slice(3).trim())}</h2>`;
      return `<p>${inline(block).replace(/\n/g, ' ')}</p>`;
    })
    .join('\n');
}

/**
 * The `posts` body for the draft that the scheduling transition then binds the
 * newsletter to. Created as a draft on purpose: the binding takes only on the
 * draft -> scheduled PUT, never on an already-scheduled post.
 */
export function buildPostPayload({ source, featureImage }) {
  const front = parseFrontmatter(source);
  const missing = REQUIRED_FRONTMATTER.filter((key) => !front[key]);
  if (missing.length > 0) {
    throw new Error(`Field note frontmatter is missing ${missing.join(', ')}; the staged post would publish incomplete.`);
  }
  if (front.status !== APPROVED_STATUS) {
    throw new Error(`Field note ${front.slug ?? '(unknown)'} has status "${front.status ?? 'none'}", not "${APPROVED_STATUS}"; staging it would send a newsletter for copy the founder has not cleared.`);
  }
  if (!featureImage) throw new Error('buildPostPayload needs the uploaded feature image URL.');

  const payload = {
    title: front.title,
    slug: front.slug,
    html: essayHtml(extractEssaySource(source)),
    status: 'draft',
    custom_excerpt: front.preview,
    meta_title: `${front.title} | Grown Men Grow`,
    meta_description: front.dek,
    feature_image: featureImage,
    visibility: 'public',
    email_subject: front.email_subject,
  };

  // Only when the note actually carries one. An EMPTY alt attribute tells a
  // screen reader the image is decorative and to skip it, which is a worse
  // answer than an absent one — so a missing description stays missing and is
  // reported by the caller rather than papered over here.
  if (front.feature_image_alt) payload.feature_image_alt = front.feature_image_alt;

  return payload;
}
