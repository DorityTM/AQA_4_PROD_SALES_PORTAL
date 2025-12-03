// TODO: Migrate to customersApiService.delete(token, id)
// Example: await customersApiService.delete(token, customerId);
// Service handles validation automatically
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { INVALID_CUSTOMER_IDS } from "data/salesPortal/customers/invalidData";

test.describe("CST-008/009 Delete customer", () => {
  test("CST-008: Delete customer (Valid Id)", async ({
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

  for (const {
    description,
    id,
    delete: expected,
  } of INVALID_CUSTOMER_IDS.filter((d) => d.delete.checkBody)) {
    test(`CST-009: Delete customer with Invalid ID (${description}) - Check Body`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const response = await customersApi.delete(token, id);
      expect(response.status).toBe(expected.status);
    });
  }

  for (const {
    description,
    id,
    delete: expected,
  } of INVALID_CUSTOMER_IDS.filter((d) => !d.delete.checkBody)) {
    test(`CST-009: Delete customer with Invalid ID (${description}) - Status Only`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const response = await customersApi.delete(token, id);
      expect(response.status).toBe(expected.status);
    });
  }
});
