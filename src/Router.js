import React from "react";

import {
  Billing,
  Frontpage,
  AdvancedSettings,
  RouterSettings,
  NetworkSettings,
  Payments
} from "./pages";

let routes = {
  advanced: <AdvancedSettings />,
  "router-settings": <RouterSettings />,
  "network-settings": <NetworkSettings />,
  billing: <Billing />,
  payments: <Payments />,
  dashboard: <Frontpage />
};

export default ({ page }) => {
  if (routes[page]) return routes[page];
  else return <Frontpage />;
};
