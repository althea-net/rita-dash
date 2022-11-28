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
  const [{ isGateway, exits, selectedExit }, dispatch] = useStore();

  const getExits = useCallback(
    async (signal) => {
      try {
        let exits = await get("/exits", true, 10000, signal);
        if (exits instanceof Error) return;
        dispatch({ type: "exits", exits });
      } catch (e) {}
    },
    [dispatch]
  );
  let exit = exits.filter((n) => n.is_selected).length > 0;

  let haveRoute = exit.length > 0 ? exit[0].have_route : false;

  let isReachable = exit.length > 0 ? exit[0].is_reachable : false;

  let isTunnelWorking = exit.length > 0 ? exit[0].is_tunnel_working : false;

  if (selectedExit) {
    ({ haveRoute, isReachable, isTunnelWorking } = selectedExit);
  }

  let indicators = {
    haveRoute,
    isReachable,
    isTunnelWorking,
  };

  const haveProblem = Object.values(indicators).findIndex((v) => !v) >= 0;

  useInterval(getExits, 10000);

  return (
    <Card>
      <div className="col-12 px-0">
        <h4>{t("advancedDebugging")}</h4>
      </div>
      <div>
        {Object.keys(indicators).map((indicator) => (
          <div className="mb-2" key={indicator}>
            <Indicator condition={indicators[indicator]} />
            {t(indicator)}
          </div>
        ))}
      </div>
      {!isGateway && haveProblem && (
        <div className="mt-4 col-12">
          <h5>{t("suggestedAction")}</h5>
          {selectedExit ? <p>{t("exitProblem")}</p> : <p>{t("noExit")}</p>}
        </div>
      )}
    </Card>
  );
};
export default AdvancedDebugging;
