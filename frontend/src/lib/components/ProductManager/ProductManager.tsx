import { useAtomValue, useSetAtom } from "jotai";
import { useState, type FormEvent } from "react";
import defaultProductImage from "../../../assets/01-cola-can.svg";
import {
  addProductAtom,
  deleteProductAtom,
  itemsAtom,
  MAX_PRODUCT_QUANTITY,
  selectedCurrencyAtom,
  updateProductAtom,
} from "../../store";
import { parseNumber } from "../../utils/parseNumber";
import Button from "../Button/Button";
import classes from "./ProductManager.module.scss";

const EMPTY_FORM = {
  name: "",
  price: "",
  quantity: "1",
};

export default function ProductManager() {
  const products = useAtomValue(itemsAtom);
  const currency = useAtomValue(selectedCurrencyAtom);
  const addProduct = useSetAtom(addProductAtom);
  const updateProduct = useSetAtom(updateProductAtom);
  const deleteProduct = useSetAtom(deleteProductAtom);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  const cancelEditing = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setError("");
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    let price: number;
    let quantity: number;

    try {
      price = parseNumber(form.price);
      quantity = parseNumber(form.quantity);
    } catch {
      setError(
        `Enter a name, a positive price, and a quantity from 0 to ${MAX_PRODUCT_QUANTITY}.`,
      );
      return;
    }

    const editingProduct = products.find((product) => product.id === editingId);
    const draft = {
      name: form.name,
      price,
      quantity,
      image: editingProduct?.image ?? defaultProductImage,
    };

    const saved = editingProduct
      ? updateProduct({ ...draft, id: editingProduct.id })
      : addProduct(draft);

    if (!saved) {
      setError(
        `Enter a name, a positive price, and a quantity from 0 to ${MAX_PRODUCT_QUANTITY}.`,
      );
      return;
    }

    cancelEditing();
  };

  return (
    <section className={classes["product-manager"]}>
      <h2>Product management</h2>
      <p>Changes below are kept in application state only.</p>

      <form onSubmit={handleSubmit} className={classes["product-manager__form"]}>
        <label>
          Name
          <input
            required
            value={form.name}
            onChange={(event) =>
              setForm((current) => ({ ...current, name: event.target.value }))
            }
          />
        </label>
        <label>
          Price ({currency})
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            value={form.price}
            onChange={(event) =>
              setForm((current) => ({ ...current, price: event.target.value }))
            }
          />
        </label>
        <label>
          Quantity
          <input
            required
            min="0"
            max={MAX_PRODUCT_QUANTITY}
            step="1"
            type="number"
            value={form.quantity}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                quantity: event.target.value,
              }))
            }
          />
        </label>
        <div className={classes["product-manager__actions"]}>
          <Button removeSpacing type="submit">
            {editingId ? "Save product" : "Add product"}
          </Button>
          {editingId && (
            <Button removeSpacing onClick={cancelEditing}>
              Cancel
            </Button>
          )}
        </div>
      </form>

      {error && <p role="alert">{error}</p>}

      <div className={classes["product-manager__list"]}>
        {products.map((product) => (
          <article key={product.id}>
            <span>
              {product.name} — {product.price} {currency} — {product.quantity} in
              stock
            </span>
            <div>
              <Button
                removeSpacing
                onClick={() => {
                  setEditingId(product.id);
                  setForm({
                    name: product.name,
                    price: String(product.price),
                    quantity: String(product.quantity),
                  });
                  setError("");
                }}
              >
                Edit
              </Button>
              <Button
                removeSpacing
                onClick={() => {
                  deleteProduct(product.id);
                  if (editingId === product.id) cancelEditing();
                }}
              >
                Delete
              </Button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
