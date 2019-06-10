import React, { useEffect } from "react";
import { useStore } from "store";
import Login from "./Login";

import {
  Billing,
  Endpoints,
  Frontpage,
  AdvancedSettings,
  RouterSettings,
  NetworkSettings,
  Payments,
  RelaySettings
} from "./pages";

let routes = {
  dashboard: <Frontpage />,
  "router-settings": <RouterSettings />,
  "network-settings": <NetworkSettings />,
  billing: <Billing />,
  payments: <Payments />,
  advanced: <AdvancedSettings />,
  endpoints: <Endpoints />,
  "relay-settings": <RelaySettings />
};

const Router = ({ page, setPage, setOpen }) => {
  const [{ authenticated }] = useStore();

  useEffect(
    () => {
      const getPage = () => {
        let page = window.location.hash.substr(1);
        setPage(page);
        setOpen(false);
        window.document.body.scrollTop = 0;
        window.document.documentElement.scrollTop = 0;
      };

      getPage();
      window.addEventListener("hashchange", getPage, false);
    },
    [setOpen, setPage]
  );

  if (!authenticated) return <Login />;
  if (routes[page]) return routes[page];
  else return <Frontpage />;
};

export default Router;
