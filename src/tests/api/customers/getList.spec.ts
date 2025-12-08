// TODO: Migrate to customersApiService.getList(token, params)
// Example: const response = await customersApiService.getList(token, { country: ['USA'] });
// Service returns ICustomerListResponse with Customers array
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { COUNTRY } from "data/salesPortal/country";
import { TAGS } from "data/tags";
import { Country } from "data/types/customer.types";
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
      async ({ customersApi }) => {
        const response = await customersApi.getList(token, {
          country: [targetCountry as Country],
          search: "",
          sortField: "email",
          sortOrder: "asc",
          page: 1,
          limit: 10,
        });

        expect(response.status).toBe(STATUS_CODES.OK);
        expect(response.body.IsSuccess).toBe(true);
        expect(response.body.ErrorMessage).toBeNull();

        expect(Array.isArray(response.body.Customers)).toBe(true);

        for (const customer of response.body.Customers) {
          expect(customer.country).toBe(targetCountry);
        }
      },
    );
  }
});
