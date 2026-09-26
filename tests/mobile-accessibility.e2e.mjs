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
  await page.evaluate(() =>
    localStorage.setItem(
      "rega.onboarding.v1",
      JSON.stringify({ topics: ["פסיכולוגיה"], format: "both" }),
    ),
  );
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

async function viewportState(page) {
  return page.evaluate(() => {
    const measuredControls = [
      ...document.querySelectorAll("button, input, summary, textarea"),
    ]
      .filter((element) => {
        const rect = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 0 &&
          rect.height > 0
        );
      })
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return {
          label:
            element.getAttribute("aria-label") ??
            element.textContent?.trim().replace(/\s+/g, " "),
          bottom: rect.bottom,
          height: rect.height,
          left: rect.left,
          right: rect.right,
          top: rect.top,
          width: rect.width,
        };
      });
    return {
      clientWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      outsideHorizontally: measuredControls.filter(
        ({ left, right }) => left < 0 || right > innerWidth,
      ),
      undersized: measuredControls.filter(
        ({ height, width }) => height < 44 || width < 44,
      ),
    };
  });
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

test("sessions, audio, player, and expanded share sheet remain usable on narrow phones", async (t) => {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());

  for (const width of [320, 390]) {
    const { context, errors, page } = await openPage(browser, width);

    await page
      .getByRole("navigation", { name: "ניווט בנייד" })
      .getByRole("button", { name: "יש לי 5 דקות" })
      .click();
    await page.getByRole("heading", { name: "יש לי 5 דקות." }).waitFor();
    let state = await viewportState(page);
    assert.equal(state.scrollWidth, state.clientWidth);
    assert.deepEqual(state.outsideHorizontally, []);
    assert.deepEqual(state.undersized, [], `${width}px session list controls`);

    await page.locator(".session-tile").first().click();
    await page.getByRole("button", { name: "לכל המסעות הקצרים" }).waitFor();
    state = await viewportState(page);
    assert.equal(state.scrollWidth, state.clientWidth);
    assert.deepEqual(state.outsideHorizontally, []);
    assert.deepEqual(
      state.undersized,
      [],
      `${width}px session reader controls`,
    );

    const shareTrigger = page.getByRole("button", { name: /^שיתוף:/ }).first();
    await page.setViewportSize({ width, height: 500 });
    await shareTrigger.click();
    await page
      .getByText("הטקסט לשיתוף · אפשר גם להעתיק ידנית", { exact: true })
      .click();
    const dialog = page.getByRole("dialog");
    const dialogScroll = await dialog.evaluate((element) => ({
      clientHeight: element.clientHeight,
      overflowY: getComputedStyle(element).overflowY,
      scrollHeight: element.scrollHeight,
    }));
    assert.match(dialogScroll.overflowY, /auto|scroll/);
    assert.ok(dialogScroll.scrollHeight > dialogScroll.clientHeight);
    const dialogControls = await controlBounds(
      page,
      ".share-sheet button, .share-sheet summary, .share-sheet textarea",
    );
    assert.deepEqual(
      dialogControls.filter(
        ({ height, width: controlWidth }) => height < 44 || controlWidth < 44,
      ),
      [],
      `${width}px expanded share controls`,
    );
    const dialogBox = await dialog.boundingBox();
    assert.ok(
      dialogBox && dialogBox.x >= 0 && dialogBox.x + dialogBox.width <= width,
    );
    await page.getByLabel("טקסט לשיתוף").scrollIntoViewIfNeeded();
    const textareaBox = await page.getByLabel("טקסט לשיתוף").boundingBox();
    assert.ok(
      textareaBox &&
        textareaBox.y >= dialogBox.y &&
        textareaBox.y + textareaBox.height <= dialogBox.y + dialogBox.height,
    );
    await page.keyboard.press("Escape");
    assert.equal(await dialog.count(), 0);
    assert.equal(
      await shareTrigger.evaluate(
        (element) => element === document.activeElement,
      ),
      true,
    );

    await shareTrigger.click();
    const backdropPoint = {
      x: Math.max(1, dialogBox.x / 2),
      y: Math.max(1, dialogBox.y / 2),
    };
    assert.equal(
      backdropPoint.x >= dialogBox.x &&
        backdropPoint.x <= dialogBox.x + dialogBox.width &&
        backdropPoint.y >= dialogBox.y &&
        backdropPoint.y <= dialogBox.y + dialogBox.height,
      false,
    );
    await page.mouse.click(backdropPoint.x, backdropPoint.y);
    assert.equal(await dialog.count(), 0);
    assert.equal(
      await shareTrigger.evaluate(
        (element) => element === document.activeElement,
      ),
      true,
    );
    await page.setViewportSize({ width, height: 844 });

    await page
      .getByRole("navigation", { name: "ניווט בנייד" })
      .getByRole("button", { name: "להקשיב" })
      .click();
    await page.getByRole("heading", { name: "רגע להקשיב." }).waitFor();
    await page.locator(".episode-related summary").first().click();
    state = await viewportState(page);
    assert.equal(state.scrollWidth, state.clientWidth);
    assert.deepEqual(state.outsideHorizontally, []);
    assert.deepEqual(state.undersized, [], `${width}px audio controls`);

    await page
      .getByRole("button", { name: /^ניגון / })
      .first()
      .click();
    const player = page.getByRole("region", { name: "נגן שמע" });
    await player.waitFor();
    state = await viewportState(page);
    assert.equal(state.scrollWidth, state.clientWidth);
    assert.deepEqual(state.outsideHorizontally, []);
    assert.deepEqual(state.undersized, [], `${width}px mini-player controls`);
    const playerBox = await player.boundingBox();
    const titleBox = await player.locator(".mini-title").boundingBox();
    const controlBoxes = await player.locator("button").evaluateAll((buttons) =>
      buttons.map((button) => {
        const rect = button.getBoundingClientRect();
        return {
          bottom: rect.bottom,
          left: rect.left,
          right: rect.right,
          top: rect.top,
        };
      }),
    );
    const navBox = await page
      .getByRole("navigation", { name: "ניווט בנייד" })
      .boundingBox();
    assert.ok(
      playerBox && navBox && playerBox.y + playerBox.height <= navBox.y,
    );
    assert.ok(
      titleBox &&
        titleBox.y + titleBox.height <=
          Math.min(...controlBoxes.map(({ top }) => top)),
    );
    for (let index = 0; index < controlBoxes.length; index += 1) {
      for (let other = index + 1; other < controlBoxes.length; other += 1) {
        const first = controlBoxes[index];
        const second = controlBoxes[other];
        const overlap =
          first.left < second.right &&
          first.right > second.left &&
          first.top < second.bottom &&
          first.bottom > second.top;
        assert.equal(overlap, false, `${width}px mini-player controls overlap`);
      }
    }
    assert.deepEqual(errors, [], `${width}px emitted browser errors`);

    await page.screenshot({
      path: `${evidenceDir}/audio-player-${width}.png`,
    });
    await context.close();
  }
});

