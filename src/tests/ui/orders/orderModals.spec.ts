import { TAGS } from "data/tags";
import { test } from "fixtures";
import { OrderDetailsPage } from "ui/pages/orders";

test.describe("[UI][Orders][Modals]", () => {
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (token) await ordersApiService.fullDelete(token);
  });

  test.beforeEach(async ({ cleanup }) => {
    void cleanup;
  });

  test(
    "Process order on Process Confirmation modal",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.SMOKE] },
    async ({ loginApiService, ordersApiService, page }) => {
      const token = await loginApiService.loginAsAdmin();
      const order = await ordersApiService.createOrderWithDelivery(token, 1);

      const orderDetails = new OrderDetailsPage(page);
      await orderDetails.openByOrderId(order._id);
      await orderDetails.waitForOpened();

      await orderDetails.processOrder();
    },
  );

  test(
    "Cancel order on Cancel Confirmation modal",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.SMOKE] },
    async ({ loginApiService, ordersApiService, page }) => {
      const token = await loginApiService.loginAsAdmin();
      const created = await ordersApiService.createOrderWithDelivery(token, 1);
      const orderId = created._id;

      const orderDetails = new OrderDetailsPage(page);
      await orderDetails.openByOrderId(orderId);
      await orderDetails.waitForOpened();

      await orderDetails.cancelOrder();
    },
  );

  test(
    "Reopen order on Reopen Confirmation modal",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.SMOKE] },
    async ({ loginApiService, ordersApiService, page }) => {
      const token = await loginApiService.loginAsAdmin();
      const created = await ordersApiService.createCanceledOrder(token, 2);
      const orderId = created._id;

      const orderDetails = new OrderDetailsPage(page);
      await orderDetails.openByOrderId(orderId);
      await orderDetails.waitForOpened();

      await orderDetails.reopenOrder();
    },
  );
});
