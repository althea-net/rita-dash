import React, { Fragment, useEffect, useState } from "react";
import { Nav } from "reactstrap";
import Sidebar from "./Sidebar";
import AltheaNav from "./Nav";
import Topbar from "./Topbar";
import NoConnection from "./NoConnection";
import CameraUI from "./CameraUI";
import { Provider } from "../Store";
import Backend from "../libs/backend";
import { BigNumber } from "bignumber.js";
import Router from "../Router";
const backend = new Backend();

export default () => {
  let [page, setPage] = useState("");
  let [address, setAddress] = useState("");
  let [symbol, setSymbol] = useState("");
  let [balance, setBalance] = useState("");
  let [version, setVersion] = useState("");

  const getPage = () => {
    let page = window.location.hash.substr(1);
    setPage(page);
  };

  const init = async () => {
    getPage();
    window.addEventListener("hashchange", getPage, false);

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

    let version = await backend.getVersion();

    setVersion(version);
    setSymbol(symbols[blockchain]);
    setBalance(balance);
    setAddress(info.address);
  };

  useEffect(() => {
    init();
    let timer = setInterval(backend.getVersion, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <Fragment>
      <Provider value={{ address, symbol, balance, version }}>
        <div className="App">
          <Topbar />
          <Sidebar>
            <Nav id="sidebar" navbar>
              <AltheaNav page={page} />
            </Nav>
            <NoConnection />
            <Router page={page} />
          </Sidebar>
        </div>
        <CameraUI />
      </Provider>
    </Fragment>
  );
};
