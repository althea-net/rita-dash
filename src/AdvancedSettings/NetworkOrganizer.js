import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { get, post } from "store";
import {
  Alert,
  Button,
  Form,
  FormFeedback,
  FormGroup,
  Input,
  Label,
  Progress,
} from "reactstrap";
import { Address6 } from "ip-address";
import { Error, Success } from "utils";
import { Card } from "ui";
import { isAddress } from "ethereum-address";

const NetworkOrganizer = () => {
  const [t] = useTranslation();

  const [ipAddress, setIpAddress] = useState("");
  const [paymentAddress, setDaoAddress] = useState("");
  const [editing, setEditing] = useState(false);

  const [saving, setSaving] = useState(false);
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

  const edit = () => {
    setSuccess(null);
    setEditing(true);
  };

  const handleIp = (e) => setIpAddress(e.target.value);
  const handleDao = (e) => setDaoAddress(e.target.value);

  const ipValid = ip.isValid();
  const daoValid = isAddress(paymentAddress);
  const daoInvalid = paymentAddress && !isAddress(paymentAddress);
  const valid = ipValid && !daoInvalid;

  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const daos = await get("/dao_list");
      await Promise.all(
        daos.map((address) => post(`/dao_list/remove/${address}`))
      );

      if (paymentAddress) {
        await post(`/dao_list/add/${paymentAddress}`);
      }

      setSuccess(t("daoSuccess"));
      setEditing(false);
    } catch {
      setError(t("daoError"));
    }

    setSaving(false);
  };

  return (
    <Card>
      <h4>{t("networkOrganizer")}</h4>
      <p>{t("yourOrganizer")}</p>

      <Success message={success} />

      {editing ? (
        saving ? (
          <Progress value={100} animated color="primary" className="w-100" />
        ) : (
          <Form
            className="my-2"
            onSubmit={submit}
            style={{ width: 450, maxWidth: "100%" }}
          >
            <Error error={error} />

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
                className="w-100"
              />
              <FormFeedback invalid="true">{t("enterIpAddress")}</FormFeedback>
            </FormGroup>
            <FormGroup>
              <Input
                placeholder={t("organizerAddress")}
                onChange={handleDao}
                value={paymentAddress}
                valid={daoValid}
                invalid={daoInvalid}
                id="subnetDAOAddr"
              />
              <FormFeedback invalid="true">{t("invalidAddress")}</FormFeedback>
            </FormGroup>
            <div className="d-flex">
              <Button
                type="submit"
                color="primary"
                onClick={submit}
                style={{ width: 180 }}
                disabled={saving || !valid}
                id="subnetSave"
              >
                {t("save")}
              </Button>
            </div>
          </Form>
        )
      ) : (
        <>
          <div className="d-flex flex-wrap w-100 mb-2">
            <div className="col-12 col-lg-6 px-0">
              <Label>{t("ipAddress")}</Label>
              <div>{ipAddress}</div>
            </div>
            <div>
              <Label>{t("organizerAddress")}</Label>
              <div style={{ wordBreak: "break-all" }}>
                {paymentAddress || t("undefined")}
              </div>
            </div>
          </div>
          <Button
            color="secondary"
            style={{ color: "white", minWidth: 200 }}
            onClick={edit}
          >
            {t("edit")}
          </Button>
        </>
      )}
    </Card>
  );
};

export default NetworkOrganizer;
