import React from "react";
import { useTranslation } from "react-i18next";

import BandwidthSelling from "./BandwidthSelling";
import Blockchain from "./Blockchain";
import DaoFee from "./DaoFee";
import Notifications from "./Notifications";
import NodeInformation from "./NodeInformation";

export default () => {
  let [t] = useTranslation();

  return (
    <div>
      <h2 id="advancedPage">{t("advancedSettings")}</h2>

      <Notifications />
      <div className="d-flex" style={{ justifyContent: "space-evenly" }}>
        <BandwidthSelling />
        <Blockchain />
      </div>
      <DaoFee />
      <NodeInformation />
    </div>
  );
};
