/* eslint-disable import/no-anonymous-default-export */
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Input } from "reactstrap";
import { get, post } from "store";
import "../styles/slider.css";

export default () => {
  let now = Date.now();
  let [t] = useTranslation();
  // the value we currently have and are displaying to the user
  let [factor, setFactor] = useState(null);
  // the value we last saw on the router
  let [routerFactor, setRouterFactor] = useState(null);
  // the last time we set the router factor
  let [lastSetTime, setLastSetTime] = useState(0);

  useEffect(() => {
    (async () => {
      try {
        let { metricFactor } = await get("/metric_factor");
        setFactor(metricFactor);
        setRouterFactor(metricFactor);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    try {
      // if the factor and router factor are not null
      // and the factor is different than what is on the router
      // and the last time we set the factor was more than a second ago
      // then you can finally go and make the request
      if (
        factor &&
        routerFactor &&
        factor !== routerFactor &&
        now - lastSetTime > 1000
      ) {
        post(`/metric_factor/${factor}`);
        setLastSetTime(now);
        setRouterFactor(factor);
      }
    } catch (e) {
      console.log("caught metric factor", e);
    }
  }, [factor, routerFactor, lastSetTime, now]);

  // handle the null case
  let display_factor = 0;
  if (factor) {
    display_factor = factor;
  }

  return (
    <>
      <p>{t("neighbours")}</p>
      <div className="d-flex">
        <div className="w-100">
          <Input
            type="range"
            id="priceQuality"
            min={0}
            max={6000}
            value={display_factor}
            onChange={e => setFactor(e.target.value)}
          />
          <div className="d-flex justify-content-between">
            <p style={{ maxWidth: 100, fontSize: 14 }}>
              <b>{t("preferLow")}</b>
            </p>
            <p style={{ maxWidth: 100, textAlign: "right", fontSize: 14 }}>
              <b>{t("preferHigh")}</b>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
