import React, { useContext, useState } from "react";
import { Button, Modal, ModalBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";

import emailValidator from "email-validator";
import { isValidPhoneNumber } from "react-phone-number-input";

import ExitList from "./ExitList";
import EmailForm from "./EmailForm";
import PhoneForm from "./PhoneForm";
import CodeForm from "./CodeForm";
import SelectedExit from "./SelectedExit";
import { Context } from "store";

const isValidEmail = emailValidator.validate;

export default ({ exits, open, setOpen }) => {
  let { actions } = useContext(Context);
  let [t] = useTranslation();

  let [exit, setExit] = useState(null);
  let [valid, setValid] = useState(false);
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [registering, setRegistering] = useState(false);

  let registered = false;
  let denied = false;
  let pending = false;
  let gotinfo = false;
  let verifMode;

  if (exit) {
    exit = exits.find(e => e.nickname === exit.nickname);
    if (exit) {
      let { state } = exit.exitSettings;

      registered = state === "Registered";
      denied = state === "Denied";
      pending = state === "Pending";
      gotinfo = state === "GotInfo";

      if (exit.exitSettings.generalDetails) {
        verifMode = exit.exitSettings.generalDetails.verifMode;
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

    if (!verifMode && gotinfo) actions.registerExit(exit.nickname);
    setExit(exit);
  };

  let handleEmail = e => {
    let { value } = e.target;
    setEmail(value);
    setValid(isValidEmail(value));
  };

  let handlePhone = value => {
    setPhone(value);
    setValid(isValidPhoneNumber(value));
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
            <h4 className="modal-close" onClick={() => setOpen(false)}>
              &times;
            </h4>
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
            registering &&
            (() => {
              switch (verifMode) {
                case "Email":
                  return <EmailForm email={email} handleEmail={handleEmail} />;
                case "Phone":
                  return <PhoneForm phone={phone} handlePhone={handlePhone} />;
                default:
                  return <Progress value={100} animated color="info" />;
              }
            })()}

          {(pending || registered) && (
            <CodeForm nickname={exit.nickname} registered={registered} />
          )}
        </ModalBody>
      </Modal>
    </div>
  );
};
