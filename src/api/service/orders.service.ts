import { OrdersApi } from "api/api/orders.api";
import { STATUS_CODES } from "data/statusCodes";
import { IOrderCreateBody, IOrderFromResponse, IOrderUpdateBody } from "data/types/order.types";
import { CustomersApiService } from "api/service/customer.service";
import { ProductsApiService } from "api/service/products.service";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class OrdersApiService {
  constructor(
    private ordersApi: OrdersApi,
    private productsApiService?: ProductsApiService,
    private customersApiService?: CustomersApiService,
  ) {}

  async create(token: string, customerId: string, productId: string[]): Promise<IOrderFromResponse> {
    const payload: IOrderCreateBody = {
      customer: customerId,
      products: productId,
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

  async delete(token: string, id: string) {
    const res = await this.ordersApi.delete(token, id);
    validateResponse(res, { status: STATUS_CODES.DELETED });
  }

  async fullDelete(
    token: string,
    payload: {
      orderId: string;
      productIds?: string[];
      customerId?: string;
    },
  ) {
    if (!this.productsApiService || !this.customersApiService) {
      throw new Error("OrdersApiService.fullDelete requires productsApiService and customersApiService");
    }

    await this.delete(token, payload.orderId);

    const deletions: Array<Promise<void>> = [];
    if (payload.productIds?.length) {
      deletions.push(
        Promise.all(payload.productIds.map((id) => this.productsApiService!.delete(token, id))).then(() => undefined),
      );
    }
    if (payload.customerId) {
      deletions.push(this.customersApiService.delete(token, payload.customerId));
    }

    await Promise.all(deletions);
  }

  async update(token: string, id: string, payload: IOrderUpdateBody): Promise<IOrderFromResponse> {
    const res = await this.ordersApi.update(token, id, payload);
    validateResponse(res, { status: STATUS_CODES.OK });
    return res.body.Order;
  }
}
