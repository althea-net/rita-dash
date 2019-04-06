import React from "react";
import { useTranslation } from "react-i18next";
import { Alert, ListGroup } from "reactstrap";
import ExitListItem from "./ExitListItem";

const ExitList = ({ exits, selectExit }) => {
  const [t] = useTranslation();

  return (
    <div>
      {exits.length ? (
        <ListGroup>
          {exits.map(exit => (
            <ExitListItem
              exit={exit}
              key={exit.nickname}
              click={() => selectExit(exit)}
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
