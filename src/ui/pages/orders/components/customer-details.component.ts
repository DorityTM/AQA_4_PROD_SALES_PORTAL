import { Page } from "@playwright/test";
import { logStep } from "utils/report/logStep.utils.js";
import { BasePage } from "../../base.page";

/**
 * Customer Details section of Order Details page.
 */
export class OrderDetailsCustomerDetails extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  readonly uniqueElement = this.page.locator("#customer-section");
  readonly editButton = this.page.locator("#edit-customer-pencil");

  @logStep("CUSTOMER: CLICK EDIT")
  async clickEdit() {
    await this.editButton.click();
  }

  async isVisible() {
    return this.uniqueElement.isVisible();
  }
  async isEditVisible() {
    return this.editButton.isVisible();
  }
}
