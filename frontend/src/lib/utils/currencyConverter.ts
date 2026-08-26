import Big from "big.js";
import type { SupportedCurrencies } from "../types/types";

const RATES = {
  EUR: "1",
  USD: "1.1664",
} as const;

// convert an amount from one currency to another
export function currencyConverter(
  amount: number,
  from: keyof typeof SupportedCurrencies,
  to: keyof typeof SupportedCurrencies,
) {
  return Number(
    new Big(amount).div(RATES[from]).times(RATES[to]).toFixed(2),
  );
}
