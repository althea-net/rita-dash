import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import key from "images/key.png";
import { Alert, Form, FormGroup, Input, Progress } from "reactstrap";
import ExitsContext from "store/Exits";
import bigGreenCheck from "images/big_green_check.png";

const CodeForm = ({ nickname, registered, targetLength, setOpen }) => {
  let [t] = useTranslation();
  let [code, setCode] = useState("");
  let [waiting, setWaiting] = useState(false);
  let [expired, setExpired] = useState(false);

  let { verifyExit } = useContext(ExitsContext);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaiting(false);
      setExpired(true);
    }, 12000);

    return () => clearTimeout(timer);
  }, [code]);

  let handleCode = (e) => {
    let { value } = e.target;
    setCode(value);
    setWaiting(true);

    if (value.length === targetLength) {
      verifyExit(nickname, value);
    }
  };

  return registered ? (
    <div className="w-100 text-center mx-auto">
      <img src={bigGreenCheck} alt="Checkmark" className="mb-2" />
      <p>{t("successfullyRegistered")}</p>
    </div>
  ) : (
    <div>
      <h5>{t("confirmationCode")}</h5>
      <div className="d-flex mb-4">
        <img
          src={key}
          alt="Key"
          className="mr-4"
          style={{ maxWidth: 100, maxHeight: 75 }}
        />
        <p className="my-auto">{t("enterCode")}</p>
      </div>
      <Form>
        <FormGroup>
          {waiting && code.length === targetLength ? (
            <Progress animated color="primary" value="100" />
          ) : (
            <>
              {expired && code.length === targetLength && (
                <Alert color="danger" className="w-100">
                  {t("registrationFailed")}
                </Alert>
              )}
              <Input
                value={code}
                id="confirmationCode"
                onChange={handleCode}
                placeholder={t("confirmationCode")}
                autoFocus
              />
            </>
          )}
        </FormGroup>
      </Form>
    </div>
  );
};

export default CodeForm;
