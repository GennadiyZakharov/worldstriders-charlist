import { expect, test, type Page } from "@playwright/test";
import { load as loadYaml } from "js-yaml";

function perkSection(page: Page, title: string) {
  return page.getByRole("heading", { name: title }).locator("../..");
}

function anchorSection(page: Page, title: string) {
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
  expect(nameBox.x + nameBox.width).toBeLessThanOrEqual(ratingBox.x);
  expect(ratingBox.x + ratingBox.width).toBeLessThanOrEqual(buttonBox.x);
  expect(buttonBox.x + buttonBox.width).toBeLessThanOrEqual(rowBox.x + rowBox.width + 1);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth)
  );
}

async function expectCompactSkillLayout(
  page: Page,
  viewportWidth: number,
  sideBySide: boolean
) {
  await page.setViewportSize({ width: viewportWidth, height: 900 });

  const heading = page.getByRole("heading", { name: /^(SKILLS|НАВЫКИ)$/ });
  const section = heading.locator("..");
  const blocks = section.locator(".grid > .block");
  await expect(blocks).toHaveCount(3);

  const geometry = await blocks.evaluateAll((elements) => elements.map((element) => {
    const block = element.getBoundingClientRect();
    const rows = Array.from(element.querySelectorAll<HTMLElement>(".row"));
    const ratings = rows.map((row) => row.querySelector<HTMLElement>(".rating")!.getBoundingClientRect());
    const actions = rows.map((row) =>
      row.querySelector<HTMLElement>(".specializationsButton")!.getBoundingClientRect()
    );
    const names = rows.map((row) => row.querySelector<HTMLElement>(".name")!);
    const separator = getComputedStyle(element, "::before");

    return {
      block: { x: block.x, y: block.y, width: block.width },
      ratingLefts: ratings.map((rating) => rating.left),
      actionLefts: actions.map((action) => action.left),
      namesFit: names.every((name) =>
        name.scrollWidth <= name.clientWidth + 1 && name.scrollHeight <= name.clientHeight + 1
      ),
      rowOrder: rows.every((row) => Array.from(row.children).map((child) => {
        if (child.classList.contains("check")) return "check";
        if (child.classList.contains("text")) return "text";
        if (child.classList.contains("rating")) return "rating";
        if (child.classList.contains("specializationsButton")) return "action";
        return "other";
      }).join(",") === "check,text,rating,action"),
      separator: {
        borderLeftWidth: separator.borderLeftWidth,
        borderTopWidth: separator.borderTopWidth
      }
    };
  }));

  for (const { block, ratingLefts, actionLefts, namesFit, rowOrder } of geometry) {
    expect(block.width).toBeLessThanOrEqual(331);
    expect(namesFit).toBe(true);
    expect(rowOrder).toBe(true);
    expect(Math.max(...ratingLefts) - Math.min(...ratingLefts)).toBeLessThan(1);
    expect(Math.max(...actionLefts) - Math.min(...actionLefts)).toBeLessThan(1);
  }

  if (sideBySide) {
    expect(Math.max(...geometry.map(({ block }) => block.y)) -
      Math.min(...geometry.map(({ block }) => block.y))).toBeLessThan(1);
    expect(geometry[1].separator.borderLeftWidth).toBe("1px");
    expect(geometry[1].separator.borderTopWidth).toBe("0px");
  } else {
    expect(Math.max(...geometry.map(({ block }) => block.x)) -
      Math.min(...geometry.map(({ block }) => block.x))).toBeLessThan(1);
    expect(geometry[1].separator.borderLeftWidth).toBe("0px");
    expect(geometry[1].separator.borderTopWidth).toBe("1px");
  }

  const containment = await section.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth
  }));
  expect(containment.scrollWidth).toBeLessThanOrEqual(containment.clientWidth);
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

