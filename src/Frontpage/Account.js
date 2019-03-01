import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import Deposit from "../Payments/Deposit";
import Withdraw from "../Payments/Withdraw";

import { Btn, Card } from "ui";
import { Context } from "store";

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
      <div style={{ paddingLeft: 20 }}>
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
      </div>
    </Card>
  );
};
