import os from "node:os";
import {execFileSync} from "node:child_process";

// Every GraphQL request goes to this host. Buffer's older REST surface lives on
// api.bufferapp.com and answers a personal access key with 401 — the same status
// a revoked key produces, which is how a working credential can be read as dead.
// The host is fixed rather than configurable so the wrong one cannot be reached.
export const BUFFER_API_URL = "https://api.buffer.com";

// The single organization behind the publication. Pinned because every posts and
// channels query requires it and a wrong id returns an empty list rather than an
// error — silence that reads as "nothing queued."
export const BUFFER_ORGANIZATION_ID = "6a79550e9f72378c9c0b69a1";

// Dashboard name and Keychain service are deliberately the same string: the
// credential policy makes an unnamed or differently-named provider key an orphan.
const KEYCHAIN_SERVICE = "buffer-api-token";
const KEYCHAIN_ACCOUNT = os.userInfo().username;

// Read the key at call time into a local. It never becomes module state, and
// nothing in this file returns, prints, or logs the key.
function readApiKey() {
  let raw;
  try {
    raw = execFileSync(
      "security",
      ["find-generic-password", "-a", KEYCHAIN_ACCOUNT, "-s", KEYCHAIN_SERVICE, "-w"],
      {encoding: "utf8", stdio: ["ignore", "pipe", "pipe"]},
    );
  } catch (error) {
    const detail = String(error.stderr ?? "").trim() || error.message;
    throw new Error(
      `Cannot read Keychain item "${KEYCHAIN_SERVICE}" (account ${KEYCHAIN_ACCOUNT}): ${detail}. `
      + "Create the key at https://publish.buffer.com/settings/api (Personal Access tab), name it "
      + `"${KEYCHAIN_SERVICE}" there too, and store it with: `
      + `security add-generic-password -a ${KEYCHAIN_ACCOUNT} -s ${KEYCHAIN_SERVICE} -w`,
    );
  }

  const key = raw.trim();
  // Deliberately loose. Buffer does not document the key's format, and a strict
  // shape test written from one sample fails the day the format changes — a
  // false local rejection of a key the provider still honours.
  if (key.length < 20 || /\s/.test(key)) {
    throw new Error(`Keychain item "${KEYCHAIN_SERVICE}" does not look like a Buffer personal access key (too short, or contains whitespace).`);
  }
  return key;
}

function describeFailure(status, payload) {
  const graphqlError = payload?.errors?.[0]?.message;
  const reason = graphqlError ?? (typeof payload === "string" ? payload.slice(0, 200) : "no error body");
  // 401 here is the key itself: the host is pinned, so it cannot be the wrong
  // endpoint, and the request carries no other credential.
  const hint = status === 401
    ? ` The key was rejected. Confirm it is still listed at https://publish.buffer.com/settings/api before assuming it expired — a key deleted there cannot be recovered, only replaced.`
    : "";
  return `Buffer API ${status}: ${reason}.${hint}`;
}

/**
 * Issue a signed GraphQL request. Resolves to `data` and throws on any non-2xx
 * or any GraphQL error, so a caller never reads a partial result as a whole one.
 */
export async function bufferGraphql(query, variables = {}, {timeoutMs = 30000} = {}) {
  const response = await fetch(BUFFER_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${readApiKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({query, variables}),
    signal: AbortSignal.timeout(timeoutMs),
  });

  const text = await response.text();
  let payload = null;
  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = text;
    }
  }

  if (!response.ok) {
    const error = new Error(describeFailure(response.status, payload));
    error.status = response.status;
    throw error;
  }
  // A GraphQL server answers 200 with an `errors` array. Treating that as
  // success is how an empty queue and a rejected query become the same report.
  if (payload?.errors?.length) {
    const error = new Error(describeFailure(200, payload));
    error.status = 200;
    throw error;
  }
  return payload?.data ?? null;
}

/**
 * The credential probe. Returns the status rather than throwing so a caller can
 * report it plainly. Uses the organizations query Buffer's own quick start uses
 * to verify a key, and checks the pinned organization is among the results — a
 * key issued from a different Buffer account would otherwise probe green and
 * then read an empty queue.
 */
export async function probeBufferApi() {
  try {
    const data = await bufferGraphql("query GetOrganizations { account { organizations { id name } } }");
    const organizations = data?.account?.organizations ?? [];
    const match = organizations.find((organization) => organization.id === BUFFER_ORGANIZATION_ID);
    if (!match) {
      return {
        ok: false,
        status: 200,
        message: `Key is valid but does not reach organization ${BUFFER_ORGANIZATION_ID}; it saw ${organizations.length} organization(s). It was issued from the wrong Buffer account.`,
      };
    }
    return {ok: true, status: 200, organizationId: match.id, organizationName: match.name};
  } catch (error) {
    return {ok: false, status: error.status ?? null, message: error.message};
  }
}

/**
 * Field-level introspection for one type. The queue queries these tasks need
 * live in three scheduled-task files that each re-derived the shape from an
 * error message; this exists so the shape is measured once, against the live
 * schema, and written down. Run it before adding any query to this file.
 */
export async function introspectType(typeName) {
  const data = await bufferGraphql(
    `query Introspect($name: String!) {
      __type(name: $name) {
        name
        fields { name type { kind name ofType { kind name } } }
      }
    }`,
    {name: typeName},
  );
  return data?.__type ?? null;
}

// Measured against the live schema on 2026-08-18, not recalled. `posts` returns
// PostsResults { edges { cursor node } } and takes `first`/`after` as siblings of
// `input` — pagination exists, it is simply not on PostsInput, which is the whole
// of the "PostsInput takes no limit" folklore. PostSortableKey is dueAt|createdAt
// and SortDirection is asc|desc, both lowercase.
const POST_FIELDS = `
  id
  status
  dueAt
  sentAt
  text
  channelId
  channelService
  isCustomScheduled
  schedulingType
`;

/**
 * Posts in the given states. `statuses` are PostStatus values:
 * draft | needs_approval | scheduled | sending | sent | error.
 */
export async function bufferPosts(statuses, {
  direction = "asc",
  field = "dueAt",
  first = 50,
  organizationId = BUFFER_ORGANIZATION_ID,
} = {}) {
  const data = await bufferGraphql(
    `query Posts($input: PostsInput!, $first: Int) {
      posts(input: $input, first: $first) { edges { node { ${POST_FIELDS} } } }
    }`,
    {input: {organizationId, filter: {status: statuses}, sort: [{field, direction}]}, first},
  );
  return (data?.posts?.edges ?? []).map((edge) => edge.node);
}

export function scheduledPosts(options) {
  return bufferPosts(["scheduled"], options);
}

export function sentPosts(options) {
  return bufferPosts(["sent"], {direction: "desc", ...options});
}

/**
 * Ideas on the Buffer board — the landing point of the Ghost → Zapier → Buffer
 * pipeline. `Idea.createdAt` is epoch SECONDS (Int), not the DateTime string
 * `Post` uses; compare it as a number or it silently sorts as text.
 */
export async function bufferIdeas({first = 20, organizationId = BUFFER_ORGANIZATION_ID} = {}) {
  const data = await bufferGraphql(
    `query Ideas($input: IdeasInput!, $first: Int) {
      ideas(input: $input, first: $first) {
        edges { node { id createdAt updatedAt content { title text services } } }
      }
    }`,
    {input: {organizationId}, first},
  );
  return (data?.ideas?.edges ?? []).map((edge) => edge.node);
}
