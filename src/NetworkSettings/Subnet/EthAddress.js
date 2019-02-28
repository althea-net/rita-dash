import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Context, init } from "store";
import QrCode from "qrcode.react";
import { Input, InputGroup, InputGroupAddon, InputGroupText } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CopyToClipboard } from "react-copy-to-clipboard";

const EthAddress = () => {
  let [t] = useTranslation();

  let [copied, setCopied] = useState(false);
  let [show, setShow] = useState(false);

  let {
    actions,
    state: {
      info: { address }
    }
  } = useContext(Context);

  init(() => {
    actions.getInfo();
  });

  let toggle = () => setShow(!show);
  let copy = () => setCopied(true);

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
        <Input readOnly value={address || ""} />
        <InputGroupAddon addonType="append">
          <InputGroupText style={{ cursor: "pointer" }} onClick={toggle}>
            <FontAwesomeIcon icon="qrcode" />
          </InputGroupText>
        </InputGroupAddon>
        <InputGroupAddon addonType="append">
          <InputGroupText style={{ cursor: "pointer" }}>
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
