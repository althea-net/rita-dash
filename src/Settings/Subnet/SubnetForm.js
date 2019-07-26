import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { get, post } from "store";
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  Input,
  FormGroup,
  Progress
} from "reactstrap";
import { Address6 } from "ip-address";
import Web3 from "web3";
import { Error, Success } from "utils";

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
const { isAddress } = web3.utils;

const SubnetForm = () => {
  const [t] = useTranslation();

  const [ipAddress, setIpAddress] = useState("");
  const [daoAddress, setDaoAddress] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [success, setSuccess] = useState();

  const ip = new Address6(ipAddress || "");
  let formattedIp = ip.canonicalForm();

  const ipNeedsFormatting = ip.isValid() && ip.subnet !== "/128";
  if (ipNeedsFormatting) {
    formattedIp = formattedIp.substr(0, formattedIp.length - 1) + 1;
  }

  useEffect(() => {
    (async () => {
      const { meshIp } = await get("/mesh_ip");
      setIpAddress(meshIp);
      const daos = await get("/dao_list");
      if (daos.length) setDaoAddress(daos[0]);
    })();
    return;
  }, []);

  const handleIp = e => setIpAddress(e.target.value);
  const handleDao = e => setDaoAddress(e.target.value);

  const ipValid = ip.isValid();
  const daoValid = !!(daoAddress && isAddress(daoAddress));
  const valid = ipValid && daoValid;

  const submit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const daos = await get("/dao_list");
      await Promise.all(
        daos.map(address => post(`/dao_list/remove/${address}`))
      );
      await post(`/dao_list/add/${daoAddress}`);
      setSuccess(t("daoSuccess"));
    } catch {
      setError(t("daoError"));
    }

    setLoading(false);
  };

  if (loading) return <Progress value={100} animated color="info" />;

  return (
    <Form className="my-2" onSubmit={submit}>
      <Error message={error} />
      <Success message={success} />

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
          readOnly
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
