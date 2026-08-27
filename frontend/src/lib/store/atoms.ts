import { atom } from "jotai";
import type { Product, SupportedCurrencies } from "../types/types";

export const AVAILABLE_AMOUNT = 500;
export const BACKEND = "/api";
export const MAX_PRODUCT_QUANTITY = 15;
export const COIN_DENOMINATIONS = {
  EUR: [0.01, 0.02, 0.05, 0.1, 0.2, 0.5, 1, 2],
  USD: [0.01, 0.05, 0.1, 0.25, 0.5, 1],
} as const;

export type AjaxStatus = "initial" | "loading" | "error" | "success";

export const itemsAtom = atom<Array<Product>>([]);
export const selectedItemAtom = atom<Product | null>(null);
export const boughtItemAtom = atom<{ name: string; image: string }>({
  name: "",
  image: "",
});
export const selectedCurrencyAtom = atom<keyof typeof SupportedCurrencies>(
  "EUR",
);
export const availableAmountAtom = atom(AVAILABLE_AMOUNT);
export const insertedAmountAtom = atom(0);
export const changeAtom = atom(0);
export const returnedAmountAtom = atom(0);
export const ajaxStatusAtom = atom<AjaxStatus>("initial");
export const apiMessageAtom = atom("");

export const leftoverCreditAtom = atom((get) =>
  Number((get(availableAmountAtom) - get(insertedAmountAtom)).toFixed(2)),
);
