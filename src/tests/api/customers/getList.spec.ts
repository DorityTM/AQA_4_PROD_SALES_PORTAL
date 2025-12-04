// TODO: Migrate to customersApiService.getList(token, params)
// Example: const response = await customersApiService.getList(token, { country: ['USA'] });
// Service returns ICustomerListResponse with Customers array
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { COUNTRY } from "data/salesPortal/country";
import { TAGS } from "data/tags";

test.describe("CST-003 Get customers list (Filter by Country)", () => {
  test("GET /api/customers?country returns only selected country", {tag: [TAGS.API, TAGS.PRODUCTS, TAGS.REGRESSION]}, async ({
    loginApiService,
    customersApi,
  }) => {
    const token = await loginApiService.loginAsAdmin();
    const targetCountry = COUNTRY.USA;

    const response = await customersApi.getList(token, {
      country: [targetCountry],
    });

    expect(response.status).toBe(STATUS_CODES.OK);
    expect(response.body.IsSuccess).toBe(true);
    expect(response.body.ErrorMessage).toBeNull();

    expect(Array.isArray(response.body.Customers)).toBe(true);

    for (const customer of response.body.Customers) {
      expect(customer.country).toBe(targetCountry);
    }
  });
});
