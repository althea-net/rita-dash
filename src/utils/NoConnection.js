import React, { useContext } from "react";
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
import AppContext from "store/App";

const NoConnection = ({ state, t }) => {
  const { info } = useContext(AppContext);

  return (
    <div>
      <Modal isOpen={!info.version || state.waiting > 0} centered>
        <ModalHeader>{t("noConnection")}</ModalHeader>
        <ModalBody>
          <Card>
            <CardBody>
              {state.portChange &&
                (!info.version || state.waiting > 60 ? (
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
};

export default connect(["portChange", "wifiChange", "waiting"])(
  withTranslation()(NoConnection)
);
