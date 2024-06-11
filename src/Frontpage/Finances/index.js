import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Heading } from "ui";
import { Button } from "reactstrap";
import { toEth } from "utils";
import { get, useStore } from "store";

import Deposit from "../../Deposit";
import Withdraw from "../../Withdraw";
import UsageMetrics from "./UsageMetrics";
import Warning from "./Warning";
import FundingStatus from "../../FundingStatus";

const Finances = () => {
  const [t] = useTranslation();
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [localization, setLocalization] = useState([]);

  const [{ balance, status, symbol }, dispatch] = useStore();

  const decimals = symbol === "Dai" ? 2 : 4;

  let symbol_or_star =
    symbol === "Dai" && !localization.displayCurrencySymbol ? "◈" : symbol;

  let dollar_or_nothing =
    symbol === "Dai" && localization.displayCurrencySymbol ? "$" : "";

  // the amount of debt where we display a user warning about money being
  // withdrawn on the next deposit. This will hide the backup wallet warning
  // if it is still being shown
  const daiThreshold = 0.5;
  // $5 at $210/eth
  const ethThreshold = 0.02;
  let threshold;
  if (symbol === "Dai") {
    threshold = daiThreshold;
  } else {
    threshold = ethThreshold;
  }

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        let localization = await get("/localization");
        if (!(localization instanceof Error)) setLocalization(localization);

        const usage = await get("/usage/client", true, 10000, signal);
        if (usage instanceof Error) return;
        dispatch({ type: "usage", usage });
      } catch (e) {}
    })();

    return () => controller.abort();
  }, [dispatch]);

  let balanceDisplay;
  if (balance != null) {
    balanceDisplay = (
      <>
        {symbol === "Dai" && localization.displayCurrencySymbol ? "$" : ""}
        {toEth(balance, decimals)}{" "}
        <span style={{ fontSize: 20 }}>{symbol_or_star}</span>
      </>
    );
  } else {
    balanceDisplay = "Loading...";
  }

  return (
    <Card>
      <Heading
        title={t("finances")}
        link="#finances"
        linkText={t("reviewFinances")}
      />

      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <div
        className="d-flex flex-wrap flex-md-nowrap w-100"
        style={{ marginTop: -10 }}
      >
        <div
          className="pr-lg-4 mx-auto mb-3 flex-grow col-md-6"
          style={{ marginTop: 30 }}
        >
          <h5
            id="balance"
            className="mx-auto text-center w-100 mb-2"
            style={{ color: "#777", fontSize: 18 }}
          >
            {t("currentBalance")}
          </h5>
          <h2 className="text-center mb-3">{balanceDisplay}</h2>
          <div className="d-flex justify-content-center mt-auto">
            <Button
              color="primary"
              id="deposit"
              onClick={() => setDepositing(true)}
              style={{ minWidth: 130 }}
              className="mr-3"
            >
              {t("addFunds")}
            </Button>
            <Button
              color="primary"
              id="withdraw"
              onClick={() => setWithdrawing(true)}
              style={{ minWidth: 130 }}
              disabled={!status || status.key !== "noOp"}
            >
              {t("withdraw")}
            </Button>
          </div>

          <FundingStatus />
        </div>
        {(
          <Warning />
        )}
      </div>
      <UsageMetrics />
    </Card>
  );
};

export default Finances;
