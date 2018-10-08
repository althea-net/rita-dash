import React, { Component } from "react";
import Ports from "./Ports";
import Wifi from "./Wifi";
import { translate } from "react-i18next";

class RouterSettings extends Component {
  render() {
    const { t } = this.props;

    return (
      <div>
        <h1>{t("routerSettings")}</h1>

        <Ports />
        <div style={{ marginTop: 20 }}>
          <Wifi />
        </div>
      </div>
    );
  }
}

export default translate()(RouterSettings);
