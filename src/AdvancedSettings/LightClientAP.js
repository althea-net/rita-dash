import React from "react";
import { useTranslation } from "react-i18next";
import { Form, FormGroup, CustomInput } from "reactstrap";
import { LeftCard } from "ui";
import { post, useStore } from "store";
import uselightClientAP from "hooks/useLightClientAP";

const LightClient = () => {
  const [t] = useTranslation();
  const [{ lightClient }, dispatch] = useStore();
  console.log(lightClient);

  uselightClientAP();

  const check = e => {
    post(`/interfaces/lightclient/${!lightClient}`);
    dispatch({ type: "lightClient", lightClient: !lightClient });
  };

  return (
    <LeftCard>
      <h4>{t("remoteAccess")}</h4>
      <p>{t("remoteAccessBlurb")}</p>
      <Form className="w-100">
        <FormGroup>
          <CustomInput
            type="checkbox"
            id="remoteAccess"
            onChange={check}
            checked={lightClient}
            label={t("remoteAccess")}
          />
        </FormGroup>
      </Form>
    </LeftCard>
  );
};

export default LightClient;
