import { test } from "fixtures";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { createOrderTestData, IOrderTestData } from "utils/orders/createOrderTestData.utils";
import { TAGS } from "data/tags";
import { DELETE_ORDER_CASES } from "data/salesPortal/orders/createOrderTestData";
test.setTimeout(60000);

test.describe("[API][Orders][Delete Order]", () => {
  let token = "";
  let orderId = "";
  let customerId = "";
  let productIds: string[] = [];

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ customersApiService, productsApiService }) => {
    if (productIds.length) {
      await Promise.all(productIds.map((id) => productsApiService.delete(token, id)));
      productIds = [];
    }

    if (customerId) {
      await customersApiService.delete(token, customerId);
      customerId = "";
    }
  });

  for (const positiveCase of DELETE_ORDER_CASES) {
    test(
      positiveCase.title,
      { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
      async ({ ordersApi, ordersApiService, customersApiService, productsApiService }) => {
        const data: IOrderTestData = await createOrderTestData({
          token,
          customersApiService,
          productsApiService,
          productsCount: positiveCase.productsCount,
        });

        customerId = data.customerId;
        productIds = data.productIds;

        const createdOrder = await ordersApiService.create(token, customerId, productIds);
        orderId = createdOrder._id;

        const deleteOrderResponse = await ordersApi.delete(token, orderId);

        await validateResponse(deleteOrderResponse, {
          status: STATUS_CODES.DELETED,
        });

        orderId = "";
      },
    );
  }
});
