import os from "node:os";
import {Buffer} from "node:buffer";
import {createHmac} from "node:crypto";
import {execFileSync} from "node:child_process";

// Admin requests go to the Ghost(Pro) host, never the custom apex. The apex
// 302-redirects every admin path here, and because that hop is cross-origin a
// compliant client strips the Authorization header before replaying it, so the
// request arrives unauthenticated and comes back 403 NoPermissionError. The host
// is fixed rather than configurable so the wrong one cannot be guessed.
export const GHOST_ADMIN_HOST = "https://grown-men-grow.ghost.io";

// Pinned to the live instance's major (Ghost 6.57 as of 2026-08-11), not a
// version behind it: Ghost supports only the current major and the one before,
// so a v5 pin would break on the next platform upgrade with nothing local to
// explain it. Verified shape-identical to v5.0 on every endpoint these tasks
// touch — site, posts, members, newsletters, tiers, settings, users.
export const GHOST_API_VERSION = "v6.0";

// The credential policy stores each secret under the operator's own login
// account, so the account is derived rather than written out — this path is
// covered by the publication-voice rule that keeps the founder's name out of it.
const KEYCHAIN_SERVICE = "ghost-admin-api";
const KEYCHAIN_ACCOUNT = os.userInfo().username;
const TOKEN_TTL_SECONDS = 300;
const KEY_SHAPE = /^[^:]{24}:[0-9a-f]{64}$/i;

// Read the key at call time and keep it in a local. It never becomes module
// state, and nothing in this file returns, prints, or logs the key or a token.
function readAdminKey() {
  let raw;
  try {
    raw = execFileSync(
      "security",
      ["find-generic-password", "-a", KEYCHAIN_ACCOUNT, "-s", KEYCHAIN_SERVICE, "-w"],
      {encoding: "utf8", stdio: ["ignore", "pipe", "pipe"]},
    );
  } catch (error) {
    const detail = String(error.stderr ?? "").trim() || error.message;
    throw new Error(`Cannot read Keychain item "${KEYCHAIN_SERVICE}" (account ${KEYCHAIN_ACCOUNT}): ${detail}`);
  }

  const key = raw.trim();
  if (!KEY_SHAPE.test(key)) {
    throw new Error(`Keychain item "${KEYCHAIN_SERVICE}" is not a Ghost Admin key; expected <24-char id>:<64-char hex secret>.`);
  }

  const [id, secret] = key.split(":");
  return {id, secret};
}

