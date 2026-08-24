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
 * scheduled with the newsletter bound to the whole list. The weekly instruction
 * is to pass this flag every week, including the weeks whose whole intent is to
 * verify without mutating, which is exactly when the typo would be made.
 *
 * The duplicate-slug consequence that made this dangerous is separately covered
 * now: the executable refuses a slug that already has a Ghost post, because
 * Ghost suffixes a duplicate rather than refusing it. Both guards are kept —
 * this one because a verification run must not mutate at all, that one because
 * the mistyped flag was never its only entrance.
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

// Everything this builder understands: a paragraph, `## ` opening a block as an
// h2, `**strong**`, and `*em*`. Every other Markdown construct does not break it
// — it survives, HTML-escaped, inside a <p>. A list becomes `<p>- like this</p>`,
// a link ships as literal brackets with the href dead. That is silent mangling
// rather than a throw, and it ends up in a post transitioned to scheduled with
// the newsletter bound to everyone: a published page can be corrected
// afterwards, a sent newsletter cannot. So the builder refuses instead.
//
// The block half is DERIVED, not enumerated. An earlier version listed one entry
// per construct — a bullet, a rule, a table — and every near miss of every entry
// passed: `-----` where the rule matched exactly three dashes, `### ` where it
// matched `#`, a setext underline nothing matched at all. AGENTS.md says derive
// populations rather than curating them, and the derivation here is that
// CommonMark gives block meaning to a small closed set of characters when they
// open a line. So: mask the constructs this builder DOES render, then refuse any
// line that still begins with one of them. Lists, rules, blockquotes, tables,
// other heading levels, and setext underlines all fall out of the one rule
// rather than needing an entry each.
//
// Masking has to happen first, because `*Never* again.` legitimately opens a
// line with an asterisk. Numeric lists still need their own entry, restricted to
// one or two digits so a soft-wrapped line beginning with a four-digit year is
// not read as a list.
const BLOCK_STRUCTURAL = /^\s*[#>|=+\-*_~`]/;
const NUMBERED_LIST = /^\s*\d{1,2}[.)]\s/;

