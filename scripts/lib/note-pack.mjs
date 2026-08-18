// Resolving a week's distribution pack and lifting approved copy out of it.
//
// Founder-approved copy is posted verbatim — never edited, never improvised.
// Both runs of the note task on 2026-08-18 wrote their own throwaway extractor
// to honour that, which is one divergence away from two agents posting two
// different "verbatim" texts. This is the single extractor.
//
// The pack is found by the essay's canonical slug rather than by a note number,
// because the publication order is constrained by cross-references between
// essays and does not track the field-note numbering.

import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const DEFAULT_PACK_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  '..',
  '..',
  'content',
  'distribution',
);

const CANONICAL_LINE = /^canonical(?:_url)?:\s*(\S+)/m;

/** The pack whose canonical URL names `slug`. Throws unless exactly one does. */
export function resolvePackForSlug({ slug, dir = DEFAULT_PACK_DIR }) {
  if (typeof slug !== 'string' || slug.length === 0) {
    throw new TypeError(`Invalid slug ${JSON.stringify(slug)}.`);
  }
  const matches = readdirSync(dir)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .filter((name) => {
      const canonical = CANONICAL_LINE.exec(readFileSync(path.join(dir, name), 'utf8'))?.[1];
      if (!canonical) return false;
      // Whole path segment only: `rest-is-not-a-reward` must not match
      // `rest-is-not-a-reward-yet`.
      return new URL(canonical).pathname.split('/').filter(Boolean).includes(slug);
    });

  if (matches.length === 0) throw new Error(`No distribution pack in ${dir} has canonical slug "${slug}".`);
  if (matches.length > 1) {
    throw new Error(`Slug "${slug}" matches more than one distribution pack: ${matches.join(', ')}.`);
  }
  return path.join(dir, matches[0]);
}

/**
 * The body of `## Note n` inside the `# Substack Notes` section, verbatim.
 *
 * Stops at the next `##` or `#`, so a trailing qualifier on a later heading
 * ("## Note 3 — canonical link") cannot leak into an earlier note.
 */
export function extractNote(markdown, note) {
  if (!Number.isInteger(note) || note < 1) {
    throw new TypeError(`Invalid note number ${JSON.stringify(note)}; expected a positive integer.`);
  }

  const lines = markdown.split('\n');
  let inSection = false;
  let inNote = false;
  const body = [];

  for (const line of lines) {
    if (/^#\s+/.test(line)) {
      if (inNote) break; // the section ended while inside the note
      inSection = /^#\s+Substack Notes\s*$/.test(line);
      continue;
    }
    if (!inSection) continue;
    if (/^##\s+/.test(line)) {
      if (inNote) break;
      // No dynamic RegExp: `note` is a validated integer, and a plain
      // heading match avoids the ReDoS-shaped construct entirely.
      const heading = line.replace(/^##\s+/, '');
      inNote = heading === `Note ${note}` || heading.startsWith(`Note ${note} `);
      continue;
    }
    if (inNote) body.push(line);
  }

  if (!inNote) {
    const what = markdown.includes('# Substack Notes')
      ? `Note ${note} is not in the pack's Substack Notes section.`
      : 'The pack has no "# Substack Notes" section.';
    throw new Error(what);
  }

  const copy = body.join('\n').trim();
  if (copy.length === 0) throw new Error(`Note ${note} is empty in the pack.`);
  return copy;
}

/** Approved copy for one note of the essay at `slug`. */
export function noteCopyForSlug({ slug, note, dir = DEFAULT_PACK_DIR }) {
  const pack = resolvePackForSlug({ slug, dir });
  return extractNote(readFileSync(pack, 'utf8'), note);
}
