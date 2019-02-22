import React, { useState } from "react";
import { useTranslation } from "react-i18next";

export default (connected, exit) => {
  let [t] = useTranslation();
  let [show, setShow] = useState(false);
  let { exitSettings, isReachable, haveRoute, isTunnelWorking } = exit;

  if (!exitSettings) return null;
  let { state } = exitSettings;

  let reachable = isReachable.toString();
  let route = haveRoute.toString();
  let tunnel = isTunnelWorking.toString();

  return (
    connected || (
      <div style={{ marginTop: 5, marginBottom: 5 }}>
        {t("unableToReachExit")}
        <a href="#debug" onClick={setShow(true)}>
          {t("debuggingMessage", { show: show ? "Hide" : "View" })}
        </a>
        {show && (
          <pre style={{ background: "#ddd", padding: "10px" }}>
            {t("debugState", { state })}
            <br />
            {t("debugReachable", { reachable })}
            <br />
            {t("debugRoute", { route })}
            <br />
            {t("debugTunnel", { tunnel })}
          </pre>
        )}
      </div>
    )
  );
};
