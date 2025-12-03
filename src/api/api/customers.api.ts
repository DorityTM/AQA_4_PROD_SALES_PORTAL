import { IApiClient } from "api/apiClients/types";
import { apiConfig } from "config/apiConfig";
import { IRequestOptions } from "data/types/core.types";
import { ICustomer, ICustomerResponse } from "data/types/customer.types";
import { logStep } from "utils/report/logStep.utils";

export class CustomersApi {
  constructor(private apiClient: IApiClient) {}

  @logStep("POST /api/customer")
  async create(token: string, customer: ICustomer) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customers,
      method: "post",
      headers: {
        "content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      data: customer,
    };
    return await this.apiClient.send<ICustomerResponse>(options);
  }

  @logStep("DELETE /api/customer")
  async delete(_id: string, token: string) {
    const options: IRequestOptions = {
      baseURL: apiConfig.baseURL,
      url: apiConfig.endpoints.customerById(_id),
      method: "delete",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${token}`,
      },
    };

    return await this.apiClient.send<null>(options);
  }
}
