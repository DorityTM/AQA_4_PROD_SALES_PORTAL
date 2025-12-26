import { expect, Page } from "@playwright/test";
import { SalesPortalPage } from "../salesPortal.page";
import { logStep } from "utils/report/logStep.utils.js";
import { OrderDetailsHeader, OrderDetailsCustomerDetails, OrderDetailsRequestedProducts } from "./components";
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
    // Site uses SPA routing: #/orders/{id}
    const route = `#/orders/${orderId}`;
    await this.open(route);
    await this.waitForSpinners();
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
