import React, { useCallback } from "react";
import { useTranslation } from "react-i18next";

import { Card } from "ui";
import { get, useStore } from "store";
import useInterval from "hooks/useInterval";

import greencheck from "../images/greencheck.svg";
import redx from "../images/redx.svg";

const Indicator = ({ condition }) => (
  <img
    src={condition ? greencheck : redx}
    alt={condition ? "checkmark" : "x symbol"}
    className="mr-1"
  />
);

const AdvancedDebugging = () => {
  const [t] = useTranslation();
  const [{ isGateway, neighbors, selectedExit }, dispatch] = useStore();

  const getNeighbors = useCallback(
    async signal => {
      try {
        let neighbors = await get("/neighbors", true, 10000, signal);
        if (neighbors instanceof Error) return;
        dispatch({ type: "neighbors", neighbors });
      } catch (e) {}
    },
    [dispatch]
  );

  let [haveRoute, isReachable, isTunnelWorking] = [false, false, false];

  if (selectedExit) {
    ({ haveRoute, isReachable, isTunnelWorking } = selectedExit);
  }

  let hasNeighborRoute =
    neighbors.filter(n => n.routeMetric < 65000).length > 0;

  let hasExitRoute =
    neighbors.filter(n => n.routeMetricToExit < 65000).length > 0;

  let indicators = {
    haveRoute,
    isReachable,
    isTunnelWorking
  };

  if (!isGateway)
    indicators = {
      hasNeighborRoute,
      hasExitRoute,
      ...indicators
    };

  useInterval(getNeighbors, 10000);

  return (
    <Card>
      <div className="col-12 px-0">
        <h4>{t("advancedDebugging")}</h4>
      </div>
      <div>
        {Object.keys(indicators).map(indicator => (
          <div className="mb-2" key={indicator}>
            <Indicator condition={indicators[indicator]} />
            {t(indicator)}
          </div>
        ))}
      </div>
      {!isGateway &&
        (Object.values(indicators).findIndex(v => !v) >= 0 && (
          <div className="mt-4 col-12">
            <h5>{t("suggestedAction")}</h5>
            {hasNeighborRoute ? (
              hasExitRoute ? (
                <p>{t("exitProblem")}</p>
              ) : (
                <p>{t("noNeighborExit")}</p>
              )
            ) : (
              <p>{t("noNeighbor")}</p>
            )}
          </div>
        ))}
    </Card>
  );
};

export default AdvancedDebugging;
