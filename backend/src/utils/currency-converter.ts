import Big from "big.js";
import { SupportedCurrencies } from "../storage/types.js";

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
  return new Big(amount)
    .div(RATES[from])
    .times(RATES[to])
    .round(2)
    .toNumber();
}

// amount is already in `currency`, price is EUR
export function compareAmounts(
  providedAmount: number,
  amountToCompareWith: number,
  currency: keyof typeof SupportedCurrencies,
) {
  return new Big(providedAmount).gte(
    currencyConverter(
      amountToCompareWith,
      SupportedCurrencies.EUR,
      currency,
    ),
  );
}
