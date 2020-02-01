import { useEffect, useState } from "react";
import { get, useStore } from "store";

const AbortController = window.AbortController;

const useLightClientAP = () => {
  const [loading, setLoading] = useState(true);
  const [, dispatch] = useStore();

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      (async () => {
        setLoading(true);

        try {
          let lightClient = await get(
            "/interfaces/lightclient",
            true,
            5000,
            signal
          );
          if (!(lightClient instanceof Error))
            dispatch({ type: "lightClient", lightClient });
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

export default useLightClientAP;
