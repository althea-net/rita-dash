import React, { useContext, useState } from "react";
import { Button, Modal, ModalBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";
import validator from "email-validator";

import ExitList from "./ExitList";
import EmailForm from "./EmailForm";
import CodeForm from "./CodeForm";
import SelectedExit from "./SelectedExit";
import { Context } from "store";

export default ({ exits, open, setOpen }) => {
  let { actions } = useContext(Context);
  let [t] = useTranslation();

  let [exit, setExit] = useState(null);
  let [valid, setValid] = useState(false);
  let [email, setEmail] = useState("");
  let [registering, setRegistering] = useState(false);

  if (validator.validate(email)) valid = true;

  let registered = false;
  let denied = false;
  let pending = false;
  let gotinfo = false;
  let verify = false;

  if (exit) {
    exit = exits.find(e => e.nickname === exit.nickname);
    if (exit) {
      let { state } = exit.exitSettings;

      registered = state === "Registered";
      denied = state === "Denied";
      pending = state === "Pending";
      gotinfo = state === "GotInfo";

      if (exit.exitSettings.generalDetails) {
        let { verifMode } = exit.exitSettings.generalDetails;
        verify = verifMode === "Email";
      }
    }
  }

  let available = exits.filter(exit => {
    let { state } = exit.exitSettings;
    return state !== "Disabled" && state !== "New";
  });

  let selectExit = exit => {
    if (exit.exitSettings.state === "Registered") {
      actions.selectExit(exit.nickname);
      setOpen(false);
    }

    if (!verify && gotinfo) actions.registerExit(exit.nickname);
    setExit(exit);
  };

  let handleEmail = ({ target: { value } }) => {
    setValid(false);
    setEmail(value);
    if (validator.validate(value)) setValid(true);
  };

  let next = () => {
    setValid(false);
    setRegistering(true);
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

          {!(registered || denied) ? (
            <Button
              color="primary"
              className="ml-auto"
              onClick={next}
              style={{ width: 150 }}
              disabled={!valid}
            >
              {t("next")}
            </Button>
          ) : (
            <Button
              color="primary"
              className="ml-auto"
              onClick={finish}
              style={{ width: 150 }}
            >
              {t("finish")}
            </Button>
          )}
        </div>
        <SelectedExit exit={exit} />
        <ModalBody>
          {!exit && (
            <div>
              <p>{t("selectNode")}</p>
              <ExitList exits={available} selectExit={selectExit} />
            </div>
          )}

          {gotinfo &&
            verify &&
            (registering ? (
              <Progress value={100} animated color="info" />
            ) : (
              <EmailForm email={email} handleEmail={handleEmail} />
            ))}

          {(pending || registered) && (
            <CodeForm nickname={exit.nickname} registered={registered} />
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
