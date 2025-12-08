import { CREATE_CUSTOMER_POSITIVE_CASES } from "data/salesPortal/customers/createCustomer.ddt.data";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { test, expect } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";
import _ from "lodash";
import { createCustomerSchema } from "data/schemas/customers/create.schema";

test.describe("[API][Customers][Create Customer - DDT - Positive Tests]", () => {
  let id = "";
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ customersApiService }) => {
    if (id) await customersApiService.delete(token, id);
    id = "";
  });

  for (const tc of CREATE_CUSTOMER_POSITIVE_CASES) {
    test(
      tc.title,
      {
        tag: [TAGS.REGRESSION, TAGS.API, TAGS.CUSTOMERS],
      },
      async ({ customersApi }) => {
        const customerData = tc.customerData;
        const createdCustomer = await customersApi.create(token, customerData);
        await validateResponse(createdCustomer, {
          status: STATUS_CODES.CREATED,
          schema: createCustomerSchema,
          IsSuccess: true,
          ErrorMessage: null,
        });

        id = createdCustomer.body.Customer._id;

        const actualCustomerData = createdCustomer.body.Customer;
        expect(_.omit(actualCustomerData, ["_id", "createdOn"])).toEqual(customerData);
      },
    );
  }
});
