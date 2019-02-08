import React, { useEffect } from "react";
import { Card, CardBody, Progress } from "reactstrap";
import { useTranslation } from "react-i18next";
import { actions, connect } from "../store";
import Error from "./Error";
import ExitList from "./ExitList";

export default connect(["initializing", "exits", "exitsError"])(({ state }) => {
  let [t] = useTranslation();
  useEffect(() => {
    actions.getExits();
    let timer = setInterval(actions.getExits, 10000);
    return () => clearInterval(timer);
  }, []);

  let { exits, exitsError, initializing } = state;

  return (
    <Card>
      <CardBody>
        <h2>{t("exitNode")}</h2>
        <p>{t("exitNodesP1")}</p>
        <Error error={exitsError} />
        {!exits &&
          initializing && <Progress animated color="info" value="100" />}
        {exits && <ExitList exits={exits} />}
      </CardBody>
    </Card>
  );
});
