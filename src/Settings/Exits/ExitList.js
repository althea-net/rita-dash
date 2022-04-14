import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Alert, Button, ListGroup } from "reactstrap";
import AddExit from "./AddExit";
import ExitListItem from "./ExitListItem";
import { useStore } from "store";

const ExitList = ({ setOpen, select }) => {
  const [t] = useTranslation();
  const [adding, setAdding] = useState(false);
  let [{ blockchain, exits }] = useStore();

  const sort = (a, b) => {
    a.nickname.localeCompare(b.nickname, undefined, {
      sensitivity: "base"
    });
  };

  const addExit = () => setAdding(true);

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
      {adding ? (
        <AddExit setAdding={setAdding} />
      ) : exits.length ? (
        <>
          <p>{t("selectNode")}</p>
          <ListGroup>
            {exits.map(exit => (
              <ExitListItem
                exit={exit}
                key={exit.nickname}
                click={() => select(exit)}
              />
            ))}
          </ListGroup>
          <Button color="primary" onClick={addExit}>
            {t("addExit")}
          </Button>
        </>
      ) : (
        <>
          <Alert color="danger">{t("noExits")}</Alert>
          <Button color="primary" onClick={addExit}>
            {t("addExit")}
          </Button>
        </>
      )}
    </div>
  );
};

export default ExitList;
