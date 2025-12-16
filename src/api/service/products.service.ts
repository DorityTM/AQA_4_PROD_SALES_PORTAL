import { ProductsApi } from "api/api/products.api";
import { generateProductData } from "data/salesPortal/products/generateProductData";
import { createProductSchema } from "data/schemas/products/create.schema";
import { STATUS_CODES } from "data/statusCodes";
import { IProduct, IProductFromResponse } from "data/types/product.types";
import { validateResponse } from "utils/validation/validateResponse.utils";

export class ProductsApiService {
  constructor(private productsApi: ProductsApi) {}

  async create(token: string, productData?: IProduct): Promise<IProductFromResponse> {
    const data = generateProductData(productData);
    const response = await this.productsApi.create(data, token);
    validateResponse(response, {
      status: STATUS_CODES.CREATED,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createProductSchema,
    });
    return response.body.Product;
  }

  async update(token: string, id: string, newProductData: IProduct): Promise<IProductFromResponse> {
    const data = generateProductData(newProductData);
    const response = await this.productsApi.update(id, data, token);
    validateResponse(response, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
      schema: createProductSchema,
    });
    return response.body.Product;
  }

  async delete(token: string, id: string) {
    const response = await this.productsApi.delete(id, token);
    validateResponse(response, {
      status: STATUS_CODES.DELETED,
    });
  }

  async deleteProducts(token: string, ids: string[]) {
    for (const id of ids) {
      await this.delete(token, id);
    }
  }

  async deleteAllProducts(token: string) {
    const productsResponse = await this.productsApi.getAll(token);
    validateResponse(productsResponse, {
      status: STATUS_CODES.OK,
      IsSuccess: true,
      ErrorMessage: null,
    });
    const products = productsResponse.body.Products;
    const ids = products.map((product) => product._id);
    await this.deleteProducts(token, ids);
  }
}
