import React, { useEffect, useState } from "react";
import { Nav } from "reactstrap";
import AltheaNav from "./Layout/Nav";
import Topbar from "./Layout/Topbar";
import NoConnection from "Utils/NoConnection";
import Router from "Router";
import { actions } from "store";

export default () => {
  const [page, setPage] = useState("dashboard");
  let style;

  useEffect(() => {
    let h = document.querySelector(".navbar").offsetHeight;
    style = { minHeight: `calc(100vh - ${h}px)` };

    actions.getBlockchain();
    actions.getInfo();
    actions.getSettings();
    let timer = setInterval(actions.getVersion, 2000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <Topbar />
      <div className="d-flex" style={style}>
        <Nav id="sidebar" navbar>
          <AltheaNav page={page} />
        </Nav>
        <NoConnection />
        <div id="content">
          <Router page={page} setPage={setPage} />
        </div>
      </div>
    </>
  );
};
