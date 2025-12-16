export class EntitiesStore {
  private orders: string[] = [];
  private customers: string[] = [];
  private products: string[] = [];

  trackOrder(id: string | undefined | null) {
    if (id) this.orders.push(id);
  }

  trackCustomer(id: string | undefined | null) {
    if (id) this.customers.push(id);
  }

  trackProduct(id: string | undefined | null) {
    if (id) this.products.push(id);
  }

  trackProducts(ids: Array<string | undefined | null>) {
    ids.forEach((id) => this.trackProduct(id));
  }

  getOrderIds(): string[] {
    return [...this.orders];
  }

  getCustomerIds(): string[] {
    return [...this.customers];
  }

  getProductIds(): string[] {
    return [...this.products];
  }

  clear() {
    this.orders = [];
    this.customers = [];
    this.products = [];
  }
}
