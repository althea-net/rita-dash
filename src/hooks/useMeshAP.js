import { useEffect, useState } from "react";
import { get, useStore } from "store";

const AbortController = window.AbortController;

const useMeshAP = () => {
  const [loading, setLoading] = useState(true);
  const [, dispatch] = useStore();

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      (async () => {
        setLoading(true);

        try {
          let mesh = await get("/interfaces/mesh", true, 5000, signal);
          if (!(mesh instanceof Error)) dispatch({ type: "mesh", mesh });
        } catch {
          return;
        }

        setLoading(false);
      })();
      return () => controller.abort();
    },
    [dispatch]
  );

  return [loading];
};

export default useMeshAP;
