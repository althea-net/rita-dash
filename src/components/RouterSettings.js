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
        <Wifi />
      </div>
    );
  }
}

export default translate()(RouterSettings);
