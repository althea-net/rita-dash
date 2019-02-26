import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { actions, getState, get, init } from "store";
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  Input,
  FormGroup
} from "reactstrap";
import { Address6 } from "ip-address";
import QrReader from "react-qr-reader";
import Confirm from "Utils/Confirm";

const SubnetForm = () => {
  let [t] = useTranslation();
  let [ipAddress, setIpAddress] = useState("");
  let [daoAddress, setDaoAddress] = useState("");
  let [scanning, setScanning] = useState(false);
  let [ipNeedsFormatting, setIpNeedsFormatting] = useState(false);
  let [confirming, setConfirming] = useState(false);

  init(async () => {
    let { meshIp } = await get("/mesh_ip");
    let daos = await get("/dao_list");
    if (daos.length) setDaoAddress(daos[0]);
    setIpAddress(meshIp);
  });

  let handleIp = e => setIpAddress(e.target.value);
  let handleDao = e => {
    setDaoAddress(e.target.value);
    let meshIp = new Address6(e.target.value);
    setIpNeedsFormatting(meshIp.isValid() && meshIp.subnet !== "/128");
  };

  let handleScan = result => {
    try {
      let { daoAddress, ipAddress } = JSON.parse(result);
      setDaoAddress(daoAddress);
      setIpAddress(ipAddress);
    } catch (e) {
      console.log("failed to parse subnet DAO QR code");
    }
  };

  let cancel = () => setConfirming(false);

  let confirm = () => {
    actions.startWaiting();

    let i = setInterval(async () => {
      actions.keepWaiting();
      if (getState().waiting <= 0) {
        clearInterval(i);
      }
    }, 1000);

    actions.joinSubnetDao(daoAddress, ipAddress);

    setConfirming(false);
  };

  return (
    <Form className="my-2">
      <Confirm open={confirming} cancel={cancel} confirm={confirm} />
      <div id="viewer" style={{ width: "300px" }} />
      {scanning && (
        <QrReader
          onScan={handleScan}
          onError={console.log}
          style={{ width: "300px", marginTop: 15 }}
        />
      )}
      <FormGroup>
        {ipNeedsFormatting && (
          <Alert color="info">
            <strong>IP Subnet Detected</strong>
            <p>
              The router will be assigned the first non-zero address in the
              range: {ipAddress}
            </p>
          </Alert>
        )}
        <Input
          placeholder={t("ipAddress")}
          value={ipAddress}
          onChange={handleIp}
        />
        <FormFeedback invalid="true">{t("enterIpAddress")}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Input
          placeholder={t("subnetAddress")}
          onChange={handleDao}
          value={daoAddress}
        />
        <FormFeedback invalid="true">{t("enterEthAddress")}</FormFeedback>
      </FormGroup>
      <div className="d-flex">
        <Button
          onClick={() => setScanning(true)}
          className="mr-2"
          outline
          color="primary"
          style={{ width: 180 }}
        >
          {t("scanQR")}
        </Button>
        <Button
          color="primary"
          onClick={() => setConfirming(true)}
          style={{ width: 180 }}
        >
          {t("save")}
        </Button>
      </div>
    </Form>
  );
};

export default SubnetForm;
