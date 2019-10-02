import React from "react";
import { Alert, Modal, ModalHeader, ModalBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";
import { useStore } from "store";

const NoConnection = () => {
  const [t] = useTranslation();
  const [
    {
      authenticated,
      firmwareUpgrading,
      keyChange,
      portChange,
      waiting,
      wifiChange,
      version
    }
  ] = useStore();

  if (!authenticated) return null;

  return (
    <div>
      <Modal isOpen={!version || waiting > 0} centered zIndex={9999}>
        <ModalHeader>{t("noConnection")}</ModalHeader>
        <ModalBody>
          {firmwareUpgrading && (
            <Alert color="warning">{t("firmwareUpgrading")}</Alert>
          )}
          {portChange &&
            (!version || waiting > 60 ? (
              <Alert color="warning">{t("noReboot")}</Alert>
            ) : (
              <Alert color="info">{t("safeToReboot")}</Alert>
            ))}
          {keyChange && <Alert color="danger">{t("keyChange")}</Alert>}
          {wifiChange &&
            waiting < 115 && <Alert color="danger">{t("wifiChange")}</Alert>}
          {waiting > 0 ? t("waiting", { seconds: waiting }) : t("noRita")}
          <Progress value={100} animated color="danger" />
        </ModalBody>
      </Modal>
    </div>
  );
};

export default NoConnection;
