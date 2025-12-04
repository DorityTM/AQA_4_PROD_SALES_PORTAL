import { STATUS_CODES } from "data/statusCodes";
import { generateCustomerData } from "./generateCustomerData";

// Invalid payload scenarios for CREATE/UPDATE operations
export const INVALID_PAYLOAD_SCENARIOS = [
  {
    description: "Email: Missing @",
    testData: generateCustomerData({ email: "plainaddress" }),
  },
  {
    description: "Email: Missing domain",
    testData: generateCustomerData({ email: "test@" }),
  },
  {
    description: "Email: Empty",
    testData: generateCustomerData({ email: "" }),
  },
  {
    description: "Name: Empty",
    testData: generateCustomerData({ name: "" }),
  },
  {
    description: "Name: Too long",
    testData: generateCustomerData({ name: "a".repeat(41) }),
  },
  {
    description: "City: Empty",
    testData: generateCustomerData({ city: "" }),
  },
  {
    description: "City: Too long",
    testData: generateCustomerData({ city: "a".repeat(21) }),
  },
  {
    description: "Street: Empty",
    testData: generateCustomerData({ street: "" }),
  },
  {
    description: "Street: Too long",
    testData: generateCustomerData({ street: "a".repeat(41) }),
  },
  {
    description: "House: Zero",
    testData: generateCustomerData({ house: 0 }),
  },
  {
    description: "House: Negative",
    testData: generateCustomerData({ house: -1 }),
  },
  {
    description: "Flat: Zero",
    testData: generateCustomerData({ flat: 0 }),
  },
  {
    description: "Flat: Negative",
    testData: generateCustomerData({ flat: -1 }),
  },
  {
    description: "Phone: Letters",
    testData: generateCustomerData({ phone: "abcdefg" }),
  },
  {
    description: "Phone: Empty",
    testData: generateCustomerData({ phone: "" }),
  },
  {
    description: "Notes: Too long",
    testData: generateCustomerData({ notes: "a".repeat(251) }),
  },
];

// Invalid ID scenarios for GET/DELETE/UPDATE operations
export const INVALID_ID_SCENARIOS = {
  DELETE: [
    {
      description: "Non-existent ID (valid format)",
      id: "507f1f77bcf86cd799439011",
      expectedStatus: STATUS_CODES.NOT_FOUND,
      shouldHaveErrorMessage: true,
    },
    {
      description: "Short ID",
      id: "123",
      expectedStatus: STATUS_CODES.SERVER_ERROR,
      shouldHaveErrorMessage: false,
    },
    {
      description: "Long ID",
      id: "a".repeat(50),
      expectedStatus: STATUS_CODES.SERVER_ERROR,
      shouldHaveErrorMessage: false,
    },
  ],

  GET: [
    {
      description: "Non-existent ID (valid format)",
      id: "507f1f77bcf86cd799439011",
      expectedStatus: STATUS_CODES.NOT_FOUND,
      shouldHaveErrorMessage: true,
    },
    {
      description: "Short ID",
      id: "123",
      expectedStatus: STATUS_CODES.SERVER_ERROR,
      shouldHaveErrorMessage: false,
    },
    {
      description: "Long ID",
      id: "a".repeat(50),
      expectedStatus: STATUS_CODES.SERVER_ERROR,
      shouldHaveErrorMessage: false,
    },
  ],

  UPDATE: [
    {
      description: "Non-existent ID (valid format)",
      id: "507f1f77bcf86cd799439011",
      expectedStatus: STATUS_CODES.BAD_REQUEST,
      shouldHaveErrorMessage: true,
    },
    {
      description: "Short ID",
      id: "123",
      expectedStatus: STATUS_CODES.BAD_REQUEST,
      shouldHaveErrorMessage: true,
    },
    {
      description: "Long ID",
      id: "a".repeat(50),
      expectedStatus: STATUS_CODES.BAD_REQUEST,
      shouldHaveErrorMessage: true,
    },
  ],
};
