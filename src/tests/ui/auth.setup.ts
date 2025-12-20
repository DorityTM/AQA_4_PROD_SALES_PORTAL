import { test } from "@playwright/test";
import { credentials } from "config/env";
import { LoginService } from "../../api/service/login.service";
import { LoginApi } from "../../api/api/login.api";
import { RequestApi } from "../../api/apiClients/requestApi";

test("create storage state for authenticated user", async ({ context, request }) => {
  const loginApiService = new LoginService(new LoginApi(new RequestApi(request)));
  const token = await loginApiService.loginAsAdmin(credentials);

  await context.addCookies([
    {
      name: "Authorization",
      value: token,
      domain: "anatoly-karpovich.github.io",
      path: "/aqa-course-project",
      expires: -1,
      httpOnly: false,
      secure: false,
      sameSite: "Lax",
    },
  ]);

  await context.storageState({ path: "src/.auth/user.json" });
});
