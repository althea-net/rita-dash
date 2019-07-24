import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { CustomInput, Label } from "reactstrap";
import { Card } from "../ui";

const List = ({ steps }) => {
  const [t] = useTranslation();

  return (
    <ul>
      {steps.map(step => (
        <li style={{ listStyle: "none" }} className="d-flex">
          <CustomInput
            type="checkbox"
            id={step.name}
            name={step.name}
            checked={step.completed}
            readonly
          />
          <Label
            for={step.name}
            style={{
              color: "#6C757D",
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
  const [dismissed, setDismissed] = useState(false);
  const steps = [
    { name: "backupWallet", completed: false },
    { name: "setupExit", completed: false },
    { name: "addFunding", completed: false },
    { name: "setWifiPass", completed: false },
    { name: "setDashPass", completed: false },
    { name: "setNickname", completed: false }
  ];

  const dismiss = e => {
    e.preventDefault();
    setDismissed(true);
  };

  if (dismissed) return null;

  return (
    <Card>
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
