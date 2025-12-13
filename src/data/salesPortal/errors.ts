export const RESPONSE_ERRORS = {
  PRODUCT_NOT_FOUND: (id: string) => `Product with id '${id}' wasn't found`,
  CONFLICT: (name: string) => `Product with name '${name}' already exists`,
  BAD_REQUEST: "Incorrect request body",
  UNAUTHORIZED: "Not authorized",
  CUSTOMER_MISSING: "Missing customer",
};
