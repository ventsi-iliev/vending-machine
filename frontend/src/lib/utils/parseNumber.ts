export function parseNumber(val: string | number) {
  try {
    const toNum = Number(val);

    if (!Number.isNaN(toNum)) {
      return toNum;
    } else {
      throw new Error("Invalid coercion.");
    }
  } catch (error) {
    throw error;
  }
}
