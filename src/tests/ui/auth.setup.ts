import { test } from "@playwright/test";
import { SALES_PORTAL_URL, credentials } from "config/env";
import { HomePage } from "ui/pages/home.page";

test("create storage state for authenticated user", async ({ page, context }) => {
  await page.goto(SALES_PORTAL_URL);
  await page.locator("#emailinput").fill(credentials.username);
  await page.locator("#passwordinput").fill(credentials.password);
  await page.locator("button[type='submit']").click();

  // Wait for Home page to be fully opened (more robust than raw locator)
  await new HomePage(page).waitForOpened();

  await context.storageState({ path: "src/.auth/user.json" });
});
