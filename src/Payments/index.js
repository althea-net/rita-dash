import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { actions, connect } from "store";
import { BigNumber } from "bignumber.js";

import Account from "../Frontpage/Account";
import PriceForm from "./PriceForm";
import QualityForm from "./QualityForm";
import PrivateKeys from "./PrivateKeys";

import Error from "Utils/Error";
import Success from "Utils/Success";

const weiPerEth = BigNumber("1000000000000000000");

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

    let balance = BigNumber(info.balance.toString())
      .div(weiPerEth)
      .toFixed(3);

    if (!(info && settings)) return null;
    return (
      <div>
        <h1>{t("payments")}</h1>

        <Error error={factorError} />
        <Error error={priceError} />
        <Success message={withdrawalSuccess} />

        <Account balance={balance} />
        <QualityForm />
        <PriceForm />
        <PrivateKeys balance={balance} symbol={symbol} />
      </div>
    );
  }
);
