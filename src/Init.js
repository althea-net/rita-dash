import { useCallback, useEffect, useRef } from "react";
import { get, useStore } from "store";
import useInterval from "hooks/useInterval";

const setTimeout = window.setTimeout.bind(window);
const clearTimeout = window.clearTimeout.bind(window);

const Init = () => {
  const [{ authenticated, initialized }, dispatch] = useStore();
  const getDebt = useCallback(async () => {
    try {
      const debts = await get("/debts");
      dispatch({ type: "debt", debts });
    } catch {}
  }, [dispatch]);

  const timeout = useRef();

  useEffect(() => {
    timeout.current && timeout.current.map((t) => clearTimeout(t));
    return;
  }, [initialized]);

  const getInfo = useCallback(async () => {
    try {
      const info = await get("/info", true, 5000);
      const authenticated = !(
        info instanceof Error && parseInt(info.message) === 403
      );
      dispatch({ type: "authenticated", authenticated });
      dispatch({ type: "info", info });

      if (!initialized) {
        if (!timeout.current) timeout.current = [];
        timeout.current.push(
          setTimeout(() => window.location.reload(true), 10000)
        );
      }
    } catch (e) {
      dispatch({ type: "info", info: { version: null } });
    }
  }, [dispatch, initialized]);

  const getStatus = useCallback(async () => {
    try {
      const status = await get("/token_bridge/status", true, 5000);
      if (!(status instanceof Error)) {
        dispatch({ type: "status", status });
      }
    } catch (e) {}
  }, [dispatch]);

  const getExits = useCallback(
    async (signal) => {
      if (!signal) {
        const controller = new AbortController();
        signal = controller.signal;
      }

      try {
        const blockchain = await get("/blockchain/get", true, 8000, signal);
        if (!(blockchain instanceof Error))
          dispatch({ type: "blockchain", blockchain });
        else throw new Error("Problem fetching blockchain");
      } catch (e) {
        if (e.message && !e.message.includes("aborted")) console.log(e.message);
      }
    },
    [dispatch]
  );

  useInterval(getDebt, 10000);
  useInterval(getInfo, 5000);
  useInterval(getStatus, 5000);
  useInterval(getExits, 8000);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      try {
        let { backupCreated } = await get(
          "/backup_created",
          true,
          5000,
          signal
        );

        if (!(backupCreated instanceof Error)) {
          backupCreated = backupCreated === "true";
          dispatch({ type: "backupCreated", backupCreated });
        }

        getInfo();
        getExits(signal);

        await getDebt();
        const blockchain = await get("/blockchain/get", true, 5000, signal);
        dispatch({ type: "blockchain", blockchain });

        const sellingBandwidth =
          window.localStorage.getItem("sellingBandwidth") === "true";
        dispatch({ type: "sellingBandwidth", sellingBandwidth });

        const wgPublicKey = await get("/wg_public_key");
        dispatch({ type: "wgPublicKey", wgPublicKey });

        dispatch({ type: "initialized", initialized: true });
      } catch (e) {
        dispatch({ type: "initialized", initialized: false });
      }
    })();

    return () => controller.abort();
  }, [authenticated, dispatch, getDebt, getInfo, getExits]);

  return null;
};

export default Init;
