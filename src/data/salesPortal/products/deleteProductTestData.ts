import { ICreateProductCase } from "data/types/product.types";
import { STATUS_CODES, ERROR_MESSAGE } from "data/statusCodes";
import { faker } from "@faker-js/faker";
import { ObjectId } from "bson";

export const deleteProductPositiveCases: ICreateProductCase[] = [
  {
    title: "Delete product",
    expectedStatus: STATUS_CODES.DELETED,
  },
];

export const deleteProductNegativeCases: ICreateProductCase[] = [
  {
    title: "404 returned for empty id",
    id: "",
    expectedStatus: STATUS_CODES.NOT_FOUND,
  },
  {
    title: "404 returned for non-existing id of valid format",
    id: new ObjectId().toHexString(),
    expectedStatus: STATUS_CODES.NOT_FOUND,
  },
  {
    title: "400 returned for id of invalid format",
    id: faker.string.alphanumeric({ length: 10 }),
    expectedStatus: STATUS_CODES.BAD_REQUEST,
    expectedErrorMessage: ERROR_MESSAGE.BAD_REQUEST,
  },
];
