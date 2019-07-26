import React from "react";
import { useTranslation } from "react-i18next";

import Exits from "./Exits";
import RouterNickname from "./RouterNickname";
import DashboardPassword from "./DashboardPassword";
import Subnet from "./Subnet";
import Firmware from "./Firmware";
import DebuggingData from "./DebuggingData";

export default () => {
  const [t] = useTranslation();

  return (
    <div>
      <h1 id="networkPage">{t("networkConnection")}</h1>
      <RouterNickname />
      <DashboardPassword />
      <Exits />
      <Subnet />
      <div className="d-flex" style={{ justifyContent: "space-evenly" }}>
        <Firmware />
        <DebuggingData />
      </div>
    </div>
  );
};
