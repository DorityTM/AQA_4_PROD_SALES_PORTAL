import { expect, Page } from "@playwright/test";
import { SalesPortalPage } from "../salesPortal.page";
import { logStep } from "utils/report/logStep.utils.js";
import { ConfirmationModal } from "../confirmation.modal";
import {
  CANCEL_ORDER_MODAL,
  NOTIFICATIONS,
  PROCESS_ORDER_MODAL,
  REOPEN_ORDER_MODAL,
} from "data/salesPortal/notifications";
import { OrderDetailsHeader, OrderDetailsCustomerDetails, OrderDetailsRequestedProducts } from "./components";
import { TIMEOUT_30_S } from "data/salesPortal/constants";

/**
 * Order Details PageObject orchestrator.
 * Splits the page into components: Header, Customer Details, Requested Products.
 */
export class OrderDetailsPage extends SalesPortalPage {
  readonly orderInfoContainer = this.page.locator("#order-info-container");
  readonly tabsContainer = this.page.locator("#order-details-tabs-section");
  readonly processOrderButton = this.page.locator("#process-order");
  readonly cancelOrderButton = this.page.locator("#cancel-order");
  readonly reopenOrderButton = this.page.locator("#reopen-order");
  readonly notificationToast = this.page.locator(".toast-body");
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

  // Modals
  readonly confirmationModal = new ConfirmationModal(this.page);
  processModal = this.confirmationModal;
  cancelModal = this.confirmationModal;
  reopenModal = this.confirmationModal;

  private async assertConfirmationModal(copy: { title: string; body: string; actionButton: string }) {
    await expect(this.confirmationModal.title).toHaveText(copy.title);
    await expect(this.confirmationModal.confirmationMessage).toHaveText(copy.body);
    await expect(this.confirmationModal.confirmButton).toHaveText(copy.actionButton);
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

  // TODO: Move these methods to respective UI-Service after its implementation
  @logStep("CLICK PROCESS ORDER BUTTON")
  async clickProcess() {
    await this.processOrderButton.click();
    await this.processModal.waitForOpened();
  }

  @logStep("PROCESS ORDER")
  async processOrder() {
    await this.processOrderButton.click();
    await this.processModal.waitForOpened();
    await this.assertConfirmationModal(PROCESS_ORDER_MODAL);
    await this.processModal.clickConfirm();
    await expect(this.notificationToast).toHaveText(NOTIFICATIONS.ORDER_PROCESSED);
    await this.waitForOpened();
  }
  @logStep("CLICK CANCEL ORDER BUTTON")
  async clickCancel() {
    await this.cancelOrderButton.click();
    await this.cancelModal.waitForOpened();
  }

  @logStep("CANCEL ORDER")
  async cancelOrder() {
    await this.cancelOrderButton.click();
    await this.cancelModal.waitForOpened();
    await this.assertConfirmationModal(CANCEL_ORDER_MODAL);
    await this.cancelModal.clickConfirm();
    await expect(this.notificationToast).toHaveText(NOTIFICATIONS.ORDER_CANCELED);
    await this.waitForOpened();
  }

  @logStep("CLICK REOPEN ORDER BUTTON")
  async clickReopen() {
    await this.reopenOrderButton.click();
    await this.reopenModal.waitForOpened();
  }

  @logStep("REOPEN ORDER")
  async reopenOrder() {
    await this.reopenOrderButton.click();
    await this.reopenModal.waitForOpened();
    await this.assertConfirmationModal(REOPEN_ORDER_MODAL);
    await this.reopenModal.clickConfirm();
    await expect(this.notificationToast).toHaveText(NOTIFICATIONS.ORDER_REOPENED);
    await this.waitForOpened();
  }
}
