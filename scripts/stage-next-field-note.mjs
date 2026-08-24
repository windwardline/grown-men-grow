// Stage the next field note in `docs/technical/publication-order.md` as a Ghost
// post scheduled for the coming Tuesday 8:00 AM ET slot, with the newsletter
// bound. Mirrors the shape of the already-scheduled Field Note 2.
//
// The newsletter binds ONLY on the draft -> scheduled transition, via query
// params on that PUT; setting it on an already-scheduled post is silently
// ignored. Verified afterwards with ?include=newsletter.
import fs from "node:fs";
import path from "node:path";
import {fileURLToPath} from "node:url";
import {ghostAdmin} from "./lib/ghost-admin.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const [, , SLUG, PUBLISH_AT_UTC] = process.argv;
if (!SLUG || !PUBLISH_AT_UTC) {
  console.error("usage: node scripts/stage-next-field-note.mjs <slug> <ISO-utc>");
  console.error("  slug: lowest-numbered note in docs/technical/publication-order.md with no Ghost post");
  process.exit(1);
}

const source = fs.readFileSync(path.join(root, `content/field-notes/${SLUG}.md`), "utf8");
const front = Object.fromEntries(
  source.split("---")[1].trim().split("\n")
    .map((line) => [line.slice(0, line.indexOf(":")).trim(), line.slice(line.indexOf(":") + 1).trim()]),
);

// The Ghost essay is the block between its heading and the next top-level one.
const body = source.split("# Ghost essay source")[1].split("\n# ")[0].trim();
const html = body.split(/\n{2,}/).map((para) => {
  const block = para.trim();
  if (block.startsWith("## ")) return `<h2>${block.slice(3).trim()}</h2>`;
  const inline = block
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");
  return `<p>${inline.replace(/\n/g, " ")}</p>`;
}).join("\n");

// Feature image -> Ghost storage.
const imagePath = path.join(root, `assets/drafts/ghost/feature-images/${SLUG}.png`);
const form = new FormData();
form.append("file", new Blob([fs.readFileSync(imagePath)], {type: "image/png"}), `${SLUG}.png`);
form.append("purpose", "image");
const upload = await ghostAdmin("images/upload/", {method: "POST", body: form});
const featureImage = upload.images[0].url;
console.log("feature image:", featureImage);

// Create as draft, then transition to scheduled so the newsletter binds.
const created = await ghostAdmin("posts/", {
  method: "POST",
  body: {
    posts: [{
      title: front.title,
      slug: front.slug,
      html,
      status: "draft",
      custom_excerpt: front.preview,
      meta_title: `${front.title} | Grown Men Grow`,
      meta_description: front.dek,
      feature_image: featureImage,
      visibility: "public",
      email_subject: front.email_subject,
    }],
  },
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

const check = await ghostAdmin(`posts/${draft.id}/`, {searchParams: {include: "newsletter"}});
const post = check.posts[0];
console.log("\nVERIFY");
console.log("  status      :", post.status);
console.log("  published_at:", post.published_at);
console.log("  newsletter  :", post.newsletter ? post.newsletter.slug : "NONE — email would not send");
console.log("  email_segment:", post.email_segment);
console.log("  feature     :", post.feature_image ? "set" : "MISSING");
console.log("  excerpt     :", post.custom_excerpt);
console.log("  html length :", (post.html || "").length);
