// TODO: Migrate to customersApiService.update(token, id, payload)
// Example: const updated = await customersApiService.update(token, customerId, { notes: 'Updated' });
// Service returns ICustomerFromResponse directly
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { validateJsonSchema } from "utils/validation/validateSchema.utils";
import { updateCustomerSchema } from "data/schemas/customers/update.schema";
// import { getInvalidPayloadScenarios, INVALID_ID_SCENARIOS } from "data/salesPortal/customers/invalidData";

test.describe("CST-006/007/011 Update customer", () => {
  let token: string;

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("@api @customers @smoke CST-006: Update customer with valid data", async ({ customersApi }) => {
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

  test("CST-007: Update customer with invalid Id", async ({ loginApiService, customersApi }) => {
    const token = await loginApiService.loginAsAdmin();
    const invalidId = "000000000000000000000000";

    const response = await customersApi.update(token, invalidId, {
      name: "Updated Name",
    });

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.body.IsSuccess).toBe(false);
    expect(response.body.ErrorMessage).toBeTruthy();
  });

  test("CST-011: Update customer with invalid phone", async ({ loginApiService, customersApi }) => {
    const token = await loginApiService.loginAsAdmin();
    const created = await customersApi.create(token, generateCustomerData());
    const id = created.body.Customer._id;
    const original = created.body.Customer;

    const invalidPhone = "1555-ABC";

    const response = await customersApi.update(token, id, {
      email: original.email,
      name: original.name,
      country: original.country,
      city: original.city,
      street: original.street,
      house: original.house,
      flat: original.flat,
      phone: invalidPhone,
      notes: original.notes,
    });

    expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
    expect(response.body.IsSuccess).toBe(false);
    expect(response.body.ErrorMessage).toBeTruthy();
  });
});
