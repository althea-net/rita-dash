import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import { actions, connect } from "../store";
import PriceForm from "./PriceForm";
import QualityForm from "./QualityForm";
import Error from "./Error";
import Success from "./Success";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import AdvancedSettings from "./AdvancedSettings";
import { BigNumber } from "bignumber.js";
import updown from "../images/up_down.png";

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
    let [depositing, setDepositing] = useState(false);
    let [withdrawing, setWithdrawing] = useState(false);

    useEffect(() => {
      actions.getInfo();
      let timer = setInterval(actions.getInfo, 10000);
      return () => clearInterval(timer);
    }, []);

    let [t] = useTranslation();

    let balance = BigNumber(info.balance.toString())
      .div(weiPerEth)
      .toFixed(4);

    if (!(info && settings)) return null;
    return (
      <div id="payments-main">
        <h1 id="payments-title">{t("payments")}</h1>

        <Error error={factorError} />
        <Error error={priceError} />
        <Success message={withdrawalSuccess} />

        <Deposit depositing={depositing} />
        <Withdraw withdrawing={withdrawing} />

        <Card style={{ height: "100%" }}>
          <CardBody className="d-flex">
            <div
              className="pr-4 w-50 d-flex flex-column justify-content-between"
              style={{ borderRight: "1px solid #dadada" }}
            >
              <div className="d-flex justify-content-between">
                <h4>{t("currentBalance")}</h4>
                <h4>
                  {balance} {symbol}
                </h4>
              </div>
              <div className="d-flex">
                <Button
                  color="primary"
                  onClick={() => setDepositing(true)}
                  style={{ width: 150 }}
                >
                  {t("topUp")}
                </Button>
                <Button
                  className="ml-2"
                  color="primary"
                  onClick={() => setWithdrawing(true)}
                  style={{ width: 150 }}
                >
                  {t("withdraw")}
                </Button>
              </div>
            </div>
            <div className="pl-4 w-50 d-flex">
              <div className="pr-2">
                <img src={updown} alt="Upload/Download" />
              </div>
              <p>
                Based on your average usage of 8.4 GB per month, your balance
                will provide you with an estimated <strong>16 weeks</strong> of
                service.
              </p>
            </div>
          </CardBody>
        </Card>
        <PriceForm t={t} />
        <QualityForm />
        <AdvancedSettings />
      </div>
    );
  }
);
