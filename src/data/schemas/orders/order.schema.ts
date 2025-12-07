import { obligatoryFieldsSchema, obligatoryRequredFields } from "../core.schema";
import { productSchema } from "../products/product.schema";
import { customerSchema } from "../customers/customer.schema";
import { deliveryInfoSchema } from "../delivery/delivery.schema";
import { ORDER_STATUS, ORDER_HISTORY_ACTIONS } from "data/salesPortal/order-status";
import type { OrdersTableHeader } from "data/types/order.types";

const orderProductSchema = {
  type: "object",
  properties: {
    ...productSchema.properties,
    received: { type: "boolean" },
  },
  required: [...productSchema.required, "received"],
  additionalProperties: false,
};

const commentSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    text: { type: "string" },
    createdOn: { type: "string" },
  },
  required: ["_id", "text", "createdOn"],
  additionalProperties: false,
};

const orderHistorySchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    status: {
      type: "string",
      enum: Object.values(ORDER_STATUS),
    },
    customer: { type: "string" },
    products: {
      type: "array",
      items: orderProductSchema,
    },
    total_price: { type: "number" },
    delivery: {
      anyOf: [deliveryInfoSchema, { type: "null" }],
    },
    assignedManager: {
      anyOf: [{ type: "string" }, { type: "null" }],
    },
    changedOn: { type: "string" },
    action: {
      type: "string",
      enum: Object.values(ORDER_HISTORY_ACTIONS),
    },
  },
  required: ["_id", "status", "customer", "products", "total_price", "delivery", "assignedManager", "changedOn", "action"],
  additionalProperties: false,
};

const orderFromResponseSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    status: {
      type: "string",
      enum: Object.values(ORDER_STATUS),
    },
    customer: customerSchema,
    products: {
      type: "array",
      items: orderProductSchema,
    },
    delivery: {
      anyOf: [deliveryInfoSchema, { type: "null" }],
    },
    total_price: { type: "number" },
    createdOn: { type: "string" },
    comments: {
      type: "array",
      items: commentSchema,
    },
    history: {
      type: "array",
      items: orderHistorySchema,
    },
    assignedManager: {
      anyOf: [{ type: "string" }, { type: "null" }],
    },
  },
  required: [
    "_id",
    "status",
    "customer",
    "products",
    "total_price",
    "createdOn",
    "comments",
    "history",
    "assignedManager",
    "delivery",
  ],
  additionalProperties: false,
};

export const getOrderSchema = {
  type: "object",
  properties: {
    order: orderFromResponseSchema,
    ...obligatoryFieldsSchema,
  },
  required: ["order", ...obligatoryRequredFields],
  additionalProperties: false,
};

export const getAllOrdersSchema = {
  type: "object",
  properties: {
    orders: {
      type: "array",
      items: orderFromResponseSchema,
    },
    total: { type: "number" },
    page: { type: "number" },
    limit: { type: "number" },
    search: { type: "string" },
    status: {
      type: "array",
      items: {
        type: "string",
        enum: Object.values(ORDER_STATUS),
      },
    },
    sorting: {
      type: "object",
      properties: {
        sortField: {
          type: "string",
          enum: [
            "orderNumber",
            "email",
            "price",
            "delivery",
            "status",
            "assignedManager",
            "createdOn",
          ] as OrdersTableHeader[],
        },
        sortOrder: {
          type: "string",
          enum: ["asc", "desc"],
        },
      },
      required: ["sortField", "sortOrder"],
      additionalProperties: false,
    },
    ...obligatoryFieldsSchema,
  },
  required: ["orders", "total", "page", "limit", "search", "status", "sorting", ...obligatoryRequredFields],
  additionalProperties: false,
};
