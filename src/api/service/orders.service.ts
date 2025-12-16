import { OrdersApi } from "api/api/orders.api";
import { orderFromResponseSchema } from "data/schemas/orders/order.schema";
import { ORDER_STATUS } from "data/salesPortal/order-status";
import { STATUS_CODES } from "data/statusCodes";
import { IOrderCreateBody, IOrderFromResponse, IOrderUpdateBody } from "data/types/order.types";
import { CustomersApiService } from "api/service/customer.service";
import { ProductsApiService } from "api/service/products.service";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { generateDelivery } from "data/salesPortal/orders/generateDeliveryData";
import { getOrderSchema } from "data/schemas/orders/get.schema";
import { EntitiesStore } from "api/service/stores/entities.store";

export class OrdersApiService {
  constructor(
    private ordersApi: OrdersApi,
    private productsApiService: ProductsApiService,
    private customersApiService: CustomersApiService,
    private entitiesStore: EntitiesStore = new EntitiesStore(),
  ) {}

  trackOrderId(id: string): void {
    this.entitiesStore.trackOrder(id);
  }

  trackCustomerId(id: string): void {
    this.entitiesStore.trackCustomer(id);
  }

  trackProductIds(ids: string[]): void {
    this.entitiesStore.trackProducts(ids);
  }

  async create(token: string, customerId: string, productIds: string[]): Promise<IOrderFromResponse> {
    const payload: IOrderCreateBody = {
      customer: customerId,
      products: productIds,
    };

    const response = await this.ordersApi.create(token, payload);

    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      // schema: createOrderSchema,
    });

    return response.body.Order;
  }

  async createOrderAndEntities(token: string, numberOfProducts: number): Promise<IOrderFromResponse> {
    const customersService = this.customersApiService;
    const productsService = this.productsApiService;

    const createdCustomer = await customersService.create(token);
    this.entitiesStore.trackCustomer(createdCustomer._id);

    const orderData: IOrderCreateBody = {
      customer: createdCustomer._id,
      products: [],
    };

    const createdProductIds: string[] = [];
    for (let i = 0; i < numberOfProducts; i++) {
      const createdProduct = await productsService.create(token);
      createdProductIds.push(createdProduct._id);
      orderData.products.push(createdProduct._id);
    }
    this.entitiesStore.trackProducts(createdProductIds);

    const response = await this.ordersApi.create(token, orderData);
    const order = response.body.Order;
    this.entitiesStore.trackOrder(order._id);
    return order;
  }

  async createOrderWithDelivery(token: string, numberOfProducts: number) {
    const createdOrder = await this.createOrderAndEntities(token, numberOfProducts);
    const orderWithDelivery = await this.ordersApi.addDelivery(createdOrder._id, generateDelivery(), token);
    return orderWithDelivery;
  }

  async createOrderInProcess(token: string, numberOfProducts: number) {
    const createdOrder = await this.createOrderWithDelivery(token, numberOfProducts);
    const order = await this.ordersApi.updateStatus(createdOrder.body.Order._id, ORDER_STATUS.PROCESSING, token);
    return order;
  }

  async createCanceledOrder(token: string, numberOfProducts: number) {
    const createdOrder = await this.createOrderWithDelivery(token, numberOfProducts);
    const order = await this.ordersApi.updateStatus(createdOrder.body.Order._id, ORDER_STATUS.CANCELED, token);
    return order;
  }

  async createPartiallyReceivedOrder(token: string, numberOfProducts: number) {
    const createdOrder = await this.createOrderInProcess(token, numberOfProducts);
    const order = await this.ordersApi.receiveProducts(
      createdOrder.body.Order._id,
      [createdOrder.body.Order.products[0]!._id],
      token,
    );
    return order;
  }

  async createReceivedOrder(token: string, numberOfProducts: number) {
    const createdOrder = await this.createOrderInProcess(token, numberOfProducts);
    const order = await this.ordersApi.receiveProducts(
      createdOrder.body.Order._id,
      createdOrder.body.Order.products.map((product) => product._id),
      token,
    );
    return order;
  }

  async delete(token: string, id: string) {
    const res = await this.ordersApi.delete(token, id);
    validateResponse(res, { status: STATUS_CODES.DELETED });
  }

  async update(token: string, id: string, payload: IOrderUpdateBody): Promise<IOrderFromResponse> {
    const res = await this.ordersApi.update(token, id, payload);
    validateResponse(res, { status: STATUS_CODES.OK });
    return res.body.Order;
  }

  async deleteOrderAndEntities(token: string, orderId: string): Promise<void> {
    // Backward-compatible cleanup by specific orderId
    const response = await this.ordersApi.getById(orderId, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: getOrderSchema,
    });
    const order = response.body.Order;
    const customerId = order.customer._id;
    const productIds = order.products.map((product) => product._id);

    // delete order first, then related entities
    await this.delete(token, orderId);
    if (customerId) {
      await this.customersApiService.delete(token, customerId);
    }
    if (productIds.length > 0) {
      await this.productsApiService.deleteProducts(token, productIds);
    }

    // keep store in sync to avoid double-deletes later
    this.entitiesStore.trackOrder(orderId);
    this.entitiesStore.trackCustomer(customerId);
    this.entitiesStore.trackProducts(productIds);
  }

  // New: full cleanup by using only token (for after hooks)
  async fullDelete(token: string): Promise<void> {
    const orders = this.entitiesStore.getOrderIds();
    const customers = this.entitiesStore.getCustomerIds();
    const products = this.entitiesStore.getProductIds();

    // 1) Delete orders first
    for (const orderId of orders) {
      try {
        await this.delete(token, orderId);
      } catch {
        // noop: best-effort cleanup
      }
    }

    // 2) Delete customers
    for (const customerId of customers) {
      try {
        await this.customersApiService.delete(token, customerId);
      } catch {
        // noop
      }
    }

    // 3) Delete products
    for (const productId of products) {
      try {
        await this.productsApiService.delete(token, productId);
      } catch {
        // noop
      }
    }

    this.entitiesStore.clear();
  }

  async addComment(token: string, orderId: string, text: string) {
    const response = await this.ordersApi.addComment(token, orderId, { text });
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: orderFromResponseSchema,
    });
    return response.body.Order;
  }

  async deleteComment(token: string, orderId: string, commentId: string) {
    const response = await this.ordersApi.deleteComment(token, orderId, commentId);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
    return response;
  }
}
