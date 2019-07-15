import React, { useState } from "react";
import { useTranslation } from "react-i18next";
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
import { post, useStore } from "store";
import { Confirm, toEth } from "utils";
import useInterval from "hooks/useInterval";

import Export from "./Export";

const PrivateKeys = () => {
  const [t] = useTranslation();
  const [privateKey, setPrivateKey] = useState("");
  const [exporting, setExporting] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const valid = parseInt(privateKey, 16) > 0;

  const [{ balance, symbol, waiting }, dispatch] = useStore();

  useInterval(() => {
    if (saving) dispatch({ type: "keepWaiting" });
  }, waiting > 0 ? 1000 : null);

  const save = async e => {
    e.preventDefault();

    const eth_private_key = privateKey;
    setConfirming(false);
    setSaving(true);

    dispatch({ type: "meshIp", meshIp: null });
    dispatch({ type: "wgPublicKey", wgPublicKey: null });
    dispatch({ type: "startKeyChange" });
    dispatch({ type: "startWaiting", waiting: 120 });

    post("/eth_private_key", { eth_private_key });
    setSuccess(true);
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
          {!waiting &&
            success && <Alert color="success">{t("privateKeyImported")}</Alert>}
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
