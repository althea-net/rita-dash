import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import key from "images/key.png";
import { Form, FormGroup, Input, Progress } from "reactstrap";
import { Context } from "store";

export default ({ nickname, registered }) => {
  let { actions } = useContext(Context);
  let [t] = useTranslation();
  let [code, setCode] = useState("");
  let [waiting, setWaiting] = useState(false);
  let [expired, setExpired] = useState(false);

  let handleCode = async ({ target: { value } }) => {
    setCode(value);
    setWaiting(true);
    setTimeout(() => {
      setWaiting(false);
      setExpired(true);
    }, 12000);

    if (value.length === 6) {
      actions.verifyExit(nickname, value);
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
              ) : waiting && code.length === 6 ? (
                <Progress animated color="info" value="100" />
              ) : (
                <>
                  {expired && (
                    <div>
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
