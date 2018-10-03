import React, { Component } from "react";
import { actions, connect } from "../store";
import WifiSettingsForm from "./WifiSettingsForm";
import styled from "styled-components";
import { Alert, Progress } from "reactstrap";

const WifiContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 10;
  margin: -20;
`;

class Wifi extends Component {
  componentDidMount = () => {
    actions.getWifiSettings();
    this.timer = setInterval(actions.getWifiSettings, 5000);
  };

  componentWillUnmount = () => {
    clearInterval(this.timer);
  };

  render() {
    const { wifiError, loading, wifiSettings } = this.props.state;
    if (!wifiSettings)
      if (loading && !wifiError)
        return <Progress animated color="info" value={100} />;
      else
        return (
          <Alert color="info">
            No Wifi settings found, the device may not support Wifi
          </Alert>
        );

    return (
      <React.Fragment>
        <h2>Wifi</h2>
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

export default connect(["wifiError", "loading", "wifiSettings"])(Wifi);
