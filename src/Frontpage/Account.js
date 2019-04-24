import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import Deposit from "../Payments/Deposit";
import Withdraw from "../Payments/Withdraw";

import { Btn, Card } from "ui";
import { Context } from "store";

export default () => {
  const [t] = useTranslation();

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

  const {
    state: { balance, symbol }
  } = useContext(Context);

  return (
    <Card>
      <Deposit open={depositing} setOpen={setDepositing} />
      <Withdraw open={withdrawing} setOpen={setWithdrawing} />
      <div style={{ paddingLeft: 20 }}>
        <div className="d-flex justify-content-between">
          <h4 className="mr-1">{t("currentBalance")}</h4>
          <h4 id="balance">
            {balance} {symbol}
          </h4>
        </div>
        <div className="d-flex justify-content-center">
          <Btn id="deposit" onClick={() => setDepositing(true)}>{t("topUp")}</Btn>
          <Btn id="withdraw" onClick={() => setWithdrawing(true)}>{t("withdraw")}</Btn>
        </div>
      </div>
    </Card>
  );
};
