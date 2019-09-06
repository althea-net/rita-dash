import React from "react";
import { Right } from "ui";
import { useTranslation } from "react-i18next";

import { useStore } from "store";

import { toEth } from "utils";
import { BigNumber } from "bignumber.js";

const today = new Date();
const startOfThisMonth =
  new Date(today.getFullYear(), today.getMonth(), 1).getTime() / 3600000;
const startOfLastMonth =
  new Date(today.getFullYear(), today.getMonth() - 1, 1).getTime() / 3600000;
const bytesPerGb = BigNumber("1000000000");

const UsageMetrics = () => {
  const [t] = useTranslation();
  const [{ usage, symbol }] = useStore();

  const initialUsage = { usage: 0, cost: 0 };
  const sumUsage = (a, b) => {
    return {
      usage: a.usage + b.up + b.down,
      cost: a.cost + b.price * (b.up + b.down)
    };
  };

  const thisMonthData = usage
    .filter(i => i.index > startOfThisMonth)
    .reduce(sumUsage, initialUsage);

  const lastMonthData = usage
    .filter(i => i.index >= startOfLastMonth && i < startOfThisMonth)
    .reduce(sumUsage, initialUsage);

  const thisMonthUsage = BigNumber(thisMonthData.usage)
    .div(bytesPerGb)
    .toFixed(3);

  const thisMonthCost = BigNumber(toEth(thisMonthData.cost).toString()).toFixed(
    3
  );

  const lastMonthUsage = BigNumber(lastMonthData.usage)
    .div(bytesPerGb)
    .toFixed(3);

  const lastMonthCost = BigNumber(toEth(lastMonthData.cost)).toFixed(3);

  const format = n => (BigNumber(n).gt(0) ? n : "---");

  return (
    <div
      className="ml-0 row pt-4 w-100"
      style={{ borderTop: "1px solid #dadada" }}
    >
      <div className="d-flex flex-column justify-content-between pr-lg-4 col-md-6">
        <div className="d-flex flex-wrap justify-content-between w-100 text-center">
          <h5 className="w-100" style={{ color: "gray", fontSize: 18 }}>
            {t("monthToDate")}
          </h5>
          <div className="d-flex w-100 justify-content-around">
            <div>
              <h4 className="mb-1">{format(thisMonthUsage)} GB</h4>
              <div style={{ color: "#aaa" }}>{t("usage")}</div>
            </div>
            <div>
              <h4 className="mb-1">
                {format(thisMonthCost)} {symbol}
              </h4>
              <div style={{ color: "#aaa" }}>{t("cost")}</div>
            </div>
          </div>
        </div>
      </div>
      <Right>
        <div className="d-flex flex-wrap justify-content-between w-100 text-center">
          <h5 className="w-100" style={{ color: "gray", fontSize: 18 }}>
            {t("lastMonth")}
          </h5>
          <div className="d-flex w-100 justify-content-around">
            <div>
              <h4 className="mb-1">{format(lastMonthUsage)} GB</h4>
              <div style={{ color: "#aaa" }}>{t("usage")}</div>
            </div>
            <div>
              <div>
                <h4 className="mb-1">
                  {format(lastMonthCost)} {symbol}
                </h4>
              </div>
              <div style={{ color: "#aaa" }}>{t("cost")}</div>
            </div>
          </div>
        </div>
      </Right>
    </div>
  );
};

export default UsageMetrics;
