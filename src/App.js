import React, { useEffect, useState } from "react";
import { Nav } from "reactstrap";
import AltheaNav from "./Layout/Nav";
import Topbar from "./Layout/Topbar";
import { NoConnection } from "utils";
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

    let infoPoll = setInterval(actions.getInfo, 5000);
    let versionPoll = setInterval(actions.getVersion, 2000);

    return () => {
      clearInterval(infoPoll);
      clearInterval(versionPoll);
    };
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
