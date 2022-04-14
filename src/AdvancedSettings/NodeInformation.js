import React, { useEffect, useState } from "react";
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
import { CopyToClipboard } from "react-copy-to-clipboard";
import { get, useStore } from "store";

const NodeInformation = () => {
  const [t] = useTranslation();
  const [qr, setQR] = useState("");
  const [copied, setCopied] = useState("");
  const [{ address, meshIp, wgPublicKey }, dispatch] = useStore();

  useEffect(() => {
    const init = async () => {
      try {
        const { meshIp } = await get("/mesh_ip");
        dispatch({ type: "meshIp", meshIp });

        const wgPublicKey = await get("/wg_public_key");
        dispatch({ type: "wgPublicKey", wgPublicKey });
      } catch (e) {
        console.log(e);
      }
    };

    init();
  }, [dispatch]);

  const toggleQR = v => {
    if (qr === v) return setQR("");
    setQR(v);
  };

  return (
    <>
      <Card className="mb-4">
        <CardBody>
          <h4>{t("nodeInfo")}</h4>
          {qr && (
            <div className="text-center">
              <QR
                style={{
                  height: "auto",
                  width: "50%"
                }}
                id="qr"
                value={qr}
              />
            </div>
          )}
          <Label>
            <b>{t("meshIp")}:</b>
          </Label>
          <InputGroup>
            <Input id="meshIP" readOnly value={meshIp || ""} />
            <InputGroupAddon addonType="append">
              <InputGroupText
                style={{ cursor: "pointer" }}
                onClick={() => toggleQR(meshIp)}
                id="clickMeshIP"
              >
                <FontAwesomeIcon icon="qrcode" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <CopyToClipboard text={meshIp} onCopy={() => setCopied("ip")}>
                <InputGroupText style={{ cursor: "pointer" }}>
                  <FontAwesomeIcon icon="copy" />
                </InputGroupText>
              </CopyToClipboard>
            </InputGroupAddon>
          </InputGroup>
          {copied === "ip" && <p>{t("copied")}</p>}
          <Label>
            <b>{t("paymentAddress")}</b>
          </Label>
          <InputGroup>
            <Input id="ethAddr" readOnly value={address || ""} />
            <InputGroupAddon addonType="append">
              <InputGroupText
                style={{ cursor: "pointer" }}
                onClick={() => toggleQR(address)}
                id="clickEthAddr"
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
            <Input id="wgPubKey" readOnly value={wgPublicKey || ""} />
            <InputGroupAddon addonType="append">
              <InputGroupText
                style={{ cursor: "pointer" }}
                onClick={() => toggleQR(wgPublicKey)}
                id="clickWgPubKey"
              >
                <FontAwesomeIcon icon="qrcode" />
              </InputGroupText>
            </InputGroupAddon>
            <InputGroupAddon addonType="append">
              <CopyToClipboard
                text={wgPublicKey}
                onCopy={() => setCopied("wg")}
              >
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
