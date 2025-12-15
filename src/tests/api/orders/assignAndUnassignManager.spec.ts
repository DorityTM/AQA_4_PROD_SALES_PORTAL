import { UsersApi } from "api/api/users.api";
import { getOrderSchema } from "data/schemas/orders/get.schema";
import { STATUS_CODES } from "data/statusCodes";
import { IOrderFromResponse } from "data/types/order.types";
import { IUserFromResponse } from "data/types/user.types";
import { expect, test } from "fixtures";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { generateUserData } from "../users/generateUsersData";
import { TAGS } from "data/tags";
import { assignUnassignManagerNegativeCases, orderInStatus } from "data/salesPortal/orders/assignUnassignManagerDDT";
import { RESPONSE_ERRORS } from "data/salesPortal/errors";

export async function createManager(token: string, usersApi: UsersApi): Promise<IUserFromResponse> {
  const userData = generateUserData();
  const response = await usersApi.create(token, userData);
  expect(response.status).toBe(STATUS_CODES.CREATED);
  return response.body.User;
}

test.describe("[API][Orders][Manager assignment flow]", () => {
  let token = "";
  let createdManager: IUserFromResponse;
  let anotherManager: IUserFromResponse;
  let order: IOrderFromResponse;

  test.beforeAll(async ({ loginApiService, usersApi }) => {
    token = await loginApiService.loginAsAdmin();
    createdManager = await createManager(token, usersApi);
    anotherManager = await createManager(token, usersApi);
  });

  test.afterAll(async ({ usersApi }) => {
    if (createdManager._id) await usersApi.delete(token, createdManager._id);
    if (anotherManager._id) await usersApi.delete(token, anotherManager._id);
  });

  for (const orderCase of orderInStatus) {
    test.describe(`Order in ${orderCase.name} status`, { tag: [TAGS.REGRESSION, TAGS.API, TAGS.CUSTOMERS] }, () => {
      test.beforeEach(async ({ ordersApiService }) => {
        order = await orderCase.create(ordersApiService, token);
      });

      test.afterEach(async ({ ordersApiService }) => {
        if (order) await ordersApiService.deleteOrderAndEntities(token, order._id);
      });

      test("Assign manager to order", async ({ ordersApi }) => {
        const response = await ordersApi.assingManager(token, order._id, createdManager._id);
        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
          schema: getOrderSchema,
        });
        const assignedManager = response.body.Order.assignedManager;
        expect(assignedManager).not.toBeNull();
        expect(assignedManager!._id).toBe(createdManager._id);
        expect(assignedManager!.firstName).toBe(createdManager.firstName);
        expect(assignedManager!.lastName).toBe(createdManager.lastName);
      });

      test("Update manager to another manager", async ({ ordersApi }) => {
        await ordersApi.assingManager(token, order._id, createdManager._id);
        const response = await ordersApi.assingManager(token, order._id, anotherManager._id);
        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
          schema: getOrderSchema,
        });
        const assignedManager = response.body.Order.assignedManager;
        expect(assignedManager).not.toBeNull();
        expect(assignedManager!._id).toBe(anotherManager._id);
        expect(assignedManager!.firstName).toBe(anotherManager.firstName);
        expect(assignedManager!.lastName).toBe(anotherManager.lastName);
      });

      test("Remove manager from order", async ({ ordersApi }) => {
        await ordersApi.assingManager(token, order._id, createdManager._id);
        const response = await ordersApi.unassingManager(token, order._id);
        validateResponse(response, {
          status: STATUS_CODES.OK,
          IsSuccess: true,
          ErrorMessage: null,
          schema: getOrderSchema,
        });
        const assignedManager = response.body.Order.assignedManager;
        expect(assignedManager).toBeNull();
      });
    });
  }
});

test.describe("[API][Orders][Assign/Unassign Manager - Negative DDT]", () => {
  let token = "";
  let createdManager: IUserFromResponse;
  let anotherManager: IUserFromResponse;
  let order: IOrderFromResponse;

  test.beforeAll(async ({ loginApiService, usersApi }) => {
    token = await loginApiService.loginAsAdmin();
    createdManager = await createManager(token, usersApi);
    anotherManager = await createManager(token, usersApi);
  });

  test.afterAll(async ({ usersApi }) => {
    if (createdManager._id) await usersApi.delete(token, createdManager._id);
    if (anotherManager._id) await usersApi.delete(token, anotherManager._id);
  });

  for (const orderCase of orderInStatus) {
    test.describe(`Order in ${orderCase.name} status`, { tag: [TAGS.REGRESSION, TAGS.API, TAGS.CUSTOMERS] }, () => {
      test.beforeEach(async ({ ordersApiService }) => {
        order = await orderCase.create(ordersApiService, token);
      });

      test.afterEach(async ({ ordersApiService }) => {
        if (order) await ordersApiService.deleteOrderAndEntities(token, order._id);
      });

      for (const negativeCase of assignUnassignManagerNegativeCases) {
        test(`Should NOT assign ${negativeCase.title}`, async ({ ordersApi }) => {
          const response = await ordersApi.assingManager(
            token,
            negativeCase.orderId(order._id),
            negativeCase.managerId(createdManager._id),
          );
          validateResponse(response, {
            status: negativeCase.expectedStatus,
            IsSuccess: false,
            ErrorMessage: negativeCase.expectedErrorMessage,
          });
        });
        test(`Should NOT update ${negativeCase.title}`, async ({ ordersApi }) => {
          await ordersApi.assingManager(token, order._id, createdManager._id);
          const response = await ordersApi.assingManager(
            token,
            negativeCase.orderId(order._id),
            negativeCase.managerId(createdManager._id),
          );
          validateResponse(response, {
            status: negativeCase.expectedStatus,
            IsSuccess: false,
            ErrorMessage: negativeCase.expectedErrorMessage,
          });
          const orderBody = await ordersApi.getById(order._id, token);
          expect(orderBody.body.Order.assignedManager).not.toBeNull();
          expect(orderBody.body.Order.assignedManager!._id).toBe(createdManager._id);
        });
      }

      test("Should NOT unassign manager from order with non-existing orderId", async ({ ordersApi }) => {
        await ordersApi.assingManager(token, order._id, createdManager._id);
        const response = await ordersApi.unassingManager(token, "000000000000000000000000");
        validateResponse(response, {
          status: STATUS_CODES.NOT_FOUND,
          IsSuccess: false,
          ErrorMessage: RESPONSE_ERRORS.ORDER_NOT_FOUND("000000000000000000000000"),
        });
      });

      test("Should NOT unassign manager from order with empty orderId", async ({ ordersApi }) => {
        await ordersApi.assingManager(token, order._id, createdManager._id);
        const response = await ordersApi.unassingManager(token, "");
        validateResponse(response, {
          status: STATUS_CODES.NOT_FOUND,
          IsSuccess: false,
          ErrorMessage: null,
        });
      });
    });
  }
});
