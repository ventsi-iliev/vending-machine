export function parseNumber(val: string | number) {
  const toNum = Number(val);

  if (!Number.isNaN(toNum)) {
    return toNum;
  }

  throw new Error("Invalid coercion.");
}
