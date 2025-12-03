import { generateCustomerData } from "./generateCustomerData";
import { COUNTRY } from "data/salesPortal/country";
import { STATUS_CODES } from "data/statusCodes";

export const INVALID_CUSTOMER_PAYLOADS = [
  {
    description: "Email: Missing @",
    data: { ...generateCustomerData(), email: "plainaddress" },
  },
  {
    description: "Email: Missing domain",
    data: { ...generateCustomerData(), email: "test@" },
  },
  {
    description: "Email: Empty",
    data: { ...generateCustomerData(), email: "" },
  },
  { description: "Name: Empty", data: { ...generateCustomerData(), name: "" } },
  {
    description: "Name: Too long",
    data: { ...generateCustomerData(), name: "a".repeat(41) },
  },
  {
    description: "Country: Invalid Enum",
    data: { ...generateCustomerData(), country: "InvalidCountry" as COUNTRY },
  },
  { description: "City: Empty", data: { ...generateCustomerData(), city: "" } },
  {
    description: "City: Too long",
    data: { ...generateCustomerData(), city: "a".repeat(21) },
  },
  {
    description: "Street: Empty",
    data: { ...generateCustomerData(), street: "" },
  },
  {
    description: "Street: Too long",
    data: { ...generateCustomerData(), street: "a".repeat(41) },
  },
  { description: "House: Zero", data: { ...generateCustomerData(), house: 0 } },
  {
    description: "House: Negative",
    data: { ...generateCustomerData(), house: -1 },
  },
  { description: "Flat: Zero", data: { ...generateCustomerData(), flat: 0 } },
  {
    description: "Flat: Negative",
    data: { ...generateCustomerData(), flat: -1 },
  },
  {
    description: "Phone: Letters",
    data: { ...generateCustomerData(), phone: "abcdefg" },
  },
  {
    description: "Phone: Empty",
    data: { ...generateCustomerData(), phone: "" },
  },
  {
    description: "Notes: Too long",
    data: { ...generateCustomerData(), notes: "a".repeat(251) },
  },
];

export const INVALID_CUSTOMER_IDS = [
  {
    description: "Empty ID",
    id: "",
    get: { status: STATUS_CODES.NOT_FOUND, checkBody: false },
    delete: { status: STATUS_CODES.NOT_FOUND, checkBody: false },
    update: { status: STATUS_CODES.NOT_FOUND, checkBody: false },
  },
  {
    description: "Non-existent ID (valid format)",
    id: "507f1f77bcf86cd799439011",
    get: { status: STATUS_CODES.NOT_FOUND, checkBody: true },
    delete: { status: STATUS_CODES.NOT_FOUND, checkBody: true },
    update: { status: STATUS_CODES.BAD_REQUEST, checkBody: true },
  },
  {
    description: "Short ID",
    id: "123",
    get: { status: STATUS_CODES.SERVER_ERROR, checkBody: false },
    delete: { status: STATUS_CODES.SERVER_ERROR, checkBody: false },
    update: { status: STATUS_CODES.BAD_REQUEST, checkBody: true },
  },
  {
    description: "Long ID",
    id: "a".repeat(50),
    get: { status: STATUS_CODES.SERVER_ERROR, checkBody: false },
    delete: { status: STATUS_CODES.SERVER_ERROR, checkBody: false },
    update: { status: STATUS_CODES.BAD_REQUEST, checkBody: true },
  },
];
