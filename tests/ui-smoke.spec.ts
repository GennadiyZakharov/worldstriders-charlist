import { expect, test, type Page } from "@playwright/test";

function perkSection(page: Page, title: string) {
  return page.getByRole("heading", { name: title }).locator("../..");
}

test.describe("UI smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
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
    await expect(page.getByRole("spinbutton", { name: "Number of d10 dice" })).toBeVisible();
    await expect(page.getByText("Options", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Roll" })).toBeVisible();
    await page.getByText("Options", { exact: true }).click();
    await expect(page.getByRole("spinbutton", { name: "Success threshold" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Reroll threshold" })).toBeVisible();
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
    await expect(page.getByRole("spinbutton", { name: "Количество кубиков d10" })).toBeVisible();
    await expect(page.getByText("Настройки", { exact: true })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Порог успеха" })).toBeVisible();
    await expect(page.getByRole("spinbutton", { name: "Порог переброса" })).toBeVisible();
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

  test("edits localized multiline perk descriptions and persists them", async ({ page }) => {
    const permanent = perkSection(page, "PERMANENT PERKS");
    const temporary = perkSection(page, "TEMPORARY PERKS");

    await permanent.getByRole("button", { name: "Add" }).click();
    await temporary.getByRole("button", { name: "Add" }).click();

    const permanentDescription = permanent.getByRole("button", { name: "Description" });
    await permanentDescription.focus();
    await page.keyboard.press("Enter");

    let dialog = page.getByRole("dialog", { name: "Perk description" });
    const descriptionText = dialog.getByRole("textbox", { name: "Perk description" });
    await descriptionText.fill("First line\nSecond line");
    await dialog.getByRole("button", { name: "Close" }).click();

    await permanentDescription.click();
    await expect(descriptionText).toHaveValue("First line\nSecond line");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await temporary.getByRole("button", { name: "Description" }).click();
    dialog = page.getByRole("dialog", { name: "Perk description" });
    await dialog.getByRole("textbox", { name: "Perk description" }).fill("Temporary detail");
    await dialog.getByRole("button", { name: "Close" }).click();

    await page.getByRole("button", { name: "RU" }).click();
    await perkSection(page, "ВРЕМЕННЫЕ ПЕРКИ").getByRole("button", { name: "Описание" }).click();
    const russianDialog = page.getByRole("dialog", { name: "Описание перка" });
    await expect(russianDialog).toBeVisible();
    await expect(russianDialog.getByRole("textbox", { name: "Описание перка" }))
      .toHaveValue("Temporary detail");
    await russianDialog.getByRole("button", { name: "Закрыть" }).click();
    await expect(perkSection(page, "ПОСТОЯННЫЕ ПЕРКИ").getByRole("button", { name: "Описание" }))
      .toBeVisible();

    await page.reload();
    await perkSection(page, "ПОСТОЯННЫЕ ПЕРКИ").getByRole("button", { name: "Описание" }).click();
    await expect(page.getByRole("textbox", { name: "Описание перка" }))
      .toHaveValue("First line\nSecond line");
    await page.getByRole("button", { name: "Закрыть" }).click();
    await perkSection(page, "ВРЕМЕННЫЕ ПЕРКИ").getByRole("button", { name: "Описание" }).click();
    await expect(page.getByRole("textbox", { name: "Описание перка" })).toHaveValue("Temporary detail");
  });

  test("round-trips perk descriptions through YAML", async ({ page }) => {
    const permanent = perkSection(page, "PERMANENT PERKS");
    const temporary = perkSection(page, "TEMPORARY PERKS");

    await permanent.getByRole("button", { name: "Add" }).click();
    await permanent.getByRole("button", { name: "Description" }).click();
    await page.getByRole("textbox", { name: "Perk description" }).fill("Permanent\nYAML");
    await page.getByRole("button", { name: "Close" }).click();

    await temporary.getByRole("button", { name: "Add" }).click();
    await temporary.getByRole("button", { name: "Description" }).click();
    await page.getByRole("textbox", { name: "Perk description" }).fill("Temporary YAML");
    await page.getByRole("button", { name: "Close" }).click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export YAML" }).click();
    const download = await downloadPromise;
    const yamlStream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of yamlStream) chunks.push(Buffer.from(chunk));
    const yaml = Buffer.concat(chunks).toString("utf8");
    expect(yaml).toContain("description:");

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('input[type="file"]').setInputFiles({
      name: "character.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(yaml)
    });

    await perkSection(page, "PERMANENT PERKS").getByRole("button", { name: "Description" }).click();
    await expect(page.getByRole("textbox", { name: "Perk description" })).toHaveValue("Permanent\nYAML");
    await page.getByRole("button", { name: "Close" }).click();
    await perkSection(page, "TEMPORARY PERKS").getByRole("button", { name: "Description" }).click();
    await expect(page.getByRole("textbox", { name: "Perk description" })).toHaveValue("Temporary YAML");
  });

  test("normalizes legacy and malformed perk descriptions", async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles({
      name: "legacy.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(`schemaVersion: 1
lang: en
permanentPerks:
  - text: Legacy perk
    level: 9
temporaryPerks:
  - text: Malformed description
    description: 42
    level: 2
    unknownField: harmless
`)
    });

    await expect.poll(async () => page.evaluate(() => {
      const value = localStorage.getItem("worldstriders.charlist.v1");
      if (!value) return null;
      const parsed = JSON.parse(value) as {
        schemaVersion: number;
        permanentPerks: Array<{ text: string; description: string; level: number }>;
        temporaryPerks: Array<{ text: string; description: string; level: number }>;
      };
      return {
        schemaVersion: parsed.schemaVersion,
        permanent: parsed.permanentPerks[0],
        temporary: parsed.temporaryPerks[0]
      };
    })).toEqual({
      schemaVersion: 2,
      permanent: { text: "Legacy perk", description: "", level: 5 },
      temporary: { text: "Malformed description", description: "", level: 2 }
    });

    await perkSection(page, "PERMANENT PERKS").getByRole("button", { name: "Description" }).click();
    await expect(page.getByRole("textbox", { name: "Perk description" })).toHaveValue("");
    await page.getByRole("button", { name: "Close" }).click();
    await perkSection(page, "TEMPORARY PERKS").getByRole("button", { name: "Description" }).click();
    await expect(page.getByRole("textbox", { name: "Perk description" })).toHaveValue("");
  });

  test("reveals, clamps, and retains dice roller options", async ({ page }) => {
    const successThreshold = page.getByRole("spinbutton", { name: "Success threshold" });
    const rerollThreshold = page.getByRole("spinbutton", { name: "Reroll threshold" });
    const diceCount = page.getByRole("spinbutton", { name: "Number of d10 dice" });
    const options = page.getByText("Options", { exact: true });

    await expect(successThreshold).toBeHidden();
    await expect(rerollThreshold).toBeHidden();

    await options.focus();
    await page.keyboard.press("Enter");
    await expect(successThreshold).toBeVisible();
    await expect(rerollThreshold).toBeVisible();

    await successThreshold.fill("11");
    await successThreshold.blur();
    await expect(successThreshold).toHaveValue("10");

    await rerollThreshold.fill("1");
    await rerollThreshold.blur();
    await expect(rerollThreshold).toHaveValue("2");

    await options.focus();
    await page.keyboard.press("Space");
    await expect(successThreshold).toBeHidden();
    await page.keyboard.press("Space");
    await expect(successThreshold).toHaveValue("10");
    await expect(rerollThreshold).toHaveValue("2");

    await diceCount.fill("21");
    await diceCount.blur();
    await expect(diceCount).toHaveValue("20");
  });

  test("rolls exploding d10 dice and shows the success count", async ({ page }) => {
    await page.evaluate(() => {
      const sequence = [0.95, 0.8, 0.95, 0.5, 0.3, 0];
      let index = 0;
      Math.random = () => sequence[index++] ?? 0;
    });

    await page.getByRole("spinbutton", { name: "Number of d10 dice" }).fill("4");
    await page.getByText("Options", { exact: true }).click();
    await page.getByRole("spinbutton", { name: "Success threshold" }).fill("8");
    await page.getByRole("spinbutton", { name: "Reroll threshold" }).fill("10");
    await page.getByRole("button", { name: "Roll" }).click();

    await expect(page.getByText("(19 [10 9] 16 [10 6] 4 1)", { exact: true })).toBeVisible();
    await expect(page.getByText("(3 successes)", { exact: true })).toBeVisible();
  });
});
