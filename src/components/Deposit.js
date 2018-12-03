import React from "react";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { connect } from "../store";
import { translate } from "react-i18next";
import QR from "qrcode.react";

const Deposit = ({ state, t }) => (
  <div>
    <span>{state.depositing.toString()}</span>
    <Modal isOpen={state.depositing} centered>
      <ModalHeader>{t("depositFunds")}</ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            <QR
              style={{
                height: "auto",
                width: "50%"
              }}
              value={state.info.address}
            />
            {state.info.address}
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  </div>
);

export default connect(["info", "depositing"])(translate()(Deposit));
