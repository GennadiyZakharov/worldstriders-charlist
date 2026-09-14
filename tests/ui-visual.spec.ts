import { expect, test } from "@playwright/test";

async function seedSuperpower(page: import("@playwright/test").Page) {
  const section = page.getByRole("heading", { name: "SUPERPOWERS" }).locator("../..");
  await section.getByRole("button", { name: "Add" }).click();
  await section.getByRole("textbox", { name: "Origin" }).fill("Ancient pact");
  await section.getByRole("textbox", { name: "Effect" }).fill("Walk through shadows");
  await section.getByRole("textbox", { name: "Attribute" }).fill("Composure");
  await section.getByRole("textbox", { name: "Skill" }).fill("Occult");
  await section.getByRole("slider")
    .getByRole("button", { name: "Level 3/5" }).click();
}

test.describe("UI visual regression", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto("/");
  });

  test("desktop layout", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await seedSuperpower(page);
    await expect(page).toHaveScreenshot("layout-desktop.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01
    });
  });

  test("mobile layout", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await seedSuperpower(page);
    await expect(page).toHaveScreenshot("layout-mobile.png", {
      fullPage: true,
      maxDiffPixelRatio: 0.01
    });
  });
});
