import { test, expect } from "fixtures/api.fixture";
import { COUNTRY } from "data/salesPortal/country";
import { TAGS } from "data/tags";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";

test.describe("CST-003 Get customers list (Filter by Country)", () => {
  const ids: string[] = [];
  let token = "";

  test.beforeAll(async ({ loginApiService, customersApiService }) => {
    token = await loginApiService.loginAsAdmin();

    for (const country of Object.values(COUNTRY)) {
      const customerData = generateCustomerData({ country });
      const created = await customersApiService.create(token, customerData);
      ids.push(created._id);
    }
  });
  test.afterAll(async ({ customersApiService }) => {
    if (ids.length) {
      for (const id of ids) {
        await customersApiService.delete(token, id);
      }
      ids.length = 0;
    }
  });

  for (const targetCountry of Object.values(COUNTRY)) {
    test(
      `CST-003: GET /api/customers?country Filter customers by ${targetCountry}`,
      { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
      async ({ customersApiService }) => {
        const response = await customersApiService.getList(token, {
          country: [targetCountry],
          search: "",
          sortField: "email",
          sortOrder: "asc",
          page: 1,
          limit: 10,
        });

        expect(Array.isArray(response.Customers)).toBe(true);
        expect(response.Customers.length).toBeGreaterThan(0);

        for (const customer of response.Customers) {
          expect.soft(customer.country).toBe(targetCountry);
        }
      },
    );
  }
});
