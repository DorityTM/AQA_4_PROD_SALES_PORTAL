import { OrdersApi } from "api/api/orders.api";
import { orderFromResponseSchema } from "data/schemas/orders/order.schema";
import { ORDER_STATUS } from "data/salesPortal/order-status";
import { STATUS_CODES } from "data/statusCodes";
import { IOrderCreateBody, IOrderFromResponse } from "data/types/order.types";
import { validateResponse } from "utils/validation/validateResponse.utils";
import { CustomersApiService } from "api/service/customer.service";
import { generateDelivery } from "data/salesPortal/orders/generateDeliveryData";
import { ProductsApiService } from "api/service/products.service";
import { getOrderSchema } from "data/schemas/orders/get.schema";

export class OrdersApiService {
  constructor(
    private ordersApi: OrdersApi,
    private customerApiService: CustomersApiService,
    private productsApiService: ProductsApiService,
  ) {}

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

  async createOrderAndEntities(token: string, numberOfProducts: number) {
    const createdCustomer = await this.customerApiService.create(token);
    const orderData: IOrderCreateBody = {
      customer: createdCustomer._id,
      products: [],
    };
    for (let i = 0; i < numberOfProducts; i++) {
      const createdProduct = await this.productsApiService.create(token);
      orderData.products.push(createdProduct._id);
    }
    const response = await this.ordersApi.create(token, orderData);
    return response.body.Order;
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

  async deleteOrderAndEntities(token: string, orderId: string) {
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
    await this.delete(token, orderId);
    await this.customerApiService.delete(token, customerId);
    await this.productsApiService.deleteProducts(token, productIds);
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
  }
}
