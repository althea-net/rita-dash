import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomInput, Label } from "reactstrap";
import { Card } from "../ui";
import Backup from "../Backup";
import Deposit from "../Deposit";
import { get, useStore } from "store";

const List = ({ steps }) => {
  const [t] = useTranslation();

  return (
    <ul>
      {steps.map(step => (
        <li style={{ listStyle: "none" }} className="d-flex" key={step.name}>
          <CustomInput
            type="checkbox"
            id={step.name}
            name={step.name}
            checked={step.completed}
            readOnly
            onClick={step.onClick}
          />
          <Label
            for={step.name}
            style={{
              color: "#6C757D",
              cursor: "pointer",
              textDecoration: "underline"
            }}
          >
            {t(step.name)}
          </Label>
        </li>
      ))}
    </ul>
  );
};

export default () => {
  const [t] = useTranslation();
  const [backingUp, setBackingUp] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [depositing, setDepositing] = useState(false);

  const [{ balance, backupCreated, exitSelected }, dispatch] = useStore();

  const backup = () => setBackingUp(true);
  const selectExit = () => (window.location.href = "#settings");
  const deposit = () => setDepositing(true);

  const dismiss = e => {
    e.preventDefault();
    setDismissed(true);
  };

  if (dismissed) return null;

  const steps = [
    { name: "backupWallet", completed: backupCreated, onClick: backup },
    { name: "setupExit", completed: exitSelected, onClick: selectExit },
    { name: "addFunding", completed: balance > 0, onClick: deposit },
    { name: "setWifiPass", completed: false },
    { name: "setDashPass", completed: false },
    { name: "setNickname", completed: false }
  ];

  useEffect(
    () => {
      (async () => {
        try {
          let { backupCreated } = await get("/backup_created");
          if (!(backupCreated instanceof Error)) {
            backupCreated = backupCreated === "true";
            dispatch({ type: "backupCreated", backupCreated });
          }
        } catch (e) {
          console.log(e);
        }
      })();
      return;
    },
    [dispatch]
  );

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
