// TODO: Migrate to customersApiService.delete(token, id)
// Example: await customersApiService.delete(token, customerId);
// Service handles validation automatically
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { TAGS } from "data/tags";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
// import { INVALID_ID_SCENARIOS } from "data/salesPortal/customers/invalidData";

test.describe("CST-008/009 Delete customer", () => {
  let token: string;
  let createdCustomerIds: string[] = [];

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ customersApi }) => {
    for (const id of createdCustomerIds) {
      await customersApi.delete(token, id);
    }
    createdCustomerIds = [];
  });
  test(
    "CST-008: Delete customer (Valid Id)",
    { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.SMOKE] },
    async ({ customersApi }) => {
      const created = await customersApi.create(token, generateCustomerData());
      const id = created.body.Customer._id;
      createdCustomerIds.push(id);

      const deleted = await customersApi.delete(token, id);
      expect(deleted.status).toBe(STATUS_CODES.DELETED);

      const afterDelete = await customersApi.getById(token, id);
      expect(afterDelete.status).toBe(STATUS_CODES.NOT_FOUND);
    },
  );

  test(
    "CST-009: Delete customer (Invalid Id)",
    { tag: [TAGS.API, TAGS.CUSTOMERS, TAGS.REGRESSION] },
    async ({ loginApiService, customersApi }) => {
      const token = await loginApiService.loginAsAdmin();
      const invalidId = "507f1f77bcf86cd799439011";

      const response = await customersApi.delete(token, invalidId);
      expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    },
  );
});
