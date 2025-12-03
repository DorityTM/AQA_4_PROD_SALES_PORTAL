import { COUNTRY } from "data/salesPortal/country";
import { STATUS_CODES } from "data/statusCodes";
import { ICustomer } from "data/types/customer.types";

// Templates for invalid payloads - only field modifications
export const INVALID_PAYLOAD_TEMPLATES = [
  {
    description: "Email: Missing @",
    modifier: (customer: ICustomer) => ({ ...customer, email: "plainaddress" }),
  },
  {
    description: "Email: Missing domain",
    modifier: (customer: ICustomer) => ({ ...customer, email: "test@" }),
  },
  {
    description: "Email: Empty",
    modifier: (customer: ICustomer) => ({ ...customer, email: "" }),
  },
  {
    description: "Name: Empty",
    modifier: (customer: ICustomer) => ({ ...customer, name: "" }),
  },
  {
    description: "Name: Too long",
    modifier: (customer: ICustomer) => ({ ...customer, name: "a".repeat(41) }),
  },
  {
    description: "Country: Invalid Enum",
    modifier: (customer: ICustomer) => ({
      ...customer,
      country: "InvalidCountry" as COUNTRY,
    }),
  },
  {
    description: "City: Empty",
    modifier: (customer: ICustomer) => ({ ...customer, city: "" }),
  },
  {
    description: "City: Too long",
    modifier: (customer: ICustomer) => ({ ...customer, city: "a".repeat(21) }),
  },
  {
    description: "Street: Empty",
    modifier: (customer: ICustomer) => ({ ...customer, street: "" }),
  },
  {
    description: "Street: Too long",
    modifier: (customer: ICustomer) => ({
      ...customer,
      street: "a".repeat(41),
    }),
  },
  {
    description: "House: Zero",
    modifier: (customer: ICustomer) => ({ ...customer, house: 0 }),
  },
  {
    description: "House: Negative",
    modifier: (customer: ICustomer) => ({ ...customer, house: -1 }),
  },
  {
    description: "Flat: Zero",
    modifier: (customer: ICustomer) => ({ ...customer, flat: 0 }),
  },
  {
    description: "Flat: Negative",
    modifier: (customer: ICustomer) => ({ ...customer, flat: -1 }),
  },
  {
    description: "Phone: Letters",
    modifier: (customer: ICustomer) => ({ ...customer, phone: "abcdefg" }),
  },
  {
    description: "Phone: Empty",
    modifier: (customer: ICustomer) => ({ ...customer, phone: "" }),
  },
  {
    description: "Notes: Too long",
    modifier: (customer: ICustomer) => ({
      ...customer,
      notes: "a".repeat(251),
    }),
  },
];

export const INVALID_ID_SCENARIOS = [
  {
    description: "Non-existent ID (valid format)",
    id: "507f1f77bcf86cd799439011",
    expectedStatus: {
      get: STATUS_CODES.NOT_FOUND,
      delete: STATUS_CODES.NOT_FOUND,
      update: STATUS_CODES.BAD_REQUEST,
    },
    hasErrorMessage: {
      get: true,
      delete: true,
      update: true,
    },
  },
  {
    description: "Short ID",
    id: "123",
    expectedStatus: {
      get: STATUS_CODES.SERVER_ERROR,
      delete: STATUS_CODES.SERVER_ERROR,
      update: STATUS_CODES.BAD_REQUEST,
    },
    hasErrorMessage: {
      get: false,
      delete: false,
      update: true,
    },
  },
  {
    description: "Long ID",
    id: "a".repeat(50),
    expectedStatus: {
      get: STATUS_CODES.SERVER_ERROR,
      delete: STATUS_CODES.SERVER_ERROR,
      update: STATUS_CODES.BAD_REQUEST,
    },
    hasErrorMessage: {
      get: false,
      delete: false,
      update: true,
    },
  },
];

// Helper to generate test data for specific operation
export const getInvalidIdTestData = (
  operation: "get" | "delete" | "update",
) => {
  return INVALID_ID_SCENARIOS.map((scenario) => ({
    description: scenario.description,
    id: scenario.id,
    expectedStatus: scenario.expectedStatus[operation],
    shouldHaveErrorMessage: scenario.hasErrorMessage[operation],
  }));
};
