import React from "react";
import { useTranslation } from "react-i18next";
import phoneIcon from "images/phone.svg";
import { Form, FormGroup } from "reactstrap";
import PhoneInput from "react-phone-number-input";
import { Flags } from "utils";

const PhoneForm = ({ phone, handlePhone, next }) => {
  const [t] = useTranslation();

  const submit = (e) => {
    e.preventDefault();
    handlePhone(phone);
    next();
  };

  return (
    <div>
      <h5>{t("phoneNumber")}</h5>

      <div className="d-flex mb-4">
        <img
          src={phoneIcon}
          alt="Phone"
          style={{ maxWidth: 80 }}
          className="mr-4"
        />
        <p style={{ maxWidth: 400 }}>{t("enterPhone")}</p>
      </div>
      <Form onSubmit={submit}>
        <FormGroup>
          <PhoneInput
            country="US"
            flags={Flags}
            id="exitPhone"
            placeholder={t("phoneNumber")}
            value={phone}
            onChange={(p) => handlePhone(p)}
          />
        </FormGroup>
      </Form>
    </div>
  );
};

export default PhoneForm;
