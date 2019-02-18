import React, { Component } from "react";
import { actions, connect } from "../store";
import WifiSettingsForm from "./WifiSettingsForm";
import { Alert, Progress } from "reactstrap";
import { withTranslation } from "react-i18next";

class Wifi extends Component {
  componentDidMount = () => {
    actions.getWifiSettings();
  };

  componentWillUnmount = () => {
    clearInterval(this.timer);
  };

  render() {
    let { t } = this.props;
    const {
      initializing,
      wifiError,
      loadingWifi,
      wifiSettings
    } = this.props.state;

    if (!wifiSettings)
      if (loadingWifi && !wifiError)
        return initializing ? (
          <Progress animated color="info" value={100} />
        ) : null;
      else return <Alert color="info">{t("noWifi")}</Alert>;

    return (
      <>
        {wifiSettings.map((settings, i) => (
          <WifiSettingsForm
            state={this.props.state}
            key={i}
            wifiSettings={settings}
          />
        ))}
      </>
    );
  }
}

export default connect([
  "initializing",
  "wifiError",
  "loadingWifi",
  "wifiSettings"
])(withTranslation()(Wifi));
