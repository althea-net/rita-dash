import { useCallback, useEffect } from "react";
import { get, useStore } from "store";
import useInterval from "hooks/useInterval";

const Init = () => {
  const [{ authenticated }, dispatch] = useStore();
  const getDebt = useCallback(
    async () => {
      try {
        const debts = await get("/debts");
        dispatch({ type: "debt", debts });
      } catch {}
    },
    [dispatch]
  );

  const getInfo = useCallback(
    async () => {
      try {
        const info = await get("/info", true, 5000);
        const authenticated = !(
          info instanceof Error && parseInt(info.message) === 403
        );
        dispatch({ type: "authenticated", authenticated });
        dispatch({ type: "info", info });
      } catch (e) {
        dispatch({ type: "info", info: { version: null } });
      }
    },
    [dispatch]
  );

  const getStatus = useCallback(
    async () => {
      try {
        const status = await get("/token_bridge/status", true, 2000);
        if (!(status instanceof Error)) {
          dispatch({ type: "status", status });
        }
      } catch (e) {}
    },
    [dispatch]
  );

  useInterval(getDebt, 10000);
  useInterval(getInfo, 5000);
  useInterval(getStatus, 2000);

  useEffect(
    () => {
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
        } catch {}
        getInfo();

        try {
          const exits = await get("/exits");
          if (exits instanceof Error) return;
          dispatch({ type: "exits", exits });

          await getDebt();
          const blockchain = await get("/blockchain/get");
          dispatch({ type: "blockchain", blockchain });
        } catch {}
      })();

      return () => controller.abort();
    },
    [authenticated, dispatch, getDebt, getInfo]
  );

  return null;
};

export default Init;
