import React, { Component } from "react";
import Exits from "./Exits";
import DaoSelection from "./DaoSelection";
import { Card, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";
import { connect } from "../store";

class NetworkSettings extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      activeTab: "1"
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab
      });
    }
  }

  render() {
    let { t } = this.props.state;

    return (
      <div>
        <h1>{t("networkSettings")}</h1>
        <Nav tabs>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              {t("exits")}
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({ active: this.state.activeTab === "2" })}
              onClick={() => {
                this.toggle("2");
              }}
            >
              {t("subnetDaos")}
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Card style={{ padding: 10, borderTop: "none" }}>
              <p>{t("exitNodesP1")}</p>
              <p>{t("exitNodesP2")}</p>
              <Exits t={t} />
            </Card>
          </TabPane>
          <TabPane tabId="2">
            <Card style={{ padding: 10, borderTop: "none" }}>
              <DaoSelection t={t} />
            </Card>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default connect(["t"])(NetworkSettings);
