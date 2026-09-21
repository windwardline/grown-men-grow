// The week's four Buffer posts, built from approved copy only.
//
// Until 2026-09-21 each Monday staging run wrote its own throwaway extractor
// in a scratch directory, the same drift note-pack.mjs was written to end for
// Substack notes. That run also found Field Note 12's pack still marked
// "draft — NOT founder-approved" five weeks after approval, a day before it
// was due to be queued. So this refuses on status rather than trusting that
// anything under content/ is approved.
//
// Slots follow the schedule of record in docs/technical/publish-timing.md and
// are derived from the Ghost publish instant, so a week that moves the essay
// moves its distribution with it.

import path from 'node:path';

const NY = 'America/New_York';
const HOUR = 3_600_000;

// Offsets from Tuesday 8:00 AM ET. They hold across a DST change only because
// the US changes clocks on a Sunday, after the Saturday slot.
const OFFSETS = {
  blueskyTuesday: 4 * HOUR, // Tue 12:00 PM
  linkedin: 26 * HOUR, // Wed 10:00 AM
  instagram: 49 * HOUR, // Thu 9:00 AM
  blueskySaturday: 106.5 * HOUR, // Sat 6:30 PM
};

function nyParts(date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: NY, weekday: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  }).formatToParts(date);
  return Object.fromEntries(parts.map((p) => [p.type, p.value]));
}

/** The four slots for a week whose essay publishes at `publishAt`. */
export function weekSlots(publishAt) {
  const start = new Date(publishAt);
  if (Number.isNaN(start.getTime())) throw new TypeError(`Invalid publish instant ${JSON.stringify(publishAt)}.`);
  const p = nyParts(start);
  if (p.weekday !== 'Tue' || p.hour !== '08' || p.minute !== '00') {
    throw new Error(`Publish instant ${publishAt} is ${p.weekday} ${p.hour}:${p.minute} in New York, not Tuesday 8:00 AM; the schedule of record cannot be derived from it.`);
  }
  return Object.fromEntries(Object.entries(OFFSETS).map(([k, ms]) => [k, new Date(start.getTime() + ms).toISOString()]));
}

function frontmatterStatus(markdown) {
  const fm = markdown.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? '';
  return fm.match(/^status:\s*(.*)$/m)?.[1]?.trim();
}

// Body under an exact `#`/`##` heading line, up to the next heading of the
// same or higher level.
function sectionBody(markdown, heading) {
  const level = heading.match(/^#+/)[0].length;
  const lines = markdown.split('\n');
  const start = lines.findIndex((line) => line.trim() === heading);
  if (start === -1) throw new Error(`Missing section "${heading}".`);
  const rest = lines.slice(start + 1);
  const end = rest.findIndex((line) => {
    const m = line.match(/^(#+)\s/);
    return m && m[1].length <= level;
  });
  const body = (end === -1 ? rest : rest.slice(0, end)).join('\n').trim();
  if (!body) throw new Error(`Section "${heading}" is empty.`);
  return body;
}

// Within `parent`, the body of the `##` heading that equals `child` or starts
// with it followed by a space (e.g. "## Post 3 — canonical link").
function subsectionBody(markdown, parent, child) {
  const parentBody = sectionBody(markdown, parent);
  const line = parentBody.split('\n').find((l) => l === child || l.startsWith(`${child} `));
  if (!line) throw new Error(`Missing "${child}" under "${parent}".`);
  return sectionBody(parentBody, line.trim());
}

/**
 * The four posts, in slot order. `slideCount` is the number of carousel PNGs
 * on disk; the alt-text lines must match it exactly.
 */
export function buildWeekBufferPosts({ pack, note, canonicalUrl, publishAt, slideCount }) {
  if (frontmatterStatus(pack) !== 'founder-approved') throw new Error('The pack is not marked status: founder-approved.');
  if (frontmatterStatus(note) !== 'founder-approved') throw new Error('The note is not marked status: founder-approved.');

  const slots = weekSlots(publishAt);
  const fill = (text) => text.replaceAll('[canonical link]', canonicalUrl);
  const altTexts = sectionBody(note, '# Instagram alt text source')
    .split('\n')
    .filter((line) => /^- Slide \d+: /.test(line))
    .map((line) => line.replace(/^- Slide \d+: /, ''));
  if (altTexts.length !== slideCount) {
    throw new Error(`The note carries ${altTexts.length} alt-text lines for ${slideCount} slides.`);
  }

  const posts = [
    { service: 'bluesky', dueAt: slots.blueskyTuesday, text: fill(subsectionBody(pack, '# Bluesky', '## Post 1')) },
    { service: 'linkedin', dueAt: slots.linkedin, text: fill(sectionBody(pack, '# LinkedIn Page')) },
    { service: 'instagram', dueAt: slots.instagram, text: sectionBody(note, '# Instagram caption source'), altTexts },
    { service: 'bluesky', dueAt: slots.blueskySaturday, text: fill(subsectionBody(pack, '# Bluesky', '## Post 3')) },
  ];
  for (const post of posts) {
    for (const text of [post.text, ...(post.altTexts ?? [])]) {
      if (/\[[^\]]*\]/.test(text)) throw new Error(`A ${post.service} string still carries a placeholder: ${text}`);
    }
  }
  return posts;
}

/** Carousel directory and Ghost upload prefix for a field-note pack path. */
export function carouselLabel(packPath) {
  const m = path.basename(packPath).match(/^field-note-(\d+)-platforms\.md$/);
  if (!m) throw new Error(`${packPath} is not a field-note pack; no carousel convention applies.`);
  return { carouselDir: `assets/drafts/instagram/field-note-${m[1]}-carousel`, uploadPrefix: `fn${Number(m[1])}` };
}
