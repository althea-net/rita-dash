import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import AppContext from "store/App";
import { Provider } from "store/Usage";
import { get } from "store";

import Finances from "./Finances";
import NodeInformation from "./NodeInformation";
import UsageMetrics from "./UsageMetrics";

const AbortController = window.AbortController;

const Frontpage = () => {
  const [t] = useTranslation();
  const [usage, setUsage] = useState([]);

  const {
    info: { ritaVersion, version }
  } = useContext(AppContext);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const res = await get("/usage/client", true, 10000, signal);
        if (res instanceof Error) return;
        setUsage(res);
      } catch (e) {}
    })();

    return () => controller.abort();
  }, []);

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
