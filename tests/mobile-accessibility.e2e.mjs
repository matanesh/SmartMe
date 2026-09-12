import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";
const evidenceDir = "test-results/mobile-accessibility";

async function openPage(browser, width, withNativeShare = false) {
  const context = await browser.newContext({
    locale: "he-IL",
    reducedMotion: "reduce",
    viewport: { width, height: 844 },
  });
  if (withNativeShare) {
    await context.addInitScript(() => {
      Object.defineProperty(navigator, "share", {
        configurable: true,
        value: async () => undefined,
      });
    });
  }
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: "networkidle" });
  return { context, errors, page };
}

async function controlBounds(page, selector) {
  return page.locator(selector).evaluateAll((elements) =>
    elements
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0 &&
          rect.right > 0 &&
          rect.left < innerWidth
        );
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label:
            element.getAttribute("aria-label") ??
            element.textContent?.trim().replace(/\s+/g, " "),
          width: rect.width,
          height: rect.height,
        };
      }),
  );
}

test("mobile controls meet 44px targets without page overflow at 320px and 390px", async (t) => {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [320, 390]) {
    const { context, errors, page } = await openPage(browser, width);
    const dimensions = await page.evaluate(() => ({
      clientWidth: document.documentElement.clientWidth,
      direction: document.documentElement.dir,
      language: document.documentElement.lang,
      scrollWidth: document.documentElement.scrollWidth,
    }));
    assert.deepEqual(dimensions, {
      clientWidth: width,
      direction: "rtl",
      language: "he",
      scrollWidth: width,
    });

    const controls = await controlBounds(
      page,
      ".topic-tabs button, .card-actions button, .bottom-nav button",
    );
    const undersized = controls.filter(
      ({ width: controlWidth, height }) => controlWidth < 44 || height < 44,
    );
    assert.deepEqual(undersized, [], `${width}px has undersized controls`);
    assert.deepEqual(errors, [], `${width}px emitted browser errors`);

    await page.screenshot({
      fullPage: true,
      path: `${evidenceDir}/discover-${width}.png`,
    });
    await context.close();
  }
});

test("keyboard skip and share dialog restore focus to the share trigger", async (t) => {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const { context, errors, page } = await openPage(browser, 390, true);
  t.after(() => context.close());

  await page.keyboard.press("Tab");
  assert.equal(await page.locator(":focus").textContent(), "דילוג לתוכן");
  await page.keyboard.press("Enter");
  assert.equal(await page.locator(":focus").getAttribute("id"), "main-content");

  const shareTrigger = page.getByRole("button", { name: /^שיתוף:/ }).first();
  await shareTrigger.focus();
  await shareTrigger.click();
  const closeButton = page.getByRole("button", { name: "סגירת חלונית השיתוף" });
  assert.equal(
    await closeButton.evaluate((element) => element === document.activeElement),
    true,
  );
  await closeButton.click();
  assert.equal(
    await shareTrigger.evaluate(
      (element) => element === document.activeElement,
    ),
    true,
  );

  await shareTrigger.click();
  await page.getByRole("button", { name: "שיתוף דרך אפליקציה" }).click();
  assert.equal(
    await shareTrigger.evaluate(
      (element) => element === document.activeElement,
    ),
    true,
  );
  assert.deepEqual(errors, []);

  await page.screenshot({ path: `${evidenceDir}/focus-restored-390.png` });
});
