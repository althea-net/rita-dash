import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";
import Deposit from "./Deposit";
import Withdraw from "./Withdraw";
import updown from "../images/up_down.png";

import { Context } from "../store";

export default () => {
  let [t] = useTranslation();

  let [depositing, setDepositing] = useState(false);
  let [withdrawing, setWithdrawing] = useState(false);

  let {
    state: { balance, symbol }
  } = useContext(Context);

  return (
    <Card className="mb-4">
      <CardBody className="d-flex">
        <Deposit open={depositing} setOpen={setDepositing} />
        <Withdraw open={withdrawing} setOpen={setWithdrawing} />
        <div
          className="pr-4 w-50 d-flex flex-column justify-content-between"
          style={{ borderRight: "1px solid #dadada" }}
        >
          <div className="d-flex justify-content-between">
            <h4>{t("currentBalance")}</h4>
            <h4>
              {balance} {symbol}
            </h4>
          </div>
          <div className="d-flex">
            <Button
              color="primary"
              onClick={() => setDepositing(true)}
              style={{ fontWeight: "bold", width: 150 }}
            >
              {t("topUp")}
            </Button>
            <Button
              className="ml-2"
              color="primary"
              onClick={() => setWithdrawing(true)}
              style={{ fontWeight: "bold", width: 150 }}
            >
              {t("withdraw")}
            </Button>
          </div>
        </div>
        <div className="pl-4 w-50 d-flex">
          <div className="pr-2">
            <img src={updown} alt="Upload/Download" />
          </div>
          <p>
            Based on your average usage of 8.4 GB per month, your balance will
            provide you with an estimated <strong>16 weeks</strong> of service.
          </p>
        </div>
      </CardBody>
    </Card>
  );
};
