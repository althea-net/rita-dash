import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "store";

import Account from "../Frontpage/Account";
import DaoFee from "../AdvancedSettings/DaoFee";
import PriceForm from "./PriceForm";
import PrivateKeys from "./PrivateKeys";
import QualityForm from "./QualityForm";

import { Error, Success, toEth } from "utils";

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
    const [t] = useTranslation();
    const balance = toEth(info.balance);

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
        <DaoFee readonly={true} />
        <PrivateKeys balance={balance} symbol={symbol} />
      </div>
    );
  }
);
