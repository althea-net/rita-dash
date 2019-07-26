import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Btn, Card, Left, Right } from "ui";
import { toEth } from "utils";

import { get, useStore } from "store";
import { BigNumber } from "bignumber.js";

import exclamation from "images/exclamation.svg";
import updown from "../images/up_down.png";

import Deposit from "../Payments/Deposit";
import Withdraw from "../Payments/Withdraw";

const AbortController = window.AbortController;

const PurchasingBandwidth = () => {
  const [t] = useTranslation();

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [{ balance, localFee, usage, symbol }, dispatch] = useStore();
  const [dismissed, setDismissed] = useState(false);

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

  const totalUsage = usage.reduce((a, b) => {
    return a + b.up + b.down;
  }, 0);

  const weeksPerMonth = 4;
  const hoursPerDay = 24;
  const daysPerMonth = 30;

  const avgUsage = totalUsage / usage.length;
  const perMonthUsageBytes = avgUsage * hoursPerDay * daysPerMonth;
  const bytesPerGb = BigNumber("1000000000");
  const perMonthUsage = BigNumber(perMonthUsageBytes.toString())
    .div(bytesPerGb)
    .toFixed(0);

  const weeksOfService = BigNumber(balance)
    .div(localFee)
    .div(perMonthUsageBytes)
    .div(weeksPerMonth)
    .toFixed(0);

  const usageCopy =
    isNaN(perMonthUsage) || isNaN(weeksOfService) || usage.length < 720
      ? t("insufficientUsage")
      : weeksOfService < 1
        ? t("lessThanAWeek", { perMonthUsage })
        : t("averageUsage", { perMonthUsage, weeksOfService });

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
      <Left>
        <QualityForm />
      </Left>
      <Right>
        {dismissed || (
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
        )}
      </Right>
    </Card>
  );
};

export default PurchasingBandwidth;
