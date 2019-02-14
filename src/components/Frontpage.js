import React from "react";
import { useTranslation } from "react-i18next";
import { connect } from "../store";
import { Progress } from "reactstrap";

import Error from "./Error";
import Finances from "./Finances";
import UsageMetrics from "./UsageMetrics";
import NetworkConnection from "./NetworkConnection";
import NodeInformation from "./NodeInformation";

export default connect(["error", "loading", "info", "settings"])(
  ({ state: { error, loading, info, settings } }) => {
    let [t] = useTranslation();
    let { address, ritaVersion, version } = info;

    return (
      <div id="front-page-main">
        <h1>{t("welcome")}</h1>

        {error ? (
          <Error error={error} />
        ) : loading ? (
          <Progress animated color="info" value="100" />
        ) : (
          <div>
            <p>{t("version", { version, ritaVersion })}</p>

            <Finances />
            <UsageMetrics />
            <NetworkConnection />
            <NodeInformation address={address} settings={settings} t={t} />
          </div>
        )}
      </div>
    );
  }
);
