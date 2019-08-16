import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalHeader, ModalBody, Tooltip } from "reactstrap";
import QR from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useStore } from "store";
import { toEth } from "utils";

const qrStyle = { height: "auto", width: "80%" };

const Deposit = ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [copied, setCopied] = useState(false);

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [{ address, debt, lowBalance, symbol }] = useStore();

  const debtEth = toEth(debt) * 2;

  const recommendedDeposit = `${debtEth} ${symbol}`;

  if (!(address && symbol)) return null;

  return (
    <Modal isOpen={open} size="sm" centered toggle={() => setOpen(!open)}>
      <ModalHeader>{t("deposit")} ETH</ModalHeader>
      <ModalBody>
        <div
          className="mb-4 shadow-none d-flex flex-wrap"
          style={{
            border: "1px solid #ddd",
            borderRadius: 5,
            wordWrap: "break-word"
          }}
        >
          <div className="d-flex py-2 px-0 w-100">
            <div className="col-11" id="walletAddr">
              {address}
            </div>

            <Tooltip placement="top" isOpen={copied} target="copy">
              {t("copied")}
            </Tooltip>
            <CopyToClipboard text={address} onCopy={copy}>
              <FontAwesomeIcon
                id="copy"
                icon="copy"
                color="#999"
                className="mr-2"
                style={{ cursor: "pointer" }}
              />
            </CopyToClipboard>
          </div>
        </div>
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
