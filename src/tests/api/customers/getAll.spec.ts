// TODO: Migrate to customersApiService.getAll(token)
// Example: const customers = await customersApiService.getAll(token);
// Service returns ICustomerFromResponse[] directly
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { validateJsonSchema } from "utils/validation/validateSchema.utils";
import { getAllCustomersSchema } from "data/schemas/customers/getAllCustomers.schema";

test.describe("CST-010 Get ALL customers (Technical endpoint)", () => {
  test(
    "CST-010: GET /api/customers/all returns array of customers",
    { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE] },
    async ({ loginApiService, customersApi }) => {
      const token = await loginApiService.loginAsAdmin();

      const response = await customersApi.getAll(token);

      expect(response.status).toBe(STATUS_CODES.OK);
      expect(response.body.IsSuccess).toBe(true);
      expect(response.body.ErrorMessage).toBeNull();

      validateJsonSchema(response.body, getAllCustomersSchema);

      expect(Array.isArray(response.body.Customers)).toBe(true);
    },
  );
});
