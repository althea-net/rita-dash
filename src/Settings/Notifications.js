/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardBody,
  Form,
  FormGroup,
  CustomInput,
  Input,
  Label,
} from "reactstrap";
import { get, post } from "store";
import PhoneInput, { isValidPhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { InnerPhoneInput } from "ui"
import emailValidator from "email-validator";
import { Success } from "utils";

const isValidEmail = emailValidator.validate;

export default ({ balance, symbol }) => {
  let [t] = useTranslation();

  let [checked, setChecked] = useState(false);
  let [email, setEmail] = useState("");
  let [phone, setPhone] = useState("");
  let [success, setSuccess] = useState(false);

  let init = async () => {
    let res = await get("/low_balance_notification");
    setChecked(res === "true");

    let phone = await get("/phone");
    let email = await get("/email");
    setEmail(email);
    setPhone(phone);
  };

  useEffect(() => {
    init();
    return;
  }, []);

  let validEmail = !email || isValidEmail(email);
  let validPhone = !phone || isValidPhoneNumber(phone);

  let handleEmail = (e) => {
    let { value } = e.target;
    setEmail(value);
  };

  let handlePhone = (value) => {
    setPhone(value);
  };

  let submit = async (e) => {
    e.preventDefault();
    if (validEmail && validPhone) {
      try {
        await post(`/phone`, phone);
        await post(`/email`, email);

        post(`/low_balance_notification/${checked}`);

        setSuccess(t("settingsSaved"));
      } catch (e) { }
    }
  };

  return (
    <Card className="mb-4" id="notifications">
      <CardBody>
        <h4>{t("lowBalanceNotifications")}</h4>
        <p>{t("whenEmail")}</p>

        {success && <Success message={success} />}
        <Form onSubmit={submit}>
          <FormGroup className="d-flex mb-0">
            <CustomInput
              type="checkbox"
              id="notifications"
              onChange={() => setChecked(!checked)}
              checked={checked}
              label={t("enableNotifications")}
            />
          </FormGroup>
          <div className="d-flex flex-wrap">
            <FormGroup className="mr-2 flex-grow-1">
              <Label for="email">{t("emailAddress")}</Label>
              <Input
                name="email"
                id="email"
                value={email}
                onChange={handleEmail}
                placeholder={t("placeholderEmail")}
                invalid={!validEmail}
                style={{ minWidth: 280 }}
              />
            </FormGroup>
            <FormGroup className="mr-2 flex-grow-1">
              <Label for="phone">{t("phoneNumber")}</Label>
              <PhoneInput
                defaultCountry="US"
                id="phoneNumber"
                placeholder={t("phoneNumber")}
                value={phone}
                onChange={(p) => handlePhone(p)}
                inputComponent={InnerPhoneInput}
              />
            </FormGroup>
            <FormGroup className="mt-auto">
              <Button color="primary">{t("save")}</Button>
            </FormGroup>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
};
