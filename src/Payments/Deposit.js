import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import QR from "qrcode.react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import AppContext from "store/App";
import { BigNumber } from "bignumber.js";

const weiPerEth = BigNumber("1000000000000000000");

const qrStyle = { height: "auto", width: 300 };
const iconStyle = { cursor: "pointer", marginLeft: 10 };
const addressStyle = { wordBreak: "break-word" };

export default ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [copied, setCopied] = useState(false);

  const {
    debt,
    info: { address, lowBalance },
    symbol
  } = useContext(AppContext);

  const debtEth = BigNumber(debt)
    .div(weiPerEth)
    .times(2)
    .toFixed(4);

  const recommendedDeposit = `${debtEth} ${symbol}`;

  if (!(address && symbol)) return null;

  return (
    <Modal isOpen={open} centered toggle={() => setOpen(!open)}>
      <ModalHeader>
        {t("deposit")} {symbol}
      </ModalHeader>
      <ModalBody>
        <Card className="mb-4">
          <CardBody>
            <h5 style={addressStyle} id="walletAddr">{address}</h5>
            <CopyToClipboard text={address} onCopy={() => setCopied(true)}>
              <FontAwesomeIcon size="lg" icon="copy" style={iconStyle} />
            </CopyToClipboard>
            {copied && <p className="ml-2">{t("copied")}</p>}
          </CardBody>
        </Card>
        <div className="w-100 text-center mb-4">
          <QR style={qrStyle} value={address} />
        </div>
        {lowBalance &&
          recommendedDeposit &&
          t("recommendedDeposit", { recommendedDeposit })}
      </ModalBody>
    </Modal>
  );
};
