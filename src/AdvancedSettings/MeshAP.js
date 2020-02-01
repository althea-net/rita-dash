import React from "react";
import { useTranslation } from "react-i18next";
import { Form, FormGroup, CustomInput } from "reactstrap";
import { RightCard } from "ui";
import { post, useStore } from "store";
import useMeshAP from "hooks/useMeshAP";

const Mesh = () => {
  const [t] = useTranslation();
  const [{ meshAP }, dispatch] = useStore();

  useMeshAP();

  const check = e => {
    post(`/interfaces/mesh/${!meshAP}`);
    dispatch({ type: "meshAP", meshAP: !meshAP });
  };

  return (
    <RightCard>
      <h4>{t("meshAP")}</h4>
      <p>{t("meshAPBlurb")}</p>
      <Form className="w-100">
        <FormGroup>
          <CustomInput
            type="checkbox"
            id="meshAP"
            onChange={check}
            checked={meshAP}
            label={t("meshAP")}
          />
        </FormGroup>
      </Form>
    </RightCard>
  );
};

export default Mesh;
