/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, Modal, ModalBody, Progress } from "reactstrap";
import { post, useStore } from "store";
import { Warning } from "utils";
import useInterval from "hooks/useInterval";
import bigGreenCheck from "images/big_green_check.png";

import router from "images/router.png";

export default ({ open, setOpen }) => {
  const [t] = useTranslation();
  const [{ waiting }, dispatch] = useStore();
  const [warning, setWarning] = useState("");
  const [firmwareUpgrading, setFirmwareUpgrading] = useState(false);
  const [firmwareUpgraded, setFirmwareUpgraded] = useState(false);

  const toggle = () => {
    setOpen(false);
    setFirmwareUpgraded(false);
    setWarning(null);
  };

  const update = async () => {
    setFirmwareUpgrading(true);

    dispatch({ type: "firmwareUpgrading", firmwareUpgrading: true });
    dispatch({ type: "startWaiting", waiting: 120 });
    try {
      await post("/router/update");
    } catch (e) {
      console.log(e);
    }
  };

  useInterval(
    () => {
      if (firmwareUpgrading) {
        dispatch({ type: "keepWaiting" });
        if (!waiting && !firmwareUpgraded) {
          setFirmwareUpgrading(false);
          setWarning(t("firmwareNoUpdate"));
          dispatch({ type: "firmwareUpgrading", firmwareUpgrading: false });
          dispatch({ type: "warning", warning: true });
        }
      }
    },
    waiting ? 1000 : null
  );

  useEffect(() => {
    const firmwareUpgraded =
      window.localStorage.getItem("firmwareUpgraded") === "true";

    setFirmwareUpgraded(firmwareUpgraded);

    if (firmwareUpgraded)
      window.localStorage.setItem("firmwareUpgraded", false);
  }, []);

  return (
    <Modal isOpen={open || firmwareUpgraded} centered toggle={toggle} size="sm">
      <div className="modal-header d-flex justify-content-between">
        <h4 className="m-0">{t("updateFirmware")}</h4>
        <h2 style={{ marginTop: -5, cursor: "pointer" }} onClick={toggle}>
          &times;
        </h2>
      </div>
      {firmwareUpgraded ? (
        <ModalBody className="text-center">
          <img src={bigGreenCheck} alt="Checkmark" className="mb-2" />
          <Alert color="success">{t("upToDate")}</Alert>
        </ModalBody>
      ) : (
        <ModalBody className="text-center">
          <img src={router} alt="Router" className="mb-2" />
          <Warning message={warning} />
          {!warning && (
            <div>
              {firmwareUpgrading ? (
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
              <p className="my-2">
                {waiting > 0 && t("waiting", { seconds: waiting })}
              </p>
              <p>
                <small>{t("updateWarning")}</small>
              </p>
            </div>
          )}
        </ModalBody>
      )}
    </Modal>
  );
};
