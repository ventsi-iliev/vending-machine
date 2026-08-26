import { generateProducts } from "./products.js";
import type { Product } from "./types.js";

export class Storage {
  private readonly products: Array<Product> = generateProducts();

  getProducts() {
    return this.products;
  }
}

export const storage = new Storage();
