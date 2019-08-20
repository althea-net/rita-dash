import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";

const DebuggingData = () => {
  const [t] = useTranslation();

  return (
    <Card className="mb-4" style={{ width: "calc(1/2*100% - (1 - 1/2)*20px)" }}>
      <CardBody>
        <h4>{t("debuggingData")}</h4>
        <p>{t("snapshot")}</p>
        <Button href="#endpoints">{t("viewResults")}</Button>
      </CardBody>
    </Card>
  );
};

export default DebuggingData;
