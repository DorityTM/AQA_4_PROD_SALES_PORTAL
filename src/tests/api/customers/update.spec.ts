// TODO: Migrate to customersApiService.update(token, id, payload)
// Example: const updated = await customersApiService.update(token, customerId, { notes: 'Updated' });
// Service returns ICustomerFromResponse directly
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { validateJsonSchema } from "utils/validation/validateSchema.utils";
import { updateCustomerSchema } from "data/schemas/customers/update.schema";
import {
  INVALID_PAYLOAD_TEMPLATES,
  getInvalidIdTestData,
} from "data/salesPortal/customers/invalidData";
import { ICustomer } from "data/types/customer.types";
import { TAGS } from "data/tags";

test.describe("CST-006/007/011 Update customer", () => {
  test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.SMOKE} CST-006: Update customer with valid data`, async ({
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

  const invalidIdScenarios = getInvalidIdTestData("update");

  // Scenarios with error message validation
  for (const scenario of invalidIdScenarios.filter(
    (s) => s.shouldHaveErrorMessage,
  )) {
    test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.REGRESSION} CST-007: Update customer with Invalid ID (${scenario.description})`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const response = await customersApi.update(token, scenario.id, {
        name: "Updated Name",
      });

      expect(response.status).toBe(scenario.expectedStatus);
      expect(response.body.IsSuccess).toBe(false);
      expect(response.body.ErrorMessage).toBeTruthy();
    });
  }

  // Scenarios with status-only validation
  for (const scenario of invalidIdScenarios.filter(
    (s) => !s.shouldHaveErrorMessage,
  )) {
    test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.REGRESSION} CST-007: Update customer with Invalid ID (${scenario.description})`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const response = await customersApi.update(token, scenario.id, {
        name: "Updated Name",
      });

      expect(response.status).toBe(scenario.expectedStatus);
    });
  }

  for (const { description, modifier } of INVALID_PAYLOAD_TEMPLATES) {
    test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.REGRESSION} CST-011: Update customer with Invalid Data (${description})`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const created = await customersApi.create(token, generateCustomerData());
      const id = created.body.Customer._id;

      const baseCustomer = generateCustomerData();
      const invalidData = modifier(baseCustomer);

      const response = await customersApi.update(
        token,
        id,
        invalidData as unknown as ICustomer,
      );

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.IsSuccess).toBe(false);
      expect(response.body.ErrorMessage).toBeTruthy();
    });
  }
});
