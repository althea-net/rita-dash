import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, Left, Right } from "ui";

import { get, useStore } from "store";
import { BigNumber } from "bignumber.js";

import updown from "../images/updown.svg";

import Deposit from "../Deposit";
import Withdraw from "../Withdraw";

import QualityForm from "./QualityForm";

const AbortController = window.AbortController;

const PurchasingBandwidth = () => {
  const [t] = useTranslation();

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [{ balance, localFee, usage }, dispatch] = useStore();

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

  return (
    <Card>
      <div className="col-12">
        <h3>{t("purchasingBandwidth")}</h3>
      </div>
      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <Left>
        <QualityForm />
      </Left>
      <Right>
        <div className="pr-2 mr-3 pt-2">
          <img src={updown} alt="Upload/Download" style={{ width: 80 }} />
        </div>
        <div>
          <p dangerouslySetInnerHTML={{ __html: usageCopy }} />
        </div>
      </Right>
    </Card>
  );
};

export default PurchasingBandwidth;
