import { test, expect } from "fixtures";
import { EXPORT_ORDERS_NEGATIVE_CASES, EXPORT_ORDERS_POSITIVE_CASES } from "data/salesPortal/orders/exportOrdersDDT";
import { OrdersListPage } from "ui/pages/orders/ordersList.page";
import { parseDownloadedExport } from "utils/files/exportFile.utils";
import { TAGS } from "data/tags";

test.describe("[UI][Orders][Export]", () => {
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (token) await ordersApiService.fullDelete(token);
  });

  test.beforeEach(async ({ cleanup }) => {
    void cleanup;
  });

  test.describe("[Positive][Export orders]", () => {
    for (const testCase of EXPORT_ORDERS_POSITIVE_CASES) {
      test(testCase.title, { tag: [TAGS.UI, TAGS.ORDERS] }, async ({ ordersApiService, page }, testInfo) => {
        if (testCase.tableState !== "empty") {
          // Create a few orders to have stable export content.
          await ordersApiService.createOrderAndEntities(token, 1);
          await ordersApiService.createOrderAndEntities(token, 1);
          await ordersApiService.createOrderAndEntities(token, 1);
        }

        const ordersList = new OrdersListPage(page);
        await ordersList.open("#/orders");
        await ordersList.waitForOpened();

        if (testCase.sort) await ordersList.sortBy(testCase.sort.by, testCase.sort.direction);

        await ordersList.openExportModal();

        if (testCase.selectFormat) {
          await ordersList.exportModal.selectFormat(testCase.selectFormat);
        }

        if (testCase.fields === "ALL") {
          await ordersList.exportModal.checkAllFields();
        } else {
          await ordersList.exportModal.uncheckAllFields();
          await ordersList.exportModal.checkFieldsBulk(testCase.fields);
        }

        const download = await ordersList.exportModal.downloadFile();
        const exported = await parseDownloadedExport(download, testInfo);

        const expectedFormat = testCase.expectedFormat.toLowerCase();
        expect(exported.format).toBe(expectedFormat);

        if (exported.format === "csv") {
          // Minimal sanity: row count should match table row count.
          const ui = await ordersList.getTableAsRecords();
          expect(exported.data.length).toBe(ui.length);
        }

        if (exported.format === "json") {
          // Minimal sanity: JSON should be an array when table is non-empty.
          if (testCase.tableState !== "empty") {
            expect(Array.isArray(exported.data)).toBe(true);
          }
        }
      });
    }
  });

  test.describe("[Negative][Export orders]", () => {
    for (const testCase of EXPORT_ORDERS_NEGATIVE_CASES) {
      test(testCase.title, { tag: [TAGS.UI, TAGS.ORDERS] }, async ({ ordersApiService, page }) => {
        await ordersApiService.createOrderAndEntities(token, 1);

        const ordersList = new OrdersListPage(page);
        await ordersList.open("#/orders");
        await ordersList.waitForOpened();

        await ordersList.openExportModal();

        await ordersList.exportModal.uncheckAllFields();

        if (testCase.selectFormat) {
          await ordersList.exportModal.selectFormat(testCase.selectFormat);
        }

        if (testCase.selectFormat === null) {
          // Best-effort: remove checked state to simulate missing format selection.
          await page.evaluate(() => {
            const radios = document.querySelectorAll<HTMLInputElement>("#exportModal input[name='exportFormat']");
            radios.forEach((r) => {
              r.checked = false;
            });
          });
        }

        if (testCase.fields.length > 0) {
          await ordersList.exportModal.checkFieldsBulk(testCase.fields);
        }

        // Expected behavior: Download is disabled when required selections are missing.
        await expect(ordersList.exportModal.downloadButton).toBeVisible();
        await expect(ordersList.exportModal.downloadButton).toBeDisabled();
        await expect(ordersList.exportModal.uniqueElement).toBeVisible();
      });
    }
  });
});
