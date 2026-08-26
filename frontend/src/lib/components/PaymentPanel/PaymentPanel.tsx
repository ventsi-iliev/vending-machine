import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { SupportedCurrencies } from "../../types/types";
import Button from "../Button/Button";
import Grid from "../Grid/Grid";
import Select from "../Select/Select";
import classes from "./PaymentPanel.module.scss";
import SelectedItem from "./SelectedItem";
import {
  boughtItemAtom,
  buyItemAtom,
  changeAtom,
  COIN_DENOMINATIONS,
  insertCoinAtom,
  insertedAmountAtom,
  leftoverCreditAtom,
  returnMoneyAtom,
  returnedAmountAtom,
  selectCurrencyAtom,
  selectedCurrencyAtom,
  selectedItemAtom,
} from "../../store";

export default function PaymentPanel() {
  const selectedItem = useAtomValue(selectedItemAtom);
  const selectedCurrency = useAtomValue(selectedCurrencyAtom);
  const leftoverCredit = useAtomValue(leftoverCreditAtom);
  const boughtItem = useAtomValue(boughtItemAtom);
  const change = useAtomValue(changeAtom);
  const insertedAmount = useAtomValue(insertedAmountAtom);
  const returnedAmount = useAtomValue(returnedAmountAtom);
  const selectCurrency = useSetAtom(selectCurrencyAtom);
  const insertCoin = useSetAtom(insertCoinAtom);
  const buyItem = useSetAtom(buyItemAtom);
  const returnMoney = useSetAtom(returnMoneyAtom);
  const acceptedCoins = COIN_DENOMINATIONS[selectedCurrency];

  let isAmountEnough = null;

  if (selectedItem) {
    isAmountEnough =
      leftoverCredit >= 0 && insertedAmount >= selectedItem.price;
  }

  const disableBuyButton =
    !selectedItem ||
    !insertedAmount ||
    !selectedCurrency ||
    !isAmountEnough;

  const options = useMemo(() => {
    return Object.values(SupportedCurrencies).map((e) => ({
      id: String(e),
      value: String(e),
    }));
  }, []);

  return (
    <section className={classes["payment-panel"]}>
      {leftoverCredit + insertedAmount > 0 ? (
        <Grid columns={2}>
          <div className={classes["payment-panel__heading"]}>
            <div>
              <h3>Wallet balance:</h3>
              <span>
                {leftoverCredit} {selectedCurrency}
              </span>
            </div>
          </div>
          <Button onClick={returnMoney} disabled={insertedAmount <= 0}>
            Reset and return coins
          </Button>
        </Grid>
      ) : (
        <h4>You don't have enough credit</h4>
      )}

      <Grid columns={2}>
        <div>
          <h3>Insert coins</h3>
          <div className={classes["payment-panel__coins"]}>
            {acceptedCoins.map((coin) => (
              <Button
                key={coin}
                removeSpacing
                disabled={coin > leftoverCredit}
                onClick={() => insertCoin(coin)}
              >
                {coin} {selectedCurrency}
              </Button>
            ))}
          </div>
          <p className={classes["payment-panel__inserted"]}>
            Inserted: {insertedAmount} {selectedCurrency}
          </p>
        </div>

        <div>
          <Select
            id="currency"
            placeholder="Choose currency"
            label="Currency"
            value={String(selectedCurrency)}
            onChange={(val) =>
              selectCurrency(val as typeof selectedCurrency)
            }
            disabled={insertedAmount > 0}
            options={options}
          />
          {insertedAmount > 0 && (
            <small>Return inserted coins before changing currency.</small>
          )}
        </div>
      </Grid>

      <Button
        disabled={disableBuyButton}
        onClick={() => {
          buyItem(selectedItem?.id ?? "");
        }}
      >
        Buy
      </Button>

      {!isAmountEnough && isAmountEnough !== null && (
        <p>
          <strong>You don't have enough money to buy this product</strong>
        </p>
      )}

      {returnedAmount > 0 && (
        <p role="status">
          Returned {returnedAmount} {selectedCurrency}
        </p>
      )}

      <hr />

      {selectedItem && <SelectedItem />}

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
