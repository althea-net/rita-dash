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
import { connect } from "store";
import { withTranslation } from "react-i18next";

const NoConnection = ({ state, t }) => (
  <div>
    <Modal isOpen={!state.version || state.waiting > 0} centered>
      <ModalHeader>{t("noConnection")}</ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            {state.portChange &&
              (!state.version || state.waiting > 60 ? (
                <Alert color="warning">{t("noReboot")}</Alert>
              ) : (
                <Alert color="info">{t("safeToReboot")}</Alert>
              ))}
            {state.wifiChange &&
              state.waiting < 115 && (
                <Alert color="danger">{t("wifiChange")}</Alert>
              )}
            {state.waiting > 0
              ? t("waiting", { seconds: state.waiting })
              : t("noRita")}
            <Progress value={100} animated color="danger" />
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  </div>
);

export default connect(["portChange", "wifiChange", "waiting", "version"])(
  withTranslation()(NoConnection)
);
