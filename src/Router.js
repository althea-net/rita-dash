import React, { useCallback, useEffect } from "react";

import {
  Billing,
  Frontpage,
  AdvancedSettings,
  Neighbors,
  RouterSettings,
  NetworkSettings,
  Payments
} from "./pages";

let routes = {
  dashboard: <Frontpage />,
  neighbors: <Neighbors />,
  "router-settings": <RouterSettings />,
  "network-settings": <NetworkSettings />,
  billing: <Billing />,
  payments: <Payments />,
  advanced: <AdvancedSettings />
};

export default ({ page, setPage }) => {
  const getPage = useCallback(
    () => {
      let page = window.location.hash.substr(1);
      setPage(page);
    },
    [setPage]
  );

  useEffect(
    () => {
      getPage();
      window.addEventListener("hashchange", getPage, false);
    },
    [getPage]
  );

  if (routes[page]) return routes[page];
  else return <Frontpage />;
};
