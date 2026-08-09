#!/usr/bin/env node

import {mkdir, readFile, writeFile} from "node:fs/promises";
import path from "node:path";
import {fileURLToPath} from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const output = path.join(root, "output/playwright");

await mkdir(output, {recursive: true});

const navigation = `<ul class="nav">
  <li class="nav-current"><a href="/output/playwright/theme-home.html">Home</a></li>
  <li><a href="#">Start Here</a></li>
  <li><a href="#">About</a></li>
</ul>`;

function shell(title, body, bodyClass = "") {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <link rel="icon" href="data:,">
  <link rel="stylesheet" href="/theme/assets/css/screen.css">
  <script src="/theme/assets/js/main.js" defer></script>
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#site-content">Skip to content</a>
  <div class="site-shell">
    <header class="site-header" data-site-header>
      <div class="site-header__rule" aria-hidden="true"></div>
      <div class="site-header__inner">
        <a class="site-brand" href="/output/playwright/theme-home.html" aria-label="Grown Men Grow home"><span class="site-brand__name">Grown Men Grow</span></a>
        <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="site-navigation" data-menu-toggle><span class="menu-toggle__label">Menu</span><span class="menu-toggle__lines" aria-hidden="true"></span></button>
        <nav class="site-navigation" id="site-navigation" aria-label="Primary navigation" data-site-navigation>${navigation}</nav>
        <div class="site-actions"><button class="gh-search" type="button" aria-label="Search">⌕</button><a class="button button--small" href="#">Subscribe</a></div>
      </div>
    </header>
    <main class="site-main" id="site-content">${body}</main>
    <footer class="site-footer">
      <div class="site-footer__inner">
        <div class="site-footer__brand"><a class="site-footer__title" href="/output/playwright/theme-home.html">Grown Men Grow</a><p>Essays on the unfinished work of being a man.</p></div>
        <nav class="site-footer__nav" aria-label="Secondary navigation">${navigation}</nav>
        <p class="site-footer__meta">© 2026 Grown Men Grow</p>
      </div>
    </footer>
  </div>
</body>
</html>`;
}

function featurePicture(source, alt) {
  return `<picture class="feature-image"><img src="${source}" alt="${escapeHtml(alt)}" width="1600" height="1000" loading="eager"></picture>`;
}

function escapeHtml(value) {
  const entities = {"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"};
  return value.replace(/[&<>"]/g, (character) => entities[character]);
}

function inlineMarkdown(value) {
  return escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

async function markdownPage(relativePath) {
  const raw = await readFile(path.join(root, relativePath), "utf8");
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`${relativePath} is missing front matter.`);

  const metadata = Object.fromEntries(match[1].split("\n").map((line) => {
    const separator = line.indexOf(":");
    return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()];
  }));
  const content = match[2].trim().split(/\n{2,}/).map((block) => {
    if (block.startsWith("## ")) return `<h2>${inlineMarkdown(block.slice(3))}</h2>`;
    return `<p>${inlineMarkdown(block.replaceAll("\n", " "))}</p>`;
  }).join("\n");

  return {metadata, content};
}

const home = `<section class="publication-masthead">
  <div class="publication-masthead__inner"><p class="eyebrow">Essays</p><h1>Grown Men Grow</h1><p class="publication-masthead__deck">Essays on the unfinished work of being a man.</p></div>
  <div class="publication-masthead__mark" aria-hidden="true">01</div>
</section>
<section class="post-feed-wrap" aria-label="Latest writing">
  <div class="post-feed">
    <article class="post-card post-card--feature">
      <a class="post-card__media" href="/output/playwright/theme-post.html" aria-label="Read Strength Has to Grow Up">${featurePicture("/assets/drafts/ghost/feature-images/strength-has-to-grow-up.png", "A wooden chair mid-repair in a bright home workshop, framed in a paper collage")}</a>
      <div class="post-card__body"><div class="post-card__kicker"><span>Field Note</span><span aria-hidden="true">/</span><time datetime="2026-08-07">Aug 7, 2026</time></div><h2 class="post-card__title"><a href="/output/playwright/theme-post.html">Strength Has to Grow Up</a></h2><p class="post-card__excerpt">A man can look strong and still be hiding.</p><div class="post-card__footer"><span>11 min read</span><a class="text-link" href="/output/playwright/theme-post.html">Read <span aria-hidden="true">→</span></a></div></div>
    </article>
    <article class="post-card">
      <a class="post-card__media" href="#">${featurePicture("/assets/drafts/ghost/feature-images/start-here.png", "A sunlit writing table with an open notebook and healthy plants, framed in a paper collage")}</a>
      <div class="post-card__body"><div class="post-card__kicker"><span>Recognition</span><span aria-hidden="true">/</span><time datetime="2026-08-07">Aug 7, 2026</time></div><h2 class="post-card__title"><a href="#">A Confession Can Still Be Selfish</a></h2><p class="post-card__excerpt">Opening up matters. Disclosure is not the same thing as repair.</p><div class="post-card__footer"><span>Field note</span><a class="text-link" href="#">Read <span aria-hidden="true">→</span></a></div></div>
    </article>
    <article class="post-card">
      <a class="post-card__media" href="#">${featurePicture("/assets/drafts/ghost/feature-images/about.png", "Layered paper collage of oxblood, green, and rust fields with tape and drawn marks")}</a>
      <div class="post-card__body"><div class="post-card__kicker"><span>Marginalia</span><span aria-hidden="true">/</span><time datetime="2026-08-07">Aug 7, 2026</time></div><h2 class="post-card__title"><a href="#">Fear With Good Posture</a></h2><p class="post-card__excerpt">A strategy can save a boy and still limit the man he becomes.</p><div class="post-card__footer"><span>Field note</span><a class="text-link" href="#">Read <span aria-hidden="true">→</span></a></div></div>
    </article>
  </div>
</section>`;

const post = `<article class="article post">
  <header class="article-header">
    <div class="article-header__inner">
      <div class="article-header__kicker"><span>Field Note</span><span>Issue 2026.08</span></div>
      <h1>Strength Has to Grow Up</h1>
      <p class="article-header__deck">A man can look strong and still be hiding.</p>
      <div class="article-header__meta"><span class="article-header__brand">Grown Men Grow</span><span class="article-header__byline">By <a href="#">Michael Peacock</a></span><time datetime="2026-08-07">August 7, 2026</time><span>11 min read</span></div>
    </div>
    <figure class="article-header__figure">${featurePicture("/assets/drafts/ghost/feature-images/strength-has-to-grow-up.png", "A wooden chair mid-repair in a bright home workshop, framed in a paper collage")}<figcaption>Grown Men Grow / Field Note 01</figcaption></figure>
  </header>
  <div class="article-content gh-content">
    <p>I used to think composure was one of my better qualities.</p>
    <p>Sometimes it was.</p>
    <p>Other times I had simply left the building emotionally while keeping my face normal.</p>
    <p>From the outside, the distinction was not obvious. My voice stayed level. I could choose precise words. I knew how to keep a difficult conversation from becoming visibly chaotic.</p>
    <p>That looked like steadiness.</p>
    <p>The person across from me may have experienced it as talking to a well-dressed wall.</p>
    <h2>Looking the part</h2>
    <p>Most of us were taught some version of the part.</p>
    <p>The details vary, but the broad instruction is familiar. Be useful. Do not panic. Know what to do. Do not need too much from anyone. If something hurts, get it under control before other people have to see it.</p>
    <blockquote><p>Strength tells us what a man can do. It does not tell us what he serves.</p></blockquote>
    <p>A lot of that training is valuable. I do not want a world without male courage, discipline, physical strength, duty, competence, or the willingness to step forward when something difficult has to be done.</p>
    <h2>A confession can still be selfish</h2>
    <p>Men are regularly told to open up more.</p>
    <p>That is generally good advice. It is also incomplete.</p>
    <p>Opening up is not the same as growing up.</p>
    <figure class="kg-image-card kg-width-wide"><img class="kg-image" src="/assets/source/editorial/friends-in-conversation.png" alt="Two men talking on front steps in daylight"><figcaption>Real vulnerability leaves room for an answer you do not want.</figcaption></figure>
    <p>Disclosure matters. Repair is what comes next.</p>
    <h2>Strength is what it serves</h2>
    <p>Strength is easy to admire in the abstract.</p>
    <p>It gets more complicated in a kitchen at midnight when a marriage is in trouble. Or in a hospital room when a parent is becoming fragile. Or in the parking lot after a custody exchange.</p>
    <p>That is where strength shows its character.</p>
  </div>
  <footer class="article-footer">
    <div class="article-tags"><span class="eyebrow">Filed under</span><a href="#">Strength</a><a href="#">Growth</a></div>
    <section class="signup-panel"><p class="eyebrow">Grown Men Grow</p><h2>Grown Men Grow</h2><p>Essays on the unfinished work of being a man.</p><a class="button button--paper" href="#">Subscribe</a></section>
    <div class="article-authors"><section class="author-card author-card--no-image"><div><p class="eyebrow">Contributor</p><h2><a href="#">Michael Peacock</a></h2></div></section></div>
  </footer>
</article>`;

const startHereSource = await markdownPage("content/ghost/start-here.md");
const aboutSource = await markdownPage("content/ghost/about.md");

const startHere = `<article class="page page--start-here">
  <header class="page-header page-header--statement"><p class="eyebrow">Grown Men Grow</p><h1>${escapeHtml(startHereSource.metadata.title)}</h1></header>
  <figure class="page-feature page-feature--start-here">${featurePicture("/assets/drafts/ghost/feature-images/start-here.png", "A sunlit writing table with an open notebook and healthy plants, framed in a paper collage")}</figure>
  <div class="page-content gh-content">${startHereSource.content}</div>
  <section class="signup-panel signup-panel--page"><p class="eyebrow">Newsletter</p><h2>Grown Men Grow</h2><p>Essays on the unfinished work of being a man.</p><a class="button button--paper" href="#">Subscribe</a></section>
</article>`;

const about = `<article class="page page--about">
  <header class="page-header page-header--split"><p class="eyebrow">Grown Men Grow</p><h1>${escapeHtml(aboutSource.metadata.title)}</h1></header>
  <figure class="page-feature">${featurePicture("/assets/drafts/ghost/feature-images/about.png", "Layered paper collage of oxblood, green, and rust fields with tape and drawn marks")}</figure>
  <div class="page-content gh-content">${aboutSource.content}</div>
</article>`;

await writeFile(path.join(output, "theme-home.html"), shell("Grown Men Grow", home, "home-template"));
await writeFile(path.join(output, "theme-post.html"), shell("Strength Has to Grow Up", post, "post-template"));
await writeFile(path.join(output, "theme-start-here.html"), shell("Start Here", startHere, "page-template page-start-here"));
await writeFile(path.join(output, "theme-about.html"), shell("About", about, "page-template page-about"));

console.log(`Rendered four static Ghost theme previews to ${output}.`);
