import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import Deposit from "../Payments/Deposit";
import Withdraw from "../Payments/Withdraw";

import { Btn, Card, Left, Right } from "ui";
import { toEth } from "utils";

import AppContext from "store/App";
import { get, init } from "store";

import updown from "../images/up_down.png";
import { BigNumber } from "bignumber.js";

export default () => {
  const [t] = useTranslation();

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [usage, setUsage] = useState([]);

  init(async () => {
    const res = await get("/usage/client");
    if (res instanceof Error) return;
    setUsage(res);
  });

  const {
    info: { balance, localFee },
    symbol
  } = useContext(AppContext);

  console.log(usage);
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

  return (
    <Card>
      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <Left>
        <div style={{ paddingLeft: 20 }}>
          <div className="d-flex justify-content-between">
            <h4 className="mr-1">{t("currentBalance")}</h4>
            <h4 id="balance">
              {toEth(balance)} {symbol}
            </h4>
          </div>
          <div className="d-flex justify-content-center">
            <Btn id="deposit" onClick={() => setDepositing(true)}>
              {t("topUp")}
            </Btn>
            <Btn id="withdraw" onClick={() => setWithdrawing(true)}>
              {t("withdraw")}
            </Btn>
          </div>
        </div>
      </Left>
      <Right>
        <div className="pr-2">
          <img src={updown} alt="Upload/Download" />
        </div>
        <p>
          Based on your average usage of {perMonthUsage} GB per month, your
          balance will provide you with an estimated{" "}
          <strong>{weeksOfService} weeks</strong> of service.
        </p>
      </Right>
    </Card>
  );
};
