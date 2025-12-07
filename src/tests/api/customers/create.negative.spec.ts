import { CREATE_CUSTOMER_NEGATIVE_CASES } from "data/salesPortal/customers/createCustomer.ddt.data";
import { STATUS_CODES } from "data/statusCodes";
import { RESPONSE_ERRORS } from "data/salesPortal/errors";
import { TAGS } from "data/tags";
import { test } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";

test.describe("[API][Customers][Create Customer - DDT - Negative Tests]", () => {
  let id = "";
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ customersApiService }) => {
    if (id) await customersApiService.delete(token, id);
    id = "";
  });

  for (const tc of CREATE_CUSTOMER_NEGATIVE_CASES) {
    test(
      tc.title,
      {
        tag: [TAGS.REGRESSION, TAGS.API],
      },
      async ({ customersApi }) => {
        const customerData = tc.customerData;
        const createdCustomer = await customersApi.create(token, customerData);
        await validateResponse(createdCustomer, {
          status: STATUS_CODES.BAD_REQUEST,
          IsSuccess: false,
          ErrorMessage: RESPONSE_ERRORS.BAD_REQUEST,
        });
      },
    );
  }
});