async function expectCharacteristicsLayout(page: Page, viewportWidth: number) {
  await page.setViewportSize({ width: viewportWidth, height: 900 });

  const grid = page.locator(".characteristicsGrid");
  const sheets = grid.locator(":scope > .sheet");
  await expect(sheets).toHaveCount(2);

  const geometry = await sheets.evaluateAll((elements) => elements.map((element) => {
    const sheet = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    return {
      x: sheet.x,
      y: sheet.y,
      width: sheet.width,
      height: sheet.height,
      borderWidth: style.borderTopWidth,
      borderStyle: style.borderTopStyle,
      fits: element.scrollWidth <= element.clientWidth
    };
  }));

  for (const sheet of geometry) {
    expect(sheet.borderWidth).toBe("2px");
    expect(sheet.borderStyle).toBe("solid");
    expect(sheet.fits).toBe(true);
  }

  expect(Math.abs(geometry[0].width - geometry[1].width)).toBeLessThanOrEqual(1);
  if (viewportWidth > 900) {
    expect(Math.abs(geometry[0].y - geometry[1].y)).toBeLessThan(1);
    expect(Math.abs(geometry[1].x - geometry[0].x - geometry[0].width - 16)).toBeLessThan(1);
  } else {
    expect(geometry[1].y).toBeGreaterThanOrEqual(geometry[0].y + geometry[0].height + 15);
    expect(Math.abs(geometry[0].x - geometry[1].x)).toBeLessThan(1);
  }

  const bodyPanel = sheets.nth(1).locator(".bodyPanel");
  const derivedPanel = sheets.nth(1).locator(".derivedPanel");
  const characteristicsGroup = sheets.nth(1).locator(".characteristicsGroup");
  const woundsPanel = sheets.nth(1).locator(".woundsPanel");
  const [bodyBox, derivedBox, characteristicsBox, woundsBox] = await Promise.all([
    bodyPanel.boundingBox(),
    derivedPanel.boundingBox(),
    characteristicsGroup.boundingBox(),
    woundsPanel.boundingBox()
  ]);
  expect(bodyBox).not.toBeNull();
  expect(derivedBox).not.toBeNull();
  expect(characteristicsBox).not.toBeNull();
  expect(woundsBox).not.toBeNull();
  if (!bodyBox || !derivedBox || !characteristicsBox || !woundsBox) return;

  expect(derivedBox.y).toBeGreaterThanOrEqual(bodyBox.y + bodyBox.height + 17);

  const bodyLayout = sheets.nth(1).locator(".bodyLayout");
  const layoutWidth = await bodyLayout.evaluate((element) => element.clientWidth);
  const divider = await woundsPanel.evaluate((element) => {
    const style = getComputedStyle(element, "::before");
    return {
      borderLeftWidth: style.borderLeftWidth,
      borderTopWidth: style.borderTopWidth,
      borderLeftColor: style.borderLeftColor
    };
  });
  if (layoutWidth > 519) {
    expect(Math.abs(woundsBox.y - bodyBox.y)).toBeLessThan(1);
    expect(woundsBox.x).toBeGreaterThan(bodyBox.x);
    expect(characteristicsBox.width).toBeLessThanOrEqual(268.5);
    expect(Math.abs(woundsBox.x - characteristicsBox.x - characteristicsBox.width - 24))
      .toBeLessThan(1);
    expect(divider.borderLeftWidth).toBe("1px");
    expect(divider.borderTopWidth).toBe("0px");
    expect(divider.borderLeftColor).toBe("rgba(0, 70, 95, 0.45)");
  } else {
    expect(woundsBox.y).toBeGreaterThan(derivedBox.y + derivedBox.height);
    expect(Math.abs(woundsBox.x - bodyBox.x)).toBeLessThan(1);
    expect(divider.borderLeftWidth).toBe("0px");
    expect(divider.borderTopWidth).toBe("1px");
  }

  const contentFits = await grid.evaluate((element) => ({
    clientWidth: element.clientWidth,
    scrollWidth: element.scrollWidth,
    labelsFit: Array.from(element.querySelectorAll<HTMLElement>(".bodyName, .derivedName"))
      .every((label) => label.scrollWidth <= label.clientWidth + 1)
  }));
  expect(contentFits.scrollWidth).toBeLessThanOrEqual(contentFits.clientWidth);
  expect(contentFits.labelsFit).toBe(true);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
    await page.evaluate(() => document.documentElement.clientWidth)
  );
}

