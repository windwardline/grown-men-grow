#!/usr/bin/env node
// Queue the week's four Buffer posts for a staged field note.
//
//   node scripts/queue-week-buffer.mjs <slug> [--dry-run]
//
// Run by the Monday staging task straight after the Ghost post is staged. The
// founder authorised standing auto-publishing of approved pack copy at
// schedule-of-record slots on 2026-08-10, and on 2026-09-21 directed that the
// queue run automatically once a note is approved rather than wait on a
// second ask. What makes that safe is here, not in the task prose: the copy
// is lifted by week-buffer-posts.mjs from files marked founder-approved, the
// slots derive from Ghost's own publish instant, a second run refuses rather
// than doubling the queue, and success is read back from Buffer rather than
// taken from the mutation's reply.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { ghostAdmin } from './lib/ghost-admin.mjs';
import { bufferGraphql, bufferPosts, BUFFER_ORGANIZATION_ID } from './lib/buffer-api.mjs';
import { resolvePackForSlug } from './lib/note-pack.mjs';
import { buildWeekBufferPosts, carouselLabel } from './lib/week-buffer-posts.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const slug = args.find((a) => !a.startsWith('--'));
if (!slug) {
  console.error('usage: node scripts/queue-week-buffer.mjs <slug> [--dry-run]');
  process.exit(2);
}

const fail = (message) => { console.error(`REFUSED: ${message}`); process.exit(1); };

// 1. Ghost must hold the post, scheduled or published, with the email bound.
const ghost = await ghostAdmin(`posts/slug/${slug}/`, { searchParams: { include: 'newsletter' } });
const post = ghost.posts?.[0];
if (!post) fail(`Ghost has no post with slug ${slug}.`);
if (!['scheduled', 'published'].includes(post.status)) fail(`Ghost post ${slug} is ${post.status}, not scheduled or published.`);
if (post.status === 'scheduled' && !post.newsletter) fail(`Ghost post ${slug} is scheduled with no newsletter bound; fix that first.`);
const canonicalUrl = `https://grownmengrow.com/${slug}/`;

// 2. Build every post from approved copy before touching the network.
const packPath = resolvePackForSlug({ slug });
const { carouselDir, uploadPrefix } = carouselLabel(packPath);
const slides = fs.readdirSync(path.join(root, carouselDir)).filter((f) => /^\d+\.png$/.test(f)).sort();
const posts = buildWeekBufferPosts({
  pack: fs.readFileSync(packPath, 'utf8'),
  note: fs.readFileSync(path.join(root, 'content', 'field-notes', `${slug}.md`), 'utf8'),
  canonicalUrl,
  publishAt: post.published_at,
  slideCount: slides.length,
});

// 3. Channels by service, and a refusal if any of this week's text is already
//    queued or sent — a rerun must not double the week.
const channelData = await bufferGraphql(
  'query($i: ChannelsInput!) { channels(input: $i) { id service } }',
  { i: { organizationId: BUFFER_ORGANIZATION_ID } },
);
const channelFor = Object.fromEntries(channelData.channels.map((c) => [c.service, c.id]));
for (const p of posts) if (!channelFor[p.service]) fail(`Buffer has no ${p.service} channel.`);
const existing = await bufferPosts(['scheduled', 'sending', 'sent'], { first: 100 });
const ours = new Set(posts.map((p) => p.text));
const already = existing.filter((e) => ours.has(e.text));
if (already.length > 0) fail(`${already.length} of this week's posts already exist in Buffer (${already.map((e) => `${e.channelService} ${e.status}`).join(', ')}).`);

for (const p of posts) {
  console.log(`${p.dueAt}  ${p.service.padEnd(9)} ${p.text.length} chars${p.altTexts ? `, ${p.altTexts.length} slides` : ''}`);
}
if (dryRun) {
  console.log('\nDRY RUN — nothing uploaded, nothing queued.');
  process.exit(0);
}

// 4. Carousel slides to Ghost storage for public URLs.
const slideUrls = [];
for (const [i, file] of slides.entries()) {
  const form = new FormData();
  form.append('file', new Blob([fs.readFileSync(path.join(root, carouselDir, file))], { type: 'image/png' }), `${uploadPrefix}-c${i + 1}.png`);
  form.append('purpose', 'image');
  const url = (await ghostAdmin('images/upload/', { method: 'POST', body: form })).images?.[0]?.url;
  if (!url) fail(`Ghost returned no URL for slide ${file}; nothing has been queued.`);
  slideUrls.push(url);
}

// 5. Create.
const CREATE = `mutation($i: CreatePostInput!) { createPost(input: $i) {
  __typename
  ... on PostActionSuccess { post { id status dueAt } }
  ... on InvalidInputError { message } ... on UnexpectedError { message }
  ... on LimitReachedError { message } ... on NotFoundError { message }
  ... on UnauthorizedError { message } ... on RestProxyError { message } } }`;
const created = [];
for (const p of posts) {
  const input = { channelId: channelFor[p.service], text: p.text, dueAt: p.dueAt, mode: 'customScheduled', schedulingType: 'automatic' };
  if (p.service === 'instagram') {
    input.assets = slideUrls.map((url, i) => ({ image: { url, metadata: { altText: p.altTexts[i] } } }));
    input.metadata = { instagram: { type: 'post', shouldShareToFeed: true, isAiGenerated: false } };
  }
  const result = (await bufferGraphql(CREATE, { i: input })).createPost;
  if (result.__typename !== 'PostActionSuccess') {
    fail(`${p.service} ${p.dueAt}: ${result.__typename} ${result.message ?? ''}. Already created: ${created.join(', ') || 'none'}.`);
  }
  created.push(`${p.service} ${result.post.id}`);
}

// 6. Read back. The mutation's reply is not the proof; the queue is.
const READ = `query($i: PostsInput!) { posts(input: $i, first: 100) { edges { node {
  text dueAt status schedulingType channelService assets { ... on ImageAsset { image { altText } } } } } } }`;
const queue = (await bufferGraphql(READ, {
  i: { organizationId: BUFFER_ORGANIZATION_ID, filter: { status: ['scheduled'] }, sort: [{ field: 'dueAt', direction: 'asc' }] },
})).posts.edges.map((e) => e.node);
let bad = 0;
for (const p of posts) {
  const q = queue.find((n) => n.text === p.text && n.channelService === p.service);
  const alts = (q?.assets ?? []).filter((a) => a.image?.altText).length;
  const ok = q && q.dueAt === p.dueAt && q.schedulingType === 'automatic' && (!p.altTexts || alts === p.altTexts.length);
  if (!ok) bad += 1;
  console.log(`${ok ? 'VERIFIED' : 'MISMATCH'}  ${p.dueAt}  ${p.service}${p.altTexts ? `  alt ${alts}/${p.altTexts.length}` : ''}`);
}
if (bad > 0) fail(`${bad} post(s) did not read back as queued.`);
console.log('\nAll four posts queued and read back from Buffer.');
