import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "store";

import Finances from "./Finances";
import GettingStarted from "./GettingStarted";
import NodeInformation from "./NodeInformation";
import UsageMetrics from "./UsageMetrics";

const Frontpage = () => {
  const [t] = useTranslation();
  const [{ ritaVersion, version }] = useStore();

  return (
    <>
      <h1 id="frontPage">{t("welcome")}</h1>
      <p id="version">{t("version", { version, ritaVersion })}</p>
      <GettingStarted />
      <Finances />
      <UsageMetrics />
      <NodeInformation />
    </>
  );
};

export default Frontpage;
