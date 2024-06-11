import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, Heading } from "ui";
import { get } from "store";
import greencheck from "../../images/greencheck.svg";
import redx from "../../images/redx.svg";

const Indicator = ({ condition }) => (
    <img
      src={condition ? greencheck : redx}
      alt={condition ? "checkmark" : "x symbol"}
      className="mr-1"
    />
  );

// This page monitors the startup status of the exit TODO
// expand to monitor the online status rather than just the startup status
const StartupStatus = () => {
  const [t] = useTranslation();
  const [exitStartupStatus, setExitStartupStatus] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    (async () => {
      try {
        let exitStartupStatus = await get("/startup_status");
        if (!(exitStartupStatus instanceof Error))
          setExitStartupStatus(exitStartupStatus);
      } catch (e) {}
    })();

    return () => controller.abort();
  });

  let startupStatusDisplay;
  if (exitStartupStatus) {
    startupStatusDisplay = <>{Indicator(false)}{exitStartupStatus}</>
  } else {
    startupStatusDisplay = <>{Indicator(true)}{t("running")}</>;
  }

  return (
    <Card>
      <Heading title={t("ExitStartup")} />

      <div
        className="d-flex flex-wrap flex-md-nowrap w-100"
        style={{ marginTop: -10 }}
      >
        {startupStatusDisplay}
      </div>
    </Card>
  );
};

export default StartupStatus;
