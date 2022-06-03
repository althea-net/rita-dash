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
import { useStore } from "store";

const isValidEmail = emailValidator.validate;

const ExitNodeSetup = ({ open, setOpen }) => {
  const [t] = useTranslation();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [valid, setValid] = useState(false);

  const [{ exitWg, exits, resetting }, dispatch] = useStore();
  const exit = exits.find((e) => e.exitSettings.wgPublicKey === exitWg);

  let registered = false;
  let denied = false;
  let pending = false;
  let gotinfo = false;
  let verifMode;

  const {
    error,
    registering,
    setRegistering,
    resetExit,
    registerExit,
    selectExit,
  } = useContext(ExitsContext);

  if (exit) {
    let exitObj = exits.find((e) => e.nickname === exit.nickname);
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

  const select = (exit) => {
    let verifMode;

    if (exit.exitSettings.generalDetails)
      verifMode = exit.exitSettings.generalDetails.verifMode;

    let {
      nickname,
      exitSettings: { wgPublicKey: exitWg, state },
    } = exit;

    if (state === "Registered") {
      selectExit(nickname);
      toggle();
    }

    if (verifMode === "Off" && state === "GotInfo") {
      registerExit(nickname, email, phone);
      toggle();
    }

    dispatch({ type: "exitWg", exitWg: exitWg });
  };

  const handleEmail = (e) => {
    const { value } = e.target;
    setEmail(value);
    setValid(isValidEmail(value));
  };

  const handlePhone = (value) => {
    setPhone(value);
    setValid(isValidPhoneNumber(value));
  };

  const next = () => {
    setRegistering(true);
    registerExit(exit.nickname, email, phone);
  };

  const reset = () => {
    setRegistering(false);
    resetExit(exit);
  };

  const toggle = () => {
    setRegistering(false);
    setOpen(false);
    dispatch({ type: "exitWg", exitWg: null });
  };

  return (
    <div>
      <Modal isOpen={open} centered size="lg" toggle={toggle}>
        <div className="modal-header d-flex justify-content-between">
          <div className="d-flex mr-auto">
            <h4 className="modal-close" onClick={toggle}>
              &times;
            </h4>
            <h4 className="ml-2">{t("exitNodeSetup")}</h4>
          </div>
          {((gotinfo && registering) || pending) && (
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

          {exit &&
            !(
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
                disabled={verifMode !== "Off" && !valid}
                id="setupModalNextButton"
              >
                {t("next")}
              </Button>
            )}
          {(registered || denied) && (
            <Button
              color="primary"
              className="ml-auto"
              onClick={toggle}
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
            <Progress value={100} animated color="primary" />
          </ModalBody>
        ) : (
          <>
            <SelectedExit exit={exit} setRegistering={setRegistering} />
            <ModalBody>
              <Error error={error} />
              {!exit && (
                <div>
                  <ExitList select={select} />
                </div>
              )}
              {gotinfo &&
                (registering ? (
                  <Progress value={100} animated color="primary" />
                ) : (
                  (() => {
                    switch (verifMode) {
                      case "Email":
                        return (
                          <EmailForm email={email} handleEmail={handleEmail} />
                        );
                      case "Phone":
                        return (
                          <PhoneForm
                            phone={phone}
                            handlePhone={handlePhone}
                            next={next}
                          />
                        );
                      default:
                        return null;
                    }
                  })()
                ))}
              {!resetting.length && (pending || registered) && (
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
