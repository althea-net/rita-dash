import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "store";
import { BigNumber } from "bignumber.js";

import Account from "../Frontpage/Account";
import PriceForm from "./PriceForm";
import QualityForm from "./QualityForm";
import PrivateKeys from "./PrivateKeys";

import { Error, Success } from "utils";

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
    let [t] = useTranslation();

    let balance = BigNumber(info.balance.toString())
      .div(weiPerEth)
      .toFixed(4);

    if (!(info && settings)) return null;
    return (
      <div>
        <h1 id="paymentsPage">{t("payments")}</h1>

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
