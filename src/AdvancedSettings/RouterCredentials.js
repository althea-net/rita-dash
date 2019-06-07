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

export default ({ balance, symbol }) => {
  const [t] = useTranslation();
  const [password, setPassword] = useState("");
  const [passConfirm, setConfirm] = useState("");
  const submit = () => {};

  return (
    <Card className="mb-4">
      <CardBody>
        <Form onSubmit={() => submit()}>
          <h3>{t("routerCredentials")}</h3>
          <p>{t("theseCredentials")}</p>

          <div className="d-flex">
            <FormGroup className="mb-0">
              <Label for="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                className="mr-3"
                onChange={e => setPassword(e.target.value)}
                value={password}
                style={{ width: 250 }}
              />
            </FormGroup>
            <FormGroup className="mb-0">
              <Label for="passConfirm">{t("passConfirm")}</Label>
              <Input
                id="passConfirm"
                className="mr-3"
                onChange={e => setConfirm(e.target.value)}
                value={passConfirm}
                style={{ width: 250 }}
              />
            </FormGroup>
            <div className="mt-auto">
              <Button color="primary" style={{ width: 100 }} disabled>
                {t("save")}
              </Button>
            </div>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};
