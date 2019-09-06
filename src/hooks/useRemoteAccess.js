import { useEffect, useState } from "react";
import { get, useStore } from "store";

const AbortController = window.AbortController;

const useRemoteAccess = () => {
  const [loading, setLoading] = useState(true);
  const [, dispatch] = useStore();

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      (async () => {
        setLoading(true);

        try {
          let remoteAccess = await get("/remote_access", true, 5000, signal);
          if (!(remoteAccess instanceof Error))
            dispatch({ type: "remoteAccess", remoteAccess });
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

export default useRemoteAccess;
