import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Progress } from "reactstrap";
import { Card } from "../../ui";
import Backup from "../../Backup";
import Deposit from "../../Deposit";
import { get, useStore } from "store";
import List from "./List";
import useWifiSettings from "hooks/useWifiSettings";

const AbortController = window.AbortController;

export default () => {
  const [t] = useTranslation();
  const [backingUp, setBackingUp] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const [
    { balance, backupCreated, exitSelected, wifiSettings },
    dispatch
  ] = useStore();

  const backup = () => setBackingUp(true);
  const selectExit = () => (window.location.href = "#settings");
  const deposit = () => setDepositing(true);
  const setWifiPass = () => (window.location.href = "#router-settings");

  const [loadingWifiSettings] = useWifiSettings();

  const dismiss = e => {
    e.preventDefault();
    setDismissed(true);
  };

  const isWifiPasswordSet = !!(
    wifiSettings && wifiSettings.findIndex(s => s.key === "ChangeMe") < 0
  );

  if (dismissed) return null;

  const steps = [
    { name: "backupWallet", completed: backupCreated, onClick: backup },
    { name: "setupExit", completed: exitSelected, onClick: selectExit },
    { name: "addFunding", completed: balance > 0, onClick: deposit },
    { name: "setWifiPass", completed: isWifiPasswordSet, onClick: setWifiPass },
    { name: "setDashPass", completed: false, onClick: backup },
    { name: "setNickname", completed: false, onClick: backup }
  ];

  useEffect(
    () => {
      const controller = new AbortController();
      const signal = controller.signal;
      (async () => {
        try {
          let { backupCreated } = await get(
            "/backup_created",
            true,
            5000,
            signal
          );
          if (!(backupCreated instanceof Error)) {
            backupCreated = backupCreated === "true";
            dispatch({ type: "backupCreated", backupCreated });
          }
        } catch {}
      })();
      return () => {
        controller.abort();
      };
    },
    [dispatch]
  );

  if (loadingWifiSettings)
    return <Progress animated color="info" value="100" />;

  return (
    <Card>
      <Backup open={backingUp} setOpen={setBackingUp} />
      <Deposit open={depositing} setOpen={setDepositing} />
      <div className="w-100 d-flex flex-wrap justify-content-between">
        <h2>{t("gettingStarted")}</h2>
        <div
          style={{ color: "#3DADF5" }}
          className="my-auto ml-auto text-right"
        >
          <a href="#dismiss" onClick={dismiss}>
            {t("dismiss")}
          </a>
        </div>
      </div>

      <p>{t("completeSteps")}</p>
      <div className="d-flex">
        <List steps={steps.slice(0, 3)} />
        <List steps={steps.slice(3, 6)} />
      </div>
    </Card>
  );
};
