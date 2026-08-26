import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Container from "./lib/components/Container/Container";
import Grid from "./lib/components/Grid/Grid";
import type { Product, SupportedCurrencies } from "./lib/types/types";
import GridItem from "./lib/components/Grid/GridItem";
import PaymentPanel from "./lib/components/PaymentPanel/PaymentPanel";
import { currencyConverter } from "./lib/utils/currencyConverter";

const images = import.meta.glob<string>("./assets/*.svg", {
  eager: true,
  import: "default",
});

const AVAILABLE_AMOUNT = 500;
const BACKEND = `http://localhost:3000`;

function App() {
  const [items, setItems] = useState<Array<Product>>([]);

  const [change, setChange] = useState(0);
  const [selectedItem, setSelectedItem] = useState<Product | null>(null);
  const [boughtItem, setBoughtItem] = useState<{
    name: string;
    image: string;
  }>({ name: "", image: "" });
  const [selectedCurrency, setSelectedCurrency] =
    useState<keyof typeof SupportedCurrencies>("EUR");
  const [amounts, setAmounts] = useState({
    availableAmount: AVAILABLE_AMOUNT,
    currentAmount: 0,
  });
  const [ajaxStatus, setAjaxStatus] = useState<
    "initial" | "loading" | "error" | "success"
  >("initial");
  const [apiMessage, setApiMessage] = useState("");
  const [refetchItems, setRefetchItems] = useState(true);

  const handleSelectItem = useCallback(
    (id: string) => {
      const findItem = items.find((i) => i.id === id);

      setSelectedItem(findItem ?? null);
    },
    [items],
  );

  const handleClearSelection = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const handleSelectCurrency = useCallback(
    (currency: keyof typeof SupportedCurrencies) => {
      setAmounts((prev) => ({
        ...prev,
        availableAmount: currencyConverter(
          prev.availableAmount,
          selectedCurrency,
          currency,
        ),
      }));
      setSelectedCurrency(currency);
      setRefetchItems(true);
    },
    [selectedCurrency],
  );

  const handleBuyItem = useCallback(
    async (id: string, amount: number) => {
      if (!selectedItem || !id || amount <= 0) return;

      if (selectedItem.price > amount) return;
      if (amounts.availableAmount < amount) return;

      setBoughtItem({
        image: selectedItem.image,
        name: selectedItem.name,
      });

      // only the product price is taken from credit; extra is change
      setAmounts((prev) => ({
        availableAmount: Number(
          (prev.availableAmount - selectedItem.price).toFixed(2),
        ),
        currentAmount: 0,
      }));

      setChange(Number((amount - selectedItem.price).toFixed(2)));

      try {
        const res = await fetch(`${BACKEND}/products/${selectedItem.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount, currency: selectedCurrency }),
        });

        if (!res.ok) {
          setAjaxStatus("error");
          setApiMessage("Couldn't buy the product! Try again!");
          return;
        }

        const data = (await res.json()) as { success: boolean };

        if (data.success) {
          setRefetchItems(true);
        }

        setAjaxStatus("success");
      } catch {
        setApiMessage("Couldn't buy the product! Try again!");
        setAjaxStatus("error");
      }
    },
    [amounts.availableAmount, selectedCurrency, selectedItem],
  );

  // ==========================================================
  // Fetch items
  // ==========================================================
  useEffect(() => {
    if (!refetchItems) return;

    let cancelled = false;

    async function fetchData() {
      setAjaxStatus("loading");

      try {
        const res = await fetch(
          `${BACKEND}/products?currency=${selectedCurrency}`,
        );

        if (!res.ok) {
          setAjaxStatus("error");
          setApiMessage("The vending machine has been broken!");

          return;
        }

        const data = (await res.json()) as Array<Product>;

        if (!cancelled) {
          const mapped = data.map((e) => ({
            ...e,
            image: images[`./assets/${e.image}.svg`],
          }));

          setItems(mapped);
          setSelectedItem((prev) =>
            prev ? (mapped.find((i) => i.id === prev.id) ?? null) : null,
          );
          setAjaxStatus("success");

          setRefetchItems(false);
        }
      } catch {
        setAjaxStatus("error");
        setApiMessage("The vending machine has been broken!");
        cancelled = true;
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [refetchItems, selectedCurrency]);

  return (
    <Container>
      <h1 className="heading">Vending Machine &copy;</h1>

      {ajaxStatus === "error" && apiMessage && <h3>{apiMessage}</h3>}

      <Grid columns={2}>
        <PaymentPanel
          selectedItem={selectedItem}
          selectedCurrency={selectedCurrency}
          onSelectCurrency={handleSelectCurrency}
          onClearSelection={handleClearSelection}
          onBuyItem={handleBuyItem}
          onLowerCurrentAmount={(val: number) =>
            setAmounts((prev) => ({
              ...prev,
              currentAmount: val,
            }))
          }
          // leftover credit after inserting money
          currentAmount={Number(
            (amounts.availableAmount - amounts.currentAmount).toFixed(2),
          )}
          boughtItem={boughtItem}
          change={change}
        />

        {ajaxStatus === "loading" && <div className="spinner"></div>}

        {ajaxStatus === "success" && items.length > 0 && (
          <Grid columns={3}>
            {items.map((item) => (
              <GridItem
                key={item.id}
                {...item}
                onSelectItem={handleSelectItem}
                selectedCurrency={selectedCurrency}
              />
            ))}
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default App;
