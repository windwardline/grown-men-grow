// Stage the next field note in `docs/technical/publication-order.md` as a Ghost
// post scheduled for the coming Tuesday 8:00 AM ET slot, with the newsletter
// bound.
//
// The newsletter binds ONLY on the draft -> scheduled transition, via query
// params on that PUT; setting it on an already-scheduled post is silently
// ignored. Verified afterwards with ?include=newsletter.
//
// `--dry-run` builds the payloads from the approved source and prints them
// without touching the network. Precisely: it proves the payload the real run
// would send, on the real note, every week. It does NOT exercise the three
// Ghost calls below or the order they happen in — those are still first run for
// real on the day they are needed. Everything under the argument check went
// unexecuted from the day this shipped until 2026-08-24, because the register
// always held a scheduled slot and so the Monday task never staged anything.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {assertPublishInstant, buildPostPayload, parseStagingArgs} from "./lib/field-note-post.mjs";
import {findPostBySlug, ghostAdmin} from "./lib/ghost-admin.mjs";

// Stands in for the image URL while the payload is built and validated ahead of
// the upload that produces the real one.
const PENDING_UPLOAD = "pending-upload";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
// Parsed strictly, in the library, where tests reach it. A near miss on the
// flag — `--dry-runn`, `--dryrun`, a stray space — would otherwise leave both
// positionals intact and turn a verification run into a real one that binds a
// newsletter send. See parseStagingArgs for why nothing downstream catches it.
let SLUG;
let PUBLISH_AT_UTC;
let DRY_RUN;
try {
  ({slug: SLUG, publishAt: PUBLISH_AT_UTC, dryRun: DRY_RUN} = parseStagingArgs(process.argv.slice(2)));
} catch (error) {
  console.error(error.message);
  console.error("usage: node scripts/stage-next-field-note.mjs <slug> <ISO-utc> [--dry-run]");
  console.error("  slug: lowest-numbered note in docs/technical/publication-order.md with no Ghost post");
  console.error("  --dry-run: build and print the payloads, make no network call");
  process.exit(1);
}

// Checked HERE, not at the PUT that uses it. That PUT is the third network call,
// so a bad timestamp caught there leaves an uploaded PNG and an orphaned draft
// behind it, on the morning the slot is due. The predicate itself lives in the
// library so tests can reach it; only the ordering is this file's business.
if (PUBLISH_AT_UTC) {
  try {
    assertPublishInstant(PUBLISH_AT_UTC);
  } catch (error) {
    console.error(error.message);
    process.exit(1);
  }
}

const sourcePath = path.join(root, `content/field-notes/${SLUG}.md`);
if (!fs.existsSync(sourcePath)) {
  console.error(`No approved field note at content/field-notes/${SLUG}.md`);
  process.exit(1);
}
const source = fs.readFileSync(sourcePath, "utf8");

const imagePath = path.join(root, `assets/drafts/ghost/feature-images/${SLUG}.png`);
if (!fs.existsSync(imagePath)) {
  console.error(`No feature image at assets/drafts/ghost/feature-images/${SLUG}.png`);
  process.exit(1);
}

