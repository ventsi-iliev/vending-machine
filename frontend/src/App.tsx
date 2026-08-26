import { useAtomValue } from "jotai";
import "./App.css";
import Container from "./lib/components/Container/Container";
import Grid from "./lib/components/Grid/Grid";
import GridItem from "./lib/components/Grid/GridItem";
import PaymentPanel from "./lib/components/PaymentPanel/PaymentPanel";
import ProductManager from "./lib/components/ProductManager/ProductManager";
import {
  ajaxStatusAtom,
  apiMessageAtom,
  itemsAtom,
  useFetchProducts,
} from "./lib/store";

function App() {
  useFetchProducts();

  const items = useAtomValue(itemsAtom);
  const ajaxStatus = useAtomValue(ajaxStatusAtom);
  const apiMessage = useAtomValue(apiMessageAtom);

  return (
    <Container>
      <h1 className="heading">Vending Machine &copy;</h1>

      {ajaxStatus === "error" && apiMessage && <h3>{apiMessage}</h3>}

      <Grid columns={2}>
        <PaymentPanel />

        {ajaxStatus === "loading" && <div className="spinner"></div>}

        {ajaxStatus === "success" && items.length > 0 && (
          <Grid columns={3}>
            {items.map((item) => (
              <GridItem key={item.id} {...item} />
            ))}
          </Grid>
        )}
      </Grid>

      {ajaxStatus === "success" && <ProductManager />}
    </Container>
  );
}

export default App;
