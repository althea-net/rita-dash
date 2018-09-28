import React, { Component } from "react";
import { Progress } from "reactstrap";
import { actions, connect } from "../store";
import "./RouterSettings.css";
import Error from "./Error";
import Ports from "./Ports";
import WifiSettingsForm from "./WifiSettingsForm";
import { translate } from "react-i18next";

class RouterSettings extends Component {
  componentDidMount() {
    actions.getWifiSettings();
  }

  render() {
    const { error, loading, wifiSettings } = this.props.state;
    const { t } = this.props;

    return (
      <div>
        <h1>{t("routerSettings")}</h1>

        {error ? (
          <Error error={error} />
        ) : (
          loading && <Progress animated color="info" value="100" />
        )}
        <h2>Wifi</h2>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            padding: 10,
            margin: -20
          }}
        >
          {!error &&
            wifiSettings &&
            wifiSettings.map((settings, i) => (
              <WifiSettingsForm
                state={this.props.state}
                key={i}
                wifiSettings={settings}
              />
            ))}
        </div>

        <Ports />
      </div>
    );
  }
}

export default connect(["error", "loading", "success", "wifiSettings"])(
  translate()(RouterSettings)
);
