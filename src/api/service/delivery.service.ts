import { DeliveryApi } from "api/api/delivery.api";
import { IDeliveryInfo } from "data/salesPortal/delivery-status";
import { generateDelivery } from "data/salesPortal/orders/generateDeliveryData";
import { deliveryInfoSchema } from "data/schemas/delivery/delivery.schema";
import { STATUS_CODES } from "data/statusCodes";
import { IOrderFromResponse } from "data/types/order.types";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class DeliveryApiService {
  constructor(private deliveryApi: DeliveryApi) {}

  async addDelivery(token: string, orderId: string, deliveryData: Partial<IDeliveryInfo>): Promise<IOrderFromResponse> {
    const data = generateDelivery(deliveryData);
    const response = await this.deliveryApi.addDelivery(token, orderId, data);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: deliveryInfoSchema,
    });
    return response.body.Order;
  }
}
