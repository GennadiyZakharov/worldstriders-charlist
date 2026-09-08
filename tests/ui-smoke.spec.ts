import { expect, test, type Page } from "@playwright/test";

function perkSection(page: Page, title: string) {
  return page.getByRole("heading", { name: title }).locator("../..");
}

async function expectInlineSkillRow(
  page: Page,
  accessibleName: string,
  visibleLabel: string
) {
  const button = page.getByRole("button", { name: accessibleName });
  const row = button.locator("..");
  const checkbox = row.getByRole("checkbox");
  const name = row.locator(".name");
  const rating = row.locator(".rating");

  await expect(button).toHaveText(visibleLabel);

  const [rowBox, checkboxBox, nameBox, buttonBox, ratingBox] = await Promise.all([
    row.boundingBox(),
    checkbox.boundingBox(),
    name.boundingBox(),
    button.boundingBox(),
    rating.boundingBox()
  ]);

  expect(rowBox).not.toBeNull();
  expect(checkboxBox).not.toBeNull();
  expect(nameBox).not.toBeNull();
  expect(buttonBox).not.toBeNull();
  expect(ratingBox).not.toBeNull();

  if (!rowBox || !checkboxBox || !nameBox || !buttonBox || !ratingBox) return;

  const centerY = (box: { y: number; height: number }) => box.y + box.height / 2;
  expect(Math.abs(centerY(nameBox) - centerY(buttonBox))).toBeLessThan(2);
  expect(Math.abs(centerY(buttonBox) - centerY(ratingBox))).toBeLessThan(2);
  expect(checkboxBox.x).toBeLessThan(nameBox.x);
  expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(buttonBox.x);
  expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(ratingBox.x);
  expect(ratingBox.x + ratingBox.width).toBeLessThanOrEqual(rowBox.x + rowBox.width + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth)
  );
}

async function expectCompactAttributeLayout(
  page: Page,
  viewportWidth: number,
  expectSingleLineLabels = true
) {
  await page.setViewportSize({ width: viewportWidth, height: 900 });

  const heading = page.getByRole("heading", { name: /^(ATTRIBUTES|АТРИБУТЫ)$/ });
  const section = heading.locator("..");
  const columns = section.locator(".grid > .col");

  await expect(columns).toHaveCount(3);

  const sectionOverflow = await section.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }));

  const geometry = await columns.evaluateAll((elements) => elements.map((element) => {
    const column = element.getBoundingClientRect();
    const ratings = Array.from(element.querySelectorAll<HTMLElement>('[role="slider"]'))
      .map((rating) => rating.getBoundingClientRect());
    const names = Array.from(element.querySelectorAll<HTMLElement>(".name"));

    return {
      column: { x: column.x, y: column.y, width: column.width },
      ratingEdges: ratings.map((rating) => ({ left: rating.left, right: rating.right })),
      namesFit: names.every((name) => name.scrollWidth <= name.clientWidth + 1),
      namesSingleLine: names.every((name) => {
        const range = document.createRange();
        range.selectNodeContents(name);
        return range.getClientRects().length === 1;
      })
    };
  }));

  for (const { column, ratingEdges, namesFit, namesSingleLine } of geometry) {
    expect(column.width).toBeGreaterThanOrEqual(267);
    expect(column.width).toBeLessThanOrEqual(269);
    expect(namesFit).toBe(true);
    if (expectSingleLineLabels) expect(namesSingleLine).toBe(true);
    expect(ratingEdges).toHaveLength(3);

    const firstRating = ratingEdges[0];
    for (const rating of ratingEdges.slice(1)) {
      expect(Math.abs(rating.left - firstRating.left)).toBeLessThan(1);
      expect(Math.abs(rating.right - firstRating.right)).toBeLessThan(1);
    }
    for (const rating of ratingEdges) {
      expect(rating.left).toBeGreaterThanOrEqual(column.x);
      expect(rating.right).toBeLessThanOrEqual(column.x + column.width + 1);
    }
  }

  if (viewportWidth > 924) {
    expect(Math.max(...geometry.map(({ column }) => column.y)) -
      Math.min(...geometry.map(({ column }) => column.y))).toBeLessThan(1);
    expect(geometry[1].column.x).toBeGreaterThan(geometry[0].column.x);
    expect(geometry[2].column.x).toBeGreaterThan(geometry[1].column.x);
  } else {
    expect(Math.max(...geometry.map(({ column }) => column.x)) -
      Math.min(...geometry.map(({ column }) => column.x))).toBeLessThan(1);
    expect(geometry[1].column.y).toBeGreaterThan(geometry[0].column.y);
    expect(geometry[2].column.y).toBeGreaterThan(geometry[1].column.y);
  }

  expect(sectionOverflow.scrollWidth).toBeLessThanOrEqual(sectionOverflow.clientWidth);
}

