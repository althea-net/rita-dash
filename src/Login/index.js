import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { login, useStore } from "store";
import { Alert, Form, FormGroup, Input, Label, Progress } from "reactstrap";

const Login = () => {
  const [t] = useTranslation();
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [, dispatch] = useStore();

  const submit = async e => {
    e.preventDefault();

    setLoading(true);

    try {
      await login(password);
      return dispatch({ type: "authenticated", authenticated: true });
    } catch (e) {
      setError(true);
    }

    setLoading(false);
  };

  return (
    <Form onSubmit={submit}>
      <h3>{t("login")}</h3>

      {error && <Alert color="danger">{t("loginError")}</Alert>}

      {loading ? (
        <Progress animated color="info" value="100" />
      ) : (
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
      )}
    </Form>
  );
};

export default Login;
