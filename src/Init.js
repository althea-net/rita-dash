import React, { useCallback, useEffect } from "react";
import { get, useStore } from "store";
import useInterval from "hooks/useInterval";

const Init = () => {
  const [, dispatch] = useStore();
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
        const info = await get("/info", true, 2000);
        dispatch({ type: "info", info });
      } catch {
        dispatch({ type: "info", info: { version: null } });
      }
    },
    [dispatch]
  );

  useInterval(getDebt, 10000);
  useInterval(getInfo, 2000);

  useEffect(
    () => {
      const init = async () => {
        getInfo();

        try {
          const exits = await get("/exits");
          if (exits instanceof Error) return;
          dispatch({ type: "exits", exits });

          await getDebt();
          const blockchain = await get("/blockchain/get");
          dispatch({ type: "blockchain", blockchain });

          const { meshIp } = await get("/mesh_ip");
          dispatch({ type: "meshIp", meshIp });

          const {
            network: { wgPublicKey }
          } = await get("/settings");
          dispatch({ type: "wgPublicKey", wgPublicKey });
        } catch {}
      };

      init();
    },
    [dispatch, getDebt, getInfo]
  );

  return <></>;
};

export default Init;
