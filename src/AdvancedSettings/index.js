import React from "react";
import { useTranslation } from "react-i18next";

import Blockchain from "./Blockchain";
import DaoFee from "./DaoFee";
import Notifications from "./Notifications";
import NodeInformation from "./NodeInformation";

export default () => {
  let [t] = useTranslation();

  return (
    <div>
      <h1 id="advancedPage">{t("advancedSettings")}</h1>

      <Notifications />
      <Blockchain />
      <DaoFee />
      <NodeInformation />
    </div>
  );
};
