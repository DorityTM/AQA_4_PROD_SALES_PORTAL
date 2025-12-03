import { test, expect } from "fixtures/api.fixture";
import { credentials } from "config/env";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { TAGS } from "data/tags";
import { STATUS_CODES } from "data/statusCodes";
import { loginSchema } from "data/schemas/login/login.schema";

test.describe("[API] [Sales Portal] [Login]", () => {
  test("Login",  {tag: [TAGS.SMOKE, TAGS.REGRESSION, TAGS.API, TAGS.AUTH],}, async ({ loginApi }) => {
      const loginResponse = await loginApi.login(credentials);
      validateResponse(loginResponse, {
        status: STATUS_CODES.OK,
        schema: loginSchema,
        IsSuccess: true,
        ErrorMessage: null,
      });
      const headers = loginResponse.headers;
      expect(headers["authorization"]).toBeTruthy();
    }
  );
});