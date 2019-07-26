import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, Heading, Left, Right } from "ui";

import padlock from "../images/padlock.svg";

import Account from "./Account";
import Deposit from "../Deposit";
import Withdraw from "../Withdraw";

const Finances = () => {
  const [t] = useTranslation();

  const [depositing, setDepositing] = useState(false);
  const [withdrawing, setWithdrawing] = useState(false);

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
        <Account />
      </Left>
      <Right>
        <div className="d-flex w-100 justify-content-around">
          <img src={padlock} alt="Padlock Symbol" style={{ marginRight: 10 }} />
          <div className="my-auto" style={{ color: "gray" }}>
            {t("backupYourWallet")}
          </div>
        </div>
      </Right>
    </Card>
  );
};

export default Finances;
