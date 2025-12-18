import { expect, Page } from "@playwright/test";
import { logStep } from "utils/report/logStep.utils.js";
import { BasePage } from "../../base.page";

/**
 * Header section of Order Details page.
 * Contains order status/actions and assigned manager block.
 */
export class OrderDetailsHeader extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  // Containers
  readonly root = this.page.locator("#order-info-container");
  readonly assignedManagerContainer = this.page.locator("#assigned-manager-container");
  readonly statusBarContainer = this.page.locator("#order-status-bar-container");

  // Action buttons (conditionally rendered by status)
  readonly cancelButton = this.page.locator("#cancel-order");
  readonly reopenButton = this.page.locator("#reopen-order");
  readonly processButton = this.page.locator("#process-order");
  readonly refreshButton = this.page.locator("#refresh-order");

  // Assigned manager actions (use onclick attribute as stable marker in FE)
  readonly assignOrEditManager = this.assignedManagerContainer.locator('[onclick^="renderAssigneManagerModal"]');
  readonly unassignManager = this.assignedManagerContainer.locator('[onclick^="renderRemoveAssignedManagerModal"]');
  readonly assignManagerTrigger = this.assignedManagerContainer
    .locator('[onclick^="renderAssigneManagerModal"], a[href], button')
    .first();

  // Status text label living inside status bar
  readonly statusText = this.statusBarContainer.locator(
    ".status-text, span.text-primary, span.text-danger, span.text-warning, span.text-success",
  );

  @logStep("HEADER: CLICK CANCEL ORDER")
  async cancelOrder() {
    await this.cancelButton.click();
  }

  @logStep("HEADER: CLICK REFRESH ORDER")
  async refresh() {
    await this.refreshButton.click();
  }

  @logStep("HEADER: CLICK PROCESS ORDER")
  async processOrder() {
    await expect(this.processButton).toBeVisible({ timeout: 10000 });
    // FE uses delegated click handlers based on e.target.id; ensure the click targets the actual button.
    await this.page.evaluate(() => document.getElementById("process-order")?.click());

    const confirmationModal = this.page.locator(
      '[name="confirmation-modal"].modal.show, [name="confirmation-modal"].modal.fade.show',
    );
    await expect(confirmationModal.first()).toBeVisible({ timeout: 10000 });

    const confirmBtn = confirmationModal
      .locator(".modal-footer button.btn-primary, .modal-footer button.btn-danger, .modal-footer button.btn-success")
      .first();
    await expect(confirmBtn).toBeVisible({ timeout: 10000 });
    await confirmBtn.click();

    // After confirm, FE re-renders Order Details; wait for a stable state using IDs (avoid text/status business-logic).
    await expect(this.page.locator(".spinner-border")).toHaveCount(0, { timeout: 30000 });
    await expect(this.processButton).toBeHidden({ timeout: 30000 });
    await expect(this.root).toBeVisible({ timeout: 15000 });
  }

  @logStep("HEADER: OPEN ASSIGN MANAGER MODAL")
  async openAssignManagerModal() {
    // Deterministic trigger within #assigned-manager-container (no text selectors).
    await expect(this.assignedManagerContainer).toBeVisible({ timeout: 10000 });
    await this.assignManagerTrigger.click();
  }

  @logStep("HEADER: OPEN UNASSIGN MANAGER MODAL")
  async openUnassignManagerModal() {
    await this.unassignManager.first().click();
  }

  // Visibility helpers (status-dependent)
  async isCancelVisible() {
    return this.cancelButton.isVisible();
  }
  async isReopenVisible() {
    return this.reopenButton.isVisible();
  }
  async isProcessVisible() {
    return this.processButton.isVisible();
  }
  async isRefreshVisible() {
    return this.refreshButton.isVisible();
  }

  @logStep("HEADER: EXPECT STATUS TO BE VISIBLE")
  async expectStatusVisible() {
    await expect(this.statusBarContainer).toBeVisible();
  }
}