// The inline half stays enumerated, and that is a judgement rather than an
// oversight. The derived version would refuse every bracket and every angle
// bracket, which rejects ordinary prose — `[sic]` renders as `[sic]` and is
// fine, while `[sic](url)` does not. So each entry below is a shape that
// CommonMark gives meaning to and this builder does not, and the residual risk
// is stated rather than implied: an inline construct outside this list ships as
// literal text. The block rule above is what makes that residue small.
const UNRENDERABLE_INLINE = [
  [/!\[[^\]]*\]\(/, 'an image'],
  [/\[[^\]]*\]\([^)]*\)/, 'an inline link'],
  [/\[[^\]]*\]\[[^\]]*\]/, 'a reference link'],
  [/^\s*\[[^\]]+\]:\s*\S/, 'a link reference definition'],
  [/`/, 'code formatting'],
  [/~~/, 'strikethrough'],
  [/\\[^\s]/, 'a backslash escape'],
  [/<[a-zA-Z/!?]/, 'raw HTML'],
  [/&(?:[a-zA-Z][a-zA-Z0-9]{1,10}|#\d{1,6}|#[xX][0-9a-fA-F]{1,6});/, 'an HTML entity'],
  // The other standard spellings of the two constructs the builder DOES
  // support, which is what an editorial hand reaches for without thinking about
  // the renderer. The opening underscore must sit at a word boundary so a
  // snake_case identifier in running prose is not mistaken for emphasis.
  [/(?:^|[\s(])__[^_\s][^_]*__/, 'underscore strong (write **strong** instead)'],
  [/(?:^|[\s(])_[^_\s][^_]*_/, 'underscore emphasis (write *emphasis* instead)'],
];

// The two things the builder renders inline, removed so the LINE-OPENING test
// is not fooled by `*Never* again.` — that and nothing else. The inline rules
// run against the raw line, because a construct wrapped in emphasis mangles
// exactly as it would outside it. `## ` is handled separately, because whether
// it renders depends on where the line sits.
function maskSupportedInline(line) {
  return line.replace(/\*\*[^*]+\*\*/g, 'S').replace(/\*[^*]+\*/g, 'E');
}

/**
 * Refuses an essay body carrying Markdown this builder would silently mangle.
 * Named by construct and by line, because the fix is editorial and the person
 * reading the failure needs to know which line to look at.
 */
export function assertRenderableEssay(body) {
  const lines = body.split('\n');

  // The `## ` rules run FIRST so their diagnostics win. Both name the actual
  // remedy — a blank line, on one side or the other — where the generic block
  // rule below could only say the line opens with a hash.
  //
  // `## ` is the one supported construct whose correctness depends on WHERE the
  // line sits. essayHtml splits on /\n{2,}/ and treats `## ` as a heading only
  // when it OPENS a block, and its heading branch takes the WHOLE block. So a
  // heading with text above it prints its hashes in running text, and one with
  // text below it swallows that text into the heading.
  //
  // A block boundary is an EXACTLY empty line, because that is what /\n{2,}/
  // matches. A whitespace-only line does not separate blocks for the renderer,
  // so it must not count as one here.
  const opensHeading = new Set();
  for (const [index, line] of lines.entries()) {
    if (!/^\s*## /.test(line)) continue;
    if (!(index === 0 || lines[index - 1] === '')) {
      throw new Error(`Essay line ${index + 1} is a "## " subheading that does not begin its paragraph, so it renders as literal hashes in running text; put a blank line before it.`);
    }
    if (index < lines.length - 1 && lines[index + 1] !== '') {
      throw new Error(`Essay line ${index + 1} is a "## " subheading with text on the line below it, so the renderer swallows that text into the heading; put a blank line after it.`);
    }
    opensHeading.add(index);
  }

  for (const [index, line] of lines.entries()) {
    // A heading the builder really does render is masked whole; one it does not
    // falls through to the positional checks below, which name the actual fix.
    const masked = maskSupportedInline(opensHeading.has(index) ? line.replace(/^\s*## /, '') : line);

    if (BLOCK_STRUCTURAL.test(masked)) {
      throw new Error(`Essay line ${index + 1} opens with ${JSON.stringify(masked.trim()[0])}, which CommonMark reads as block markup and this builder renders as literal text: ${JSON.stringify(line.trim().slice(0, 60))}`);
    }
    if (NUMBERED_LIST.test(masked)) {
      throw new Error(`Essay line ${index + 1} opens a numbered list, which this builder renders as literal text: ${JSON.stringify(line.trim().slice(0, 60))}`);
    }
    // Against the RAW line, not the masked one. Masking exists only so the
    // line-opening test is not fooled by `*Never* again.`; using it here would
    // hide every inline construct wrapped in emphasis, and `*see [the
    // note](url)*` renders its brackets just as literally inside an <em> as
    // outside one.
    for (const [pattern, description] of UNRENDERABLE_INLINE) {
      if (pattern.test(line)) {
        throw new Error(`Essay line ${index + 1} uses ${description}, which this builder renders as literal text rather than markup: ${JSON.stringify(line.trim().slice(0, 60))}`);
      }
    }
  }

  // `## ` is the one rule above whose correctness depends on WHERE the line
  // sits. The list scans lines; essayHtml renders blocks, and only treats
  // `## ` as a heading when it OPENS one. In CommonMark an ATX heading
  // interrupts a paragraph, so `Text\n## Heading` is valid Markdown that renders
  // as a heading everywhere else and as literal hashes in running text here —
  // the same silent mangling, reached through the one construct the list
  // declares supported.
  //
  // A block opens at the start or after an EXACTLY empty line, because that is
  // what `/\n{2,}/` splits on. A whitespace-only line does not separate blocks
  // there, so it must not count as one here: matching on `.trim() === ''` would
  // wave through a heading the renderer keeps inside the paragraph.
}

// The labels this section may carry, matched case-insensitively and with the
// label's own bold optional, because a near miss on any of that used to revert
// silently to the derived value — which is the defect this parser exists to
// close. Anything that LOOKS like one of these and cannot be read raises.
// Bold is presentation throughout this section — around the value, around the
// label, or inside either — so it is removed from the whole entry BEFORE
// anything is matched. Trying to strip it around the value only meant the label
// pattern ate the value's opening asterisks and the anchored strip then missed.
// Ghost's meta fields are plain text; `Male **Friendship** Before Crisis` means
// the words, not the asterisks.
const BOLD = /\*\*/g;
const META_LABEL = /^[-*+]\s*(meta\s+title|meta\s+description)\s*:\s*(.*)$/i;
const META_MENTION = /meta\s+(title|description)/i;
// A line anywhere in the note that declares an approved value. Used to prove
// none was missed, independently of where the section turned out to be.
const META_LINE = /^\s*[-*+]?\s*\*{0,2}\s*meta\s+(?:title|description)\s*:/i;

/**
 * The `# Metadata` section's approved values, when a note carries one.
 *
 * `extractEssaySource` cuts the essay at the next top-level heading, so this
 * block was being discarded in silence while the builder synthesised its own
 * `meta_title` and `meta_description` over the top of it. AGENTS.md is explicit:
 * founder-approved public copy under `content/` is canonical and is not
 * rewritten during implementation. Deriving over a value the founder wrote is
 * that rewrite, and it is not cosmetic — Medium's URL importer takes
 * `meta_title` as the headline, so it decides what a second platform publishes.
 *
 * Every failure here is LOUD. An earlier version returned `{}` for a section it
 * could not read, which `buildPostPayload` could not tell apart from a note that
 * carries no section at all — so a bulleted `*` instead of `-`, a capitalised
 * label, or bold around the label reverted to the derived value with every gate
 * green. Values may be soft-wrapped across lines, because wrapping a 150-character
 * description is the ordinary editorial reflex and truncating it silently would
 * ship a half-sentence as a Medium headline.
 */
export function parseApprovedMetadata(source) {
  // The heading is matched TOLERANTLY, because every loud refusal below lives
  // inside a section this match found — so a near miss here is a silent revert
  // to the derived value, which is the one thing this parser exists to prevent.
  // `# Metadata and internal links`, `# Post metadata`, `# metadata`, and
  // `## Metadata` all used to return {}. Any heading level is accepted. The repository's other home for
  // approved metadata, `content/metadata.md`, files the same bullets under
  // page-named headings rather than under `# Metadata` at all, so the nearest
  // precedent an author has uses a different spelling and nothing holds this one.
  const lines = source.split('\n');
  // The hash run is captured and BOUNDED on its right. `#{1,2}[^\n]*` had no
  // `(?!#)`, so `### Metadata` matched with the trailing hashes absorbed by the
  // wildcard — accepted while the comment and the operator doc both said two
  // hashes was the deepest, and then mis-levelled as 2 so the section ran past
  // every sibling `### `. Deriving the level from what was actually matched
  // closes both halves at once.
  const headings = lines
    .map((line, index) => ({line, index, match: /^(#{1,6})(?!#)[^\n]*\bmetadata\b/i.exec(line)}))
    .filter(({match}) => match !== null);
  if (headings.length === 0) return {};
  if (headings.length > 1) {
    throw new Error(`The note carries ${headings.length} metadata headings; approved values must live under exactly one.`);
  }

  // Cut at the next heading of the same level or shallower, so a `## ` under a
  // `# ` stays inside the section it belongs to.
  const level = headings[0].match[1].length;
  const closes = new RegExp(`^#{1,${level}}(?!#) `);
  const rest = lines.slice(headings[0].index + 1);
  const end = rest.findIndex((line) => closes.test(line));
  const body = (end === -1 ? rest : rest.slice(0, end)).join('\n');

  // Fold soft-wrapped continuations onto their entry before anything is matched.
  //
  // A BLANK LINE CLOSES THE ENTRY, the way it ends a list item's lazy
  // continuation in Markdown. Skipping blanks instead — the first version of
  // this — folded any later non-bullet line onto whichever meta entry preceded
  // it, however far above: an editorial aside under the bullets became part of
  // the meta title, silently, with no asterisk left to catch it and the corpus
  // check comparing the payload against the same corrupted string. That field is
  // the Medium headline. A non-bullet line opening after a blank now starts its
  // own entry, where it is either ignored or raises on META_MENTION — loud
  // either way, which is this parser's contract.
  const entries = [];
  let openEntry = false;
  for (const line of body.split('\n')) {
    if (line.trim() === '') {
      openEntry = false;
      continue;
    }
    const stripped = line.replace(BOLD, '').trim();
    if (openEntry && !/^[-*+]\s/.test(stripped)) entries[entries.length - 1] += ` ${stripped}`;
    else entries.push(stripped);
    openEntry = true;
  }

  const approved = {};
  for (const entry of entries) {
    const match = META_LABEL.exec(entry);
    if (!match) {
      // A line naming one of these fields that this parser could not read is the
      // silent-revert case, and it must never be one.
      if (META_MENTION.test(entry)) {
        throw new Error(`The "# Metadata" section has a line naming a meta field that cannot be read: ${JSON.stringify(entry.slice(0, 80))}`);
      }
      continue;
    }

    const field = /title/i.test(match[1]) ? 'meta_title' : 'meta_description';
    const value = match[2].trim();
    if (!value) {
      throw new Error(`The "# Metadata" section approves an empty ${field}.`);
    }
    // Bold is gone by now, so a surviving asterisk is emphasis or a stray, and
    // these two fields decide what Ghost and Medium publish as plain text.
    if (value.includes('*')) {
      throw new Error(`The approved ${field} carries a literal asterisk, which ships as punctuation: ${JSON.stringify(value.slice(0, 80))}`);
    }
    if (approved[field]) {
      throw new Error(`The "# Metadata" section approves ${field} more than once.`);
    }
    approved[field] = value;
  }

  // Nothing that looks like an approved value may be left unread, wherever it
  // sits. Without this, a note whose only `metadata` heading is a working one —
  // `## Image metadata` under `# Production notes` — parses that section, finds
  // nothing, and returns {}, which `buildPostPayload` cannot tell apart from a
  // note that approves nothing. That is the silent revert again, one level up
  // from the heading spelling. Counting rather than trusting the section keeps
  // the loud contract whole.
  const declared = lines.filter((line) => META_LINE.test(line)).length;
  if (declared !== Object.keys(approved).length) {
    throw new Error(`The note declares ${declared} approved meta value(s) but ${Object.keys(approved).length} could be read from its metadata section; move them under that heading or fix their shape.`);
  }
  return approved;
}

/** The essay block as the HTML Ghost stores, one block element per paragraph. */
export function essayHtml(body) {
  assertRenderableEssay(body);
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

  // Approved values win over derived ones. The derivation is a convenience for
  // the notes that carry no `# Metadata` section; it is not a licence to
  // overwrite copy the founder wrote and left in the file.
  const approved = parseApprovedMetadata(source);

  const payload = {
    title: front.title,
    slug: front.slug,
    html: essayHtml(extractEssaySource(source)),
    status: 'draft',
    custom_excerpt: front.preview,
    meta_title: approved.meta_title ?? `${front.title} | Grown Men Grow`,
    meta_description: approved.meta_description ?? front.dek,
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
