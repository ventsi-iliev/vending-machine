import type { Product, SupportedCurrencies } from "../../types/types";
import { concatenateStrings } from "../../utils/concatenateStrings";
import { parseNumber } from "../../utils/parseNumber";
import classes from "./Grid.module.scss";

type Props = Product & {
  onSelectItem: (id: string) => void;
  selectedCurrency: keyof typeof SupportedCurrencies;
};

export default function GridItem({
  id,
  name,
  quantity,
  price,
  image,
  onSelectItem,
  selectedCurrency,
}: Props) {
  const parseQuantity = parseNumber(quantity);

  return (
    <div
      className={concatenateStrings(
        classes["grid_item"],
        parseQuantity === 0 ? classes["grid_item--disabled"] : "",
      )}
      onClick={() => parseQuantity > 0 && onSelectItem(id)}
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
