import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import exclamation from "images/exclamation.svg";

const DebtWarning = (props) => {
  let debt_value = props.debtValue;
  const [t] = useTranslation();
  const [dismissed, setDismissed] = useState(false);

  const dismiss = (e) => {
    e.preventDefault();
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <div
      className="d-flex flex-column mx-auto my-auto pb-2"
      style={{ marginTop: 30 }}
    >
      <div className="d-flex w-100 justify-content-around">
        <img
          src={exclamation}
          alt="Exclamation Mark Symbol"
          style={{ marginRight: 10 }}
        />
        <div
          className="my-auto"
          style={{ color: "#777", fontSize: 18, cursor: "pointer" }}
          dangerouslySetInnerHTML={{
            __html: t("youHaveDebt", { debt_value }),
          }}
        />
      </div>
      <div className="ml-auto">
        <a href="#dismiss" onClick={dismiss} style={{ zIndex: 99 }}>
          {t("dismissWarning")}
        </a>
      </div>
    </div>
  );
};

export default DebtWarning;
