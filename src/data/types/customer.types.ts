import { COUNTRY } from "data/salesPortal/country";
import { ID, ICreatedOn, SortOrder, IResponseFields } from "./core.types";

type Country = keyof typeof COUNTRY;

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

export interface ICustomerInTable
  extends Pick<ICustomer, "email" | "name" | "country">, ICreatedOn {}

export interface ICustomerDetails extends Required<ICustomer>, ICreatedOn {}

export interface ICustomerFromResponse
  extends Required<ICustomer>, ICreatedOn, ID {}
export interface ICustomerResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomersResponse extends IResponseFields {
  Customer: ICustomerFromResponse;
}

export interface ICustomerSortedResponse extends ICustomerResponse {
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
