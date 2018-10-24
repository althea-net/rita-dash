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
      <Alert color="warning">
        This action will interrupt the connection to the router while the rita
        service is restarted
      </Alert>
      <p>Do you wish to proceed?</p>
    </ModalBody>
    <ModalFooter>
      <Button color="primary" onClick={confirm}>
        Yes
      </Button>
      <Button color="secondary" onClick={cancel}>
        No
      </Button>
    </ModalFooter>
  </Modal>
);
