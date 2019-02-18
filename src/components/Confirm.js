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
import { actions, getState } from "../store";

export default ({ iface, mode, open, setOpen }) => {
  let [t] = useTranslation();

  let confirm = () => {
    setOpen(false);

    actions.startPortChange();
    actions.startWaiting();

    let i = setInterval(async () => {
      actions.keepWaiting();
      if (getState().waiting <= 0) {
        clearInterval(i);
      }
    }, 1000);

    actions.setInterface(iface, mode);
  };

  return (
    <Modal isOpen={open} centered>
      <ModalHeader>{t("Are you sure?")}</ModalHeader>
      <ModalBody>
        <Alert color="warning">{t("thisAction")}</Alert>
        <p>{t("proceed")}</p>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={confirm}>
          {t("yes")}
        </Button>
        <Button color="secondary" onClick={() => setOpen(false)}>
          {t("no")}
        </Button>
      </ModalFooter>
    </Modal>
  );
};
