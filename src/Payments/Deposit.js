import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import QR from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Context } from "store";

const qrStyle = { height: "auto", width: 300 };
const iconStyle = { cursor: "pointer", marginLeft: 10 };
const addressStyle = { wordBreak: "break-word" };

export default ({ open, setOpen }) => {
  let [t] = useTranslation();
  let [copied, setCopied] = useState(false);
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
            <h5 id="walletAddr" style={addressStyle}>{address}</h5>
            <CopyToClipboard id="copyWalletAddr" text={address} onCopy={() => setCopied(true)}>
              <FontAwesomeIcon size="lg" icon="copy" style={iconStyle} />
            </CopyToClipboard>
            {copied && <p className="ml-2">{t("copied")}</p>}
          </CardBody>
        </Card>
        <div className="w-100 text-center">
          <QR style={qrStyle} value={address} />
        </div>
      </ModalBody>
    </Modal>
  );
};
