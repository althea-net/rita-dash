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

export default ({ open, cancel, confirm }) => {
  let [t] = useTranslation();

  return (
    <Modal isOpen={open} centered toggle={cancel}>
      <ModalHeader>{t("Are you sure?")}</ModalHeader>
      <ModalBody>
        <Alert color="warning">{t("thisAction")}</Alert>
        <p>{t("proceed")}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirm}>
          {t("yes")}
        </Button>
        <Button color="secondary" onClick={cancel}>
          {t("no")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
