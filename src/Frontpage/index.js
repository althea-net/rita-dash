import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "store";

import Finances from "./Finances";
import GettingStarted from "./GettingStarted";
import ConnectionStatus from "./ConnectionStatus";

const Frontpage = () => {
  const [t] = useTranslation();
  const [{ ritaVersion, version }] = useStore();

  return (
    <>
      <div className="d-flex">
        <h2 id="frontPage">{t("welcome")}</h2>
        <ConnectionStatus />
      </div>
      <p id="version">{t("version", { version, ritaVersion })}</p>
      <GettingStarted />
      <Finances />
    </>
  );
};

export default Frontpage;
