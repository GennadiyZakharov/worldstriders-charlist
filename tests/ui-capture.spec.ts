import { test } from "@playwright/test";
import { mkdirSync } from "node:fs";

test("capture full-page screenshot", async ({ page }) => {
  mkdirSync("artifacts/screenshots", { recursive: true });

  await page.goto("/");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.screenshot({
    path: "artifacts/screenshots/page-full.png",
    fullPage: true
  });
});
