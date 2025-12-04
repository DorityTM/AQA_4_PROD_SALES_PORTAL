import { test as ui } from "./pages.fixture";
import { test as api } from "./api.fixture";
import { mergeTests, expect } from "@playwright/test";

const test = mergeTests(ui, api);

export { test, expect };
