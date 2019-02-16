import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import envelope from "../images/email.png";
import { Form, FormGroup, Input } from "reactstrap";

export default ({ exit }) => {
  let [t] = useTranslation();
  let [email, setEmail] = useState("");

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
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder={t("emailAddress")}
                style={{ width: 300 }}
              />
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};
