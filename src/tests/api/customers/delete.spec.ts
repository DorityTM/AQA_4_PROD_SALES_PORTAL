import { STATUS_CODES } from "data/statusCodes";
import { test } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";
test.describe("[API] [Sales Portal] [Customers]", () => {
  let token = "";
  let id = "";

  test.beforeAll(async ({ loginApiService, customersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const createdCustomer = await customersApiService.create(token);
    id = createdCustomer._id;
  });

  test("Delete Customer", async ({ customersApi }) => {
    const response = await customersApi.delete(id, token);
    await validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
  });
});