async function expectWoundsGeometry(page: Page, viewportWidth: number, caption: string) {
  await page.setViewportSize({ width: viewportWidth, height: 900 });

  const triangle = page.getByRole("group", { name: caption, exact: true });
  await expect(triangle.locator(":scope > .top-mark")).toHaveCount(5);
  await expect(triangle.locator(":scope > .column-mark")).toHaveCount(4);
  await expect(triangle.locator(":scope > .separator")).toHaveCount(2);
  await expect(triangle.locator(":scope > .cell")).toHaveCount(10);
  await expect(triangle.locator(".marks, .marks-top, .marks-columns, .rows, .row")).toHaveCount(0);

  const geometry = await triangle.evaluate((element) => {
    const boxes = (selector: string) => Array.from(element.querySelectorAll<HTMLElement>(selector))
      .map((item) => item.getBoundingClientRect());
    const cells = boxes(":scope > .cell");
    const rowSizes = [4, 3, 2, 1];
    let offset = 0;
    const cellRows = rowSizes.map((size) => {
      const row = cells.slice(offset, offset + size);
      offset += size;
      return row;
    });
    const topMarks = boxes(":scope > .top-mark");
    const columnMarks = boxes(":scope > .column-mark");
    const rules = boxes(":scope > .separator");
    const triangleBox = element.getBoundingClientRect();

    return {
      cellRows: cellRows.map((row) => row.map((cell) => ({
        left: cell.left,
        right: cell.right,
        top: cell.top,
        bottom: cell.bottom,
        width: cell.width,
        height: cell.height
      }))),
      topCenters: topMarks.map((mark) => mark.left + mark.width / 2),
      topVerticalCenters: topMarks.map((mark) => mark.top + mark.height / 2),
      columnCenters: columnMarks.map((mark) => mark.left + mark.width / 2),
      columnVerticalCenters: columnMarks.map((mark) => mark.top + mark.height / 2),
      ruleWidths: rules.map((rule) => rule.width),
      triangleWidth: triangleBox.width,
      woundsFits: element.closest<HTMLElement>(".wounds")!.scrollWidth <=
        element.closest<HTMLElement>(".wounds")!.clientWidth,
      pageFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth
    };
  });

  const expectedSize = Math.min(25.6, Math.max(22.4, viewportWidth * 0.048));
  const firstRow = geometry.cellRows[0];
  for (const row of geometry.cellRows) {
    for (const cell of row) {
      expect(Math.abs(cell.width - expectedSize)).toBeLessThanOrEqual(0.1);
      expect(Math.abs(cell.height - expectedSize)).toBeLessThanOrEqual(0.1);
      expect(Math.abs(cell.width - cell.height)).toBeLessThanOrEqual(0.1);
    }
    for (let index = 1; index < row.length; index += 1) {
      expect(Math.abs(row[index].left - row[index - 1].right - 2)).toBeLessThanOrEqual(0.1);
    }
  }
  for (let index = 1; index < geometry.cellRows.length; index += 1) {
    expect(Math.abs(
      geometry.cellRows[index][0].top - geometry.cellRows[index - 1][0].bottom - 2
    )).toBeLessThanOrEqual(0.1);
  }

  const circleCenters = firstRow.map((cell) => cell.left + cell.width / 2);
  for (let index = 0; index < circleCenters.length; index += 1) {
    expect(Math.abs(geometry.columnCenters[index] - circleCenters[index])).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.topCenters[index] - circleCenters[index])).toBeLessThanOrEqual(1);
  }
  const columnPitch = circleCenters[1] - circleCenters[0];
  expect(Math.abs(geometry.topCenters[4] - geometry.topCenters[3] - columnPitch)).toBeLessThanOrEqual(1);
  expect(Math.max(...geometry.topVerticalCenters) - Math.min(...geometry.topVerticalCenters)).toBeLessThanOrEqual(1);
  expect(Math.max(...geometry.columnVerticalCenters) - Math.min(...geometry.columnVerticalCenters)).toBeLessThanOrEqual(1);
  for (const ruleWidth of geometry.ruleWidths) {
    expect(Math.abs(ruleWidth - geometry.triangleWidth)).toBeLessThanOrEqual(1);
  }
  expect(geometry.triangleWidth).toBeLessThanOrEqual(136);
  expect(geometry.woundsFits).toBe(true);
  expect(geometry.pageFits).toBe(true);
}

