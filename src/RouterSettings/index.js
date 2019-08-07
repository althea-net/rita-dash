import React, { Component } from "react";
import Ports from "./Ports";
import Wifi from "./Wifi";
import { withTranslation } from "react-i18next";

class RouterSettings extends Component {
  render() {
    const { t } = this.props;

    return (
      <div id="router-settings-main">
        <h2 id="router-settings-title">{t("wifiAndPorts")}</h2>

        <Wifi />
        <div style={{ marginTop: 20 }}>
          <Ports />
        </div>
      </div>
    );
  }
}

export default withTranslation()(RouterSettings);
