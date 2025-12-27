import { TAGS } from "data/tags";
import { test } from "fixtures";

test.describe("[UI][Orders][Modals]", () => {
  let token = "";

  test.beforeAll(async ({ loginApiService }) => {
    token = await loginApiService.loginAsAdmin();
  });

  test.afterEach(async ({ ordersApiService }) => {
    if (token) await ordersApiService.fullDelete(token);
  });

  test(
    "Process order on Process Confirmation modal",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.REGRESSION] },
    async ({ ordersApiService, orderDetailsPage }) => {
      const order = await ordersApiService.createOrderWithDelivery(token, 1);

      await orderDetailsPage.openByOrderId(order._id);
      await orderDetailsPage.waitForOpened();

      await orderDetailsPage.processOrder();
    },
  );

  test(
    "Cancel order on Cancel Confirmation modal",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.REGRESSION] },
    async ({ ordersApiService, orderDetailsPage }) => {
      const created = await ordersApiService.createOrderWithDelivery(token, 1);
      const orderId = created._id;

      await orderDetailsPage.openByOrderId(orderId);
      await orderDetailsPage.waitForOpened();

      await orderDetailsPage.cancelOrder();
    },
  );

  test(
    "Reopen order on Reopen Confirmation modal",
    { tag: [TAGS.UI, TAGS.ORDERS, TAGS.REGRESSION] },
    async ({ ordersApiService, orderDetailsPage }) => {
      const created = await ordersApiService.createCanceledOrder(token, 2);
      const orderId = created._id;

      await orderDetailsPage.openByOrderId(orderId);
      await orderDetailsPage.waitForOpened();

      await orderDetailsPage.reopenOrder();
    },
  );
});
