export const SupportedCurrencies = {
  EUR: "EUR",
  USD: "USD",
} as const;

export interface Product {
  id: string;
  name: string;
  quantity: string | number;
  image: string;
  price: number;
}
