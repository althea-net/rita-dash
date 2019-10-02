import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Modal, ModalBody, Progress } from "reactstrap";
import { post, useStore } from "store";
import { Error } from "utils";

import router from "images/router.png";
import bigGreenCheck from "images/big_green_check.png";

import useInterval from "hooks/useInterval";

export default ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [updated, setUpdated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [{ waiting }, dispatch] = useStore();
  const [firmwareUpgrading, setFirmwareUpgrading] = useState(false);

  const toggle = () => setOpen(!open);
  const closed = () => setUpdated(false);

  const update = async () => {
    setLoading(true);

    try {
      setFirmwareUpgrading(true);
      dispatch({ type: "firmwareUpgrading", firmwareUpgrading: true });
      dispatch({ type: "startWaiting", waiting: 120 });
      await post("/router/update");
      setUpdated(true);
    } catch (e) {
      console.log(e);
      setError(t("updateError"));
    }

    setLoading(false);
  };

  useInterval(() => {
    if (firmwareUpgrading) dispatch({ type: "keepWaiting" });
  }, waiting ? 1000 : null);

  return (
    <Modal
      isOpen={open && !waiting}
      centered
      toggle={toggle}
      onClosed={closed}
      size="sm"
    >
      <div className="modal-header d-flex justify-content-between">
        <h4 className="m-0">{t("updateFirmware")}</h4>
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
          <Alert color="success">{t("upToDate")}</Alert>
        </ModalBody>
      ) : (
        <ModalBody className="text-center">
          <img src={router} alt="Router" className="mb-2" />
          <Error error={error} />
          {loading ? (
            <Progress animated color="primary" value={100} />
          ) : (
            <Button
              className="mb-2"
              color="primary"
              id="updateInModal"
              style={{ width: 250 }}
              onClick={update}
            >
              {t("updateNow")}
            </Button>
          )}
          <p>
            <small>{t("updateWarning")}</small>
          </p>
        </ModalBody>
      )}
    </Modal>
  );
};
