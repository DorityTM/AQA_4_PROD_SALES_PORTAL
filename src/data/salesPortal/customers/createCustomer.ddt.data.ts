import { ICreateCustomerCases } from "data/types/customer.types";
import { generateCustomerData } from "./generateCustomerData";

export const CREATE_CUSTOMER_POSITIVE_CASES: ICreateCustomerCases[] = [
  //name
  {
    title: "Verifying name input: min (1) character",
    customerData: generateCustomerData({ name: "K" }),
  },
  {
    title: "Verifying name input: max (40) characters",
    customerData: generateCustomerData({
      name: "Alexandria Catherine Montgomery Smith Jr",
    }),
  },
  {
    title: "Verifying name input: upper-case",
    customerData: generateCustomerData({ name: "STESHA" }),
  },
  //email
  {
    title: "Verifying email input:  upper-case",
    customerData: generateCustomerData({ email: "DONNY.BLACK@tTEST.COM" }),
  },
  //city
  {
    title: "Verifying city input: min (1) character",
    customerData: generateCustomerData({ city: "M" }),
  },
  {
    title: "Verifying city input: max (20) characters",
    customerData: generateCustomerData({ city: "Nolagthiosd Ghdipiso" }),
  },
  {
    title: "Verifying city input: upper-case",
    customerData: generateCustomerData({ city: "TORONTO" }),
  },
  //street
  {
    title: "Verifying street input:  min (1) character",
    customerData: generateCustomerData({ street: "J" }),
  },
  {
    title: "Verifying street input:  max (40) characters",
    customerData: generateCustomerData({
      street: "Alexandria Catherine Montgomery Smith Jr",
    }),
  },
  {
    title: "Verifying street input:  upper-case",
    customerData: generateCustomerData({
      street: "SAINT JAMES",
    }),
  },
  //house
  {
    title: "Verifying house input:  min (1) character",
    customerData: generateCustomerData({ house: 1 }),
  },
  {
    title: "Verifying house input:  max (999) characters",
    customerData: generateCustomerData({ house: 999 }),
  },
  //flat
  {
    title: "Verifying flat input:  min (1) character",
    customerData: generateCustomerData({ flat: 1 }),
  },
  {
    title: "Verifying flat input:  max (9999) characters",
    customerData: generateCustomerData({ flat: 9999 }),
  },
  //phone
  {
    title: "Verifying phone input:  min (10) characters",
    customerData: generateCustomerData({ phone: "+1234567890" }),
  },
  {
    title: "Verifying phone input:  max (20) characters",
    customerData: generateCustomerData({ phone: "+12345678901234567890" }),
  },
  //notes
  {
    title: "Verifying notes input: empty",
    customerData: generateCustomerData({ notes: "" }),
  },
];

export const CREATE_CUSTOMER_NEGATIVE_CASES: ICreateCustomerCases[] = [
  //name
  {
    title: "Verifying name input: empty",
    customerData: generateCustomerData({ name: "" }),
  },
  {
    title: "Verifying name input: with numbers",
    customerData: generateCustomerData({ name: "Sony87" }),
  },
  {
    title: "Verifying name input: with underscore",
    customerData: generateCustomerData({ name: "Dan_99" }),
  },

  //email
  {
    title: "Verifying email input: empty",
    customerData: generateCustomerData({ email: "" }),
  },
  {
    title: "Verifying email input: without @",
    customerData: generateCustomerData({ email: "tata.com" }),
  },

  //city
  {
    title: "Verifying city input: empty",
    customerData: generateCustomerData({ city: "" }),
  },
  {
    title: "Verifying city input: with dash",
    customerData: generateCustomerData({ city: "Baden-Baden" }),
  },
  {
    title: "Verifying city input: with apostrophe",
    customerData: generateCustomerData({ city: "Kapa'a" }),
  },
  //street
  {
    title: "Verifying street input: empty",
    customerData: generateCustomerData({ street: "" }),
  },
  {
    title: "Verifying street input: with dash",
    customerData: generateCustomerData({ street: "Rose-street" }),
  },
  {
    title: "Verifying street input: with apostrophe",
    customerData: generateCustomerData({ street: "Jamie's" }),
  },
  //house
  {
    title: "Verifying house input: with 0",
    customerData: generateCustomerData({ house: 0 }),
  },
  //phone
  {
    title: "Verifying phone input: without +",
    customerData: generateCustomerData({ phone: "12345678910" }),
  },
];
