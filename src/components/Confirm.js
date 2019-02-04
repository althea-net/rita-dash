import React from "react";
import {
  Alert,
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader
} from "reactstrap";

export default ({ cancel, confirm, show, t }) => (
  <Modal isOpen={show} centered>
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
