import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody } from "reactstrap";

const DebuggingData = () => {
  const [t] = useTranslation();

  return (
    <Card className="mb-4 col-12 col-lg-6 card-small">
      <CardBody>
        <h4>{t("debuggingData")}</h4>
        <p>{t("snapshot")}</p>
        <Button href="#endpoints">{t("viewResults")}</Button>
      </CardBody>
    </Card>
  );
};

export default DebuggingData;
