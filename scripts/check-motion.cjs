const assert = require("node:assert/strict");
const { chromium } = require(process.env.KEMZ_NODE_MODULES + "/playwright");

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.KEMZ_CHROMIUM,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  try {
    for (const route of ["/", "/about", "/documents"]) {
      await page.goto(`http://127.0.0.1:3000${route}`, {
        waitUntil: "networkidle",
      });
      await page.evaluate(() => document.fonts.ready);
      const cookies = page.getByRole("button", {
        name: "Только необходимые",
        exact: true,
      });
      if (await cookies.isVisible()) await cookies.click();
      const actions = page.locator(".kemz-action");
      for (const action of await actions.all()) {
        if (!(await action.isVisible()) || (await action.isDisabled()))
          continue;
        await action.scrollIntoViewIfNeeded();
        await page.mouse.move(0, 0);
        await page.waitForTimeout(350);
        const read = () =>
          action.evaluate((el) => {
            const arrow = el.lastElementChild;
            const css = getComputedStyle(arrow);
            return {
              y: el.getBoundingClientRect().y,
              labelY: el.firstElementChild.getBoundingClientRect().y,
              x:
                css.transform === "none"
                  ? 0
                  : new DOMMatrixReadOnly(css.transform).m41,
              easing: css.transitionTimingFunction,
              duration: css.transitionDuration,
            };
          });
        const before = await read();
        assert.equal(before.easing, "cubic-bezier(0.4, 0, 0.2, 1)");
        assert.equal(before.duration, "0.3s");
        await action.hover();
        await page.waitForTimeout(70);
        const during = await read();
        assert(
          during.x > 0 && during.x < 5,
          `${route}: arrow must interpolate`,
        );
        await page.waitForTimeout(300);
        const after = await read();
        assert(Math.abs(after.x - 5) < 0.1);
        assert(
          Math.abs(before.y - after.y) < 0.1,
          `${route}: button moved vertically`,
        );
        assert(
          Math.abs(before.labelY - after.labelY) < 0.1,
          `${route}: label moved vertically`,
        );
        await page.mouse.move(0, 0);
        await page.waitForTimeout(70);
        const returning = await read();
        assert(
          returning.x > 0 && returning.x < 5,
          `${route}: hover-out must interpolate`,
        );
      }
      console.log(
        `${route}: ${await actions.count()} shared actions, easing/hover-in/hover-out/no-jump OK`,
      );
    }
    await page.emulateMedia({ reducedMotion: "reduce" });
    const duration = await page
      .locator(".kemz-action")
      .first()
      .evaluate(
        (el) => getComputedStyle(el.lastElementChild).transitionDuration,
      );
    assert.equal(duration, "0s");
    console.log("Reduced motion: OK");
  } finally {
    await browser.close();
  }
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
