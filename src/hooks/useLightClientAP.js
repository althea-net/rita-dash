import { useEffect, useState } from "react";
import { get, useStore } from "store";

const AbortController = window.AbortController;

const useLightClientAP = () => {
  const [loading, setLoading] = useState(true);
  const [, dispatch] = useStore();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      setLoading(true);

      try {
        let lightClientAP = await get(
          "/interfaces/lightclient",
          true,
          5000,
          signal
        );
        if (!(lightClientAP instanceof Error))
          dispatch({ type: "lightClientAP", lightClientAP });
      } catch {
        return;
      }

      setLoading(false);
    })();
    return () => controller.abort();
  }, [dispatch]);

  return [loading];
};

export default useLightClientAP;
