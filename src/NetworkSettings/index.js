import React from "react";
import { useTranslation } from "react-i18next";

import Exits from "./Exits";
import Subnet from "./Subnet";

export default () => {
  const [t] = useTranslation();

  return (
    <div>
      <h1>{t("networkConnection")}</h1>
      <Exits />
      <Subnet />
    </div>
  );
};
