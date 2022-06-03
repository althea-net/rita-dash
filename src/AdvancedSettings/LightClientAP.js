import React from "react";
import { useTranslation } from "react-i18next";
import { Form, FormGroup, CustomInput } from "reactstrap";
import { LeftCard } from "ui";
import { post, useStore } from "store";
import uselightClientAP from "hooks/useLightClientAP";

const LightClient = () => {
  const [t] = useTranslation();
  const [{ lightClientAP }, dispatch] = useStore();

  uselightClientAP();

  const check = (e) => {
    post(`/interfaces/lightclient/${!lightClientAP}`);
    dispatch({ type: "lightClientAP", lightClientAP: !lightClientAP });
  };

  return (
    <LeftCard>
      <h4>{t("lightClientAP")}</h4>
      <p>{t("lightClientAPBlurb")}</p>
      <p>
        <a href="https://play.google.com/store/apps/details?id=com.althea.althea_android">
          {t("lightClientDownloadLinkText")}
        </a>
      </p>
      <Form className="w-100">
        <FormGroup>
          <CustomInput
            type="checkbox"
            id="lightClientAP"
            onChange={check}
            checked={lightClientAP}
            label={t("lightClientAP")}
          />
        </FormGroup>
      </Form>
    </LeftCard>
  );
};

export default LightClient;
