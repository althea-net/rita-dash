import React, { useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import ExitList from "./ExitList";
import Step2 from "./Step2";
import Step3 from "./Step3";
import SelectedExit from "./SelectedExit";

export default ({ exits, open, setOpen }) => {
  let [t] = useTranslation();
  let [step, setStep] = useState(1);
  let [exit, setExit] = useState(null);

  return (
    <div>
      <Modal isOpen={open} centered size="lg">
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
            onClick={() => {
              step === 3 ? setOpen(false) : setStep(step + 1);
            }}
            style={{ width: 150 }}
          >
            {step < 3 ? "Next" : "Finish"}
          </Button>
        </div>
        <SelectedExit exit={exit} />
        <ModalBody>
          {step === 1 && (
            <div>
              <p>{t("selectNode")}</p>
              <ExitList
                exits={exits}
                setExit={exit => {
                  setExit(exit);
                  setStep(step + 1);
                }}
              />
            </div>
          )}
          {step === 2 && <Step2 exit={exit} />}
          {step === 3 && <Step3 exit={exit} />}
        </ModalBody>
      </Modal>
    </div>
  );
};
