import { useEffect, useState } from "react";
import { get, useStore } from "store";

const AbortController = window.AbortController;

const useNickname = () => {
  const [loading, setLoading] = useState(true);
  const [, dispatch] = useStore();

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      setLoading(true);

      try {
        let nickname = await get("/nickname/get", true, 5000, signal);
        if (!(nickname instanceof Error))
          dispatch({ type: "nickname", nickname });
      } catch {
        return;
      }

      setLoading(false);
    })();
    return () => controller.abort();
  }, [dispatch]);

  return [loading];
};

export default useNickname;
