import React from "react";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const FundingStatus = () => {
  const [t] = useTranslation();

  return (
    <div className="d-flex mt-2">
      <FontAwesomeIcon
        icon="exclamation-triangle"
        color="black"
        className="mr-2"
        style={{ cursor: "pointer", marginTop: 3 }}
      />
      <div>
        <p className="mb-0">
          <b style={{ color: "black" }}>{t("notEnoughFunds")}</b>
        </p>
        <p>{t("routerHas")}</p>
      </div>
    </div>
  );
};

export default FundingStatus;
