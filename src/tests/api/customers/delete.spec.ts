// TODO: Migrate to customersApiService.delete(token, id)
// Example: await customersApiService.delete(token, customerId);
// Service handles validation automatically
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { INVALID_ID_SCENARIOS } from "data/salesPortal/customers/invalidData";

test.describe("CST-008/009 Delete customer", () => {
  let token: string;

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("@api @customers @smoke CST-008: Delete customer (Valid Id)", async ({ customersApi }) => {
    const created = await customersApi.create(token, generateCustomerData());
    const id = created.body.Customer._id;

    const deleted = await customersApi.delete(token, id);
    expect(deleted.status).toBe(STATUS_CODES.DELETED);

    const afterDelete = await customersApi.getById(token, id);
    expect(afterDelete.status).toBe(STATUS_CODES.NOT_FOUND);
  });

  const invalidIdScenarios = INVALID_ID_SCENARIOS.DELETE;

  // Scenarios with error message validation
  for (const scenario of invalidIdScenarios.filter((s) => s.shouldHaveErrorMessage)) {
    test(`@api @customers @regression CST-009: Delete customer with Invalid ID (${scenario.description})`, async ({
      customersApi,
    }) => {
      const response = await customersApi.delete(token, scenario.id);

      expect(response.status).toBe(scenario.expectedStatus);
      expect(response.body.IsSuccess).toBe(false);
      expect(response.body.ErrorMessage).toBeTruthy();
    });
  }

  // Scenarios with status-only validation
  for (const scenario of invalidIdScenarios.filter((s) => !s.shouldHaveErrorMessage)) {
    test(`@api @customers @regression CST-009: Delete customer with Invalid ID (${scenario.description})`, async ({
      customersApi,
    }) => {
      const response = await customersApi.delete(token, scenario.id);

      expect(response.status).toBe(scenario.expectedStatus);
    });
  }
});
