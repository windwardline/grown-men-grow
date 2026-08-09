async (page) => {
  const root = "/Users/peacock/Projects/grown-men-grow";
  const baseUrl = "http://127.0.0.1:8765/assets/drafts";

  const numbered = (count) =>
    Array.from({ length: count }, (_, index) =>
      String(index + 1).padStart(2, "0"),
    );

  const groups = [
    {
      directory: "instagram/pinned-introduction",
      files: numbered(7),
      width: 1080,
      height: 1350,
    },
    {
      directory: "instagram/foundational-carousel",
      files: numbered(7),
      width: 1080,
      height: 1350,
    },
    {
      directory: "instagram/recognition-carousel",
      files: numbered(7),
      width: 1080,
      height: 1350,
    },
    {
      directory: "instagram/static-post",
      files: ["fear-with-good-posture"],
      width: 1080,
      height: 1350,
    },
    {
      directory: "instagram/launch-stories",
      files: numbered(5),
      width: 1080,
      height: 1920,
    },
    {
      directory: "instagram/reel",
      files: ["strength-has-to-grow-up-cover"],
      width: 1080,
      height: 1920,
    },
    {
      directory: "ghost/social-cards",
      files: [
        "publication",
        "start-here",
        "about",
        "strength-has-to-grow-up",
      ],
      width: 1200,
      height: 630,
    },
  ];

  for (const group of groups) {
    await page.setViewportSize({ width: group.width, height: group.height });

    for (const file of group.files) {
      const relativePath = `${group.directory}/${file}`;
      await page.goto(`${baseUrl}/${relativePath}.svg`, { waitUntil: "load" });
      await page.screenshot({
        path: `${root}/assets/drafts/${relativePath}.png`,
      });
    }
  }
}
