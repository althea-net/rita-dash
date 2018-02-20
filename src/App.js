import React, { Component } from "react";
import Frontpage from "./Frontpage.js";
import Payments from "./Payments.js";
import Neighbors from "./Neighbors.js";
import WiFiSettings from "./WiFiSettings.js";
import { Nav, Navbar, NavbarBrand, NavItem, NavLink } from "reactstrap";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hash: window.location.hash.substr(1)
    };
    this.onHashChange();
    window.addEventListener("hashchange", this.onHashChange, false);
  }

  onHashChange = () => {
    this.setState({
      hash: window.location.hash.substr(1)
    });
  };

  render() {
    return (
      <div className="App">
        <Navbar color="faded" light expabd="md">
          <NavbarBrand href="/"> Althea</NavbarBrand>
          <Nav>
            <NavItem>
              <NavLink href="/#wifi-settings">WiFi Settings</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/#payments">Payments</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="/#neighbors">Neighbors</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 750
            }}
          >
            <Page hash={this.state.hash} />
          </div>
        </div>
      </div>
    );
  }
}

function Page({ hash, changePage }) {
  switch (hash) {
    case "wifi-settings":
      return <WiFiSettings />;
    case "payments":
      return <Payments />;
    case "neighbors":
      return <Neighbors />;
    default:
      return <Frontpage changePage={changePage} />;
  }
}

export default App;
