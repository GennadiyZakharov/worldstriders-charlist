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
});
