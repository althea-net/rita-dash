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
  let balance = BigNumber(state.info.balance.toString())
    .div(weiPerEth)
    .toFixed(8);

  return (
    <div>
      <Modal isOpen={state.depositing} centered>
        <ModalHeader>{t("depositFunds")}</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody className="text-center">
              <h2>
                <span>{t("currentBalance")} </span>
                <span>{balance} ETH</span>
              </h2>
              <QR
                style={{
                  height: "auto",
                  width: "100%"
                }}
                value={state.info.address}
              />
              <h3 className="p-4">{state.info.address}</h3>
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

export default connect(["info", "depositing"])(translate()(Deposit));
