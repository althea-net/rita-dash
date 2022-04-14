/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useTranslation } from "react-i18next";

import Exits from "./Exits";
import RouterNickname from "./RouterNickname";
import DashboardPassword from "./DashboardPassword";
import Notifications from "./Notifications";
import Firmware from "./Firmware";
import DebuggingData from "./DebuggingData";

export default () => {
  const [t] = useTranslation();

  return (
    <div>
      <h2 id="networkPage">{t("settings")}</h2>
      <RouterNickname />
      <DashboardPassword />
      <Notifications />
      <Exits />
      <div
        className="d-flex flex-wrap"
        style={{ justifyContent: "space-evenly" }}
      >
        <Firmware />
        <DebuggingData />
      </div>
    </div>
  );
};
