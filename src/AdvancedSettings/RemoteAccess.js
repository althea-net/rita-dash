import React from "react";
import { useTranslation } from "react-i18next";
import { Form, FormGroup, CustomInput } from "reactstrap";
import { Card } from "ui";
import { post, useStore } from "store";
import useRemoteAccess from "hooks/useRemoteAccess";

const RemoteAccess = () => {
  const [t] = useTranslation();
  const [{ remoteAccess }, dispatch] = useStore();

  useRemoteAccess();

  const check = e => {
    post(`/remote_access/${!remoteAccess}`);
    dispatch({ type: "remoteAccess", remoteAccess: !remoteAccess });
  };

  return (
    <Card>
      <h4>{t("remoteAccess")}</h4>
      <p>{t("remoteAccessBlurb")}</p>
      <Form className="w-100">
        <FormGroup>
          <CustomInput
            type="checkbox"
            id="remoteAccess"
            onChange={check}
            checked={remoteAccess}
            label={t("remoteAccess")}
          />
        </FormGroup>
      </Form>
    </Card>
  );
};

export default RemoteAccess;
