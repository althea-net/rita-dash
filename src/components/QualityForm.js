import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, Form, Input } from "reactstrap";
import { actions, connect } from "../store";
import "../styles/slider.css";

export default connect(["factor"])(({ state: { factor } }) => {
  useEffect(() => actions.getFactor());

  let [t] = useTranslation();
  let [localFactor, setFactor] = useState(3000);

  let onSubmit = () => {
    actions.setFactor(localFactor);
  };

  return (
    <Card className="mb-4">
      <CardBody>
        <h3>{t("priceQuality")}</h3>
        <p>
          Assuming you have more than one "neighbor node", these settings
          control which neighbor your router connects with.
        </p>

        <Form onSubmit={onSubmit}>
          <div className="d-flex">
            <div className="w-50">
              <Input
                type="range"
                min={0}
                max={6000}
                value={localFactor}
                onChange={e => setFactor(e.target.value)}
              />
              <div className="d-flex justify-content-between">
                <b>{t("preferLow")}</b>
                <b>{t("preferHigh")}</b>
              </div>
            </div>
            <div>
              <Button color="primary" className="ml-2" style={{ width: 100 }}>
                {t("save")}
              </Button>
            </div>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
});
