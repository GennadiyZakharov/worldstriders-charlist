import { expect, test } from "@playwright/test";

test.describe("UI visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto("/");
  });

  test("desktop layout", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await expect(page).toHaveScreenshot("layout-desktop.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01
    });
  });

  test("mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await expect(page).toHaveScreenshot("layout-mobile.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01
    });
  });
});
