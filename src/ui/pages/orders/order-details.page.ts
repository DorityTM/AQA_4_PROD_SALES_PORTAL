import { expect, Page } from "@playwright/test";
import { SalesPortalPage } from "../salesPortal.page";
import { logStep } from "utils/report/logStep.utils.js";
import { OrderDetailsHeader, OrderDetailsCustomerDetails, OrderDetailsRequestedProducts } from "./components";
import { HomePage } from "../home.page";
import { TIMEOUT_30_S } from "data/salesPortal/constants";

/**
 * Order Details PageObject orchestrator.
 * Splits the page into components: Header, Customer Details, Requested Products.
 */
export class OrderDetailsPage extends SalesPortalPage {
  readonly orderInfoContainer = this.page.locator("#order-info-container");
  readonly tabsContainer = this.page.locator("#order-details-tabs-section");
  // Be tolerant: different FE builds may render different anchors
  readonly uniqueElement = this.page.locator(
    [
      "#order-info-container",
      "#order-details-tabs",
      "#order-details-tabs-section",
      "#order-status-bar-container",
      "#assigned-manager-container",
      "#customer-section",
      "#products-section",
    ].join(", "),
  );

  // Components
  readonly header: OrderDetailsHeader;
  readonly customerDetails: OrderDetailsCustomerDetails;
  readonly requestedProducts: OrderDetailsRequestedProducts;

  constructor(page: Page) {
    super(page);
    this.header = new OrderDetailsHeader(page);
    this.customerDetails = new OrderDetailsCustomerDetails(page);
    this.requestedProducts = new OrderDetailsRequestedProducts(page);
  }

  @logStep("OPEN ORDER DETAILS BY ROUTE")
  async openByRoute(route: string) {
    await this.open(route);
  }

  @logStep("OPEN ORDER DETAILS BY ID")
  async openByOrderId(orderId: string) {
    const candidates = [
      `orders/${orderId}`,
      `orders/details/${orderId}`,
      `orders/details?orderId=${orderId}`,
      // additional fallbacks seen in some builds
      `order/${orderId}`,
      `order/details/${orderId}`,
      `order-details/${orderId}`,
      `orders/details?id=${orderId}`,
    ];

    for (const route of candidates) {
      await this.open(route);
      // give a brief chance to render
      if (await this.uniqueElement.first().isVisible()) return;
      await this.waitForSpinners();
      if (await this.uniqueElement.first().isVisible()) return;
    }
    // UI fallback: navigate via Orders list and open the row by ID
    await this.open();
    const home = new HomePage(this.page);
    await home.waitForOpened();
    await home.clickOnViewModel("Orders");

    // Prefer structural match (href contains orderId) before falling back to row text.
    const rowByHref = this.page.locator(`tr:has(a[href*="${orderId}"])`).first();
    const row = (await rowByHref.isVisible()) ? rowByHref : this.page.locator("tr", { hasText: orderId }).first();
    await expect(row).toBeVisible();

    const openByHref = row.locator(`a[href*="${orderId}"]`).first();
    if (await openByHref.isVisible()) {
      await openByHref.click();
    } else {
      const openByOrderIdText = row.locator("a", { hasText: orderId }).first();
      if (await openByOrderIdText.isVisible()) {
        await openByOrderIdText.click();
      } else {
        // last resort: click the first link/button within the row (avoid text)
        const openLink = row.locator("a[href], button").first();
        await openLink.click();
      }
    }

    await expect(this.uniqueElement.first()).toBeVisible({ timeout: TIMEOUT_30_S });
    await this.waitForSpinners();
    if (await this.uniqueElement.first().isVisible()) return;

    throw new Error(
      `Order Details did not render for orderId=${orderId}. Tried routes: ${candidates.join(", ")}, and UI fallback (Orders list)`,
    );
  }

  @logStep("WAIT FOR ORDER DETAILS PAGE TO OPEN")
  async waitForOpened() {
    await expect(this.uniqueElement.first()).toBeVisible({ timeout: TIMEOUT_30_S });
    await this.waitForSpinners();
  }

  // Tabs (Delivery, History, Comments)
  readonly tabs = {
    root: this.page.locator("#order-details-tabs"),
    delivery: this.page.locator("#delivery-tab"),
    history: this.page.locator("#history-tab"),
    comments: this.page.locator("#comments-tab"),
    content: this.page.locator("#order-details-tabs-content"),
  } as const;

  @logStep("SWITCH TO DELIVERY TAB")
  async openDeliveryTab() {
    await this.tabs.delivery.click();
  }

  @logStep("SWITCH TO HISTORY TAB")
  async openHistoryTab() {
    await this.tabs.history.click();
  }

  @logStep("SWITCH TO COMMENTS TAB")
  async openCommentsTab() {
    await this.tabs.comments.click();
  }
}
