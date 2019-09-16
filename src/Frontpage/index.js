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
      <div className="d-flex flex-wrap mb-2">
        <div>
          <h2 id="frontPage" className="mb-0">
            {t("welcome")}
          </h2>
          <p id="version">{t("version", { version, ritaVersion })}</p>
        </div>
        <ConnectionStatus />
      </div>
      <GettingStarted />
      <Finances />
    </>
  );
};

export default Frontpage;
