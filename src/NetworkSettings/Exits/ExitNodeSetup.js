import React, { useContext, useState } from "react";
import { Alert, Button, Modal, ModalBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";

import emailValidator from "email-validator";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Error } from "utils";

import ExitList from "./ExitList";
import EmailForm from "./EmailForm";
import PhoneForm from "./PhoneForm";
import CodeForm from "./CodeForm";
import SelectedExit from "./SelectedExit";
import ExitsContext from "store/Exits";

const isValidEmail = emailValidator.validate;

const ExitNodeSetup = ({ open, setOpen }) => {
  const [t] = useTranslation();

  const [exit, setExit] = useState(null);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [valid, setValid] = useState(false);

  let registered = false;
  let denied = false;
  let pending = false;
  let gotinfo = false;
  let verifMode;

  const {
    error,
    exits,
    registering,
    setRegistering,
    resetting,
    resetExit,
    registerExit,
    selectExit
  } = useContext(ExitsContext);

  if (exit) {
    let exitObj = exits.find(e => e.nickname === exit.nickname);
    if (exitObj) {
      let { state } = exitObj.exitSettings;

      registered = state === "Registered";
      denied = state === "Denied";
      pending = state === "Pending";
      gotinfo = state === "GotInfo";

      if (exitObj.exitSettings.generalDetails) {
        verifMode = exitObj.exitSettings.generalDetails.verifMode;
      }
    }
  }

  let available = exits.filter(exit => {
    let { state } = exit.exitSettings;
    return state !== "Disabled" && state !== "New";
  });

  let onSelectExit = exit => {
    let { nickname } = exit;

    if (exit.exitSettings.state === "Registered") {
      selectExit(nickname);
      setOpen(false);
    }

    if (!verifMode && gotinfo) {
      registerExit(nickname, email, phone);
    }

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
    setRegistering(true);
    registerExit(exit.nickname, email, phone);
  };

  let reset = () => {
    setRegistering(false);
    resetExit(exit);
  };

  let finish = () => {
    setRegistering(false);
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
          {pending && (
            <Button
              color="primary"
              className="ml-auto mr-2"
              onClick={reset}
              style={{ width: 150 }}
              id="setupModalBackButton"
            >
              {t("back")}
            </Button>
          )}

          {!(
            registered ||
            denied ||
            pending ||
            resetting.length ||
            registering
          ) && (
            <Button
              color="primary"
              onClick={next}
              style={{ width: 150 }}
              disabled={!valid}
              id="setupModalNextButton"
            >
              {t("next")}
            </Button>
          )}
          {(registered || denied) && (
            <Button
              color="primary"
              className="ml-auto"
              onClick={finish}
              style={{ width: 150 }}
              id="setupModalFinishButton"
            >
              {t("finish")}
            </Button>
          )}
        </div>
        {resetting.length ? (
          <ModalBody>
            <Alert color="info">{t("resetting")}</Alert>
            <Progress value={100} animated color="info" />
          </ModalBody>
        ) : (
          <>
            <SelectedExit
              exit={exit}
              setExit={setExit}
              setRegistering={setRegistering}
            />
            <ModalBody>
              <Error error={error} />
              {!exit && (
                <div>
                  <p>{t("selectNode")}</p>
                  <ExitList exits={available} selectExit={onSelectExit} />
                </div>
              )}
              {gotinfo &&
                (registering ? (
                  <Progress value={100} animated color="info" />
                ) : (
                  (() => {
                    switch (verifMode) {
                      case "Email":
                        return (
                          <EmailForm email={email} handleEmail={handleEmail} />
                        );
                      case "Phone":
                        return (
                          <PhoneForm phone={phone} handlePhone={handlePhone} />
                        );
                      default:
                        return null;
                    }
                  })()
                ))}
              {!resetting.length &&
                (pending || registered) && (
                  <CodeForm
                    nickname={exit.nickname}
                    registered={registered}
                    targetLength={verifMode === "Email" ? 6 : 4}
                    setOpen={setOpen}
                  />
                )}
            </ModalBody>
          </>
        )}
      </Modal>
    </div>
  );
};

export default ExitNodeSetup;
