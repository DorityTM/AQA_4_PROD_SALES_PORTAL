import { ORDER_STATUS } from "data/salesPortal/order-status";
import { TAGS } from "data/tags";
import { ICustomerFromResponse } from "data/types/customer.types";
import { IProductFromResponse } from "data/types/product.types";
import { test, expect } from "fixtures";
import { CreateOrderModal } from "ui/pages/orders/createOrderModal.page";

test.describe("[UI][Orders][Create Order]", async () => {
  let token = "";
  let customer: ICustomerFromResponse;

  test.beforeEach(async ({ ordersListPage, customersApiService, cleanup }) => {
    token = await ordersListPage.getAuthToken();
    customer = await customersApiService.create(token);
    cleanup.addCustomer(customer._id);

    await ordersListPage.open("#/orders");
    await ordersListPage.waitForOpened();
  });

  test(
    "Create order with 1 product",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.REGRESSION] },
    async ({ ordersListPage, cleanup, productsApiService }) => {
      const product = await productsApiService.create(token);
      cleanup.addProduct(product._id);
      await ordersListPage.clickCreateOrderButton();
      await ordersListPage.createOrderModal.createOrder(customer.name, [product.name]);
      await ordersListPage.waitForOpened();
      const tableData = await ordersListPage.getTableData();
      const createdOrder = tableData[0]!;
      cleanup.addOrder(createdOrder.orderId);
      expect(createdOrder.email).toBe(customer.email);
      expect(createdOrder.price).toBe(product.price);
      expect(createdOrder.status).toBe(ORDER_STATUS.DRAFT);
    },
  );

  test(
    "Create order with 5 product",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.REGRESSION] },
    async ({ ordersListPage, cleanup, productsApiService }) => {
      const products: IProductFromResponse[] = [];
      for (let i = 0; i < 5; i++) {
        const product = await productsApiService.create(token);
        cleanup.addProduct(product._id);
        products.push(product);
      }
      await ordersListPage.clickCreateOrderButton();
      await ordersListPage.createOrderModal.createOrder(
        customer.name,
        products.map((p) => p.name),
      );
      await ordersListPage.waitForOpened();
      const tableData = await ordersListPage.getTableData();
      const createdOrder = tableData[0]!;
      cleanup.addOrder(createdOrder.orderId);
      expect(createdOrder.email).toBe(customer.email);
      expect(createdOrder.price).toBe(products.reduce((sum: number, p) => sum + p.price, 0));
      expect(createdOrder.status).toBe(ORDER_STATUS.DRAFT);
    },
  );

  test(
    "Check remove product from order before creation",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.REGRESSION] },
    async ({ page, ordersListPage, cleanup, productsApiService }) => {
      const createOrderModal = new CreateOrderModal(page);
      const products: IProductFromResponse[] = [];
      for (let i = 0; i < 2; i++) {
        const product = await productsApiService.create(token);
        cleanup.addProduct(product._id);
        products.push(product);
      }
      await ordersListPage.clickCreateOrderButton();
      await createOrderModal.waitForOpened();
      await createOrderModal.selectCustomer(customer.name);
      await createOrderModal.selectProduct(0, products[0]!.name);
      await createOrderModal.clickAddProductButton();
      await createOrderModal.selectProduct(1, products[1]!.name);
      let totalPrice = +(await createOrderModal.totalPrice.innerText()).replace("$", "");
      expect(totalPrice).toBe(products.reduce((sum: number, p) => sum + p.price, 0));
      await createOrderModal.deleteProduct(0);
      totalPrice = +(await createOrderModal.totalPrice.innerText()).replace("$", "");
      expect(totalPrice).toBe(products[1]!.price);
      await createOrderModal.clickCreate();
      await ordersListPage.waitForOpened();
      const tableData = await ordersListPage.getTableData();
      const createdOrder = tableData[0]!;
      cleanup.addOrder(createdOrder.orderId);
      expect(createdOrder.email).toBe(customer.email);
      expect(createdOrder.price).toBe(products[1]!.price);
      expect(createdOrder.status).toBe(ORDER_STATUS.DRAFT);
    },
  );

  for (const testData of [
    { name: "cancel", clickButton: (modal: CreateOrderModal) => modal.clickCancel() },
    { name: "close", clickButton: (modal: CreateOrderModal) => modal.clickClose() },
  ]) {
    test(
      `Should close modal whith ${testData.name} button`,
      { tag: [TAGS.UI, TAGS.ORDERS, TAGS.REGRESSION] },
      async ({ ordersListPage, cleanup, productsApiService, page }) => {
        let tableData = await ordersListPage.getTableData();
        const firstOrder = tableData[0]!;
        const createOrderModal = new CreateOrderModal(page);
        const product = await productsApiService.create(token);
        cleanup.addProduct(product._id);
        await ordersListPage.clickCreateOrderButton();
        await createOrderModal.waitForOpened();
        await createOrderModal.selectCustomer(customer.name);
        await createOrderModal.selectProduct(0, product.name);
        await testData.clickButton(createOrderModal);
        await createOrderModal.waitForClosed();
        await ordersListPage.waitForOpened();
        tableData = await ordersListPage.getTableData();
        expect(tableData[0]!.orderId).toBe(firstOrder.orderId);
      },
    );
  }
});
