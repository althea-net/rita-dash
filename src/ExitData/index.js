import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card } from "ui";
import { get } from "store";
import ExitMode from "./ExitMode";

const ExitData = () => {
  const [t] = useTranslation();
  const [exitInfo, setExitInfo] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;
    (async () => {
      try {
        const exitInfo = await get("/get_exit_network", true, 10000, signal);
        if (exitInfo instanceof Error) return;
        setExitInfo(exitInfo);
      } catch (e) {
        console.log(e);
      }
    })();
  }, []);

  return (
    <>
      <h2>{t("Exit Info")}</h2>

      <Card>
        <ExitMode exitInfo={exitInfo} />
      </Card>
    </>
  );
};

export default ExitData;
