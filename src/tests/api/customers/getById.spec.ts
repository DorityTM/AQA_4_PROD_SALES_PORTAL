// TODO: Migrate to customersApiService.getById(token, id)
// Example: const customer = await customersApiService.getById(token, customerId);
// Service returns ICustomerFromResponse directly
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { validateJsonSchema } from "utils/validation/validateSchema.utils";
import { getByIdCustomerSchema } from "data/schemas/customers/getById.schema";

test.describe("CST-004/005 Get customer by Id", () => {
  test("CST-004: GET by valid Id returns customer", async ({ loginApiService, customersApi }) => {
    const token = await loginApiService.loginAsAdmin();
    const create = await customersApi.create(token, generateCustomerData());
    expect(create.status).toBe(STATUS_CODES.CREATED);

    const id = create.body.Customer._id;
    const response = await customersApi.getById(token, id);

    expect(response.status).toBe(STATUS_CODES.OK);
    expect(response.body.IsSuccess).toBe(true);
    expect(response.body.ErrorMessage).toBeNull();
    validateJsonSchema(response.body, getByIdCustomerSchema);
    expect(response.body.Customer._id).toBe(id);
  });

  test("CST-005: GET by invalid Id returns 404", async ({ loginApiService, customersApi }) => {
    const token = await loginApiService.loginAsAdmin();
    const invalidId = "000000000000000000000000";

    const response = await customersApi.getById(token, invalidId);

    expect(response.status).toBe(STATUS_CODES.NOT_FOUND);
    expect(response.body.IsSuccess).toBe(false);
    expect(response.body.ErrorMessage).toBeTruthy();
  });
});
