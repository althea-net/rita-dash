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
  Label
} from "reactstrap";
import { get, post } from "store";
import PhoneInput from "react-phone-number-input";
import SmartInput from "react-phone-number-input/smart-input";
// import flags from "react-phone-number-input/flags";
import emailValidator from "email-validator";
import { isValidPhoneNumber } from "react-phone-number-input";
import { Flags, Success } from "utils";

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

    let settings = await get("/settings");
    setEmail(settings.exitClient.regDetails.email);
    setPhone(settings.exitClient.regDetails.phone);
  };

  useEffect(() => {
    init();
    return;
  }, []);

  let validEmail = !email || isValidEmail(email);
  let validPhone = !phone || isValidPhoneNumber(phone);

  let handleEmail = e => {
    let { value } = e.target;
    setEmail(value);
  };

  let handlePhone = value => {
    setPhone(value);
  };

  let submit = async e => {
    e.preventDefault();
    if (validEmail && validPhone) {
      try {
        await post(`/settings`, {
          exit_client: {
            reg_details: {
              email,
              phone,
              low_balance_notification: checked
            }
          }
        });

        post(`/low_balance_notification/${checked}`);

        setSuccess(t("settingsSaved"));
      } catch (e) {}
    }
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <h3>{t("lowBalanceNotifications")}</h3>
        <p>{t("whenEmail")}</p>

        {success && <Success message={success} />}
        <Form onSubmit={submit}>
          <FormGroup className="d-flex mb-0">
            <CustomInput
              type="checkbox"
              id="notifications"
              onChange={() => setChecked(!checked)}
              checked={checked}
            />
            <Label for="notifications">{t("enableNotifications")}</Label>
          </FormGroup>
          <div className="d-flex flex-wrap">
            <FormGroup className="mr-2">
              <Label for="email">{t("emailAddress")}</Label>
              <Input
                name="email"
                id="email"
                value={email}
                onChange={handleEmail}
                placeholder="placeholder@domain.com"
                invalid={!validEmail}
                style={{ width: 300 }}
              />
            </FormGroup>
            <FormGroup className="mr-2">
              <Label for="phone">{t("phoneNumber")}</Label>
              <PhoneInput
                country="US"
                id="phoneNumber"
                inputComponent={SmartInput}
                flags={Flags}
                placeholder={t("phoneNumber")}
                value={phone}
                onChange={p => handlePhone(p)}
                style={{ width: 300 }}
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
