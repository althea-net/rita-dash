import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { login, post } from "store";
import {
  Alert,
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  Input,
  Label,
} from "reactstrap";
import Backup from "../../Backup";
import Confirm from "./Confirm";

const DashboardPassword = ({ balance, symbol }) => {
  const [t] = useTranslation();
  const [password, setPassword] = useState("");
  const [passConfirm, setConfirm] = useState("");
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [backingUp, setBackingUp] = useState(false);

  const submit = async () => {
    setError();
    setSuccess();

    if (password !== passConfirm) {
      return setError(t("passwordMismatch"));
    }

    try {
      await post("/router/password", { password });
      login(password);
      setSuccess(true);
    } catch (e) {
      setError(t("passwordError"));
    }
  };

  const confirm = (e) => {
    e.preventDefault();
    setConfirming(true);
  };

  const backup = () => setBackingUp(true);

  return (
    <Card className="mb-4">
      <CardBody>
        <Backup open={backingUp} setOpen={setBackingUp} />
        <Confirm
          open={confirming}
          setOpen={setConfirming}
          submit={submit}
          backup={backup}
        />
        <Form onSubmit={confirm}>
          <h4>{t("routerCredentials")}</h4>
          <p>{t("theseCredentials")}</p>

          {error && <Alert color="danger">{error}</Alert>}
          {success && <Alert color="success">{t("passwordSuccess")}</Alert>}

          <div className="d-flex flex-wrap">
            <FormGroup className="flex-grow-1 mr-2">
              <Label for="password">{t("password")}</Label>
              <Input
                id="password"
                type="password"
                className="mr-3"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormGroup>
            <FormGroup className="flex-grow-1 mr-2">
              <Label for="passConfirm">{t("passConfirm")}</Label>
              <Input
                id="passConfirm"
                type="password"
                className="mr-3"
                onChange={(e) => setConfirm(e.target.value)}
                value={passConfirm}
              />
            </FormGroup>

            <FormGroup className="mt-auto">
              <Button color="primary">{t("save")}</Button>
            </FormGroup>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};

export default DashboardPassword;
