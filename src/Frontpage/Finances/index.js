import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Btn, Card, Heading, Right } from "ui";
import { toEth } from "utils";
import { get, useStore } from "store";

import exclamation from "images/exclamation.svg";

import Deposit from "../../Deposit";
import Withdraw from "../../Withdraw";
import UsageMetrics from "./UsageMetrics";

const Finances = () => {
  let [t] = useTranslation();
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [{ balance, symbol }, dispatch] = useStore();
  const [dismissed, setDismissed] = useState(false);

  const dismiss = e => {
    e.preventDefault();
    setDismissed(true);
  };

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
      <div className="d-flex justify-content-between pr-lg-4 mx-auto">
        <div style={{ paddingLeft: 20 }}>
          <h4 id="balance" className="mx-auto text-center w-100">
            {t("currentBalance")} {symbol === "USD" && "$"}
            {toEth(balance, decimals)} {symbol}
          </h4>
          <div className="d-flex justify-content-center">
            <Btn id="deposit" onClick={() => setDepositing(true)}>
              {t("topUp")}
            </Btn>
            <Btn id="withdraw" onClick={() => setWithdrawing(true)}>
              {t("withdraw")}
            </Btn>
          </div>
        </div>
      </div>
      {dismissed || (
        <Right>
          <div className="d-flex flex-column">
            <div className="d-flex w-100 justify-content-around">
              <img
                src={exclamation}
                alt="Exclamation Mark Symbol"
                style={{ marginRight: 10 }}
              />
              <div className="my-auto" style={{ color: "gray" }}>
                {t("backupYourWallet")}
              </div>
            </div>
            <div className="ml-auto">
              <a href="#dismiss" onClick={dismiss}>
                {t("dismissWarning")}
              </a>
            </div>
          </div>
        </Right>
      )}
      <UsageMetrics />
    </Card>
  );
};

export default Finances;
