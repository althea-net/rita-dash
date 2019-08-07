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

const Finances = () => {
  const [t] = useTranslation();
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [{ balance, symbol }, dispatch] = useStore();

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;

      (async () => {
        try {
          const usage = await get("/usage/client", true, 10000, signal);
          if (usage instanceof Error) return;
          dispatch({ type: "usage", usage });
        } catch (e) {}
      })();

      return () => controller.abort();
    },
    [dispatch]
  );

  const decimals = symbol === "USD" ? 2 : 4;

  return (
    <Card>
      <Heading
        title={t("finances")}
        link="#finances"
        linkText={t("reviewFinances")}
      />

      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <div className="d-flex" style={{ marginTop: -30 }}>
        <div
          className="d-flex justify-content-between pr-lg-4 mx-auto mb-3 h-100"
          style={{ marginTop: 30 }}
        >
          <div style={{ paddingLeft: 20 }}>
            <h5
              id="balance"
              className="mx-auto text-center w-100"
              style={{ color: "#999" }}
            >
              {t("currentBalance")} {symbol === "USD" && "$"}
            </h5>
            <h3 className="text-center">
              {toEth(balance, decimals)}{" "}
              <span style={{ fontSize: 20 }}>{symbol}</span>
            </h3>
            <div className="d-flex justify-content-center mt-auto">
              <Button
                color="primary"
                id="deposit"
                onClick={() => setDepositing(true)}
                style={{ minWidth: 130 }}
                className="mr-3"
              >
                {t("topUp")}
              </Button>
              <Button
                color="primary"
                id="withdraw"
                onClick={() => setWithdrawing(true)}
                style={{ minWidth: 130 }}
              >
                {t("withdraw")}
              </Button>
            </div>
          </div>
        </div>
        <Warning />
      </div>
      <UsageMetrics />
    </Card>
  );
};

export default Finances;
