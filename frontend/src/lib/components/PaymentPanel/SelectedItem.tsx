import { useAtomValue, useSetAtom } from "jotai";
import classes from "./SelectedItem.module.scss";
import Button from "../Button/Button";
import Grid from "../Grid/Grid";
import {
  clearSelectionAtom,
  selectedCurrencyAtom,
  selectedItemAtom,
} from "../../store";

export default function SelectedItem() {
  const selectedItem = useAtomValue(selectedItemAtom);
  const selectedCurrency = useAtomValue(selectedCurrencyAtom);
  const clearSelection = useSetAtom(clearSelectionAtom);

  if (!selectedItem) return null;

  return (
    <div className={classes["selected-item"]}>
      <Grid columns={2}>
        <h4>Selected product</h4>
        <Button removeSpacing onClick={clearSelection}>
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
