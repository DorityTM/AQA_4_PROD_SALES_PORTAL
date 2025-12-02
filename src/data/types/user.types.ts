import { ID, IResponseFields, ICreatedOn } from "./core.types";
import { ROLES } from "data/salesPortal/roles";

export interface IUser extends ID, ICreatedOn, IResponseFields {
  username: string;
  firstName: string;
  lastName: string;
  roles: ROLES[];
}
export interface IUserFromResponse extends ID, ICreatedOn, IResponseFields {
  username: string;
  firstName: string;
  lastName: string;
  roles: ROLES[];
}
