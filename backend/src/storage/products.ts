import { faker } from "@faker-js/faker";
import type { Product } from "./types.js";

const PRODUCT_IMAGES = [
  "01-cola-can",
  "02-lemon-soda-can",
  "03-energy-drink",
  "04-iced-tea-can",
  "05-water-bottle",
  "06-orange-juice",
  "07-potato-chips",
  "08-pretzels",
  "09-chocolate-bar",
  "10-protein-bar",
  "11-chewing-gum",
  "12-mixed-nuts",
] as const;

const generateUniquePrices = (count: number) => {
  const prices = new Set<number>();

  while (prices.size < count) {
    prices.add(faker.number.int({ min: 50, max: 500 }) / 100);
  }

  return [...prices];
};

export const generateProducts = (): Product[] => {
  const prices = generateUniquePrices(PRODUCT_IMAGES.length);

  return PRODUCT_IMAGES.map((image, index) => ({
    id: faker.string.uuid(),
    name: faker.commerce.productName(),
    quantity: faker.number.int({ min: 0, max: 15 }),
    image,
    price: prices[index]!,
  }));
};
