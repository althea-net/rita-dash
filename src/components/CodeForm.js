import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import key from "../images/key.png";
import { Form, FormGroup, Input } from "reactstrap";

export default ({ exit }) => {
  let [t] = useTranslation();
  const [code, setCode] = useState("");

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
              <Input
                value={code}
                onChange={e => setCode(e.target.value)}
                placeholder={t("confirmationCode")}
                style={{ width: 300 }}
              />
            </FormGroup>
          </Form>
        </div>
      </div>
    </div>
  );
};
