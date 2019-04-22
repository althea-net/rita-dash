import React from "react";
import { useTranslation } from "react-i18next";

import Blockchain from "./Blockchain";
import Notifications from "./Notifications";
import Firmware from "./Firmware";

export default () => {
  let [t] = useTranslation();

  return (
    <div>
      <h1 id="advancedPage">{t("advancedSettings")}</h1>

      <Notifications />
      <Blockchain />
      <Firmware />
    </div>
  );
};
