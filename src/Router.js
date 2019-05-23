import React, { useEffect } from "react";

import {
  Billing,
  Endpoints,
  Frontpage,
  AdvancedSettings,
  RouterSettings,
  NetworkSettings,
  Payments
} from "./pages";

let routes = {
  dashboard: <Frontpage />,
  "router-settings": <RouterSettings />,
  "network-settings": <NetworkSettings />,
  billing: <Billing />,
  payments: <Payments />,
  advanced: <AdvancedSettings />,
  endpoints: <Endpoints />
};

export default ({ page, setPage, setOpen }) => {
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

  if (routes[page]) return routes[page];
  else return <Frontpage />;
};
