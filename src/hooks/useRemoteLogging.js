import { useEffect, useState } from "react";
import { get, useStore } from "store";

const AbortController = window.AbortController;

const useRemoteLogging = () => {
  const [loading, setLoading] = useState(true);
  const [, dispatch] = useStore();

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      (async () => {
        setLoading(true);

        try {
          let remoteLogging = await get(
            "/remote_logging/enabled",
            true,
            5000,
            signal
          );
          if (!(remoteLogging instanceof Error))
            dispatch({ type: "remoteLogging", remoteLogging });
        } catch {
          return;
        }

        try {
          let level = await get("/remote_logging/level", true, 5000, signal);
          if (!(level instanceof Error)) dispatch({ type: "level", level });
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

export default useRemoteLogging;
