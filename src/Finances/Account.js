import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "reactstrap";

import { toEth } from "utils";

import { get, useStore } from "store";

import Deposit from "../Deposit";
import Withdraw from "../Withdraw";

const AbortController = window.AbortController;

const Finances = () => {
  const [t] = useTranslation();

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [{ balance, status, symbol }, dispatch] = useStore();
  const [localization, setLocalization] = useState([]);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

    (async () => {
      try {
        const usage = await get("/usage/client", true, 10000, signal);
        let localization = await get("/localization");
        if (!(localization instanceof Error)) setLocalization(localization);
        if (usage instanceof Error) return;
        dispatch({ type: "usage", usage });
      } catch (e) {}
    })();

    return () => controller.abort();
  }, [dispatch]);

  const decimals = symbol === "Dai" ? 2 : 4;

  return (
    <>
      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <div style={{ paddingLeft: 20 }} className="text-center my-auto">
        <h5 style={{ color: "gray", fontSize: 18 }} className="mb-3">
          {t("currentBalance")}
        </h5>
        <h4 id="balance" className="w-100 mb-2">
          {symbol === "Dai" && localization.displayCurrencySymbol ? "$" : ""}
          {toEth(balance, decimals)}{" "}
          {symbol === "Dai" && !localization.displayCurrencySymbol
            ? "◈"
            : symbol}
        </h4>
        <div className="d-flex justify-content-center">
          <Button
            color="primary"
            id="deposit"
            className="mr-3"
            onClick={() => setDepositing(true)}
          >
            {t("addFunds")}
          </Button>
          <Button
            color="primary"
            id="withdraw"
            onClick={() => setWithdrawing(true)}
            disabled={!status || status.key !== "noOp"}
          >
            {t("withdraw")}
          </Button>
        </div>
      </div>
    </>
  );
};

export default Finances;
