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

// A slot is staged days ahead, so anything inside this window of "now" is a
// mistake regardless of what Ghost itself would accept. Stated as our own floor
// rather than as a claim about Ghost's scheduling rule, which is not measured
// here.
const MINIMUM_LEAD_MS = 5 * 60 * 1000;

export const DRY_RUN_FLAG = '--dry-run';

/**
 * The staging command line, parsed strictly. Returns `{slug, publishAt, dryRun}`
 * and throws by name on anything it does not recognise.
 *
 * Strict because of what a near miss costs here. `--dry-runn`, `-dry-run`,
 * `--dryrun` and a stray space all fail an `includes` test while surviving a
 * filter, so a mistyped flag would leave both positionals intact and every
 * later check would pass — the slug is real and the timestamp is the genuine
 * next slot. The run would then upload, create, and transition the post to
 * scheduled with the newsletter bound to the whole list. Nothing downstream
 * catches it: this script does not check whether the slug already has a Ghost
 * post, and Ghost suffixes a duplicate slug rather than refusing it, so on an
 * already-staged week the typo yields a SECOND scheduled post that sends. The
 * weekly instruction is to pass this flag every week, including the weeks whose
 * whole intent is to verify without mutating, which is exactly when the typo
 * would be made.
 */
export function parseStagingArgs(argv) {
  const flags = argv.filter((arg) => arg.startsWith('-'));
  const unknown = flags.filter((flag) => flag !== DRY_RUN_FLAG);
  if (unknown.length > 0) {
    throw new Error(`Unrecognised argument ${JSON.stringify(unknown[0])}; the only flag is ${DRY_RUN_FLAG}.`);
  }

  const positional = argv.filter((arg) => !arg.startsWith('-'));
  if (positional.length > 2) {
    throw new Error(`Expected at most a slug and a publish time; got ${positional.length} positional arguments.`);
  }

  const [slug, publishAt] = positional;
  const dryRun = flags.includes(DRY_RUN_FLAG);
  if (!slug) throw new Error('A field note slug is required.');
  if (!publishAt && !dryRun) throw new Error('A publish time is required for a real run.');

  return {slug, publishAt: publishAt ?? null, dryRun};
}

/**
 * The publish instant, validated. Returns its epoch milliseconds and throws by
 * name on anything else.
 *
 * Lives here rather than in the executable because it is a pure function of a
 * string, and the executable does its work at import so no test can reach it.
 * The caller still checks at the top, before any network call: this value is
 * first USED at the draft -> scheduled transition, which is the third call, so
 * a bad one caught there leaves an uploaded image and an orphaned draft behind.
 *
 * Trailing Z is required rather than mere parseability: `2026-09-01T12:00:00`
 * parses and is read as LOCAL time, so an 8:00 AM ET slot silently lands at
 * another hour with every verification line still reading correct.
 *
 * Staleness is checked in the same place and for the same reason. Last week's
 * timestamp is a well-formed instant ending in Z, and re-running last week's
 * command is a likelier slip than mistyping a zone. Ghost either refuses it —
 * a 422 at the third call, with the upload and the draft already made — or
 * accepts it and the scheduler fires on a past date, sending the newsletter
 * immediately and unreviewed, which the launch-authority rule forbids.
 */
export function assertPublishInstant(value, {now = Date.now()} = {}) {
  if (typeof value !== 'string' || !value) {
    throw new Error('Publish time is required as an ISO instant in UTC.');
  }
  if (!value.endsWith('Z')) {
    throw new Error(`Publish time ${JSON.stringify(value)} does not end in Z; an instant without a zone is read as local time (12:00:00.000Z is 8:00 AM ET during daylight time).`);
  }
  const epochMs = Date.parse(value);
  if (Number.isNaN(epochMs)) {
    throw new Error(`Publish time ${JSON.stringify(value)} is not a parseable ISO instant.`);
  }
  if (epochMs - now < MINIMUM_LEAD_MS) {
    throw new Error(`Publish time ${JSON.stringify(value)} is not at least five minutes ahead of now; staging a past slot either fails after the upload or publishes and sends immediately.`);
  }
  return epochMs;
}

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
