import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import QrCode from "qrcode.react";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useStore } from "store";

const EthAddress = () => {
  const [t] = useTranslation();

  const [copied, setCopied] = useState(false);
  const [show, setShow] = useState(false);

  const [{ address }] = useStore();

  const toggle = () => setShow(!show);
  const copy = () => setCopied(true);

  return (
    <>
      <hr />
      <p>{t("presentQR")}</p>
      {show && (
        <figure className="text-center">
          {address && <QrCode value={address} size={300} />}
          <figcaption>{address}</figcaption>
        </figure>
      )}
      <InputGroup>
        <Input readOnly value={address || ""} id="subnetAddr" />
        <InputGroupAddon addonType="append">
          <InputGroupText
            style={{ cursor: "pointer" }}
            onClick={toggle}
            id="clickSubnetAddr"
          >
            <FontAwesomeIcon icon="qrcode" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon addonType="append">
          <InputGroupText style={{ cursor: "pointer" }} id="copySubnetAddr">
            <CopyToClipboard text={address} onCopy={copy}>
              <FontAwesomeIcon icon="copy" />
            </CopyToClipboard>
          </InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      {copied && <p>{t("copied")}</p>}
    </>
  );
};

export default EthAddress;
