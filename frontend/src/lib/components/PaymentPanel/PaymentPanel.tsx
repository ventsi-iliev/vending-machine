import { useMemo, useState } from "react";
import { SupportedCurrencies, type Product } from "../../types/types";
import Button from "../Button/Button";
import Grid from "../Grid/Grid";
import Input from "../Input/Input";
import Select from "../Select/Select";
import classes from "./PaymentPanel.module.scss";
import SelectedItem from "./SelectedItem";
import { parseNumber } from "../../utils/parseNumber";

type Props = {
  selectedItem: Product | null;
  onClearSelection: () => void;
  onSelectCurrency: (currency: keyof typeof SupportedCurrencies) => void;
  onBuyItem: (id: string, amount: number) => void;
  onLowerCurrentAmount: (val: number) => void;
  selectedCurrency: keyof typeof SupportedCurrencies;
  currentAmount: number;
  boughtItem: {
    name: string;
    image: string;
  };
  change: number;
};

export default function PaymentPanel({
  selectedItem,
  onClearSelection,
  onBuyItem,
  currentAmount,
  selectedCurrency,
  onSelectCurrency,
  boughtItem,
  change,
  onLowerCurrentAmount,
}: Props) {
  const [amount, setAmount] = useState(0);

  let isAmountEnough = null;

  if (selectedItem) {
    isAmountEnough = currentAmount >= 0 && amount >= selectedItem.price;
  }

  const disableActionButton =
    !selectedItem || !amount || !selectedCurrency || !isAmountEnough;

  const options = useMemo(() => {
    return Object.values(SupportedCurrencies).map((e) => ({
      id: String(e),
      value: String(e),
    }));
  }, []);

  return (
    <section className={classes["payment-panel"]}>
      {currentAmount + amount > 0 ? (
        <>
          <Grid columns={2}>
            <div className={classes["payment-panel__heading"]}>
              <div>
                {" "}
                <h3>Available money:</h3>
                <span>
                  {currentAmount} {selectedCurrency}
                </span>
              </div>
            </div>
            <Button
              onClick={() => {
                onLowerCurrentAmount(0);
                setAmount(0);
              }}
              disabled={disableActionButton}
            >
              Return money
            </Button>
          </Grid>
        </>
      ) : (
        <h4>You don't have enought credit</h4>
      )}

      <Grid columns={2}>
        <Input
          id="deposit"
          placeholder="Inserts money"
          label="Inserts money"
          type="number"
          value={String(amount)}
          onChange={(val: string) => {
            const parsedNum = parseNumber(val);

            setAmount(parsedNum);
            onLowerCurrentAmount(parsedNum);
          }}
          helperText={
            currentAmount < 0 && selectedItem
              ? `You cannot buy the product because you don't have enought credit`
              : ""
          }
        />

        {/* Select currency */}
        <div>
          <Select
            id="currency"
            placeholder="Adds currency"
            label="Adds currency"
            value={String(selectedCurrency)}
            onChange={(val) => onSelectCurrency(val as typeof selectedCurrency)}
            disabled={currentAmount + amount <= 0}
            options={options}
          />
        </div>
      </Grid>

      <Button
        disabled={disableActionButton}
        onClick={() => {
          onBuyItem(selectedItem?.id ?? "", amount);
          setAmount(0);
          onClearSelection();
        }}
      >
        Buy
      </Button>

      {!isAmountEnough && isAmountEnough !== null && (
        <p>
          <strong>You don't have enought money to buy this product</strong>
        </p>
      )}

      <hr />

      {selectedItem && (
        <SelectedItem
          selectedItem={selectedItem}
          onClearSelection={onClearSelection}
          selectedCurrency={selectedCurrency}
        />
      )}

      {boughtItem.name && boughtItem.image && (
        <Grid columns={2}>
          <div>
            <h4>Bought product</h4>
            <div style={{ textDecoration: "underline" }}>{boughtItem.name}</div>
            <img
              src={boughtItem.image}
              alt={boughtItem.name}
              title={boughtItem.name}
            />
          </div>
          <div>
            <h4>Returned change</h4>
            <div>
              {change} {selectedCurrency}
            </div>
          </div>
        </Grid>
      )}
    </section>
  );
}
