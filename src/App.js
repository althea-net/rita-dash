import React, { useEffect, useState } from "react";
import { Nav } from "reactstrap";
import AltheaNav from "./Layout/Nav";
import Topbar from "./Layout/Topbar";
import { NoConnection } from "utils";
import Router from "Router";
import { actions, get } from "store";
import { Provider } from "store/App";
import { BigNumber } from "bignumber.js";

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
  const [page, setPage] = useState("dashboard");
  const [debt, setDebt] = useState(0);
  const [info, setInfo] = useState({});
  const [blockchain, setBlockchain] = useState();
  const [symbol, setSymbol] = useState();
  const [settings, setSettings] = useState(initialSettings);
  const [loading, setLoading] = useState(true);
  const [exits, setExits] = useState(true);

  let style;

  const init = async () => {
    setLoading(true);

    await getExits();
    await getInfo();
    await getBlockchain();
    await getSettings();
    await getDebt();

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
    } catch (e) {
      console.log(e);
    }
  };

  const getInfo = async () => {
    actions.getInfo();
    setInfo(await get("/info"));
  };

  const getExits = async () => setExits(await get("/exits"));
  const getSettings = async () => setSettings(await get("/settings"));

  const getBlockchain = async () => {
    const res = await get("/blockchain/get/");
    setBlockchain(res);
    setSymbol(symbols[res]);
  };

  useEffect(() => {
    init();

    let h = document.querySelector(".navbar").offsetHeight;
    style = { minHeight: `calc(100vh - ${h}px)` };

    actions.getBlockchain();
    actions.getInfo();
    actions.getSettings();

    let debtPoll = setInterval(getDebt, 5000);
    let infoPoll = setInterval(getInfo, 5000);
    let versionPoll = setInterval(actions.getVersion, 2000);

    return () => {
      clearInterval(debtPoll);
      clearInterval(infoPoll);
      clearInterval(versionPoll);
    };
  }, []);

  return (
    <Provider
      value={{ blockchain, getBlockchain, debt, info, settings, symbol }}
    >
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
