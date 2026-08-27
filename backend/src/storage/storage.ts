import { generateProducts } from "./products.js";
export class Storage {
  getProducts() {
    return generateProducts();
  }
}

export const storage = new Storage();
