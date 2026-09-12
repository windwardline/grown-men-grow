// Reading the Grown Men Grow notes feed.
//
// Substack has no documented API and no credential to hold: the publication's
// notes are public, so this reads the same surface a visitor does. That is why
// the reconciliation it feeds can run in CI, unlike the Ghost register's, which
// needs a Keychain key.
//
// The handle is fixed rather than configurable. Every public identity for this
// publication is Grown Men Grow (founder ruling 2026-08-10), and a checker that
// could be pointed at another profile could pass against the wrong one.
//
// Nothing here decides anything. It returns notes or throws; an unreachable
// feed must reach the caller as a failure, never as an empty list.

const HANDLE = 'grownmengrow';
const ORIGIN = 'https://substack.com';
const MAX_PAGES = 20;

async function getJson(url) {
  let response;
  try {
    response = await fetch(url, {
      headers: { accept: 'application/json', 'user-agent': 'grown-men-grow-register-check' },
    });
  } catch (error) {
    throw new Error(`Substack request failed for ${url}: ${error.message}`);
  }
  if (!response.ok) throw new Error(`Substack answered ${response.status} ${response.statusText} for ${url}`);
  try {
    return await response.json();
  } catch (error) {
    throw new Error(`Substack returned a body that is not JSON for ${url}: ${error.message}`);
  }
}

/** The numeric profile id behind the handle, resolved rather than hardcoded. */
export async function profileId() {
  const profile = await getJson(`${ORIGIN}/api/v1/user/${HANDLE}/public_profile`);
  const id = profile?.id;
  if (!Number.isInteger(id)) throw new Error(`Substack profile for @${HANDLE} carries no numeric id.`);
  if (profile.handle !== HANDLE) {
    throw new Error(`Substack returned handle "${profile.handle}" for @${HANDLE}; refusing to read the wrong profile.`);
  }
  return id;
}

/**
 * Every note the publication has posted, newest first.
 *
 * Follows `nextCursor` rather than trusting one page: the register only grows,
 * and a checker that silently read the first page would start reporting older
 * rows as absent the week the feed paginates. Restacks and replies carrying
 * another account's `user_id` are dropped, so only the publication's own notes
 * can satisfy — or contradict — a register row.
 */
export async function publicationNotes() {
  const id = await profileId();
  const seen = new Map();
  let cursor = null;

  for (let page = 0; page < MAX_PAGES; page += 1) {
    const url = new URL(`${ORIGIN}/api/v1/reader/feed/profile/${id}`);
    url.searchParams.set('types[]', 'note');
    if (cursor) url.searchParams.set('cursor', cursor);

    const body = await getJson(url.toString());
    const items = Array.isArray(body?.items) ? body.items : [];
    const before = seen.size;

    for (const item of items) {
      const c = item?.comment;
      if (!c?.id || typeof c.body !== 'string') continue;
      if (c.user_id !== id) continue;
      seen.set(String(c.id), { id: String(c.id), date: c.date, body: c.body });
    }

    cursor = body?.nextCursor ?? null;
    if (!cursor) return [...seen.values()];
    // A cursor that yields nothing new would otherwise spin to MAX_PAGES and
    // report a truncated feed as complete.
    if (seen.size === before) return [...seen.values()];
  }

  throw new Error(
    `The notes feed did not terminate within ${MAX_PAGES} pages, so it was read only in part. `
    + 'A partial feed cannot be reconciled against the register.',
  );
}
