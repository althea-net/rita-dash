import React, { useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import ExitList from "./ExitList";
import RegistrationForm from "./RegistrationForm";
import VerifyForm from "./VerifyForm";

export default ({ exits, open, setOpen }) => {
  let [t] = useTranslation();
  let [step, setStep] = useState(1);
  let [exit, setExit] = useState(null);

  return (
    <div>
      <Modal isOpen={open} centered>
        <div className="modal-header d-flex justify-content-between">
          <div className="d-flex mr-auto">
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
              onClick={() => setOpen(false)}
            >
              <h4 aria-hidden="true">&times;</h4>
            </button>

            <h4 className="ml-2">{t("exitNodeSetup")}</h4>
          </div>

          <Button
            color="primary"
            className="ml-auto"
            onClick={() => setStep(step + 1)}
          >
            Next
          </Button>
        </div>
        <ModalBody>
          {step === 1 && (
            <div>
              <p>{t("selectNode")}</p>
              <ExitList exits={exits} setExit={setExit} />
            </div>
          )}
          {step === 2 && <RegistrationForm exit={exit} />}
          {step === 3 && <VerifyForm exit={exit} />}
        </ModalBody>
      </Modal>
    </div>
  );
};
