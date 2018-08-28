import React, { Component } from "react";
import Exits from "./Exits";
import DaoSelection from "./DaoSelection";
import { Card, TabContent, TabPane, Nav, NavItem, NavLink } from "reactstrap";
import classnames from "classnames";

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
    return (
      <div>
        <h1>Network Settings</h1>
        <Nav tabs>
          <NavItem>
            <NavLink
              style={{ cursor: "pointer" }}
              className={classnames({ active: this.state.activeTab === "1" })}
              onClick={() => {
                this.toggle("1");
              }}
            >
              Exits
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
              Subnet DAO(s)
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Card style={{ padding: 10, borderTop: "none" }}>
              <p>
                Exit nodes are like a combination of a VPN and a speedtest
                server. They keep your browsing history private and make sure
                that your traffic is always routed through the fastest path in
                the network at a given price.
              </p>
              <p>
                Exit nodes need to collect a bit of information about you (your
                email address), and you need to select an exit node in your
                region. Althea runs some exit nodes, but in the future you will
                be able to select exits from other companies if you prefer.
              </p>
              <Exits />
            </Card>
          </TabPane>
          <TabPane tabId="2">
            <Card style={{ padding: 10, borderTop: "none" }}>
              <DaoSelection />
            </Card>
          </TabPane>
        </TabContent>
      </div>
    );
  }
}

export default NetworkSettings;
