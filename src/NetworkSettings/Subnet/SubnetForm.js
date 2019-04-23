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
import { Confirm } from "utils";
import Web3 from "web3";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");

const SubnetForm = () => {
  let [t] = useTranslation();
  let [ipAddress, setIpAddress] = useState("");
  let [daoAddress, setDaoAddress] = useState("");
  let [scanning, setScanning] = useState(false);
  let [confirming, setConfirming] = useState(false);

  if (!ipAddress) ipAddress = "";
  let ip = new Address6(ipAddress);
  let formattedIp = ip.canonicalForm();

  let ipNeedsFormatting = ip.isValid() && ip.subnet !== "/128";
  if (ipNeedsFormatting) {
    formattedIp = formattedIp.substr(0, formattedIp.length - 1) + 1;
  }

  init(async () => {
    let { meshIp } = await get("/mesh_ip");
    let daos = await get("/dao_list");
    if (daos.length) setDaoAddress(daos[0]);
    actions.getSubnetDaos();
    setIpAddress(meshIp);
  });

  let handleIp = e => {
    setIpAddress(e.target.value);
  };

  let handleDao = e => {
    setDaoAddress(e.target.value);
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

    actions.joinSubnetDao(daoAddress, formattedIp);

    setConfirming(false);
  };

  let ipValid = ip.isValid();
  let daoValid = !!(daoAddress && web3.utils.isAddress(daoAddress));
  let valid = ipValid && daoValid;

  let submit = () => setConfirming(true);

  return (
    <Form className="my-2" onSubmit={submit}>
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
            <strong>{t("subnetDetected")}</strong>
            <p>{t("ipWillBeAssigned", { ipAddress: formattedIp })}</p>
          </Alert>
        )}
        <Input
          placeholder={t("ipAddress")}
          value={ipAddress}
          onChange={handleIp}
          valid={ipValid}
          invalid={!ipValid}
          id="subnetIPV6"
        />
        <FormFeedback invalid="true">{t("enterIpAddress")}</FormFeedback>
      </FormGroup>
      <FormGroup>
        <Input
          placeholder={t("subnetAddress")}
          onChange={handleDao}
          value={daoAddress}
          valid={daoValid}
          invalid={!daoValid}
          id="subnetDAOAddr"
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
          id="subnetQR"
        >
          {t("scanQR")}
        </Button>
        <Button
          type="submit"
          color="primary"
          onClick={submit}
          style={{ width: 180 }}
          disabled={!valid}
          id="subnetSave"
        >
          {t("save")}
        </Button>
      </div>
    </Form>
  );
};

export default SubnetForm;
