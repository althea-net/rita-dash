import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Card, CardBody, Input } from "reactstrap";
import { get, post, useDebounce } from "store";
import "../styles/slider.css";

export default () => {
  let [t] = useTranslation();
  let [factor, setFactor] = useState(0);

  useEffect(() => {
    (async () => {
      let { metricFactor } = await get("/metric_factor");
      setFactor(metricFactor);
    })();
  }, []);

  let debouncedFactor = useDebounce(factor, 500);
  useEffect(
    () => {
      post(`/metric_factor/${factor}`);
    },
    [debouncedFactor, factor]
  );

  return (
    <Card className="mb-4">
      <CardBody>
        <h3>{t("priceQuality")}</h3>
        <p>{t("neighbours")}</p>
        <div className="d-flex">
          <div className="w-100">
            <Input
              type="range"
              id="priceQuality"
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
