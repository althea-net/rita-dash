import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import useInterval from "hooks/useInterval";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import { get, post, useStore } from "store";
import { Confirm, toEth } from "utils";

import Export from "./Export";

const PrivateKeys = () => {
  const [t] = useTranslation();
  const [privateKey, setPrivateKey] = useState("");
  const [exporting, setExporting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [warning, setWarning] = useState(false);
  const [oldKey, setOldKey] = useState();

  const valid = parseInt(privateKey, 16) > 0;

  const [{ balance, symbol, wgPublicKey }, dispatch] = useStore();

  useInterval(async () => {
    try {
      const wgPublicKey = await get("/wg_public_key");
      if (!(wgPublicKey instanceof Error))
        dispatch({ type: "wgPublicKey", wgPublicKey });
    } catch (e) {
      console.log(e);
    }
  }, 5000);

  useEffect(
    () =>
      (async () => {
        const wgPublicKey = await get("/wg_public_key");
        if (!(wgPublicKey instanceof Error)) setOldKey(wgPublicKey);
      })(),
    []
  );

  const save = async e => {
    e.preventDefault();
    setConfirming(false);

    post("/eth_private_key", { eth_private_key: privateKey });
    setWarning(true);
  };

  const confirm = e => {
    e.preventDefault();
    setConfirming(true);
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <Confirm
          open={confirming}
          cancel={() => setConfirming(false)}
          confirm={save}
          message={t("privateKeyImportWarning")}
        />
        <Export open={exporting} setOpen={setExporting} />
        <Form onSubmit={confirm}>
          <h3>{t("privateKeys")}</h3>
          <p>{t("importKey", { balance: toEth(balance), symbol })}</p>
          <h4>{t("import")}</h4>
          {oldKey === wgPublicKey ? (
            warning && (
              <Alert color="warning">{t("privateKeyImportInitiated")}</Alert>
            )
          ) : (
            <Alert color="success">{t("privateKeySuccess")}</Alert>
          )}
          <FormGroup>
            <Label for="price">{t("privateKeyString")}</Label>
            <div className="d-flex">
              <Input
                className="mr-3"
                id="privateKey"
                onChange={e => setPrivateKey(e.target.value)}
                value={privateKey}
                style={{ width: 350 }}
              />
              <Button color="primary" style={{ width: 100 }} disabled={!valid}>
                {t("import")}
              </Button>
            </div>
          </FormGroup>
        </Form>
        <h4>{t("export")}</h4>
        <Button
          id="exportKeyButton"
          color="secondary"
          style={{ width: 150 }}
          onClick={() => setExporting(true)}
        >
          {t("export")}
        </Button>
      </CardBody>
    </Card>
  );
};

export default PrivateKeys;
