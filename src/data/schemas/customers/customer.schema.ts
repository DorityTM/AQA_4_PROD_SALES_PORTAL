import { COUNTRY } from "data/salesPortal/country";

export const customerSchema = {
  type: "object",
  properties: {
    _id: {
      type: "string",
      description: "Unique identifier (MongoDB ObjectId string in example)",
    },
    email: {
      type: "string",
    },
    name: {
      type: "string",
    },
    country: {
      type: "string",
      enum: Object.values(COUNTRY),
    },
    city: {
      type: "string",
    },
    street: {
      type: "string",
    },
    house: {
      type: "number",
    },
    flat: {
      type: "number",
    },
    phone: {
      type: "string",
    },
    createdOn: {
      type: "string",
    },
    notes: {
      type: "string",
    },
  },
  required: [
    "_id",
    "email",
    "name",
    "country",
    "city",
    "street",
    "house",
    "flat",
    "phone",
  ],
  additionalProperties: false,
};
