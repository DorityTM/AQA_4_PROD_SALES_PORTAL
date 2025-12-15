import { CustomersApiService } from "api/service/customer.service";
import { ProductsApiService } from "api/service/products.service";

export interface IOrderTestData {
  customerId: string;
  productIds: string[];
  cleanup: () => Promise<void>;
}

interface ICreateOrderTestDataParams {
  token: string;
  customersApiService: CustomersApiService;
  productsApiService: ProductsApiService;
  productsCount: number;
}

export async function createOrderTestData({
  token,
  customersApiService,
  productsApiService,
  productsCount,
}: ICreateOrderTestDataParams): Promise<IOrderTestData> {
  const customer = await customersApiService.create(token);

  const products = [];
  for (let i = 0; i < productsCount; i++) {
    const product = await productsApiService.create(token);
    products.push(product);
  }

  const customerId = customer._id;
  const productIds = products.map((product) => product._id);

  return {
    customerId,
    productIds,
    async cleanup() {
      await customersApiService.delete(token, customerId);
      await Promise.all(productIds.map((id) => productsApiService.delete(token, id)));
    },
  };
}
