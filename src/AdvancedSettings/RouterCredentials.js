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
import { actions } from "store";

export default ({ balance, symbol }) => {
  let [t] = useTranslation();
  let [username, setUsername] = useState("");
  let [password, setPassword] = useState("");

  return (
    <Card className="mb-4">
      <CardBody>
        <Form onSubmit={() => actions.saveRouterCredentials()}>
          <h3>{t("routerCredentials")}</h3>
          <p>{t("theseCredentials")}</p>

          <div className="d-flex">
            <FormGroup className="mb-0">
              <Label for="username">{t("username")}</Label>
              <Input
                id="username"
                className="mr-3"
                onChange={e => setUsername(e.target.value)}
                value={username}
                style={{ width: 250 }}
              />
            </FormGroup>
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