async function expectWoundsTextEnlargement(page: Page, caption: string) {
  await page.setViewportSize({ width: 390, height: 900 });
  await page.evaluate(() => {
    document.documentElement.style.setProperty("--ws-text-size", "28px");
    document.documentElement.style.setProperty("--ws-h2-size", "28px");
  });

  const triangle = page.getByRole("group", { name: caption, exact: true });
  const geometry = await triangle.evaluate((element) => {
    const bounds = (selector: string) => Array.from(element.querySelectorAll<HTMLElement>(selector))
      .map((item) => {
        const box = item.getBoundingClientRect();
        return {
          left: box.left,
          right: box.right,
          center: box.left + box.width / 2
        };
      });
    const topMarks = bounds(":scope > .top-mark");
    const columnMarks = bounds(":scope > .column-mark");
    const cells = bounds(":scope > .cell").slice(0, 4);

    return {
      topMarks,
      columnMarks,
      cellCenters: cells.map((cell) => cell.center),
      woundsFits: element.closest<HTMLElement>(".wounds")!.scrollWidth <=
        element.closest<HTMLElement>(".wounds")!.clientWidth,
      pageFits: document.documentElement.scrollWidth <= document.documentElement.clientWidth
    };
  });

  for (const marks of [geometry.topMarks, geometry.columnMarks]) {
    for (let index = 1; index < marks.length; index += 1) {
      expect(marks[index - 1].right).toBeLessThan(marks[index].left);
    }
  }
  for (let index = 0; index < geometry.cellCenters.length; index += 1) {
    expect(Math.abs(geometry.topMarks[index].center - geometry.cellCenters[index])).toBeLessThanOrEqual(1);
    expect(Math.abs(geometry.columnMarks[index].center - geometry.cellCenters[index])).toBeLessThanOrEqual(1);
  }
  expect(geometry.woundsFits).toBe(true);
  expect(geometry.pageFits).toBe(true);

  await page.evaluate(() => {
    document.documentElement.style.removeProperty("--ws-text-size");
    document.documentElement.style.removeProperty("--ws-h2-size");
  });
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

  test("keeps Wounds circles compact, aligned, localized, and interactive", async ({ page }) => {
    for (const viewportWidth of [390, 500, 900, 901, 1440, 1920]) {
      await expectWoundsGeometry(page, viewportWidth, "Wounds");
    }
    await expectWoundsTextEnlargement(page, "Wounds");

    const firstWound = page.getByRole("group", { name: "Wounds" }).locator(".cell").first();
    await expect(firstWound).toHaveAccessibleName("Wound 1: Empty");
    await firstWound.click();
    await expect(firstWound).toHaveAccessibleName("Wound 1: B");
    await expect(firstWound).toHaveText("B");
    await firstWound.dispatchEvent("keydown", { key: " " });
    await expect(firstWound).toHaveAccessibleName("Wound 1: A");
    await expect(firstWound).toHaveText("A");
    await firstWound.dispatchEvent("keydown", { key: "Enter" });
    await expect(firstWound).toHaveAccessibleName("Wound 1: L");
    await expect(firstWound).toHaveText("L");
    await firstWound.dispatchEvent("keydown", { key: "Backspace" });
    await expect(firstWound).toHaveAccessibleName("Wound 1: Empty");
    await expect(firstWound).toHaveText("");
    await firstWound.focus();
    await expect(firstWound).toBeFocused();
    await firstWound.click();
    await page.reload();
    await expect(page.getByRole("button", { name: "Wound 1: B" })).toHaveText("B");
    await page.getByRole("button", { name: "Wound 1: B" })
      .dispatchEvent("keydown", { key: "Delete" });

    await page.getByRole("button", { name: "RU" }).click();
    for (const viewportWidth of [390, 900, 901, 1440, 1920]) {
      await expectWoundsGeometry(page, viewportWidth, "Ранения");
    }
    await expect(page.getByText("A - Aggravated, усиливающиеся (6 мес)", { exact: true })).toBeVisible();
    await expect(page.getByText("L - Lethal, летальное (1 мес)", { exact: true })).toBeVisible();
    await expect(page.getByText("B - Bashing, ударные (3 дня)", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Ранение 1: Пусто" })).toBeVisible();
  });

  test("keeps Characteristics and Body/Derived/Wounds in responsive independently bordered cards", async ({ page }) => {
    const englishLabels = [
      "Characteristics",
      "Body",
      "Strength",
      "Agility",
      "Endurance",
      "DERIVED",
      "Initiative modifier",
      "Perception",
      "Wounds"
    ];
    const russianLabels = [
      "ХАРАКТЕРИСТИКИ",
      "Тело",
      "Сила",
      "Ловкость",
      "Выносливость",
      "Производные",
      "Мод. инициативы",
      "Восприятие",
      "Ранения"
    ];

    for (const viewportWidth of [390, 900, 901, 1440, 1920]) {
      await expectCharacteristicsLayout(page, viewportWidth);
      for (const label of englishLabels) {
        await expect(page.getByText(label, { exact: true })).toBeVisible();
      }
    }

    await expect(page.getByRole("group", { name: "Wounds", exact: true })).toHaveCount(1);
    await expect(page.locator(".xpColumn").getByRole("group", { name: "Wounds", exact: true }))
      .toHaveCount(0);

    await page.getByRole("button", { name: "RU" }).click();
    for (const viewportWidth of [390, 900, 901, 1440, 1920]) {
      await expectCharacteristicsLayout(page, viewportWidth);
      for (const label of russianLabels) {
        await expect(page.getByText(label, { exact: true })).toBeVisible();
      }
    }

    for (const viewportWidth of [390, 1440]) {
      await page.setViewportSize({ width: viewportWidth, height: 900 });
      await page.evaluate(() => {
        document.body.style.zoom = "2";
      });
      const grid = page.locator(".characteristicsGrid");
      const containment = await grid.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth,
        headingFits: Array.from(element.querySelectorAll<HTMLElement>(".ws-h1"))
          .every((heading) => heading.scrollWidth <= heading.clientWidth)
      }));
      expect(containment.scrollWidth).toBeLessThanOrEqual(containment.clientWidth);
      expect(containment.headingFits).toBe(true);
      await page.evaluate(() => {
        document.body.style.removeProperty("zoom");
      });
    }
  });

  test("preserves Body bounds and reactively updates every Derived value", async ({ page }) => {
    const bodySheet = page.locator(".characteristicsGrid > .sheet").nth(1);
    const bodyRatings = bodySheet.getByRole("slider");
    await expect(bodyRatings).toHaveCount(3);

    const strength = bodyRatings.nth(0);
    const agility = bodyRatings.nth(1);
    const endurance = bodyRatings.nth(2);

    await strength.focus();
    await page.keyboard.press("Home");
    await page.keyboard.press("ArrowLeft");
    await expect(strength).toHaveAttribute("aria-valuenow", "1");
    await page.keyboard.press("End");
    await page.keyboard.press("ArrowRight");
    await expect(strength).toHaveAttribute("aria-valuenow", "5");

    await agility.getByRole("button", { name: "Agility 4/5" }).click();
    await endurance.getByRole("button", { name: "Endurance 3/5" }).click();
    await expect(agility).toHaveAttribute("aria-valuenow", "4");
    await expect(endurance).toHaveAttribute("aria-valuenow", "3");

    const attributes = page.getByRole("heading", { name: "ATTRIBUTES" }).locator("..").getByRole("slider");
    await attributes.nth(1).getByRole("button").nth(2).click();
    await attributes.nth(5).getByRole("button").nth(1).click();
    await attributes.nth(8).getByRole("button").nth(3).click();

    const athleticsRow = page.getByText("Athletics", { exact: true }).locator("../..");
    await athleticsRow.getByRole("slider").getByRole("button", { name: "Athletics 2/5" }).click();

    const derivedValue = (label: string) => bodySheet.locator(".derivedRow")
      .filter({ hasText: label })
      .locator(".derivedVal");
    await expect(derivedValue("Size")).toHaveText("5");
    await expect(derivedValue("Defense")).toHaveText("5");
    await expect(derivedValue("Initiative modifier")).toHaveText("6");
    await expect(derivedValue("Speed")).toHaveText("13");
    await expect(derivedValue("Perception")).toHaveText("7");

    await page.reload();
    await expect(derivedValue("Defense")).toHaveText("5");
    await expect(derivedValue("Speed")).toHaveText("13");
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

  test("keeps composed perk values attached to the correct row after deletion", async ({ page }) => {
    let permanent = perkSection(page, "PERMANENT PERKS");

    await permanent.getByRole("button", { name: "Add" }).click();
    await permanent.getByRole("button", { name: "Add" }).click();

    const perkTexts = permanent.getByRole("textbox", { name: "Perk text" });
    await expect(perkTexts).toHaveCount(2);
    await perkTexts.nth(0).fill("  First perk  ");
    await perkTexts.nth(0).blur();
    await expect(perkTexts.nth(0)).toHaveValue("First perk");
    await perkTexts.nth(1).fill("Second perk");

    const descriptionButtons = permanent.getByRole("button", { name: "Description" });
    await descriptionButtons.nth(0).click();
    await page.getByRole("textbox", { name: "Perk description" }).fill("First description");
    await page.getByRole("button", { name: "Close" }).click();
    await descriptionButtons.nth(1).click();
    await page.getByRole("textbox", { name: "Perk description" }).fill("Second\ndescription");
    await page.getByRole("button", { name: "Close" }).click();

    const ratings = permanent.getByRole("slider");
    await ratings.nth(0).getByRole("button").nth(1).click();
    await ratings.nth(1).getByRole("button").nth(3).click();
    await expect(ratings.nth(0)).toHaveAttribute("aria-valuenow", "2");
    await expect(ratings.nth(1)).toHaveAttribute("aria-valuenow", "4");

    const deleteButtons = permanent.getByRole("button", { name: "Delete perk" });
    await expect(deleteButtons).toHaveCount(2);
    await deleteButtons.nth(0).click();

    await expect(permanent.getByRole("textbox", { name: "Perk text" })).toHaveValue("Second perk");
    await expect(permanent.getByRole("slider")).toHaveAttribute("aria-valuenow", "4");
    await permanent.getByRole("button", { name: "Description" }).click();
    await expect(page.getByRole("textbox", { name: "Perk description" }))
      .toHaveValue("Second\ndescription");
    await page.getByRole("button", { name: "Close" }).click();

    await page.getByRole("button", { name: "RU" }).click();
    permanent = perkSection(page, "ПОСТОЯННЫЕ ПЕРКИ");
    await expect(permanent.getByRole("textbox", { name: "Текст перка" })).toHaveValue("Second perk");
    await expect(permanent.getByRole("button", { name: "Удалить перк" })).toHaveText("Удалить");

    await page.reload();
    permanent = perkSection(page, "ПОСТОЯННЫЕ ПЕРКИ");
    await expect(permanent.getByRole("textbox", { name: "Текст перка" })).toHaveValue("Second perk");
    await expect(permanent.getByRole("slider")).toHaveAttribute("aria-valuenow", "4");
    await permanent.getByRole("button", { name: "Описание" }).click();
    await expect(page.getByRole("textbox", { name: "Описание перка" }))
      .toHaveValue("Second\ndescription");
  });

  test("keeps localized perk controls ordered and within the page at responsive boundaries", async ({ page }) => {
    const viewportWidths = [390, 599, 600, 601, 899, 900, 901, 1440, 1920];

    await perkSection(page, "PERMANENT PERKS").getByRole("button", { name: "Add" }).click();

    const expectPerkLayout = async (viewportWidth: number, title: string, textLabel: string) => {
      await page.setViewportSize({ width: viewportWidth, height: 900 });
      const section = perkSection(page, title);
      const row = section.locator(".listRow");
      const item = row.locator(".itemRow");
      const textInput = row.getByRole("textbox", { name: textLabel });
      const descriptionButton = row.getByRole("button", { name: /^(Description|Описание)$/ });
      const rating = row.getByRole("slider");
      const deleteButton = row.getByRole("button", { name: /^(Delete perk|Удалить перк)$/ });

      const [rowBox, itemBox, textBox, descriptionBox, ratingBox, deleteBox] = await Promise.all([
        row.boundingBox(),
        item.boundingBox(),
        textInput.boundingBox(),
        descriptionButton.boundingBox(),
        rating.boundingBox(),
        deleteButton.boundingBox()
      ]);

      expect(rowBox).not.toBeNull();
      expect(itemBox).not.toBeNull();
      expect(textBox).not.toBeNull();
      expect(descriptionBox).not.toBeNull();
      expect(ratingBox).not.toBeNull();
      expect(deleteBox).not.toBeNull();
      if (!rowBox || !itemBox || !textBox || !descriptionBox || !ratingBox || !deleteBox) return;

      expect(textBox.x + textBox.width).toBeLessThanOrEqual(itemBox.x + itemBox.width + 1);
      expect(descriptionBox.x + descriptionBox.width).toBeLessThanOrEqual(itemBox.x + itemBox.width + 1);
      expect(ratingBox.x + ratingBox.width).toBeLessThanOrEqual(itemBox.x + itemBox.width + 1);
      expect(deleteBox.x + deleteBox.width).toBeLessThanOrEqual(rowBox.x + rowBox.width + 1);

      if (viewportWidth <= 600) {
        expect(textBox.y + textBox.height).toBeLessThanOrEqual(descriptionBox.y + 1);
        expect(descriptionBox.x).toBeLessThan(ratingBox.x);
      } else {
        expect(textBox.x).toBeLessThan(descriptionBox.x);
        expect(descriptionBox.x).toBeLessThan(ratingBox.x);
      }

      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        await page.evaluate(() => document.documentElement.clientWidth)
      );

      const perkSheets = page.locator(".perksGrid > .sheet");
      const [firstSheet, secondSheet] = await Promise.all([
        perkSheets.nth(0).boundingBox(),
        perkSheets.nth(1).boundingBox()
      ]);
      expect(firstSheet).not.toBeNull();
      expect(secondSheet).not.toBeNull();
      if (!firstSheet || !secondSheet) return;

      if (viewportWidth <= 900) expect(secondSheet.y).toBeGreaterThan(firstSheet.y);
      else expect(Math.abs(firstSheet.y - secondSheet.y)).toBeLessThan(1);
    };

    for (const viewportWidth of viewportWidths) {
      await expectPerkLayout(viewportWidth, "PERMANENT PERKS", "Perk text");
    }

    await page.getByRole("button", { name: "RU" }).click();
    for (const viewportWidth of viewportWidths) {
      await expectPerkLayout(viewportWidth, "ПОСТОЯННЫЕ ПЕРКИ", "Текст перка");
    }
  });

  test("reflows enlarged localized perk controls without introducing page overflow", async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 900 });

    const expectEnlargedPerkLayout = async (title: string, baselinePageWidth: number) => {
      const section = perkSection(page, title);
      const perksGrid = section.locator("../..");
      const itemRow = section.locator(".itemRow");
      const listRow = section.locator(".listRow");
      const description = section.getByRole("button", { name: /^(Description|Описание)$/ });
      const rating = section.getByRole("slider");
      const deleteButton = section.getByRole("button", { name: /^(Delete perk|Удалить перк)$/ });

      const [itemRowBox, listRowBox, descriptionBox, ratingBox, deleteBox] = await Promise.all([
        itemRow.boundingBox(),
        listRow.boundingBox(),
        description.boundingBox(),
        rating.boundingBox(),
        deleteButton.boundingBox()
      ]);
      expect(itemRowBox).not.toBeNull();
      expect(listRowBox).not.toBeNull();
      expect(descriptionBox).not.toBeNull();
      expect(ratingBox).not.toBeNull();
      expect(deleteBox).not.toBeNull();
      if (!itemRowBox || !listRowBox || !descriptionBox || !ratingBox || !deleteBox) return;

      const controlsOverlap = !(
        descriptionBox.x + descriptionBox.width <= ratingBox.x ||
        ratingBox.x + ratingBox.width <= descriptionBox.x ||
        descriptionBox.y + descriptionBox.height <= ratingBox.y ||
        ratingBox.y + ratingBox.height <= descriptionBox.y
      );
      expect(controlsOverlap).toBe(false);
      expect(descriptionBox.x + descriptionBox.width).toBeLessThanOrEqual(
        itemRowBox.x + itemRowBox.width + 1
      );
      expect(ratingBox.x + ratingBox.width).toBeLessThanOrEqual(itemRowBox.x + itemRowBox.width + 1);
      expect(deleteBox.x + deleteBox.width).toBeLessThanOrEqual(listRowBox.x + listRowBox.width + 1);

      const containment = await perksGrid.evaluate((element) => ({
        clientWidth: element.clientWidth,
        scrollWidth: element.scrollWidth
      }));
      expect(containment.scrollWidth).toBeLessThanOrEqual(containment.clientWidth);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
        baselinePageWidth
      );
    };

    await page.evaluate(() => {
      document.body.style.zoom = "2";
    });
    const englishBaselineWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    let permanent = perkSection(page, "PERMANENT PERKS");
    await permanent.getByRole("button", { name: "Add" }).click();
    await expectEnlargedPerkLayout("PERMANENT PERKS", englishBaselineWidth);
    await permanent.getByRole("button", { name: "Delete perk" }).click();

    await page.getByRole("button", { name: "RU" }).click();
    const russianBaselineWidth = await page.evaluate(() => document.documentElement.scrollWidth);
    permanent = perkSection(page, "ПОСТОЯННЫЕ ПЕРКИ");
    await permanent.getByRole("button", { name: "Добавить" }).click();
    await expectEnlargedPerkLayout("ПОСТОЯННЫЕ ПЕРКИ", russianBaselineWidth);
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
      schemaVersion: 4,
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

  test("keeps Skill lanes bounded, aligned, responsive, and fully localized", async ({ page }) => {
    await expect(page.getByRole("checkbox", { name: "Use skill: Natural sciences" })).toBeVisible();
    await expectInlineSkillRow(page, "Specializations: Natural sciences", "Specs");
    await expectInlineSkillRow(page, "Specializations: Animal handling", "Specs");

    for (const [width, sideBySide] of [[390, false], [1109, false], [1110, true], [1440, true], [1920, true]] as const) {
      await expectCompactSkillLayout(page, width, sideBySide);
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.getByRole("button", { name: "RU" }).click();

    await expect(page.getByRole("checkbox", { name: "Использовать навык: Холодное оружие" }))
      .toBeVisible();
    await expectInlineSkillRow(page, "Специализации: Холодное оружие", "Спец.");
    await expectInlineSkillRow(page, "Специализации: Зн. животных", "Спец.");

    for (const [width, sideBySide] of [[390, false], [1109, false], [1110, true], [1440, true], [1920, true]] as const) {
      await expectCompactSkillLayout(page, width, sideBySide);
    }
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

  test("edits localized Anchors before Notes and preserves row values", async ({ page }) => {
    let anchors = anchorSection(page, "Anchors");
    const notesSheet = page.getByRole("heading", { name: "Notes" }).locator("../..");

    await expect(anchors).toHaveCount(1);
    await expect.poll(async () => {
      const anchorBox = await anchors.boundingBox();
      const notesBox = await notesSheet.boundingBox();
      return anchorBox && notesBox ? anchorBox.y < notesBox.y : false;
    }).toBe(true);

    await anchors.getByRole("button", { name: "Add" }).click();
    await anchors.getByRole("button", { name: "Add" }).click();
    const texts = anchors.getByRole("textbox", { name: "Anchor text" });
    await texts.nth(0).fill("  First anchor  ");
    await texts.nth(0).blur();
    await expect(texts.nth(0)).toHaveValue("First anchor");
    await texts.nth(1).fill("Second anchor");

    const secondDescription = anchors.getByRole("button", { name: "Description" }).nth(1);
    await secondDescription.focus();
    await page.keyboard.press("Enter");
    await page.getByRole("textbox", { name: "Anchor description" }).fill("Second\nanchor detail");
    await page.getByRole("button", { name: "Close" }).click();
    await anchors.getByRole("button", { name: "Delete anchor" }).nth(0).click();
    await expect(anchors.getByRole("textbox", { name: "Anchor text" })).toHaveValue("Second anchor");

    await page.getByRole("button", { name: "RU" }).click();
    anchors = anchorSection(page, "Якоря");
    await expect(anchors.getByRole("textbox", { name: "Текст якоря" })).toHaveValue("Second anchor");
    await anchors.getByRole("button", { name: "Описание" }).click();
    await expect(page.getByRole("textbox", { name: "Описание якоря" }))
      .toHaveValue("Second\nanchor detail");
    await page.getByRole("button", { name: "Закрыть" }).click();

    await page.reload();
    anchors = anchorSection(page, "Якоря");
    await expect(anchors.getByRole("textbox", { name: "Текст якоря" })).toHaveValue("Second anchor");

    page.once("dialog", (dialog) => dialog.accept());
    await page.getByRole("button", { name: "Сброс" }).click();
    await expect(anchorSection(page, "Anchors").getByRole("textbox", { name: "Anchor text" }))
      .toHaveCount(0);
  });

  test("lays out Anchors at half width and reflows responsively", async ({ page }) => {
    const anchorsGrid = page.locator(".anchorsGrid");

    const expectLayout = async (
      width: number,
      stacked: boolean,
      title: string,
      anchorsContainmentOnly = false
    ) => {
      await page.setViewportSize({ width, height: 900 });
      const anchorsSheet = anchorSection(page, title).locator("..");
      const [gridBox, sheetBox] = await Promise.all([
        anchorsGrid.boundingBox(),
        anchorsSheet.boundingBox()
      ]);
      expect(gridBox).not.toBeNull();
      expect(sheetBox).not.toBeNull();
      if (!gridBox || !sheetBox) return;

      if (stacked) expect(Math.abs(gridBox.width - sheetBox.width)).toBeLessThan(1);
      else expect(sheetBox.width).toBeLessThan(gridBox.width * 0.51);
      if (anchorsContainmentOnly) {
        expect(sheetBox.x).toBeGreaterThanOrEqual(gridBox.x - 1);
        expect(sheetBox.x + sheetBox.width).toBeLessThanOrEqual(gridBox.x + gridBox.width + 1);
        expect(await anchorsSheet.locator("*:visible").evaluateAll((elements, sheetBounds) =>
          elements.every((element) => {
            const bounds = element.getBoundingClientRect();
            return bounds.left >= sheetBounds.x - 1
              && bounds.right <= sheetBounds.x + sheetBounds.width + 1;
          }), sheetBox)).toBe(true);
      } else {
        expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(
          await page.evaluate(() => document.documentElement.clientWidth)
        );
      }
    };

    for (const [width, stacked] of [[899, true], [900, true], [901, false], [1440, false]] as const) {
      await expectLayout(width, stacked, "Anchors");
    }

    await page.getByRole("button", { name: "RU" }).click();
    await expectLayout(390, true, "Якоря");
    await expectLayout(901, false, "Якоря");

    await page.evaluate(() => {
      document.body.style.zoom = "2";
    });
    await expectLayout(390, true, "Якоря", true);
  });

  test("round-trips and safely normalizes Anchors through YAML", async ({ page }) => {
    const anchors = anchorSection(page, "Anchors");
    await anchors.getByRole("button", { name: "Add" }).click();
    await anchors.getByRole("textbox", { name: "Anchor text" }).fill("YAML anchor");
    await anchors.getByRole("button", { name: "Description" }).click();
    await page.getByRole("textbox", { name: "Anchor description" }).fill("First line\nSecond line");
    await page.getByRole("button", { name: "Close" }).click();

    const downloadPromise = page.waitForEvent("download");
    await page.getByRole("button", { name: "Export YAML" }).click();
    const download = await downloadPromise;
    const yamlStream = await download.createReadStream();
    const chunks: Buffer[] = [];
    for await (const chunk of yamlStream) chunks.push(Buffer.from(chunk));
    const yaml = Buffer.concat(chunks).toString("utf8");
    const parsedYaml: unknown = loadYaml(yaml);
    expect(parsedYaml).toHaveProperty("anchors", [
      { text: "YAML anchor", description: "First line\nSecond line" }
    ]);

    await page.evaluate(() => localStorage.clear());
    await page.reload();
    await page.locator('input[type="file"]').setInputFiles({
      name: "anchors.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(yaml)
    });
    const importedAnchors = anchorSection(page, "Anchors");
    await expect(importedAnchors.getByRole("textbox", { name: "Anchor text" }))
      .toHaveValue("YAML anchor");
    await importedAnchors.getByRole("button", { name: "Description" }).click();
    await expect(page.getByRole("textbox", { name: "Anchor description" }))
      .toHaveValue("First line\nSecond line");
    await page.getByRole("button", { name: "Close" }).click();

    await page.locator('input[type="file"]').setInputFiles({
      name: "malformed-anchors.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from(`schemaVersion: 1
lang: en
meta:
  characterName: Preserved name
anchors:
  - text: Preserved anchor
    description: |
      First line
      Second line
    unknownField: harmless
  - text: 42
    description: false
  - malformed
`)
    });

    await expect.poll(async () => page.evaluate(() => {
      const value = localStorage.getItem("worldstriders.charlist.v1");
      if (!value) return null;
      const parsed = JSON.parse(value) as {
        schemaVersion: number;
        meta: { characterName: string };
        anchors: Array<{ text: string; description: string }>;
      };
      return {
        schemaVersion: parsed.schemaVersion,
        characterName: parsed.meta.characterName,
        anchors: parsed.anchors
      };
    })).toEqual({
      schemaVersion: 4,
      characterName: "Preserved name",
      anchors: [
        { text: "Preserved anchor", description: "First line\nSecond line\n" },
        { text: "", description: "" },
        { text: "", description: "" }
      ]
    });

    await page.locator('input[type="file"]').setInputFiles({
      name: "legacy.yaml",
      mimeType: "text/yaml",
      buffer: Buffer.from("schemaVersion: 3\nlang: en\n")
    });
    await expect(anchorSection(page, "Anchors").getByRole("textbox", { name: "Anchor text" }))
      .toHaveCount(0);
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
      schemaVersion: 4,
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
      schemaVersion: 4,
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
