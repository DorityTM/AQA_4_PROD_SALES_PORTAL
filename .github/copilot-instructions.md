# Copilot instructions (AQA_4_PROD_SALES_PORTAL)

## Big picture
- This repo is a Playwright + TypeScript test framework with **API + UI** coverage.
- Tests live in `src/tests/` and are split by type: `src/tests/api/` vs `src/tests/ui/`.
- Core layers:
  - API: `src/api/api/` (endpoint wrappers) + `src/api/service/` (business flows/facades)
  - UI: `src/ui/pages/` (Page Objects) + `src/ui/service/` (higher-level UI flows)
  - Data: `src/data/` (types, JSON schemas, generators, DDT case tables)

## Developer workflows
- Install deps: `npm ci` (CI) or `npm install`, then `npx playwright install`.
- Env files:
  - Default loads `.env`; set `TEST_ENV=dev` to load `.env.dev` (see `playwright.config.ts`).
  - Required vars are read from `src/config/env.ts` (`SALES_PORTAL_URL`, `SALES_PORTAL_API_URL`, `USER_NAME`, `USER_PASSWORD`, plus `MANAGER_IDS` as JSON).
- Common commands (see `package.json`):
  - `npm run test:api` / `npm run test:ui`
  - `npm run test:dev` (loads `.env.dev`)
  - `npm run allure-report-open` / `npm run html-report-open`

## Playwright projects + auth
- Playwright projects are defined in `playwright.config.ts`.
- UI tests run under project `sales-portal-ui` and use `storageState: "src/.auth/user.json"`.
- The `setup` project generates this state in `src/tests/ui/auth.setup.ts` by logging in with `credentials`.

## How tests are written here
- Prefer importing fixtures instead of constructing clients manually:
  - API-only: `import { test, expect } from "fixtures/api.fixture"`
  - UI-only pages/services: `import { test, expect } from "fixtures/pages.fixture"`
  - Mixed UI+API: `import { test, expect } from "fixtures"` (merges UI + API fixtures via `src/fixtures/index.ts`).
- API tests commonly use DDT case tables from `src/data/salesPortal/**`.
  - Example pattern: `src/data/salesPortal/orders/createDeliveryDDT.ts` exports `*_POSITIVE_CASES` and `*_NEGATIVE_CASES` arrays; tests loop them (see `src/tests/api/orders/delivery.spec.ts`).
- Tagging uses the `TAGS` enum in `src/data/tags.ts` and is passed via Playwright `test(..., { tag: [...] }, ...)`.

## Validation + schemas
- Use `validateResponse()` from `src/utils/validation/validateResponse.utils.ts` to assert status/IsSuccess/ErrorMessage.
- When a JSON schema exists, pass it to `validateResponse({ schema: ... })`.
  - Schemas live under `src/data/schemas/**` (domain folders: products/customers/orders/delivery/users).

## Cleanup conventions (important)
- API fixture provides a per-test `cleanup` registry that auto-deletes tracked entities in teardown (see `src/fixtures/api.fixture.ts`).
- If a UI test creates data via API services, activate teardown by touching the fixture:
  - Pattern used in repo: `test.beforeEach(async ({ cleanup }) => { void cleanup; });`

## Project-specific TypeScript conventions
- TS path aliases assume `baseUrl: "src"` (see `tsconfig.json`), so imports are typically absolute like `data/...`, `api/...`, `ui/...`.
- With `module: nodenext`, some internal imports intentionally use a `.js` suffix (example: `utils/report/logStep.utils.js`); keep this style when adding new decorator usage.

## Reporting/notifications
- Allure is configured in `playwright.config.ts`. CI also posts a Telegram notification in `src/config/global.teardown.ts` (only when `process.env.CI` is set).