function encodeSegment(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function signToken({id, secret}) {
  const issuedAt = Math.floor(Date.now() / 1000);
  const signingInput = [
    encodeSegment({alg: "HS256", typ: "JWT", kid: id}),
    encodeSegment({iat: issuedAt, exp: issuedAt + TOKEN_TTL_SECONDS, aud: "/admin/"}),
  ].join(".");

  // The stored secret is hex. Signing its ASCII form yields a well-formed token
  // that Ghost rejects with the same 403 a bad key produces.
  const signature = createHmac("sha256", Buffer.from(secret, "hex"))
    .update(signingInput)
    .digest("base64url");

  return `${signingInput}.${signature}`;
}

function resolveUrl(endpoint, searchParams) {
  const raw = String(endpoint);
  if (raw.includes("?")) {
    throw new Error(`Ghost Admin endpoint "${raw}" carries a query string; pass it as searchParams instead.`);
  }

  const resource = raw.replace(/^\/+/, "").replace(/^ghost\/api\/admin\//, "");
  const url = new URL(`/ghost/api/admin/${resource.endsWith("/") ? resource : `${resource}/`}`, GHOST_ADMIN_HOST);
  for (const [name, value] of Object.entries(searchParams ?? {})) {
    if (value !== undefined && value !== null) url.searchParams.set(name, String(value));
  }
  return url;
}

// FormData goes out untouched so fetch can set its own multipart boundary.
// Anything else must be JSON-serialisable: a Buffer or Blob would otherwise be
// stringified into a JSON integer array and fail far from its cause.
function encodeBody(body) {
  if (body === undefined || body instanceof FormData) return body;
  const serialisable = body !== null
    && typeof body === "object"
    && !ArrayBuffer.isView(body)
    && !(body instanceof ArrayBuffer)
    && !(body instanceof Blob);
  if (!serialisable) {
    throw new Error("Ghost Admin body must be a JSON-serialisable object or FormData; binary uploads go through FormData.");
  }
  return JSON.stringify(body);
}

async function readPayload(response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function describeFailure(status, payload, url) {
  const detail = Array.isArray(payload?.errors) ? payload.errors[0] : null;
  const reason = detail?.message ?? (typeof payload === "string" ? payload.slice(0, 200) : "no error body");
  // A 403 cannot be the apex trap here, so it points at the key itself.
  const hint = status === 403
    ? " On this host a 403 means the key or its integration permissions, not the hostname."
    : "";
  return `Ghost Admin ${status} on ${url.pathname}: ${reason}.${hint}`;
}

/**
 * Issue a signed Ghost Admin API request. Pass a resource path ("posts/",
 * "site/", "images/upload/") and query values as searchParams. A plain object
 * body is sent as JSON; a FormData body is sent as-is for uploads. Resolves to
 * the parsed response and throws on any non-2xx.
 */
export async function ghostAdmin(endpoint, {
  method = "GET",
  searchParams,
  body,
  headers = {},
  timeoutMs = 30000,
} = {}) {
  const url = resolveUrl(endpoint, searchParams);
  const isMultipart = body instanceof FormData;
  const encodedBody = encodeBody(body);

  // Built through Headers, not object spread: header names are case-insensitive
  // on the wire, so a caller passing "authorization" would be appended to the
  // signed one rather than replaced, and Ghost would read a malformed scheme.
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Authorization", `Ghost ${signToken(readAdminKey())}`);
  requestHeaders.set("Accept-Version", GHOST_API_VERSION);
  if (isMultipart) requestHeaders.delete("Content-Type");
  else if (body !== undefined) requestHeaders.set("Content-Type", "application/json");

  const response = await fetch(url, {
    method,
    headers: requestHeaders,
    body: encodedBody,
    // Never follow a redirect: a cross-origin hop drops the Authorization header
    // and the destination answers 403, which reads like a credential failure.
    redirect: "manual",
    signal: AbortSignal.timeout(timeoutMs),
  });

  if (response.status >= 300 && response.status < 400) {
    throw new Error(`Ghost Admin ${method} ${url.pathname} was redirected (${response.status}); redirects are not followed because they strip integration auth.`);
  }

  const payload = await readPayload(response);
  if (!response.ok) {
    const error = new Error(describeFailure(response.status, payload, url));
    error.status = response.status;
    throw error;
  }
  return payload;
}

/**
 * The credential probe. Returns the status rather than throwing so a caller can
 * report it plainly; every other call throws on failure. It reads a post rather
 * than /site/ because /site/ answers 200 with no Authorization header at all,
 * which proves reachability but nothing about the key.
 */
export async function probeGhostAdmin() {
  try {
    await ghostAdmin("posts/", {searchParams: {limit: 1, fields: "id"}});
    return {ok: true, status: 200};
  } catch (error) {
    return {ok: false, status: error.status ?? null, message: error.message};
  }
}

/**
 * The week's essay: the most recently published post, or null when nothing has
 * published. Ordered explicitly so a draft edited today cannot outrank it, and
 * matched on both terminal states — Ghost marks an email-only post `sent`, not
 * `published`, and filtering on `published` alone would skip it and silently
 * return the previous week's essay.
 */
export async function latestPublishedPost({fields = "id,slug,title,url,published_at,status"} = {}) {
  const payload = await ghostAdmin("posts/", {
    searchParams: {filter: "status:[published,sent]", order: "published_at desc", limit: 1, fields},
  });
  return payload?.posts?.[0] ?? null;
}
