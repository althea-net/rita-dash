import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ListGroup } from "reactstrap";
import ExitListItem from "./ExitListItem";

export default ({ exits, setExit }) => {
  let [t] = useTranslation();

  return (
    <div>
      {exits.length ? (
        <ListGroup>
          {exits.map(exit => (
            <ExitListItem exit={exit} key={exit.nickname} setExit={setExit} />
          ))}
        </ListGroup>
      ) : (
        <Alert color="danger">{t("noExits")}</Alert>
      )}
    </div>
  );
};
