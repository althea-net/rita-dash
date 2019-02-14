import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label
} from "reactstrap";

import Export from "./Export";

export default ({ balance, symbol }) => {
  let [t] = useTranslation();
  let [privateKey, setPrivateKey] = useState("");
  let [exporting, setExporting] = useState("");

  return (
    <Card className="mb-4">
      <CardBody>
        <Export
          exporting={exporting}
          setExporting={setExporting}
          privateKey={privateKey}
        />
        <Form onSubmit={() => setPrivateKey(privateKey)}>
          <FormGroup id="form">
            <h3>{t("privateKeys")}</h3>
            <p>{t("importKey", { balance, symbol })}</p>

            <h4>Import</h4>
            <Label for="price">{t("privateKeyString")}</Label>
            <div className="d-flex">
              <Input
                className="mr-3"
                onChange={e => setPrivateKey(e.target.value)}
                value={privateKey}
                style={{ width: 350 }}
              />
              <Button color="primary" style={{ width: 100 }} disabled>
                {t("import")}
              </Button>
            </div>
          </FormGroup>
          <h4>{t("export")}</h4>
          <Button
            color="secondary"
            style={{ width: 150 }}
            onClick={() => setExporting(true)}
          >
            {t("export")}
          </Button>
        </Form>
      </CardBody>
    </Card>
  );
};
