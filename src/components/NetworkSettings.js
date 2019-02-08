import React, { Component } from "react";
import Exits from "./Exits";
import DaoSelection from "./DaoSelection";
import { Card, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import { withTranslation } from "react-i18next";

class NetworkSettings extends Component {
  state = {
    activeTab: "1"
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  };

  render() {
    let { t } = this.props;

    return (
      <div>
        <h1>{t("networkConnection")}</h1>
        <DaoSelection />
        <Exits />
      </div>
    );
  }
}

export default withTranslation()(NetworkSettings);
