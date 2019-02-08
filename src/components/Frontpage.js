import React, { Component } from "react";
import { connect } from "../store";
import { Progress } from "reactstrap";
import Error from "./Error";
import { withTranslation } from "react-i18next";
import Finances from "./Finances";
import UsageMetrics from "./UsageMetrics";
import NetworkConnection from "./NetworkConnection";
import NodeInformation from "./NodeInformation";

class FrontPage extends Component {
  render() {
    let { error, loading, info, settings } = this.props.state;
    let { address, ritaVersion, version } = info;
    let { t } = this.props;

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
}

export default connect(["error", "loading", "info", "settings"])(
  withTranslation()(FrontPage)
);
