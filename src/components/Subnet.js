import React, { useContext, useState, Fragment } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";

import { Context } from "../store";

import SubnetInfo from "./SubnetInfo";
import SubnetSelection from "./SubnetSelection";

export default () => {
  const [t] = useTranslation();
  const [editing, setEditing] = useState(false);
  const {
    state: { daoAddress, meshIp }
  } = useContext(Context);

  return (
    <Fragment>
      <Card className="mb-4">
        <CardBody>
          <h2>{t("subnet")}</h2>
          {!editing && daoAddress && meshIp ? (
            <SubnetInfo setEditing={setEditing} />
          ) : (
            <SubnetSelection />
          )}
        </CardBody>
      </Card>
    </Fragment>
  );
};
