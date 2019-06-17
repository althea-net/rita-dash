import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { get, login, useStore } from "store";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  Progress
} from "reactstrap";

const Login = () => {
  const [t] = useTranslation();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [, dispatch] = useStore();

  const submit = async e => {
    e.preventDefault();

    setLoading(true);

    try {
      await login(password);
      const info = await get("/info", true, 5000);
      dispatch({ type: "info", info });
      return dispatch({ type: "authenticated", authenticated: true });
    } catch (e) {
      setError(true);
    }

    setLoading(false);
  };

  return (
    <Modal isOpen={true} centered autoFocus={false}>
      <ModalHeader>{t("login")}</ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{t("loginError")}</Alert>}
        <Card>
          <CardBody>
            <Form onSubmit={submit}>
              {loading ? (
                <Progress animated color="info" value="100" />
              ) : (
                <div className="d-flex">
                  <FormGroup className="mb-0">
                    <Label for="password">{t("password")}</Label>
                    <Input
                      autoFocus
                      id="password"
                      type="password"
                      className="mr-3"
                      onChange={e => setPassword(e.target.value)}
                      value={password}
                      style={{ width: 250 }}
                    />
                  </FormGroup>
                  <div className="mt-auto">
                    <Button color="primary" style={{ width: 100 }}>
                      {t("submit")}
                    </Button>
                  </div>
                </div>
              )}
            </Form>
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  );
};

export default Login;
