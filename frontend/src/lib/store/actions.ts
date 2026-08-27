import { atom } from "jotai";
import Big from "big.js";
import { currencyConverter } from "../utils/currencyConverter";
import { parseNumber } from "../utils/parseNumber";
import type { Product, SupportedCurrencies } from "../types/types";
import {
  availableAmountAtom,
  boughtItemAtom,
  changeAtom,
  COIN_DENOMINATIONS,
  insertedAmountAtom,
  itemsAtom,
  MAX_PRODUCT_QUANTITY,
  returnedAmountAtom,
  selectedCurrencyAtom,
  selectedItemAtom,
} from "./atoms";

const toMoney = (amount: number) => new Big(amount).round(2).toNumber();

export type ProductDraft = Pick<Product, "name" | "price" | "quantity" | "image">;

export const selectItemAtom = atom(null, (get, set, id: string) => {
  const items = get(itemsAtom);
  set(selectedItemAtom, items.find((item) => item.id === id) ?? null);
});

export const clearSelectionAtom = atom(null, (_get, set) => {
  set(selectedItemAtom, null);
});

export const selectCurrencyAtom = atom(
  null,
  (get, set, currency: keyof typeof SupportedCurrencies) => {
    const previousCurrency = get(selectedCurrencyAtom);
    if (currency === previousCurrency || get(insertedAmountAtom) > 0) return;

    set(availableAmountAtom, (prev) =>
      currencyConverter(prev, previousCurrency, currency),
    );
    set(itemsAtom, (items) =>
      items.map((item) => ({
        ...item,
        price: currencyConverter(item.price, previousCurrency, currency),
      })),
    );
    set(selectedItemAtom, (item) =>
      item
        ? {
            ...item,
            price: currencyConverter(item.price, previousCurrency, currency),
          }
        : null,
    );
    set(selectedCurrencyAtom, currency);
    set(boughtItemAtom, { name: "", image: "" });
    set(changeAtom, 0);
    set(returnedAmountAtom, 0);
  },
);

export const insertCoinAtom = atom(null, (get, set, coin: number) => {
  const currency = get(selectedCurrencyAtom);
  const acceptedCoins: readonly number[] = COIN_DENOMINATIONS[currency];
  const nextAmount = toMoney(get(insertedAmountAtom) + coin);

  if (!acceptedCoins.includes(coin) || nextAmount > get(availableAmountAtom)) {
    return;
  }

  set(insertedAmountAtom, nextAmount);
  set(returnedAmountAtom, 0);
  set(changeAtom, 0);
});

export const returnMoneyAtom = atom(null, (get, set) => {
  set(returnedAmountAtom, get(insertedAmountAtom));
  set(insertedAmountAtom, 0);
  set(changeAtom, 0);
  set(boughtItemAtom, { name: "", image: "" });
});

export const buyItemAtom = atom(null, (get, set, id: string) => {
  const selectedItem = get(selectedItemAtom);
  const availableAmount = get(availableAmountAtom);
  const amount = get(insertedAmountAtom);
  const quantity = parseNumber(selectedItem?.quantity ?? 0);

  if (!selectedItem || selectedItem.id !== id || quantity <= 0) return;
  if (selectedItem.price > amount || amount > availableAmount) return;

  set(itemsAtom, (items) =>
    items.map((item) =>
      item.id === id ? { ...item, quantity: quantity - 1 } : item,
    ),
  );
  set(boughtItemAtom, {
    image: selectedItem.image,
    name: selectedItem.name,
  });
  set(availableAmountAtom, toMoney(availableAmount - selectedItem.price));
  set(insertedAmountAtom, 0);
  set(changeAtom, toMoney(amount - selectedItem.price));
  set(returnedAmountAtom, 0);
  set(selectedItemAtom, null);
});

export const addProductAtom = atom(null, (get, set, draft: ProductDraft) => {
  const quantity = parseNumber(draft.quantity);

  if (
    !draft.name.trim() ||
    draft.price <= 0 ||
    quantity < 0 ||
    quantity > MAX_PRODUCT_QUANTITY
  ) {
    return false;
  }

  set(itemsAtom, [
    ...get(itemsAtom),
    {
      ...draft,
      id: globalThis.crypto.randomUUID(),
      name: draft.name.trim(),
      price: toMoney(draft.price),
      quantity,
    },
  ]);
  return true;
});

export const updateProductAtom = atom(
  null,
  (get, set, product: Product) => {
    const quantity = parseNumber(product.quantity);

    if (
      !product.name.trim() ||
      product.price <= 0 ||
      quantity < 0 ||
      quantity > MAX_PRODUCT_QUANTITY
    ) {
      return false;
    }

    const updated = {
      ...product,
      name: product.name.trim(),
      price: toMoney(product.price),
      quantity,
    };
    set(
      itemsAtom,
      get(itemsAtom).map((item) => (item.id === product.id ? updated : item)),
    );
    set(selectedItemAtom, (item) => (item?.id === product.id ? updated : item));
    return true;
  },
);

export const deleteProductAtom = atom(null, (get, set, id: string) => {
  set(
    itemsAtom,
    get(itemsAtom).filter((item) => item.id !== id),
  );
  if (get(selectedItemAtom)?.id === id) {
    set(selectedItemAtom, null);
  }
});
