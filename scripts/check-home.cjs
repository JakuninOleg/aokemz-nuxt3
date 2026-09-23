const { chromium } = require(process.env.KEMZ_NODE_MODULES + "/playwright");
const fs = require("node:fs/promises");
const baseUrl = process.env.KEMZ_BASE_URL || "http://127.0.0.1:3000";

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.KEMZ_CHROMIUM,
    headless: true,
  });
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("response", (response) => {
    if (response.status() >= 400)
      errors.push(`${response.status()} ${response.url()}`);
  });
  await fs.mkdir("artifacts/home", { recursive: true });
  for (const [width, height] of [
    [2560, 1440],
    [1440, 900],
    [1024, 768],
    [768, 1024],
    [430, 932],
    [390, 844],
    [360, 800],
  ]) {
    await page.setViewportSize({ width, height });
    await page.goto(`${baseUrl}/`, { waitUntil: "networkidle" });
    await page.evaluate(() => document.fonts.ready);
    await page.addStyleTag({
      content:
        "nuxt-devtools-frame, #nuxt-devtools-container { display: none !important; }",
    });
    await page.locator("footer").scrollIntoViewIfNeeded();
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.screenshot({
      path: `artifacts/home/${width}-full.png`,
      fullPage: true,
    });
    await page.screenshot({ path: `artifacts/home/${width}-first.png` });
    console.log(
      JSON.stringify(
        await page.evaluate(() => ({
          width: innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          h1: document.querySelector("h1")?.textContent,
          brokenImages: [...document.images]
            .filter((i) => !i.complete || !i.naturalWidth)
            .map((i) => i.src),
          sections: [...document.querySelectorAll(".kemz-home > section")].map(
            (e) => ({
              class: e.className,
              height: Math.round(e.getBoundingClientRect().height),
            }),
          ),
        })),
      ),
    );
  }
  console.log(
    "Headings:",
    await page.locator("h1").evaluate((e) => ({
      font: getComputedStyle(e).fontFamily,
      weight: getComputedStyle(e).fontWeight,
    })),
  );
  console.log("Browser errors:", JSON.stringify([...new Set(errors)]));
  await browser.close();
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
