import React, { useContext, useState } from "react";
import { Button, Modal, ModalBody } from "reactstrap";
import { useTranslation } from "react-i18next";
import validator from "email-validator";

import ExitList from "./ExitList";
import EmailForm from "./EmailForm";
import CodeForm from "./CodeForm";
import SelectedExit from "./SelectedExit";
import { Context } from "../store";

export default ({ exits, open, setOpen }) => {
  let { actions } = useContext(Context);
  let [t] = useTranslation();
  let [step, setStep] = useState(1);
  let [exit, setExit] = useState(null);
  let [valid, setValid] = useState(false);

  let [email, setEmail] = useState("");

  let registered = false;

  if (exit) {
    let {
      exitSettings: { state }
    } = exits.find(e => e.nickname === exit.nickname);
    registered = state === "Registered";
  }

  let selectExit = exit => {
    if (exit.exitSettings.state === "Registered") {
      actions.selectExit(exit.nickname);
      setOpen(false);
    }
    setExit(exit);
    setStep(step + 1);
  };

  let handleEmail = ({ target: { value } }) => {
    setValid(false);
    setEmail(value);
    if (validator.validate(value)) setValid(true);
  };

  let next = () => {
    setValid(false);
    setStep(3);
    actions.registerExit(exit.nickname, email);
  };

  let finish = () => {
    setOpen(false);
  };

  return (
    <div>
      <Modal isOpen={open} centered size="lg" toggle={() => setOpen(!open)}>
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

          {step === 2 && (
            <Button
              color="primary"
              className="ml-auto"
              onClick={next}
              style={{ width: 150 }}
              disabled={!valid}
            >
              {t("next")}
            </Button>
          )}
          {step === 3 && (
            <Button
              color="primary"
              className="ml-auto"
              onClick={finish}
              style={{ width: 150 }}
              disabled={!registered}
            >
              {t("finish")}
            </Button>
          )}
        </div>
        <SelectedExit exit={exit} />
        <ModalBody>
          {step === 1 && (
            <div>
              <p>{t("selectNode")}</p>
              <ExitList exits={exits} selectExit={selectExit} />
            </div>
          )}
          {step === 2 && <EmailForm email={email} handleEmail={handleEmail} />}
          {step === 3 && (
            <CodeForm nickname={exit.nickname} registered={registered} />
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
