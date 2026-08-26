import { useAtomValue, useSetAtom } from "jotai";
import type { Product } from "../../types/types";
import { concatenateStrings } from "../../utils/concatenateStrings";
import { parseNumber } from "../../utils/parseNumber";
import classes from "./Grid.module.scss";
import { selectItemAtom, selectedCurrencyAtom } from "../../store";

export default function GridItem({
  id,
  name,
  quantity,
  price,
  image,
}: Product) {
  const selectedCurrency = useAtomValue(selectedCurrencyAtom);
  const selectItem = useSetAtom(selectItemAtom);
  const parseQuantity = parseNumber(quantity);

  return (
    <div
      className={concatenateStrings(
        classes["grid_item"],
        parseQuantity === 0 ? classes["grid_item--disabled"] : "",
      )}
      role="button"
      tabIndex={parseQuantity > 0 ? 0 : -1}
      aria-disabled={parseQuantity === 0}
      onClick={() => parseQuantity > 0 && selectItem(id)}
      onKeyDown={(event) => {
        if (
          parseQuantity > 0 &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          selectItem(id);
        }
      }}
    >
      <img alt={name} title={name} src={image} />
      <h4>{name}</h4>

      <p>
        {price} {selectedCurrency}
      </p>

      <p className={classes["quantity"]}>
        {parseQuantity > 0 ? parseQuantity : "Not available"}
      </p>
    </div>
  );
}