test.describe("UI smoke", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => localStorage.clear());
    await page.reload();
  });

  test("renders a prominent, responsive, localized page heading", async ({ page }) => {
    const expectBrandLayout = async (viewportWidth: number, title: string) => {
      await page.setViewportSize({ width: viewportWidth, height: 900 });

      const heading = page.getByRole("heading", { level: 1, name: title, exact: true });
      const logoRow = heading.locator("..");
      const shield = logoRow.locator(".logoMark");

      await expect(heading).toBeVisible();
      await expect(shield).toHaveAttribute("aria-hidden", "true");

      const geometry = await logoRow.evaluate((element) => {
        const row = element.getBoundingClientRect();
        const mark = element.querySelector<HTMLElement>(".logoMark")?.getBoundingClientRect();
        const titleElement = element.querySelector<HTMLElement>(".logoText");
        const titleBox = titleElement?.getBoundingClientRect();
        const titleStyle = titleElement ? getComputedStyle(titleElement) : null;
        const markStyle = element.querySelector<HTMLElement>(".logoMark");

        return {
          row: { x: row.x, width: row.width },
          mark: mark ? { x: mark.x, y: mark.y, width: mark.width, height: mark.height } : null,
          title: titleBox ? {
            x: titleBox.x,
            y: titleBox.y,
            width: titleBox.width,
            height: titleBox.height
          } : null,
          titleFontSize: titleStyle ? Number.parseFloat(titleStyle.fontSize) : 0,
          titleFontWeight: titleStyle ? Number.parseInt(titleStyle.fontWeight, 10) : 0,
          markFontSize: markStyle ? Number.parseFloat(getComputedStyle(markStyle).fontSize) : 0,
          pageFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth
        };
      });

      expect(geometry.mark).not.toBeNull();
      expect(geometry.title).not.toBeNull();
      if (!geometry.mark || !geometry.title) return;

      expect(geometry.titleFontSize).toBeGreaterThanOrEqual(28);
      expect(geometry.titleFontSize).toBeLessThanOrEqual(32);
      expect(geometry.titleFontWeight).toBeGreaterThanOrEqual(700);
      expect(geometry.markFontSize).toBeGreaterThanOrEqual(38);
      expect(geometry.markFontSize).toBeLessThanOrEqual(44);
      expect(geometry.pageFits).toBe(true);

      const rowCenter = geometry.row.x + geometry.row.width / 2;
      if (viewportWidth <= 480) {
        expect(geometry.mark.y + geometry.mark.height).toBeLessThanOrEqual(geometry.title.y + 1);
        expect(Math.abs(geometry.mark.x + geometry.mark.width / 2 - rowCenter)).toBeLessThan(2);
        expect(Math.abs(geometry.title.x + geometry.title.width / 2 - rowCenter)).toBeLessThan(2);
      } else {
        expect(geometry.mark.x + geometry.mark.width).toBeLessThanOrEqual(geometry.title.x);
        expect(Math.abs(
          geometry.mark.y + geometry.mark.height / 2 -
          (geometry.title.y + geometry.title.height / 2)
        )).toBeLessThan(2);
      }
    };

    for (const viewportWidth of [390, 479, 480, 481, 1440, 1920]) {
      await expectBrandLayout(viewportWidth, "WorldStriders");
    }

    await page.getByRole("button", { name: "RU" }).click();
    for (const viewportWidth of [390, 479, 480, 481, 1440, 1920]) {
      await expectBrandLayout(viewportWidth, "Мироxодцы");
    }
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

  test("keeps localized Attribute groups compact and aligned across the breakpoint", async ({ page }) => {
    const englishLabels = [
      "Intellect",
      "Quick wits",
      "Determination",
      "Magic",
      "Luck",
      "Body control",
      "Impressiveness",
      "Manipulation",
      "Composure"
    ];
    const russianLabels = [
      "Интеллект",
      "Сообразительность",
      "Решительность",
      "Магия",
      "Удача",
      "Контроль тела",
      "Внушительность",
      "Манипулирование",
      "Самообладание"
    ];

    for (const viewportWidth of [390, 924, 925, 1440, 1920]) {
      await expectCompactAttributeLayout(page, viewportWidth);
      for (const label of englishLabels) await expect(page.getByText(label, { exact: true })).toBeVisible();
    }

    let attributesSection = page.getByRole("heading", { name: "ATTRIBUTES" }).locator("..");
    await attributesSection.evaluate((element) => {
      const section = element as HTMLElement;
      section.style.setProperty("--ws-label-size", "28px");
      section.style.setProperty("--ws-h1-size", "36px");
    });

    for (const viewportWidth of [390, 1440]) {
      await expectCompactAttributeLayout(page, viewportWidth, false);
      for (const label of englishLabels) await expect(page.getByText(label, { exact: true })).toBeVisible();
    }

    await attributesSection.evaluate((element) => {
      const section = element as HTMLElement;
      section.style.removeProperty("--ws-label-size");
      section.style.removeProperty("--ws-h1-size");
    });
    await page.getByRole("button", { name: "RU" }).click();

    for (const viewportWidth of [390, 924, 925, 1440, 1920]) {
      await expectCompactAttributeLayout(page, viewportWidth);
      for (const label of russianLabels) await expect(page.getByText(label, { exact: true })).toBeVisible();
    }

    attributesSection = page.getByRole("heading", { name: "АТРИБУТЫ" }).locator("..");
    await attributesSection.evaluate((element) => {
      const section = element as HTMLElement;
      section.style.setProperty("--ws-label-size", "28px");
      section.style.setProperty("--ws-h1-size", "36px");
    });

    for (const viewportWidth of [390, 1440]) {
      await expectCompactAttributeLayout(page, viewportWidth, false);
      for (const label of russianLabels) await expect(page.getByText(label, { exact: true })).toBeVisible();
    }
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
      schemaVersion: 3,
      permanent: { text: "Legacy perk", description: "", level: 5 },
      temporary: { text: "Malformed description", description: "", level: 2 }
    });

    await perkSection(page, "PERMANENT PERKS").getByRole("button", { name: "Description" }).click();
    await expect(page.getByRole("textbox", { name: "Perk description" })).toHaveValue("");
    await page.getByRole("button", { name: "Close" }).click();
    await perkSection(page, "TEMPORARY PERKS").getByRole("button", { name: "Description" }).click();
    await expect(page.getByRole("textbox", { name: "Perk description" })).toHaveValue("");
  });

  test("edits localized multiline Skill specializations and persists them", async ({ page }) => {
    const humanitiesButton = page.getByRole("button", { name: "Specializations: Humanities" });
    await humanitiesButton.focus();
    await page.keyboard.press("Enter");

    let dialog = page.getByRole("dialog", { name: "Skill specializations: Humanities" });
    const humanitiesText = dialog.getByRole("textbox", { name: "Skill specializations: Humanities" });
    await humanitiesText.fill("History\nLinguistics");
    await page.keyboard.press("Escape");
    await expect(dialog).toBeHidden();

    await humanitiesButton.click();
    await expect(humanitiesText).toHaveValue("History\nLinguistics");
    await dialog.getByRole("button", { name: "Close" }).click();

    await page.getByRole("button", { name: "Specializations: Technical" }).click();
    dialog = page.getByRole("dialog", { name: "Skill specializations: Technical" });
    await dialog.getByRole("textbox", { name: "Skill specializations: Technical" }).fill("Engineering");
    await dialog.getByRole("button", { name: "Close" }).click();

    await page.getByRole("button", { name: "RU" }).click();
    await page.getByRole("button", { name: "Специализации: Гуманитарные н." }).click();
    const russianDialog = page.getByRole("dialog", { name: "Специализации навыка: Гуманитарные н." });
    await expect(russianDialog.getByRole("textbox", { name: "Специализации навыка: Гуманитарные н." }))
      .toHaveValue("History\nLinguistics");
    await russianDialog.getByRole("button", { name: "Закрыть" }).click();

    await page.reload();
    await page.getByRole("button", { name: "Специализации: Гуманитарные н." }).click();
    await expect(page.getByRole("textbox", { name: "Специализации навыка: Гуманитарные н." }))
      .toHaveValue("History\nLinguistics");
    await page.getByRole("button", { name: "Закрыть" }).click();
    await page.getByRole("button", { name: "Специализации: Технические н." }).click();
    await expect(page.getByRole("textbox", { name: "Специализации навыка: Технические н." }))
      .toHaveValue("Engineering");
  });

  test("keeps compact Skill controls inline at desktop and mobile widths", async ({ page }) => {
    await expectInlineSkillRow(page, "Specializations: Natural sciences", "Specs");
    await expectInlineSkillRow(page, "Specializations: Animal handling", "Specs");

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "RU" }).click();

    await expectInlineSkillRow(page, "Специализации: Холодное оружие", "Спец.");
    await expectInlineSkillRow(page, "Специализации: Зн. животных", "Спец.");
  });

  test("round-trips multiline Skill specializations through YAML", async ({ page }) => {
    await page.getByRole("button", { name: "Specializations: Humanities" }).click();
    await page.getByRole("textbox", { name: "Skill specializations: Humanities" })
      .fill("History\nLinguistics");
    await page.getByRole("button", { name: "Close" }).click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export YAML" }).click();
    const download = await downloadPromise;
    const yamlStream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of yamlStream) chunks.push(Buffer.from(chunk));
    const yaml = Buffer.concat(chunks).toString("utf8");
    expect(yaml).toContain("note: |-\n          History\n          Linguistics");

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('input[type="file"]').setInputFiles({
      name: "character.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(yaml)
    });

    await page.getByRole("button", { name: "Specializations: Humanities" }).click();
    await expect(page.getByRole("textbox", { name: "Skill specializations: Humanities" }))
      .toHaveValue("History\nLinguistics");
  });

  test("normalizes legacy and malformed Skill notes", async ({ page }) => {
    await page.locator('input[type="file"]').setInputFiles({
      name: "skill-notes.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(`schemaVersion: 1
lang: en
skills:
  mental:
    - id: humanities
      line:
        enabled: true
        note: Legacy specialization
        rating: 9
        unknownField: harmless
    - id: technical
      line:
        enabled: false
        note: 42
        rating: 2
`)
    });

    await expect.poll(async () => page.evaluate(() => {
      const value = localStorage.getItem("worldstriders.charlist.v1");
      if (!value) return null;
      const parsed = JSON.parse(value) as {
        skills: { mental: Array<{ id: string; line: { note: string; rating: number } }> };
      };
      return parsed.skills.mental.slice(0, 2);
    })).toEqual([
      { id: "humanities", line: { enabled: true, note: "Legacy specialization", rating: 5 } },
      { id: "technical", line: { enabled: false, note: "", rating: 2 } }
    ]);

    await page.getByRole("button", { name: "Specializations: Humanities" }).click();
    await expect(page.getByRole("textbox", { name: "Skill specializations: Humanities" }))
      .toHaveValue("Legacy specialization");
    await page.getByRole("button", { name: "Close" }).click();
    await page.getByRole("button", { name: "Specializations: Technical" }).click();
    await expect(page.getByRole("textbox", { name: "Skill specializations: Technical" })).toHaveValue("");
  });

  test("edits localized Notes at the bottom and persists and resets them", async ({ page }) => {
    const notesSheet = page.locator(".page > .sheet").last();
    const notes = notesSheet.getByRole("textbox", { name: "Notes" });

    await expect(notesSheet.getByRole("heading", { name: "Notes" })).toBeVisible();
    await expect(notes).toBeVisible();
    await notes.focus();
    await expect(notes).toBeFocused();
    await notes.fill("First line\nSecond line");

    await page.getByRole("button", { name: "RU" }).click();
    const russianNotes = notesSheet.getByRole("textbox", { name: "Заметки" });
    await expect(notesSheet.getByRole("heading", { name: "Заметки" })).toBeVisible();
    await expect(russianNotes).toHaveValue("First line\nSecond line");

    await page.reload();
    await expect(page.getByRole("textbox", { name: "Заметки" })).toHaveValue("First line\nSecond line");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Сброс" }).click();
    await expect(page.getByRole("textbox", { name: "Notes" })).toHaveValue("");
  });

  test("round-trips multiline Notes through YAML", async ({ page }) => {
    await page.getByRole("textbox", { name: "Notes" }).fill("First YAML line\nSecond YAML line");

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export YAML" }).click();
    const download = await downloadPromise;
    const yamlStream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of yamlStream) chunks.push(Buffer.from(chunk));
    const yaml = Buffer.concat(chunks).toString("utf8");
    expect(yaml).toContain("general: |-");
    expect(yaml).toContain("First YAML line\n    Second YAML line");

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('input[type="file"]').setInputFiles({
      name: "notes.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(yaml)
    });

    await expect(page.getByRole("textbox", { name: "Notes" }))
      .toHaveValue("First YAML line\nSecond YAML line");
  });

  test("normalizes legacy and malformed Notes without losing known fields", async ({ page }) => {
    const fileInput = page.locator('input[type="file"]');

    await fileInput.setInputFiles({
      name: "legacy-notes.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(`schemaVersion: 2
lang: en
notes:
  background: Legacy background
  inventory: Legacy inventory
  contacts: Legacy contacts
  unknownField: harmless
`)
    });

    await expect.poll(async () => page.evaluate(() => {
      const value = localStorage.getItem("worldstriders.charlist.v1");
      if (!value) return null;
      const parsed = JSON.parse(value) as {
        schemaVersion: number;
        notes: { general: string; background: string; inventory: string; contacts: string };
      };
      return { schemaVersion: parsed.schemaVersion, notes: parsed.notes };
    })).toEqual({
      schemaVersion: 3,
      notes: {
        general: "",
        background: "Legacy background",
        inventory: "Legacy inventory",
        contacts: "Legacy contacts"
      }
    });
    await expect(page.getByRole("textbox", { name: "Notes" })).toHaveValue("");

    await fileInput.setInputFiles({
      name: "malformed-notes.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(`schemaVersion: 3
lang: en
notes:
  general: 42
  background: Preserved background
  inventory: Preserved inventory
  contacts: Preserved contacts
  unknownField: harmless
`)
    });

    await expect.poll(async () => page.evaluate(() => {
      const value = localStorage.getItem("worldstriders.charlist.v1");
      if (!value) return null;
      const parsed = JSON.parse(value) as {
        schemaVersion: number;
        notes: { general: string; background: string; inventory: string; contacts: string };
      };
      return { schemaVersion: parsed.schemaVersion, notes: parsed.notes };
    })).toEqual({
      schemaVersion: 3,
      notes: {
        general: "",
        background: "Preserved background",
        inventory: "Preserved inventory",
        contacts: "Preserved contacts"
      }
    });
    await expect(page.getByRole("textbox", { name: "Notes" })).toHaveValue("");
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

  test("keeps the dice roller compact, aligned, responsive, and localized", async ({ page }) => {
    const expectLayout = async (
      viewportWidth: number,
      labels: {
        heading: string;
        diceCount: string;
        options: string;
        successThreshold: string;
        rerollThreshold: string;
        roll: string;
        result: string;
      }
    ) => {
      await page.setViewportSize({ width: viewportWidth, height: 900 });

      const section = page.getByRole("heading", { name: labels.heading }).locator("..");
      const diceCount = page.getByRole("spinbutton", { name: labels.diceCount });
      const roll = page.getByRole("button", { name: labels.roll });
      const options = page.getByText(labels.options, { exact: true });
      const successThreshold = page.getByRole("spinbutton", { name: labels.successThreshold });
      const rerollThreshold = page.getByRole("spinbutton", { name: labels.rerollThreshold });
      const result = section.locator(".resultBlock");

      const geometry = await section.evaluate((element) => {
        const sectionBounds = element.getBoundingClientRect();
        const box = (selector: string) => {
          const bounds = element.querySelector<HTMLElement>(selector)?.getBoundingClientRect();
          return bounds
            ? { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height }
            : null;
        };

        return {
          section: {
            x: sectionBounds.x,
            y: sectionBounds.y,
            width: sectionBounds.width,
            height: sectionBounds.height
          },
          diceCount: box(".diceCountField input"),
          roll: box(".rollButton"),
          options: box(".optionsButton"),
          result: box(".resultBlock"),
          thresholds: Array.from(element.querySelectorAll<HTMLElement>(".optionsPanel input"))
            .map((input) => {
              const bounds = input.getBoundingClientRect();
              return { x: bounds.x, y: bounds.y, width: bounds.width, height: bounds.height };
            }),
          labelsFit: Array.from(element.querySelectorAll<HTMLElement>(".field .ws-label"))
            .every((label) => label.scrollWidth <= label.clientWidth + 1),
          pageFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth
        };
      });

      expect(geometry.section).not.toBeNull();
      expect(geometry.diceCount).not.toBeNull();
      expect(geometry.roll).not.toBeNull();
      expect(geometry.options).not.toBeNull();
      expect(geometry.result).not.toBeNull();
      expect(geometry.thresholds).toHaveLength(2);
      if (
        !geometry.section ||
        !geometry.diceCount ||
        !geometry.roll ||
        !geometry.options ||
        !geometry.result
      ) return;

      const centerX = (box: { x: number; width: number }) => box.x + box.width / 2;
      expect(Math.abs(centerX(geometry.diceCount) - centerX(geometry.roll))).toBeLessThan(2);
      expect(Math.abs(centerX(geometry.roll) - centerX(geometry.options))).toBeLessThan(2);
      expect(geometry.diceCount.y + geometry.diceCount.height).toBeLessThan(geometry.roll.y);
      expect(geometry.roll.y + geometry.roll.height).toBeLessThanOrEqual(geometry.options.y);
      expect(geometry.options.y + geometry.options.height).toBeLessThan(geometry.result.y);
      expect(geometry.diceCount.width).toBeGreaterThanOrEqual(80);
      expect(geometry.diceCount.width).toBeLessThanOrEqual(96);
      expect(geometry.result.width).toBeGreaterThanOrEqual(geometry.section.width - 1);
      expect(geometry.labelsFit).toBe(true);
      expect(geometry.pageFits).toBe(true);

      for (const threshold of geometry.thresholds) {
        expect(threshold.width).toBeGreaterThanOrEqual(80);
        expect(threshold.width).toBeLessThanOrEqual(96);
      }

      if (viewportWidth <= 480) {
        expect(Math.abs(geometry.thresholds[0].x - geometry.thresholds[1].x)).toBeLessThan(1);
        expect(geometry.thresholds[0].y).toBeLessThan(geometry.thresholds[1].y);
      } else {
        expect(geometry.thresholds[0].x).toBeLessThan(geometry.thresholds[1].x);
        expect(Math.abs(geometry.thresholds[0].y - geometry.thresholds[1].y)).toBeLessThan(1);
      }

      await expect(diceCount).toBeVisible();
      await expect(roll).toBeVisible();
      await expect(options).toBeVisible();
      await expect(successThreshold).toBeVisible();
      await expect(rerollThreshold).toBeVisible();
      await expect(result.getByText(labels.result, { exact: true })).toBeVisible();
    };

    const english = {
      heading: "Dice Roller",
      diceCount: "Number of d10 dice",
      options: "Options",
      successThreshold: "Success threshold",
      rerollThreshold: "Reroll threshold",
      roll: "Roll",
      result: "Result"
    };
    const russian = {
      heading: "Бросок кубов",
      diceCount: "Количество кубиков d10",
      options: "Настройки",
      successThreshold: "Порог успеха",
      rerollThreshold: "Порог переброса",
      roll: "Бросить",
      result: "Результат"
    };

    await page.evaluate(() => {
      let reroll = true;
      Math.random = () => {
        reroll = !reroll;
        return reroll ? 0.95 : 0;
      };
    });
    await page.getByRole("spinbutton", { name: english.diceCount }).fill("20");
    await page.getByRole("button", { name: english.roll }).click();
    await page.getByText(english.options, { exact: true }).click();
    for (const viewportWidth of [390, 480, 481, 1440, 1920]) {
      await expectLayout(viewportWidth, english);
      await page.getByRole("heading", { name: english.heading }).locator("..").screenshot({
        path: `artifacts/screenshots/after-dice-roller-open-result-en-${viewportWidth}.png`
      });
    }

    await page.getByRole("button", { name: "RU" }).click();
    for (const viewportWidth of [390, 480, 481, 1440, 1920]) {
      await expectLayout(viewportWidth, russian);
      await page.getByRole("heading", { name: russian.heading }).locator("..").screenshot({
        path: `artifacts/screenshots/after-dice-roller-open-result-ru-${viewportWidth}.png`
      });
    }
  });

  test("reflows localized dice controls at 200% text size", async ({ page }) => {
    const captureTextLayout = async (
      language: "en" | "ru",
      heading: string,
      options: string,
      viewportWidth: number
    ) => {
      await page.setViewportSize({ width: viewportWidth, height: 900 });
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "200%";
      });

      const section = page.getByRole("heading", { name: heading }).locator("..");
      const layout = await section.evaluate((element) => ({
        labelsFit: Array.from(element.querySelectorAll<HTMLElement>(".field .ws-label"))
          .every((label) => label.scrollWidth <= label.clientWidth + 1),
        pageFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth
      }));

      expect(layout.labelsFit).toBe(true);
      expect(layout.pageFits).toBe(true);
      await expect(page.getByText(options, { exact: true })).toBeVisible();
      await section.screenshot({
        path: `artifacts/screenshots/after-dice-roller-open-result-${language}-${viewportWidth}-text-200.png`
      });
      await page.evaluate(() => {
        document.documentElement.style.fontSize = "";
      });
    };

    await page.evaluate(() => {
      let reroll = true;
      Math.random = () => {
        reroll = !reroll;
        return reroll ? 0.95 : 0;
      };
    });
    await page.getByRole("spinbutton", { name: "Number of d10 dice" }).fill("20");
    await page.getByRole("button", { name: "Roll" }).click();
    await page.getByText("Options", { exact: true }).click();

    for (const viewportWidth of [390, 1440]) {
      await captureTextLayout("en", "Dice Roller", "Options", viewportWidth);
    }

    await page.getByRole("button", { name: "RU" }).click();
    for (const viewportWidth of [390, 1440]) {
      await captureTextLayout("ru", "Бросок кубов", "Настройки", viewportWidth);
    }
  });

  test("wraps a long dice result inside the full-width result block", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });
    await page.evaluate(() => {
      let reroll = true;
      Math.random = () => {
        reroll = !reroll;
        return reroll ? 0.95 : 0;
      };
    });

    const diceCount = page.getByRole("spinbutton", { name: "Number of d10 dice" });
    await diceCount.fill("20");
    await page.getByRole("button", { name: "Roll" }).click();

    const resultLine = page.locator(".resultLine");
    await expect(resultLine).toBeVisible();
    const resultGeometry = await resultLine.evaluate((element) => {
      const styles = getComputedStyle(element);
      const lineHeight = Number.parseFloat(styles.lineHeight);
      return {
        height: element.getBoundingClientRect().height,
        lineHeight,
        fits: element.scrollWidth <= element.clientWidth + 1,
        pageFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth
      };
    });

    expect(resultGeometry.height).toBeGreaterThan(resultGeometry.lineHeight * 1.5);
    expect(resultGeometry.fits).toBe(true);
    expect(resultGeometry.pageFits).toBe(true);
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
