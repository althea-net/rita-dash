import React, { Component } from "react";
import Ports from "./Ports";
import Wifi from "./Wifi";
import { translate } from "react-i18next";

class RouterSettings extends Component {
  render() {
    const { t } = this.props;

    return (
      <div id="router-settings-main">
        <h1 id="router-settings-title">{t("routerSettings")}</h1>

        <Wifi />
        <div style={{ marginTop: 20 }}>
          <Ports />
        </div>
      </div>
    );
  }
}

export default translate()(RouterSettings);
