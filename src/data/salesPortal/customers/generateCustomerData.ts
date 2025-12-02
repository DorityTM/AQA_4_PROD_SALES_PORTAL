import { faker } from "@faker-js/faker";
import { ICustomer, ICustomerFromResponse } from "data/types/customer.types";
import { getRandomEnumValue } from "utils/enum.utils";
import { ObjectId } from "bson";
import { COUNTRY } from "../country";

//TODO: refactor generator for names (issues with Ireland names)
export function generateCustomerData(params?: Partial<ICustomer>): ICustomer {
  return {
    email: faker.internet.email(),
    name: faker.person.fullName(),
    country: getRandomEnumValue(COUNTRY),
    city: faker.location.city(),
    street: faker.location.street(),
    house: faker.number.int({ min: 1, max: 999 }),
    flat: faker.number.int({ min: 1, max: 9999 }),
    phone: faker.phone.number({ style: "international" }),
    notes: faker.string.alphanumeric({ length: 250 }),
    ...params,
  };
}

export function generateCustomerResponseData(
  params?: Partial<ICustomer>,
): ICustomerFromResponse {
  const initial = generateCustomerData(params);
  return {
    _id: new ObjectId().toHexString(),
    email: initial.email,
    name: initial.name,
    country: initial.country,
    city: initial.city,
    street: initial.street,
    house: initial.house,
    flat: initial.flat,
    phone: initial.phone,
    createdOn: new Date().toISOString(),
    notes: initial.notes!,
  };
}
