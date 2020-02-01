import React from "react";
import { useTranslation } from "react-i18next";
import { Form, FormGroup, CustomInput } from "reactstrap";
import { RightCard } from "ui";
import { post, useStore } from "store";
import useMeshAP from "hooks/useMeshAP";

const Mesh = () => {
  const [t] = useTranslation();
  const [{ mesh }, dispatch] = useStore();

  useMeshAP();

  const check = e => {
    post(`/interfaces/mesh/${!mesh}`);
    dispatch({ type: "mesh", mesh: !mesh });
  };

  return (
    <RightCard>
      <h4>{t("mesh")}</h4>
      <p>{t("meshBlurb")}</p>
      <Form className="w-100">
        <FormGroup>
          <CustomInput
            type="checkbox"
            id="mesh"
            onChange={check}
            checked={mesh}
            label={t("mesh")}
          />
        </FormGroup>
      </Form>
    </RightCard>
  );
};

export default Mesh;
