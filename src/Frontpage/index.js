import React, { useContext, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { actions } from "store";
import AppContext from "store/App";

import Finances from "./Finances";
import NodeInformation from "./NodeInformation";
import UsageMetrics from "./UsageMetrics";

const Frontpage = () => {
  let [t] = useTranslation();
  let {
    info: { ritaVersion, version }
  } = useContext(AppContext);

  useEffect(() => {
    actions.getSettings();
  }, []);

  return (
    <>
      <h1 id="frontPage">{t("welcome")}</h1>
      <p id="version">{t("version", { version, ritaVersion })}</p>
      <Finances />
      <UsageMetrics />
      <NodeInformation />
    </>
  );
};

export default Frontpage;
