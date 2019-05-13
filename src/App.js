import React, { useEffect, useRef, useState } from "react";
import { Nav } from "reactstrap";
import AltheaNav from "./Layout/Nav";
import Topbar from "./Layout/Topbar";
import { NoConnection } from "utils";
import Router from "Router";
import { get } from "store";
import { Provider, StateProvider } from "store/App";
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

const initialState = { balance: 0 };

const reducer = (state, action) => {
  switch (action.type) {
    case "setBalance":
      return { ...state, balance: action.balance };
    default:
      return state;
  }
};

export default () => {
  const [blockchain, setBlockchain] = useState();
  const [debt, setDebt] = useState(0);
  const [exits, setExits] = useState([]);
  const [info, setInfo] = useState(initialInfo);
  const [loading, setLoading] = useState();
  const [page, setPage] = useState("dashboard");
  const [symbol, setSymbol] = useState();
  const [settings, setSettings] = useState(initialSettings);

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

  const styleRef = useRef();

  useInterval(getDebt, 5000);
  useInterval(getInfo, 2000);

  useEffect(() => {
    const init = async () => {
      setLoading(true);

      try {
        let exits = await get("/exits");
        if (exits instanceof Error) return;
        setExits(exits);
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

        await getBlockchain();

        let settings = await get("/settings");
        if (settings instanceof Error) return;
        setSettings(settings);
      } catch {}

      setLoading(false);
    };

    init();

    let h = document.querySelector(".navbar").offsetHeight;
    styleRef.current = { minHeight: `calc(100vh - ${h}px)` };
  }, []);

  const state = {
    blockchain,
    getBlockchain,
    debt,
    info,
    settings,
    symbol
  };

  return (
    <StateProvider initialState={initialState} reducer={reducer}>
      <Provider value={state}>
        <Topbar />
        <div className="d-flex" style={styleRef.current}>
          <Nav id="sidebar" navbar>
            <AltheaNav page={page} />
          </Nav>
          <NoConnection />
          <div id="content">
            {!loading && <Router page={page} setPage={setPage} />}
          </div>
        </div>
      </Provider>
    </StateProvider>
  );
};