if (DRY_RUN) {
  // Built against a placeholder URL, because the upload is the one input the
  // payload cannot have offline. What this proves is the payload; the upload,
  // the POST, the draft->scheduled PUT and its newsletter binding, and the
  // verify read are all below and none of them run here.
  const payload = buildPostPayload({source, featureImage: "https://storage.ghost.io/<uploaded-at-run-time>.png"});
  console.log("DRY RUN — no network call made\n");
  console.log("  source      :", path.relative(root, sourcePath));
  console.log("  feature png :", path.relative(root, imagePath), `(${fs.statSync(imagePath).size} bytes)`);
  console.log("  title       :", payload.title);
  console.log("  slug        :", payload.slug);
  console.log("  email_subject:", payload.email_subject);
  console.log("  excerpt     :", payload.custom_excerpt);
  console.log("  meta_title  :", payload.meta_title);
  console.log("  meta_desc   :", payload.meta_description);
  console.log("  alt text    :", payload.feature_image_alt ?? "MISSING — the feature image will ship with no alt text");
  console.log("  html length :", payload.html.length);
  console.log("  publish_at  :", PUBLISH_AT_UTC ?? "(not given; required for a real run)");
  console.log("\n--- html ---");
  console.log(payload.html);
} else {
  // No process.exit() after that dump. stdout is a pipe when the weekly task
  // captures this output, Node writes to a pipe asynchronously, and exit()
  // does not flush what is still queued — a silently truncated HTML dump is
  // the exact failure this script exists to stop. Let the module end instead.

  // A READ, so it keeps the validate-before-mutate ordering intact. Ghost
  // suffixes a duplicate slug rather than refusing it, so re-running this
  // command for an already-staged week would create a SECOND post and schedule
  // it with the newsletter bound to everyone — two sends of one essay, and the
  // verification block below would print a clean result for the duplicate
  // because it only reads back the post it just made. Until now the only thing
  // preventing that was the sentence in publication-order.md telling the
  // operator to pick a note with no Ghost post, and a rule that lives in prose
  // is the shape of guard this repository keeps finding it cannot rely on.
  const existing = await findPostBySlug(SLUG);
  if (existing) {
    throw new Error(`${SLUG} already has a Ghost post (${existing.status}, id ${existing.id}); refusing to create a second one that would send the newsletter again.`);
  }

  // Built BEFORE the upload, because building is where the validation lives:
  // buildPostPayload throws on missing frontmatter, on a note that is not
  // founder-approved, on an absent essay heading, and on an empty essay body.
  // AGENTS.md states the rule outright — validate before mutating. Calling it
  // after the upload would leave an orphaned PNG in Ghost storage and a stack
  // trace, on the morning the slot is due. The image URL is the one field that
  // cannot exist yet, so it is attached below rather than waited for here.
  const payload = buildPostPayload({source, featureImage: PENDING_UPLOAD});

  // Feature image -> Ghost storage.
  const form = new FormData();
  form.append("file", new Blob([fs.readFileSync(imagePath)], {type: "image/png"}), `${SLUG}.png`);
  form.append("purpose", "image");
  const upload = await ghostAdmin("images/upload/", {method: "POST", body: form});
  payload.feature_image = upload.images?.[0]?.url;
  // Re-checked after the assignment, because passing a placeholder into
  // buildPostPayload to get validate-before-mutate ordering made its own
  // featureImage guard unreachable from here. Without this, an upload that
  // answered without a URL would drop the key on serialisation and the post
  // would be created AND scheduled with the newsletter bound and no feature
  // image — worse than the crash it replaced, which created nothing.
  if (!payload.feature_image) {
    throw new Error("Ghost image upload returned no URL; refusing to create a post whose feature image would be empty.");
  }
  console.log("feature image:", payload.feature_image);

  // Create as draft, then transition to scheduled so the newsletter binds.
  const created = await ghostAdmin("posts/", {
    method: "POST",
    body: {posts: [payload]},
    searchParams: {source: "html"},
  });
  const draft = created.posts[0];
  console.log("draft:", draft.id, draft.slug);

  const scheduled = await ghostAdmin(`posts/${draft.id}/`, {
    method: "PUT",
    body: {posts: [{status: "scheduled", published_at: PUBLISH_AT_UTC, updated_at: draft.updated_at}]},
    searchParams: {newsletter: "default-newsletter", email_segment: "all"},
  });
  console.log("scheduled:", scheduled.posts[0].status, scheduled.posts[0].published_at);

  // Verified with `include` and NO `fields`: Ghost applies `fields` after
  // `include` and drops the relation it just fetched, so a query passing both
  // reports `newsletter: NONE` on a correctly bound post.
  const check = await ghostAdmin(`posts/${draft.id}/`, {searchParams: {include: "newsletter"}});
  const post = check.posts[0];
  console.log("\nVERIFY");
  console.log("  status      :", post.status);
  console.log("  published_at:", post.published_at);
  console.log("  newsletter  :", post.newsletter ? post.newsletter.slug : "NONE — email would not send");
  console.log("  email_segment:", post.email_segment);
  console.log("  feature     :", post.feature_image ? "set" : "MISSING");
  console.log("  alt text    :", post.feature_image_alt || "MISSING — the feature image ships with no alt text");
  console.log("  excerpt     :", post.custom_excerpt);
  console.log("  html length :", (post.html || "").length);
}
