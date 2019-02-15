import React, { useEffect, useState } from "react";
import { Nav } from "reactstrap";
import Sidebar from "./Sidebar";
import AltheaNav from "./Nav";
import Topbar from "./Topbar";
import {
  Billing,
  Frontpage,
  AdvancedSettings,
  RouterSettings,
  NetworkSettings,
  Payments
} from "../pages";
import NoConnection from "./NoConnection";
import CameraUI from "./CameraUI";
import { actions, connect } from "../store";
import "../icons";
import { Address, Balance, CurrencySymbol } from "../contexts";
import Backend from "../libs/backend";
import { BigNumber } from "bignumber.js";
const backend = new Backend();

const main = {
  width: "100%",
  maxWidth: 800,
  padding: 10
};

export default () => {
  let [current, setCurrent] = useState(window.location.hash.substr(1));
  let [address, setAddress] = useState("");
  let [symbol, setSymbol] = useState("");
  let [balance, setBalance] = useState("");

  const onHashChange = () => {
    let page = window.location.hash.substr(1);
    setCurrent(page);
    actions.changePage(page);
  };

  useEffect(async () => {
    let weiPerEth = BigNumber("1000000000000000000");
    let symbols = {
      Ethereum: "ETH",
      Rinkeby: "tETH",
      Xdai: "DAI"
    };

    let info = await backend.getInfo();
    let blockchain = await backend.getBlockchain();
    let balance = BigNumber(info.balance.toString())
      .div(weiPerEth)
      .toFixed(3);
    setSymbol(symbols[blockchain]);
    setBalance(balance);
    setAddress(info.address);

    onHashChange();
    window.addEventListener("hashchange", onHashChange, false);
    actions.getBlockchain();
    actions.getSettings();
    actions.getInfo();
    actions.getVersion();
    let timer = setInterval(actions.getVersion, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <React.Fragment>
      <div className="App">
        <Topbar />
        <Sidebar>
          <Nav id="sidebar" navbar>
            <AltheaNav current={current} />
          </Nav>
          <NoConnection />
          <div style={main}>
            <Balance.Provider value={balance}>
              <Address.Provider value={address}>
                <CurrencySymbol.Provider value={symbol}>
                  <Page page={current} />
                </CurrencySymbol.Provider>
              </Address.Provider>
            </Balance.Provider>
          </div>
        </Sidebar>
      </div>
      <CameraUI />
    </React.Fragment>
  );
};

const Page = connect(["page"])(({ page, state, t }) => {
  switch (page) {
    case "advanced":
      return <AdvancedSettings />;
    case "router-settings":
      return <RouterSettings />;
    case "network-settings":
      return <NetworkSettings />;
    case "billing":
      return <Billing />;
    case "payments":
      return <Payments />;
    case "dashboard":
    default:
      return <Frontpage />;
  }
});
