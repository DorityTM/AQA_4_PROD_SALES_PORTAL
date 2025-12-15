import { faker } from "@faker-js/faker";
import { ICreateUserPayload } from "data/types/user.types";

export function generateUserData(customData: Partial<ICreateUserPayload> = {}): ICreateUserPayload {
  const defaultData: ICreateUserPayload = {
    username: faker.internet.email(),
    password: "12345678", 
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
  };

  return { ...defaultData, ...customData };
}