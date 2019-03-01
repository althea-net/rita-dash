import React, { useContext, useEffect, useState } from "react";
import { Button, Card, CardBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";
import { Context } from "store";
import { Error } from "utils";
import ExitListItem from "./ExitListItem";
import ExitNodeSetup from "./ExitNodeSetup";

export default () => {
  let [t] = useTranslation();
  let {
    actions,
    state: { exits, exitsError, initializing }
  } = useContext(Context);

  useEffect(() => {
    actions.getExits();
    let timer = setInterval(actions.getExits, 10000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  let [selectingExit, setSelectingExit] = useState(false);

  exits = exits || [];

  let selected = exits.find(exit => {
    let { state } = exit.exitSettings;
    return exit.isSelected && state === "Registered";
  });

  return (
    <Card>
      <CardBody>
        <h2>{t("exitNode")}</h2>
        <div>
          <p>{t("exitNodesP1")}</p>
          {selected ? (
            <>
              <ExitListItem
                exit={selected}
                click={() => setSelectingExit(true)}
              />
              <Button
                color="secondary"
                style={{ width: 240 }}
                onClick={() => setSelectingExit(true)}
              >
                {t("updateExit")}
              </Button>
            </>
          ) : (
            <div>
              <p>{t("exitNodesP2")}</p>
              <Button
                color="primary"
                style={{ width: 240 }}
                onClick={() => setSelectingExit(true)}
              >
                {t("setupExitNode")}
              </Button>
            </div>
          )}
          {selectingExit && (
            <ExitNodeSetup
              open={selectingExit}
              setOpen={setSelectingExit}
              exits={exits}
            />
          )}
        </div>
        <Error error={exitsError} />
        {!exits &&
          initializing && <Progress animated color="info" value="100" />}
      </CardBody>
    </Card>
  );
};
