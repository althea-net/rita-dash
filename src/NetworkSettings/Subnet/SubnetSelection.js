import React from "react";
import { useTranslation } from "react-i18next";
import SubnetForm from "./SubnetForm";
import EthAddress from "./EthAddress";

export default () => {
  let [t] = useTranslation();

  return (
    <>
      <p>{t("yourOrganizer")}</p>
      <SubnetForm />
      <EthAddress />
    </>
  );
};
