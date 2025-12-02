import { CustomersApi } from "api/api/customers.api";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer } from "data/types/customer.types";
import { logStep } from "utils/report/logStep.utils";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class CustomersApiService {
  constructor(private customerApi: CustomersApi) {}

  @logStep("CREATE CUSTOMER VIA API")
  async create(token: string, customerData?: ICustomer) {
    const data = generateCustomerData(customerData);
    const response = await this.customerApi.create(token, data);
    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
    });

    return response.body.Customer;
  }

  @logStep("DELETE CUSTOMER VIA API")
  async delete(token: string, id: string) {
    const response = await this.customerApi.delete(id, token);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
  }
}