test("both published episodes expose provenance and play real media in Chromium", async (t) => {
  await mkdir(evidenceDir, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const { context, errors, page } = await openPage(browser, 390);
  t.after(() => context.close());

  await page.evaluate(() =>
    localStorage.setItem(
      "rega.onboarding.v1",
      JSON.stringify({ topics: ["פסיכולוגיה"], format: "both" }),
    ),
  );
  await page.reload({ waitUntil: "networkidle" });
  await page
    .getByRole("navigation", { name: "ניווט בנייד" })
    .getByRole("button", { name: "להקשיב" })
    .click();
  await page.getByRole("heading", { name: "רגע להקשיב." }).waitFor();

  const cards = page.locator(".episode-card");
  assert.equal(await cards.count(), 2);
  for (let index = 0; index < 2; index += 1) {
    const card = cards.nth(index);
    await card.locator(".episode-transcript summary").click();
    assert.ok((await card.locator(".episode-transcript-copy p").count()) >= 5);
    assert.ok((await card.locator(".episode-trust a").count()) >= 3);

    await card.getByRole("button", { name: /^ניגון / }).click();
    const player = page.getByRole("region", { name: "נגן שמע" });
    const media = player.locator("audio");
    await media.waitFor({ state: "attached" });
    await page.waitForFunction(
      () => {
        const audio = document.querySelector(".mini-player audio");
        return audio instanceof HTMLAudioElement && audio.readyState >= 1;
      },
      undefined,
      { timeout: 10_000 },
    );
    const loaded = await media.evaluate((audio) => ({
      duration: audio.duration,
      paused: audio.paused,
      readyState: audio.readyState,
    }));
    assert.ok(Number.isFinite(loaded.duration) && loaded.duration > 120);
    assert.ok(loaded.readyState >= 1);
    assert.equal(loaded.paused, false);

    await page.waitForTimeout(750);
    assert.ok((await media.evaluate((audio) => audio.currentTime)) > 0);
    await player.getByRole("slider", { name: "מיקום בפרק" }).fill("30");
    assert.ok(
      Math.abs((await media.evaluate((audio) => audio.currentTime)) - 30) < 1,
    );
    if (index === 0) {
      await player.getByRole("button", { name: "מהירות ניגון 1" }).click();
      assert.equal(await media.evaluate((audio) => audio.playbackRate), 1.25);
    }
    await player.getByRole("button", { name: "סגירת הנגן" }).click();
  }

  assert.deepEqual(errors, []);
  await page.screenshot({
    fullPage: true,
    path: `${evidenceDir}/audio-provenance-playback-390.png`,
  });
});

test("discovery and quick read reflow at a 200 percent zoom equivalent", async (t) => {
  const browser = await chromium.launch({ headless: true });
  t.after(() => browser.close());
  const { context, errors, page } = await openPage(browser, 640);
  t.after(() => context.close());
  await page.evaluate(() =>
    localStorage.setItem(
      "rega.onboarding.v1",
      JSON.stringify({ topics: ["פסיכולוגיה"], format: "both" }),
    ),
  );
  await page.reload({ waitUntil: "networkidle" });
  await page.evaluate(() => {
    document.documentElement.style.zoom = "2";
  });

  let dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.equal(dimensions.scrollWidth, dimensions.clientWidth);
  await page.getByRole("button", { name: /לקריאה · 3 דקות/ }).click();
  await page.getByRole("heading", { name: /מה בשליטתך/ }).waitFor();
  dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  assert.equal(dimensions.scrollWidth, dimensions.clientWidth);
  assert.deepEqual(errors, []);
});
