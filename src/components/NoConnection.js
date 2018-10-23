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
    <Modal isOpen={!state.version || state.waiting > 0} centered>
      <ModalHeader>{t("noConnection")}</ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
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

export default connect(["waiting", "version"])(translate()(NoConnection));
