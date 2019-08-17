import React from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody } from "reactstrap";

const BandwidthSelling = () => {
  const [t] = useTranslation();

  return (
    <Card className="mb-4 col-md-6 mr-2">
      <CardBody>
        <h4>{t("bandwidthSelling")}</h4>
      </CardBody>
    </Card>
  );
};

export default BandwidthSelling;
