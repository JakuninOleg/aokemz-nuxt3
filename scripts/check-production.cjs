const assert = require("node:assert/strict");
const fs = require("node:fs/promises");
const { chromium } = require(process.env.KEMZ_NODE_MODULES + "/playwright");

const baseUrl = process.env.KEMZ_BASE_URL || "http://127.0.0.1:3000";
const viewports = [[1440, 900], [1024, 768], [390, 844]];

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.KEMZ_CHROMIUM, headless: true });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("response", (response) => { if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`); });
  await fs.mkdir("artifacts/production", { recursive: true });
  try {
    for (const [width, height] of viewports) {
      await page.setViewportSize({ width, height });
      await page.goto(`${baseUrl}/production`, { waitUntil: "networkidle" });
      await page.evaluate(() => document.fonts.ready);
      const cookies = page.getByRole("button", { name: "Только необходимые", exact: true });
      if (await cookies.isVisible()) await cookies.click();
      await page.addStyleTag({ content: "nuxt-devtools-frame, #nuxt-devtools-container, #nuxt-devtools-anchor { display:none !important; }" });
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(await page.locator(".production-stages > li").count(), 5);
      assert.equal(await page.locator(".production-capabilities > li").count(), 4);
      assert.equal(await page.locator(".production-gallery figure").count(), 5);
      assert(await page.locator(".site-header--reference").count(), "shared header missing");
      assert(await page.locator(".site-footer").count(), "shared footer missing");
      await page.screenshot({ path: `artifacts/production/${width}-first.png` });
      for (const image of await page.locator("img[loading='lazy']").all()) { await image.scrollIntoViewIfNeeded(); await page.waitForTimeout(100); }
      await page.waitForTimeout(400);
      const result = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, brokenImages: [...document.images].filter((image) => !image.complete || !image.naturalWidth).map((image) => image.currentSrc || image.src) }));
      assert.equal(result.overflow, false, `${width}px has horizontal overflow`);
      assert.deepEqual(result.brokenImages, [], `${width}px has broken images`);
      await page.screenshot({ path: `artifacts/production/${width}-full.png`, fullPage: true });
      console.log(JSON.stringify({ viewport: `${width}x${height}`, ...result }));
    }
    console.log("Browser errors:", JSON.stringify([...new Set(errors)]));
  } finally { await browser.close(); }
}
main().catch((error) => { console.error(error); process.exitCode = 1; });
