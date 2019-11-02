import React, { useEffect, useState } from "react";
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
  const [manual, setManual] = useState(false);

  const copy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  useEffect(() => {
    if (open) {
      setTimeout(window.wyre, 500);
    } 
    return;
  }, [open]);

  const [
    { address, debt, lowBalance, status, withdrawChainSymbol }
  ] = useStore();

  let minDeposit = toEth(debt) * 2;
  if (status) minDeposit = Math.max(status.minEth, minDeposit);

  const recommendedDeposit = `${minDeposit} ${withdrawChainSymbol}`;

  const toggle = () => setOpen(!open);

  if (!(address && withdrawChainSymbol)) return null;

  return (
    <Modal isOpen={open} size="md" centered toggle={toggle}>
      <ModalHeader>
        {t("deposit")} {withdrawChainSymbol}
      </ModalHeader>
      <ModalBody>
        {manual && 
          <>
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
        <div>
          {lowBalance &&
            minDeposit > 0 &&
            t("recommendedDeposit", { recommendedDeposit })}
        </div>
            </>
          }
      </ModalBody>
    </Modal>
  );
};

export default Deposit;
