import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Form, FormGroup, Input, Label, Progress } from "reactstrap";
import { Error, Success } from "utils";
import { post } from "store";

const AddExitForm = ({ setAdding, setFillForm }) => {
  const [t] = useTranslation();
  const [identifier, setIdentifier] = useState("");
  const [description, setDescription] = useState("");
  const [meshIp, setMeshIp] = useState("");
  const [ethAddress, setEthAddress] = useState("");
  const [wgPubKey, setWgPubKey] = useState("");
  const [registrationPort, setRegistrationPort] = useState(4875);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await post("/exits", {
        [identifier]: {
          subnet: meshIp + "/128",
          eth_address: ethAddress,
          wg_public_key: wgPubKey,
          registration_port: registrationPort,
          description,
          state: "New",
          nickname: "",
        },
      });

      setSuccess(t("addExitSuccess"));
    } catch (e) {
      setError(t("addExitError"));
    }

    setLoading(false);
  };

  return (
    <Form onSubmit={submit}>
      {loading && <Progress animated color="primary" value="100" />}
      <Error error={error} />
      {success ? (
        <>
          <Success message={success} />
          <Button onClick={() => setAdding(false)}>{t("back")}</Button>
        </>
      ) : (
        <>
          <FormGroup>
            <Label>{t("identifier")}</Label>
            <Input
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder={t("identifier")}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label>{t("description")}</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("description")}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label>{t("meshIp")}</Label>
            <Input
              value={meshIp}
              onChange={(e) => setMeshIp(e.target.value)}
              placeholder={t("meshIp")}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label>{t("ethereumAddress")}</Label>
            <Input
              value={ethAddress}
              onChange={(e) => setEthAddress(e.target.value)}
              placeholder={t("ethereumAddress")}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label>{t("wireguardPublicKey")}</Label>
            <Input
              value={wgPubKey}
              onChange={(e) => setWgPubKey(e.target.value)}
              placeholder={t("wireguardPublicKey")}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label>{t("registrationPort")}</Label>
            <Input
              value={registrationPort}
              onChange={(e) => setRegistrationPort(e.target.value)}
              placeholder={t("registrationPort")}
              autoFocus
            />
          </FormGroup>
          <Button className="float-right" color="primary" type="submit">
            {t("submit")}
          </Button>
          <Button
            className="float-right mr-1"
            onClick={() => setFillForm(false)}
          >
            {t("back")}
          </Button>
        </>
      )}
    </Form>
  );
};

export default AddExitForm;
