// TODO: Migrate to customersApiService.getList(token, params)
// Example: const response = await customersApiService.getList(token, { country: ['USA'] });
// Service returns ICustomerListResponse with Customers array
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { COUNTRY } from "data/salesPortal/country";

test.describe("CST-003 Get customers list (Filter by Country)", () => {
  test("@api @customers @regression CST-003: GET /api/customers?country returns only selected country", async ({
    loginApiService,
    customersApi,
  }) => {
    const token = await loginApiService.loginAsAdmin();
    const targetCountry = COUNTRY.USA;

    const response = await customersApi.getList(token, {
      country: [targetCountry],
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
  });
});
