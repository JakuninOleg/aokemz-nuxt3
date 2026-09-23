const { chromium } = require(process.env.KEMZ_NODE_MODULES + "/playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs/promises");

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.KEMZ_CHROMIUM,
    headless: true,
  });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await fs.mkdir("artifacts/category", { recursive: true });
    for (const [width, height] of [
      [1440, 900],
      [1024, 768],
      [390, 844],
    ]) {
      await page.setViewportSize({ width, height });
      await page.goto("http://127.0.0.1:3000/products/excavator", {
        waitUntil: "networkidle",
      });
      await page.evaluate(() => document.fonts.ready);
      const cookies = page.getByRole("button", {
        name: "Только необходимые",
        exact: true,
      });
      if (await cookies.isVisible()) await cookies.click();
      await page.addStyleTag({
        content:
          "#nuxt-devtools-anchor, #nuxt-devtools-container { display: none !important; }",
      });
      assert.equal(await page.locator("h1").count(), 1);
      assert((await page.locator(".category-machine").count()) > 0);
      for (const img of await page.locator('img[loading="lazy"]').all())
        await img.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({
        path: `artifacts/category/${width}-full.png`,
        fullPage: true,
      });
      const result = await page.evaluate(() => ({
        width: innerWidth,
        overflow: document.documentElement.scrollWidth > innerWidth,
        broken: [...document.images]
          .filter((i) => !i.complete || !i.naturalWidth)
          .map((i) => i.src),
      }));
      console.log(result);
      assert.equal(result.overflow, false);
      assert.deepEqual(result.broken, []);
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    const total = await page.locator(".category-machine").count();
    await page
      .getByRole("button", { name: "Машины переменного тока", exact: true })
      .click();
    assert((await page.locator(".category-machine").count()) < total);
    for (const type of await page
      .locator(".category-machine__type")
      .allTextContents())
      assert.equal(type, "Машины переменного тока");
    await page.locator(".category-machine__spec-link").first().click();
    const selectedName = await page
      .locator("#category-model option:checked")
      .textContent();
    assert.equal(
      await page.locator(".category-specifications__data > h3").textContent(),
      selectedName,
    );
    assert(
      (await page.locator(".category-specifications__table table").count()) > 0,
    );
    const options = await page.locator("#category-model option").all();
    await page
      .locator("#category-model")
      .selectOption(await options.at(-1).getAttribute("value"));
    assert.notEqual(
      await page.locator(".category-specifications__data > h3").textContent(),
      selectedName,
    );
    await page.getByRole("button", { name: "Все", exact: true }).click();
    assert.equal(await page.locator(".category-machine").count(), total);
    await page.locator(".category-machine__link").first().click();
    await page.waitForURL(/\/products\/excavator\/.+/);
    await page.goBack({ waitUntil: "networkidle" });
    for (const slug of ["belaz", "new-developments"]) {
      await page.goto(`http://127.0.0.1:3000/products/${slug}`, {
        waitUntil: "networkidle",
      });
      assert((await page.locator(".category-machine").count()) > 0);
      assert.equal(await page.locator("h1").count(), 1);
      assert.equal(
        await page.evaluate(
          () => document.documentElement.scrollWidth > innerWidth,
        ),
        false,
      );
    }
    assert.deepEqual(errors, []);
    console.log(
      "Category filters, model selection, product navigation and other category checks passed.",
    );
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
