import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Context } from "../store";

import Finances from "./Finances";
import UsageMetrics from "./UsageMetrics";
import NetworkConnection from "./NetworkConnection";
import NodeInformation from "./NodeInformation";

const Frontpage = () => {
  let [t] = useTranslation();
  let {
    state: {
      info: { ritaVersion, version }
    }
  } = useContext(Context);

  return (
    <>
      <h1>{t("welcome")}</h1>
      <p>{t("version", { version, ritaVersion })}</p>
      <Finances />
      <UsageMetrics />
      <NetworkConnection />
      <NodeInformation />
    </>
  );
};

export default Frontpage;
