import React from "react";
import {
  Alert,
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Progress
} from "reactstrap";
import { useTranslation } from "react-i18next";
import { useStore } from "store";

const NoConnection = () => {
  const [t] = useTranslation();
  const [
    { authenticated, keyChange, portChange, waiting, wifiChange, version }
  ] = useStore();

  if (!authenticated) return null;

  return (
    <div>
      <Modal isOpen={!version || waiting > 0} centered>
        <ModalHeader>{t("noConnection")}</ModalHeader>
        <ModalBody>
          <Card>
            {keyChange ? (
              <CardBody>{t("routerWillReboot", { seconds: waiting })}</CardBody>
            ) : (
              <CardBody>
                {portChange &&
                  (!version || waiting > 60 ? (
                    <Alert color="warning">{t("noReboot")}</Alert>
                  ) : (
                    <Alert color="info">{t("safeToReboot")}</Alert>
                  ))}
                {wifiChange &&
                  waiting < 115 && (
                    <Alert color="danger">{t("wifiChange")}</Alert>
                  )}
                {waiting > 0 ? t("waiting", { seconds: waiting }) : t("noRita")}
                <Progress value={100} animated color="danger" />
              </CardBody>
            )}
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default NoConnection;
