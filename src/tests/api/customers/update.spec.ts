// TODO: Migrate to customersApiService.update(token, id, payload)
// Example: const updated = await customersApiService.update(token, customerId, { notes: 'Updated' });
// Service returns ICustomerFromResponse directly
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { validateJsonSchema } from "utils/validation/validateSchema.utils";
import { updateCustomerSchema } from "data/schemas/customers/update.schema";
import {
  INVALID_CUSTOMER_IDS,
  INVALID_CUSTOMER_PAYLOADS,
} from "data/salesPortal/customers/invalidData";
import { ICustomer } from "data/types/customer.types";

test.describe("CST-006/007/011 Update customer", () => {
  test("CST-006: Update customer with valid data", async ({
    loginApiService,
    customersApi,
  }) => {
    const token = await loginApiService.loginAsAdmin();
    const created = await customersApi.create(token, generateCustomerData());
    const id = created.body.Customer._id;
    const original = created.body.Customer;

    const updatedNotes = "Updated notes content";
    const updatedPhone = "+155512345678";

    const response = await customersApi.update(token, id, {
      email: original.email,
      name: original.name,
      country: original.country,
      city: original.city,
      street: original.street,
      house: original.house,
      flat: original.flat,
      phone: updatedPhone,
      notes: updatedNotes,
    });

    expect(response.status).toBe(STATUS_CODES.OK);
    validateJsonSchema(response.body, updateCustomerSchema);
    expect(response.body.IsSuccess).toBe(true);
    expect(response.body.ErrorMessage).toBeNull();
    expect(response.body.Customer._id).toBe(id);
    expect(response.body.Customer.notes).toBe(updatedNotes);
    expect(response.body.Customer.phone).toBe(updatedPhone);
  });

  for (const {
    description,
    id,
    update: expected,
  } of INVALID_CUSTOMER_IDS.filter((d) => d.update.checkBody)) {
    test(`CST-007: Update customer with Invalid ID (${description}) - Check Body`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const response = await customersApi.update(token, id, {
        name: "Updated Name",
      });

      expect(response.status).toBe(expected.status);
      expect(response.body.IsSuccess).toBe(false);
      expect(response.body.ErrorMessage).toBeTruthy();
    });
  }

  for (const {
    description,
    id,
    update: expected,
  } of INVALID_CUSTOMER_IDS.filter((d) => !d.update.checkBody)) {
    test(`CST-007: Update customer with Invalid ID (${description}) - Status Only`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const response = await customersApi.update(token, id, {
        name: "Updated Name",
      });

      expect(response.status).toBe(expected.status);
    });
  }

  for (const { description, data } of INVALID_CUSTOMER_PAYLOADS) {
    test(`CST-011: Update customer with Invalid Data (${description})`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const created = await customersApi.create(token, generateCustomerData());
      const id = created.body.Customer._id;

      const response = await customersApi.update(
        token,
        id,
        data as unknown as ICustomer,
      );

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.IsSuccess).toBe(false);
      expect(response.body.ErrorMessage).toBeTruthy();
    });
  }
});
