import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { get, login, useStore } from "store";
import {
  Alert,
  Button,
  Form,
  FormGroup,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  Progress
} from "reactstrap";
import key from "../images/key.png";

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
    <Modal size="lg" isOpen={true} centered autoFocus={false}>
      <ModalHeader>{t("login")}</ModalHeader>
      <ModalBody>
        {error && <Alert color="danger">{t("loginError")}</Alert>}
        <div className="d-flex">
          <img src={key} alt={t("key")} className="mr-2" />
          <Form onSubmit={submit} className="my-auto w-100">
            {loading ? (
              <Progress animated color="info" value="100" />
            ) : (
              <div className="d-flex">
                <FormGroup className="mb-0">
                  <Input
                    autoFocus
                    id="password"
                    type="password"
                    className="mr-3"
                    placeholder={t("adminPassword")}
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                    style={{ width: 300 }}
                  />
                </FormGroup>
                <div className="mt-auto ml-auto">
                  <Button color="primary" style={{ width: 200 }}>
                    {t("submit")}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default Login;
