export enum NOTIFICATIONS {
  PRODUCT_CREATED = "Product was successfully created",
  PRODUCT_DELETED = "Product was successfully deleted",
  PRODUCT_UPDATED = "Product was successfully updated",

  CUSTOMER_CREATED = "Customer was successfully created",
  CUSTOMER_DELETED = "Customer was successfully deleted",
  CUSTOMER_UPDATED = "Customer was successfully updated",

  ORDER_PROCESSED = "Order processing was successfully started",
  ORDER_CANCELED = "Order was successfully canceled",
  ORDER_REOPENED = "Order was successfully reopened",
  ORDER_CREATED = "Order was successfully created",
  ORDER_NOT_CREATED = "Failed to create an order. Please try again later",
}

export enum NOTIFICATIONS_TYPES {
  ASSIGNED = "assigned",
  STATUS_CHANGED = "statusChanged",
  CUSTOMER_CHANGED = "customerChanged",
  PRODUCTS_CHANGED = "productsChanged",
  DELIVERY_UPDATED = "deliveryUpdated",
  PRODUCTS_DELIVERED = "productsDelivered",
  MANAGER_CHANGED = "managerChanged",
  COMMENT_ADDED = "commentAdded",
  COMMENT_DELETED = "commentDeleted",
  NEW_ORDER = "newOrder",
  UNASSIGNED = "unassigned",
}
