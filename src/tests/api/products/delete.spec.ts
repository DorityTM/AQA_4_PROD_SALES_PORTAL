import { test, expect } from "fixtures/api.fixture";
import { STATUS_CODES } from "data/statusCodes";
import {
  deleteProductPositiveCases,
  deleteProductNegativeCases,
} from "data/salesPortal/products/deleteProductTestData";
import { TAGS } from "data/tags";

test.describe("[API] [Sales Portal] [Products]", () => {
  let id = "";
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.describe("[Delete Product]", () => {
    for (const testCase of deleteProductPositiveCases) {
      test(
        `${testCase.title}`,
        { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] },
        async ({ productsApi, productsApiService }) => {
          const createdProduct = await productsApiService.create(token);
          id = createdProduct._id;
          const response = await productsApi.delete(id, token);
          expect.soft(response.status).toBe(testCase.expectedStatus || STATUS_CODES.DELETED);
        },
      );
    }
  });

  test.describe("[Should Not Delete Product]", () => {
    for (const testCase of deleteProductNegativeCases) {
      test(`${testCase.title}`, { tag: [TAGS.REGRESSION, TAGS.API, TAGS.PRODUCTS] }, async ({ productsApi }) => {
        id = testCase.id as string;
        const response = await productsApi.delete(id, token);
        expect.soft(response.status).toBe(testCase.expectedStatus || STATUS_CODES.NOT_FOUND);
      });
    }
  });
});
