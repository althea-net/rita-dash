import React, { useCallback, useEffect, useRef, useState } from "react";
import { Nav } from "reactstrap";
import AltheaNav from "./Layout/Nav";
import Topbar from "./Layout/Topbar";
import { NoConnection } from "utils";
import Router from "Router";
import { get, useStore } from "store";
import useInterval from "hooks/useInterval";

export default () => {
  const [loading, setLoading] = useState();
  const [page, setPage] = useState("dashboard");
  const [open, setOpen] = useState(false);
  let [, dispatch] = useStore();

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

  const styleRef = useRef();

  useInterval(getDebt, 5000);
  useInterval(getInfo, 2000);

  useEffect(
    () => {
      const init = async () => {
        setLoading(true);
        getInfo();

        try {
          const exits = await get("/exits");
          if (exits instanceof Error) return;
          dispatch({ type: "exits", exits });

          await getDebt();
          const blockchain = await get("/blockchain/get/");
          dispatch({ type: "blockchain", blockchain });

          const { meshIp } = await get("/mesh_ip");
          dispatch({ type: "meshIp", meshIp });

          const {
            network: { wgPublicKey }
          } = await get("/settings");
          dispatch({ type: "wgPublicKey", wgPublicKey });
        } catch {}

        setLoading(false);
      };

      init();

      const h = document.querySelector(".navbar").offsetHeight;
      styleRef.current = { minHeight: `calc(100vh - ${h}px)` };
    },
    [dispatch, getDebt, getInfo]
  );

  return (
    <>
      <Topbar {...{ open, setOpen }} />
      <div className="d-flex" style={styleRef.current}>
        <Nav id="sidebar" navbar>
          <AltheaNav {...{ page, setOpen }} />
        </Nav>
        <NoConnection />
        <div id="content">
          {!loading && <Router {...{ page, setPage, setOpen }} />}
        </div>
      </div>
    </>
  );
};
