import React from "react";
import usa from "../images/usa.svg";
import { useTranslation } from "react-i18next";

export default ({ exit }) => {
  let [t] = useTranslation();

  if (!exit || !exit.exitSettings) return null;
  let { exitSettings, nickname } = exit;
  let { description } = exitSettings.generalDetails;

  return (
    <div>
      <h5 className="pl-4 pt-4 pb-2">{t("selectedExit")}</h5>
      <div className="d-flex pl-4">
        <img
          src={usa}
          alt="USA"
          style={{ width: 50, height: 50, marginRight: 20 }}
        />
        <div className="d-flex">
          <div>
            <h5>{nickname}</h5>
            <p className="mb-0">{description}</p>
          </div>
        </div>
      </div>
      <hr className="w-100" />
    </div>
  );
};
