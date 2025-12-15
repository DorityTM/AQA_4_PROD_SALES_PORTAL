import { test, expect } from "fixtures/api.fixture";
import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { IOrderFromResponse, IOrderHistory } from "data/types/order.types";
import { ORDER_HISTORY_ACTIONS, ORDER_STATUS } from "data/salesPortal/order-status";
import type { IProduct } from "data/types/product.types";

test.describe("[API][Orders]", () => {
  let token = "";
  let orderId = "";
  let orderObj: IOrderFromResponse | null = null;

  test.beforeEach(async ({ loginApiService, ordersApiService }) => {
    token = await loginApiService.loginAsAdmin();
    const order = await ordersApiService.createOrderAndEntities(token, 1);
    orderId = order._id;
    orderObj = order;
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (orderId) {
      await ordersApiService.deleteOrderAndEntities(token, orderId);
      orderId = "";
      orderObj = null;
    }
  });

  test(
    "ORD-PUT-001: Successful products update recalculates total_price",
    { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, productsApiService }) => {
      const original: IOrderFromResponse = orderObj!;

      expect.soft(original.products.length).toBeGreaterThan(0);
      const originalFirst = original.products[0]!;

      const updatedProduct: IProduct = {
        name: originalFirst.name,
        manufacturer: originalFirst.manufacturer,
        amount: originalFirst.amount,
        price: originalFirst.price + 100,
      };
      await productsApiService.update(token, originalFirst._id, updatedProduct);

      const updated = await ordersApiService.update(token, orderId, {
        customer: original.customer._id,
        products: [originalFirst._id],
      });
      const expectedTotal = updated.products.reduce(
        (sum: number, p: IOrderFromResponse["products"][number]) => sum + p.price,
        0,
      );
      expect.soft(updated.total_price).toBe(expectedTotal);
      expect.soft(updated.products[0]!.price).toBe(originalFirst.price + 100);
      expect.soft(updated._id).toBe(orderId);
    },
  );

  test(
    "ORD-PUT-002: Successful update of customer in order",
    { tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, customersApiService }) => {
      const original: IOrderFromResponse = orderObj!;
      const newCustomer = await customersApiService.create(token);

      const productIds = original.products.map((p) => p._id);
      const updated = await ordersApiService.update(token, orderId, {
        customer: newCustomer._id,
        products: productIds,
      });
      expect.soft(updated.customer._id).toBe(newCustomer._id);

      const expectedTotal = updated.products.reduce(
        (sum: number, p: IOrderFromResponse["products"][number]) => sum + p.price,
        0,
      );
      expect.soft(updated.total_price).toBe(expectedTotal);
    },
  );

  test(
    "ORD-PUT-003: Order status is DRAFT after update",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService }) => {
      const before = orderObj!;

      const productIds = before.products.map((p) => p._id);
      const after = await ordersApiService.update(token, orderId, {
        customer: before.customer._id,
        products: productIds,
      });
      expect.soft(after.status).toBe(ORDER_STATUS.DRAFT);
    },
  );

  test(
    "ORD-PUT-004: History entry recorded when order composition changes",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService, productsApiService }) => {
      const before: IOrderFromResponse = orderObj!;
      const beforeHistoryLen = before.history.length;

      const extraProduct = await productsApiService.create(token);
      const productIds = [before.products[0]!._id, extraProduct._id];

      const after = await ordersApiService.update(token, orderId, {
        customer: before.customer._id,
        products: productIds,
      });
      expect.soft(after.history.length).toBeGreaterThan(beforeHistoryLen);
      const changed = after.history.find(
        (h: IOrderHistory) => h.action === ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED,
      );
      expect.soft(changed).toBeTruthy();
      expect.soft(changed?.changedOn).toBeTruthy();
    },
  );

  test(
    "ORD-PUT-005: Update attempt for non-existent order returns 404",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const order = orderObj!;
      const nonExistentOrderId = "ffffffffffffffffffffffff";
      const response = await ordersApi.update(token, nonExistentOrderId, {
        customer: order.customer._id,
        products: [order.products[0]!._id],
      });

      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: "Order with id 'ffffffffffffffffffffffff' wasn't found",
      });
    },
  );

  test(
    "ORD-PUT-006: Validation error on non-existent product id in products array",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const order = orderObj!;
      const fakeProductId = "ffffffffffffffffffffffff";
      const response = await ordersApi.update(token, orderId, {
        customer: order.customer._id,
        products: [order.products[0]!._id, fakeProductId],
      });
      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: "Product with id 'ffffffffffffffffffffffff' wasn't found",
      });
    },
  );

  test(
    "ORD-PUT-007: Validation error on invalid ObjectId format",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const order = orderObj!;
      const invalidOrderId = "123";
      const response = await ordersApi.update(token, invalidOrderId, {
        customer: order.customer._id,
        products: [order.products[0]!._id],
      });
      validateResponse(response, {
        status: STATUS_CODES.SERVER_ERROR,
        IsSuccess: false,
        ErrorMessage: "Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer",
      });
    },
  );

  test(
    "ORD-PUT-008: Unauthorized update without token",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const order = orderObj!;
      const response = await ordersApi.update("", orderId, {
        customer: order.customer._id,
        products: [order.products[0]!._id],
      });
      validateResponse(response, {
        status: STATUS_CODES.UNAUTHORIZED,
        IsSuccess: false,
        ErrorMessage: "Not authorized",
      });
    },
  );

  test(
    "ORD-PUT-009: Validation error on invalid customer ObjectId format",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const order = orderObj!;
      const invalidCustomerId = "123";
      const response = await ordersApi.update(token, orderId, {
        customer: invalidCustomerId,
        products: [order.products[0]!._id],
      });
      validateResponse(response, {
        status: STATUS_CODES.SERVER_ERROR,
        IsSuccess: false,
        ErrorMessage: 'Cast to ObjectId failed for value "123" (type string) at path "_id" for model "Customer"',
      });
    },
  );

  test(
    "ORD-PUT-010: Validation error on non-existent customer id",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const order = orderObj!;
      const nonExistentCustomerId = "ffffffffffffffffffffffff";
      const response = await ordersApi.update(token, orderId, {
        customer: nonExistentCustomerId,
        products: [order.products[0]!._id],
      });
      validateResponse(response, {
        status: STATUS_CODES.NOT_FOUND,
        IsSuccess: false,
        ErrorMessage: "Customer with id 'ffffffffffffffffffffffff' wasn't found",
      });
    },
  );

  test(
    "ORD-PUT-011: Validation error on empty products array",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApi }) => {
      const order = orderObj!;
      const response = await ordersApi.update(token, orderId, {
        customer: order.customer._id,
        products: [],
      });
      validateResponse(response, {
        status: STATUS_CODES.BAD_REQUEST,
        IsSuccess: false,
        ErrorMessage: "Incorrect request body",
      });
    },
  );

  test(
    "ORD-PUT-012: Cannot delete linked product/customer until order is deleted",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ productsApi, customersApi }) => {
      const original: IOrderFromResponse = orderObj!;
      const deleteProductResponse = await productsApi.delete(original.products[0]!._id, token);
      expect.soft(deleteProductResponse.status).toBe(STATUS_CODES.BAD_REQUEST);

      const deleteCustomerResponse = await customersApi.delete(token, original.customer._id);
      expect.soft(deleteCustomerResponse.status).toBe(STATUS_CODES.BAD_REQUEST);
    },
  );

  test(
    "ORD-PUT-013: PUT without changes does not add REQUIRED_PRODUCTS_CHANGED history entry",
    { tag: [TAGS.REGRESSION, TAGS.API, TAGS.ORDERS] },
    async ({ ordersApiService }) => {
      const before = orderObj!;

      const productIds = before.products.map((p) => p._id);
      const after = await ordersApiService.update(token, orderId, {
        customer: before.customer._id,
        products: productIds,
      });

      const beforeCount = before.history.filter(
        (h: IOrderHistory) => h.action === ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED,
      ).length;
      const afterCount = after.history.filter(
        (h: IOrderHistory) => h.action === ORDER_HISTORY_ACTIONS.REQUIRED_PRODUCTS_CHANGED,
      ).length;
      expect.soft(afterCount).toBe(beforeCount);
    },
  );
});
