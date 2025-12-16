import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IDeliveryInfo } from "data/salesPortal/delivery-status";
import { IRequestOptions } from "data/types/core.types";
import { IOrderResponse } from "data/types/order.types";

export class DeliveryApi {
  constructor(private apiClient: IApiClient) {}

  async addDelivery(token: string, orderId: string, deliveryData: IDeliveryInfo) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.orderDelivery(orderId),
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: deliveryData,
    };
    return await this.apiClient.send<IOrderResponse>(options);
  }
}
