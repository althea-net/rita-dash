/* eslint-disable import/no-anonymous-default-export */
import React from "react";
import { useTranslation } from "react-i18next";
import envelope from "images/email.png";
import { Form, FormGroup, Input } from "reactstrap";

export default ({ email, handleEmail }) => {
  let [t] = useTranslation();

  return (
    <div>
      <h5>{t("emailAddress")}</h5>

      <div className="d-flex p-4">
        <img src={envelope} alt="Envelope" className="mr-4" />
        <div>
          <p>{t("enterEmail")}</p>
          <Form>
            <FormGroup>
              <Input
                name="email"
                value={email}
                onChange={handleEmail}
                placeholder={t("emailAddress")}
                style={{ width: 300 }}
                id="exitEmail"
              />
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};
