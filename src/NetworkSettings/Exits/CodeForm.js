import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import key from "images/key.png";
import { Form, FormGroup, Input, Progress } from "reactstrap";
import ExitsContext from "store/Exits";

export default ({ nickname, registered, targetLength }) => {
  let [t] = useTranslation();
  let [code, setCode] = useState("");
  let [waiting, setWaiting] = useState(false);
  let [expired, setExpired] = useState(false);

  let { verifyExit } = useContext(ExitsContext);

  useEffect(
    () => {
      const timer = setTimeout(() => {
        setWaiting(false);
        setExpired(true);
      }, 12000);

      return () => clearTimeout(timer);
    },
    [code]
  );

  let handleCode = e => {
    let { value } = e.target;
    setCode(value);
    setWaiting(true);

    if (value.length === targetLength) {
      verifyExit(nickname, value);
    }
  };

  return (
    <div>
      <h5>{t("confirmationCode")}</h5>
      <div className="d-flex p-4">
        <img
          src={key}
          alt="Key"
          className="mr-4"
          style={{ width: 106, height: 76 }}
        />
        <div>
          <p>{t("enterCode")}</p>
          <Form>
            <FormGroup>
              {registered ? (
                <div>Success!</div>
              ) : waiting && code.length === targetLength ? (
                <Progress animated color="info" value="100" />
              ) : (
                <>
                  {expired &&
                    code.length === targetLength && (
                      <div className="mb-2">
                        Registration did not succeed. Did you enter the right
                        code?
                      </div>
                    )}
                  <Input
                    value={code}
                    onChange={handleCode}
                    placeholder={t("confirmationCode")}
                    style={{ width: 300 }}
                  />
                </>
              )}
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};
