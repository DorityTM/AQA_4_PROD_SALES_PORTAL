import { STATUS_CODES } from "data/statusCodes";
import { IOrderFromResponse } from "data/types/order.types";
import { expect, test } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { faker } from "@faker-js/faker";
import { getOrderSchema } from "data/schemas/orders/get.schema";

test.describe("[API][Orders][Comment]", () => {
  let token = "";
  let order: IOrderFromResponse;

  test.beforeAll(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    order = await ordersApiService.createOrderAndEntities(token, 1);
  });

  test.afterAll(async ({ ordersApiService }) => {
    if (order) {
      await ordersApiService.deleteOrderAndEntities(token, order._id);
    }
  });

  test("Create comment to an order", async ({ ordersApi }) => {
    const text = faker.lorem.sentence(5);
    const response = await ordersApi.addComment(token, order._id, { text });
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });
    const comment = response.body.Order.comments.find((c) => c.text === text);
    expect(comment).toBeDefined();
  });
});
