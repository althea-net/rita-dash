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
    <Modal isOpen={!state.version} centered>
      <ModalHeader>{t("noConnection")}</ModalHeader>
      <ModalBody>
        <Card>
          <CardBody>
            {t("noRita")}
            <Progress value={100} animated color="danger" />
          </CardBody>
        </Card>
      </ModalBody>
    </Modal>
  </div>
);

export default connect(["version"])(translate()(NoConnection));
