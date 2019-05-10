import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import { Button, Label } from "reactstrap";
import Context from "./Context";

export default ({ setEditing }) => {
  const [t] = useTranslation();
  const { daoAddress, meshIp } = useContext(Context);

  return (
    <>
      <p>{t("subnetsAre")}</p>

      <div className="d-flex flex-wrap mb-4">
        <div className="mr-2">
          <Label>{t("ipAddress")}</Label>
          <div className="text-break">{meshIp}</div>
        </div>
        <div>
          <Label>{t("subnetOrganization")}</Label>
          <div className="text-break">{daoAddress}</div>
        </div>
      </div>

      <Button
        color="secondary"
        style={{ width: 200 }}
        onClick={() => setEditing(true)}
      >
        {t("edit")}
      </Button>
    </>
  );
};
