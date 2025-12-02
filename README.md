# Sales Portal Test Automation Framework

[![Playwright](https://img.shields.io/badge/Playwright-1.57.0-green.svg)](https://playwright.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.3-blue.svg)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Latest-green.svg)](https://nodejs.org/)

A comprehensive test automation framework for a Sales Portal application, implementing both API and UI testing using Playwright and TypeScript.

## 📖 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Setup](#setup)
- [Configuration](#configuration)
- [Running Tests](#running-tests)
- [Test Projects](#test-projects)
- [Reporting](#reporting)
- [Code Quality](#code-quality)
- [CI/CD](#cicd)
- [Contributing](#contributing)

## 🎯 Overview

This project is a production-ready test automation framework designed to test a Sales Portal application. It covers comprehensive testing scenarios for:

- **Products Management** - Create, read, update, delete product operations
- **Customers Management** - Customer lifecycle management
- **Orders Management** - Order processing and tracking
- **Authentication & Authorization** - User login and role-based access

The framework supports both API-level testing for backend validation and UI testing for end-to-end user workflows.

## ✨ Features

- **Dual Testing Approach**: API and UI test coverage
- **Page Object Model**: Structured UI automation with reusable components
- **API Service Layer**: Clean separation of API operations and business logic
- **Test Fixtures**: Reusable test data generation using Faker.js
- **Schema Validation**: JSON schema validation for API responses
- **Parallel Execution**: Multi-worker test execution for faster feedback
- **Multiple Browsers**: Chrome, Firefox, Safari support
- **Visual Testing**: Screenshot comparison and video recording
- **Test Tagging**: Organized test execution with smoke, regression tags
- **Allure Reporting**: Rich test reports with detailed analytics
- **Code Quality**: ESLint, Prettier, and Husky pre-commit hooks
- **TypeScript**: Full type safety and IntelliSense support

## 🛠 Tech Stack

| Category              | Technology              |
| --------------------- | ----------------------- |
| **Test Framework**    | Playwright              |
| **Language**          | TypeScript              |
| **Test Data**         | Faker.js                |
| **Schema Validation** | AJV                     |
| **Reporting**         | Allure, Playwright HTML |
| **Code Quality**      | ESLint, Prettier        |
| **Package Manager**   | npm                     |
| **CI/CD**             | Git Hooks (Husky)       |

## 📁 Project Structure

```
src/
├── api/                          # API Testing Layer
│   ├── api/                      # API endpoint implementations
│   │   └── login.api.ts          # Authentication API
│   ├── apiClients/              # HTTP clients
│   │   ├── baseApiClient.ts     # Abstract API client
│   │   ├── requestApi.ts        # Playwright request implementation
│   │   └── types.ts             # API client interfaces
│   └── service/                 # Business logic services
│       └── login.service.ts     # Login business operations
│
├── config/                      # Configuration files
│   ├── apiConfig.ts            # API endpoints configuration
│   └── env.ts                  # Environment variables
│
├── data/                       # Test data and schemas
│   ├── salesPortal/           # Domain-specific constants
│   │   ├── constants.ts       # Timeout constants
│   │   ├── country.ts         # Country enumerations
│   │   ├── roles.ts          # User roles
│   │   └── products/         # Product-related data
│   ├── schemas/               # JSON schemas for validation
│   │   ├── core.schema.ts    # Common schema patterns
│   │   ├── customers/        # Customer schemas
│   │   ├── login/           # Authentication schemas
│   │   └── products/        # Product schemas
│   └── types/               # TypeScript interfaces
│       ├── core.types.ts    # Common type definitions
│       ├── customer.types.ts # Customer interfaces
│       ├── order.types.ts   # Order interfaces
│       └── product.types.ts # Product interfaces
│
├── fixtures/                  # Test fixtures and utilities
│   ├── api.fixture.ts        # API test fixtures
│   ├── business.fixture.ts   # Business logic fixtures
│   ├── pages.fixture.ts      # Page object fixtures
│   └── index.ts             # Fixture aggregator
│
├── tests/                    # Test suites
│   ├── api/                 # API test cases
│   │   ├── customers/       # Customer API tests
│   │   ├── orders/         # Order API tests
│   │   └── products/       # Product API tests
│   └── ui/                 # UI test cases
│       └── sales-portal/   # Sales portal UI tests
│           ├── customers/  # Customer UI tests
│           ├── orders/    # Order UI tests
│           └── products/  # Product UI tests
│
├── ui/                      # UI Testing Layer
│   └── pages/              # Page Object Models
│       ├── base.page.ts    # Base page functionality
│       ├── base.modal.ts   # Base modal functionality
│       ├── login.page.ts   # Login page objects
│       ├── salesPortal.page.ts # Sales portal base page
│       ├── customers/      # Customer page objects
│       └── products/       # Product page objects
│
└── utils/                   # Utility functions
    ├── date.utils.ts       # Date manipulation utilities
    ├── enum.utils.ts       # Enum helper functions
    ├── queryParams.utils.ts # URL query parameter utilities
    ├── report/             # Reporting utilities
    │   └── logStep.utils.ts # Test step logging
    └── validation/         # Validation utilities
        ├── validateResponse.utils.ts # Response validation
        └── validateSchema.utils.ts   # Schema validation
```

## 🚀 Setup

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (v8 or higher)
- **Git**

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/DorityTM/AQA_4_PROD_SALES_PORTAL.git
   cd AQA_4_PROD_SALES_PORTAL
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Install Playwright browsers:**

   ```bash
   npx playwright install
   ```

4. **Set up environment variables:**
   ```bash
   cp .env.dist .env
   ```
   Edit `.env` file with your configuration:
   ```env
   USER_NAME=your_username
   USER_PASSWORD=your_password
   SALES_PORTAL_URL=https://your-sales-portal.com
   SALES_PORTAL_API_URL=https://your-api.com
   ```

## ⚙️ Configuration

### Environment Variables

| Variable               | Description              | Example                      |
| ---------------------- | ------------------------ | ---------------------------- |
| `USER_NAME`            | Login username           | admin@example.com            |
| `USER_PASSWORD`        | Login password           | secretPassword               |
| `SALES_PORTAL_URL`     | Frontend application URL | https://sales-portal.com     |
| `SALES_PORTAL_API_URL` | Backend API URL          | https://api.sales-portal.com |

### Playwright Configuration

The framework includes multiple test projects configured in `playwright.config.ts`:

- **setup**: Authentication and environment preparation
- **sales-portal-ui**: UI tests with authenticated state
- **api-tests**: API-only test execution
- **chromium**: Headless browser tests

## 🧪 Running Tests

### Available Commands

```bash
# Run all tests
npm test

# Run UI tests only
npm run test:ui

# Run tests in UI mode (interactive)
npm run ui-mode

# Run smoke tests
npm run test:ui:smoke

# Run regression tests
npm run test:ui:regression

# Build TypeScript
npm run build
```

### Test Projects

#### UI Tests

```bash
# Run specific UI project
npx playwright test --project=sales-portal-ui

# Run tests with specific tags
npx playwright test --grep "@smoke"
npx playwright test --grep "@regression"
```

#### API Tests

```bash
# Run API tests only
npx playwright test --project=api-tests

# Run specific API test suites
npx playwright test src/tests/api/products/
npx playwright test src/tests/api/customers/
```

### Test Tags

The framework uses a comprehensive tagging system:

- `@smoke` - Critical functionality tests
- `@regression` - Full regression test suite
- `@integration` - Integration tests
- `@api` - API-specific tests
- `@ui` - UI-specific tests
- `@e2e` - End-to-end workflows
- `@auth` - Authentication tests
- `@products` - Product management tests
- `@customers` - Customer management tests
- `@orders` - Order management tests

## 📊 Reporting

### HTML Reports

```bash
# Open latest HTML report
npm run html-report-open
```

### Allure Reports

```bash
# Generate and open Allure report
npm run allure-report-open

# Generate Allure report only
npm run allure-report
```

### Report Features

- **Test execution summary** with pass/fail statistics
- **Detailed test steps** with screenshots
- **Performance metrics** and timing data
- **Environment information** and configuration
- **Historical trends** and test stability analysis
- **Flaky test detection** and retry information

## 🔍 Code Quality

### Linting and Formatting

```bash
# Check code style
npm run format

# Fix code style issues
npm run format:fix

# Run ESLint
npm run lint

# Fix ESLint issues
npm run lint:fix

# Run Prettier
npm run prettier

# Fix Prettier formatting
npm run prettier:fix
```

### Pre-commit Hooks

The project includes Husky pre-commit hooks that automatically:

- Run tests before commit
- Format code with Prettier
- Lint code with ESLint
- Validate commit messages

## 🎨 Test Development Patterns

### Page Object Model

```typescript
// Example: Login Page Object
export class LoginPage extends SalesPortalPage {
  readonly emailInput = this.page.locator("#emailinput");
  readonly passwordInput = this.page.locator("#passwordinput");
  readonly loginButton = this.page.locator("button[type='submit']");

  @logStep("FILL LOGIN CREDENTIALS")
  async fillCredentials(credentials: Partial<ICredentials>) {
    if (credentials.username) await this.emailInput.fill(credentials.username);
    if (credentials.password)
      await this.passwordInput.fill(credentials.password);
  }
}
```

### API Service Pattern

```typescript
// Example: API Service
export class LoginService {
  constructor(private loginApi: LoginApi) {}

  @logStep("LOGIN AS ADMIN - API")
  async loginAsAdmin(customCredentials?: ICredentials) {
    const response = await this.loginApi.login(
      customCredentials ?? credentials,
    );
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
    });
    return response.headers["authorization"];
  }
}
```

### Test Data Generation

```typescript
// Example: Product Data Generation
export function generateProductData(params?: Partial<IProduct>): IProduct {
  return {
    name: faker.commerce.product() + faker.number.int({ min: 1, max: 100000 }),
    manufacturer: getRandomEnumValue(MANUFACTURERS),
    price: faker.number.int({ min: 1, max: 99999 }),
    amount: faker.number.int({ min: 0, max: 999 }),
    notes: faker.string.alphanumeric({ length: 250 }),
    ...params,
  };
}
```

## 🚀 CI/CD

### GitHub Actions Integration

The project is ready for CI/CD integration with support for:

- **Automated test execution** on push/PR
- **Multi-browser testing** in parallel
- **Test report generation** and publishing
- **Slack/email notifications** on test failures
- **Environment-specific testing** (dev, staging, prod)

### Docker Support

Consider adding Docker support for:

- **Consistent test environments** across different machines
- **Parallel execution** in containerized environments
- **CI/CD pipeline optimization**

## 🤝 Contributing

### Development Workflow

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/new-test-suite
   ```

2. **Write tests following the established patterns**

3. **Run quality checks:**

   ```bash
   npm run format:fix
   npm test
   ```

4. **Commit changes:**

   ```bash
   git commit -m "feat: add new test suite for order management"
   ```

5. **Push and create PR:**
   ```bash
   git push origin feature/new-test-suite
   ```

### Code Standards

- **TypeScript**: Full type safety required
- **ESLint**: Follow configured rules
- **Prettier**: Consistent code formatting
- **Test Documentation**: Clear test descriptions and steps
- **Error Handling**: Proper error messages and validation

## 📝 License

This project is licensed under the ISC License.

## 👥 Author

**Tatsiana Davidziuk** - [GitHub Profile](https://github.com/DorityTM)

---

## 🆘 Troubleshooting

### Common Issues

**Environment Setup:**

- Ensure all environment variables are properly configured in `.env`
- Verify network connectivity to test environments
- Check browser installation: `npx playwright install`

**Test Execution:**

- Clear test artifacts: `rm -rf test-results/ playwright-report/`
- Update dependencies: `npm update`
- Restart dev server if testing locally

**Reporting Issues:**

- Include test execution logs
- Provide environment details
- Share relevant configuration files

For additional support, please check the [Issues](https://github.com/DorityTM/AQA_4_PROD_SALES_PORTAL/issues) page.
