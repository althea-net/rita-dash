import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import QR from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStore } from "store";
import { toEth } from "utils";

const qrStyle = { height: "auto", width: 300 };
const iconStyle = { cursor: "pointer", marginLeft: 10 };
const addressStyle = { fontSize: 16, wordBreak: "break-word" };

const Deposit = ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [copied, setCopied] = useState(false);

  const [{ address, debt, lowBalance, symbol }] = useStore();

  const debtEth = toEth(debt) * 2;

  const recommendedDeposit = `${debtEth} ${symbol}`;

  if (!(address && symbol)) return null;

  return (
    <Modal isOpen={open} centered toggle={() => setOpen(!open)}>
      <ModalHeader>
        {t("deposit")} {symbol}
      </ModalHeader>
      <ModalBody>
        <Card className="mb-4">
          <CardBody className="d-flex flex-wrap">
            <h5 style={addressStyle} id="walletAddr">
              {address}
              <CopyToClipboard
                text={address}
                onCopy={() => setCopied(true)}
                id="copyWalletAddr"
              >
                <FontAwesomeIcon
                  icon="copy"
                  style={iconStyle}
                  className="mr-2"
                />
              </CopyToClipboard>
              {copied && <span>{t("copied")}</span>}
            </h5>
          </CardBody>
        </Card>
        <div className="w-100 text-center mb-4">
          <QR style={qrStyle} value={address} />
        </div>
        {lowBalance &&
          debtEth > 0 &&
          t("recommendedDeposit", { recommendedDeposit })}
      </ModalBody>
    </Modal>
  );
};

export default Deposit;
