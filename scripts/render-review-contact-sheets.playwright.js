async (page) => {
  const root = "/Users/peacock/Projects/grown-men-grow";
  const assetBase = "http://127.0.0.1:8765/assets/drafts";
  const reviewDirectory = `${root}/assets/drafts/review`;

  const numbered = (directory, count) =>
    Array.from({ length: count }, (_, index) => {
      const file = String(index + 1).padStart(2, "0");
      return { label: file, path: `${directory}/${file}.png` };
    });

  const sheets = [
    {
      name: "pinned-introduction",
      title: "Pinned introduction",
      items: numbered("instagram/pinned-introduction", 7),
      columns: 4,
      itemWidth: 300,
      itemHeight: 375,
    },
    {
      name: "foundational-carousel",
      title: "Foundational carousel",
      items: numbered("instagram/foundational-carousel", 7),
      columns: 4,
      itemWidth: 300,
      itemHeight: 375,
    },
    {
      name: "recognition-carousel",
      title: "Recognition carousel",
      items: numbered("instagram/recognition-carousel", 7),
      columns: 4,
      itemWidth: 300,
      itemHeight: 375,
    },
    {
      name: "stories-static-reel",
      title: "Stories, static post, and reel cover",
      items: [
        ...numbered("instagram/launch-stories", 5).map((item) => ({
          ...item,
          label: `Story ${item.label}`,
        })),
        {
          label: "Static post",
          path: "instagram/static-post/fear-with-good-posture.png",
        },
        {
          label: "Reel cover",
          path: "instagram/reel/strength-has-to-grow-up-cover.png",
        },
      ],
      columns: 4,
      itemWidth: 270,
      itemHeight: 480,
    },
    {
      name: "ghost-social-cards",
      title: "Ghost social cards",
      items: [
        { label: "Publication", path: "ghost/social-cards/publication.png" },
        { label: "Start Here", path: "ghost/social-cards/start-here.png" },
        { label: "About", path: "ghost/social-cards/about.png" },
        {
          label: "Essay 1",
          path: "ghost/social-cards/strength-has-to-grow-up.png",
        },
      ],
      columns: 2,
      itemWidth: 600,
      itemHeight: 315,
    },
  ];

  for (const sheet of sheets) {
    await page.setViewportSize({ width: 1500, height: 1000 });
    await page.goto("http://127.0.0.1:8765/");
    await page.setContent(`<!doctype html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { box-sizing: border-box; }
            body {
              margin: 0;
              padding: 42px;
              background: #111518;
              color: #f2ebdd;
              font-family: Helvetica Neue, Arial, sans-serif;
            }
            h1 {
              margin: 0 0 30px;
              font-size: 30px;
              letter-spacing: 0.02em;
            }
            .grid {
              display: grid;
              grid-template-columns: repeat(${sheet.columns}, max-content);
              gap: 26px;
              align-items: start;
            }
            figure { margin: 0; }
            .frame {
              width: ${sheet.itemWidth}px;
              height: ${sheet.itemHeight}px;
              display: grid;
              place-items: center;
              background: #20262b;
              border: 1px solid rgba(242, 235, 221, 0.18);
            }
            img {
              display: block;
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }
            figcaption {
              padding-top: 9px;
              color: rgba(242, 235, 221, 0.72);
              font-size: 15px;
            }
          </style>
        </head>
        <body>
          <h1>${sheet.title}</h1>
          <div class="grid">
            ${sheet.items
              .map(
                (item) => `<figure>
                  <div class="frame"><img src="${assetBase}/${item.path}"></div>
                  <figcaption>${item.label}</figcaption>
                </figure>`,
              )
              .join("")}
          </div>
        </body>
      </html>`);
    await page.waitForLoadState("networkidle");
    await page.screenshot({
      path: `${reviewDirectory}/${sheet.name}.png`,
      fullPage: true,
    });
  }
}
