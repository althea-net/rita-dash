import React from "react";
import {
  Card,
  CardBody,
  Modal,
  ModalHeader,
  ModalBody,
  Progress
} from "reactstrap";
import { connect } from "../store";
import { translate } from "react-i18next";

const NoConnection = ({ state, t }) => (
  <div>
    <Modal isOpen={!state.settings || !state.settings.network.meshIp} centered>
      <ModalHeader>{t("noConnection")}</ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            {t("noSettings")}
            <Progress value={100} animated color="danger" />
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  </div>
);

export default connect(["settings"])(translate()(NoConnection));
