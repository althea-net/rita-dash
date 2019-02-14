import React from "react";
import { useTranslation } from "react-i18next";

import RouterCredentials from "./RouterCredentials";
import EmailNotifications from "./EmailNotifications";
import Firmware from "./Firmware";

export default () => {
  let [t] = useTranslation();

  return (
    <div>
      <h1>{t("advancedSettings")}</h1>

      <RouterCredentials />
      <EmailNotifications />
      <Firmware />
    </div>
  );
};
