import React, { useEffect } from "react";
import { Progress } from "reactstrap";
import { useStore } from "store";
import Login from "./Login";

import {
  Frontpage,
  RouterSettings,
  Finances,
  SellingBandwidth,
  Settings,
  AdvancedSettings,
  Endpoints,
  DevicesOnLan,
  ExitData,
} from "./pages";

let routes = {
  dashboard: <Frontpage />,
  "router-settings": <RouterSettings />,
  finances: <Finances />,
  "selling-bandwidth": <SellingBandwidth />,
  advanced: <AdvancedSettings />,
  settings: <Settings />,
  endpoints: <Endpoints />,
  devices: <DevicesOnLan />,
  network: <ExitData />,
};

const Router = ({ page, setPage, setOpen }) => {
  const [{ authenticated, initialized }] = useStore();

  useEffect(() => {
    const getPage = () => {
      let page = window.location.hash.substr(1);
      setPage(page);
      setOpen(false);
      window.document.body.scrollTop = 0;
      window.document.documentElement.scrollTop = 0;
    };

    getPage();
    window.addEventListener("hashchange", getPage, false);
  }, [setOpen, setPage]);

  if (!authenticated) return <Login />;
  if (!initialized) return <Progress animated color="primary" value="100" />;
  if (routes[page]) return routes[page];
  else return <Frontpage />;
};

export default Router;
