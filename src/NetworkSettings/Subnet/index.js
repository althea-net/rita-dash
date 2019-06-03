import React, { useContext, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";

import Context, { store, Provider } from "./Context";

import SubnetInfo from "./SubnetInfo";
import SubnetSelection from "./SubnetSelection";

const Body = () => {
  const [t] = useTranslation();
  const [editing, setEditing] = useState(false);
  const { daoAddress, meshIp } = useContext(Context);

  return (
    <Card className="mb-4">
      <CardBody>
        <h3>{t("subnet")}</h3>
        {!editing && daoAddress && meshIp ? (
          <SubnetInfo setEditing={setEditing} />
        ) : (
          <SubnetSelection />
        )}
      </CardBody>
    </Card>
  );
};

const Subnet = () => (
  <Provider value={store}>
    <Body />
  </Provider>
);

export default Subnet;
