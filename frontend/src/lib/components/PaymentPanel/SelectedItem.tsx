import classes from "./SelectedItem.module.scss";
import type { Product, SupportedCurrencies } from "../../types/types";
import Button from "../Button/Button";
import Grid from "../Grid/Grid";

type Props = {
  selectedItem: Product;
  onClearSelection: () => void;
  selectedCurrency: keyof typeof SupportedCurrencies;
};

export default function SelectedItem({
  selectedItem,
  onClearSelection,
  selectedCurrency,
}: Props) {
  return (
    <div className={classes["selected-item"]}>
      <Grid columns={2}>
        <h4>Selected product</h4>
        <Button removeSpacing onClick={onClearSelection}>
          Clear selection
        </Button>
      </Grid>

      <div>
        <div>
          <h5>{selectedItem.name}</h5>
          <p>
            Price: {selectedItem.price} {selectedCurrency}
          </p>
          <img
            src={selectedItem.image}
            alt={selectedItem.name}
            title={selectedItem.name}
          />
        </div>
      </div>

      <hr />
    </div>
  );
}
