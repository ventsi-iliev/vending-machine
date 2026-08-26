import { useSetAtom } from "jotai";
import { useEffect } from "react";
import type { Product } from "../types/types";
import {
  ajaxStatusAtom,
  apiMessageAtom,
  BACKEND,
  itemsAtom,
} from "./atoms";

const images = import.meta.glob<string>("../../assets/*.svg", {
  eager: true,
  import: "default",
});

export function useFetchProducts() {
  const setItems = useSetAtom(itemsAtom);
  const setAjaxStatus = useSetAtom(ajaxStatusAtom);
  const setApiMessage = useSetAtom(apiMessageAtom);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setAjaxStatus("loading");
      setApiMessage("");

      try {
        const res = await fetch(`${BACKEND}/products?currency=EUR`);

        if (!res.ok) {
          if (!cancelled) {
            setAjaxStatus("error");
            setApiMessage("The vending machine is unavailable.");
          }
          return;
        }

        const data = (await res.json()) as Array<Product>;

        if (!cancelled) {
          const mapped = data.map((item) => ({
            ...item,
            image:
              Object.entries(images).find(([path]) =>
                path.endsWith(`/${item.image}.svg`),
              )?.[1] ?? item.image,
          }));

          setItems(mapped);
          setAjaxStatus("success");
        }
      } catch {
        if (!cancelled) {
          setAjaxStatus("error");
          setApiMessage("The vending machine is unavailable.");
        }
      }
    }

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [setAjaxStatus, setApiMessage, setItems]);
}
