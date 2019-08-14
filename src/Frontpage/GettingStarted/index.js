import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Progress } from "reactstrap";
import { Card } from "../../ui";
import Backup from "../../Backup";
import Deposit from "../../Deposit";
import Password from "../../Password";
import { get, useStore } from "store";
import List from "./List";
import useNickname from "hooks/useNickname";
import useWifiSettings from "hooks/useWifiSettings";

const AbortController = window.AbortController;

export default () => {
  const [t] = useTranslation();
  const [backingUp, setBackingUp] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [depositing, setDepositing] = useState(false);
  const [settingPassword, setSettingPassword] = useState(false);

  const [
    { balance, backupCreated, selectedExit, nickname, wifiSettings },
    dispatch
  ] = useStore();

  const goBackup = () => setBackingUp(true);
  const goSettings = () => (window.location.href = "#settings");
  const goDeposit = () => setDepositing(true);
  const goPassword = () => setSettingPassword(true);
  const goWifi = () => (window.location.href = "#router-settings");

  const [loadingNickname] = useNickname();
  const [loadingWifiSettings] = useWifiSettings();

  useEffect(
    () => {
      setDismissed(
        window.sessionStorage.getItem("gettingStartedDismissed") === "true"
      );
    },
    [dismissed]
  );

  const dismiss = e => {
    e.preventDefault();
    window.sessionStorage.setItem("gettingStartedDismissed", true);
    setDismissed(true);
  };

  const isWifiPasswordSet = !!(
    wifiSettings && wifiSettings.findIndex(s => s.key === "ChangeMe") < 0
  );

  const isRouterPasswordSet =
    window.sessionStorage.getItem("Authorization") !== null;

  const steps = [
    { name: "backupWallet", completed: backupCreated, onClick: goBackup },
    {
      name: "setupExit",
      completed: selectedExit !== null,
      onClick: goSettings
    },
    { name: "addFunding", completed: balance > 0, onClick: goDeposit },
    { name: "setWifiPass", completed: isWifiPasswordSet, onClick: goWifi },
    { name: "setNickname", completed: nickname !== null, onClick: goSettings },
    {
      name: "setDashPass",
      completed: isRouterPasswordSet,
      onClick: goPassword
    }
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

  if (loadingNickname || loadingWifiSettings)
    return <Progress animated color="info" value="100" />;

  if (dismissed) return null;

  return (
    <Card>
      <Backup open={backingUp} setOpen={setBackingUp} />
      <Deposit open={depositing} setOpen={setDepositing} />
      <Password open={settingPassword} setOpen={setSettingPassword} />
      <div className="w-100 d-flex flex-wrap justify-content-between">
        <h4>{t("gettingStarted")}</h4>
        <div
          style={{ color: "#3DADF5", fontSize: 16 }}
          className="mb-1 ml-auto text-right"
        >
          <a href="#dismiss" onClick={dismiss}>
            {t("dismiss")}
          </a>
        </div>
      </div>

      <p>{t("completeSteps")}</p>
      <div className="d-flex flex-wrap flex-lg-nowrap">
        <List steps={steps.slice(0, 3)} />
        <List steps={steps.slice(3, 6)} />
      </div>
    </Card>
  );
};
