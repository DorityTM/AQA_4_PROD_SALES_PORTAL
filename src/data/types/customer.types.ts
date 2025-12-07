import { COUNTRY } from "data/salesPortal/country";
import { ID, ICreatedOn, SortOrder, IResponseFields } from "./core.types";

export type Country = keyof typeof COUNTRY;

export interface ICustomer {
  email: string;
  name: string;
  country: COUNTRY;
  city: string;
  street: string;
  house: number;
  flat: number;
  phone: string;
  notes?: string;
}

export interface ICustomerInTable extends Pick<ICustomer, "email" | "name" | "country">, ICreatedOn {}

export interface ICustomerDetails extends Required<ICustomer>, ICreatedOn {}

export interface ICustomerFromResponse extends Required<ICustomer>, ICreatedOn, ID {}

export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
}

export interface ICustomerListResponse extends IResponseFields {
  Customers: ICustomerFromResponse[];
  total: number;
  page: number;
  limit: number;
  search: string;
  country: Country[];
  sorting: {
    sortField: CustomerSortField;
    sortOrder: SortOrder;
  };
}

export type CustomerSortField = "email" | "name" | "country" | "createdOn";

export interface IGetCustomersParams {
  country: Country[];
  search: string;
  sortField: CustomerSortField;
  sortOrder: SortOrder;
  page: number;
  limit: number;
}

export type CustomerTableHeader = "email" | "name" | "country" | "createdOn";

export interface ICreateCustomerCases {
  title: string;
  customerData: ICustomer;
}
export type ICustomerInvalidPayload = Omit<ICustomer, "country"> & {
  country: string;
};
