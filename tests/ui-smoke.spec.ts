import { expect, test } from "@playwright/test";

test.describe("UI smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.clear();
    });
    await page.goto("/");
  });

  test("loads and renders the sheet title", async ({ page }) => {
    await expect(page.getByText("WorldStriders")).toBeVisible();
  });

  test("switches language between EN and RU", async ({ page }) => {
    await page.getByRole("button", { name: "RU" }).click();
    await expect(page.getByRole("button", { name: "Экспорт YAML" })).toBeVisible();

    await page.getByRole("button", { name: "EN" }).click();
    await expect(page.getByRole("button", { name: "Export YAML" })).toBeVisible();
  });

  test("updates component labels when language changes", async ({ page }) => {
    const firstAddMilestonesButton = page.getByRole("button", { name: "Add milestones" }).first();

    await expect(page.getByText("Name:")).toBeVisible();
    await expect(page.getByRole("heading", { name: "ATTRIBUTES" })).toBeVisible();
    await expect(page.getByText("Health")).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Total experience" }).first()).toBeVisible();
    await expect(firstAddMilestonesButton).toBeVisible();
    await expect(page.getByRole("heading", { name: "Dice Roller" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Number of dice" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Roll" })).toBeVisible();
    await expect(page.getByText("A - Aggravated (6 month)", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "SKILLS" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "PERMANENT PERKS" })).toBeVisible();

    let enPromptMessage = "";
    page.once("dialog", async (dialog) => {
      enPromptMessage = dialog.message();
      await dialog.dismiss();
    });
    await firstAddMilestonesButton.click({ force: true, noWaitAfter: true });
    await expect.poll(() => enPromptMessage).toBe("How many milestones to add?");

    await page.getByRole("button", { name: "RU" }).click();

    const ruAddMilestonesButton = page.getByRole("button", { name: "Добавить вехи" }).first();

    await expect(page.getByText("Имя:")).toBeVisible();
    await expect(page.getByRole("heading", { name: "АТРИБУТЫ" })).toBeVisible();
    await expect(page.getByText("Здоровье")).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Всего опыта" }).first()).toBeVisible();
    await expect(ruAddMilestonesButton).toBeVisible();
    await expect(page.getByRole("heading", { name: "Бросок кубов" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Количество кубов" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Бросить" })).toBeVisible();
    await expect(page.getByText("A - Aggravated, усиливающиеся (6 мес)", { exact: true })).toBeVisible();
    await expect(page.getByRole("heading", { name: "НАВЫКИ" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "ПОСТОЯННЫЕ ПЕРКИ" })).toBeVisible();

    let ruPromptMessage = "";
    page.once("dialog", async (dialog) => {
      ruPromptMessage = dialog.message();
      await dialog.dismiss();
    });
    await ruAddMilestonesButton.click({ force: true, noWaitAfter: true });
    await expect.poll(() => ruPromptMessage).toBe("Сколько вех добавить?");

    await expect(page.getByRole("spinbutton", { name: "Всего опыта" }).first()).toHaveAttribute(
      "aria-label",
      "Всего опыта"
    );
  });

  test("rolls exploding d10 dice and shows the success count", async ({ page }) => {
    await page.evaluate(() => {
      const sequence = [0.95, 0.8, 0.95, 0.5, 0.3, 0];
      let index = 0;
      Math.random = () => sequence[index++] ?? 0;
    });

    await page.getByRole("spinbutton", { name: "Number of dice" }).fill("4");
    await page.getByRole("spinbutton", { name: "Success threshold" }).fill("8");
    await page.getByRole("spinbutton", { name: "Reroll threshold" }).fill("10");
    await page.getByRole("button", { name: "Roll" }).click();

    await expect(page.getByText("(19 [10 9] 16 [10 6] 4 1)", { exact: true })).toBeVisible();
    await expect(page.getByText("(3 successes)", { exact: true })).toBeVisible();
  });
});
