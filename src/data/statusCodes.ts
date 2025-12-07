export enum STATUS_CODES {
  OK = 200,
  CREATED = 201,
  DELETED = 204,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
  CONFLICT = 409,
  SERVER_ERROR = 500,
}

export const ERROR_MESSAGE = {
  BAD_REQUEST: "Incorrect request body",
  UNAUTHORIZED: "Not authorized",
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
  PRODUCT_ALREADY_EXISTS: (name: string) => `Product with name '${name}' already exists`,
};
