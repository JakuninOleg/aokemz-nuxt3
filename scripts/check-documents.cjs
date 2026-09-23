const { chromium } = require(process.env.KEMZ_NODE_MODULES + '/playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');

async function main() {
  const browser = await chromium.launch({ executablePath: process.env.KEMZ_CHROMIUM, headless: true });
  try {
    const page = await browser.newPage();
    await fs.mkdir('artifacts/documents', { recursive: true });
    for (const [width, height] of [[1440,900], [1024,768], [390,844]]) {
      await page.setViewportSize({ width, height });
      await page.goto('http://127.0.0.1:3000/documents', { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);
      const cookies = page.getByRole('button', { name: 'Только необходимые', exact: true });
      if (await cookies.isVisible()) await cookies.click();
      await page.addStyleTag({ content: '#nuxt-devtools-anchor, #nuxt-devtools-container { display: none !important; }' });
      assert.equal(await page.locator('h1').count(), 1);
      assert(await page.getByText('Надёжные решения', { exact: false }).count());
      const result = await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, broken: [...document.images].filter(image => !image.complete || !image.naturalWidth).map(image => image.currentSrc || image.src) }));
      assert.equal(result.overflow, false);
      assert.deepEqual(result.broken, []);
      await page.screenshot({ path: `artifacts/documents/${width}-full.png`, fullPage: true });
      console.log(JSON.stringify({ width, ...result }));
    }
  } finally { await browser.close(); }
}
main().catch(error => { console.error(error); process.exitCode = 1; });
