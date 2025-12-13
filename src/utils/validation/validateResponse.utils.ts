import { expect } from "@playwright/test";
import { IResponse, IResponseFields } from "data/types/core.types";
import { validateJsonSchema } from "./validateSchema.utils";

export function validateResponse<T extends IResponseFields | null>(
  response: IResponse<T>,
  expected: {
    status: number;
    IsSuccess?: boolean;
    ErrorMessage?: string | null | RegExp;
    schema?: object;
  },
) {
  expect.soft(response.status).toBe(expected.status);
  if (expected.IsSuccess !== undefined) {
    expect.soft(response.body!.IsSuccess).toBe(expected.IsSuccess);
  }
  if (expected.ErrorMessage !== undefined) {
    const actualError = response.body!.ErrorMessage;
    if (expected.ErrorMessage instanceof RegExp) {
      expect.soft(actualError ?? "").toMatch(expected.ErrorMessage);
    } else {
      expect.soft(actualError).toBe(expected.ErrorMessage);
    }
  }
  if (expected.schema) validateJsonSchema(response.body!, expected.schema);
}
