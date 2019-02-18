import React, { useEffect, useState } from "react";
import { Nav } from "reactstrap";
import AltheaNav from "./Nav";
import Topbar from "./Topbar";
import NoConnection from "./NoConnection";
import Backend from "../libs/backend";
import Router from "../Router";
import { actions } from "../store";
const backend = new Backend();

export default () => {
  const [page, setPage] = useState("dashboard");

  useEffect(() => {
    actions.getBlockchain();
    actions.getInfo();
    actions.getSettings();
    let timer = setInterval(backend.getVersion, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Topbar />
      <div id="content">
        <Nav id="sidebar" navbar>
          <AltheaNav page={page} />
        </Nav>
        <NoConnection />
        <Router page={page} setPage={setPage} />
      </div>
    </>
  );
};
