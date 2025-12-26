import { DeliveryInfo } from "data/types/delivery.types";
import { logStep } from "utils/report/logStep.utils";
import { SalesPortalPage } from "ui/pages/salesPortal.page";

export class DeliveryTab extends SalesPortalPage {
  readonly uniqueElement = this.page.locator('#delivery[role="tabpanel"] h4');
  readonly orderInfoTable = this.page.locator("#delivery div.mb-4.p-3");
  readonly values = this.orderInfoTable.locator("div.c-details > span:last-child");
  readonly scheduleDeliveryButton = this.page.locator("#delivery-btn");

  @logStep("GET ALL DATA FROM DELIVERY INFO")
  async getData(): Promise<DeliveryInfo> {
    const [deliveryType, deliveryDate, country, city, street, house, flat] = await this.values.allInnerTexts();

    return {
      deliveryType: deliveryType ?? "",
      deliveryDate: deliveryDate ?? "",
      country: country ?? "",
      city: city ?? "",
      street: street ?? "",
      house: house ?? "",
      flat: flat ?? "",
    };
  }

  @logStep("OPEN DELIVERY FORM")
  async clickDeliveryForm() {
    await this.scheduleDeliveryButton.click();
  }
}
