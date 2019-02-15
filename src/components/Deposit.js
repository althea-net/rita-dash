import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import QR from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { Context } from "../store";

export default ({ open, setOpen }) => {
  let [t] = useTranslation();
  let {
    state: {
      info: { address },
      symbol
    }
  } = useContext(Context);

  if (!(address && symbol)) return null;

  return (
    <Modal isOpen={open} centered toggle={() => setOpen(!open)}>
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
