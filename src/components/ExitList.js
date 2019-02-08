import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ListGroup } from "reactstrap";
import ExitListItem from "./ExitListItem";

export default ({ exits }) => {
  let [t] = useTranslation();

  let selected;
  let item = (exit, i) => {
    return <ExitListItem exit={exit} key={exit.nickname} t={t} />;
  };

  let unselected = exits
    .filter(exit => {
      if (!exit.exitSettings) return false;

      let { state } = exit.exitSettings;
      if (exit.isSelected && state === "Registered") {
        selected = exit;
        return false;
      }

      if (state === "Disabled" || state === "New") {
        return false;
      }

      return true;
    })
    .map((exit, i) => item(exit, i));

  return (
    <div>
      {selected && (
        <div>
          <h2>{t("selectedExit")}</h2>
          <ListGroup>{item(selected, 0)}</ListGroup>
        </div>
      )}
      <h2>{t("availableExits")}</h2>
      {unselected.length ? (
        <ListGroup>{unselected}</ListGroup>
      ) : (
        <Alert color="danger">{t("noExits")}</Alert>
      )}
    </div>
  );
};
