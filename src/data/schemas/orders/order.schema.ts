import { productSchema } from "../products/product.schema";
import { customerSchema } from "../customers/customer.schema";
import { deliveryInfoSchema } from "../delivery/delivery.schema";
import { ORDER_STATUS, ORDER_HISTORY_ACTIONS } from "data/salesPortal/order-status";

export const orderProductSchema = {
  type: "object",
  properties: {
    ...productSchema.properties,
    received: { type: "boolean" },
  },
  required: [...productSchema.required, "received"],
  additionalProperties: false,
};

export const commentSchema = {
  type: "object",
  properties: {
    _id: { type: "string" },
    text: { type: "string" },
    createdOn: { type: "string" },
  },
  required: ["_id", "text", "createdOn"],
  additionalProperties: false,
};

export const orderHistorySchema = {
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
  required: [
    "_id",
    "status",
    "customer",
    "products",
    "total_price",
    "delivery",
    "assignedManager",
    "changedOn",
    "action",
  ],
  additionalProperties: false,
};

export const orderFromResponseSchema = {
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
