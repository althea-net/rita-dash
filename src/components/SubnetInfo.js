import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, Label } from "reactstrap";

import { Context } from "../store";

export default ({ setEditing }) => {
  const [t] = useTranslation();
  const {
    state: { daoAddress, meshIp }
  } = useContext(Context);

  return (
    <>
      <p>{t("subnetsAre")}</p>

      <div className="d-flex mb-4">
        <div className="mr-2">
          <Label>{t("ipAddress")}</Label>
          <div>{meshIp}</div>
        </div>
        <div>
          <Label>{t("subnetOrganization")}</Label>
          <div>{daoAddress}</div>
        </div>
      </div>

      <Button
        color="secondary"
        style={{ width: 200 }}
        onClick={() => setEditing(true)}
      >
        Edit
      </Button>
    </>
  );
};
