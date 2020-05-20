import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalHeader, ModalBody } from "reactstrap";

import BackupPrivateKey from "./BackupPrivateKey";
//import ImportPrivateKey from "./ImportPrivateKey";

const WalletManagement = ({ open, setOpen }) => {
  const [t] = useTranslation();

  return (
    <Modal isOpen={open} size="lg" centered toggle={() => setOpen(!open)}>
      <ModalHeader toggle={() => setOpen(!open)}>
        {t("walletManagement")}
      </ModalHeader>
      <ModalBody>
        <p>{t("altheaUses")}</p>
        <BackupPrivateKey />
      </ModalBody>
    </Modal>
  );
};

export default WalletManagement;
