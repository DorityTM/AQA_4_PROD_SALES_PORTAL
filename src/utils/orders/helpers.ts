import { IOrderFromResponse } from "data/types/order.types";

export const productIdsOf = (order: IOrderFromResponse): string[] => order.products.map((p) => p._id);

export const calcTotal = (order: IOrderFromResponse): number =>
  order.products.reduce((sum: number, p) => sum + p.price, 0);
