import { test as base, expect } from "@playwright/test";
import { HomePage } from "ui/pages/home.page";
// import { LoginPage } from "ui/pages/login.page";
// import { HomePage } from "ui/pages/home.page";
// import { AddNewProductPage } from "ui/pages/products/addNewProduct.page";
// import { ProductsListPage } from "ui/pages/products/productsList.page";
// import { EditProductPage } from "ui/pages/products/editProduct.page";
// import { ProductDeleteModal } from "ui/pages/products/delete.modal";
// import { AddNewProductUIService } from "ui/service/addNewProduct.ui-service";
// import { HomeUIService } from "ui/service/home.ui-service";
// import { LoginUIService } from "ui/service/login.ui-service";
// import { ProductsListUIService } from "ui/service/productsList.ui-service";
// import { EditProductUIService } from "ui/service/editProduct.ui-service";
// import { AddNewCustomerPage } from "ui/pages/customers";
// import { AddNewCustomerUIService } from "ui/service/addNewCustomer.ui-service";
// import { CustomersListUIService } from "ui/service/customersList.ui-service";
// import { CustomersListPage } from "ui/pages/customers/customersList.page";

export interface IPages {
  //   //pages
  homePage: HomePage;
  //   productsListPage: ProductsListPage;
  //   addNewProductPage: AddNewProductPage;
  //   editProductPage: EditProductPage;
  //   loginPage: LoginPage;
  //   productDeleteModal: ProductDeleteModal;
  //   addNewCustomerPage: AddNewCustomerPage;
  //   customersListPage: CustomersListPage;
  //   //ui-services
  //   homeUIService: HomeUIService;
  //   productsListUIService: ProductsListUIService;
  //   addNewProductUIService: AddNewProductUIService;
  //   editProductUIService: EditProductUIService;
  //   loginUIService: LoginUIService;
  //   addNewCustomerUIService: AddNewCustomerUIService;
  //   customersListUIService: CustomersListUIService;
}

export const test = base.extend<IPages>({
  //pages
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  //   productsListPage: async ({ page }, use) => {
  //     await use(new ProductsListPage(page));
  //   },
  //   addNewProductPage: async ({ page }, use) => {
  //     await use(new AddNewProductPage(page));
  //   },
  //   editProductPage: async ({ page }, use) => {
  //     await use(new EditProductPage(page));
  //   },
  //   loginPage: async ({ page }, use) => {
  //     await use(new LoginPage(page));
  //   },

  //   customersListPage: async ({ page }, use) => {
  //     await use(new CustomersListPage(page));
  //   },

  //   addNewCustomerPage: async ({ page }, use) => {
  //     await use(new AddNewCustomerPage(page));
  //   },

  //     //ui-services
  //   homeUIService: async ({ page }, use) => {
  //     await use(new HomeUIService(page));
  //   },

  //   productsListUIService: async ({ page }, use) => {
  //     await use(new ProductsListUIService(page));
  //   },

  //   addNewProductUIService: async ({ page }, use) => {
  //     await use(new AddNewProductUIService(page));
  //   },

  //   editProductUIService: async ({ page }, use) => {
  //     await use(new EditProductUIService(page));
  //   },

  //   addNewCustomerUIService: async ({ page }, use) => {
  //     await use(new AddNewCustomerUIService(page));
  //   },

  //   customersListUIService: async ({ page }, use) => {
  //     await use(new CustomersListUIService(page));
  //   },

  //   loginUIService: async ({ page }, use) => {
  //     await use(new LoginUIService(page));
  //   },
});

export { expect };
