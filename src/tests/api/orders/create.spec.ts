import { IOrderCreateBody } from "data/types/order.types";
import { test } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { createOrderTestData, IOrderTestData } from "utils/orders/createOrderTestData.utils";
import { CREATE_ORDER_NEGATIVE_CASES, CREATE_ORDER_POSITIVE_CASES } from "data/salesPortal/orders/createOrderTestData";
import { TAGS } from "data/tags";
import { TIMEOUT_30_S } from "data/salesPortal/constants";
test.setTimeout(TIMEOUT_30_S);

test.describe("[API][Orders][Create Order]", () => {
  let token = "";
  let orderId = "";
  let customerId = "";
  let productIds: string[] = [];

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService, customersApiService, productsApiService }) => {
    if (orderId) {
      await ordersApiService.delete(token, orderId);
      orderId = "";
    }

    if (productIds.length) {
      await Promise.all(productIds.map((id) => productsApiService.delete(token, id)));
      productIds = [];
    }

    if (customerId) {
      await customersApiService.delete(token, customerId);
      customerId = "";
    }
  });

  for (const positiveCase of CREATE_ORDER_POSITIVE_CASES) {
    test(
      `${positiveCase.title}`,
      { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
      async ({ ordersApi, customersApiService, productsApiService }) => {
        const data: IOrderTestData = await createOrderTestData({
          token,
          customersApiService,
          productsApiService,
          productsCount: positiveCase.productsCount,
        });

        customerId = data.customerId;
        productIds = data.productIds;

        const payload: IOrderCreateBody = {
          customer: customerId,
          products: productIds,
        };

        const createOrderResponse = await ordersApi.create(token, payload);

        await validateResponse(createOrderResponse, {
          status: positiveCase.expectedStatus,
          // schema: getOrderSchema,
          IsSuccess: positiveCase.isSuccess as boolean,
          ErrorMessage: positiveCase.expectedErrorMessage,
        });

        orderId = createOrderResponse.body.Order._id;
      },
    );
  }
});

test.describe("[API][Orders][Create Order - Negative DDT]", () => {
  let token = "";
  let orderId = "";
  let customerId = "";
  let productIds: string[] = [];

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService, customersApiService, productsApiService }) => {
    if (orderId) {
      await ordersApiService.delete(token, orderId);
      orderId = "";
    }

    if (productIds.length) {
      await Promise.all(productIds.map((id) => productsApiService.delete(token, id)));
      productIds = [];
    }

    if (customerId) {
      await customersApiService.delete(token, customerId);
      customerId = "";
    }
  });

  for (const negativeCase of CREATE_ORDER_NEGATIVE_CASES) {
    test(
      negativeCase.title,
      { tag: [TAGS.API, TAGS.ORDERS] },
      async ({ ordersApi, customersApiService, productsApiService }) => {
        const data: IOrderTestData = await createOrderTestData({
          token,
          customersApiService,
          productsApiService,
          productsCount: negativeCase.productsCount,
        });

        customerId = data.customerId;
        productIds = data.productIds;

        const basePayload: IOrderCreateBody = {
          customer: customerId,
          products: productIds,
        };

        const payload: IOrderCreateBody = {
          ...basePayload,
          ...negativeCase.orderData,
        };

        const response = await ordersApi.create(token, payload);

        await validateResponse(response, {
          status: negativeCase.expectedStatus,
          IsSuccess: negativeCase.isSuccess as boolean,
          ErrorMessage: negativeCase.expectedErrorMessage,
        });
      },
    );
  }
});
