const { chromium } = require(process.env.KEMZ_NODE_MODULES + "/playwright");
const fs = require("node:fs/promises");

const baseUrl = process.env.KEMZ_BASE_URL || "http://127.0.0.1:3000";
const viewports = [
  [2560, 1440],
  [814, 1000],
  [1440, 900],
  [1024, 768],
  [390, 844],
];

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.KEMZ_CHROMIUM,
    headless: true,
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await fs.mkdir("artifacts/about", { recursive: true });

  try {
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto(`${baseUrl}/about`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const necessaryCookies = page.getByRole("button", {
        name: "Только необходимые",
        exact: true,
      });
      if (await necessaryCookies.isVisible()) await necessaryCookies.click();
      if ((await page.locator(".kemz-about > section").count()) !== 10) {
        throw new Error(`About page did not render at ${width}px`);
      }
      await page.addStyleTag({
        content:
          "nuxt-devtools-frame, #nuxt-devtools-container, #nuxt-devtools-anchor { display: none !important; }",
      });
      await page.screenshot({ path: `artifacts/about/${width}-first.png` });
      for (const image of await page.locator("img[loading='lazy']").all()) {
        if (!(await image.isVisible())) continue;
        await image.scrollIntoViewIfNeeded();
        await page.waitForTimeout(120);
      }
      await page.waitForTimeout(900);
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({
        path: `artifacts/about/${width}-full.png`,
        fullPage: true,
      });
      const problems = await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(
          (image) => !image.complete || !image.naturalWidth,
        ).length,
        h1Count: document.querySelectorAll("h1").length,
        filmLinks: [...document.querySelectorAll("a,button")].some((el) =>
          /Фильм о заводе/.test(el.textContent || ""),
        ),
        catalog: document
          .querySelector(".abt-hero__actions a")
          ?.getAttribute("href"),
      }));
      if (
        problems.overflow ||
        problems.brokenImages ||
        problems.h1Count !== 1 ||
        problems.filmLinks ||
        problems.catalog !== "/products"
      ) {
        throw new Error(
          `About QA failed at ${width}px: ${JSON.stringify(problems)}`,
        );
      }
      for (const section of [
        "abt-story",
        "abt-people",
        "abt-cycle",
        "abt-caps",
        "abt-quality",
        "abt-geo",
      ]) {
        await page
          .locator(`.${section}`)
          .screenshot({ path: `artifacts/about/${width}-${section}.png` });
      }
      console.log(
        JSON.stringify(
          await page.evaluate(() => ({
            viewport: `${innerWidth}x${innerHeight}`,
            scrollWidth: document.documentElement.scrollWidth,
            title: document.title,
            h1: document.querySelector("h1")?.textContent?.trim(),
            brokenImages: [...document.images]
              .filter((image) => !image.complete || !image.naturalWidth)
              .map((image) => image.currentSrc || image.src),
            sections: [
              ...document.querySelectorAll(".kemz-about > section"),
            ].map((section) => ({
              className: section.className,
              height: Math.round(section.getBoundingClientRect().height),
            })),
          })),
        ),
      );
    }
    console.log("Browser errors:", JSON.stringify([...new Set(errors)]));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
