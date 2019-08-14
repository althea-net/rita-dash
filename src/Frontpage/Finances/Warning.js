import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "store";
import exclamation from "images/exclamation.svg";
import Backup from "../../Backup";

const Warning = () => {
  const [t] = useTranslation();
  const [{ backupCreated }] = useStore();
  const [backingUp, setBackingUp] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const dismiss = e => {
    e.preventDefault();
    setDismissed(true);
  };

  const backup = () => setBackingUp(true);

  if (backupCreated || dismissed) return null;

  return (
    <div
      className="d-flex flex-column mx-auto my-auto pb-2"
      style={{ marginTop: 30 }}
    >
      <Backup open={backingUp} setOpen={setBackingUp} />
      <div className="d-flex w-100 justify-content-around">
        <img
          src={exclamation}
          alt="Exclamation Mark Symbol"
          style={{ marginRight: 10 }}
        />
        <div
          onClick={backup}
          className="my-auto"
          style={{ color: "#777", fontSize: 18, cursor: "pointer" }}
          dangerouslySetInnerHTML={{
            __html: t("backupYourWallet")
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

export default Warning;
