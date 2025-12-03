// TODO: Migrate to customersApiService.create(token, payload)
// Example: const customer = await customersApiService.create(token, { email: 'test@test.com', country: COUNTRY.USA });
// Service handles validation and returns ICustomerFromResponse directly
import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "data/salesPortal/customers/generateCustomerData";
import { validateJsonSchema } from "utils/validation/validateSchema.utils";
import { createCustomerSchema } from "data/schemas/customers/create.schema";
import { COUNTRY } from "data/salesPortal/country";
import { faker } from "@faker-js/faker";
import { INVALID_PAYLOAD_TEMPLATES } from "data/salesPortal/customers/invalidData";
import { ICustomer } from "data/types/customer.types";
import { TAGS } from "data/tags";

test.describe("CST-001/002 Create customer", () => {
  test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.SMOKE} CST-001: Create new customer (Valid Data)`, async ({
    loginApiService,
    customersApi,
  }) => {
    const token = await loginApiService.loginAsAdmin();
    const expectedEmail = `tester+${faker.string.alphanumeric({ length: 6 })}@gmail.com`;
    const expectedCountry = COUNTRY.USA;
    const payload = generateCustomerData({
      email: expectedEmail,
      country: expectedCountry,
    });

    const created = await customersApi.create(token, payload);
    expect(created.status).toBe(STATUS_CODES.CREATED);
    validateJsonSchema(created.body, createCustomerSchema);
    expect(created.body.Customer._id).toBeTruthy();
    expect(created.body.Customer.email).toBe(expectedEmail);
    expect(created.body.Customer.name).toBe(payload.name);
    expect(created.body.Customer.country).toBe(expectedCountry);
  });

  for (const { description, modifier } of INVALID_PAYLOAD_TEMPLATES) {
    test(`${TAGS.API} ${TAGS.CUSTOMERS} ${TAGS.REGRESSION} CST-002: Create customer with Invalid Data (${description})`, async ({
      loginApiService,
      customersApi,
    }) => {
      const token = await loginApiService.loginAsAdmin();
      const baseCustomer = generateCustomerData();
      const invalidData = modifier(baseCustomer);

      const response = await customersApi.create(
        token,
        invalidData as unknown as ICustomer,
      );

      expect(response.status).toBe(STATUS_CODES.BAD_REQUEST);
      expect(response.body.IsSuccess).toBe(false);
      expect(response.body.ErrorMessage).toBeTruthy();
    });
  }
});
