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

    window.addEventListener("hashchange", this.onHashChange, false);
  }

  onHashChange = () =>
    this.props.store.setters.changePage(window.location.hash.substr(1));

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
              maxWidth: 750,
              padding: 10
            }}
          >
            <Page store={this.props.store} />
          </div>
        </div>
      </div>
    );
  }
}

function Page({ store }) {
  switch (store.state.page) {
    case "wifi-settings":
      return <WiFiSettings />;
    case "payments":
      return <Payments />;
    case "neighbors":
      return <Neighbors />;
    default:
      return <Frontpage changePage={store.setters.changePage} />;
  }
}

export default App;
