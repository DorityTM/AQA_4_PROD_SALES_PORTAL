import { test, expect } from "fixtures/api.fixture";
import { TAGS } from "data/tags";

test.describe("CST-010 Get ALL customers (Technical endpoint)", () => {
  test(
    "CST-010: GET /api/customers/all returns array of customers",
    { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE] },
    async ({ loginApiService, customersApiService }) => {
      const token = await loginApiService.loginAsAdmin();

      const customers = await customersApiService.getAll(token);

      expect(Array.isArray(customers)).toBe(true);
    },
  );
});
