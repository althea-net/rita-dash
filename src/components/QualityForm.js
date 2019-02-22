import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Card, CardBody, Form, Input } from "reactstrap";
import { get, post, init, useDebounce } from "../store/fetch";
import "../styles/slider.css";

export default () => {
  let [t] = useTranslation();
  let [factor, setFactor] = useState(0);

  init(async () => {
    let { metricFactor } = await get("/metric_factor");
    setFactor(metricFactor);
  });

  let debouncedFactor = useDebounce(factor, 500);
  useEffect(
    () => {
      post(`/metric_factor/${factor}`);
    },
    [debouncedFactor]
  );

  return (
    <Card className="mb-4">
      <CardBody>
        <h3>{t("priceQuality")}</h3>
        <p>
          Assuming you have more than one "neighbor node", these settings
          control which neighbor your router connects with.
        </p>
        <div className="d-flex">
          <div className="w-50">
            <Input
              type="range"
              min={0}
              max={6000}
              value={factor}
              onChange={e => setFactor(e.target.value)}
            />
            <div className="d-flex justify-content-between">
              <b>{t("preferLow")}</b>
              <b>{t("preferHigh")}</b>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
};
