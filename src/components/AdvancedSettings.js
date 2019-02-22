import React from "react";
import { useTranslation } from "react-i18next";

import Blockchain from "./Blockchain";

export default () => {
  let [t] = useTranslation();

  return (
    <div>
      <h1>{t("advancedSettings")}</h1>

      <Blockchain />
    </div>
  );
};
