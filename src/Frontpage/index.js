import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "store/App";
import { Provider } from "store/Usage";
import { get, init } from "store";

import Finances from "./Finances";
import NodeInformation from "./NodeInformation";
import UsageMetrics from "./UsageMetrics";

const Frontpage = () => {
  const [t] = useTranslation();
  const [usage, setUsage] = useState([]);

  const {
    info: { ritaVersion, version }
  } = useContext(AppContext);

  init(async () => {
    setUsage(await get("/usage/client"));
  });

  return (
    <Provider value={{ usage }}>
      <h1 id="frontPage">{t("welcome")}</h1>
      <p id="version">{t("version", { version, ritaVersion })}</p>
      <Finances />
      <UsageMetrics />
      <NodeInformation />
    </Provider>
  );
};

export default Frontpage;
