import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Form,
  FormGroup,
  Input,
  Button,
  Modal,
  ModalFooter,
  ModalHeader,
  ModalBody
} from "reactstrap";
import { login, post } from "store";

import key from "../images/key.png";

const Password = ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [password, setPassword] = useState("");
  const [passConfirm, setConfirm] = useState("");
  const [error, setError] = useState();
  const [success, setSuccess] = useState(false);

  const submit = async e => {
    e.preventDefault();
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

  const toggle = () => setOpen(!open);

  return (
    <Modal size="lg" isOpen={open} centered toggle={toggle}>
      <ModalHeader toggle={toggle}>{t("setAdminPassword")}</ModalHeader>
      <ModalBody>
        <p style={{ maxWidth: 500 }}>{t("thisPassword")}</p>
        <div className="d-flex">
          <img
            src={key}
            alt={t("key")}
            style={{ height: 80 }}
            className="mt-2 mr-4"
          />
          <Form onSubmit={submit} className="my-auto">
            {error && <Alert color="danger">{error}</Alert>}
            {success && <Alert color="success">{t("passwordSuccess")}</Alert>}

            <FormGroup className="flex-grow-1">
              <Input
                id="password"
                type="password"
                className="mr-3"
                onChange={e => setPassword(e.target.value)}
                placeholder={t("newPassword")}
                value={password}
                style={{ width: 300 }}
              />
            </FormGroup>
            <FormGroup className="flex-grow-1">
              <Input
                id="passConfirm"
                type="password"
                className="mr-3"
                placeholder={t("typeAgain")}
                onChange={e => setConfirm(e.target.value)}
                value={passConfirm}
                style={{ width: 300 }}
              />
            </FormGroup>
          </Form>
        </div>
      </ModalBody>
      <ModalFooter className="border-top-0">
        {success ? (
          <Button color="secondary" onClick={toggle}>
            {t("close")}
          </Button>
        ) : (
          <Button color="primary" onClick={submit}>
            {t("submit")}
          </Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default Password;
