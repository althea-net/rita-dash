import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Btn, Card, Heading } from "ui";
import { toEth } from "utils";

import { get, useStore } from "store";

import exclamation from "images/exclamation.svg";

import Deposit from "../Deposit";
import Withdraw from "../Withdraw";

const AbortController = window.AbortController;

const Finances = () => {
  const [t] = useTranslation();

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
    <>
      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <div style={{ paddingLeft: 20 }} className="text-center">
        <h5 style={{ color: "gray", fontSize: 18 }} className="mb-3">
          {t("currentBalance")}
        </h5>
        <h4 id="balance" className="w-100 mb-3">
          {symbol === "USD" && "$"}
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
    </>
  );
};

export default Finances;
