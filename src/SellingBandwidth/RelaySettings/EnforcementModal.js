import React from "react";
import { Card, CardBody, Modal, ModalBody } from "reactstrap";
import { useTranslation } from "react-i18next";

const EnforcementModal = ({ open, toggle }) => {
  const [t] = useTranslation();

  return (
    <div>
      <Modal isOpen={open} toggle={toggle} centered>
        <div className="modal-header d-flex justify-content-between">
          <h5>{t("whatIsEnforcing")}</h5>
          <h5 style={{ marginTop: -5, cursor: "pointer" }} onClick={toggle}>
            &times;
          </h5>
        </div>
        <ModalBody>
          <Card>
            <CardBody>{t("enforcingIs")}</CardBody>
          </Card>
        </ModalBody>
      </Modal>
    </div>
  );
};

export default EnforcementModal;
