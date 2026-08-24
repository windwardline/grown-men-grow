import test from 'node:test';
import assert from 'node:assert/strict';

import { findPostBySlug } from '../lib/ghost-admin.mjs';

// A rejection shaped like the one `ghostAdmin` throws: an Error carrying the
// HTTP status it saw.
function failing(status) {
  return async () => {
    const error = new Error(`Ghost Admin ${status ?? 'network'}`);
    if (status !== undefined) error.status = status;
    throw error;
  };
}

test('findPostBySlug returns the post when one holds the slug', async () => {
  const request = async () => ({ posts: [{ id: 'abc', slug: 'a-note', status: 'scheduled' }] });
  assert.deepEqual(await findPostBySlug('a-note', { request }), { id: 'abc', slug: 'a-note', status: 'scheduled' });
});

test('findPostBySlug returns null on a 404, which is the answer "nothing holds it"', async () => {
  assert.equal(await findPostBySlug('a-note', { request: failing(404) }), null);
});

test('findPostBySlug returns null when Ghost answers with an empty list', async () => {
  assert.equal(await findPostBySlug('a-note', { request: async () => ({ posts: [] }) }), null);
  assert.equal(await findPostBySlug('a-note', { request: async () => ({}) }), null);
});

// The whole contract. This guard is what stands between a re-run and a second
// newsletter send, so anything that is not a definite "no post holds this slug"
// must propagate. Widening the catch would make it a no-op on every 403, 500,
// and timeout, with the gates still green and the failure arriving as a
// duplicate send.
test('findPostBySlug rethrows every status that is not 404', async () => {
  for (const status of [401, 403, 422, 429, 500, 502, 503]) {
    await assert.rejects(
      () => findPostBySlug('a-note', { request: failing(status) }),
      /Ghost Admin/,
      `status ${status} was swallowed, which would let a duplicate post through`,
    );
  }
});

test('findPostBySlug rethrows an error carrying no status at all', async () => {
  await assert.rejects(() => findPostBySlug('a-note', { request: failing(undefined) }), /network/);
});

test('findPostBySlug asks about the slug it was given, url-encoded', async () => {
  let seen = null;
  await findPostBySlug('a note/with slashes', { request: async (endpoint) => { seen = endpoint; return { posts: [] }; } });
  assert.equal(seen, 'posts/slug/a%20note%2Fwith%20slashes/');
});
