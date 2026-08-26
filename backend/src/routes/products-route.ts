import express from "express";
import { storage } from "../storage/storage.js";
import { currencyConverter } from "../utils/currency-converter.js";
import { SupportedCurrencies } from "../storage/types.js";

const Router = express.Router();

Router.get("/products", (req, res) => {
  const requestedCurrency = Array.isArray(req.query.currency)
    ? req.query.currency[0]
    : (req.query.currency ?? SupportedCurrencies.EUR);

  if (
    requestedCurrency !== SupportedCurrencies.EUR &&
    requestedCurrency !== SupportedCurrencies.USD
  ) {
    return res.status(400).send({
      message: `Unsupported currency. Use ${Object.values(SupportedCurrencies).join(" or ")}.`,
    });
  }

  const products = storage.getProducts().map((product) => ({
    ...product,
    price: currencyConverter(
      product.price,
      SupportedCurrencies.EUR,
      requestedCurrency,
    ),
  }));

  return res.send(products);
});

export { Router as ProductsRouter };
