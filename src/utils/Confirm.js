import React from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

const Confirm = ({ open, cancel, confirm, message }) => {
  const [t] = useTranslation();
  if (!message) message = t("thisAction");

  return (
    <Modal isOpen={open} centered toggle={cancel}>
      <ModalHeader>{t("Are you sure?")}</ModalHeader>
      <ModalBody>
        <Alert color="warning">{message}</Alert>
        <p>{t("proceed")}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirm}>
          {t("yes")}
        </Button>
        <Button color="secondary" onClick={cancel} style={{ height: "100%" }}>
          {t("no")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default Confirm;
