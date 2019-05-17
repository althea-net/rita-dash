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
  Label,
  Progress
} from "reactstrap";
import { post, useStore } from "store";
import { toEth } from "utils";

import Export from "./Export";

const PrivateKeys = () => {
  const [t] = useTranslation();
  const [privateKey, setPrivateKey] = useState("");
  const [exporting, setExporting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);
  const valid = parseInt(privateKey, 16) > 0;

  const [{ balance, symbol }] = useStore();

  const save = async () => {
    const eth_private_key = privateKey;
    setError(false);
    setSuccess(false);
    setSaving(true);
    post("/eth_private_key", { eth_private_key })
      .then(() => setSuccess(true))
      .catch(err => setError(t("privateKeyError")))
      .finally(() => setSaving(false));
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <Export open={exporting} setOpen={setExporting} />
        <Form onSubmit={save}>
          <h3>{t("privateKeys")}</h3>
          <p>{t("importKey", { balance: toEth(balance), symbol })}</p>

          {success && <Alert color="success">{t("privateKeyImported")}</Alert>}
          {error && <Alert color="danger">{error}</Alert>}
          <h4>{t("import")}</h4>
          <FormGroup>
            <Label for="price">{t("privateKeyString")}</Label>
            {saving ? (
              <Progress animated color="info" value="100" className="mb-2" />
            ) : (
              <div className="d-flex">
                <Input
                  className="mr-3"
                  id="privateKey"
                  onChange={e => setPrivateKey(e.target.value)}
                  value={privateKey}
                  style={{ width: 350 }}
                />
                <Button
                  color="primary"
                  style={{ width: 100 }}
                  disabled={!valid}
                >
                  {t("import")}
                </Button>
              </div>
            )}
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
