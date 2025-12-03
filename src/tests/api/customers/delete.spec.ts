// TODO: Migrate to customersApiService.delete(token, id)
// Example: await customersApiService.delete(token, customerId);
// Service handles validation automatically
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { getInvalidIdTestData } from "data/salesPortal/customers/invalidData";
import { TAGS } from "data/tags";

test.describe("CST-008/009 Delete customer", () => {
  test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.SMOKE} CST-008: Delete customer (Valid Id)`, async ({
    loginApiService,
    customersApi,
  }) => {
    const token = await loginApiService.loginAsAdmin();
    const created = await customersApi.create(token, generateCustomerData());
    const id = created.body.Customer._id;

    const deleted = await customersApi.delete(token, id);
    expect(deleted.status).toBe(STATUS_CODES.DELETED);

    const afterDelete = await customersApi.getById(token, id);
    expect(afterDelete.status).toBe(STATUS_CODES.NOT_FOUND);
  });

  const invalidIdScenarios = getInvalidIdTestData("delete");

  // Scenarios with error message validation
  for (const scenario of invalidIdScenarios.filter(
    (s) => s.shouldHaveErrorMessage,
  )) {
    test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.REGRESSION} CST-009: Delete customer with Invalid ID (${scenario.description})`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const response = await customersApi.delete(token, scenario.id);

      expect(response.status).toBe(scenario.expectedStatus);
      expect(response.body.IsSuccess).toBe(false);
      expect(response.body.ErrorMessage).toBeTruthy();
    });
  }

  // Scenarios with status-only validation
  for (const scenario of invalidIdScenarios.filter(
    (s) => !s.shouldHaveErrorMessage,
  )) {
    test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.REGRESSION} CST-009: Delete customer with Invalid ID (${scenario.description})`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const response = await customersApi.delete(token, scenario.id);

      expect(response.status).toBe(scenario.expectedStatus);
    });
  }
});
