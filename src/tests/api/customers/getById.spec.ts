// TODO: Migrate to customersApiService.getById(token, id)
// Example: const customer = await customersApiService.getById(token, customerId);
// Service returns ICustomerFromResponse directly
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { validateJsonSchema } from "utils/validation/validateSchema.utils";
import { getByIdCustomerSchema } from "data/schemas/customers/getById.schema";
import { INVALID_ID_SCENARIOS } from "data/salesPortal/customers/invalidData";

test.describe("CST-004/005 Get customer by Id", () => {
  let token: string;

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test("@api @customers @smoke CST-004: GET by valid Id returns customer", async ({ customersApi }) => {
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

  // Scenarios without error message
  for (const scenario of INVALID_ID_SCENARIOS.GET) {
    test(`@api @customers @regression CST-005: GET by invalid Id (${scenario.description})`, async ({
      customersApi,
    }) => {
      const response = await customersApi.getById(token, scenario.id);
      expect(response.status).toBe(scenario.expectedStatus);
    });
  }

  // Scenarios with error message
  for (const scenario of INVALID_ID_SCENARIOS.GET_WITH_ERROR) {
    test(`@api @customers @regression CST-005: GET by invalid Id (${scenario.description})`, async ({
      customersApi,
    }) => {
      const response = await customersApi.getById(token, scenario.id);
      expect(response.status).toBe(scenario.expectedStatus);
      expect(response.body.IsSuccess).toBe(false);
      expect(response.body.ErrorMessage).toBeTruthy();
    });
  }
});
