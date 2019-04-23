import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";

import QR from "qrcode.react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Card,
  CardBody,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label
} from "reactstrap";
import AppContext from "store/App";
import { CopyToClipboard } from "react-copy-to-clipboard";

const NodeInformation = () => {
  const [t] = useTranslation();
  const [qr, setQR] = useState("");
  const [copied, setCopied] = useState("");

  const {
    info: { address },
    settings: {
      network: { meshIp, wgPublicKey }
    }
  } = useContext(AppContext);

  const toggleQR = v => {
    if (qr === v) return setQR("");
    setQR(v);
  };

  return (
    <>
      <h2>{t("nodeInfo")}</h2>
      <Card>
        <CardBody>
          {qr && (
            <div className="text-center">
              <QR
                style={{
                  height: "auto",
                  width: "50%"
                }}
                value={qr}
              />
            </div>
          )}
          <Label>
            <b>{t("meshIp")}</b>
          </Label>
          <InputGroup>
            <Input readOnly value={meshIp || ""} />
            <InputGroupAddon addonType="append">
              <InputGroupText
                style={{ cursor: "pointer" }}
                onClick={() => toggleQR(meshIp)}
              >
                <FontAwesomeIcon icon="qrcode" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <CopyToClipboard text={address} onCopy={() => setCopied("ip")}>
                <InputGroupText style={{ cursor: "pointer" }}>
                  <FontAwesomeIcon icon="copy" />
                </InputGroupText>
              </CopyToClipboard>
            </InputGroupAddon>
          </InputGroup>
          {copied === "ip" && <p>{t("copied")}</p>}
          <Label>
            <b>{t("ethereumAddress")}</b>
          </Label>
          <InputGroup>
            <Input readOnly value={address || ""} />
            <InputGroupAddon addonType="append">
              <InputGroupText
                style={{ cursor: "pointer" }}
                onClick={() => toggleQR(address)}
              >
                <FontAwesomeIcon icon="qrcode" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <CopyToClipboard
                text={address}
                onCopy={() => setCopied("address")}
              >
                <InputGroupText style={{ cursor: "pointer" }}>
                  <FontAwesomeIcon icon="copy" />
                </InputGroupText>
              </CopyToClipboard>
            </InputGroupAddon>
          </InputGroup>
          {copied === "address" && <p>{t("copied")}</p>}
          <Label>
            <b>{t("wireguardPublicKey")}</b>
          </Label>
          <InputGroup>
            <Input readOnly value={wgPublicKey || ""} />
            <InputGroupAddon addonType="append">
              <InputGroupText
                style={{ cursor: "pointer" }}
                onClick={() => toggleQR(wgPublicKey)}
              >
                <FontAwesomeIcon icon="qrcode" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <CopyToClipboard text={address} onCopy={() => setCopied("wg")}>
                <InputGroupText style={{ cursor: "pointer" }}>
                  <FontAwesomeIcon icon="copy" />
                </InputGroupText>
              </CopyToClipboard>
            </InputGroupAddon>
          </InputGroup>
          {copied === "wg" && <p>{t("copied")}</p>}
        </CardBody>
      </Card>
    </>
  );
};

export default NodeInformation;
