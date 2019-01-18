import React, { Component } from "react";
import { actions, connect } from "../store";
import WifiSettingsForm from "./WifiSettingsForm";
import styled from "styled-components";
import { Alert, Progress } from "reactstrap";
import { translate } from "react-i18next";

const WifiContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10;
  margin: -20;
`;

class Wifi extends Component {
  componentDidMount = () => {
    console.log("huh why no mount");
    actions.getWifiSettings();
    this.timer = setInterval(actions.getWifiSettings, 10000);
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
      <React.Fragment>
        <h2>{t("wifi")}</h2>
        <WifiContainer>
          {wifiSettings.map((settings, i) => (
            <WifiSettingsForm
              state={this.props.state}
              key={i}
              wifiSettings={settings}
            />
          ))}
        </WifiContainer>
      </React.Fragment>
    );
  }
}

export default connect([
  "initializing",
  "wifiError",
  "loadingWifi",
  "wifiSettings"
])(translate()(Wifi));
