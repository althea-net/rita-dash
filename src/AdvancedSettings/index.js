import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";

import Blockchain from "./Blockchain";
import DaoFee from "./DaoFee";
import Notifications from "./Notifications";
import Firmware from "./Firmware";

export default () => {
  let [t] = useTranslation();

  return (
    <div>
      <h1 id="advancedPage">{t("advancedSettings")}</h1>

      <Notifications />
      <Blockchain />
      <DaoFee />
      <Firmware />
      <Card className="mb-4">
        <CardBody>
          <h3>{t("debuggingData")}</h3>
          <p>{t("snapshot")}</p>
          <Button href="#endpoints">{t("viewResults")}</Button>
        </CardBody>
      </Card>
    </div>
  );
};
