import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { BigNumber } from "bignumber.js";

import { Card, Left, Right } from "ui";

import { get, useStore } from "store";

import Deposit from "../Deposit";
import Withdraw from "../Withdraw";

const weiPerEth = BigNumber("1000000000000000000");
const bytesPerGb = BigNumber("1000000000");
const secondsInMonth = BigNumber("2592000");

const Prices = () => {
  const [{ symbol }] = useStore();
  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);
  const [prices, setPrices] = useState([]);
  const [t] = useTranslation();

  const readableExitPrice = BigNumber(prices.exitDestPrice)
    .div(weiPerEth)
    .times(bytesPerGb)
    .toString();
  const readableDAOPrice = BigNumber(prices.daoFee)
    .times(secondsInMonth)
    .div(weiPerEth)
    .toFixed(0)
    .toString();

  const organizerFeeCopy = t("organizerFeeContent", {
    readableDAOPrice,
    symbol
  });
  const bandwidthPriceCopy = t("bandwidthPriceContent", {
    readableExitPrice,
    symbol
  });
  const pricesCopy = t("pricesCopy");

  useEffect(() => {
    (async () => {
      try {
        let prices = await get("/prices");
        if (!(prices instanceof Error)) setPrices(prices);
      } catch {}
    })();
  }, []);

  return (
    <Card>
      <div className="col-12 px-0">
        <h4>{t("Prices")}</h4>
      </div>
      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <Left>
        <div className="bandwidth">
          <h5>
            <font color="gray">{t("bandwidthPriceName")}</font>
            {bandwidthPriceCopy}
          </h5>
        </div>
        <div className="orgfee">
          <h5>
            <font color="gray">{t("organizerFeeName")}</font>
            {organizerFeeCopy}
          </h5>
        </div>
      </Left>
      <Right>
        <div className="priceGuide">
          <p> {pricesCopy} </p>
        </div>
      </Right>
    </Card>
  );
};

export default Prices;
