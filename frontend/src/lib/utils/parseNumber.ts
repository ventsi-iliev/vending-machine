import Big from "big.js";

export function parseNumber(val: string | number) {
  try {
    return new Big(val).toNumber();
  } catch {
    throw new Error("Invalid coercion.");
  }
}
