import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import Deposit from "./Deposit";
import Withdraw from "./Withdraw";

import { Btn, Card, Left, Right } from "./ui";
import { Context } from "../store";
import updown from "../images/up_down.png";

export default () => {
  let [t] = useTranslation();

  let [depositing, setDepositing] = useState(false);
  let [withdrawing, setWithdrawing] = useState(false);

  let {
    state: { balance, symbol }
  } = useContext(Context);

  return (
    <Card>
      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <Left>
        <div className="d-flex justify-content-between">
          <h4>{t("currentBalance")}</h4>
          <h4>
            {balance} {symbol}
          </h4>
        </div>
        <div className="d-flex justify-content-center">
          <Btn onClick={() => setDepositing(true)}>{t("topUp")}</Btn>
          <Btn onClick={() => setWithdrawing(true)}>{t("withdraw")}</Btn>
        </div>
      </Left>
      <Right>
        <div className="pr-2">
          <img src={updown} alt="Upload/Download" />
        </div>
        <p>
          Based on your average usage of 8.4 GB per month, your balance will
          provide you with an estimated <strong>16 weeks</strong> of service.
        </p>
      </Right>
    </Card>
  );
};
