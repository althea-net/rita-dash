import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { actions, connect } from "../store";
import { translate } from "react-i18next";
import QR from "qrcode.react";
import { BigNumber } from "bignumber.js";

const weiPerEth = BigNumber("1000000000000000000");

const Deposit = ({ state, t }) => {
  let { info, depositing, symbol } = state;
  let { address } = info;
  let balance = BigNumber(info.balance.toString())
    .div(weiPerEth)
    .toFixed(8);

  return (
    <div>
      <Modal isOpen={depositing} centered>
        <ModalHeader>{t("depositFunds")}</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody className="text-center">
              <h2>
                <span>{t("currentBalance")} </span>
                <span>
                  {balance} {symbol}
                </span>
              </h2>
              <QR
                style={{
                  height: "auto",
                  width: "100%"
                }}
                value={address}
              />
              <h3 className="p-4">{address}</h3>
            </CardBody>
            <CardFooter className="text-right">
              <Button onClick={actions.stopDepositing}>Close</Button>
            </CardFooter>
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default connect(["info", "depositing", "symbol"])(translate()(Deposit));
