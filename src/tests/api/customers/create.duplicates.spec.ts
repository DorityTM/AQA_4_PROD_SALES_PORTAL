import { test } from "fixtures";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { buildDuplicatePayload } from "data/salesPortal/customers/buildDuplicatePayload";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API][Customers][Unique email]", () => {
  let token = "";
  let id = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ customersApiService }) => {
    if (id) await customersApiService.delete(token, id);
    id = "";
  });

  test(
    "Customer is not created with duplicated email",
    { tag: [TAGS.API, TAGS.REGRESSION, TAGS.CUSTOMERS] },
    async ({ customersApi }) => {
      const initial = generateCustomerData();
      const createResponse = await customersApi.create(token, initial);

      validateResponse(createResponse, {
        status: STATUS_CODES.CREATED,
        IsSuccess: true,
        ErrorMessage: null,
      });

      const createdCustomer = createResponse.body.Customer;
      id = createdCustomer._id;

      const duplicatePayload = buildDuplicatePayload(createdCustomer);

      const dupResponse = await customersApi.create(token, duplicatePayload);

      validateResponse(dupResponse, {
        status: STATUS_CODES.CONFLICT,
        IsSuccess: false,
      });
    },
  );
});
