import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { actions, connect } from "../store";

import Account from "./Account";
import PriceForm from "./PriceForm";
import QualityForm from "./QualityForm";
import AdvancedSettings from "./AdvancedSettings";

import Error from "./Error";
import Success from "./Success";

export default connect([
  "factorError",
  "priceError",
  "withdrawalSuccess",
  "info",
  "settings",
  "symbol"
])(
  ({
    state: {
      factorError,
      priceError,
      withdrawalSuccess,
      info,
      settings,
      symbol
    }
  }) => {
    useEffect(() => {
      actions.getInfo();
      let timer = setInterval(actions.getInfo, 10000);
      return () => clearInterval(timer);
    }, []);

    let [t] = useTranslation();

    if (!(info && settings)) return null;
    return (
      <div>
        <h1>{t("payments")}</h1>

        <Error error={factorError} />
        <Error error={priceError} />
        <Success message={withdrawalSuccess} />

        <Account />
        <PriceForm />
        <QualityForm />
        <AdvancedSettings />
      </div>
    );
  }
);
