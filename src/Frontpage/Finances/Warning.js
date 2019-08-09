import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Right } from "ui";
import { useStore } from "store";
import exclamation from "images/exclamation.svg";

const Warning = () => {
  const [t] = useTranslation();
  const [{ backupCreated }] = useStore();
  const [dismissed, setDismissed] = useState(false);

  const dismiss = e => {
    e.preventDefault();
    setDismissed(true);
  };

  if (backupCreated || dismissed) return null;

  return (
    <Right>
      <div className="d-flex flex-column mx-auto" style={{ marginTop: 30 }}>
        <div className="d-flex w-100 justify-content-around">
          <img
            src={exclamation}
            alt="Exclamation Mark Symbol"
            style={{ marginRight: 10 }}
          />
          <div className="my-auto" style={{ color: "#777", fontSize: 18 }} 
                dangerouslySetInnerHTML={{
                  __html: t("backupYourWallet")
                }}
          >
          </div>
        </div>
        <div className="ml-auto mt-auto">
          <a href="#dismiss" onClick={dismiss} className="mt-auto">
            {t("dismissWarning")}
          </a>
        </div>
      </div>
    </Right>
  );
};

export default Warning;
