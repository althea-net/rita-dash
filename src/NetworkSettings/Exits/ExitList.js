import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ListGroup } from "reactstrap";
import ExitListItem from "./ExitListItem";
import { useStore } from "store";

const ExitList = ({ setOpen, select }) => {
  const [t] = useTranslation();
  let [{ blockchain, exits }] = useStore();

  const sort = (a, b) => {
    a.nickname.localeCompare(b.nickname, undefined, {
      sensitivity: "base"
    });
  };

  exits = exits
    .filter(exit => {
      const {
        exitSettings: { state }
      } = exit;
      return (
        (state !== "New" &&
          state !== "Disabled" &&
          (exit.exitSettings.generalDetails &&
            exit.exitSettings.generalDetails.exitCurrency === blockchain)) ||
        state === "Denied"
      );
    })
    .sort(sort);

  return (
    <div>
      {exits.length ? (
        <ListGroup>
          {exits.map(exit => (
            <ExitListItem
              exit={exit}
              key={exit.nickname}
              click={() => select(exit)}
            />
          ))}
        </ListGroup>
      ) : (
        <Alert color="danger">{t("noExits")}</Alert>
      )}
    </div>
  );
};

export default ExitList;
