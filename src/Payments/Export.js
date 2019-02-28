import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { get } from "store";

export default ({ open, setOpen }) => {
  let [t] = useTranslation();
  let [copied, setCopied] = useState(false);
  let [privateKey, setPrivateKey] = useState("");

  let init = async () => {
    let { ethPrivateKey } = await get("/eth_private_key");
    setPrivateKey(ethPrivateKey);
  };

  return (
    <Modal isOpen={open} centered toggle={() => setOpen(!open)} onOpened={init}>
      <ModalHeader>{t("exportPrivateKey")}</ModalHeader>
      <ModalBody>
        <p>{t("saveKey")}</p>
        <Card className="mb-4">
          <CardBody className="d-flex">
            <h5 style={{ wordBreak: "break-word" }}>{privateKey}</h5>
            <CopyToClipboard text={privateKey} onCopy={() => setCopied(true)}>
              <FontAwesomeIcon
                size="lg"
                icon="copy"
                style={{ cursor: "pointer", marginLeft: 10 }}
              />
            </CopyToClipboard>
            {copied && <p className="ml-2">{t("copied")}</p>}
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
};
