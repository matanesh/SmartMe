import assert from "node:assert/strict";
import { test } from "node:test";
import { chromium } from "playwright";

const baseUrl = process.env.E2E_BASE_URL ?? "http://127.0.0.1:3000";

test("critical controls work and saved progress survives reload at 390px", async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  const context = await browser.newContext({
    locale: "he-IL",
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(String(error)));

  await page.goto(baseUrl, { waitUntil: "networkidle" });
  await page.evaluate(() =>
    localStorage.setItem(
      "rega.onboarding.v1",
      JSON.stringify({ topics: ["פסיכולוגיה"], format: "both" }),
    ),
  );
  await page.reload({ waitUntil: "networkidle" });

  const firstSave = page.getByRole("button", { name: /^שמירת רעיון:/ }).first();
  await firstSave.click();
  await assert.doesNotReject(() =>
    page
      .getByRole("button", { name: /^ביטול שמירה:/ })
      .first()
      .waitFor(),
  );
  await assert.doesNotReject(() =>
    page.getByRole("status").filter({ hasText: "נשמר לך" }).waitFor(),
  );

  await page.reload({ waitUntil: "networkidle" });
  assert.equal(
    await page.getByRole("button", { name: /^ביטול שמירה:/ }).count(),
    1,
  );

  await page.getByRole("button", { name: "כסף", exact: true }).click();
  await assert.doesNotReject(() =>
    page.getByRole("heading", { name: "רגע של כסף" }).waitFor(),
  );
  assert.equal(await page.locator("main article").count(), 5);

  await page.getByRole("button", { name: "בשבילך", exact: true }).click();
  const before = await page.locator("main article").count();
  await page.getByRole("button", { name: /יש עוד מה לגלות/ }).click();
  assert.equal(before, 8);
  assert.equal(await page.locator("main article").count(), 16);

  await page.getByRole("button", { name: "יש לי 5 דקות", exact: true }).click();
  await assert.doesNotReject(() =>
    page.getByRole("heading", { name: "יש לי 5 דקות." }).waitFor(),
  );

  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.deepEqual(dimensions, { clientWidth: 390, scrollWidth: 390 });
  assert.deepEqual(errors, []);
});
