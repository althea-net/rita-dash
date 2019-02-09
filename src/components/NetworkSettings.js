import React from "react";
import { useTranslation } from "react-i18next";

import Exits from "./Exits";
import DaoSelection from "./DaoSelection";

export default (daoAddress, ipAddress) => {
  const [t] = useTranslation();

  return (
    <div>
      <h1>{t("networkConnection")}</h1>
      <DaoSelection />
      <Exits />
    </div>
  );
};
