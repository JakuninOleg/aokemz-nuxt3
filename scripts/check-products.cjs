const { chromium } = require(process.env.KEMZ_NODE_MODULES + '/playwright');
const fs = require('node:fs/promises');
const assert = require('node:assert/strict');

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.KEMZ_CHROMIUM, headless: true });
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await fs.mkdir('artifacts/products', { recursive: true });
    for (const [width, height] of [[1440,900],[1024,768],[390,844]]) {
      await page.setViewportSize({ width, height });
      await page.goto('http://127.0.0.1:3000/products', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      await page.addStyleTag({ content: '#nuxt-devtools-anchor, #nuxt-devtools-container, nuxt-devtools-frame { display: none !important; }' });
      const cookies = page.getByRole('button', { name: 'Только необходимые', exact: true });
      if (await cookies.isVisible()) await cookies.click();
      assert.equal(await page.locator('h1').count(), 1);
      assert(await page.locator('.catalog-card').count() > 0, 'CMS catalog did not load');
      for (const image of await page.locator('img[loading="lazy"]').all()) {
        if (await image.isVisible()) await image.scrollIntoViewIfNeeded();
      }
      await page.waitForTimeout(800);
      await page.evaluate(() => scrollTo(0,0));
      await page.screenshot({ path: `artifacts/products/${width}-full.png`, fullPage: true });
      const result = await page.evaluate(() => ({ width: innerWidth, overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.src) }));
      console.log(JSON.stringify(result));
      assert.equal(result.overflow, false);
      assert.deepEqual(result.broken, []);
      if (width === 1440) {
        const category = page.locator('.products-cat').first();
        const arrow = category.locator('.products-cat__more span');
        const before = await arrow.boundingBox();
        await category.hover();
        await page.waitForTimeout(400);
        const after = await arrow.boundingBox();
        assert(after.x > before.x, 'Category arrow did not move on hover');
        await page.locator('.products-cats').screenshot({ path: 'artifacts/products/categories-hover.png' });
      }
      if (width === 390) {
        assert.equal(await page.getByRole('searchbox').isVisible(), false);
        await page.locator('.catalog-mobile-toggle').click();
        assert.equal(await page.getByRole('searchbox').isVisible(), true);
        await page.locator('.catalog-mobile-toggle').click();
      }
    }
    await page.setViewportSize({ width: 1440, height: 900 });
    const firstName = await page.locator('.catalog-card h3').first().textContent();
    await page.getByRole('searchbox').fill(firstName);
    assert(await page.locator('.catalog-card').count() > 0);
    await page.getByRole('searchbox').fill('несуществующая-модель-98765');
    await page.locator('.catalog-empty').waitFor();
    await page.getByRole('button', { name: 'Сбросить фильтры', exact: true }).click();
    assert.equal(await page.locator('.catalog-card').count(), 6);
    await page.getByRole('button', { name: 'Список', exact: true }).click();
    assert.equal(await page.locator('.catalog-grid--list').count(), 1);
    await page.getByRole('button', { name: 'Сетка', exact: true }).click();
    await page.getByRole('button', { name: 'Показать ещё' }).click();
    assert.equal(await page.locator('.catalog-card').count(), 12);
    await page.locator('.catalog-filter-options input').first().check();
    const categoryName = await page.locator('.catalog-filter-options label').first().innerText();
    for (const name of await page.locator('.catalog-card__category').allTextContents()) assert.equal(name.trim(), categoryName.trim());
    await page.getByRole('button', { name: 'Сбросить', exact: true }).click();
    assert(await page.locator('.products-cat').count() > 5, 'All published categories should be visible');
    for (const order of ['name', 'name-desc']) {
      await page.getByRole('combobox').selectOption(order);
      const names = await page.locator('.catalog-card h3').allTextContents();
      assert.deepEqual(names, [...names].sort((a, b) => a.localeCompare(b, 'ru', { numeric: true }) * (order === 'name' ? 1 : -1)));
    }
    console.log('Interactions passed. Browser errors:', JSON.stringify(errors));
    assert.deepEqual(errors, []);
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
