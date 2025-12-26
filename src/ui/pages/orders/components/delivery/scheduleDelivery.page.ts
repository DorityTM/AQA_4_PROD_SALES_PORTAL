import { Locator, expect } from "@playwright/test";
import { COUNTRY } from "data/salesPortal/country";
import { DELIVERY_CONDITION } from "data/salesPortal/delivery-status";
import { ScheduleDeliveryFormData } from "data/types/delivery.types";
import { logStep } from "utils/report/logStep.utils";
import { SalesPortalPage } from "ui/pages/salesPortal.page";

export class ScheduleDeliveryPage extends SalesPortalPage {
  readonly uniqueElement = this.page.locator("#delivery-container h2.fw-bold");
  readonly form = this.page.locator("#delivery-container form#edit-delivery");
  readonly title = this.page.locator("#delivery-container h2.fw-bold"); // "Schedule Delivery" | "Edit Delivery"

  // fields
  readonly deliveryTypeSelect = this.form.locator("#inputType");
  readonly locationSelect = this.form.locator("#inputLocation");
  readonly dateInput = this.form.locator("#date-input");
  readonly countryField = this.form.getByLabel("Country");
  readonly cityInput = this.form.locator("#inputCity");
  readonly streetInput = this.form.locator("#inputStreet");
  readonly houseInput = this.form.locator("#inputHouse");
  readonly flatInput = this.form.locator("#inputFlat");

  // actions
  readonly saveButton = this.form.locator("#save-delivery");
  readonly cancelButton = this.form.locator("#back-to-order-details-page");

  @logStep("SELECT DELIVERY TYPE")
  async selectDeliveryType(type: DELIVERY_CONDITION) {
    await this.deliveryTypeSelect.selectOption({ label: type });

    if (type === DELIVERY_CONDITION.DELIVERY) {
      await expect(this.locationSelect).toBeVisible();
    } else {
      await expect(this.locationSelect).toBeHidden();
    }
  }

  @logStep("READING STRING FIELDS")
  private async readField(field: Locator): Promise<string> {
    const tag = await field.evaluate((el) => el.tagName);
    if (tag === "SELECT") {
      return (await field.locator("option:checked").innerText()).trim();
    }
    return (await field.inputValue()).trim();
  }

  @logStep("READING NUMBER FIELDS")
  private async readNumberField(field: Locator): Promise<number> {
    const raw = await this.readField(field);
    return Number(raw);
  }

  @logStep("GET SCHEDULE DELIVERY DATA")
  async getScheduleDeliveryData(): Promise<ScheduleDeliveryFormData> {
    const deliveryType = (await this.readField(this.deliveryTypeSelect)) as DELIVERY_CONDITION;
    const common = {
      date: await this.readField(this.dateInput),
      country: (await this.readField(this.countryField)) as COUNTRY,
      city: await this.readField(this.cityInput),
      street: await this.readField(this.streetInput),
      house: await this.readNumberField(this.houseInput),
      flat: await this.readNumberField(this.flatInput),
    };
    if (deliveryType === DELIVERY_CONDITION.DELIVERY) {
      return {
        deliveryType: DELIVERY_CONDITION.DELIVERY,
        ...common,
        location: await this.readField(this.locationSelect),
      };
    }
    return {
      deliveryType: DELIVERY_CONDITION.PICKUP,
      ...common,
    };
  }

  @logStep("CLICK SAVE BUTTON")
  async clickSave() {
    await this.saveButton.click();
  }

  @logStep("CLICK CANCEL BUTTON")
  async clickCancel() {
    await this.cancelButton.click();
  }
}
