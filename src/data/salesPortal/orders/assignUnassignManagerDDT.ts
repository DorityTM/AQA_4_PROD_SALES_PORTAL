import { STATUS_CODES } from "data/statusCodes";
import { IManagerAssignCases } from "data/types/order.types";
import { RESPONSE_ERRORS } from "../errors";

export const orderInStatus: IManagerAssignCases[] = [
  { name: "Draft", create: (ordersApiService, token) => ordersApiService.createOrderAndEntities(token, 1) },
  {
    name: "In Process",
    create: async (ordersApiService, token) => {
      const response = await ordersApiService.createOrderInProcess(token, 1);
      return response.body.Order;
    },
  },
  {
    name: "Partially Received",
    create: async (ordersApiService, token) => {
      const response = await ordersApiService.createPartiallyReceivedOrder(token, 2);
      return response.body.Order;
    },
  },
  {
    name: "Received",
    create: async (ordersApiService, token) => {
      const response = await ordersApiService.createReceivedOrder(token, 1);
      return response.body.Order;
    },
  },
  {
    name: "Canceled",
    create: async (ordersApiService, token) => {
      const response = await ordersApiService.createCanceledOrder(token, 1);
      return response.body.Order;
    },
  },
];

export interface IManagerAssignNegativeCase {
  title: string;
  orderId: (orderId: string) => string | undefined;
  managerId: (managerId: string) => string | undefined;
  expectedStatus: STATUS_CODES;
  expectedErrorMessage: string | null;
}

export const assignUnassignManagerNegativeCases: IManagerAssignNegativeCase[] = [
    {
    title: "manager with non-existing managerId",
    managerId: () => "000000000000000000000000",
    orderId: (orderId: string) => orderId,
    expectedStatus: STATUS_CODES.NOT_FOUND,
    expectedErrorMessage: RESPONSE_ERRORS.MANAGER_NOT_FOUND("000000000000000000000000"),
  },
  {
    title: "manager with empty managerId",
    managerId: () => "",
    orderId: (orderId: string) => orderId,
    expectedStatus: STATUS_CODES.NOT_FOUND,
    expectedErrorMessage: null,
  },
  {
    title: "manager with non-existing orderId",
    orderId: () => "000000000000000000000000",
    managerId: (managerId: string) => managerId,
    expectedStatus: STATUS_CODES.NOT_FOUND,
    expectedErrorMessage: RESPONSE_ERRORS.ORDER_NOT_FOUND("000000000000000000000000"),
  },
  {
    title: "manager with empty orderId",
    orderId: () => "",
    managerId: (managerId: string) => managerId,
    expectedStatus: STATUS_CODES.NOT_FOUND,
    expectedErrorMessage: null,
  },
]