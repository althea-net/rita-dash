import React from "react";
import { useTranslation } from "react-i18next";

import BandwidthSelling from "./BandwidthSelling";
import Blockchain from "./Blockchain";
import DaoFee from "./DaoFee";
import Notifications from "./Notifications";
import NodeInformation from "./NodeInformation";

import exclamation from "images/exclamation.svg";

export default () => {
  let [t] = useTranslation();

  return (
    <div>
      <h2 id="advancedPage">{t("advancedSettings")}</h2>

      <div className="d-flex mb-3">
        <img
          src={exclamation}
          alt={t("exclamationMark")}
          style={{ width: 40, marginTop: -12 }}
          className="mr-2"
        />
        <p>{t("theseSettings")}</p>
      </div>

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
