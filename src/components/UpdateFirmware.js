import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalBody } from "reactstrap";

import router from "../images/router.png";
import bigGreenCheck from "../images/big_green_check.png";

export default ({ open, setOpen }) => {
  let [t] = useTranslation();
  let [updated, setUpdated] = useState(false);

  return (
    <Modal isOpen={open} centered toggle={() => setOpen(!open)} size="sm">
      <div className="modal-header d-flex justify-content-between">
        <h4 className="m-0">{t("Firmware Updates")}</h4>
        <h2
          style={{ marginTop: -5, cursor: "pointer" }}
          onClick={() => setOpen(false)}
        >
          &times;
        </h2>
      </div>
      {updated ? (
        <ModalBody className="text-center">
          <img src={bigGreenCheck} alt="Checkmark" className="mb-2" />
          <h5>Your firmware is currently up to date!</h5>
        </ModalBody>
      ) : (
        <ModalBody className="text-center">
          <img src={router} alt="Router" className="mb-2" />
          <p>
            <b>A new version of the firmware is available (4.3.4)</b>
          </p>
          <Button
            className="mb-2"
            color="primary"
            style={{ width: 250 }}
            onClick={() => setUpdated(true)}
          >
            Update Now
          </Button>
          <p>
            <small>After you update, you will have to log in again.</small>
          </p>
        </ModalBody>
      )}
    </Modal>
  );
};
