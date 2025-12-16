import { test, expect } from "fixtures/api.fixture";
import {
  getCustomerByIdPositiveCases,
  getCustomerByIdNegativeCases,
} from "data/salesPortal/customers/getByIdCustomerTestData";
import { getByIdCustomerSchema } from "data/schemas/customers/getById.schema";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Customers] [Get By Id]", () => {
  let token: string;

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.describe("[Positive]", () => {
    for (const testCase of getCustomerByIdPositiveCases) {
      test(
        testCase.title,
        { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.CUSTOMERS] },
        async ({ customersApi, customersApiService }) => {
          const createdCustomer = await customersApiService.create(token);
          const id = createdCustomer._id;
          const response = await customersApi.getById(token, id);

          validateResponse(response, {
            status: testCase.expectedStatus,
            schema: getByIdCustomerSchema,
            IsSuccess: testCase.isSuccess as boolean,
            ErrorMessage: testCase.expectedErrorMessage,
          });

          expect(response.body.Customer).toEqual(createdCustomer);
          await customersApiService.delete(token, id);
        },
      );
    }
  });

  test.describe("[Negative]", () => {
    for (const testCase of getCustomerByIdNegativeCases) {
      test(testCase.title, { tag: [TAGS.REGRESSION, TAGS.API, TAGS.CUSTOMERS] }, async ({ customersApi }) => {
        const response = await customersApi.getById(token, testCase.id!);

        validateResponse(response, {
          status: testCase.expectedStatus,
          IsSuccess: testCase.isSuccess as boolean,
          ErrorMessage: testCase.expectedErrorMessage,
        });
      });
    }
  });
});
