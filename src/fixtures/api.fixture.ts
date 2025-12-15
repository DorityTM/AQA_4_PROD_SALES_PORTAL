import { test as base, expect } from "@playwright/test";
import { CustomersApi } from "api/api/customers.api";
import { LoginApi } from "api/api/login.api";
import { RequestApi } from "api/apiClients/requestApi";
import { CustomersApiService } from "api/service/customer.service";
import { LoginService } from "api/service/login.service";
import { ProductsApi } from "api/api/products.api";
import { ProductsApiService } from "api/service/products.service";
import { OrdersApi } from "api/api/orders.api";
import { OrdersApiService } from "api/service/orders.service";
import { OrdersFacadeService } from "api/facades/ordersFacade.service";
export interface IApi {
  // api
  productsApi: ProductsApi;
  loginApi: LoginApi;
  customersApi: CustomersApi;
  ordersApi: OrdersApi;

  // services
  productsApiService: ProductsApiService;
  loginApiService: LoginService;
  customersApiService: CustomersApiService;
  ordersApiService: OrdersApiService;
  ordersFacadeService: OrdersFacadeService;

  // utils
  cleanup: {
    addOrder: (orderId: string) => void;
    addProduct: (id: string) => void;
    addCustomer: (id: string) => void;
  };
}

const test = base.extend<IApi>({
  //api
  productsApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new ProductsApi(apiClient);
    await use(api);
  },

  loginApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new LoginApi(apiClient);
    await use(api);
  },

  customersApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new CustomersApi(apiClient);
    await use(api);
  },

  ordersApi: async ({ request }, use) => {
    const apiClient = new RequestApi(request);
    const api = new OrdersApi(apiClient);
    await use(api);
  },

  //services
  productsApiService: async ({ productsApi }, use) => {
    await use(new ProductsApiService(productsApi));
  },
  customersApiService: async ({ customersApi }, use) => {
    await use(new CustomersApiService(customersApi));
  },
  loginApiService: async ({ loginApi }, use) => {
    await use(new LoginService(loginApi));
  },
  ordersApiService: async ({ ordersApi, productsApiService, customersApiService }, use) => {
    await use(new OrdersApiService(ordersApi, productsApiService, customersApiService));
  },
  ordersFacadeService: async ({ ordersApi, customersApiService, productsApiService }, use) => {
    await use(new OrdersFacadeService(ordersApi, customersApiService, productsApiService));
  },

  // per-test cleanup registry with automatic teardown
  cleanup: async ({ loginApiService, ordersApiService, productsApiService, customersApiService }, use) => {
    const state = {
      orders: new Set<string>(),
      products: new Set<string>(),
      customers: new Set<string>(),
    };

    await use({
      addOrder: (orderId: string) => state.orders.add(orderId),
      addProduct: (id: string) => state.products.add(id),
      addCustomer: (id: string) => state.customers.add(id),
    });

    const token = await loginApiService.loginAsAdmin();

    await Promise.all(
      Array.from(state.orders).map((orderId) => ordersApiService.deleteOrderAndEntities(token, orderId)),
    );
    await Promise.all(Array.from(state.products).map((id) => productsApiService.delete(token, id)));
    await Promise.all(Array.from(state.customers).map((id) => customersApiService.delete(token, id)));
  },
});

export { test, expect };
