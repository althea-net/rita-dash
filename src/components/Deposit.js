import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import QR from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default ({ depositing, setDepositing, info, symbol }) => {
  let [t] = useTranslation();

  let { address } = info;

  return (
    <Modal
      isOpen={depositing}
      centered
      toggle={() => setDepositing(!depositing)}
    >
      <ModalHeader>
        {t("deposit")} {symbol}
      </ModalHeader>
      <ModalBody>
        <Card className="mb-4">
          <CardBody className="d-flex">
            <h5 style={{ wordBreak: "break-word" }}>{address}</h5>
            <FontAwesomeIcon size="lg" icon="copy" style={{ marginLeft: 10 }} />
          </CardBody>
        </Card>
        <div className="w-100 text-center">
          <QR
            style={{
              height: "auto",
              width: 300
            }}
            value={address}
          />
        </div>
      </ModalBody>
    </Modal>
  );
};
