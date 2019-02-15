import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Card,
  CardBody,
  Form,
  FormGroup,
  CustomInput,
  Label
} from "reactstrap";

export default ({ balance, symbol }) => {
  let [t] = useTranslation();
  let [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <Card className="mb-4">
      <CardBody>
        <Form>
          <h3>{t("emailNotifications")}</h3>
          <p>{t("whenEmail")}</p>

          <FormGroup className="d-flex">
            <CustomInput
              type="checkbox"
              id="notifications"
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
              checked={notificationsEnabled}
            />
            <Label for="notifications">{t("enableNotifications")}</Label>
          </FormGroup>
        </Form>
      </CardBody>
    </Card>
  );
};
