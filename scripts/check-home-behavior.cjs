const assert = require("node:assert/strict");
const { chromium } = require(process.env.KEMZ_NODE_MODULES + "/playwright");
const baseUrl = process.env.KEMZ_BASE_URL || "http://127.0.0.1:3000";

async function main() {
  const browser = await chromium.launch({
    executablePath: process.env.KEMZ_CHROMIUM,
    headless: true,
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(`${baseUrl}/`, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => document.fonts.ready);
  await page.addStyleTag({
    content:
      "nuxt-devtools-frame, #nuxt-devtools-container { display: none !important; }",
  });
  assert.equal(await page.locator("h1").count(), 1);
  console.log(
    "SEO:",
    await page.title(),
    await page.locator('link[rel="canonical"]').getAttribute("href"),
  );
  console.log(
    "Category URLs:",
    await page
      .locator(".ref-product")
      .evaluateAll((nodes) => nodes.map((n) => n.getAttribute("href"))),
  );
  for (const section of [
    "ref-hero",
    "ref-showcase",
    "ref-production",
    "ref-capabilities",
    "ref-geography",
    "ref-request",
    "ref-news",
  ]) {
    await page
      .locator("." + section)
      .screenshot({ path: `artifacts/home/desktop-${section}.png` });
  }
  assert.equal(await page.getByText("Смотреть карту поставок").count(), 0);
  assert.equal(await page.locator(".ref-geography__point").count(), 4);
  const form = page.locator(".technical-form");
  let submissions = [];
  await page.route("**/api/sendMail", async (route) => {
    submissions.push(route.request().postDataJSON());
    await route.fulfill({ json: { success: true } });
  });
  await form.getByRole("button", { name: /Отправить в технический/ }).click();
  assert.equal(submissions.length, 0);
  assert(await form.getByText("Укажите телефон", { exact: true }).isVisible());
  await form
    .getByLabel("Тип оборудования")
    .selectOption("Экскаваторное оборудование");
  await form.getByLabel("Модель техники").fill("ЭКГ-10");
  await form.getByLabel("Необходимая мощность, кВт").fill("560");
  await form
    .getByLabel("Компания", { exact: true })
    .fill("Тестовая организация");
  await form.locator('input[name="organization"]').fill("Тестовый инженер");
  await form.locator('input[name="email"]').fill("test@example.org");
  // Let the mask's focus/caret update finish before replacing its value.
  await form.locator('input[type="tel"]').click();
  await page.waitForTimeout(50);
  await form.locator('input[type="tel"]').fill("89123456789");
  await form
    .locator("textarea")
    .fill("Требуется подбор привода подъёма для карьерного экскаватора.");
  await form.locator('input[type="checkbox"]').check();
  await form.getByRole("button", { name: /Отправить в технический/ }).click();
  await form.getByText("Ваша заявка успешно отправлена").waitFor();
  assert.equal(submissions.length, 1);
  assert.equal(submissions[0].technical.machine, "ЭКГ-10");
  assert.equal(submissions[0].technical.power, "560");
  assert.equal(submissions[0].phone, "79123456789");
  console.log(
    "Form: empty request blocked; valid technical fields serialized; phone normalized; success UI verified with mocked transport. No email sent.",
  );
  const response = await page.request.post(`${baseUrl}/api/sendMail`, {
    data: {},
  });
  assert.equal(response.status(), 400);
  console.log("Server rejects invalid request:", response.status());
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.locator(".ref-hero").waitFor();
  await page.addStyleTag({
    content:
      "nuxt-devtools-frame, #nuxt-devtools-container { display: none !important; }",
  });
  await page.getByRole("button", { name: "Открыть меню", exact: true }).click();
  await page
    .getByRole("navigation", { name: "Мобильное меню", exact: true })
    .getByRole("link", { name: "Документы", exact: true })
    .waitFor({ state: "visible" });
  await page.keyboard.press("Escape");
  assert.equal(
    await page
      .getByRole("button", { name: "Открыть меню", exact: true })
      .getAttribute("aria-expanded"),
    "false",
  );
  await page.locator(".site-header__cta").click();
  await page.waitForURL("**/#technical-request");
  assert(page.url().endsWith("#technical-request"));
  for (const section of [
    "ref-showcase",
    "ref-production",
    "ref-capabilities",
    "ref-geography",
    "ref-request",
    "ref-news",
  ]) {
    await page
      .locator("." + section)
      .screenshot({ path: `artifacts/home/mobile-${section}.png` });
  }
  console.log(
    "Menu, Escape, contact anchor, static geography map: passed. Page errors:",
    errors,
  );
  assert.deepEqual(errors, []);
  await browser.close();
}
main().catch((error) => {
  console.error(error);
  process.exit(1);
});
