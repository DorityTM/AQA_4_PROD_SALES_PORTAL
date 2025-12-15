import { ID, ICreatedOn, IResponseFields, SortOrder, ICaseApi } from "./core.types";
import { ICustomerFromResponse } from "./customer.types";
import { IOrderProductFromResponse, IProduct } from "./product.types";
import { ORDER_STATUS, ORDER_HISTORY_ACTIONS } from "../salesPortal/order-status";
import { IDeliveryInfo } from "../salesPortal/delivery-status";
import { IUser } from "./user.types";

export interface IOrderProduct extends IProduct {
  _id: string;
  received: boolean;
}
export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}

export interface IOrderHistoryResponse extends IResponseFields {
  history: IOrderHistory[];
}

export interface IOrderFromResponse extends ICreatedOn, ID {
  status: ORDER_STATUS;
  customer: ICustomerFromResponse;
  products: IOrderProductFromResponse[];
  total_price: number;
  delivery: null | IDeliveryInfo;
  comments: IComment[];
  history: IOrderHistory[];
  assignedManager: null | IUser["_id"];
}
export interface IOrderHistory extends Omit<IOrderFromResponse, "comments" | "history" | "customer" | "createdOn"> {
  customer: ICustomerFromResponse["_id"];
  changedOn: string;
  action: ORDER_HISTORY_ACTIONS;
}

export interface IOrderHistoryEntry {
  assignedManager: IUser | null;
  status: ORDER_HISTORY_ACTIONS;
  customer: string;
  products: IOrderProduct[];
  total_price: number;
  delivery: IDeliveryInfo | null;
  changedOn: string;
  action: ORDER_HISTORY_ACTIONS;
  performer: IUser | null;
}

export interface IComment extends ID {
  text: string;
  createdOn: string;
}

export interface IOrder {
  _id: string;
  status: ORDER_STATUS;
  customer: ICustomerFromResponse;
  products: IOrderProduct[];
  delivery: IDeliveryInfo | null;
  total_price: number;
  createdOn: string;
  comments: IComment[];
  history: IOrderHistoryEntry[];
  assignedManager: IUser | null;
}

export interface IOrdersResponse extends IResponseFields {
  orders: IOrderFromResponse[];
  limit: number;
  page: number;
  search: string;
  status: ORDER_STATUS[];
  total: number;
  sorting: { sortField: OrdersTableHeader; sortOrder: SortOrder };
}
export type OrdersTableHeader =
  | "orderNumber"
  | "email"
  | "price"
  | "delivery"
  | "status"
  | "assignedManager"
  | "createdOn";

export interface IOrderCreateBody {
  customer: string;
  products: string[];
}

export interface ICommentData {
  commentText: string;
  commentator: string;
  createdOn: string;
}

export interface ICreateOrderCase extends ICaseApi {
  productsCount: number;
}

export interface ICreateOrderNegativeCase extends ICaseApi {
  productsCount: number;
  orderData: Partial<IOrderCreateBody>;
}
