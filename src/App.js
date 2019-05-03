import React, { useEffect, useState } from "react";
import { Nav } from "reactstrap";
import AltheaNav from "./Layout/Nav";
import Topbar from "./Layout/Topbar";
import { NoConnection } from "utils";
import Router from "Router";
import { get } from "store";
import { Provider } from "store/App";
import { BigNumber } from "bignumber.js";
import useInterval from "utils/UseInterval";

const initialInfo = {
  balance: null
};

const initialSettings = {
  network: {
    meshIp: null
  },
  payment: {
    ethAddress: null
  }
};

const symbols = {
  Ethereum: "ETH",
  Rinkeby: "tETH",
  Xdai: "USD"
};

export default () => {
  const [blockchain, setBlockchain] = useState();
  const [debt, setDebt] = useState(0);
  const [exits, setExits] = useState([]);
  const [info, setInfo] = useState(initialInfo);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState("dashboard");
  const [symbol, setSymbol] = useState();
  const [settings, setSettings] = useState(initialSettings);

  const init = async () => {
    setLoading(true);

    try {
      await getInfo();

      let res = await get("/exits");
      if (res instanceof Error) return;
      setExits(res);
      await getDebt();

      await getBlockchain();

      res = await get("/settings");
      if (res instanceof Error) return;
      setSettings(res);
    } catch {}

    setLoading(false);
  };

  const getDebt = async () => {
    try {
      const debts = await get("/debts");

      const selectedExit = exits.find(e => e.isSelected);

      if (selectedExit) {
        let debt = debts.reduce((a, b) => {
          return b.identity.meshIp === selectedExit.exitSettings.id.meshIp
            ? a.plus(BigNumber(b.paymentDetails.debt.toString()))
            : a;
        }, BigNumber("0"));

        setDebt(debt);
      }
    } catch {}
  };

  const getInfo = async () => {
    try {
      const info = await get("/info", true, 2000);
      setInfo(info);
    } catch {
      setInfo(initialInfo);
    }
  };

  const getBlockchain = async () => {
    const res = await get("/blockchain/get/");
    setBlockchain(res);
    setSymbol(symbols[res]);
  };

  let style;
  useEffect(() => {
    init();

    let h = document.querySelector(".navbar").offsetHeight;
    style = { minHeight: `calc(100vh - ${h}px)` };
  }, []);

  useInterval(getDebt, 5000);
  useInterval(getInfo, 2000);

  const state = {
    blockchain,
    getBlockchain,
    debt,
    info,
    settings,
    symbol
  };

  return (
    <Provider value={state}>
      <Topbar />
      <div className="d-flex" style={style}>
        <Nav id="sidebar" navbar>
          <AltheaNav page={page} />
        </Nav>
        <NoConnection />
        <div id="content">
          {!loading && <Router page={page} setPage={setPage} />}
        </div>
      </div>
    </Provider>
  );
};
