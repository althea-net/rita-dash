import React from "react";
import { useTranslation } from "react-i18next";
import { useStore } from "store";

import greencheck from "../images/greencheck.svg";
import redx from "../images/redx.svg";
import yellowexclamation from "../images/yellowexclamation.svg";

const ConnectionStatus = () => {
  const [t] = useTranslation();
  const [{ connectionStatus }] = useStore();

  const state = {
    connected: {
      msg: t("currentlyConnected"),
      color: "text-success",
      icon: greencheck,
      link: false
    },
    noConnection: {
      msg: t("noConnectionDetected"),
      color: "text-danger",
      icon: redx,
      link: true
    },
    connectionTrouble: {
      msg: t("connectionTrouble"),
      color: "text-warning",
      icon: yellowexclamation,
      link: true
    }
  }[connectionStatus];

  const help = e => {
    e.preventDefault();
    window.location.href =
      "https://discordapp.com/channels/477147257251299350/482001608238956545";
  };

  const setupExit = () => {
    window.location.href = "#settings";
    let scroll = () => {
      let el = document.getElementById("exits");
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else setTimeout(scroll, 100);
    };
    scroll();
  };

  if (!state) return null;

  return (
    <div
      className={`d-flex flex-wrap d-sm-block ml-sm-auto my-auto ${
        state.color
      }`}
    >
      <div>
        <img src={state.icon} alt={state.msg} className="mr-1" />
        {connectionStatus === "noConnection" ? (
          <>
            <span>{t("noConnectionDetected")}.</span>{" "}
            <span>{t("youNeedTo")}</span>
            <a href="#settings" onClick={setupExit}>
              {t("setupYourExit")}
            </a>
          </>
        ) : (
          state.msg
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
