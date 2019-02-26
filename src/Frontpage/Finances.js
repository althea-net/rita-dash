import React from "react";
import { useTranslation } from "react-i18next";
import { Heading } from "Utils/AltheaUI";

import Account from "./Account";

export default () => {
  let [t] = useTranslation();

  return (
    <div style={{ marginBottom: 40 }}>
      <Heading
        title={t("finances")}
        link="#payments"
        linkText={t("managePaymentSettings")}
      />
      <Account />
    </div>
  );
};
