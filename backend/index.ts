import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { ProductsRouter } from "./src/routes/products-route.js";
import cors from "cors";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:4173"],
    methods: ["GET"],
  }),
);
app.use(ProductsRouter);

app.use((req: Request, res: Response) => {
  return res.status(404).send("The page was not found!");
});

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  return res.status(500).send(err.message || "An error occurred!");
});

app.listen(3000, () => {
  console.log("Running on port 3000");
});
