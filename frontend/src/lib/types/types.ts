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

export interface InputProps {
  id: string;
  placeholder: string;
  type: HTMLInputElement["type"];
  label: string;
  value: string;
  onChange: (val: string) => void;
  helperText: string;
  disabled?: boolean;
}
