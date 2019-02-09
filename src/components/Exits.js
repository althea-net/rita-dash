import React, { useEffect } from "react";
import { Button, Card, CardBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";
import { actions, connect } from "../store";
import Error from "./Error";
import ExitListItem from "./ExitListItem";

export default connect(["initializing", "exits", "exitsError", "daoAddress"])(
  ({ state }) => {
    let [t] = useTranslation();
    useEffect(() => {
      actions.getExits();
      let timer = setInterval(actions.getExits, 10000);
      return () => clearInterval(timer);
    }, []);

    let { exits, exitsError, initializing, daoAddress } = state;

    exits = exits || [];
    let selected = exits.find(exit => {
      let { state } = exit.exitSettings;
      return exit.isSelected && state === "Registered";
    });

    return (
      <Card>
        <CardBody>
          <h2>{t("exitNode")}</h2>
          {daoAddress ? (
            <div>
              <p>{t("exitNodesP1")}</p>
              {selected ? (
                <ExitListItem exit={selected} />
              ) : (
                <div>
                  <p>{t("exitNodesP2")}</p>
                  <Button color="primary" style={{ width: 240 }}>
                    Setup Exit Node
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <p>{t("exitNodesSetup")}</p>
          )}
          <Error error={exitsError} />
          {!exits &&
            initializing && <Progress animated color="info" value="100" />}
        </CardBody>
      </Card>
    );
  }
);
