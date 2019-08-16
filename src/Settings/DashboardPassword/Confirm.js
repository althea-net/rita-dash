import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalHeader, ModalBody } from "reactstrap";

import exclamation from "images/exclamation.svg";

const Confirm = ({ open, setOpen, submit, backup }) => {
  const [t] = useTranslation();

  const go = () => {
    submit();
    toggle();
  };

  const toggle = () => setOpen(!open);

  return (
    <Modal isOpen={open} size="sm" centered toggle={toggle}>
      <ModalHeader toggle={toggle}>{t("updatePassword")}</ModalHeader>
      <ModalBody>
        <div className="text-center">
          <img
            src={exclamation}
            alt={t("exclamationMark")}
            className="img-fluid my-3"
            style={{ maxWidth: 60 }}
          />
          <h6 className="mb-3">{t("areYouSurePassword")}</h6>
          <p>{t("ifYouForget")}</p>
        </div>
        <Button color="primary" outline onClick={backup} className="w-100 mb-2">
          <b>{t("backupMyAccount")}</b>
        </Button>
        <Button color="primary" onClick={go} className="w-100">
          <b>{t("updateMyPassword")}</b>
        </Button>
      </ModalBody>
    </Modal>
  );
};

export default Confirm;
