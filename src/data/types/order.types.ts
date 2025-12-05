import { ID, ICreatedOn, IResponseFields } from "./core.types";
import { ICustomerFromResponse } from "./customer.types";
import { IOrderProductFromResponse } from "./product.types";
import { ORDER_STATUS } from "../salesPortal/order-status";
import { DELIVERY_STATUS } from "../salesPortal/delivery-status";
import { IUser } from "./user.types";

// export type OrderStatus = "Draft" | "In Process" | "Partially Received" | "Received" | "Canceled";
// export type DeliveryStatus = "Pending" | "In Transit" | "Delivered" | "Failed";
//TODO: order schemas

export interface IOrderResponse extends IResponseFields {
  Order: IOrderFromResponse;
}

export interface IOrderFromResponse extends ICreatedOn, ID {
  status: ORDER_STATUS;
  customer: ICustomerFromResponse;
  products: IOrderProductFromResponse[];
  delivery: null | DELIVERY_STATUS;
  total_price: number;
  comments: string[];
  history: IOrderHistory[];
  assignedManager: null | IUser["_id"];
}
//TODO
//IOrderHistory contsins delivery status. Check on PROD valid values for delivery status
export interface IOrderHistory extends Omit<IOrderFromResponse, "comments" | "history" | "customer"> {
  customer: ICustomerFromResponse["_id"];
  changedOn: string;
  action: string;
}
